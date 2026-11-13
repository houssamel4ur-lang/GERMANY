/* Deutsch Partner: offline German microphone + turn-based voice conversation.
 * Whisper speech-to-text, Ollama German tutor, Piper German voice.
 * Uses only the user's localhost backend; no commercial real-time speech API.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const start=$("startLive"),finish=$("finishLiveTurn"),end=$("endLive"),test=$("voiceTest");
const indicator=$("liveStatus"),output=$("liveOutput"),capabilities=$("voiceCapabilities"),badge=$("connectionBadge");
if(!start||!finish||!end||!test||!indicator||!output||!badge)return;
const base=String(window.DEUTSCH_AI_CONFIG?.apiBase||"").trim().replace(/\/+$/,"");
const validBase=/^https:\/\/|^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(base);
let active=false,busy=false,stream=null,recorder=null,parts=[],ctx=null,micSource=null,analyser=null;
let timer=null,controller=null,mediaURL=null,playbackResolve=null,sessionStarted=0,listenStarted=0,lastVoice=0;
let heardVoice=false,consecutive=0,history=[],testBusy=false,quietLevel=0.009;
const memoryLimit=12;
function status(message){indicator.textContent=message}
function audioFlags(){return window.DEUTSCH_AI_AUDIO_STATUS||{speechReady:false,transcriptionReady:false}}
function ready(){return validBase&&badge.classList.contains("ok")&&window.DEUTSCH_AI_VOICE_READY===true}
function flags(){
 const a=audioFlags(),speech=Boolean(a.speechReady),mic=Boolean(a.transcriptionReady);
 if(!validBase||!badge.classList.contains("ok"))capabilities.textContent="شغّل سيرفر AI المحلي ثم اختبر الاتصال";
 else if(speech&&mic)capabilities.textContent="● Whisper وPiper واجدين محلياً";
 else if(!speech&&!mic)capabilities.textContent="خاص تثبيت Whisper وPiper بالصوت";
 else if(!speech)capabilities.textContent="Whisper موجود؛ خاص صوت Piper الألماني";
 else capabilities.textContent="Piper موجود؛ خاص Whisper للميكروفون";
 start.disabled=active||testBusy||!ready();end.disabled=!active;
 finish.disabled=!active||busy||recorder?.state!=="recording";
 test.disabled=active||testBusy||!speech||!validBase||!badge.classList.contains("ok");
}
window.addEventListener("coach-voice-readiness",()=>{
 const a=audioFlags();
 if(!active&&!testBusy){status(a.speechReady&&a.transcriptionReady?
  "الصوت واجد. ضغط «بدء المكالمة» أو «جرّب الصوت».":
  "باش تستعمل الصوت، شغّل START-VOICE-AI.cmd حتى يكمل تثبيت Piper وWhisper.")}
 flags();
});
new MutationObserver(flags).observe(badge,{attributes:true,attributeFilter:["class"]});
function broadcast(isActive){
 window.dispatchEvent(new CustomEvent("coach-live-state",{detail:{active:isActive}}));
 for(const id of ["levelSelect","scenarioSelect","correctToggle"]){if($(id))$(id).disabled=isActive}
 flags();
}
function bubble(role,message){
 const host=$("messages");if(!host)return;
 const node=document.createElement("div");node.className="ai-bubble "+(role==="user"?"you":"bot")+" de-text";node.dir="ltr";
 const label=document.createElement("span");label.className="ai-meta";label.textContent=role==="user"?"Du · صوت":"Deutsch Partner · صوت";
 const content=document.createElement("span");content.textContent=message;
 node.append(label,content);host.appendChild(node);host.scrollTop=host.scrollHeight;
}
async function endpoint(path,opts={}){
 const headers={...(opts.headers||{})};
 if(!window.DEUTSCH_AI_CONFIG?.localOnly&&$("accessCode")?.value)headers["X-Coach-Access"]=$("accessCode").value;
 controller=new AbortController();
 const res=await fetch(base+path,{...opts,headers,signal:controller.signal});
 if(!res.ok){let error={};try{error=await res.json()}catch(_){}
  throw Error(error.error||"الخادم رجع "+res.status)}
 return res;
}
function stopRecorder(){
 if(timer!==null){clearInterval(timer);timer=null}
 if(recorder?.state==="recording"){try{recorder.stop()}catch(_){}}
}
function stopOutput(){
 if(playbackResolve){const done=playbackResolve;playbackResolve=null;done()}
 output.pause();output.removeAttribute("src");output.srcObject=null;output.load();
 if(mediaURL){URL.revokeObjectURL(mediaURL);mediaURL=null}
 output.controls=false;output.hidden=true;
}
function stopSession(){
 const wasActive=active;
 active=false;busy=false;
 controller?.abort();controller=null;
 window.DEUTSCH_AI_CANCEL_REVIEW?.();
 stopRecorder();recorder=null;parts=[];
 stream?.getTracks().forEach(t=>t.stop());stream=null;
 if(ctx){ctx.close().catch(()=>{});ctx=null}
 analyser=null;micSource=null;stopOutput();
 history=[];broadcast(false);
 if(wasActive)status("المكالمة تسالات، والميكروفون توقف.");
}
function volume(){
 if(!analyser)return 0;
 const values=new Uint8Array(analyser.fftSize);analyser.getByteTimeDomainData(values);
 let power=0;
 for(const sample of values){const x=(sample-128)/128;power+=x*x}
 return Math.sqrt(power/values.length);
}
function listen(){
 if(!active||busy||!stream)return;
 if(Date.now()-sessionStarted>15*60000){
  status("وصلتي لـ15 دقيقة ديال المكالمة. تقدر تبدا مكالمة جديدة.");stopSession();return;
 }
 if(typeof MediaRecorder==="undefined"){status("المتصفح ما كيدعمش التسجيل هنا.");stopSession();return}
 const formats=["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg;codecs=opus"];
 const mime=formats.find(x=>MediaRecorder.isTypeSupported(x));
 try{recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{})}
 catch(_){status("متصفحك ما قدرش يبدأ تسجيل الميكروفون.");stopSession();return}
 const thisRecorder=recorder;
 parts=[];heardVoice=false;lastVoice=0;consecutive=0;listenStarted=Date.now();quietLevel=0.009;
 thisRecorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data)};
 thisRecorder.onstop=async()=>{
  if(timer!==null){clearInterval(timer);timer=null}
  if(!active||thisRecorder!==recorder)return;
  const typ=thisRecorder.mimeType||"audio/webm";
  const audio=new Blob(parts,{type:typ});parts=[];recorder=null;flags();
  if(!heardVoice||audio.size<500){
   status("ما سمعتش جملة واضحة. عاود هضر أو استعمل «إرسال الجملة».");listen();return;
  }
  await processTurn(audio,typ);
 };
 thisRecorder.start(250);flags();
 status("🎙️ كنسمعك… هضر بالألمانية. ملي تسكت غادي يتصيفط كلامك.");
 timer=setInterval(()=>{
  if(!active||recorder!==thisRecorder||busy)return;
  const now=Date.now(),rms=volume();
  if(!heardVoice&&rms<0.025)quietLevel=quietLevel*0.97+rms*0.03;
  if(rms>Math.max(0.014,quietLevel*2.5))consecutive++;else consecutive=0;
  if(consecutive>=2){heardVoice=true;lastVoice=now}
  if(heardVoice&&now-lastVoice>2200&&now-listenStarted>850)stopRecorder();
  if(now-listenStarted>22000)stopRecorder();
 },110);
}
async function processTurn(blob,type){
 if(!active||busy)return;
 busy=true;flags();
 status("كنحوّل صوتك لنص ألماني عبر Whisper… أول استعمال يقدر يحمل النموذج.");
 try{
  if(blob.size>5000000)throw Error("التسجيل طويل بزاف، حاول بجملة أقصر.");
  const data=new FormData();
  data.append("audio",blob,"speech."+(type.includes("mp4")?"mp4":type.includes("ogg")?"ogg":"webm"));
  const response=await endpoint("/api/transcribe",{method:"POST",body:data});
  let transcript=String((await response.json()).text||"").trim();
  if(!active)return;
  if(!transcript){status("Whisper ما فهمش الجملة. عاود هضر بوضوح.");return}
  if(document.getElementById("reviewTranscription")?.checked){
   status("Whisper سمع هاد الجملة. راجعها ووافق قبل ما نجاوبك.");
   transcript=await window.DEUTSCH_AI_REVIEW_TRANSCRIPT?.(transcript) || "";
   if(!active)return;
   if(!transcript){status("لغيت هاد التسجيل؛ غادي نرجع نسمعك.");return}
  }
  bubble("user",transcript);
  status("Qwen3/Llama كيوجد جواب ألماني حسب مستواك…");
  const user={role:"user",content:transcript};
  const generated=await endpoint("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   level:$("levelSelect").value,scenario:$("scenarioSelect").value,
   correct:$("correctToggle").checked,lesson_id:new URLSearchParams(location.search).get("lesson")||null,
   messages:[...history,user].slice(-memoryLimit)
  })});
  const reply=String((await generated.json()).reply||"").trim();
  if(!active)return;
  if(!reply)throw Error("ما وصلناش بجواب من الموديل.");
  bubble("assistant",reply);history.push(user,{role:"assistant",content:reply});history=history.slice(-memoryLimit);
  status("🔊 Piper كيجهّز النطق الألماني…");
  const sound=await endpoint("/api/speak",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   text:reply.slice(0,650),level:$("levelSelect").value
  })});
  const wav=await sound.blob();
  if(!active)return;
  if(!wav.size)throw Error("الصوت المولد فارغ.");
  mediaURL=URL.createObjectURL(wav);output.src=mediaURL;output.hidden=false;output.controls=true;
  status("🔊 Deutsch Partner كيهضر؛ كنرجع نسمعك مباشرة من بعد الجواب.");
  await new Promise(resolve=>{
   let completed=false;
   const done=()=>{if(completed)return;completed=true;playbackResolve=null;output.onended=null;output.onerror=null;resolve()};
   playbackResolve=done;output.onended=done;
   output.onerror=()=>{status("تعذر تشغيل الصوت؛ تأكد من اختيار السماعات.");done()};
   output.play().catch(()=>{
    if(!active)return done();
    output.controls=true;
    status("المتصفح منع التشغيل التلقائي. ضغط Play على الصوت اللي ظهر باش تكمل المكالمة.");
   });
  });
  stopOutput();
 }catch(e){
  if(active)status("مشكلة فالمكالمة المحلية: "+String(e.message||"خطأ غير معروف").slice(0,180));
 }finally{
  busy=false;flags();
  if(active)listen();
 }
}
start.addEventListener("click",async()=>{
 if(active||!ready())return;
 stopOutput();
 if($("recordBtn")?.classList.contains("recording")){
  status("وقف التسجيل القصير قبل المكالمة.");return
 }
 if(!navigator.mediaDevices?.getUserMedia){status("المتصفح خاصو HTTPS وإذن الميكروفون.");return}
 try{
  stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)throw Error("المتصفح ما كيدعمش قياس الصوت.");
  ctx=new AudioCtx();await ctx.resume();
  analyser=ctx.createAnalyser();analyser.fftSize=1024;
  micSource=ctx.createMediaStreamSource(stream);micSource.connect(analyser);
  active=true;busy=false;history=[];sessionStarted=Date.now();
  broadcast(true);listen();
 }catch(e){
  stopSession();
  status("ما قدرناش نشغلو الميكروفون. عطِ الإذن للمتصفح: "+String(e.message||"تعذر التسجيل"));
 }
});
finish.addEventListener("click",()=>{
 if(!active||busy||recorder?.state!=="recording")return;
 heardVoice=true;lastVoice=Date.now();stopRecorder();flags();
});
end.addEventListener("click",stopSession);
test.addEventListener("click",async()=>{
 if(active||testBusy||!audioFlags().speechReady)return;
 testBusy=true;flags();status("كنجرب الصوت الألماني ديال Piper…");
 try{
  const resp=await endpoint("/api/speak",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   text:"Hallo! Ich bin dein Deutschpartner. Wir üben heute Deutsch.",level:$("levelSelect").value
  })});
  const blob=await resp.blob();if(!blob.size)throw Error("صوت فارغ.");
  stopOutput();mediaURL=URL.createObjectURL(blob);output.src=mediaURL;output.controls=true;
  try{
   await output.play();
   status("الصوت الألماني خدام. تقدر تشغل الميكروفون أو تبدأ المكالمة.");
  }catch(_){
   output.controls=true;
   status("الصوت تولّد، ولكن المتصفح منع التشغيل التلقائي. ضغط Play على مشغل الصوت.");
  }
 }catch(e){status("الصوت ما خدمش: "+String(e.message||"خطأ محلي").slice(0,180))}
 finally{testBusy=false;flags()}
});
window.addEventListener("pagehide",()=>{if(active)stopSession();else stopOutput()});
flags();
})();