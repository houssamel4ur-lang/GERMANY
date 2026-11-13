/* Deutsch Mastery — PDF-based 2026 course. Independent topics are only
   marked complete when actual content and a scored quiz exist. */
(function(){
"use strict";
const mount=document.getElementById("curriculumApp");
if(!mount)return;
const groups=window.DM_CURRICULUM_GROUPS||[];
const topics=window.DM_CURRICULUM||[];
const lessons=window.DM_CURRICULUM_LESSONS||{};
const packs=[
...(window.DM_COURSE_A1_PART1||[]).map(x=>({...x,level:"A1"})),
...(window.DM_COURSE_A1_PART2||[]).map(x=>({...x,level:"A1"})),
...(window.DM_COURSE_A2_PART1||[]).map(x=>({...x,level:"A2"})),
...(window.DM_COURSE_A2_PART2||[]).map(x=>({...x,level:"A2"}))
].sort((a,b)=>a.level.localeCompare(b.level)||a.n-b.n);
const STORAGE="deutsch-mastery-curriculum-2026-v1";
function read(){try{const obj=JSON.parse(localStorage.getItem(STORAGE)||"{}");return {completed:obj.completed||{},attempts:obj.attempts||{},last:obj.last||null}}catch(e){return {completed:{},attempts:{},last:null}}}
let state=read();
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch(e){}}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function displayDE(x){return '<span class="de" dir="ltr" lang="de">'+esc(x)+'</span>'}
function shuffle(data){const copy=[...data];for(let i=copy.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function audioTools(){return '<div class="controls"><label>السرعة <select id="rate"><option value=".7">بطيئة</option><option value=".85" selected>متوسطة</option><option value="1">طبيعية</option></select></label><label>التكرار <select id="repeats"><option value="1">مرة</option><option value="2">مرتان</option><option value="3">3 مرات</option></select></label><button class="outline" data-stop>■ إيقاف</button></div><p class="tiny" id="audioStatus">تُشغَّل تسجيلات MP3 بالألمانية فقط. الجملة التي لم يُجهَّز لها تسجيل لن تُقرأ بصوت آخر.</p>'}
function speakRow(x){return '<div class="curri-ex"><div>'+displayDE(x.de)+'<div class="translation">'+esc(x.ar)+'</div></div><button data-say="'+esc(x.de)+'" type="button">🔊 استمع</button></div>'}
function crumb(level,label){return '<div class="crumb"><a href="curriculum.html?level='+level+'">الفهرس '+level+'</a> / '+esc(label)+'</div>'}
const labels={A1:"المبتدئ",A2:"الأساسي المتقدم",B1:"المتوسط",B2:"فوق المتوسط"};
const completed=id=>Boolean(state.completed[id]);
function initCatalog(){
const params=new URLSearchParams(location.search);
let level=["A1","A2","B1","B2"].includes(params.get("level"))?params.get("level"):"A1";
let query="";
const summary=()=>['A1','A2','B1','B2'].map(l=>[l,topics.filter(t=>t.level===l).length]).map(([l,n])=>'<div class="coursemetric"><b>'+l+'</b><span>'+n+' موضوعاً — '+labels[l]+'</span></div>').join("");
function render(){
const selected=groups.filter(g=>g.level===level);
const matches=selected.map(g=>({...g,topics:g.topics.filter(t=>(t.title+' '+g.section).toLowerCase().includes(query))})).filter(g=>g.topics.length);
const liveCount=selected.flatMap(g=>g.topics).filter(t=>lessons[t.id]).length;
mount.innerHTML='<div class="coursehero"><span class="overline">المنهج المعتمد • 16 صفحة PDF</span><h1>452 موضوعاً من A1 حتى B2</h1><p>الفهرس الجديد كما طلبت، مع صفحات مستقلة لكل موضوع. المواضيع التي اكتمل إعدادها فيها شرح وتسجيلات صوتية وتمارين؛ والباقي تظهر حالته بوضوح دون ادعاء اكتماله.</p><a class="btn light" href="study.html?id=a1-g01-01">ابدأ من أول درس ←</a></div>'+
 '<div class="coursemetrics">'+summary()+'</div>'+
 '<div class="courselevels">'+['A1','A2','B1','B2'].map(l=>'<button type="button" data-level="'+l+'" class="'+(l===level?'active':'')+'">'+l+' — '+labels[l]+'</button>').join('')+'</div>'+
 '<div class="coursefilter"><label for="topicFilter">ابحث عن موضوع</label><input id="topicFilter" type="search" value="'+esc(query)+'" placeholder="مثلاً: النفي أو الأرقام أو Perfekt..."></div>'+
 '<p class="tiny">'+liveCount+' درساً مستقلاً مكتوباً في هذا المستوى، والباقي في فهرس الإعداد. <a href="practice.html">وحدات تطبيقية إضافية A1/A2</a></p>'+
 (matches.length?matches.map(g=>'<section class="groupbox"><div class="overline">'+g.level+' / '+String(g.group).padStart(2,'0')+'</div><h2>'+esc(g.section)+'</h2><p class="groupmeta">'+g.topics.length+' موضوعاً معروضاً • المرجع: فهرس PDF الجديد</p><div class="curriculumtopics">'+g.topics.map(t=>'<a class="topiclink" href="study.html?id='+encodeURIComponent(t.id)+'"><span class="topicindex">'+t.n+'</span><span class="topicbody">'+esc(t.title)+'<small class="'+(lessons[t.id]?'ready':'pending')+'">'+(lessons[t.id]?(completed(t.id)?'✓ تدريب منجز':'درس تفاعلي متاح'):'فهرس — الشرح التفصيلي لم يكتمل')+'</small></span><span aria-hidden="true">←</span></a>').join('')+'</div></section>').join(''):'<p class="notice">لم نجد موضوعاً بهذا الاسم في '+level+'.</p>')+
 '<div class="syllabusnotice">مرجع الفهرس الجديد يحوي 452 نقطة تعليمية؛ وعدد الدروس المكتملة أقل منه. الدروس الـ96 السابقة موجودة في <a href="index.html#levels">الأرشيف التدريبي</a> ولا نحتسبها تلقائياً ضمن هذا الفهرس.</div>';
mount.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>{level=b.dataset.level;const url=new URL(location.href);url.searchParams.set("level",level);history.replaceState(null,"",url);render()});
const box=mount.querySelector("#topicFilter");
box.oninput=e=>{query=e.target.value.trim().toLowerCase();let cursor=box.selectionStart;render();const newer=mount.querySelector("#topicFilter");newer.focus();newer.setSelectionRange(cursor,cursor)};
}
render();
}
function testData(item){return (item.questions||[]).map(q=>({prompt:q.prompt,answer:q.correct,options:q.options,source:item.reading?.de||""}))}
function normalData(item){return {
heading:item.heading,overview:item.explanation,examples:item.examples||[],words:(item.examples||[]).slice(0,6),
reading:item.reading,dialogue:item.dialogue||[],task:item.task,questions:testData(item),
sourceTitle:item.heading};
}
function mapPack(item){
return {
heading:'الوحدة التطبيقية '+item.n+' — '+(item.parts[0]?.[1]||'') ,
overview:'ملف تعليمي تطبيقي إضافي من المرحلة السابقة. يجمع ثلاث نقاط مرتبطة في درس واحد ولا يحل محل جميع موضوعات الفهرس الجديد.',
parts:item.parts.map(p=>({description:p[0],example:{de:p[1],ar:p[2]}})),
examples:item.parts.map(p=>({de:p[1],ar:p[2]})),
words:item.words.map(w=>({de:w[0],ar:w[1]})),
reading:{de:item.reading[0],ar:item.reading[1]},
dialogue:item.dialogue.map(w=>({de:w[0],ar:w[1]})),
task:item.writing,
questions:[...item.parts.map(p=>({prompt:p[3][0],answer:p[3][1],options:p[3].slice(1)})),
 {prompt:item.reading[2][0],answer:item.reading[2][1],options:item.reading[2].slice(1)}],
sourceTitle:'الوحدة التطبيقية '+item.n
};
}
function loadReader(item,id,level,origin){
state.last=id;save();
let tab="overview",qs=[],qi=0,first=0,wrongCount=0,wrongCurrent=false,quizToken=0;
const keys=[["overview","📘 المقدمة"],["vocabulary","📗 المفردات"],["audio","🔊 الصوتيات"],["grammar","📐 الشرح"],["dialogue","💬 المحادثة"],["reading","📖 القراءة"],["quiz","🎯 التمارين"],["result","🏆 التقييم"]];
const title=item.heading;
function wrap(body){
const next=origin==='topic'?topics[topics.findIndex(t=>t.id===id)+1]:packs.find(x=>x.level===level&&x.n===Number(id.split("-").pop())+1);
const nextURL=next?(origin==='topic'?'study.html?id='+next.id:'pack.html?level='+level+'&unit='+next.n):'';
mount.innerHTML=crumb(level,title)+'<div class="coursehero"><span class="overline">'+level+' · '+(origin==='topic'?'درس مستقل من الفهرس الجديد':'وحدة تطبيقية إضافية')+'</span><h1>'+esc(title)+'</h1><p>'+esc(item.overview)+'</p></div>'+
 '<div class="curricontent"><aside class="curri-tabs" aria-label="أقسام الدرس">'+keys.map(k=>'<button type="button" class="'+(tab===k[0]?'active':'')+'" data-tab="'+k[0]+'">'+k[1]+'</button>').join('')+'</aside><article class="curri-stage">'+body+'</article></div><div class="currinav"><a href="'+(origin==='topic'?'curriculum.html?level='+level:'practice.html?level='+level)+'">← جميع الدروس</a>'+(nextURL?'<a href="'+nextURL+'">الموضوع التالي ←</a>':'')+'</div>';
mount.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{quizToken++;tab=b.dataset.tab;if(tab==='quiz')startQuiz();else render()});
const bookmark=mount.querySelectorAll("[data-bookmark]");
bookmark.forEach(b=>b.onclick=()=>{const index=+b.dataset.bookmark,w=item.words[index];try{const raw=JSON.parse(localStorage.getItem("deutsch-mastery-germany-v1")||"{}");raw.cards=raw.cards||{};let key="pdf26:"+id+":"+index;if(raw.cards[key])delete raw.cards[key];else raw.cards[key]={de:w.de,ar:w.ar,interval:0,due:Date.now(),lesson:id};localStorage.setItem("deutsch-mastery-germany-v1",JSON.stringify(raw));b.textContent="✓ تم التحديث"}catch(e){b.textContent="تعذر الحفظ في هذا المتصفح"}});
}
function render(){
let html='';
if(tab==='overview')html='<h2>هدف الدرس</h2><p>'+esc(item.overview)+'</p><div class="curri-task"><strong>بعد إتمام الدرس ستتدرب على:</strong><p>'+esc(title)+'</p><p>استمع إلى الأمثلة الألمانية، اقرأ الترجمة، ثم أجب عن الأسئلة واحدة تلو الأخرى.</p></div><div class="syllabusnotice">الكتابة بالأحرف العربية مجرد وسيلة مساعدة. النطق المعتمد هو التسجيل الألماني MP3.</div><button class="primary" data-go="vocabulary">ابدأ بالمفردات ←</button>';
if(tab==='vocabulary')html='<h2>المفردات والأمثلة</h2><p>اضغط على السماعة لتستمع، ثم احفظ المفردات التي تريد مراجعتها.</p>'+audioTools()+item.words.map((w,i)=>speakRow(w).replace('</div></div>','<button class="outline" data-bookmark="'+i+'">☆ احفظ</button></div></div>')).join('');
if(tab==='audio')html='<h2>الصوتيات فقط</h2><p>الكلمات والجمل الصوتية المتعلقة بهذا الدرس، بدون خلطها بباقي الأقسام.</p>'+audioTools()+item.examples.map(speakRow).join('')+ (item.reading?.de?'<h3>نص الدرس</h3>'+speakRow(item.reading):'');
if(tab==='grammar')html='<h2>الشرح بالأمثلة</h2>'+(item.parts?.length?item.parts.map((p,i)=>'<div class="panel article"><h3>النقطة '+(i+1)+'</h3><p>'+esc(p.description)+'</p>'+speakRow(p.example)+'</div>').join(''):'<div class="panel article"><p>'+esc(item.overview)+'</p>'+item.examples.map(speakRow).join('')+'</div>');
if(tab==='dialogue')html='<h2>محادثة وتكرار</h2><p>اقرأ وكرر الأمثلة بصوت مسموع. التمرين لا يقيم ميكروفونك.</p>'+audioTools()+item.dialogue.map((w,i)=>'<div class="tiny">المتحدث '+(i%2===0?'أ':'ب')+'</div>'+speakRow(w)).join('');
if(tab==='reading')html='<h2>القراءة والفهم</h2>'+audioTools()+'<div class="curri-skill">'+displayDE(item.reading.de)+'<p>'+esc(item.reading.ar)+'</p><button class="speak" data-say="'+esc(item.reading.de)+'">🔊 استمع للنص</button></div><div class="curri-task"><h3>تطبيق كتابي</h3><p>'+esc(item.task)+'</p><p class="tiny">احتفظ بإجابتك في دفتر أو ملف نصي؛ التصحيح البشري غير متوفر حالياً.</p></div>';
if(tab==='quiz')html='<h2>التمارين المتسلسلة</h2><div id="curriQuiz"></div>';
if(tab==='result'){
const attempts=state.attempts[id]||[],last=attempts.at(-1);
html='<h2>تقييم الدرس</h2>'+(last?'<div class="panel"><h3>آخر محاولة</h3><p>إجابات صحيحة من أول مرة: <b>'+last.first+'/'+last.total+'</b></p><p>أخطاء قبل التصحيح: '+last.errors+'</p><p>'+(completed(id)?'✓ اجتزت التدريب بالحد الأدنى 80%':'لم تصل بعد إلى 80% من أول محاولة')+'</p><p class="tiny">هذا تقييم للتمارين القصيرة، وليس شهادة A1–B2 أو قياساً لمستوى النطق.</p></div>':'<div class="notice">لا يوجد تقييم بعد. أكمل التمارين أولاً.</div>')+'<button class="primary" data-go="quiz">إعادة التمارين ←</button>';
}
wrap(html);
mount.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{tab=b.dataset.go;if(tab==='quiz')startQuiz();else render()});
if(tab==='quiz')drawQuestion();
}
function startQuiz(){qs=shuffle(item.questions).map(q=>({...q,options:shuffle(q.options)}));qi=0;first=0;wrongCount=0;wrongCurrent=false;quizToken++;render()}
function drawQuestion(){
const el=mount.querySelector("#curriQuiz");if(!el)return;
if(qi>=qs.length){finish();return}
const q=qs[qi],token=++quizToken;wrongCurrent=false;
el.innerHTML='<div class="row" style="display:flex;justify-content:space-between"><span class="tiny">السؤال '+(qi+1)+' / '+qs.length+'</span><span class="badge">'+(first*10)+' نقطة</span></div><div class="curri-progress"><div style="width:'+(qi/qs.length*100)+'%"></div></div><h3>'+esc(q.prompt)+'</h3>'+q.options.map((opt,i)=>'<button class="curri-answer" data-answer="'+i+'">'+esc(opt)+'</button>').join('')+'<div id="curriFeedback" role="status" aria-live="polite"></div>';
el.querySelectorAll("[data-answer]").forEach(btn=>btn.onclick=()=>{
const value=q.options[+btn.dataset.answer],feed=el.querySelector("#curriFeedback");
if(value!==q.answer){wrongCount++;wrongCurrent=true;btn.classList.add("wrong");feed.innerHTML='<div class="curri-feedback error">الإجابة غير صحيحة، راجع الفكرة وحاول مجدداً.</div>';return}
if(!wrongCurrent)first++;
el.querySelectorAll("[data-answer]").forEach(b=>b.disabled=true);btn.classList.add("correct");
feed.innerHTML='<div class="curri-feedback">✓ صحيح. ننتقل للسؤال التالي.</div>';
setTimeout(()=>{if(token!==quizToken||tab!=='quiz')return;qi++;drawQuestion()},650);
});
}
function finish(){
const result={first,total:qs.length,errors:wrongCount,ts:Date.now()};
if(!state.attempts[id])state.attempts[id]=[];
state.attempts[id].push(result);
state.attempts[id]=state.attempts[id].slice(-20);
if(first/qs.length>=.8)state.completed[id]=Date.now();
save();tab="result";render();
}
render();
}
function initStudy(){
const id=new URLSearchParams(location.search).get("id");
const ref=topics.find(t=>t.id===id);
if(!ref){mount.innerHTML='<div class="notice">الدرس المطلوب غير موجود في الفهرس.</div><a class="primary" href="curriculum.html">العودة</a>';return}
document.title=ref.title+" · "+ref.level+" | Deutsch Mastery";
const material=lessons[id];
if(!material){
mount.innerHTML=crumb(ref.level,ref.title)+'<div class="coursehero"><span class="overline">'+ref.level+' · '+esc(ref.section)+'</span><h1>'+esc(ref.title)+'</h1><p>هذا موضوع موجود فعلاً في الفهرس الجديد، لكن محتواه التعليمي التفصيلي لم يكتمل بعد.</p></div><div class="panel article"><h2>حالة هذا الموضوع</h2><p>تم اعتماد عنوانه وتسلسله من PDF، لكن لا يوجد بعد شرح مستقل ومراجع وتمارين حقيقية لهذا الموضوع. لذلك لا يعرض الموقع تمارين وهمية ولا يعتبره درساً مُنجزاً.</p><p>تجد حالياً دروساً تفاعلية مستقلة من أول موضوعات A1، ووحدات تطبيقية إضافية من A1 وA2.</p><div class="controls"><a href="practice.html?level='+ref.level+'" class="primary">الدروس التطبيقية المتوفرة ←</a><a href="curriculum.html?level='+ref.level+'" class="outline">الرجوع للفهرس</a></div></div>';
return;
}
loadReader(normalData(material),id,ref.level,"topic");
}
function initPractice(){
let level=new URLSearchParams(location.search).get("level")||"A1";
if(!["A1","A2"].includes(level))level="A1";
function render(){
const selected=packs.filter(p=>p.level===level);
mount.innerHTML='<div class="coursehero"><span class="overline">تمارين إضافية</span><h1>وحدات تطبيقية موسّعة من A1 وA2</h1><p>هذه الوحدات كُتبت في المرحلة السابقة وتغطي مجموعات من الأهداف. ليست مرقمة موضوعاً بموضوع وفق الفهرس الجديد، لكنها مفيدة للتدرب المتدرج.</p></div>'+
 '<div class="courselevels"><button data-level="A1" class="'+(level==='A1'?'active':'')+'">A1 — 15 وحدة</button><button data-level="A2" class="'+(level==='A2'?'active':'')+'">A2 — 16 وحدة</button></div>'+
 '<div class="lessongrid">'+selected.map(x=>'<a class="lessoncard" href="pack.html?level='+level+'&unit='+x.n+'"><span class="badge">'+level+' — '+String(x.n).padStart(2,'0')+'</span><h3>'+esc(x.parts[0][1])+'</h3><p>3 نقاط مشروحة، حوار، مفردات، قراءة، و4 أسئلة تدريبية.</p><small>'+ (completed('pack-'+level+'-'+x.n)?'✓ أنهيت الوحدة':'فتح الوحدة ←')+'</small></a>').join('')+'</div>';
mount.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>{level=b.dataset.level;render()});
}render();
}
function initPack(){
const params=new URLSearchParams(location.search),level=params.get("level"),n=+params.get("unit");
const pack=packs.find(x=>x.level===level&&x.n===n);
if(!pack){mount.innerHTML='<div class="notice">الوحدة التطبيقية غير موجودة.</div><a href="practice.html">الرجوع</a>';return}
document.title="وحدة "+level+" — "+n+" | Deutsch Mastery";
loadReader(mapPack(pack),"pack-"+level+"-"+n,level,"pack");
}
if(!topics.length){mount.textContent="تعذر تحميل الفهرس الجديد.";return}
const page=document.body.dataset.page;
if(page==='curriculum')initCatalog();
if(page==='study')initStudy();
if(page==='practice')initPractice();
if(page==='pack')initPack();
})();