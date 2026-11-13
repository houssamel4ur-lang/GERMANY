/* Unified, accessible A1-B2 curriculum: 89 coherent study modules preserve all 452 PDF topics. */
(function(){
"use strict";
const root=document.getElementById("curriculumMount");
const master=window.DM_MASTER_CURRICULUM;
const modules=window.DM_LEARNING_MODULES||[];
if(!root||!master||!modules.length){if(root)root.textContent="تعذر تحميل الوحدات الدراسية.";return}
const labels={A1:"المبتدئ",A2:"الأساسي المتقدم",B1:"المتوسط",B2:"فوق المتوسط"};
const valid=["A1","A2","B1","B2"];
const drafted=new Set((window.DM_PRIMARY_LESSONS||[]).map(x=>x.id));
const completed=(()=>{try{return new Set(Object.keys(JSON.parse(localStorage.getItem("deutsch-mastery-primary-v2")||"{}").passed||{}))}catch(e){return new Set()}})();
const topicMap=new Map(master.topics.map(t=>[t.id,t]));
const moduleMap=new Map(modules.map(m=>[m.id,m]));
const queryParams=new URLSearchParams(location.search);
let level=valid.includes(queryParams.get("level"))?queryParams.get("level"):"A1";
let textFilter="",sectionFilter="all";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[\u064b-\u065f]/g,"").replace(/[أإآ]/g,"ا").replace(/\s+/g," ").trim();
const lessonHref=t=>drafted.has(t.id)?"course.html?topic="+encodeURIComponent(t.id):"syllabus.html?level="+t.level+"&topic="+t.id;
const moduleHref=m=>"module.html?module="+encodeURIComponent(m.id);
const byLevel=l=>modules.filter(m=>m.level===l);
const stats=m=>({ready:m.topicIds.filter(id=>drafted.has(id)).length,done:m.topicIds.filter(id=>completed.has(id)).length,count:m.topicIds.length});
function modulesOfSection(s){return byLevel(level).filter(m=>m.sectionId===s.id)}
function levelCards(){
return '<div class="module-levels">'+master.levels.map(l=>'<a class="module-level-link '+(l.level===level?'active':'')+'" href="syllabus.html?level='+l.level+'"><b>'+l.level+'</b><small>'+byLevel(l.level).length+' وحدات دراسية • '+labels[l.level]+'</small></a>').join("")+'</div>';
}
function moduleCard(m,matched){
const count=stats(m),pts=m.topicIds.map(id=>topicMap.get(id));
const visible=matched?pts.filter(t=>norm(t.title).includes(norm(textFilter))||norm(m.title).includes(norm(textFilter))):pts;
return '<article class="module-card"><div class="module-number">'+m.level+' · القسم '+m.sectionIndex+' · الوحدة '+String(m.index).padStart(2,"0")+'</div><a href="'+moduleHref(m)+'"><h3>'+esc(m.title)+'</h3><p>'+esc(pts.slice(0,3).map(t=>t.title).join(" • "))+(pts.length>3?"…":"")+'</p><span class="module-cta">فتح الوحدة المتكاملة ←</span></a>'+
'<div class="module-meta"><span>'+count.count+' نقاط مترابطة</span><span>'+count.ready+' شروح متوفرة</span><span>'+count.done+' اجتزتها</span></div>'+
'<details class="module-topics" '+(matched?'open':'')+'><summary>عرض نقاط الوحدة بالتفصيل ('+pts.length+')</summary><ol class="module-topic-list">'+visible.map(t=>'<li><a href="'+lessonHref(t)+'"><span>'+String(t.number).padStart(2,"0")+'</span><span>'+esc(t.title)+'</span><small class="'+(drafted.has(t.id)?"":"is-planned")+'">'+(drafted.has(t.id)?(completed.has(t.id)?"✓":"تدريب"):"فهرس")+'</small></a></li>').join("")+'</ol></details></article>';
}
function renderSections(){
const target=document.getElementById("moduleSections");
if(!target)return;
const term=norm(textFilter),sections=master.levels.find(l=>l.level===level).sections;
const parts=sections.filter(s=>sectionFilter==="all"||sectionFilter===s.id).map((s,i)=>{
const groups=modulesOfSection(s).filter(m=>!term||norm(m.title).includes(term)||norm(s.name).includes(term)||m.topicIds.some(id=>norm(topicMap.get(id).title).includes(term)));
if(!groups.length)return "";
const ready=groups.reduce((sum,m)=>sum+stats(m).ready,0);
return '<details class="module-section" '+(term||sectionFilter!=="all"||i===0?'open':'')+'><summary><span><span class="overline">'+level+' · القسم '+(i+1)+'</span><h2>'+esc(s.name)+'</h2><span class="sectioncaption">'+groups.length+' وحدات مترابطة · '+s.count+' نقطة في الفهرس · '+ready+' شروح أولية</span></span><span class="badge">'+groups.length+' وحدات</span></summary>'+
'<div class="module-list">'+groups.map(m=>moduleCard(m,Boolean(term))).join("")+'</div></details>';
}).join("");
target.innerHTML=parts||'<div class="notice">لم تجد الوحدة أو الموضوع المطلوب. جرب كلمة أخرى.</div>';
}
function renderOverview(){
const l=master.levels.find(x=>x.level===level),count=byLevel(level).length;
root.innerHTML='<div class="pagehead"><span class="overline">DEUTSCH MASTERY · LEARNING PATH</span><h1>تعلم الألمانية عبر وحدات متكاملة</h1><p>عوض ما تتشتت بين '+master.total_topics+' عنوان صغير، جمعنا النقاط المتقاربة فمسار من '+modules.length+' وحدة واضحة. حافظنا على جميع بنود PDF وعلى ترتيبها الأصلي.</p></div>'+
levelCards()+
'<div class="module-hero"><span class="eyebrow">'+level+' · '+labels[level]+'</span><h1>'+count+' وحدات تعليمية منظمة</h1><p>'+l.count+' نقطة أصلية موزعة على '+l.sections.length+' أقسام. افتح الوحدة، وتابع الشرح والأمثلة والتدريبات من نفس المكان.</p><p class="module-audio-msg">المحتوى غير المكتمل كيبان بوضوح؛ عدد الوحدات ما كيعنيش أنها كلها جاهزة.</p><a class="btn light" href="'+moduleHref(byLevel(level)[0])+'">ابدأ أول وحدة ←</a></div>'+
'<div class="module-overview"><h2 style="margin:0">مسار مستوى '+level+'</h2><div class="searchrow"><label for="masterSearch">بحث</label><input type="search" id="masterSearch" value="'+esc(textFilter)+'" placeholder="بحث في الوحدات والنقاط..."><label for="masterSection">القسم</label><select id="masterSection"><option value="all">جميع الأقسام</option>'+l.sections.map(s=>'<option value="'+s.id+'" '+(sectionFilter===s.id?'selected':'')+'>'+esc(s.name)+'</option>').join("")+'</select></div></div>'+
'<div id="moduleSections"></div>'+
'<div class="module-hint">كل بطاقة تمثل وحدة تعليمية كبيرة، وبداخلها نقاط الفهرس الأصلية. يمكنك فتح الوحدة مباشرة أو إظهار عناوين الأجزاء. <a href="journey.html">شوف تقدمك هنا</a>.</div>';
root.querySelector("#masterSearch").oninput=e=>{textFilter=e.target.value;renderSections()};
root.querySelector("#masterSection").onchange=e=>{sectionFilter=e.target.value;renderSections()};
renderSections();
}
function renderDetail(t){
const module=moduleMap.get(window.DM_MODULE_BY_TOPIC[t.id]);
const prevNext=master.topics.filter(x=>x.level===t.level);
const index=prevNext.findIndex(x=>x.id===t.id);
const prev=prevNext[index-1],next=prevNext[index+1];
root.innerHTML='<div class="crumb"><a href="index.html">الرئيسية</a> / <a href="syllabus.html?level='+t.level+'">'+t.level+'</a> / '+esc(t.section)+'</div>'+
'<div class="module-hero"><span class="eyebrow">'+t.level+' · الموضوع '+t.number+'</span><h1>'+esc(t.title)+'</h1><p>هاد العنوان جزء من الوحدة المتكاملة «'+esc(module?.title||t.section)+'»، ماشي وحدة مستقلة إضافية.</p></div>'+
'<div class="panel article"><h2>تعلم هذا الموضوع في سياقه</h2><p>عوض تتنقل بين صفحات صغيرة، من الأفضل تمشي للوحدة اللي كتجمع هاد النقطة مع النقاط اللي مرتبطة بها.</p>'+
(module?'<p><a class="primary" href="'+moduleHref(module)+'#'+t.id+'">فتح الوحدة المتكاملة ←</a></p>':"")+
(drafted.has(t.id)?'<p><a class="outline" href="'+lessonHref(t)+'">التدريب التفصيلي لهذا الجزء ←</a></p>':'<p class="module-empty">شرح هاد النقطة مازال قيد الإعداد، ولكن عنوانها محفوظ فالفهرس المعتمد.</p>')+'</div>'+
'<div class="module-bottom-nav">'+(prev?'<a href="'+lessonHref(prev)+'">النقطة السابقة</a>':'<span></span>')+'<a href="syllabus.html?level='+t.level+'">جميع الوحدات</a>'+(next?'<a href="'+lessonHref(next)+'">النقطة التالية</a>':'<span></span>')+'</div>';
}
const topicId=queryParams.get("topic");const topic=topicMap.get(topicId);
if(topic)renderDetail(topic);else renderOverview();
})();