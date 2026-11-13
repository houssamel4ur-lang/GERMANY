/* Optional low-latency German speech conversation via WebRTC.
 * Server mints short-lived scoped credentials; the main API key never reaches JS.
 */
(function(){
"use strict";
const start=document.getElementById("startLive"),end=document.getElementById("endLive");
const indicator=document.getElementById("liveStatus"),output=document.getElementById("liveOutput");
if(!start||!end||!indicator||!output)return;
const badge=document.getElementById("connectionBadge");
const api=String(window.DEUTSCH_AI_CONFIG?.apiBase||"").trim().replace(/\/+$/,"");
let peer=null,channel=null,mic=null,starting=false,active=false,fetchAbort=null,endedByUser=false;
const fields=["levelSelect","scenarioSelect","correctToggle"];
const value=id=>document.getElementById(id)?.value||"";
const updateStatus=text=>{indicator.textContent=text};
function backendReady(){return badge?.classList.contains("ok")===true&&/^https:\/\//.test(api)}
function refresh(){start.disabled=!backendReady()||starting||active;end.disabled=!(starting||active)}
new MutationObserver(refresh).observe(badge,{attributes:true,attributeFilter:["class"]});
function isRecorderActive(){return document.getElementById("recordBtn")?.classList.contains("recording")}
function liveState(enabled){
 window.dispatchEvent(new CustomEvent("coach-live-state",{detail:{active:enabled}}));
 for(const id of fields){const node=document.getElementById(id);if(node)node.disabled=enabled}
 refresh();
}
function message(role,text){
 if(!text)return;
 const host=document.getElementById("messages");if(!host)return;
 const box=document.createElement("div");
 box.className="ai-bubble "+(role==="user"?"you":"bot")+" de-text";
 box.dir="ltr";
 const meta=document.createElement("span");meta.className="ai-meta";meta.textContent=role==="user"?"Du · Live":"Deutsch Partner · Live";
 const content=document.createElement("span");content.textContent=text;
 box.append(meta,content);host.appendChild(box);host.scrollTop=host.scrollHeight;
}
function cleanup(){
 fetchAbort?.abort();fetchAbort=null;
 try{channel?.close()}catch(e){}
 channel=null;
 try{peer?.close()}catch(e){}
 peer=null;
 try{mic?.getTracks().forEach(t=>t.stop())}catch(e){}
 mic=null;
 try{output.pause()}catch(e){}
 output.srcObject=null;
 active=false;starting=false;
 liveState(false);
}
function handleEvent(event){
 let data;try{data=JSON.parse(event.data)}catch(_){return}
 switch(data.type){
 case "session.created":updateStatus("الجلسة الصوتية فتحت. تكلّم بالألمانية وانتظر الرد.");break;
 case "session.updated":updateStatus("تم ضبط اللغة والمستوى في الجلسة.");break;
 case "input_audio_buffer.speech_started":updateStatus("كنسمع ليك…");break;
 case "input_audio_buffer.speech_stopped":updateStatus("سمعتك. كنوجد الجواب بالألمانية…");break;
 case "conversation.item.input_audio_transcription.completed":
   if(data.transcript)message("user",String(data.transcript).slice(0,1200));break;
 case "response.output_audio_transcript.done":
   if(data.transcript)message("assistant",String(data.transcript).slice(0,1400));break;
 case "response.done":updateStatus("المحادثة متصلة. تقدر تجاوب وتكمل بلا ضغط متكرر.");break;
 case "error":
   updateStatus("تنبيه من الجلسة: "+String(data.error?.message||"تعذر إتمام الدور").slice(0,200));break;
 }
}
async function waitIce(pc){
 if(pc.iceGatheringState==="complete")return;
 await new Promise((resolve,reject)=>{
  let timer=setTimeout(()=>{pc.removeEventListener("icegatheringstatechange",onChange);reject(Error("تعذر الحصول على اتصال WebRTC في الوقت المناسب."))},12000);
  function onChange(){if(pc.iceGatheringState!=="complete")return;clearTimeout(timer);pc.removeEventListener("icegatheringstatechange",onChange);resolve()}
  pc.addEventListener("icegatheringstatechange",onChange);onChange();
 });
}
async function begin(){
 if(!backendReady()||active||starting){updateStatus("خاص أولاً تتصل بالخادم بالرمز الصحيح.");return}
 if(isRecorderActive()){updateStatus("وقف التسجيل القصير أولاً قبل بدء المكالمة المباشرة.");return}
 if(typeof RTCPeerConnection==="undefined"||!navigator.mediaDevices?.getUserMedia){
  updateStatus("المتصفح لا يدعم مكالمة WebRTC أو الميكروفون. جرّب Chrome أو Edge عبر HTTPS.");return;
 }
 document.getElementById("stopAudio")?.click();
 endedByUser=false;starting=true;liveState(true);refresh();
 updateStatus("كنطلب الإذن بالميكروفون ونوجد اتصال آمن…");
 try{
  mic=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  if(!starting||endedByUser){mic?.getTracks().forEach(t=>t.stop());return}
  peer=new RTCPeerConnection();
  peer.addEventListener("track",e=>{
   output.srcObject=e.streams[0]||new MediaStream([e.track]);
   output.play().catch(()=>{output.controls=true;updateStatus("ضغط على زر تشغيل الصوت أسفل أزرار المكالمة.")});
  });
  peer.addEventListener("connectionstatechange",()=>{
   if(!peer)return;
   if(peer.connectionState==="failed"||peer.connectionState==="closed"){
    updateStatus("توقف اتصال المكالمة.");cleanup();
   }
  });
  mic.getTracks().forEach(track=>peer.addTrack(track,mic));
  channel=peer.createDataChannel("oai-events");
  channel.addEventListener("message",handleEvent);
  channel.addEventListener("open",()=>{updateStatus("متصل. هضر بالألمانية، وجاوب من بعد ما تسمع الرد.");active=true;starting=false;refresh()});
  channel.addEventListener("close",()=>{if(active||starting){updateStatus("انتهت الجلسة الصوتية.");cleanup()}});
  const offer=await peer.createOffer();
  await peer.setLocalDescription(offer);await waitIce(peer);
  const sdp=peer.localDescription?.sdp;if(!sdp)throw Error("لم تتوفر بيانات المكالمة.");
  fetchAbort=new AbortController();
  const secretRes=await fetch(api+"/api/realtime-token",{method:"POST",headers:{"Content-Type":"application/json","X-Coach-Access":value("accessCode")},body:JSON.stringify({level:value("levelSelect"),scenario:value("scenarioSelect"),correct:document.getElementById("correctToggle").checked}),signal:fetchAbort.signal});
  if(!secretRes.ok){let error={};try{error=await secretRes.json()}catch(e){}throw Error(error.error||"تعذر فتح الجلسة: "+secretRes.status)}
  const token=await secretRes.json();if(!token.value)throw Error("الخادم لم يوفر مفتاحاً مؤقتاً للمكالمة.");
  const signal=fetchAbort.signal;
  const remote=await fetch("https://api.openai.com/v1/realtime/calls",{method:"POST",headers:{"Authorization":"Bearer "+token.value,"Content-Type":"application/sdp"},body:sdp,signal});
  if(!remote.ok)throw Error("مزود المكالمات رفض الجلسة: "+remote.status);
  await peer.setRemoteDescription({type:"answer",sdp:await remote.text()});
  updateStatus("اتصلنا بالخادم الصوتي. كنسناو افتتاح القناة…");
 }catch(error){
  const msg=error.name==="AbortError"?"أُلغيت المكالمة.":String(error.message||"تعذر الاتصال بالمكالمة.");
  cleanup();updateStatus(msg);
 }
}
start.addEventListener("click",begin);
end.addEventListener("click",()=>{endedByUser=true;cleanup();updateStatus("ساليتي المكالمة. الميكروفون موقف.")});
window.addEventListener("pagehide",()=>{endedByUser=true;cleanup()});
refresh();
})();