/* Deutsch Mastery self-hosted AI frontend: only own Ollama + Whisper + Piper server. */
(function(){
"use strict";
const $=s=>document.querySelector(s),body=$("#messages"),base=String(window.DEUTSCH_AI_CONFIG?.apiBase||"").trim().replace(/\/+$/,"");
const maxTurns=Math.max(4,Math.min(20,Number(window.DEUTSCH_AI_CONFIG?.maxTurns)||12));
const focusId=String(new URLSearchParams(location.search).get("lesson")||"").trim();
const lessonFocus=window.DM_MASTER_CURRICULUM?.topics?.find(t=>t.id===focusId)||null;
const textBox=$("#userMessage"),sendBtn=$("#sendBtn"),micBtn=$("#recordBtn"),status=$("#chatStatus"),badge=$("#connectionBadge");
let speechReady=false,transcriptionReady=false;let modelLabel="AI المحلي";window.DEUTSCH_AI_VOICE_READY=false;
let liveActive=false;
let turns=[],connected=false,busy=false,recorder=null,chunks=[],recTimer=null,recStarted=0,recordStream=null,playing=null,playURL=null,requestController=null;
const pick=s=>$(s)?.value||"";
const previews={
free:{A1:["Hallo! Wie heißt du?","Ich lerne Deutsch."],A2:["Wie war dein Tag?","Was machst du am Wochenende?"],B1:["Was machst du gern in deiner Freizeit?","Was war dein schönstes Erlebnis?"],B2:["Welche Veränderungen bemerkst du in deiner Stadt?","Was hältst du von künstlicher Intelligenz?"]},
introductions:{A1:["Hallo, ich heiße Sara.","Wie geht es dir?"],A2:["Ich möchte mich vorstellen.","Was machst du beruflich?"]},
cafe:{A1:["Guten Tag! Ich möchte einen Kaffee.","Was kostet das?"],A2:["Ich hätte gern einen Tee und ein Stück Kuchen.","Könnte ich bitte die Rechnung haben?"]},
shopping:{A1:["Wie viel kostet das?","Haben Sie Größe M?"],A2:["Ich suche eine warme Jacke.","Kann ich das umtauschen?"]},
travel:{A1:["Wo ist der Bahnhof?","Ein Ticket nach Berlin, bitte."],A2:["Mein Zug hat Verspätung.","Könnten Sie mir helfen?"]},
job:{A1:["Ich bin Elektriker.","Ich suche Arbeit."],A2:["Ich habe eine Ausbildung gemacht.","Ich möchte mich bewerben."],B1:["Ich habe Erfahrung im Kundenservice.","Warum ist die Stelle interessant?"],B2:["Welche Kompetenzen sind für diese Position wichtig?","Ich möchte meine berufliche Entwicklung erläutern."]},
daily:{A1:["Ich stehe um sieben Uhr auf.","Was machst du heute?"],A2:["Heute hatte ich viel zu tun.","Wie organisierst du deinen Tag?"]},
debate:{A1:["Ich finde Deutsch interessant.","Was denkst du?"],A2:["Meiner Meinung nach ist Sport wichtig.","Warum denkst du das?"],B1:["Ich bin für öffentliche Verkehrsmittel.","Welche Vor- und Nachteile siehst du?"],B2:["Welche Chancen und Risiken birgt die Digitalisierung?","Ich möchte ein Gegenargument formulieren."]}
};
const greetings={
A1:"Hallo! Ich bin dein Deutschpartner. Wie heißt du? 😊",
A2:"Hallo! Schön, dass du da bist. Wie war dein Tag bisher?",
B1:"Hallo! Schön, dich kennenzulernen. Worüber möchtest du heute sprechen?",
B2:"Hallo! Ich freue mich auf unser Gespräch. Gibt es ein Thema, über das du heute gern ausführlicher diskutieren möchtest?"
};
const esc=s=>String(s||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function setStatus(msg){status.textContent=msg}
function statusBadge(ok,msg){badge.className="ai-status "+(ok?"ok":"off");badge.textContent=msg}
function configured(){return /^https:\/\//i.test(base)||/^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(base)}
function getCode(){return window.DEUTSCH_AI_CONFIG?.localOnly?"":String($("#accessCode").value||"").trim()}
function syncVoice(){
 window.DEUTSCH_AI_VOICE_READY=Boolean(connected&&speechReady&&transcriptionReady);
 window.DEUTSCH_AI_AUDIO_STATUS={speechReady:connected&&speechReady,transcriptionReady:connected&&transcriptionReady,model:modelLabel};
 window.dispatchEvent(new Event("coach-voice-readiness"));
}
function errorMessage(err){if(err.name==="AbortError")return "العملية توقفت.";return err.message||"تعذر الاتصال بالخادم."}
function finalAnswerOnly(raw){
 let answer=String(raw||"").replace(/\r\n?/g,"\n");
 answer=answer.replace(/<think\b[^>]*>[\s\S]*?<\/think\s*>/gi,"");
 answer=answer.replace(/<think\b[^>]*>[\s\S]*$/gi,"");
 answer=answer.replace(/<\/think\s*>/gi,"");
 answer=answer.replace(/^\s*(?:(?:Thinking|Reasoning)\s*\.{3}|\.{3}\s*done thinking\.?|\[analysis\]|analysis:)\s*/gi,"");
 answer=answer.trim();
 // Never display a plain-language reasoning trace if a model unexpectedly emits one.
 if(/(?:^Okay[,]? the (?:user|learner)|^The (?:user|learner) (?:wants|asks|said)|^I (?:need|should|must) to|^Let me (?:think|plan)|^Final plan:|^First, I (?:need|should)|^Wait, (?:the user|they said)|^\*checks requirements|\b(?:the learner said|the user said|the instruction says|I should respond|Let me think|the prompt says|one or two sentences)\b)/i.test(answer))return "";
 return answer;
}
function append(role,text,kind){const wrapper=document.createElement("div");wrapper.className="ai-bubble "+(role==="assistant"?"bot":"you")+" de-text"+(kind==="pending"?" pending":"");wrapper.dir="ltr";
const meta=document.createElement("span");meta.className="ai-meta";meta.textContent=role==="assistant"?"Deutsch Partner":"Du";wrapper.appendChild(meta);
const msg=document.createElement("span");msg.textContent=text;wrapper.appendChild(msg);
if(role==="assistant"&&kind!=="pending"){
 if(speechReady){
  const play=document.createElement("button");play.className="ai-play";play.type="button";
  play.textContent="🔊 استمع بالألمانية";play.addEventListener("click",()=>speak(text));wrapper.appendChild(play);
 }
 const copy=document.createElement("button");copy.className="ai-copy";copy.type="button";
 copy.textContent="⧉ نسخ الرد";copy.setAttribute("aria-label","نسخ رد المساعد");
 copy.addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(text);copy.textContent="✓ تم النسخ";setTimeout(()=>{copy.textContent="⧉ نسخ الرد"},1800)}
  catch(_){setStatus("تعذر النسخ تلقائياً. يمكنك تحديد النص ونسخه يدوياً.")}
 });wrapper.appendChild(copy);
}
body.appendChild(wrapper);body.scrollTop=body.scrollHeight;return wrapper;
}
function showWelcome(){
 body.innerHTML="";
 const intro=document.createElement("div");intro.className="ai-intro";
 const mark=document.createElement("div");mark.className="ai-intro-mark";mark.setAttribute("aria-hidden","true");mark.textContent="✦";
 const title=document.createElement("h3");title.textContent="Willkommen! مستعد تتدرّب؟";
 const description=document.createElement("p");description.textContent="بدأنا بمستوى "+pick("#levelSelect")+". اكتب أول جملة بالألمانية، والمساعد غادي يكمل معاك الحوار بطريقة طبيعية.";
 intro.append(mark,title,description);body.appendChild(intro);
 append("assistant",greetings[pick("#levelSelect")]||greetings.A1);
 if(lessonFocus){const note=document.createElement("div");note.className="ai-alert";note.textContent="محادثة مركزة على درس "+lessonFocus.title+" ("+lessonFocus.level+") من فهرس الموقع.";body.appendChild(note)}
 body.scrollTop=0;
}
function suggestions(){
const subject=pick("#scenarioSelect"),level=pick("#levelSelect");
const phrases=previews[subject]?.[level]||previews[subject]?.A2||previews.free[level]||previews.free.A1;
$("#suggestions").innerHTML=phrases.map(p=>'<button type="button" data-prompt="'+esc(p)+'" lang="de" dir="ltr">'+esc(p)+'</button>').join("");
}
function resizeInput(){textBox.style.height="auto";textBox.style.height=Math.min(190,Math.max(43,textBox.scrollHeight))+"px";}
function isLocked(){return busy||!connected||liveActive}
function applyControls(){sendBtn.disabled=isLocked();micBtn.disabled=(isLocked()||!transcriptionReady)&&!recorder;$("#newChat").disabled=busy||liveActive;$("#testConnection").disabled=busy;$("#sessionLevel").textContent=pick("#levelSelect")}
async function call(path,options={}){
const controller=options.signal?null:new AbortController();
const headers={...(options.headers||{})};if(getCode())headers["X-Coach-Access"]=getCode();
const req={...options,headers,signal:options.signal||controller.signal};
let res;
try{res=await fetch(base+path,req)}catch(e){throw new Error("لا يمكن الوصول للخادم. تحقق من الرابط والاتصال.")}
if(!res.ok){let error={};try{error=await res.json()}catch(_){};throw new Error(error.error||"فشل الطلب ("+res.status+")");}
return res;
}
async function check(){
if(!configured()){
 connected=false;speechReady=false;transcriptionReady=false;window.DEUTSCH_AI_VOICE_READY=false;statusBadge(false,"غير مفعّل");syncVoice();
 $("#configHint").textContent="الواجهة واجدة، ولكن خاصك تشغّل selfhost-ai على جهازك أو سيرفرك وتضيف رابط HTTPS الخاص به في assets/ai-config.js.";
 setStatus("المحادثة الحرة غير مفعّلة حتى يكون سيرفرنا الخاص خدام وعندو نموذج Qwen3 مثبت؛ ما كاين حتى API خارجي.");applyControls();return;
}
 try{
 const res=await call("/api/health",{method:"GET"});const data=await res.json();
 const requiredBridge="2026.11.13.5";
 if(window.DEUTSCH_AI_CONFIG?.localOnly&&data.bridge_version!==requiredBridge){
  connected=false;speechReady=false;transcriptionReady=false;window.DEUTSCH_AI_VOICE_READY=false;
  statusBadge(false,"خاص تحديث برنامج AI المحلي");syncVoice();
  $("#configHint").textContent="الموقع تحدّث، ولكن البرنامج اللي شغال فـPC قديم. خاص تبدل local_bridge.py وتسد النافذة الكحلة القديمة وتعاود تشغّل START-VOICE-AI.cmd.";
  setStatus("كود GitHub تحدّث ولكن النسخة القديمة ديال Python باقية خدامة. حمّل حزمة الإصلاح الجديدة وشغّلها.");
  applyControls();return;
 }
 connected=data.ready===true;
 modelLabel=String(data.model||"AI المحلي").slice(0,40);
 speechReady=connected&&data.speech_ready===true;
 transcriptionReady=connected&&data.transcription_configured===true;
 window.DEUTSCH_AI_VOICE_READY=speechReady&&transcriptionReady;
 if(!speechReady){$("#autoSpeak").checked=false;$("#autoSpeak").disabled=true;}
 else{$("#autoSpeak").disabled=false;if(!$("#autoSpeak").dataset.userChanged)$("#autoSpeak").checked=true;}
 statusBadge(connected,connected?"متصل · AI جاهز":"غير جاهز");syncVoice();
 $("#configHint").textContent=connected?"السيرفر الخاص جاهز. الاتصال كيدوز بينك وبين النموذج المحلي على جهازك أو سيرفرك.":"السيرفر موجود، ولكن نموذج Ollama المحلي أو رمز الدخول مازال ما تفعّلوش.";
 setStatus(connected?(speechReady&&transcriptionReady?"مستعد! الصوت والميكروفون واجدين، تقدر تبدأ مكالمة بالألمانية.":transcriptionReady?"المايك خدام؛ خاص إعداد Piper للرد الصوتي.":speechReady?"النطق الألماني خدام؛ خاص إعداد Whisper للمايك.":"المحادثة الكتابية واجدة. باش تفعل الصوت والمكالمة شغّل START-VOICE-AI.cmd."):"الخادم لم يصبح جاهزاً للمحادثة بعد.");
 }catch(e){
 connected=false;speechReady=false;transcriptionReady=false;window.DEUTSCH_AI_VOICE_READY=false;statusBadge(false,"تعذر الاتصال");syncVoice();
 $("#configHint").textContent=errorMessage(e);
 setStatus("لم يتم الاتصال بخدمة الذكاء الاصطناعي. التمارين العادية فالموقع باقية خدامة.");
 }
 applyControls();
}
async function respond(message,fromMicrophone=false){
if(isLocked())return;
message=String(message||"").trim();if(!message)return;
if(message.length>1500){setStatus("الرسالة طويلة؛ الحد الأقصى 1500 حرف.");return;}
if(message.includes("\u0000"))return;
stopPlaying();busy=true;applyControls();
body.querySelector(".ai-intro")?.remove();
const sentBubble=append("user",message);
body.querySelectorAll(".ai-request-error").forEach(n=>n.remove());
textBox.value="";resizeInput();
const pending=append("assistant","•••","pending");pending.setAttribute("aria-label","جاري إعداد الجواب");pending.querySelector("span:last-child")?.classList.add("ai-pending-dots");
setStatus(modelLabel+" كيوجد الجواب محلياً...");
const startedAt=Date.now();
const progressTimer=setInterval(()=>{
 if(!busy)return;
 const seconds=Math.floor((Date.now()-startedAt)/1000);
 setStatus(seconds<12?modelLabel+" كيوجد الجواب محلياً… ("+seconds+" ثواني)":modelLabel+" باقي كيعالج الجواب على PC ديالك… ("+seconds+" ثواني). السرعة كتختلف حسب المعالج والذاكرة.");
},1500);
const current={role:"user",content:message};
try{
 const reply=await call("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
 level:pick("#levelSelect"),scenario:pick("#scenarioSelect"),correct:$("#correctToggle").checked,lesson_id:lessonFocus?.level===pick("#levelSelect")?focusId:null,
 messages:[...turns,current].slice(-(maxTurns*2))
 })});
 const data=await reply.json();
 const text=finalAnswerOnly(data.reply);
 if(!text)throw new Error("الردّ فيه تفكير داخلي أو فارغ، ولذلك ما تعرضش. حاول مجدداً.");
 pending.remove();append("assistant",text);
 turns.push(current,{role:"assistant",content:text});turns=turns.slice(-(maxTurns*2));
 setStatus(data.provider==="local-greeting"?"ردّ تحية سريع من التطبيق المحلي؛ باقي الحوار كيستعمل "+modelLabel+".":"جاوب "+modelLabel+" فـ "+(data.elapsed_seconds??Math.max(1,Math.round((Date.now()-startedAt)/1000)))+" ثانية. تقدر تكمل المحادثة.");
 if(fromMicrophone||$("#autoSpeak").checked){
  if(speechReady)await speak(text);
  else setStatus("Whisper فهم كلامك، ولكن Piper مازال ما خدامش. شغّل START-VOICE-AI.cmd ثم اختبار الاتصال باش تسمع الرد.");
 }
}catch(e){
 pending.remove();sentBubble.remove();
 const reason=errorMessage(e);
 const notice=document.createElement("div");notice.className="ai-alert ai-request-error";notice.setAttribute("role","alert");notice.dir="rtl";
 notice.textContent="تعذر جواب Qwen3: "+reason+" — الرسالة رجعات لخانة الكتابة باش تقدر تعاود المحاولة.";
 body.appendChild(notice);body.scrollTop=body.scrollHeight;
 textBox.value=message;resizeInput();
 setStatus("فشل الطلب: "+reason);
}finally{clearInterval(progressTimer);busy=false;applyControls();textBox.focus()}
}
function stopPlaying(){
 const audio=$("#chatAudioPlayer");
 if(playing){playing.pause();playing.src="";playing=null}
 if(audio){audio.pause();audio.removeAttribute("src");audio.load();audio.hidden=true}
 if(playURL){URL.revokeObjectURL(playURL);playURL=null}
}
async function speak(text){
if(!connected||!speechReady){setStatus("الصوت الألماني مازال ما جاهزش. شغّل START-VOICE-AI.cmd وجرب الاتصال.");return;}
stopPlaying();
const payload=String(text||"").slice(0,650);
if(!payload)return;
setStatus("Piper كيوجد الرد الصوتي بالألمانية…");
try{
 const res=await call("/api/speak",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:payload,level:pick("#levelSelect")})});
 const blob=await res.blob();
 if(blob.size<44)throw Error("Piper رجع ملف صوت فارغ.");
 playURL=URL.createObjectURL(blob);
 const audio=$("#chatAudioPlayer");
 if(audio){
  audio.src=playURL;audio.hidden=false;audio.controls=true;
  audio.onended=()=>{setStatus("سالَى الرد الصوتي. تقدر تهضر مجدداً.");};
  try{
   await audio.play();
   setStatus("🔊 AI كيهضر بالألمانية. تقدر توقف أو تعاود Play من مشغل الصوت.");
  }catch(_){
   setStatus("Piper جهّز الصوت، لكن المتصفح منع التشغيل التلقائي. ضغط Play فمشغل الصوت اللي ظهر لتحت.");
  }
 }else{
  playing=new Audio(playURL);
  await playing.play();
 }
}catch(e){setStatus("تعذر الرد الصوتي: "+errorMessage(e)+" — جرّب زر «جرّب الصوت» وشوف إعدادات السماعات.")}
}

async function microphone(){
if(!connected)return;
if(recorder&&recorder.state==="recording"){recorder.stop();return}
if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){setStatus("المتصفح لا يدعم التسجيل. جرب Chrome أو Edge، أو استعمل الكتابة.");return}
try{
 stopPlaying();
 const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
 recordStream=stream;
 const types=["audio/webm;codecs=opus","audio/mp4","audio/webm","audio/ogg;codecs=opus"];
 const mime=types.find(t=>MediaRecorder.isTypeSupported(t));
 recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});
 chunks=[];recStarted=Date.now();micBtn.classList.add("recording");$("#recordLabel").textContent="إيقاف التسجيل";setStatus("كيتم التسجيل. ضغط مرة أخرى باش توقفه، الحد الأقصى 30 ثانية.");
 recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 recorder.onerror=()=>setStatus("وقع مشكل أثناء التسجيل.");
 recorder.onstop=async()=>{
   clearTimeout(recTimer);micBtn.classList.remove("recording");$("#recordLabel").textContent="تسجيل";
   recordStream?.getTracks().forEach(t=>t.stop());recordStream=null;
   const typ=recorder?.mimeType||"audio/webm";
   recorder=null;
   const blob=new Blob(chunks,{type:typ});chunks=[];
   if(blob.size<400){setStatus("التسجيل قصير بزاف. حاول تعاود.");return}
   if(blob.size>5_000_000){setStatus("التسجيل كبير بزاف (5MB كحد أقصى).");return}
   busy=true;applyControls();setStatus("Whisper كيحوّل صوتك إلى ألمانية… أول مرة يقدر يحمّل نموذج مجاني.");
   try{
    const fd=new FormData();fd.append("audio",blob,"speech."+(typ.includes("mp4")?"mp4":typ.includes("ogg")?"ogg":"webm"));
    const res=await call("/api/transcribe",{method:"POST",body:fd});
    const data=await res.json();const transcript=String(data.text||"").trim();
    if(!transcript){setStatus("ما قدرناش نفهمو التسجيل. عاود أو اكتب الرسالة.");return}
    setStatus("تم التعرف على الكلام: "+transcript);
    busy=false;applyControls();await respond(transcript,true);
   }catch(e){setStatus("تعذر تحويل الصوت إلى نص: "+errorMessage(e))}
   finally{busy=false;applyControls()}
 };
 recorder.start(250);recTimer=setTimeout(()=>{if(recorder?.state==="recording")recorder.stop()},30000);
}catch(e){recordStream?.getTracks().forEach(t=>t.stop());recordStream=null;setStatus("ما قدرناش نستعمل الميكروفون. تأكد من إذن المتصفح.");}
}
window.addEventListener("coach-live-state",event=>{liveActive=Boolean(event.detail?.active);applyControls()});
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();respond(textBox.value)});
textBox.addEventListener("input",resizeInput);
textBox.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();respond(textBox.value)}});
micBtn.addEventListener("click",microphone);
$("#stopAudio").addEventListener("click",()=>{stopPlaying();setStatus("توقف تشغيل الصوت.")});
$("#newChat").addEventListener("click",()=>{
 if(busy)return;turns=[];stopPlaying();showWelcome();suggestions();setStatus("محادثة جديدة. اختر موضوعاً وابدأ.");
});
$("#levelSelect").addEventListener("change",()=>{if(busy)return;turns=[];stopPlaying();showWelcome();suggestions();applyControls();setStatus("تم اختيار "+pick("#levelSelect")+". يبدأ الحوار الجديد حسب المستوى.")});
$("#scenarioSelect").addEventListener("change",()=>{if(busy)return;turns=[];showWelcome();suggestions();setStatus("بدأت محادثة بموضوع جديد.")});
$("#suggestions").addEventListener("click",e=>{const btn=e.target.closest("[data-prompt]");if(btn){textBox.value=btn.dataset.prompt;resizeInput();textBox.focus()}});
$("#testConnection").addEventListener("click",check);
$("#autoSpeak").addEventListener("change",()=>{$("#autoSpeak").dataset.userChanged="1";});

const mobileSettings=$("#aiMobileSettings"),layout=$(".ai-layout");
mobileSettings?.addEventListener("click",()=>{
 const open=layout.classList.toggle("settings-open");
 mobileSettings.setAttribute("aria-expanded",String(open));
 mobileSettings.textContent=open?"✕ إغلاق الإعدادات":"⚙ إعدادات المحادثة";
});

$("#accessCode").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();check()}});
window.addEventListener("pagehide",()=>{recordStream?.getTracks().forEach(t=>t.stop());stopPlaying()});
showWelcome();suggestions();resizeInput();if(window.DEUTSCH_AI_CONFIG?.localOnly){const code=$("#accessCode");if(code){const label=document.querySelector("label[for=accessCode]");code.hidden=true;if(label)label.hidden=true;}$("#configHint").textContent="للتشغيل على نفس PC، فتح START-DEUTSCH-AI.cmd من الحزمة المحلية، بلا رمز دخول وبلا API مدفوعة.";}applyControls();check();
})();