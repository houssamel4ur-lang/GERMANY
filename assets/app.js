
(function(){
'use strict';
var LESSONS=window.DM_LESSONS||[];
var LEVELS=['A1','A2','B1','B2'];
var LABELS=['المبتدئ','ما بعد الأساس','المتوسط','فوق المتوسط'];
var KEY='deutsch-mastery-germany-v1';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
function escapeHTML(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function german(s){return '<span lang="de" dir="ltr" class="de">'+escapeHTML(s)+'</span>'}
function href(l){return 'lesson.html?id='+encodeURIComponent(l.id)}
function initial(){return {completed:{},attempts:{},cards:{},last:null,studySeconds:0,errors:[]}}
function load(){try{return Object.assign(initial(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return initial()}}
var progress=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch(e){console.warn('Storage is not available',e)}}
function shuffled(items){var a=items.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function normalize(s){return String(s||'').normalize('NFKC').toLowerCase().trim().replace(/[.!?؟،,;:]+$/g,'').replace(/\s+/g,' ')}
var activeSpeech=null, speechRun=0;
var voiceChoiceKey='deutsch-mastery-german-voice-v1';
function isGermanVoice(v){return v&&/^de(?:[-_]|$)/i.test(String(v.lang||''))}
function germanVoices(){
 if(!('speechSynthesis' in window))return [];
 try{return Array.from(window.speechSynthesis.getVoices()).filter(isGermanVoice)}
 catch(e){return []}
}
function chosenGermanVoice(){
 var voices=germanVoices(),choice='';
 try{choice=localStorage.getItem(voiceChoiceKey)||''}catch(e){}
 return voices.find(function(v){return v.voiceURI===choice})||
 voices.find(function(v){return v.lang.toLowerCase().replace('_','-')==='de-de'})||voices[0]||null;
}
function audioMessage(message){
 var s=$('#audioStatus');if(s)s.textContent=message;
 var floating=$('#globalAudioNotice');
 if(!floating){floating=document.createElement('div');floating.id='globalAudioNotice';floating.setAttribute('role','status');
 floating.style.cssText='position:fixed;bottom:20px;right:20px;z-index:60;background:#123934;color:white;max-width:390px;padding:13px 17px;border-radius:12px;font-size:13px;line-height:1.8;box-shadow:0 10px 30px #12393440';
 document.body.appendChild(floating)}
 floating.textContent=message;floating.hidden=false;
 clearTimeout(audioMessage.timer);audioMessage.timer=setTimeout(function(){floating.hidden=true},7000);
}
function updateGermanVoiceSelect(){
 var select=$('#germanVoice');if(!select)return;
 var voices=germanVoices(),active=chosenGermanVoice();
 select.innerHTML='';
 if(!voices.length){
  var none=document.createElement('option');none.value='';none.textContent='لا يوجد صوت ألماني في المتصفح';select.appendChild(none);
  select.disabled=true;
  var msg=$('#audioStatus');if(msg)msg.textContent='لا يمكن تشغيل النطق دون صوت ألماني. ثبّت صوت German (Germany) في إعدادات Windows، ثم أعد تشغيل المتصفح.';
  return;
 }
 select.disabled=false;
 voices.forEach(function(v){var op=document.createElement('option');op.value=v.voiceURI;op.textContent=v.name+' — '+v.lang;select.appendChild(op)});
 select.value=active.voiceURI;
}
if('speechSynthesis' in window){
 try{window.speechSynthesis.addEventListener('voiceschanged',updateGermanVoiceSelect)}catch(e){}
}
document.addEventListener('change',function(e){
 if(e.target&&e.target.id==='germanVoice'){
  var v=germanVoices().find(function(x){return x.voiceURI===e.target.value});
  if(v)try{localStorage.setItem(voiceChoiceKey,v.voiceURI)}catch(err){}
 }
});
function speak(text){
 if(!text||!String(text).trim())return;
 if(!('speechSynthesis' in window)){
  audioMessage('متصفحك لا يدعم تشغيل النطق الألماني.');return;
 }
 var voice=chosenGermanVoice();
 if(!voice){
  audioMessage('لا يوجد صوت ألماني (de-DE) متاح حالياً. أوقفنا التشغيل حتى لا تسمع نطقاً عربياً أو إنجليزياً غير صحيح. ثبّت صوت German في Windows أو افتح الموقع على متصفح يوفر صوتاً ألمانياً.');
  updateGermanVoiceSelect();return;
 }
 stopAudio(true);
 var run=++speechRun,remaining=Number($('#repeat')?$('#repeat').value:1),rate=Number($('#speed')?$('#speed').value:.85);
 function sayOnce(){
  if(run!==speechRun||remaining<=0)return;
  var u=new SpeechSynthesisUtterance(String(text));u.lang='de-DE';u.voice=voice;u.rate=rate;u.pitch=1;
  activeSpeech=u;
  u.onend=function(){if(run!==speechRun)return;remaining--;if(remaining>0)sayOnce();else{activeSpeech=null;var s=$('#audioStatus');if(s)s.textContent='انتهى تشغيل الصوت الألماني.'}};
  u.onerror=function(){if(run!==speechRun)return;activeSpeech=null;audioMessage('فشل تشغيل الصوت الألماني المحدد. جرّب صوتاً ألمانياً آخر أو ثبّت حزمة German في جهازك.')};
  try{window.speechSynthesis.speak(u)}catch(e){audioMessage('فشل تشغيل الصوت الألماني: '+e.message)}
 }
 var s=$('#audioStatus');if(s)s.textContent='يُشغّل الصوت الألماني: '+voice.name+' ('+voice.lang+')';
 sayOnce();
}
function stopAudio(silent){
 speechRun++;
 if('speechSynthesis' in window)try{window.speechSynthesis.cancel()}catch(e){}
 activeSpeech=null;
 if(!silent){var x=$('#audioStatus');if(x)x.textContent='أُوقف الصوت.'}
}
document.addEventListener('click',function(e){
 var b=e.target.closest('[data-say]');if(b)speak(b.dataset.say);
 if(e.target.closest('[data-stop]'))stopAudio(false);
});
function audioControls(){return '<div class="controls"><label>صوت ألماني <select id="germanVoice" aria-label="اختر صوتاً ألمانياً فقط"><option>تحميل الأصوات الألمانية…</option></select></label><label>السرعة <select id="speed"><option value=".65">بطيئة</option><option value=".85" selected>متوسطة</option><option value="1">طبيعية</option></select></label><label>التكرار <select id="repeat"><option value="1">مرة</option><option value="2">مرتان</option><option value="3">ثلاث مرات</option></select></label><button class="outline" data-say="Guten Morgen" type="button">🔊 اختبر النطق</button><button class="outline" data-stop type="button">■ إيقاف</button></div><p class="tiny" id="audioStatus" role="status">تُعرض الأصوات ذات اللغة الألمانية فقط؛ إذا لم تتوفر فلن نستعمل صوتاً بلغة أخرى.</p>'}
function wordRow(w,lesson,index,bookmark){var id=lesson.id+':'+index,card=progress.cards[id];
return '<div class="wordrow"><div>'+german(w.de)+'<small>'+escapeHTML(w.ar)+(w.pron?' — '+escapeHTML(w.pron):'')+'</small></div><div class="rowactions"><button class="speak" data-say="'+escapeHTML(w.de)+'" aria-label="الاستماع للكلمة" type="button">🔊</button>'+(bookmark?'<button class="outline" data-save="'+escapeHTML(id)+'" type="button">'+(card?'★ محفوظة':'☆ احفظ')+'</button>':'')+'</div></div>'
}
function initHome(){var level='A1',query='';
var grid=$('#lessonGrid'),levelGrid=$('#levelGrid');
function render(){levelGrid.innerHTML=LEVELS.map(function(x,i){return '<button type="button" data-level="'+x+'" class="levelcard '+(level===x?'active':'')+'"><span class="lv">'+x+'</span><h3>'+LABELS[i]+'</h3><p>'+LESSONS.filter(function(l){return l.level===x}).length+' درساً موزعاً على موضوعات المستوى</p><small>اكتشف الدروس ←</small></button>'}).join('');
$('#lessonsHeading').textContent='دروس المستوى '+level;
var ls=LESSONS.filter(function(l){return l.level===level&&(l.title+' '+l.focus+' '+l.grammar).includes(query)});
grid.innerHTML=ls.length?ls.map(function(l){return '<a class="lessoncard" href="'+href(l)+'"><span class="badge">'+l.level+' · '+String(l.n).padStart(2,'0')+'</span><h3>'+escapeHTML(l.title)+'</h3><p>'+escapeHTML(l.focus)+'</p><small>'+(progress.completed[l.id]?'✓ أنهيت تدريب الدرس':'فتح صفحة الدرس ←')+'</small></a>'}).join(''):'<p class="notice">لم نعثر على دروس بهذا الاسم.</p>';
$$('[data-level]',levelGrid).forEach(function(b){b.onclick=function(){level=b.dataset.level;render()}});
}
var wordCount=LESSONS.reduce(function(s,l){return s+l.words.length},0);
$('#summary').innerHTML='<div class="stat"><div>📚</div><div><b>'+LESSONS.length+' درساً</b><span>مسار من A1 إلى B2</span></div></div><div class="stat"><div>🔊</div><div><b>'+wordCount+' مفردة وعبارة</b><span>زر صوت مع كل مدخل</span></div></div><div class="stat"><div>🧠</div><div><b>تمارين ومراجعة</b><span>تقدّم محفوظ محلياً</span></div></div>';
$('#searchLesson').addEventListener('input',function(e){query=e.target.value.trim();render()});render();
}
var lesson=null,tab='intro',questions=[],questionIndex=0,wrongOnQuestion=false,firstTry=0,wrongTotal=0,orderSelection=[];
function titleBlock(title,description){return '<span class="kicker">'+lesson.level+' · '+String(lesson.n).padStart(2,'0')+'</span><h2>'+escapeHTML(title)+'</h2><p class="sub">'+escapeHTML(description)+'</p>'}
function initLesson(){
var id=new URLSearchParams(location.search).get('id');lesson=LESSONS.find(function(l){return l.id===id});
if(!lesson){$('#lessonMount').innerHTML='<div class="panel"><h1>لم نعثر على هذا الدرس</h1><a class="primary" href="index.html">العودة إلى الرئيسية</a></div>';return}
progress.last=lesson.id;save();document.title=lesson.title+' | Deutsch Mastery';
var tabs=[['intro','📘 مقدمة'],['vocab','📗 مفردات'],['audio','🔊 صوتيات'],['grammar','📐 قواعد'],['dialogue','💬 محادثة'],['reading','📖 قراءة'],['quiz','🎯 تمارين'],['results','🏆 تقييم']];
var index=LESSONS.indexOf(lesson),next=LESSONS[index+1];
$('#lessonMount').innerHTML='<div class="crumb"><a href="index.html">الرئيسية</a> / '+lesson.level+' / '+escapeHTML(lesson.title)+'</div><div class="lessonhero"><span class="eyebrow">'+lesson.level+' · LEKTION '+String(lesson.n).padStart(2,'0')+'</span><h1>'+escapeHTML(lesson.title)+'</h1><p>'+escapeHTML(lesson.focus)+' — '+lesson.minutes+' دقيقة مقترحة</p></div><div class="lessonlayout"><aside class="side" aria-label="أقسام الدرس"><b>أقسام الدرس</b>'+tabs.map(function(t){return '<button type="button" class="tab" data-tab="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</aside><article class="study" id="study"></article></div><div class="controls" style="justify-content:space-between;margin-top:25px"><a class="outline" href="index.html#lessons">كل الدروس</a>'+(next?'<a class="primary" href="'+href(next)+'">الدرس التالي ←</a>':'')+'</div>';
$$('[data-tab]').forEach(function(b){b.onclick=function(){stopAudio();tab=b.dataset.tab;renderTab()}});
renderTab();
}
function renderTab(){
$$('[data-tab]').forEach(function(b){b.classList.toggle('active',b.dataset.tab===tab)});
var text='';
if(tab==='intro')text=titleBlock(lesson.title,lesson.focus)+'<div class="panel article"><h3>هدف هذا الدرس</h3><p>'+escapeHTML(lesson.focus)+'</p><p>استمع إلى المفردات، اقرأ مثال الدرس، ثم انتقل إلى القواعد والتمارين. دوّن العبارات الجديدة واستخدمها في حديثك.</p><p>الوقت المقترح: '+lesson.minutes+' دقيقة.</p></div><div class="story">'+german(lesson.reading)+'<p>'+escapeHTML(lesson.textAr)+'</p></div><button class="primary" data-next-tab="vocab">ابدأ بالمفردات ←</button>';
if(tab==='vocab')text=titleBlock('مفردات الدرس','استمع واحفظ الكلمات الصعبة للمراجعة المتباعدة.')+audioControls()+lesson.words.map(function(w,i){return wordRow(w,lesson,i,true)}).join('')+'<p class="tiny">النطق بالحروف العربية عند توفره هو مساعد فقط؛ تعلّم النطق بالاستماع.</p>';
if(tab==='audio')text=titleBlock('الصوتيات','هذا القسم خاص بالكلمات والجمل المسموعة في هذا الدرس.')+audioControls()+lesson.words.map(function(w,i){return wordRow(w,lesson,i,false)}).join('')+'<h3>استماع إلى الجملة</h3><div class="wordrow"><div>'+german(lesson.reading)+'<small>'+escapeHTML(lesson.textAr)+'</small></div><button class="speak" data-say="'+escapeHTML(lesson.reading)+'">🔊</button></div>';
if(tab==='grammar')text=titleBlock('قواعد اللغة','قاعدة مرتبطة بموضوع الدرس مع مثال تطبيقي.')+'<div class="panel article"><h3>'+escapeHTML(lesson.title)+'</h3><p>'+escapeHTML(lesson.grammar)+'</p></div><div class="story">'+german(lesson.example)+'<p>'+escapeHTML(lesson.exampleAr)+'</p></div><button class="primary" data-next-tab="quiz">تدرّب على القاعدة ←</button>';
if(tab==='dialogue'){var d=lesson.dialogue||[[lesson.example,lesson.exampleAr]];text=titleBlock('المحادثة','استمع إلى الجمل وحاول تقليد النطق والإيقاع.')+audioControls()+d.map(function(x,i){return '<div class="wordrow"><div><small>المتحدث '+(i%2?'ب':'أ')+'</small>'+german(x[0])+'<small>'+escapeHTML(x[1])+'</small></div><button class="speak" data-say="'+escapeHTML(x[0])+'">🔊</button></div>'}).join('')+'<p class="notice">لا يتضمن هذا الإصدار تسجيل الصوت أو تقييماً آلياً موثوقاً للنطق.</p>'}
if(tab==='reading')text=titleBlock('قراءة وفهم','اقرأ النص قبل إظهار المعنى وتدرّب على الاستماع.')+audioControls()+'<div class="story">'+german(lesson.reading)+'<p>'+escapeHTML(lesson.textAr)+'</p><button class="speak" data-say="'+escapeHTML(lesson.reading)+'">🔊 الاستماع للنص</button></div><button class="primary" data-next-tab="quiz">ابدأ تمارين الفهم ←</button>';
if(tab==='quiz')text=titleBlock('تمارين الدرس','سؤال واحد تلو الآخر؛ يجري تصحيح الإجابة فوراً.')+'<div id="quizMount"></div>';
if(tab==='results'){var attempts=progress.attempts[lesson.id]||[],last=attempts[attempts.length-1];text=titleBlock('التقييم','النتائج من محاولاتك الحقيقية محفوظة على هذا الجهاز.')+(last?'<div class="panel"><h3>آخر محاولة</h3><p>إجابات صحيحة من أول محاولة: <b>'+last.first+' / '+last.total+'</b></p><p>إجابات خاطئة قبل التصحيح: '+last.errors+'</p><p>تاريخ المحاولة: '+new Date(last.ts).toLocaleString('ar')+'</p></div>':'<div class="notice">لم تنه اختبار الدرس بعد.</div>')+'<button class="primary" data-next-tab="quiz">إعادة التدريب ←</button>'}
$('#study').innerHTML=text;
updateGermanVoiceSelect();
$$('[data-next-tab]',$('#study')).forEach(function(b){b.onclick=function(){tab=b.dataset.nextTab;renderTab()}});
$$('[data-save]',$('#study')).forEach(function(b){b.onclick=function(){var k=b.dataset.save,i=Number(k.split(':').pop()),w=lesson.words[i];if(progress.cards[k])delete progress.cards[k];else progress.cards[k]={de:w.de,ar:w.ar,interval:0,due:Date.now(),lesson:lesson.id};save();renderTab()}});
if(tab==='quiz'){questions=makeQuestions(lesson);questionIndex=0;firstTry=0;wrongTotal=0;drawQuestion()}
}
function makeQuestions(l){
var pool=LESSONS.filter(function(x){return x.level===l.level&&x.id!==l.id}).flatMap(function(x){return x.words});
var all=l.words.concat(pool);
function alternatives(w,key){var opts=[w[key]],used=new Set(opts);shuffled(all).forEach(function(x){if(opts.length<4&&!used.has(x[key])){used.add(x[key]);opts.push(x[key])}});return shuffled(opts)}
var qs=shuffled(l.words.map(function(w,i){
if(i%4===0)return {kind:'listen',prompt:'استمع، ثم اختر المعنى الصحيح.',audio:w.de,options:alternatives(w,'ar'),answer:w.ar,hint:w.de+' — '+w.ar};
if(i%4===1)return {kind:'choice',prompt:'كيف تقول «'+w.ar+'» بالألمانية؟',options:alternatives(w,'de'),answer:w.de,hint:w.de+' — '+w.ar};
if(i%4===2)return {kind:'choice',prompt:'ما معنى: '+w.de+'؟',options:alternatives(w,'ar'),answer:w.ar,hint:w.de+' — '+w.ar};
return {kind:'type',prompt:'اكتب بالألمانية: '+w.ar,answer:w.de,hint:w.de+' — '+w.ar}
}));
var sentence=l.example.trim(),tokens=sentence.split(/\s+/);
if(tokens.length>=3&&tokens.length<=13)qs.push({kind:'order',prompt:'رتب الكلمات لتكوين الجملة.',tokens:shuffled(tokens),answer:sentence,hint:sentence});
var distractors=shuffled(LESSONS.filter(function(x){return x.level===l.level&&x.id!==l.id&&x.textAr!==l.textAr})).slice(0,3).map(function(x){return x.textAr});
qs.push({kind:'read',prompt:'اقرأ النص واختر الترجمة الصحيحة.',reading:l.reading,options:shuffled([l.textAr].concat(distractors)),answer:l.textAr,hint:l.textAr});
if(Array.isArray(l.comprehension)){l.comprehension.forEach(function(c){qs.push({kind:'read',prompt:c.q,reading:l.reading,options:shuffled(c.options),answer:c.answer,hint:c.explain||''})})}
return qs;
}
var questionSerial=0;
function drawQuestion(){
var mount=$('#quizMount');if(!mount)return;
if(questionIndex>=questions.length){finishQuiz();return}
var q=questions[questionIndex];questionSerial++;wrongOnQuestion=false;orderSelection=[];
var intro='<div class="controls" style="justify-content:space-between"><span class="tiny">السؤال '+(questionIndex+1)+' من '+questions.length+'</span><span class="badge">⭐ '+firstTry*10+' نقطة</span></div><div class="progress"><div style="width:'+Math.round(100*questionIndex/questions.length)+'%"></div></div><span class="kicker">'+({choice:'اختيار المعنى',listen:'الاستماع',type:'كتابة',order:'ترتيب الجملة',read:'فهم النص'}[q.kind])+'</span><h2 style="font-size:21px">'+escapeHTML(q.prompt)+'</h2>';
if(q.audio)intro+='<button class="speak" data-say="'+escapeHTML(q.audio)+'">🔊 استمع</button>';
if(q.reading)intro+='<div class="story">'+german(q.reading)+'</div>';
mount.innerHTML=intro+'<div id="questionInput"></div><div id="feedback" role="status"></div>';
var input=$('#questionInput');
if(q.options){input.innerHTML=q.options.map(function(o){return '<button type="button" class="choice" data-option="'+escapeHTML(o)+'" dir="auto">'+escapeHTML(o)+'</button>'}).join('');$$('[data-option]',input).forEach(function(b){b.onclick=function(){answer(b.dataset.option,b)}})}
else if(q.kind==='type'){input.innerHTML='<div class="controls"><input id="typed" class="field" type="text" dir="ltr" lang="de" autocomplete="off" placeholder="اكتب إجابتك بالألمانية"><button class="primary" id="checkTyped">تحقق</button></div>';var field=$('#typed');$('#checkTyped').onclick=function(){answer(field.value)};field.onkeydown=function(e){if(e.key==='Enter')answer(field.value)}}
else if(q.kind==='order'){input.innerHTML='<div class="answerbox" id="assembled"></div><div class="chips" id="tokens"></div><div class="controls"><button class="primary" id="checkOrder">تحقق</button><button class="outline" id="clearOrder">إعادة الترتيب</button></div>';drawTokens(q);$('#checkOrder').onclick=function(){answer(orderSelection.map(function(o){return o.word}).join(' '))};$('#clearOrder').onclick=function(){orderSelection=[];drawTokens(q)}}
}
function drawTokens(q){
var tokens=$('#tokens'),assembled=$('#assembled');if(!tokens||!assembled)return;
assembled.textContent=orderSelection.map(function(o){return o.word}).join(' ')||'انقر الكلمات بترتيب صحيح';
tokens.innerHTML=q.tokens.map(function(w,i){var used=orderSelection.some(function(t){return t.index===i});return '<button type="button" class="token" data-token="'+i+'" '+(used?'disabled':'')+'>'+escapeHTML(w)+'</button>'}).join('');
$$('[data-token]',tokens).forEach(function(b){b.onclick=function(){var i=Number(b.dataset.token);orderSelection.push({index:i,word:q.tokens[i]});drawTokens(q)}})
}
function answer(value,button){
var q=questions[questionIndex];if(!q)return;
if(normalize(value)===normalize(q.answer)){
if(!wrongOnQuestion)firstTry++;
$('#feedback').innerHTML='<div class="feedback">✓ إجابة صحيحة! '+escapeHTML(q.hint)+'</div>';
$$('#questionInput button').forEach(function(b){b.disabled=true});
var serial=questionSerial;
setTimeout(function(){if(serial!==questionSerial||tab!=='quiz')return;questionIndex++;drawQuestion()},850);
}else{
wrongOnQuestion=true;wrongTotal++;
progress.errors.push({lesson:lesson.id,question:q.prompt,date:Date.now()});progress.errors=progress.errors.slice(-300);save();
$('#feedback').innerHTML='<div class="feedback err">الإجابة ليست صحيحة. حاول مرة أخرى.</div>';
if(button){button.classList.add('bad');setTimeout(function(){button.classList.remove('bad')},450)}
if(q.kind==='order'){orderSelection=[];drawTokens(q)}
}
}
function finishQuiz(){
var passed=firstTry/questions.length>=.8;
if(!progress.attempts[lesson.id])progress.attempts[lesson.id]=[];
progress.attempts[lesson.id].push({first:firstTry,total:questions.length,errors:wrongTotal,ts:Date.now()});
progress.attempts[lesson.id]=progress.attempts[lesson.id].slice(-30);
if(passed)progress.completed[lesson.id]=Date.now();
save();
$('#quizMount').innerHTML='<div class="panel" style="text-align:center"><div style="font-size:44px">🏅</div><h2>انتهى اختبار الدرس</h2><p>الصحيح من أول محاولة: <b>'+firstTry+'/'+questions.length+'</b></p><p>الأخطاء المصححة: '+wrongTotal+'</p><p>'+(passed?'تم تسجيل اجتياز التدريب.':'حاول مرة أخرى للوصول إلى 80% من أول محاولة.')+'</p><div class="controls" style="justify-content:center"><button class="primary" id="again">إعادة التمرين</button><button class="outline" id="result">التقييم</button></div></div>';
$('#again').onclick=function(){questions=makeQuestions(lesson);questionIndex=0;firstTry=0;wrongTotal=0;drawQuestion()};
$('#result').onclick=function(){tab='results';renderTab()};
}
function timeFormat(s){return [Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(function(x){return String(x).padStart(2,'0')}).join(':')}
function initDashboard(){
var completed=Object.keys(progress.completed).length,sessions=Object.values(progress.attempts).reduce(function(a,b){return a+b.length},0),saved=Object.keys(progress.cards).length,last=LESSONS.find(function(x){return x.id===progress.last});
$('#dashboardMount').innerHTML='<div class="statgrid"><div class="panel"><strong>'+completed+'/'+LESSONS.length+'</strong><span>دروس اجتزت تدريبها</span></div><div class="panel"><strong>'+sessions+'</strong><span>اختبارات أنهيتها</span></div><div class="panel"><strong>'+saved+'</strong><span>مفردات محفوظة</span></div><div class="panel"><strong>'+Math.round(completed/Math.max(LESSONS.length,1)*100)+'%</strong><span>إنجاز وحدات المسار</span></div></div><div class="panel"><h2>تابع الدراسة</h2><a class="primary" href="'+href(last||LESSONS[0])+'">استكمل '+escapeHTML(last?last.title:'الدرس الأول')+' ←</a></div><div class="panel"><h2>خطة ساعتين يومياً</h2><div class="daily"><div><b>30 دقيقة</b>المفردات والقواعد</div><div><b>30 دقيقة</b>الاستماع والنطق</div><div><b>30 دقيقة</b>القراءة والمحادثة</div><div><b>30 دقيقة</b>التمارين والمراجعة</div></div><p class="tiny">اقتراح تنظيمي، وليس وعداً ببلوغ مستوى معيّن خلال مدة ثابتة.</p></div><div class="panel"><h2>مؤقت الدراسة</h2><p>يحسب الوقت بعد الضغط على بدء، ويتوقف إذا غادرت الصفحة.</p><div class="controls"><strong id="watch">00:00:00</strong><button class="primary" id="startWatch">بدء</button><button class="outline" id="stopWatch" disabled>إيقاف</button></div><p>إجمالي الوقت المسجل: <b id="totalWatch"></b></p></div><div class="panel"><h2>نسخة احتياطية من تقدمك</h2><div class="controls"><button class="primary" id="backup">تصدير البيانات</button><label class="outline">استيراد بيانات <input id="restore" type="file" accept=".json,application/json"></label></div><p id="backupStatus" role="status"></p></div>';
var running=false,session=0,lastTick=0,interval=null;
function paint(){$('#watch').textContent=timeFormat(session);$('#totalWatch').textContent=timeFormat(progress.studySeconds||0)}
function tick(){if(!running)return;var now=performance.now(),diff=Math.floor((now-lastTick)/1000);if(diff>0){session+=diff;progress.studySeconds+=diff;lastTick+=diff*1000;save();paint()}}
function pause(){if(!running)return;tick();running=false;clearInterval(interval);$('#startWatch').disabled=false;$('#stopWatch').disabled=true}
$('#startWatch').onclick=function(){running=true;lastTick=performance.now();interval=setInterval(tick,1000);$('#startWatch').disabled=true;$('#stopWatch').disabled=false};
$('#stopWatch').onclick=pause;document.addEventListener('visibilitychange',function(){if(document.hidden)pause()});window.addEventListener('pagehide',pause);paint();
$('#backup').onclick=function(){var blob=new Blob([JSON.stringify({app:KEY,data:progress},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='deutsch-mastery-backup.json';link.click();setTimeout(function(){URL.revokeObjectURL(url)},1000)};
$('#restore').onchange=async function(e){try{var file=e.target.files[0];if(!file)return;var data=JSON.parse(await file.text());if(data.app!==KEY||!data.data||typeof data.data.completed!=='object'||typeof data.data.cards!=='object'||typeof data.data.attempts!=='object')throw Error('invalid');if(!confirm('هل تريد استبدال التقدم الحالي بالبيانات المستوردة؟'))return;progress=Object.assign(initial(),data.data);save();location.reload()}catch(err){$('#backupStatus').textContent='ملف النسخة الاحتياطية غير صالح لهذا المشروع.'}};
}
function initReview(){
var mount=$('#reviewMount'),dueOnly=false,showing=false,active=null;
function schedule(card,success){card.interval=success?(card.interval?Math.min(card.interval*2,60):1):0;card.due=Date.now()+(success?card.interval:0)*86400000}
function render(){var cards=Object.entries(progress.cards).filter(function(entry){return !dueOnly||entry[1].due<=Date.now()});var due=Object.values(progress.cards).filter(function(c){return c.due<=Date.now()}).length;
if(!cards.length){mount.innerHTML='<div class="panel"><h2>مراجعة الكلمات</h2><p>لديك '+Object.keys(progress.cards).length+' كلمة محفوظة، '+due+' منها مستحقة الآن.</p><p>'+(Object.keys(progress.cards).length?'لا توجد بطاقات مستحقة وفق الاختيار الحالي.':'افتح درساً واحفظ بعض المفردات لتبدأ المراجعة.')+'</p><button class="outline" id="viewAll">عرض كل الكلمات</button></div>';$('#viewAll').onclick=function(){dueOnly=false;render()};return}
if(!active||!progress.cards[active]||(dueOnly&&progress.cards[active].due>Date.now()))active=cards[0][0];
var c=progress.cards[active];if(!c){render();return}
mount.innerHTML='<div class="panel"><div class="controls" style="justify-content:space-between"><strong>'+Object.keys(progress.cards).length+' محفوظة</strong><span class="badge">'+due+' مستحقة</span></div><label><input id="dueOnly" type="checkbox" '+(dueOnly?'checked':'')+'> عرض البطاقات المستحقة فقط</label><div class="flash">'+escapeHTML(c.de)+'</div><div class="flashmeaning">'+(showing?escapeHTML(c.ar):'اضغط إظهار المعنى لاختبار ذاكرتك')+'</div><div class="controls" style="justify-content:center"><button class="speak" data-say="'+escapeHTML(c.de)+'">🔊 استمع</button><button class="outline" id="flip">إظهار / إخفاء المعنى</button></div>'+(showing?'<div class="reviewbuttons"><button class="outline" id="missed">لا أتذكر</button><button class="primary" id="known">أتذكر جيداً</button></div>':'')+'<p class="tiny" style="text-align:center">فواصل المراجعة: يوم، يومان، أربعة، ثمانية... بناءً على إجاباتك.</p></div>';
$('#dueOnly').onchange=function(e){dueOnly=e.target.checked;active=null;showing=false;render()};
$('#flip').onclick=function(){showing=!showing;render()};
['missed','known'].forEach(function(id){var b=$('#'+id);if(b)b.onclick=function(){schedule(c,id==='known');save();showing=false;var next=Object.entries(progress.cards).filter(function(t){return !dueOnly||t[1].due<=Date.now()}).find(function(t){return t[0]!==active});active=next?next[0]:null;render()}});
}render()
}
function initAssessment(){
var mount=$('#assessmentMount'),level='A1',items=[],i=0,correct=0;
function setup(){var source=LESSONS.filter(function(l){return l.level===level});items=shuffled(source.flatMap(function(l){return l.words.map(function(w){return {de:w.de,ar:w.ar}})})).slice(0,12);i=0;correct=0;render()}
function render(){if(i>=items.length){mount.innerHTML='<div class="panel"><h2>نتيجة التدريب '+level+'</h2><p>إجابات صحيحة: '+correct+' / '+items.length+'</p><p>هذا اختبار مفردات قصير فقط، وليس شهادة أو قياساً كاملاً لمهارات CEFR.</p><button class="primary" id="againAssess">إعادة الاختبار</button></div>';$('#againAssess').onclick=setup;return}
var item=items[i],options=[item.ar],pool=shuffled(LESSONS.filter(function(l){return l.level===level}).flatMap(function(l){return l.words.map(function(w){return w.ar})}));
for(var k=0;k<pool.length&&options.length<4;k++)if(!options.includes(pool[k]))options.push(pool[k]);
options=shuffled(options);
mount.innerHTML='<div class="panel"><label>المستوى <select id="assessLevel">'+LEVELS.map(function(x){return '<option '+(level===x?'selected':'')+'>'+x+'</option>'}).join('')+'</select></label><div class="divider"></div><p class="tiny">السؤال '+(i+1)+' / '+items.length+'</p><div class="progress"><div style="width:'+100*i/items.length+'%"></div></div><h2>ما معنى هذه الكلمة؟</h2><div class="story">'+german(item.de)+' <button class="speak" data-say="'+escapeHTML(item.de)+'">🔊</button></div>'+options.map(function(x){return '<button class="choice" data-opt="'+escapeHTML(x)+'">'+escapeHTML(x)+'</button>'}).join('')+'<p id="assessFeedback" role="status"></p></div>';
$('#assessLevel').onchange=function(e){level=e.target.value;setup()};
$$('[data-opt]').forEach(function(b){b.onclick=function(){var good=b.dataset.opt===item.ar;if(good)correct++;$$('[data-opt]').forEach(function(btn){btn.disabled=true});$('#assessFeedback').innerHTML='<div class="feedback '+(good?'':'err')+'">'+(good?'✓ صحيح':'الإجابة الصحيحة: '+escapeHTML(item.ar))+'</div>';setTimeout(function(){i++;render()},900)}})
}setup()
}

function initSyllabus(){
 var data=window.DM_SYLLABUS||[],node=$('#syllabusMount'),params=new URLSearchParams(location.search),
 level=String(params.get('level')||'A1').toUpperCase(),unit=Number(params.get('unit'));
 if(!LEVELS.includes(level))level='A1';
 if(!data.length){node.innerHTML='<div class="notice">تعذر تحميل فهرس المنهج.</div>';return}
 var course=data.filter(function(x){return x.level===level}),picked=course.find(function(x){return x.number===unit});
 if(picked){
 document.title= picked.title+' ('+level+') | منهج Deutsch Mastery';
 var next=course.find(function(x){return x.number===unit+1});
 node.innerHTML='<div class="crumb"><a href="index.html">الرئيسية</a> / <a href="syllabus.html?level='+level+'">فهرس '+level+'</a> / '+escapeHTML(picked.title)+'</div>'+
 '<div class="lessonhero"><span class="eyebrow">الفهرس المعتمد · '+level+' / '+String(picked.number).padStart(2,'0')+'</span><h1>'+escapeHTML(picked.title)+'</h1><p>'+escapeHTML(picked.section)+' — حسب الملف المرجعي، الصفحة '+picked.sourcePage+'</p></div>'+
 '<div class="panel article"><h2>ما الذي يجب أن تتعلمه في هذا المحور؟</h2><ol>'+picked.points.map(function(p){return '<li>'+escapeHTML(p)+'</li>'}).join('')+'</ol>'+
 '<div class="notice">هذه صفحة أهداف وفهرس كما ورد في ملفك، وليست درساً تعليمياً مكتملاً. سنُطوّر الشرح والأمثلة والاستماع والتمارين لكل نقطة، دون احتساب المحور مكتملاً قبل ذلك.</div></div>'+
 '<div class="controls" style="justify-content:space-between"><a class="outline" href="syllabus.html?level='+level+'">← العودة إلى فهرس '+level+'</a>'+(next?'<a class="primary" href="syllabus.html?level='+level+'&unit='+next.number+'">المحور التالي ←</a>':'<a class="primary" href="index.html#levels">الدروس التطبيقية الموجودة ←</a>')+'</div>';
 return;
 }
 document.title='المنهج المعتمد A1–B2 | Deutsch Mastery';
 node.innerHTML='<div class="pagehead"><span class="overline">PDF-BASED LEARNING ROADMAP</span><h1>المنهج المعتمد من A1 إلى B2</h1><p>الفهرس الذي قدمته: 16 محوراً لكل مستوى، مع النقاط التفصيلية المطلوبة. هذه خطة المحتوى المعتمدة من الآن فصاعداً.</p></div>'+
 '<div class="levelgrid">'+LEVELS.map(function(x){return '<a class="levelcard '+(x===level?'active':'')+'" href="syllabus.html?level='+x+'"><span class="lv">'+x+'</span><h3>'+({A1:'الأساسيات والتواصل البسيط',A2:'المواقف اليومية وتوسيع التعبير',B1:'الاستقلالية والتعبير المترابط',B2:'النقاش والفهم والتعبير المفصل'})[x]+'</h3><small>16 محوراً مفصلاً ←</small></a>'}).join('')+'</div>'+
 '<div class="panel" style="margin-top:22px"><h2>محتويات مستوى '+level+'</h2><p class="tiny">الترتيب مطابق للفهرس المرجعي، ومقسّم إلى القواعد، المفردات والتواصل، ثم المهارات الأربع.</p></div>'+
 ['القواعد','المفردات والتواصل','المهارات الأربع'].map(function(section){
 var subset=course.filter(function(x){return x.section===section});
 return '<section class="section" style="padding-top:20px"><span class="overline">'+level+'</span><h2>'+section+'</h2><div class="lessongrid">'+subset.map(function(x){
 return '<a class="lessoncard" href="'+(x.level==='A1'&&x.number===1?'alphabet.html':'syllabus.html?level='+level+'&unit='+x.number)+'"><span class="badge">المحور '+String(x.number).padStart(2,'0')+'</span><h3>'+escapeHTML(x.title)+'</h3><p>'+x.points.slice(0,2).map(escapeHTML).join(' • ')+'</p><small>تفاصيل المحور ←</small></a>'
 }).join('')+'</div></section>';
 }).join('')+
 '<div class="caution">هذه 64 محاور منهجية مستخرجة من ملف الفهرس، وليست 64 درساً مكتمل المحتوى. <a href="index.html#levels">الدروس التدريبية الحالية</a> منفصلة عن قائمة المتطلبات وسيجري توحيدها تدريجياً.</div>';
}

if(!LESSONS.length){console.error('Missing curriculum data');return}
var page=document.body.dataset.page;
if(page==='home')initHome();
if(page==='lesson')initLesson();
if(page==='dashboard')initDashboard();
if(page==='review')initReview();
if(page==='assessment')initAssessment();
if(page==='syllabus')initSyllabus();
})();
