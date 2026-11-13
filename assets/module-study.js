/* Integrated lesson reader: retain precise PDF topic IDs while presenting connected material in one learning unit. */
(function(){
"use strict";
const root=document.getElementById("moduleMount");
if(!root)return;
const modules=window.DM_LEARNING_MODULES||[];
const master=window.DM_MASTER_CURRICULUM;
const lessons=new Map((window.DM_PRIMARY_LESSONS||[]).map(x=>[x.id,x]));
const allTopics=new Map((master?.topics||[]).map(t=>[t.id,t]));
const id=new URLSearchParams(location.search).get("module")||modules[0]?.id;
const unit=modules.find(m=>m.id===id);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const de=x=>'<span class="de" lang="de" dir="ltr">'+esc(x)+'</span>';
const link=(id)=>"course.html?topic="+encodeURIComponent(id);
const unitLink=m=>"module.html?module="+encodeURIComponent(m.id);
const passed=(()=>{try{return JSON.parse(localStorage.getItem("deutsch-mastery-primary-v2")||"{}").passed||{}}catch(e){return {}}})();
let reviewQuestions=[],reviewPos=0,reviewFirst=0,reviewErrors=0,reviewWrong=false;
if(!unit){root.innerHTML='<div class="notice">هذه الوحدة غير موجودة في المنهج المعتمد. <a href="syllabus.html">ارجع للفهرس</a>.</div>';return}
const topicRows=unit.topicIds.map(id=>({topic:allTopics.get(id),lesson:lessons.get(id)}));
const index=modules.findIndex(m=>m.id===unit.id);
const prev=modules[index-1],next=modules[index+1];
document.title=unit.title+" · "+unit.level+" | Deutsch Mastery";
const audioBtn=text=>'<button type="button" '+(window.DM_AUDIO_MAP?.[text]?'data-say="'+esc(text)+'"':'disabled title="لم يتوفر تسجيل MP3 ألماني بعد"')+' aria-label="الاستماع للتسجيل الألماني">'+(window.DM_AUDIO_MAP?.[text]?'🔊':'🔇')+'</button>';
function example(pair){return '<div class="module-example"><div>'+de(pair[0])+'<small>'+esc(pair[1])+'</small></div>'+audioBtn(pair[0])+'</div>'}
function chapter(item,n){
const t=item.topic,l=item.lesson;
if(!t)throw Error("Topic not found in approved index");
let body="";
if(l){
const examples=(l.examples||[]).filter(p=>p?.[0]&&p?.[1]).slice(0,3);
const words=(l.vocabulary||[]).filter(v=>v?.de&&v?.ar).slice(0,7);
body='<h3>الشرح</h3><p>'+esc(l.explanation)+'</p>'+
 (examples.length?'<h3>أمثلة بالألمانية</h3><div class="module-examples">'+examples.map(example).join("")+'</div>':"")+
 (words.length?'<h3>مفردات هذا الجزء</h3><div class="module-vocab">'+words.map(w=>'<span>'+de(w.de)+' — '+esc(w.ar)+' '+audioBtn(w.de)+'</span>').join("")+'</div>':"")+
 (l.reading?'<details><summary>نص قراءة إضافي وترجمته</summary><div class="module-hint">'+de(l.reading)+' '+audioBtn(l.reading)+'<p>'+esc(l.translation||"")+'</p></div></details>':"")+
 '<p><a class="primary" href="'+link(t.id)+'">التمارين والحوار والمراجعة الخاصة بهذا الجزء ←</a></p>';
}else{
body='<p class="module-empty">هذه نقطة من فهرسك الرسمي، لكن الشرح التفاعلي الخاص بها لم يُكتب بعد. نحتفظ بها في مكانها الصحيح داخل الوحدة بلا محتوى عام مضلل.</p>';
}
return '<details class="module-chapter" '+(n===0?'open':'')+' id="'+t.id+'"><summary><span class="module-step">'+String(n+1).padStart(2,'0')+'</span><span class="module-chapter-title"><h2>'+esc(t.title)+'</h2><small>'+(l?'شرح وأمثلة متوفرة · تدريب تفصيلي':'موجود في الفهرس · قيد التأليف')+' · '+(passed[t.id]?'✓ اجتزت التدريب':'')+'</small></span></summary><div class="module-chapter-body">'+body+'</div></details>';
}
const ready=topicRows.filter(x=>x.lesson).length;
root.innerHTML='<div class="crumb"><a href="index.html">الرئيسية</a> / <a href="syllabus.html?level='+unit.level+'">'+unit.level+'</a> / <a href="syllabus.html?level='+unit.level+'">'+esc(unit.section)+'</a> / الوحدة '+unit.index+'</div>'+
'<div class="module-hero"><span class="eyebrow">'+unit.level+' · '+esc(unit.section)+' · الوحدة '+unit.index+'</span><h1>'+esc(unit.title)+'</h1><p>جمعنا '+topicRows.length+' نقاط مترابطة من الفهرس في وحدة واحدة، حتى تتعلم الموضوع تدريجياً بدل التنقل بين صفحات صغيرة كثيرة.</p></div>'+
'<div class="module-stats"><span>📚 '+topicRows.length+' أجزاء مترابطة</span><span>✍️ '+ready+' أجزاء فيها شرح وتدريبات</span><span>⏳ '+(topicRows.length-ready)+' أجزاء قيد إعداد المحتوى</span></div>'+
'<div class="module-hint">تصفح أجزاء الوحدة بالترتيب، افتح الأمثلة واسمع التسجيل الألماني ثم انتقل إلى التدريب. كل نقاط الـPDF محفوظة. الصوت لا يستعمل لغة أخرى عند غياب MP3.</div>'+
'<section id="moduleChapters"><h2 style="margin:19px 0 12px">مسار الوحدة</h2>'+topicRows.map(chapter).join("")+'</section>'+
'<section class="module-review" id="moduleReview"><h2>مراجعة الوحدة</h2><p>اختبار قصير يجمع أسئلة من الأجزاء التي أُعدت فعلاً. لا يعني النجاح إتقان المستوى كاملاً.</p><button class="primary" data-start-module-review>ابدأ مراجعة الوحدة ←</button><div id="moduleReviewSurface" aria-live="polite"></div></section>'+
'<div class="module-bottom-nav">'+(prev?'<a href="'+unitLink(prev)+'">الوحدة السابقة: '+esc(prev.title)+'</a>':'<span></span>')+
'<a href="syllabus.html?level='+unit.level+'">جميع وحدات '+unit.level+'</a>'+
(next?'<a href="'+unitLink(next)+'">الوحدة التالية: '+esc(next.title)+' ←</a>':'<span></span>')+'</div>';
function allQuestions(){
const out=[];
for(const row of topicRows){
const l=row.lesson;
if(!l)continue;
const q=(l.questions||[]).find(q=>q.prompt&&q.answer&&Array.isArray(q.options)&&q.options.length>=2);
if(q)out.push({source:row.topic.title,prompt:q.prompt,answer:q.answer,options:[...new Set([q.answer,...q.options])].slice(0,5)});
else{
const voc=(l.vocabulary||[]).filter(x=>x.de&&x.ar);
if(voc.length>=3){
const correct=voc[0];out.push({source:row.topic.title,prompt:"ما معنى "+correct.de+"؟",answer:correct.ar,options:[...new Set(voc.slice(0,4).map(x=>x.ar))]});
}
}
}
return out;
}
const area=document.getElementById("moduleReviewSurface");
const start=document.querySelector("[data-start-module-review]");
start.onclick=()=>{
reviewQuestions=allQuestions();reviewPos=0;reviewFirst=0;reviewErrors=0;reviewWrong=false;
start.hidden=true;
if(!reviewQuestions.length){area.innerHTML='<p class="module-empty">ليس في هذه الوحدة أسئلة جاهزة بعد. يمكنك العودة للموضوع عند إضافة التمارين.</p>';return}
draw();
};
function draw(){
if(reviewPos>=reviewQuestions.length){finish();return}
const q=reviewQuestions[reviewPos];
reviewWrong=false;
area.innerHTML='<div class="module-review-progress"><div style="width:'+Math.round(reviewPos/reviewQuestions.length*100)+'%"></div></div>'+
'<p class="tiny">السؤال '+(reviewPos+1)+' / '+reviewQuestions.length+' · '+esc(q.source)+'</p><h3>'+esc(q.prompt)+'</h3>'+
q.options.map((o,i)=>'<button class="module-choice" data-module-choice="'+i+'">'+esc(o)+'</button>').join("")+
'<div id="moduleFeedback" role="status"></div>';
}
function finish(){
const pass=reviewFirst/reviewQuestions.length>=.8;
let record={score:reviewFirst,total:reviewQuestions.length,errors:reviewErrors,passed:pass,ts:Date.now()};
try{let all=JSON.parse(localStorage.getItem("deutsch-mastery-module-reviews-v1")||"{}");all[unit.id]=record;localStorage.setItem("deutsch-mastery-module-reviews-v1",JSON.stringify(all))}catch(e){}
area.innerHTML='<div class="module-hint"><h3>نتيجة المراجعة: '+reviewFirst+' / '+reviewQuestions.length+'</h3><p>أجوبة صحيحة من أول محاولة. '+(pass?'✓ نتيجة جيدة للمراجعة القصيرة.':'راجع الشرح ثم جرّب مرة أخرى.')+'</p><p>المراجعة لا تعوّض التقييم الكامل للمهارات ولا تعتبر الأجزاء غير المؤلفة منجزة.</p></div><button class="outline" data-retry-module-review>إعادة المراجعة</button>';
area.querySelector("[data-retry-module-review]").onclick=()=>start.click();
}
area.addEventListener("click",e=>{
const b=e.target.closest("[data-module-choice]");
if(!b)return;
const q=reviewQuestions[reviewPos],ans=q.options[+b.dataset.moduleChoice];
if(ans!==q.answer){
 reviewErrors++;reviewWrong=true;b.classList.add("incorrect");
 area.querySelector("#moduleFeedback").innerHTML='<p class="module-empty">حاول مرة أخرى بعد مراجعة المثال.</p>';
 return;
}
if(!reviewWrong)reviewFirst++;
area.querySelectorAll("[data-module-choice]").forEach(x=>x.disabled=true);
b.classList.add("correct");
area.querySelector("#moduleFeedback").innerHTML='<p class="module-hint">✓ إجابة صحيحة. <button class="primary" data-next-module-question>'+(reviewPos+1===reviewQuestions.length?'شوف النتيجة':'السؤال التالي ←')+'</button></p>';
});
area.addEventListener("click",e=>{
if(e.target.closest("[data-next-module-question]")){reviewPos++;draw()}
});
})();