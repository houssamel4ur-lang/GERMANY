/* Deutsch Mastery — primary-curriculum interactive learning engine.
 * No automatic claims of CEFR attainment. Exercises are formative practice.
 * Audio is delegated exclusively to the verified German MP3 player.
 */
(function(){
"use strict";
const root=document.getElementById("primaryStudyMount");
if(!root)return;
const master=window.DM_MASTER_CURRICULUM;
const material=window.DM_PRIMARY_LESSONS||[];
const topics=master?.topics||[];
const lessonMap=new Map(material.map(x=>[x.id,x]));
const $=(s,el=document)=>el.querySelector(s), $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
const esc=x=>String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const iso=x=>'<span lang="de" dir="ltr" class="de">'+esc(x)+'</span>';
const norm=x=>String(x||"").normalize("NFKC").trim().toLocaleLowerCase("de-DE").replace(/[.!?؟،,;:]+$/g,"").replace(/\s+/g," ");
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const KEY="deutsch-mastery-primary-v2";
const state=(()=>{
try{let s=JSON.parse(localStorage.getItem(KEY)||"{}");return {attempts:s.attempts||{},passed:s.passed||{},cards:s.cards||{},last:s.last||null,errors:s.errors||[],created:s.created||Date.now()}}
catch(e){return {attempts:{},passed:{},cards:{},last:null,errors:[],created:Date.now()}}
})();
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){notify("تعذر حفظ التقدم في المتصفح. جرّب التصفح العادي وتحقق من مساحة التخزين.")}};
const notify=msg=>{const el=$("#courseNotice");if(el)el.textContent=msg};
const courseLink=id=>"course.html?topic="+encodeURIComponent(id);
let id=new URLSearchParams(location.search).get("topic"),lesson=lessonMap.get(id),topic=topics.find(x=>x.id===id);
let tab="intro",questions=[],pos=0,first=0,miss=0,wrongOnThis=false,order=[],serial=0;
function allWords(){return material.flatMap(l=>l.vocabulary.map(v=>({de:v.de,ar:v.ar,source:l.id}))).filter(v=>v.de&&v.ar)}
function speechControls(){
return '<div class="controls"><label for="speed">سرعة MP3</label><select id="speed"><option value=".75">بطيئة ×0.75</option><option value="1" selected>طبيعية ×1</option><option value="1.15">أسرع ×1.15</option></select><label for="repeat">التكرار</label><select id="repeat"><option value="1">مرة</option><option value="2">مرتان</option><option value="3">3 مرات</option></select><button class="outline" data-stop type="button">■ إيقاف الصوت</button></div><p class="tiny" id="audioStatus" role="status">ملفات MP3 ألمانية مستقلة. إذا كان التسجيل غير متوفر لن يُستخدم صوت بلغة أخرى.</p>';
}
function speaker(text){const phrase=String(text||"").trim(),available=!!window.DM_AUDIO_MAP?.[phrase];return '<button class="speak" type="button" '+(available?'data-say="'+esc(phrase)+'" title="اسمع النطق الألماني"':'disabled title="هذا التسجيل الألماني قيد التحضير"')+' aria-label="'+(available?"استمع إلى "+esc(phrase):"تسجيل ألماني قيد التحضير")+'">'+(available?"🔊":"🔇")+'</button>'}
function savedKey(word){return lesson.id+"::"+word.de}
function wordCard(word,i,listenOnly){
const key=savedKey(word),saved=!!state.cards[key];
return '<div class="wordrow wordrow-vocab"><div class="wordrow-text">'+iso(word.de)+'<small>'+esc(word.ar)+'</small></div><div class="rowactions">'+speaker(word.de)+(listenOnly?"":'<button class="outline" data-saveword="'+i+'" type="button" aria-label="احفظ للمراجعة">'+(saved?"★ محفوظة":"☆ احفظ")+'</button>')+'</div></div>';
}
const tabs=[["intro","01 · خطة الدرس"],["vocab","02 · المفردات"],["audio","03 · النطق والاستماع"],["grammar","04 · الشرح والقواعد"],["conversation","05 · المحادثة"],["reading","06 · القراءة والكتابة"],["exercise","07 · التمارين"],["result","08 · التقييم"]];
function detailPage(){
const parentModule=window.DM_LEARNING_MODULES?.find(x=>x.id===window.DM_MODULE_BY_TOPIC?.[topic.id]);
const parentUrl=parentModule?"module.html?module="+encodeURIComponent(parentModule.id)+"#"+topic.id:"syllabus.html?level="+topic.level;
document.title=topic.title+" | Deutsch Mastery";
const same=topics.filter(x=>x.level===topic.level),ix=same.findIndex(x=>x.id===topic.id);
const next=same.slice(ix+1).find(x=>lessonMap.has(x.id));
const prev=same.slice(0,ix).reverse().find(x=>lessonMap.has(x.id));
root.innerHTML='<div class="crumb"><a href="syllabus.html?level='+topic.level+'">فهرس '+topic.level+'</a> / <a href="'+parentUrl+'">'+esc(parentModule?.title||topic.section)+'</a> / الجزء '+String(topic.number).padStart(2,"0")+'</div>'+
'<div class="lessonhero"><span class="eyebrow">'+topic.level+' · المحور '+topic.section_number+'.'+String(topic.number).padStart(2,"0")+' · تدريب تفاعلي</span><h1>'+esc(topic.title)+'</h1><p>من الفهرس المعتمد، صفحة '+topic.page+'. محتوى تدريبي  ' + (lesson.objectives?.length?'موسّع يتطلب مراجعة لغوية بشرية':'أولي لم يكتمل بعد') + ' ، وليس شهادة رسمية.</p></div>'+
'<div class="lessonlayout"><aside class="side" aria-label="تسلسل مراحل التعلم"><b>مراحل الدرس بالترتيب</b>'+tabs.map(t=>'<button class="tab" type="button" data-tab="'+t[0]+'">'+t[1]+'</button>').join("")+'</aside><article class="study" id="courseSection"></article></div>'+
'<div class="controls" style="justify-content:space-between;margin:22px 0"><a class="outline" href="'+parentUrl+'">العودة للوحدة المتكاملة</a><a class="primary" href="ai.html?lesson='+encodeURIComponent(topic.id)+'">تدرب مع AI ديالنا على هاد الدرس ←</a><div class="controls">'+(prev?'<a class="outline" href="'+courseLink(prev.id)+'">الدرس السابق</a>':"")+(next?'<a class="primary" href="'+courseLink(next.id)+'">الدرس التالي ←</a>':"")+'</div></div>'+
'<div class="tiny" id="courseNotice" role="status"></div>';
state.last=topic.id;store();
}
function title(title,sub){return '<span class="kicker">'+topic.level+' · '+esc(topic.section)+'</span><h2>'+esc(title)+'</h2><p class="sub">'+esc(sub)+'</p>'}
function bulletList(items,klass="learning-list"){
 return '<ul class="'+klass+'">'+items.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>';
}
function panelHeading(heading,body){
 return '<div class="lesson-block"><h3>'+esc(heading)+'</h3><p>'+esc(body)+'</p></div>';
}
function examplesBlock(items){
 return (items||[]).filter(x=>x&&x[0]&&x[1]).map(x=>'<div class="story lesson-example">'+iso(x[0])+'<p>'+esc(x[1])+'</p>'+speaker(x[0])+'</div>').join("");
}
function render(){
 $$("[data-tab]",root).forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 const view=$("#courseSection");if(!view)return;
 const expanded=!!lesson.objectives?.length;
 const lessonObjectives=expanded?lesson.objectives:[
  "التعرّف على فكرة "+topic.title+" ومفرداتها الأساسية.",
  "فهم الأمثلة المكتوبة واستعمالها في سياق الموضوع.",
  "تطبيق ما تعلمته في التمارين القصيرة."
 ];
 let html="";
 if(tab==="intro"){
  html=title("خريطة الدرس: "+topic.title,"هذه الصفحة للتوجيه وخطوات الدراسة؛ الشرح التفصيلي يوجد في قسمه الخاص ولا يتكرر هنا.")+
  '<div class="lesson-block"><h3>بعد هذا الدرس تستطيع أن...</h3>'+bulletList(lessonObjectives)+'</div>'+
  '<div class="lesson-block"><h3>تسلسل التعلم</h3><ol class="learning-list"><li>افهم الهدف والمصطلحات الرئيسية.</li><li>تعلّم المفردات في سياقها ثم استمع للأصوات.</li><li>ادرس القاعدة والأمثلة التطبيقية دون استعجال.</li><li>طبّق في الحوار والقراءة والكتابة.</li><li>أنجز تمارين المراجعة ثم راجع الأخطاء.</li></ol></div>'+
  '<div class="lesson-highlights"><span>المستوى '+esc(topic.level)+'</span><span>المحور '+esc(topic.section_number)+'.'+String(topic.number).padStart(2,"0")+'</span><span>'+(expanded?esc(lesson.estimatedMinutes||45)+' دقيقة مقترحة':'مسودة قيد التوسيع')+'</span></div>'+
  '<p class="notice">'+esc(lesson.quality||"محتوى تدريب أولي، يحتاج مراجعة وتطويراً.")+'</p><button class="primary" data-goto="vocab">انتقل إلى المفردات ←</button>';
 }
 if(tab==="vocab"){
  html=title("مفردات وتعبيرات الدرس","هذا القسم لتعلّم المعنى والاستعمال وحفظ الكلمات؛ تدريب الأذن وحده في قسم الصوتيات.")+
  '<div class="lesson-block"><h3>كيف تحفظ الكلمة بشكل صحيح؟</h3><p>اقرأ الكلمة الألمانية ومعناها، استمع إن توفر تسجيل MP3، ثم كوّن جملة قصيرة بها واحفظ الكلمات الصعبة للمراجعة. احفظ الأسماء مع der أو die أو das عندما تكون الأداة مذكورة.</p></div>'+
  '<p class="tiny">عدد العناصر: '+lesson.vocabulary.length+'</p>'+
  lesson.vocabulary.map((v,i)=>wordCard(v,i,false)).join("")+
  '<div class="lesson-block"><h3>تطبيق عملي للمفردات</h3><p>اختر خمس كلمات من هذه الصفحة، واكتب لها جملاً جديدة من عندك. حاول استرجاع معنى الكلمة دون النظر إلى العربية قبل حفظها للمراجعة.</p></div>';
 }
 if(tab==="audio"){
  const availablePhrases=[...new Set([...lesson.vocabulary.map(w=>w.de),...lesson.examples.map(x=>x[0]),...lesson.dialogue.map(x=>x[0])])].filter(x=>window.DM_AUDIO_MAP?.[x]);
  const uniqueIPA=(lesson.pronunciation||[]);
  html=title(topic.section==="الحروف والنطق"?"الحروف والنطق والتمييز السمعي":"الاستماع والنطق",
  "تدرّب على مخارج الأصوات والتمييز السمعي؛ الكلمات هنا أمثلة للاستماع، وليس قائمة مفردات مكررة.")+
  speechControls();
  if(Array.isArray(lesson.alphabet)&&lesson.alphabet.length){
   html+='<div class="lesson-block"><h3>جدول الأبجدية الكامل: 26 حرفاً</h3><p>اسم الحرف عند التهجئة قد يختلف عن صوته داخل الكلمة. رموز IPA مساعدة للتعلم، ولا تعوّض التسجيل الألماني.</p>'+
   '<div class="table-scroll"><table class="alphabet-table"><thead><tr><th scope="col">الحرف</th><th scope="col">اسمه بالألمانية</th><th scope="col">IPA لاسم الحرف</th><th scope="col">كلمة مثال + الاستماع</th><th scope="col">المعنى</th></tr></thead><tbody>'+
   lesson.alphabet.map(a=>'<tr><td><strong lang="de" dir="ltr">'+esc(a[0])+'</strong></td><td><span lang="de" dir="ltr">'+esc(a[1])+'</span></td><td dir="ltr">'+esc(a[2])+'</td><td><div class="alphabet-example">'+iso(a[3])+speaker(a[3])+'</div></td><td>'+esc(a[4])+'</td></tr>').join("")+
   '</tbody></table></div></div>';
  }
  if(uniqueIPA.length){
   html+=uniqueIPA.map((part,i)=>'<div class="lesson-block"><h3>'+(i+1)+'. '+esc(part.title)+'</h3><p>'+esc(part.how)+'</p>'+
   (part.words?.length?'<div class="pron-words">'+part.words.map(word=>'<div class="wordrow">'+iso(word)+speaker(word)+'</div>').join("")+'</div>':"")+
   '<p class="practice-task"><strong>طبّق:</strong> '+esc(part.task||"استمع ثم كرّر.")+'</p></div>').join("");
  }
  if(availablePhrases.length){
   html+='<div class="lesson-block"><h3>تمرين الأذن: استمع قبل كشف النص</h3><p>شغّل الصوت، حاول كتابة ما سمعت، ثم افتح العبارة للتحقق من نفسك. التسجيلات غير المتوفرة لا تُشغّل بلغة أخرى.</p>'+
   availablePhrases.slice(0,18).map((phrase,i)=>'<div class="wordrow"><div><strong>المقطع '+(i+1)+'</strong> <details><summary>اكشف النص بعد الاستماع</summary>'+iso(phrase)+'</details></div>'+speaker(phrase)+'</div>').join("")+'</div>';
  } else if(!uniqueIPA.length)html+='<p class="notice">لا تتوفر حالياً تسجيلات صوتية لهذا الدرس. لا يظهر هنا صوت بديل بلغة أخرى.</p>';
 }
 if(tab==="grammar"){
  html=title(topic.section==="الحروف والنطق"?"الشرح التفصيلي وطريقة الاستعمال":(/قواعد|النحو/.test(topic.section)?"القواعد والشرح التفصيلي":"شرح الفكرة بالأمثلة"),
  "هنا توجد القواعد والخطوات مع أمثلة محللة؛ المقدمة لا تعيد الشرح.")+
  (lesson.grammarBlocks?.length?lesson.grammarBlocks.map(block=>
   '<div class="lesson-block"><h3>'+esc(block.title)+'</h3><p>'+esc(block.body)+'</p>'+examplesBlock(block.examples)+'</div>').join(""):
   '<div class="lesson-block"><h3>الفكرة الرئيسية</h3><p>'+esc(lesson.explanation)+'</p></div>'+examplesBlock(lesson.examples)+
   '<p class="notice">هذا الشرح مختصر وما زال مسودة تعليمية؛ يحتاج أمثلة مفسرة وخطوات إضافية قبل اعتباره درساً مكتملاً.</p>')+
  (lesson.commonMistakes?.length?'<div class="lesson-block"><h3>أخطاء يجب تجنبها</h3>'+bulletList(lesson.commonMistakes)+'</div>':"")+
  '<button class="primary" data-goto="conversation">طبّق في المحادثة ←</button>';
 }
 if(tab==="conversation"){
  const genuineDialogue=(lesson.dialogue||[]).length>=3&&
   !lesson.dialogue.every(x=>lesson.examples.some(e=>e[0]===x[0]));
  html=title("المحادثة وتوظيف اللغة","اقرأ الأدوار بصوت مرتفع ثم بدل الأسماء والمعلومات، وجرّب الدورين دون الترجمة.")+
  speechControls();
  if(genuineDialogue){
   html+='<div class="lesson-block"><h3>حوار مرتبط بموضوع الدرس</h3>'+
    lesson.dialogue.map((x,i)=>'<div class="dialogue-turn"><span class="speaker-label">المتحدث '+(i%2?"ب":"أ")+'</span><div>'+iso(x[0])+'<small>'+esc(x[1])+'</small></div>'+speaker(x[0])+'</div>').join("")+'</div>';
  }else{
   html+='<p class="notice">هذا المحور لا يتوفر بعد على حوار أصلي متدرج خاص به. نتجنب تكرار جمل المفردات على أنها محادثة كاملة.</p>';
  }
  html+='<div class="lesson-block"><h3>تدرّب على الكلام بنفسك</h3>'+
   bulletList(lesson.rolePlay?.length?lesson.rolePlay:[
    "حوّل المثال الأول إلى سؤال مناسب، ثم جاوب عنه بجملة ألمانية جديدة.",
    "حاول شرح فكرة هذا المحور شفهياً بالألمانية لمدة نصف دقيقة ثم زد التفاصيل."
   ])+'<p class="tiny">لا نقيس دقة النطق آلياً في هذا القسم. يمكنك استعمال شريك المحادثة في الصفحة المخصصة عند توفر اتصال AI.</p></div>';
 }
 if(tab==="reading"){
  const longReading=(lesson.reading||"").trim().split(/\s+/).length>=18;
  html=title("القراءة والفهم ثم الكتابة","هذا القسم للنص المتكامل، وأسئلة الفهم، والإنتاج الكتابي. لا تُعرض الترجمة إلا عندما تختار إظهارها.")+
  (longReading?'<div class="lesson-block"><h3>النص الألماني</h3><p class="tiny">اقرأ دون ترجمة أولاً وحدد الكلمات التي تعرفها.</p><div class="story reading-text">'+iso(lesson.reading)+'<div class="controls">'+speaker(lesson.reading)+'</div></div>'+
  '<details><summary>أظهر الترجمة بعد محاولة الفهم</summary><p>'+esc(lesson.translation)+'</p></details></div>':
  '<p class="notice">النص الحالي قصير ولا يشكل نشاط قراءة متكاملاً بعد؛ يحتاج إلى فقرة أطول وأسئلة فهم أصلية.</p>'+
  '<div class="story">'+iso(lesson.reading)+'<p>'+esc(lesson.translation)+'</p></div>')+
  (lesson.readingQuestions?.length?'<div class="lesson-block"><h3>أسئلة فهم النص</h3>'+lesson.readingQuestions.map((q,i)=>'<details class="reading-question"><summary>'+(i+1)+'. '+esc(q[0])+'</summary><p>الجواب: '+esc(q[1])+'</p></details>').join("")+'</div>':"")+
  '<div class="lesson-block"><h3>الكتابة: أنتج نصك الخاص</h3><p>'+esc(lesson.writing)+'</p>'+
  '<textarea id="writingDraft" rows="6" style="width:100%;max-width:100%" lang="de" dir="ltr" placeholder="Schreibe hier deine Antwort ..."></textarea>'+
  (lesson.writingModel?'<details><summary>افتح نموذج إجابة بعد أن تكتب</summary><p lang="de" dir="ltr">'+esc(lesson.writingModel)+'</p></details>':"")+
  '<p class="tiny">يمكنك حفظ المسودة على هذا الجهاز. حفظ النص لا يعني تصحيحه تلقائياً.</p><button class="outline" data-savewriting>حفظ المسودة</button></div>';
 }
 if(tab==="exercise"){
  html=title("التطبيق واختبار الفهم","أسئلة موضوعية ثم مفردات واستماع وترتيب وكتابة قصيرة؛ الأسئلة التي أُلّفت خصيصاً لهذا الدرس تظهر أولاً.")+
  '<div class="lesson-block"><h3>قبل الاختبار</h3><p>طبّق القواعد دون الرجوع إلى الشرح أثناء الإجابة، ثم راجع الأخطاء. النجاح هنا للتدريب فقط وليس شهادة CEFR.</p></div><div id="quizSurface"></div>';
 }
 if(tab==="result"){
  const attempts=state.attempts[id]||[],last=attempts[attempts.length-1];
  html=title("نتيجة التمرين وخطتك للمراجعة","هذه النتائج مبنية على أجوبتك المخزنة على جهازك وليست تقييماً نهائياً للمهارات الأربع.")+
  (last?'<div class="lesson-block"><h3>نتيجة آخر محاولة</h3><p>صحيح من أول محاولة: <strong>'+last.first+' / '+last.total+'</strong></p><p>الإجابات الخاطئة قبل التصحيح: '+last.errors+'</p><p>التاريخ: '+new Date(last.ts).toLocaleString("ar")+'</p><p>'+(state.passed[id]?"✓ بلغت عتبة 80% في التدريب القصير.":"راجع أخطاءك ثم أعد المحاولة.")+'</p></div>':'<div class="notice">لم تنه التمارين بعد.</div>')+
  '<div class="lesson-block"><h3>ماذا بعد؟</h3><p>إذا أخطأت في الكلمات فارجع للمفردات، وإذا أخطأت في القاعدة فراجع الشرح، ثم اقرأ النص أو حاول المحادثة مرة أخرى.</p></div>'+
  '<button class="primary" data-goto="exercise">إعادة التدريب ←</button>';
 }
 view.innerHTML=html;
 if(tab==="exercise"){questions=buildQuestions();pos=0;first=0;miss=0;drawQuestion()}
 if(tab==="reading"){const v=(()=>{try{return localStorage.getItem(KEY+"-writing-"+id)||""}catch(e){return ""}})();$("#writingDraft",view).value=v}
}
function choices(correct,pool,max=4){
 const vals=[correct],used=new Set([norm(correct)]);
 shuffle(pool).forEach(x=>{if(vals.length<max&&!used.has(norm(x))&&x){used.add(norm(x));vals.push(x)}});
 return shuffle(vals);
}
function buildQuestions(){
 const qs=lesson.questions.map(q=>({kind:"choice",prompt:q.prompt,answer:q.answer,options:choices(q.answer,q.options||[],3)}));
 const vocabulary=lesson.vocabulary.filter(w=>w.de&&w.ar);
 const distractors=shuffle(allWords().filter(w=>w.source!==lesson.id&&w.de&&w.ar));
 const findOpts=(w,key)=>choices(w[key],vocabulary.map(x=>x[key]).concat(distractors.map(x=>x[key])),4);
 shuffle(vocabulary).forEach((word,i)=>{
  if(i%3===0)qs.push({kind:"choice",prompt:"اختر المعنى العربي الصحيح:",display:word.de,answer:word.ar,options:findOpts(word,"ar")});
  else if(i%3===1)qs.push({kind:"choice",prompt:"اختر التعبير الألماني الذي يعني: "+word.ar,answer:word.de,options:findOpts(word,"de")});
  else if(window.DM_AUDIO_MAP?.[word.de])qs.push({kind:"listen",prompt:"استمع إلى الكلمة واختر معناها:",audio:word.de,answer:word.ar,options:findOpts(word,"ar")});
  else qs.push({kind:"choice",prompt:"اختر معنى الكلمة المكتوبة:",display:word.de,answer:word.ar,options:findOpts(word,"ar")});
 });
 if(lesson.examples[0]){
  const sentence=lesson.examples[0][0].trim();
  const toks=sentence.split(/\s+/).filter(Boolean);
  if(toks.length>=3&&toks.length<=16)qs.push({kind:"order",prompt:"رتّب الكلمات لتكوين الجملة:",answer:sentence,tokens:shuffle(toks)});
  // Allow German writing practice of just one vocabulary entry; don't demand full paragraph typing.
  const w=vocabulary.find(x=>/^[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\s-]+$/.test(x.de));
  if(w)qs.push({kind:"type",prompt:"اكتب بالألمانية: "+w.ar,answer:w.de});
 }
 // Assess reading via authored, topic-specific comprehension questions only.
 if(Array.isArray(lesson.readingQuestions)){
  for(const rq of lesson.readingQuestions){
   const [prompt,answer,...wrong]=rq;
   if(prompt&&answer&&wrong.length)qs.push({kind:"choice",prompt:"من النص: "+prompt,answer,options:choices(answer,wrong,3)});
  }
 }
 return [...qs.slice(0,lesson.questions.length),...shuffle(qs.slice(lesson.questions.length))];
}
function drawQuestion(){
const el=$("#quizSurface");if(!el)return;
if(pos>=questions.length){finishQuiz();return}
const q=questions[pos];order=[];wrongOnThis=false;const run=++serial;
let h='<p class="tiny">السؤال '+(pos+1)+' / '+questions.length+' · نقاط المحاولة الأولى: '+first+'</p><div class="progress"><div style="width:'+(100*pos/questions.length)+'%"></div></div><h3>'+esc(q.prompt)+'</h3>';
if(q.display)h+='<div class="story">'+iso(q.display)+'</div>';
if(q.reading)h+='<div class="story">'+iso(q.reading)+'</div>';
if(q.audio)h+='<div class="controls">'+speaker(q.audio)+' <span class="tiny">استمع قبل الاختيار</span></div>';
if(q.options)h+=q.options.map((o,i)=>'<button type="button" class="choice" data-answer="'+i+'">'+esc(o)+'</button>').join("");
if(q.kind==="type")h+='<div class="controls"><input id="typedAnswer" class="field" lang="de" dir="ltr" autocomplete="off" placeholder="اكتب الكلمة بالألمانية"><button class="primary" data-checktype>تحقق</button></div>';
if(q.kind==="order")h+='<div id="ordered" class="answerbox">اختر الكلمات بالترتيب</div><div class="chips" id="tokenChoices"></div><div class="controls"><button class="primary" data-checkorder>تحقق</button><button class="outline" data-clearorder>إعادة الترتيب</button></div>';
h+='<div id="answerFeedback" role="status"></div>';
el.innerHTML=h;
if(q.kind==="order")renderTokens(q);
const enter=$("#typedAnswer");if(enter)enter.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();checkAnswer(enter.value)}};
}
function renderTokens(q){
const grid=$("#tokenChoices"),out=$("#ordered");if(!grid||!out)return;
out.textContent=order.map(x=>x.word).join(" ")||"اختر الكلمات بالترتيب";
grid.innerHTML=q.tokens.map((word,i)=>'<button class="token" data-token="'+i+'" '+(order.some(x=>x.i===i)?"disabled":"")+'>'+esc(word)+'</button>').join("");
}
function checkAnswer(input,button){
const q=questions[pos],good=norm(input)===norm(q.answer),feedback=$("#answerFeedback");
if(!good){
 wrongOnThis=true;miss++;state.errors.push({topic:id,kind:q.kind,prompt:q.prompt,ts:Date.now()});state.errors=state.errors.slice(-250);store();
 feedback.innerHTML='<div class="feedback err">الجواب غير صحيح. راجع المثال وحاول مرة أخرى.</div>';
 if(button)button.classList.add("bad");
 if(q.kind==="order"){order=[];renderTokens(q)}
 return;
}
if(!wrongOnThis)first++;
$$("button",$("#quizSurface")).forEach(b=>b.disabled=true);
feedback.innerHTML='<div class="feedback">✓ صحيح. '+(q.kind==="order"||q.kind==="type"?esc(q.answer):"راجع الإجابة ثم انتقل للسؤال التالي.")+'<div class="controls"><button type="button" class="primary" data-next-question>'+(pos+1===questions.length?"إظهار النتيجة ←":"السؤال التالي ←")+'</button></div></div>';
}
function finishQuiz(){
const attempt={first,total:questions.length,errors:miss,ts:Date.now()};
state.attempts[id]=state.attempts[id]||[];state.attempts[id].push(attempt);state.attempts[id]=state.attempts[id].slice(-25);
if(questions.length&&first/questions.length>=.8)state.passed[id]=Date.now();
store();
$("#quizSurface").innerHTML='<div class="panel" style="text-align:center"><h2>أنهيت التمرين</h2><p>صحيح من أول محاولة: <b>'+first+' / '+questions.length+'</b></p><p>محاولات خاطئة: '+miss+'</p><p>المعيار التدريبي: 80% من أول محاولة، وليس شهادة إتقان مستوى CEFR.</p><button class="primary" data-retry>إعادة بأسئلة مرتبة عشوائياً</button><button class="outline" data-goto="result">عرض التقييم</button></div>';
}
function beginReview(){
document.title="مراجعة المفردات | Deutsch Mastery";
root.innerHTML='<div class="pagehead"><span class="overline">SPACED REPETITION</span><h1>مراجعة مفردات المنهج الجديد</h1><p>تظهر البطاقات المحفوظة من دروس الفهرس الجديد. الأجوبة تتحكم في مواعيد مراجعتها.</p></div><div id="reviewZone"></div><p id="courseNotice" role="status" class="tiny"></p>';
let cardId=null,turned=false,reviewDue=true;
function draw(){
const now=Date.now(),records=Object.entries(state.cards);
const due=records.filter(([id,c])=>c.due<=now);
const subset=reviewDue?due:records;
if(cardId&&!subset.some(([x])=>x===cardId))cardId=null;
cardId=cardId||subset[0]?.[0]||null;
if(!cardId){
 $("#reviewZone").innerHTML='<div class="panel"><h3>لا توجد بطاقات للمراجعة وفق هذا الاختيار.</h3><p>المحفوظة: '+records.length+'، المستحقة الآن: '+due.length+'</p><button class="outline" data-switchreview>'+(reviewDue?"إظهار جميع البطاقات":"إظهار المستحقة فقط")+'</button></div>';return;
}
const c=state.cards[cardId];
$("#reviewZone").innerHTML='<div class="panel" style="max-width:760px;margin:auto"><div class="controls" style="justify-content:space-between"><b>'+records.length+' كلمات محفوظة</b><span class="badge">'+due.length+' مستحقة الآن</span></div><button class="outline" data-switchreview>'+(reviewDue?"إظهار جميع البطاقات":"إظهار المستحقة فقط")+'</button><div class="flash">'+iso(c.de)+'</div><div class="flashmeaning">'+(turned?esc(c.ar):"حاول استحضار المعنى قبل كشفه")+'</div><div class="controls" style="justify-content:center">'+speaker(c.de)+'<button class="outline" data-flip>إظهار / إخفاء المعنى</button></div>'+(turned?'<div class="reviewbuttons"><button class="outline" data-review="again">لم أتذكر</button><button class="primary" data-review="good">أتذكر جيداً</button></div>':"")+'<p class="tiny" style="text-align:center">فواصل 1، 2، 4، 8، 16، 32 يوماً تقريباً، وتبدأ من الصفر بعد الخطأ.</p></div>';
}
root.addEventListener("click",e=>{
if(e.target.closest("[data-flip]")){turned=!turned;draw();return}
if(e.target.closest("[data-switchreview]")){reviewDue=!reviewDue;cardId=null;turned=false;draw();return}
const b=e.target.closest("[data-review]");if(!b)return;
const record=state.cards[cardId];
if(b.dataset.review==="again"){record.interval=0;record.due=Date.now();}else{record.interval=record.interval?Math.min(record.interval*2,64):1;record.due=Date.now()+record.interval*86400000}
store();turned=false;
const remaining=Object.entries(state.cards).filter(([k,v])=>(!reviewDue||v.due<=Date.now())&&k!==cardId);
cardId=remaining[0]?.[0]||null;draw();
});
draw();
}
function beginDashboard(){
document.title="تقدم المنهج الجديد | Deutsch Mastery";
const total=material.length,attempts=Object.values(state.attempts).reduce((a,b)=>a+b.length,0),passed=Object.keys(state.passed).filter(x=>lessonMap.has(x)).length,due=Object.values(state.cards).filter(c=>c.due<=Date.now()).length;
root.innerHTML='<div class="pagehead"><span class="overline">LEARNING DASHBOARD</span><h1>تقدمك في المنهج المعتمد</h1><p>فقط نتائج الدروس الموجودة فعلاً، دون اختراع إكمال لأي عنوان من الفهرس.</p></div>'+
'<div class="statgrid"><div class="panel"><strong>'+passed+'/'+total+'</strong><span>تدريب اجتزته من المحاور المتاحة</span></div><div class="panel"><strong>'+attempts+'</strong><span>محاولة اختبار</span></div><div class="panel"><strong>'+Object.keys(state.cards).length+'</strong><span>مفردات محفوظة</span></div><div class="panel"><strong>'+due+'</strong><span>مراجعة مستحقة</span></div></div>'+
'<div class="panel"><h2>أكمل دراستك</h2><p>ملاحظة: '+(master.total_topics-total)+' من موضوعات الفهرس ما زالت بحاجة إلى محتوى تفاعلي خاص بها؛ لا يظهر أي تقدم وهمي.</p><a class="primary" href="'+courseLink(lessonMap.has(state.last)?state.last:material[0].id)+'">متابعة آخر درس متاح ←</a> <a class="outline" href="syllabus.html">تصفح الفهرس</a></div>'+
'<div class="panel"><h2>تقسيم ساعتين يومياً</h2><div class="daily"><div><b>30 دقيقة</b>مفردات وقواعد</div><div><b>30 دقيقة</b>صوتيات ونطق</div><div><b>30 دقيقة</b>قراءة ومحادثة</div><div><b>30 دقيقة</b>تمارين ومراجعة</div></div><p class="tiny">هذه خطة مقترحة، ولا تعني أن المستوى يتحقق بعد عدد محدد من الساعات.</p></div>'+
'<div class="panel"><h2>النسخ الاحتياطي لتقدمك</h2><button class="primary" data-export>تنزيل ملف JSON</button><label class="outline" style="display:inline-flex">استيراد تقدم <input id="importProgress" type="file" accept="application/json,.json"></label><p class="tiny">استيراد ملف يستبدل تقدم المنهج الجديد الحالي بعد موافقتك.</p></div><p id="courseNotice" role="status"></p>';
root.addEventListener("change",async e=>{
if(e.target.id!=="importProgress")return;
try{const file=e.target.files?.[0];if(!file)return;const obj=JSON.parse(await file.text());if(obj.version!==KEY||!obj.progress||typeof obj.progress.cards!=="object"||typeof obj.progress.attempts!=="object")throw Error("invalid");
if(!confirm("هل تريد استبدال تقدمك الحالي بالتقدم المستورد؟"))return;
localStorage.setItem(KEY,JSON.stringify(obj.progress));location.reload();
}catch(err){notify("ملف النسخة الاحتياطية غير صالح لهذا المشروع.")}});
}
root.addEventListener("click",e=>{
const goto=e.target.closest("[data-goto]");
if(goto){tab=goto.dataset.goto;serial++;render();return}
const b=e.target.closest("[data-tab]");
if(b){tab=b.dataset.tab;serial++;render();return}
const save=e.target.closest("[data-saveword]");
if(save&&lesson){
 const word=lesson.vocabulary[Number(save.dataset.saveword)],key=savedKey(word);
 if(state.cards[key])delete state.cards[key];
 else state.cards[key]={de:word.de,ar:word.ar,lesson:id,interval:0,due:Date.now()};
 store();render();return;
}
const exportButton=e.target.closest("[data-export]");
if(exportButton){
 const data=JSON.stringify({version:KEY,progress:state},null,2);
 const blob=new Blob([data],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="deutsch-mastery-primary-progress.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);return;
}
const writing=e.target.closest("[data-savewriting]");
if(writing){try{localStorage.setItem(KEY+"-writing-"+id,$("#writingDraft").value);notify("حُفظت مسودة الكتابة محلياً.")}catch(err){notify("تعذر حفظ المسودة.")}return}
if(tab!=="exercise")return;
if(e.target.closest("[data-next-question]")){pos++;drawQuestion();return}
const btn=e.target.closest("[data-answer]");
if(btn){checkAnswer(questions[pos].options[Number(btn.dataset.answer)],btn);return}
if(e.target.closest("[data-checktype]")){checkAnswer($("#typedAnswer").value);return}
if(e.target.closest("[data-token]")){const i=Number(e.target.closest("[data-token]").dataset.token);order.push({i,word:questions[pos].tokens[i]});renderTokens(questions[pos]);return}
if(e.target.closest("[data-clearorder]")){order=[];renderTokens(questions[pos]);return}
if(e.target.closest("[data-checkorder]")){checkAnswer(order.map(x=>x.word).join(" "));return}
if(e.target.closest("[data-retry]")){questions=buildQuestions();pos=0;first=0;miss=0;drawQuestion();return}
});
const page=document.body.dataset.page;
if(page==="primary-review")beginReview();
else if(page==="primary-dashboard")beginDashboard();
else if(!topic){root.innerHTML='<div class="panel"><h1>الموضوع غير موجود في الفهرس</h1><a href="syllabus.html">فتح المنهج المعتمد</a></div>'}
else if(!lesson){root.innerHTML='<div class="panel"><h1>'+esc(topic.title)+'</h1><p>الموضوع موجود ضمن الفهرس المعتمد، لكن لم يجهز محتواه التفاعلي بعد. لن نعرض تدريبات وهمية.</p><a class="primary" href="syllabus.html?level='+topic.level+'">فهرس المستوى</a></div>'}
else{detailPage();render()}
})();