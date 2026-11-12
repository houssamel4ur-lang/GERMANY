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
console.log('PASS: '+lessons.length+' unique lessons, '+lessons.reduce((n,x)=>n+x.words.length,0)+' vocabulary entries, 4 levels, HTML assets and data structure.');
