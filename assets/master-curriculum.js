/* Primary curriculum index: 452 entries from the approved user PDF. No invented lesson completions. */
(function(){
"use strict";
const root=document.getElementById("curriculumMount");
const master=window.DM_MASTER_CURRICULUM;
if(!root||!master){if(root)root.textContent="تعذر تحميل الفهرس الرئيسي.";return;}
const levels=["A1","A2","B1","B2"];
const labels={A1:"المبتدئ",A2:"الأساسي المتقدم",B1:"المتوسط",B2:"فوق المتوسط"};
const drafts=new Set((window.DM_PRIMARY_LESSONS||[]).map(x=>x.id));
const completed=(()=>{try{return new Set(Object.keys(JSON.parse(localStorage.getItem("deutsch-mastery-primary-v2")||"{}").passed||{}))}catch(e){return new Set()}})();
let query="",sectionFilter="all";
const params=new URLSearchParams(location.search);
let level=levels.includes(params.get("level"))?params.get("level"):"A1";
const topicId=params.get("topic");
const legacyUnit=params.get("unit");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[\u064b-\u065f]/g,"").replace(/[أإآ]/g,"ا").replace(/\s+/g," ").trim();
const findTopic=id=>master.topics.find(x=>x.id===id);
const href=x=>drafts.has(x.id)?"course.html?topic="+encodeURIComponent(x.id):"syllabus.html?level="+encodeURIComponent(x.level)+"&topic="+encodeURIComponent(x.id);
const levelHref=lv=>"syllabus.html?level="+lv;
function levelCards(){
return '<div class="levelgrid">'+master.levels.map(x=>'<a class="levelcard '+(x.level===level?"active":"")+'" href="'+levelHref(x.level)+'"><span class="lv">'+x.level+'</span><h3>'+labels[x.level]+'</h3><p>'+x.count+' موضوعاً ضمن '+x.sections.length+' أقسام</p><small>تصفح المستوى ←</small></a>').join("")+'</div>';
}
function renderOverview(){
const data=master.topics.filter(x=>x.level===level);
const levelData=master.levels.find(x=>x.level===level);
root.innerHTML='<div class="pagehead"><span class="overline">DEUTSCH MASTERY · MASTER CURRICULUM</span><h1>الفهرس الرئيسي لتعلّم الألمانية</h1><p>النسخة المعتمدة من ملفك الجديد: '+master.total_topics+' موضوعاً عبر A1 وA2 وB1 وB2. نتبع ترتيب المصدر كما هو، دون احتساب هذه العناوين دروساً مكتملة.</p></div>'+
'<div class="statgrid" style="margin:20px 0"><div class="panel"><strong>452</strong><span>موضوعاً في الفهرس</span></div><div class="panel"><strong>4</strong><span>مستويات متدرجة</span></div><div class="panel"><strong>16</strong><span>صفحة في ملف المرجع</span></div><div class="panel"><strong>'+levelData.sections.length+'</strong><span>أقسام مستوى '+level+'</span></div></div>'+
levelCards()+
'<section class="section" style="padding-top:32px"><span class="overline">المنهج المعتمد — '+level+'</span><h2>'+level+' · '+labels[level]+'</h2><p class="sub">افتح عنوان أي موضوع لمشاهدة موقعه في الفهرس، أو ابحث باسم القاعدة أو المهارة.</p>'+
'<div class="searchrow"><label for="masterSearch">البحث:</label><input id="masterSearch" type="search" autocomplete="off" placeholder="ابحث داخل '+level+'..." value="'+esc(query)+'"><label for="masterSection">القسم:</label><select id="masterSection"><option value="all">جميع الأقسام</option>'+levelData.sections.map(s=>'<option value="'+esc(s.name)+'" '+(sectionFilter===s.name?"selected":"")+'>'+esc(s.name)+'</option>').join("")+'</select></div><div id="masterSections"></div></section>'+
'<div class="notice">هذه خطة التعلم الرئيسية. المواضيع ذات التدريب الأولي قابلة للاستعمال، لكن تحتاج إلى توسيع ومراجعة. <a href="journey.html">لوحة التقدم الجديدة</a>.</div>';
document.getElementById("masterSearch").addEventListener("input",e=>{query=e.target.value;renderSections()});
document.getElementById("masterSection").addEventListener("change",e=>{sectionFilter=e.target.value;renderSections()});
renderSections();
}
function renderSections(){
const target=document.getElementById("masterSections");
const sections=master.levels.find(x=>x.level===level).sections;
const search=norm(query);
let shown=0;
target.innerHTML=sections.filter(s=>sectionFilter==="all"||s.name===sectionFilter).map(s=>{
const xs=master.topics.filter(x=>x.level===level&&x.section===s.name&&(!search||norm(x.title).includes(search)||norm(s.name).includes(search)));
shown+=xs.length;
if(!xs.length)return "";
return '<details class="panel" '+(search||sectionFilter!=="all"?"open":"open")+'><summary style="cursor:pointer;font-weight:850;font-size:18px"><span class="badge">'+xs.length+' / '+s.count+'</span> '+esc(s.name)+'</summary><div class="divider"></div><div class="lessongrid">'+xs.map(x=>'<a class="lessoncard" href="'+href(x)+'" style="min-height:114px"><span class="kicker">'+level+' · القسم '+x.section_number+' · الموضوع '+String(x.number).padStart(2,"0")+'</span><h3>'+esc(x.title)+'</h3><small>'+(drafts.has(x.id)?(completed.has(x.id)?'✓ اجتزت التدريب':'فتح التدريب التفاعلي الأولي'):'عنوان بالفهرس دون درس تفاعلي')+' ←</small></a>').join("")+'</div></details>';
}).join("")||'<div class="notice">لم يُعثر على موضوع مطابق. جرّب كتابة أخرى.</div>';
const count=document.getElementById("visibleTopics");
if(count)count.textContent=String(shown);
}
function renderDetail(topic){
const same=master.topics.filter(x=>x.level===topic.level);
const i=same.findIndex(x=>x.id===topic.id);
const prev=i>0?same[i-1]:null,next=i+1<same.length?same[i+1]:null;
document.title=topic.title+' · '+topic.level+' | Deutsch Mastery';
root.innerHTML='<div class="crumb"><a href="index.html">الرئيسية</a> / <a href="'+levelHref(topic.level)+'">منهج '+topic.level+'</a> / '+esc(topic.section)+'</div>'+
'<div class="lessonhero"><span class="eyebrow">'+topic.level+' · القسم '+topic.section_number+' · الموضوع '+String(topic.number).padStart(2,"0")+'</span><h1>'+esc(topic.title)+'</h1><p>موضوع مقرر حسب الفهرس الذي اخترته مرجعاً رئيسياً — الصفحة '+topic.page+' من ملف PDF.</p></div>'+
'<div class="panel article"><h2>مكان هذا الموضوع في خطة التعلم</h2><p>المستوى: <b>'+topic.level+'</b> — '+labels[topic.level]+'</p><p>القسم: <b>'+esc(topic.section)+'</b></p><p>المرجع: <b>'+esc(master.source)+'</b>، الصفحة '+topic.page+'</p><div class="notice">عنوان من الفهرس المعتمد. حالة هذا الموضوع موضحة في الرابط التالي.</div>'+
(drafts.has(topic.id)?'<a class="primary" href="course.html?topic='+topic.id+'">فتح التدريب التفاعلي الأولي ←</a>':'<p class="tiny">هذا الموضوع لم يكتمل تأليفه؛ لا يوجد له درس تفاعلي بعد.</p>')+
'</div><div class="controls" style="justify-content:space-between;flex-wrap:wrap"><a class="outline" href="'+levelHref(topic.level)+'">العودة إلى جميع موضوعات '+topic.level+'</a><div class="controls">'+(prev?'<a class="outline" href="'+href(prev)+'">الموضوع السابق</a>':"")+(next?'<a class="primary" href="'+href(next)+'">الموضوع التالي ←</a>':"")+'</div></div>';
}
const topic=findTopic(topicId)||(legacyUnit&&level==="A1"?master.topics.find(x=>x.level==="A1"&&x.section_number===1&&x.number===1):null);
if(topic)renderDetail(topic);else renderOverview();
})();