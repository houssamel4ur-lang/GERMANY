/* Self-hosted, hands-free conversation. Ollama + Whisper + Piper only.
 * No OpenAI WebRTC endpoint or commercial model API is used.
 * Silence after an utterance starts the next turn automatically.
 */
(function(){
"use strict";
const start=document.getElementById("startLive"),end=document.getElementById("endLive");
const indicator=document.getElementById("liveStatus"),output=document.getElementById("liveOutput");
const badge=document.getElementById("connectionBadge");
if(!start||!end||!indicator||!output||!badge)return;
const base=String(window.DEUTSCH_AI_CONFIG?.apiBase||"").trim().replace(/\/+$/,"");
const field=id=>document.getElementById(id);
let active=false,busy=false,stream=null,recorder=null,chunkList=[],analyser=null,audioCtx=null,timer=null,controller=null,objectURL=null;
let recordedSpeech=false,speechAt=0,startAt=0,consecutive=0,turns=[],sessionStarted=0,playbackResolve=null;
function status(value){indicator.textContent=value}
function connected(){return badge.classList.contains("ok")&&/^(https:\/\/|http:\/\/localhost|http:\/\/127\.0\.0\.1)/.test(base)}
function adjust(){start.disabled=active||!connected();end.disabled=!active}
new MutationObserver(adjust).observe(badge,{attributes:true,attributeFilter:["class"]});
function notifyLocked(locked){
 window.dispatchEvent(new CustomEvent("coach-live-state",{detail:{active:locked}}));
 for(const id of ["levelSelect","scenarioSelect","correctToggle"]){if(field(id))field(id).disabled=locked}
 adjust();
}
function appendBubble(role,txt){
 const host=field("messages"),box=document.createElement("div");
 box.className="ai-bubble "+(role==="user"?"you":"bot")+" de-text";box.dir="ltr";
 const meta=document.createElement("span");meta.className="ai-meta";meta.textContent=role==="user"?"Du · Live":"Deutsch Partner · Live";
 const content=document.createElement("span");content.textContent=txt;
 box.append(meta,content);host.appendChild(box);host.scrollTop=host.scrollHeight;
}
async function endpoint(path,options){
 const headers={"X-Coach-Access":field("accessCode")?.value||"",...(options.headers||{})};
 controller=new AbortController();
 let response;
 try{response=await fetch(base+path,{...options,headers,signal:controller.signal})}
 catch(e){throw new Error("الخادم المحلي ما جاوبش أو تقطع الاتصال.")}
 if(!response.ok){
  let body={};try{body=await response.json()}catch(e){}
  throw new Error(body.error||"الخادم رجع خطأ: "+response.status);
 }
 return response;
}
function haltRecording(){
 if(timer){clearInterval(timer);timer=null}
 if(recorder?.state==="recording"){try{recorder.stop()}catch(e){}}
}
function stopAudio(){
 if(playbackResolve){const resolve=playbackResolve;playbackResolve=null;resolve()}
 output.pause();output.srcObject=null;output.removeAttribute("src");output.load();
 if(objectURL){URL.revokeObjectURL(objectURL);objectURL=null}
}
function endSession(){
 active=false;busy=false;
 controller?.abort();controller=null;
 haltRecording();
 recorder=null;chunkList=[];
 if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}
 if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null}
 analyser=null;stopAudio();turns=[];
 notifyLocked(false);
 status("المكالمة سالات والميكروفون توقف.");
}
function audioLevel(){
 if(!analyser)return 0;
 let arr=new Uint8Array(analyser.fftSize);
 analyser.getByteTimeDomainData(arr);
 let sum=0;for(const x of arr){const n=(x-128)/128;sum+=n*n}
 return Math.sqrt(sum/arr.length);
}
function beginTurn(){
 if(!active||busy||!stream)return;
 if(Date.now()-sessionStarted>15*60_000){status("انتهت جلسة 15 دقيقة حفاظاً على الموارد.");endSession();return}
 if(typeof MediaRecorder==="undefined"){status("المتصفح لا يدعم تسجيل الصوت. استخدم الوضع الكتابي.");endSession();return}
 const candidates=["audio/webm;codecs=opus","audio/mp4","audio/webm","audio/ogg;codecs=opus"];
 const mime=candidates.find(x=>MediaRecorder.isTypeSupported(x));
 try{recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{})}
 catch(e){status("تعذر فتح تسجيل الصوت في هذا المتصفح.");endSession();return}
 chunkList=[];recordedSpeech=false;speechAt=0;consecutive=0;startAt=Date.now();
 const thisRecorder=recorder;
 thisRecorder.addEventListener("dataavailable",e=>{if(e.data.size>0)chunkList.push(e.data)});
 thisRecorder.addEventListener("stop",async()=>{
  if(timer){clearInterval(timer);timer=null}
  if(!active||thisRecorder!==recorder)return;
  const typ=thisRecorder.mimeType||"audio/webm";
  const blob=new Blob(chunkList,{type:typ});chunkList=[];
  recorder=null;
  if(!recordedSpeech||blob.size<900){status("تقدر تهضر بالألمانية… كنسمع ليك.");beginTurn();return}
  await processTurn(blob,typ);
 });
 thisRecorder.start(300);
 status("🎙️ هضر بشكل طبيعي. ملي تسكت غادي نفهم ونرد بالألمانية.");
 timer=setInterval(()=>{
  if(!active||recorder!==thisRecorder)return;
  const now=Date.now(),rms=audioLevel();
  if(rms>0.034)consecutive++;else consecutive=0;
  if(consecutive>=2){recordedSpeech=true;speechAt=now}
  if(recordedSpeech&&now-speechAt>1400&&now-startAt>900)haltRecording();
  if(now-startAt>26000)haltRecording();
 },120);
}
async function processTurn(blob,type){
 if(!active||busy)return;
 busy=true;status("كنحوّل صوتك إلى الألمانية ونوجد جواب من النموذج المحلي…");
 try{
  const file=new FormData();
  file.append("audio",blob,"utterance."+(type.includes("mp4")?"mp4":type.includes("ogg")?"ogg":"webm"));
  if(blob.size>5_000_000)throw new Error("التسجيل كبير بزاف. حاول بجملة أقصر.");
  const transcriptResult=await endpoint("/api/transcribe",{method:"POST",body:file});
  const transcript=String((await transcriptResult.json()).text||"").trim();
  if(!active)return;
  if(!transcript){
   status("ما فهمتش الكلام. عاود هضر بهدوء وبوضوح.");
   return;
  }
  appendBubble("user",transcript);
  const user={role:"user",content:transcript};
  const result=await endpoint("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    level:field("levelSelect").value,scenario:field("scenarioSelect").value,
    correct:field("correctToggle").checked,messages:[...turns,user].slice(-24)
  })});
  const reply=String((await result.json()).reply||"").trim();
  if(!active)return;
  if(!reply)throw new Error("النموذج المحلي ما عطاش جواب.");
  appendBubble("assistant",reply);
  turns.push(user,{role:"assistant",content:reply});turns=turns.slice(-24);
  status("كنولّد النطق الألماني المحلي...");
  const sound=await endpoint("/api/speak",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    text:reply.slice(0,650),level:field("levelSelect").value
  })});
  const wav=await sound.blob();
  if(!active)return;
  objectURL=URL.createObjectURL(wav);
  output.src=objectURL;
  output.controls=false;
  status("🔊 Deutsch Partner كيهضر بالألمانية؛ الميكروفون كيسمع من بعد ما يسالي.");
  await new Promise(resolve=>{
   let done=false;
   const finish=()=>{if(done)return;done=true;playbackResolve=null;output.onended=null;output.onerror=null;resolve()};
   playbackResolve=finish;
   output.onended=finish;output.onerror=finish;
   output.play().catch(()=>{output.controls=true;status("متصفحك منع التشغيل التلقائي. ضغط على تشغيل الصوت باش تكمل المكالمة.");});
  });
  stopAudio();
 }catch(e){
  if(active)status("وقع مشكل فالمحادثة المحلية: "+String(e.message||"تعذر إتمام المكالمة"));
 }finally{
  busy=false;
  if(active)beginTurn();
 }
}
start.addEventListener("click",async()=>{
 if(active||!connected())return;
 if(field("recordBtn")?.classList.contains("recording")){status("وقف التسجيل القصير أولاً.");return}
 if(!navigator.mediaDevices?.getUserMedia){status("المتصفح لا يدعم الميكروفون هنا؛ خاص HTTPS وإذن التسجيل.");return}
 try{
  stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  const AContext=window.AudioContext||window.webkitAudioContext;
  if(!AContext)throw new Error("متصفحك لا يدعم قياس الصمت للردود.");
  audioCtx=new AContext();await audioCtx.resume();
  analyser=audioCtx.createAnalyser();analyser.fftSize=1024;
  audioCtx.createMediaStreamSource(stream).connect(analyser);
  turns=[];active=true;busy=false;sessionStarted=Date.now();notifyLocked(true);
  beginTurn();
 }catch(e){status("ما قدرناش نفتح الميكروفون: "+String(e.message||"تحقق من الإذن"));endSession()}
});
end.addEventListener("click",endSession);
window.addEventListener("pagehide",endSession);
adjust();
})();