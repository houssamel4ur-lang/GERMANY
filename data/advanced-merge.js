/* Add original B1/B2 grammar drafts to the canonical PDF topic course.
 * IDs and headings always originate from data/master-curriculum.js. */
(function(){
"use strict";
const master=window.DM_MASTER_CURRICULUM;
const source=window.DM_PRIMARY_LESSONS;
if(!master||!Array.isArray(source))throw new Error("Primary curriculum must load before advanced grammar");
const map=new Map(master.topics.map(t=>[t.id,t]));
const ids=new Set(source.map(x=>x.id));
const incoming=[...(window.DM_ADVANCED_GRAMMAR_B1||[]),...(window.DM_ADVANCED_GRAMMAR_B2||[])];
for(const item of incoming){
 const t=map.get(item.id);
 if(!t)throw new Error("Unknown advanced curriculum topic "+item.id);
 if(ids.has(item.id))throw new Error("Duplicate advanced lesson "+item.id);
 if(!item.explanation||!Array.isArray(item.vocabulary)||item.vocabulary.length<8||!item.reading||!item.translation||!Array.isArray(item.questions))throw new Error("Advanced lesson fields missing for "+item.id);
 source.push({
 id:item.id,level:t.level,title:t.title,kind:"focused-advanced-grammar",
 status:"draft_interactive",explanation:item.explanation,
 examples:item.examples,
 vocabulary:item.vocabulary.map(v=>({de:v[0],ar:v[1]})),
 reading:item.reading,translation:item.translation,
 dialogue:item.dialogue,
 writing:item.writing,
 questions:item.questions.map(q=>({type:"grammar",prompt:q.prompt,answer:q.answer,options:q.options})),
 source:"advanced-2026-"+item.id,
 quality:"درس أصلي مخصص للقاعدة بمستوى متقدم، ويحتاج مراجعة لغوية بشرية وتدريباً أطول للاستماع والكتابة."
 });
 ids.add(item.id);
}
window.DM_PRIMARY_LESSONS=source;
window.DM_ADVANCED_REPORT={added:incoming.length,b1:incoming.filter(x=>x.id.startsWith("B1")).length,b2:incoming.filter(x=>x.id.startsWith("B2")).length,total:source.length};
})();