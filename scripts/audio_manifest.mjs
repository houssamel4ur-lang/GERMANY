import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {runInNewContext} from "node:vm";
const w={};
runInNewContext(readFileSync("data/lessons.js","utf8"),{window:w});
runInNewContext(readFileSync("data/phonetics.js","utf8"),{window:w});
const mode=process.argv[2]||"smoke";
const collected=[];
const add=t=>{if(typeof t!=="string")return;t=t.trim();if(t.length>0&&!collected.includes(t))collected.push(t)};
["Guten Morgen","Hallo","Danke","Guten Tag","Wie heißt du?","Ich heiße Sara.","Auf Wiedersehen","Tschüss","Ich lerne Deutsch."].forEach(add);
const p=w.DM_PHONETICS;
if(p){
 p.letters.forEach(x=>{add(x[0]+" wie "+x[1]);add(x[1])});
 p.special.forEach(x=>add(x[1]));
 p.longShort.forEach(x=>{add(x[0]);add(x[1])});
 p.stress.forEach(x=>add(x[0]));
 p.questions.forEach(x=>add(x.audio));
}
const lessons=w.DM_LESSONS||[];
if(mode==="smoke"){
 lessons.slice(0,2).forEach(l=>{l.words.forEach(x=>add(x.de));add(l.example);add(l.reading)});
}else if(mode==="all"){
 lessons.forEach(l=>{l.words.forEach(x=>add(x.de));add(l.example);add(l.reading);l.dialogue.forEach(x=>add(x[0]))});
}else throw Error("Unexpected mode: "+mode);

// New approved syllabus: only recorded German expressions from genuinely authored topic lessons.
if(mode==="all"){
 const sources=[
 "data/master-curriculum.js",
 "data/course-a1-grammar.js",
 "data/course-a1-skills.js",
 "data/course-a2-grammar.js",
 "data/course-a2-skills.js",
 "data/primary-lesson-links.js",
 "data/primary-phonetics.js",
 "data/curriculum-lessons-2026.js",
 "data/curated-primary-2026.js",
 "data/advanced-grammar-b1.js",
 "data/advanced-grammar-b2.js",
 "data/advanced-grammar-b1-more.js",
 "data/advanced-grammar-b2-more.js",
 "data/advanced-merge.js",
 "data/foundation-a1.js",
 "data/foundation-a2.js",
 "data/foundation-merge.js",
 "data/structured-a1-pronunciation.js"
 ];
 for(const path of sources)runInNewContext(readFileSync(path,"utf8"),{window:w});
 for(const lesson of w.DM_PRIMARY_LESSONS||[]){
  for(const word of lesson.vocabulary)add(word.de);
  for(const x of lesson.examples)add(x[0]);
  for(const x of lesson.dialogue)add(x[0]);
  add(lesson.reading);
  // Independently authored pronunciation lessons contain additional German
  // examples that the ordinary vocabulary arrays do not include.
  for(const block of lesson.grammarBlocks||[])
    for(const pair of block.examples||[])add(pair[0]);
  for(const part of lesson.pronunciation||[])
    for(const word of part.words||[])add(word);
  for(const row of lesson.alphabet||[]){
    add(row[3]); // the German example word, not the IPA transcription
    add(row[0]+" wie "+row[3]);
  }
 }
 // The standalone practice packs are shown in separate pages. Their audio
 // must be inventoried too, not only the newer focused lessons.
 const packs=[
  ...(w.DM_COURSE_A1_PART1||[]),...(w.DM_COURSE_A1_PART2||[]),
  ...(w.DM_COURSE_A2_PART1||[]),...(w.DM_COURSE_A2_PART2||[])
 ];
 for(const pack of packs){
  for(const part of pack.parts||[])add(part[1]);
  for(const word of pack.words||[])add(word[0]);
  for(const dialogue of pack.dialogue||[])add(dialogue[0]);
  if(pack.reading)add(pack.reading[0]);
 }
 // Earlier independent authored lessons used by the alternative curriculum UI.
 for(const lesson of Object.values(w.DM_CURRICULUM_LESSONS||{})){
  for(const row of lesson.examples||[])add(row.de);
  for(const row of lesson.dialogue||[])add(row.de);
  if(lesson.reading)add(lesson.reading.de);
 }
}

const data=collected.map(text=>({text,path:"assets/audio/de_"+createHash("sha256").update(text).digest("hex").slice(0,24)+".mp3"}));
process.stdout.write(JSON.stringify({mode,voice:"de-DE-KatjaNeural",entries:data},null,2));
