/* Deepen the canonical 2026 PDF lessons with independently-authored
   explanations, examples and question sets; preserve original topic IDs. */
(function(){
"use strict";
const catalog=window.DM_MASTER_CURRICULUM;
const enrichment=window.DM_CURRICULUM_LESSONS||{};
const source=window.DM_PRIMARY_LESSONS||[];
if(!catalog||!source)throw new Error("Load master curriculum and primary lessons before enrichment");
const byId=new Map(source.map(l=>[l.id,l]));
function unique(items,key){const seen=new Set();return items.filter(x=>{const k=key(x);if(seen.has(k))return false;seen.add(k);return true})}
let appended=0,updated=0;
Object.entries(enrichment).forEach(([oldId,data])=>{
 const match=/^a1-g(01|02)-(\d{2})$/.exec(oldId);
 if(!match)throw Error("Unexpected enrichment topic "+oldId);
 const id="A1-"+match[1]+"-"+match[2];
 const topic=catalog.topics.find(t=>t.id===id);
 if(!topic)throw Error("Topic absent from canonical 452-topic PDF: "+id);
 const extra={
 id,level:topic.level,title:topic.title,kind:"focused-topic",status:"draft_interactive",
 explanation:data.explanation,examples:data.examples.map(x=>[x.de,x.ar]),
 vocabulary:data.examples.map(x=>({de:x.de,ar:x.ar})),
 reading:data.reading.de,translation:data.reading.ar,
 dialogue:data.dialogue.map(x=>[x.de,x.ar]),
 writing:data.task,
 questions:data.questions.map(q=>({type:"grammar",prompt:q.prompt,answer:q.correct,options:q.options})),
 source:"pdf-2026-curated-"+id,
 quality:"شرح وأمثلة وحوار وتمارين مخصصة للموضوع، لكن ما زالت هناك حاجة إلى اختبارات أشمل ومراجعة لغوية بشرية."
 };
 const prior=byId.get(id);
 if(prior){
  prior.explanation=[extra.explanation,prior.explanation].filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).join("\n\n");
  prior.examples=unique([...extra.examples,...prior.examples],x=>x[0]);
  prior.vocabulary=unique([...extra.vocabulary,...prior.vocabulary],x=>x.de);
  prior.dialogue=unique([...extra.dialogue,...prior.dialogue],x=>x[0]);
  prior.questions=unique([...extra.questions,...prior.questions],x=>x.prompt);
  if((extra.reading||"").length>(prior.reading||"").length){prior.reading=extra.reading;prior.translation=extra.translation}
  prior.writing=extra.writing;
  prior.quality=extra.quality;
  updated++;
 }else{
  source.push(extra);byId.set(id,extra);appended++;
 }
});
window.DM_PRIMARY_LESSONS=source;
window.DM_ENRICHMENT_REPORT={appended,updated,total:source.length};
})();