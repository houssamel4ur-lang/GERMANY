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
for(const file of ['index.html','lesson.html','dashboard.html','review.html','assessment.html','quality.html']){
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
assert.ok(read('syllabus.html').includes('data/syllabus.js'),'syllabus HTML missing data file');
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

for(const page of ['index.html','lesson.html','alphabet.html','syllabus.html']){
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
console.log('PASS: 64 PDF syllabus units, German-only speech policy, MP3 audio sources, and '+lessons.length+' unique lessons, '+lessons.reduce((n,x)=>n+x.words.length,0)+' vocabulary entries, 4 levels, HTML assets and data structure.');
