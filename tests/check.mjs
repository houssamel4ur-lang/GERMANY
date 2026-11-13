import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=(p)=>readFileSync(new URL(p,root),'utf8');
const win={};
runInNewContext(read('data/lessons.js'),{window:win});
const lessons=win.DM_LESSONS;
assert.equal(lessons.length,96,'expect 96 lessons');
const levels=['A1','A2','B1','B2'];
for(const level of levels){
  const units=lessons.filter(x=>x.level===level);
  assert.equal(units.length,24,level+' requires 24 units');
}
const ids=new Set();
for(const unit of lessons){
  assert.ok(!ids.has(unit.id),'duplicate lesson ID: '+unit.id);ids.add(unit.id);
  assert.match(unit.id,/^(a1|a2|b1|b2)-\d{2}$/);
  for(const prop of ['title','focus','grammar','example','exampleAr','reading','textAr'])assert.ok(typeof unit[prop]==='string'&&unit[prop].trim().length>=5,unit.id+' missing '+prop);
  assert.ok(unit.reading.length>unit.example.length,'reading should extend example: '+unit.id);
  assert.ok(Array.isArray(unit.words)&&unit.words.length>=8,unit.id+' vocabulary too short');
  assert.ok(Array.isArray(unit.dialogue)&&unit.dialogue.length>=2,unit.id+' dialogue missing');
  for(const w of unit.words)assert.ok(w.de?.trim()&&w.ar?.trim(),unit.id+' invalid vocabulary');
}
for(const file of ['legacy.html','lesson.html','dashboard.html','review.html','assessment.html','quality.html']){
  const html=read(file);
  for(const asset of ['assets/style.css','assets/app.js','data/lessons.js'])assert.ok(html.includes(asset),file+' missing '+asset);
  assert.ok(html.includes('lang="ar"')&&html.includes('dir="rtl"'),file+' missing Arabic locale');
}
for(const file of ['assets/style.css','assets/app.js','data/lessons.js'])assert.ok(existsSync(new URL(file,root)),file+' missing');

const syllabusWin={};
runInNewContext(read('data/syllabus.js'),{window:syllabusWin});
const syllabus=syllabusWin.DM_SYLLABUS;
assert.equal(syllabus.length,64,'PDF syllabus requires 64 units');
for(const level of levels){
  const entries=syllabus.filter(x=>x.level===level);
  assert.equal(entries.length,16,level+' requires 16 syllabus units');
  assert.deepEqual(Array.from(entries,x=>x.number),Array.from({length:16},(_,i)=>i+1));
}
assert.equal(new Set(syllabus.map(x=>x.id)).size,64,'syllabus unit IDs must be unique');
assert.ok(syllabus.every(x=>x.title.length>2&&x.points.length>=2&&x.sourcePage>=2&&x.sourcePage<=17),'syllabus missing PDF details');
assert.ok(existsSync(new URL('data/syllabus.js',root)),'archived syllabus data missing');
assert.ok(read('alphabet.html').includes('data/phonetics.js'),'alphabet page must load lesson data');
assert.ok(read('alphabet.html').includes('assets/phonetics.js'),'alphabet page must load interactive script');
const audioLesson=read('assets/phonetics.js');
assert.match(audioLesson,/^.*filter\(function\(v\).*\^de/m,'phonetics must filter de voices');
assert.match(audioLesson,/if\(!v\)\{/,'phonetics audio must reject missing German voice');
const application=read('assets/app.js');
assert.match(application,/function isGermanVoice\(/,'require explicit German voice validator');
assert.match(application,/\.filter\(isGermanVoice\)/,'audio must filter German voices');
assert.match(application,/if\(!voice\)\{/,'audio must reject missing German voice');
assert.match(application,/function initSyllabus\(/,'curriculum page should be interactive');

for(const page of ['index.html','lesson.html','alphabet.html']){
  assert.ok(read(page).includes('assets/german-player.js'),page+' must load German MP3 player');
  assert.ok(read(page).includes('data/audio-index.js'),page+' must load audio index');
}
const audioMapWin={};
runInNewContext(read('data/audio-index.js'),{window:audioMapWin});
const audioMap=audioMapWin.DM_AUDIO_MAP||{};
assert.ok(Object.keys(audioMap).length>=100,'at least 100 verified German MP3 clips');
for(const path of Object.values(audioMap))assert.ok(existsSync(new URL(path,root)),'recorded MP3 file missing: '+path);
assert.match(read('assets/german-player.js'),/new Audio\(/,'German player must use MP3');
assert.match(read('assets/german-player.js'),/stopImmediatePropagation/,'German player must override old browser speech handlers');

// Approved *primary* user curriculum, extracted from the replacement 16-page PDF.
const masterWin={};
runInNewContext(read('data/master-curriculum.js'),{window:masterWin});
const master=masterWin.DM_MASTER_CURRICULUM;
assert.equal(master.total_topics,452,'approved primary PDF lists 452 topics');
assert.equal(master.pages,16,'primary PDF has 16 pages');
assert.equal(master.topics.length,452,'all entries must be indexed');
assert.equal(new Set(master.topics.map(x=>x.id)).size,452,'primary curriculum identifiers must be unique');
const masterCounts={A1:[12,10,36,20,12],A2:[45,25,15],B1:[55,30,25],B2:[62,38,19,31,17]};
for(const [level,counts] of Object.entries(masterCounts)){
 const groups=master.levels.find(x=>x.level===level).sections;
 assert.equal(groups.length,counts.length,level+' section count mismatch');
 for(let i=0;i<groups.length;i++){
  const xs=master.topics.filter(x=>x.level===level&&x.section===groups[i].name);
  assert.equal(xs.length,counts[i],level+' topic count mismatch: '+groups[i].name);
  assert.deepEqual(Array.from(xs,x=>x.number),Array.from({length:counts[i]},(_,j)=>j+1),level+' topic order mismatch');
 }
}
assert.ok(master.topics.every(x=>x.status==='outlined'&&x.page>=2&&x.page<=15),'index topics cannot be mislabeled as completed lessons');
assert.ok(read('syllabus.html').includes('data/master-curriculum.js'),'syllabus must load new approved primary PDF');
assert.ok(read('syllabus.html').includes('assets/master-curriculum.js'),'syllabus must load primary curriculum UI');
assert.ok(!read('syllabus.html').includes('data/syllabus.js'),'archived 64-topic index must not be active on syllabus page');
assert.ok(read('index.html').includes('452 موضوعاً'),'homepage must identify main 452-topic source');

assert.ok(read('index.html').includes('assets/primary-home.js'),'new landing page must run primary curriculum UI');
for(const [page,rootId] of [['course.html','primaryStudyMount'],['journey.html','primaryStudyMount'],['review-primary.html','primaryStudyMount']]){
 const body=read(page);
 assert.ok(body.includes('data/master-curriculum.js')&&body.includes('data/primary-lesson-links.js')&&body.includes('data/primary-phonetics.js'),page+' missing authored data dependencies');
 assert.ok(body.includes('assets/primary-study.js')&&body.includes(rootId),page+' missing interactive study controller');
 assert.ok(body.includes('assets/german-player.js')&&body.includes('data/audio-index.js'),page+' must use MP3 audio');
}
assert.ok(read('syllabus.html').includes('data/primary-lesson-links.js')&&read('syllabus.html').includes('data/primary-phonetics.js'),'primary syllabus must load active lessons');
const draftWin={};
for(const path of [
 'data/master-curriculum.js','data/lessons.js',
 'data/course-a1-grammar.js','data/course-a1-skills.js',
 'data/course-a2-grammar.js','data/course-a2-skills.js',
 'data/primary-lesson-links.js','data/primary-phonetics.js'
])runInNewContext(read(path),{window:draftWin});
const draftLessons=draftWin.DM_PRIMARY_LESSONS;
assert.equal(draftLessons.length,138,'expected 138 accurately mapped initial lessons');
assert.equal(new Set(draftLessons.map(x=>x.id)).size,draftLessons.length,'duplicate authored lesson ID');
for(const [level,count] of Object.entries({A1:50,A2:44,B1:23,B2:21})){
 assert.equal(draftLessons.filter(x=>x.level===level).length,count,level+' draft coverage mismatch');
}
for(const l of draftLessons){
 const t=master.topics.find(t=>t.id===l.id);
 assert.ok(t&&t.level===l.level&&t.title===l.title,'lesson must match exact approved PDF topic: '+l.id);
 assert.ok(l.explanation?.trim().length>=60,'insufficient authored explanation: '+l.id);
 assert.ok(l.examples?.length>=1,'missing original German examples: '+l.id);
 assert.ok(l.vocabulary?.length>=8,'too few vocabulary examples: '+l.id);
 assert.ok(typeof l.reading==='string'&&l.reading.length>=12,'reading should be original German text: '+l.id);
 assert.ok(typeof l.translation==='string'&&l.translation.length>=12,'missing Arabic reading translation: '+l.id);
 assert.ok(l.dialogue?.length>=2,'missing sample German dialogue: '+l.id);
 assert.ok(l.questions?.length>=1,'missing formative exercise: '+l.id);
 assert.ok(l.status==='draft_interactive','draft cannot claim completeness: '+l.id);
}
assert.match(read('assets/primary-study.js'),/first\/questions\.length/,'quiz must use real first-attempt scoring');
assert.match(read('assets/primary-study.js'),/JSON\.stringify\(\{version:KEY,progress:state\}/,'progress export must produce backup');
assert.ok(!read('assets/primary-study.js').includes('speechSynthesis'),'primary curriculum must never fallback to wrong-language speech');


console.log('PASS: 452 primary topics, 138 initial interactive lesson drafts, 64 archived topics, German-only speech policy, MP3 audio sources, and '+lessons.length+' unique lessons, '+lessons.reduce((n,x)=>n+x.words.length,0)+' vocabulary entries, 4 levels, HTML assets and data structure.');
