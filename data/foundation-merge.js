/* Original lessons for missing A1 and A2 grammar PDF headings.
   All titles/IDs derive from master-curriculum.js, and remain educational drafts. */
(function(){
"use strict";
const master=window.DM_MASTER_CURRICULUM,course=window.DM_PRIMARY_LESSONS;
if(!master||!Array.isArray(course))throw Error("load primary course before foundation merge");
const topicMap=new Map(master.topics.map(x=>[x.id,x]));
const existing=new Set(course.map(x=>x.id));
const additions=[...(window.DM_FOUNDATION_A1||[]),...(window.DM_FOUNDATION_A2||[])];
for(const l of additions){
 const t=topicMap.get(l.id);
 if(!t||existing.has(l.id))throw Error("Unknown or duplicate foundation topic: "+l.id);
 if(!l.explanation||!l.reading||!l.translation||!l.questions.length||l.vocabulary.length!==8)throw Error("Foundation missing content "+l.id);
 course.push({
   id:t.id,level:t.level,title:t.title,kind:"focused-foundation",status:"draft_interactive",
   explanation:l.explanation,examples:l.examples,reading:l.reading,translation:l.translation,
   vocabulary:l.vocabulary.map(pair=>({de:pair[0],ar:pair[1]})),
   dialogue:l.dialogue,writing:l.writing,
   questions:l.questions.map(q=>({type:"grammar",prompt:q.prompt,answer:q.answer,options:q.options})),
   source:"pdf-2026-foundation-"+t.id,
   quality:"مسودة تعليمية أصلية تشرح هذه النقطة بأمثلة وتمارين، وتحتاج مراجعة لغوية بشرية وتوسيعاً قبل اعتمادها نهائياً."
 });
 existing.add(t.id);
}
window.DM_PRIMARY_LESSONS=course;
window.DM_FOUNDATION_REPORT={added:additions.length,A1:additions.filter(x=>x.id.startsWith("A1")).length,A2:additions.filter(x=>x.id.startsWith("A2")).length,total:course.length};
})();