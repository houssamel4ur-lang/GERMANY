(function(){
"use strict";
var d=window.DM_PHONETICS,host=document.getElementById("phoneticsMount");
if(!d||!host)return;
var section="intro",current=0,firstTry=0,errors=0,wrong=false,sequence=0;
var voicePref="dm-phonetics-voice",stopId=0;
var menu=[["intro","📘 مقدمة"],["alphabet","🔤 الحروف"],["special","🔊 أصوات خاصة"],["vowels","🎵 طول الحركات"],["stress","🗣️ النبر"],["quiz","🎯 تمارين"],["results","🏆 النتيجة"]];
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function de(s){return '<span lang="de" dir="ltr" class="de">'+esc(s)+'</span>'}
function voices(){if(!("speechSynthesis" in window))return[];return speechSynthesis.getVoices().filter(function(v){return /^de(?:[-_]|$)/i.test(v.lang||"")})}
function selectedVoice(){var list=voices(),uri="";try{uri=localStorage.getItem(voicePref)||""}catch(e){}
return list.find(function(v){return v.voiceURI===uri})||list.find(function(v){return v.lang.toLowerCase().replace("_","-")==="de-de"})||list[0]||null}
function status(msg){var el=document.getElementById("voiceStatus");if(el)el.textContent=msg;else alert(msg)}
function refreshVoices(){
var select=document.getElementById("voiceSelect");if(!select)return;
var list=voices(),chosen=selectedVoice();
select.innerHTML="";
if(!list.length){var o=document.createElement("option");o.textContent="لا يوجد صوت ألماني";o.value="";select.add(o);select.disabled=true;status("الصوت الألماني غير متوفر. ثبّت حزمة German (Germany) في Windows ثم أعد فتح المتصفح. لن نستخدم صوتاً بلغة أخرى.");return}
select.disabled=false;
list.forEach(function(v){var o=document.createElement("option");o.textContent=v.name+" — "+v.lang;o.value=v.voiceURI;select.add(o)});
select.value=chosen.voiceURI;
status("الصوت الألماني المحدد: "+chosen.name+" ("+chosen.lang+")");
}
if("speechSynthesis" in window&&speechSynthesis.addEventListener)speechSynthesis.addEventListener("voiceschanged",refreshVoices);
function stop(){stopId++;if("speechSynthesis" in window)speechSynthesis.cancel()}
function say(text){
var v=selectedVoice();
if(!v){status("لن يتم التشغيل: لا يوجد صوت ألماني في جهازك أو متصفحك. ثبّت صوت German (Germany)، أو جرّب Edge/Chrome.");return}
stop();var id=stopId,r=+(document.getElementById("rate")?.value||.85),times=+(document.getElementById("repeats")?.value||1);
function once(){if(id!==stopId||times<=0)return;var utter=new SpeechSynthesisUtterance(text);utter.lang="de-DE";utter.voice=v;utter.rate=r;utter.pitch=1;
utter.onend=function(){if(id!==stopId)return;times--;if(times)once();else status("انتهى الاستماع بالصوت الألماني.")};
utter.onerror=function(){status("تعذر تشغيل الصوت الألماني المختار. اختر صوتاً ألمانياً آخر أو ثبّت الحزمة في Windows.")};
speechSynthesis.speak(utter)}
status("جارٍ الاستماع بصوت ألماني: "+v.name);once();
}
function controls(){return '<div class="panel"><div class="controls"><label>صوت German <select id="voiceSelect"></select></label><label>السرعة <select id="rate"><option value=".65">بطيئة</option><option selected value=".85">متوسطة</option><option value="1">عادية</option></select></label><label>التكرار <select id="repeats"><option value="1">مرة</option><option value="2">مرتان</option><option value="3">ثلاث مرات</option></select></label><button class="outline" data-say="Guten Morgen">🔊 جرّب Guten Morgen</button><button class="outline" data-stop>■ إيقاف</button></div><div class="tiny" id="voiceStatus" role="status">يُسمح فقط بالأصوات ذات اللغة الألمانية.</div></div>'}
function sample(word,explanation){
return '<div class="wordrow"><div>'+de(word)+'<small>'+esc(explanation)+'</small></div><button class="speak" data-say="'+esc(word)+'">🔊 استمع</button></div>'
}
function render(){
stop();
var body="",intro='<div class="crumb"><a href="syllabus.html?level=A1">الفهرس A1</a> / الحروف والنطق</div><div class="lessonhero"><span class="eyebrow">A1 · المحور 01</span><h1>الحروف والنطق</h1><p>'+esc(d.goal)+'</p></div>';
if(section==="intro")body='<h2>الدرس الأول — الحروف والنطق الألماني</h2><p>سنتعلم الأبجدية الألمانية، الأصوات ä وö وü وß، الفرق بين ch وsch، والحركات الطويلة والقصيرة، ونطق المقاطع والنبر.</p><div class="notice">النطق بالحروف العربية مساعد تقريبي فقط. لا تعتمد عليه بديلاً عن الاستماع إلى الصوت الألماني.</div>'+controls()+'<div class="panel article"><h3>المهارات المستهدفة</h3><ol><li>تهجئة الاسم بالألمانية.</li><li>التعرف إلى الحروف الكبيرة والصغيرة.</li><li>تمييز الأصوات الألمانية الخاصة في كلمات حقيقية.</li><li>التفريق بين حركة طويلة وأخرى قصيرة.</li><li>تطبيق ما تعلمته في 10 أسئلة قصيرة.</li></ol></div>';
if(section==="alphabet")body='<h2>الحروف الألمانية</h2><p>استمع إلى كل حرف في عبارة طبيعية من نوع «A wie Apfel». في الألمانية توجد 26 حرفاً أساسياً إضافة إلى ä وö وü وß في الكتابة.</p>'+controls()+'<div class="lessongrid">'+d.letters.map(function(x){return '<div class="lessoncard"><span class="badge">'+esc(x[0])+'</span><h3>'+de(x[1])+'</h3><p>'+esc(x[2])+'</p><button class="speak" data-say="'+esc(x[0]+" wie "+x[1])+'">🔊 استمع</button></div>'}).join("")+'</div>';
if(section==="special")body='<h2>الأصوات المميزة</h2><p>الصوت المكتوب لا يطابق دائماً النطق العربي. قارن الأمثلة واستمع إليها.</p>'+controls()+d.special.map(function(x){return '<div class="wordrow"><div><strong dir="ltr">'+esc(x[0])+'</strong><div>'+de(x[1])+'</div><small>'+esc(x[2])+'</small></div><button class="speak" data-say="'+esc(x[1])+'">🔊</button></div>'}).join("");
if(section==="vowels")body='<h2>الحركات الطويلة والقصيرة</h2><p>اختلاف طول الحركة قد يغير معنى الكلمة. استمع إلى كل زوج عدة مرات.</p>'+controls()+d.longShort.map(function(x){return '<div class="panel"><div class="controls">'+de(x[0])+' <b>↔</b> '+de(x[1])+'</div><p>'+esc(x[2])+'</p><div class="controls"><button class="speak" data-say="'+esc(x[0])+'">🔊 '+esc(x[0])+'</button><button class="speak" data-say="'+esc(x[1])+'">🔊 '+esc(x[1])+'</button></div></div>'}).join("");
if(section==="stress")body='<h2>النبر على المقاطع</h2><p>في الألمانية لا يوجد موضع واحد ثابت للنبر في كل الكلمات. كرر الأمثلة مع الانتباه إلى المقطع البارز.</p>'+controls()+d.stress.map(function(x){return sample(x[0],x[1])}).join("");
if(section==="quiz")body=renderQuiz();
if(section==="results"){
var result=loadResult();
body='<h2>تقييم درس الحروف والنطق</h2>'+(result?'<div class="panel"><strong>الصحيح من أول محاولة: '+result.first+'/10</strong><p>محاولات خاطئة قبل التصحيح: '+result.errors+'</p><p>الاجتياز التدريبي: '+(result.first>=8?"نعم":"ليس بعد")+'</p></div>':'<div class="notice">لم تكمل التمرين بعد.</div>')+'<button class="primary" data-restart>إعادة التمارين</button><p class="tiny">النتيجة تقيس الفهم في هذه الأسئلة، ولا تقيس جودة نطقك المسجل.</p>';
}
host.innerHTML=intro+'<div class="lessonlayout"><aside class="side"><b>أقسام الدرس</b>'+menu.map(function(x){return '<button class="tab '+(section===x[0]?"active":"")+'" data-tab="'+x[0]+'">'+x[1]+'</button>'}).join("")+'</aside><article class="study">'+body+'</article></div>';
refreshVoices();
}
function renderQuiz(){
if(current>=d.questions.length)return '<h2>انتهت التمارين</h2>';
var q=d.questions[current];
return '<span class="kicker">سؤال '+(current+1)+' / '+d.questions.length+'</span><div class="progress"><div style="width:'+current/d.questions.length*100+'%"></div></div><h2>'+esc(q.q)+'</h2>'+(q.audio?controls()+'<button class="speak" data-say="'+esc(q.audio)+'">🔊 استمع إلى السؤال</button>':'')+q.options.map(function(o,i){return '<button class="choice" data-answer="'+i+'">'+esc(o)+'</button>'}).join("")+'<div id="feedback" role="status"></div><p class="tiny">يظهر سؤال واحد في كل مرة؛ بعد الإجابة الصحيحة ينتقل إلى التالي.</p>';
}
function saveResult(){
var result={first:firstTry,errors:errors,ts:Date.now()};
try{localStorage.setItem("deutsch-mastery-phonetics-result",JSON.stringify(result))}catch(e){}
}
function loadResult(){try{return JSON.parse(localStorage.getItem("deutsch-mastery-phonetics-result")||"null")}catch(e){return null}}
host.addEventListener("click",function(e){
var b=e.target.closest("[data-tab]");if(b){section=b.dataset.tab;render();return}
b=e.target.closest("[data-say]");if(b){say(b.dataset.say);return}
b=e.target.closest("[data-stop]");if(b){stop();status("توقف الاستماع.");return}
b=e.target.closest("[data-restart]");if(b){current=0;firstTry=0;errors=0;wrong=false;section="quiz";render();return}
b=e.target.closest("[data-answer]");
if(!b||section!=="quiz")return;
var q=d.questions[current],a=Number(b.dataset.answer),feedback=document.getElementById("feedback");
if(a!==q.answer){wrong=true;errors++;b.classList.add("bad");feedback.innerHTML='<div class="feedback err">ليست الإجابة الصحيحة. راجع المثال وحاول مرة أخرى.</div>';return}
if(!wrong)firstTry++;
host.querySelectorAll("[data-answer]").forEach(function(el){el.disabled=true});
feedback.innerHTML='<div class="feedback">✓ صحيح! ننتقل للسؤال التالي.</div>';
var token=++sequence;
setTimeout(function(){if(token!==sequence||section!=="quiz")return;current++;wrong=false;if(current>=d.questions.length){saveResult();section="results"}render()},750);
});
host.addEventListener("change",function(e){if(e.target.id==="voiceSelect"){try{localStorage.setItem(voicePref,e.target.value)}catch(err){};refreshVoices()}});
render();
})();