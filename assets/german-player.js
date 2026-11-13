/* Deutsch Mastery — independent German MP3 playback.
   No speechSynthesis fallback: browser voice can be wrong-language. */
(function(){
  "use strict";
  let current=null, run=0;
  function notify(message){
    const targets=["audioStatus","voiceStatus"];
    targets.forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=message});
    let banner=document.getElementById("germanAudioNotice");
    if(!banner){
      banner=document.createElement("div");banner.id="germanAudioNotice";
      banner.setAttribute("role","status");banner.setAttribute("aria-live","polite");
      banner.style.cssText="position:fixed;bottom:16px;right:16px;max-width:min(420px,calc(100vw - 32px));z-index:110;padding:13px 17px;background:#103d34;color:#fff;border-radius:12px;box-shadow:0 14px 32px #0003;font-size:13px;line-height:1.8";
      document.body.appendChild(banner);
    }
    banner.textContent=message;banner.hidden=false;
    clearTimeout(notify.dismiss);
    notify.dismiss=setTimeout(()=>{banner.hidden=true},5500);
  }
  function silence(){
    run++;
    if(current){
      try{current.pause();current.currentTime=0;current.src="";current.load()}catch(_){}
      current=null;
    }
    try{window.speechSynthesis?.cancel()}catch(_){}
  }
  function playGerman(text){
    const map=window.DM_AUDIO_MAP||{},path=map[text];
    silence();
    if(!path){
      notify("ما كاينش تسجيل ألماني جاهز لهاد العبارة حالياً. ما غاديش نشغّل صوت المتصفح بلغة أخرى.");
      return;
    }
    const rate=Number(document.getElementById("rate")?.value||document.getElementById("speed")?.value||1);
    let remaining=Number(document.getElementById("repeats")?.value||document.getElementById("repeat")?.value||1);
    const thisRun=run, audio=new Audio(new URL(path,document.baseURI).href);
    audio.preload="auto";
    audio.playbackRate=Math.max(.55,Math.min(1.25,rate));
    current=audio;
    audio.onended=()=>{
      if(thisRun!==run)return;
      remaining--;
      if(remaining>0){audio.currentTime=0;audio.play().catch(()=>notify("تعذرت إعادة الصوت الألماني."))}
      else{current=null;notify("انتهى الاستماع للتسجيل الألماني.")}
    };
    audio.onerror=()=>{if(thisRun===run){current=null;notify("تعذر تحميل ملف MP3 الألماني. جرّب تحديث الصفحة باستعمال Ctrl + F5.")}};
    notify("🔊 النطق الألماني المسجّل (de-DE) — ملف MP3 مستقل عن لغة جهازك.");
    audio.play().catch(()=>notify("المتصفح منع تشغيل MP3. اضغط السماعة مرة أخرى."));
  }
  document.addEventListener("click",function(event){
    const speakButton=event.target.closest("[data-say]");
    const stopButton=event.target.closest("[data-stop]");
    if(speakButton||stopButton){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(speakButton)playGerman(speakButton.dataset.say);
      else{silence();notify("توقف الاستماع.");}
      return;
    }
    if(event.target.closest("[data-tab],[data-phontab]"))silence();
  },true);
  function renderAudioControls(){
    for(const id of ["germanVoice","voiceSelect"]){
      const select=document.getElementById(id);
      if(select){const label=select.closest("label");if(label&&label.style.display!=="none")label.style.display="none";}
    }
    for(const id of ["audioStatus","voiceStatus"]){
      const status=document.getElementById(id);
      if(status&&(/لا يوجد صوت ألماني|صوت ألماني مثبت|محرك النطق المتاح|يُسمح فقط بالأصوات/.test(status.textContent||""))){
        status.textContent="الاستماع من تسجيلات MP3 ألمانية مستقلة. اختر السرعة والتكرار ثم اضغط السماعة.";
      }
    }
  }
  renderAudioControls();
  new MutationObserver(renderAudioControls).observe(document.body,{childList:true,subtree:true});
  window.addEventListener("pagehide",silence);
})();