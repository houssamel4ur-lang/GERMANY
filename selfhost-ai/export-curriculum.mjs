#!/usr/bin/env node
// Regenerate the local German AI syllabus context from the existing owned
// curriculum and authored drafts. No network calls or external AI APIs.
import {readFileSync,writeFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const paths=[
"data/master-curriculum.js","data/lessons.js","data/course-a1-grammar.js",
"data/course-a1-skills.js","data/course-a2-grammar.js","data/course-a2-skills.js",
"data/primary-lesson-links.js","data/primary-phonetics.js",
"data/curriculum-lessons-2026.js","data/curated-primary-2026.js",
"data/advanced-grammar-b1.js","data/advanced-grammar-b2.js",
"data/advanced-grammar-b1-more.js","data/advanced-grammar-b2-more.js",
"data/advanced-merge.js","data/foundation-a1.js","data/foundation-a2.js",
"data/foundation-merge.js"
];
const window={};
for(const name of paths){
  const script=readFileSync(resolve(root,name),"utf8");
  new Function("window",script)(window);
}
const titles=window.DM_MASTER_CURRICULUM?.topics||[];
const lessons=window.DM_PRIMARY_LESSONS||[];
assert.equal(titles.length,452);
assert.ok(lessons.length>0);
const mapped=new Map(lessons.map(l=>[l.id,l]));
const excerpt=s=>String(s||"").trim();
const corpus={
 version:1,source:"User-approved 2026 A1-B2 PDF outline, plus authored training drafts (not fully human-reviewed)",
 topics:titles.map(t=>{
  const l=mapped.get(t.id);
  return {id:t.id,level:t.level,title:t.title,section:t.section,coverage:l?"draft_interactive":"outline_only",
   explanation:excerpt(l?.explanation).slice(0,1800),
   examples:(l?.examples||[]).slice(0,4).map(x=>({de:excerpt(x[0]),ar:excerpt(x[1])})),
   vocabulary:(l?.vocabulary||[]).slice(0,10).map(x=>({de:excerpt(x.de),ar:excerpt(x.ar)})),
  };
 })
};
const content=JSON.stringify(corpus);
const output=resolve(root,"selfhost-ai/curriculum-context.json");
if(process.argv.includes("--check")){
 assert.equal(readFileSync(output,"utf8"),content,"Outdated corpus: run node selfhost-ai/export-curriculum.mjs");
 console.log("AI CONTEXT CHECK PASS: "+corpus.topics.length+" topics, "+lessons.length+" authored lessons");
}else{
 writeFileSync(output,content);
 console.log("Regenerated self-hosted AI context: "+corpus.topics.length+" syllabus topics and "+lessons.length+" authored lessons.");
}
