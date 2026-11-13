import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const w={};
runInNewContext(read("data/master-curriculum.js"),{window:w});
runInNewContext(read("assets/lesson-flow.js"),{window:w});
const items=w.DM_MASTER_CURRICULUM.topics;
const helper=w.DM_LESSON_FLOW;
assert.equal(items.length,452);
const typeCounts={};
for(const topic of items){
 const type=helper.classify(topic);
 assert.ok(["pronunciation","grammar","communication","listening","reading","writing","speaking","exam"].includes(type),topic.id);
 typeCounts[type]=(typeCounts[type]||0)+1;
 const fake={
  explanation:"مثال تدريبي متعلق بموضوع الدرس.",
  vocabulary:[{de:"Wasser",ar:"ماء"}],
  examples:[["Ich trinke Wasser.","أشرب الماء."]],
  dialogue:[["Hallo","مرحباً"],["Guten Tag!","نهارك سعيد"],["Wie geht es dir?","كيف حالك؟"]],
  reading:"Heute besuche ich meine Familie. Danach gehe ich zur Schule, weil ich Deutsch lernen möchte. Am Abend mache ich meine Hausaufgaben und treffe meine Freunde.",
  translation:"أزور عائلتي اليوم.",
  writing:"Schreibe kurze Sätze."
 };
 const flow=helper.get(topic,fake),core=flow.core.map(s=>s.id),extras=flow.extras.map(s=>s.id);
 assert.equal(core[0],"intro",topic.id);
 assert.equal(core.at(-1),"result",topic.id);
 assert.ok(core.includes("exercise"),topic.id);
 assert.ok(core.length>=4&&core.length<=8,"unreasonable path: "+topic.id);
 assert.equal(new Set(core).size,core.length,topic.id);
 assert.equal(new Set([...core,...extras]).size,core.length+extras.length,topic.id);
 assert.deepEqual(flow.core.map(x=>x.number),core.map((_,i)=>i+1),topic.id);
}
const byID=id=>items.find(x=>x.id===id);
assert.equal(helper.classify(byID("A1-01-01")),"pronunciation");
assert.equal(helper.classify(byID("A1-03-01")),"grammar");
assert.equal(helper.classify(byID("A2-01-01")),"grammar");
assert.equal(helper.classify(byID("B1-01-04")),"grammar");
assert.equal(helper.classify(byID("B2-01-02")),"grammar");
assert.equal(helper.classify(byID("B2-03-01")),"reading");
assert.equal(helper.classify(byID("B2-03-12")),"listening");
assert.equal(helper.classify(byID("B2-04-01")),"writing");
assert.equal(helper.classify(byID("B2-04-21")),"speaking");
assert.equal(helper.classify(byID("B2-05-14")),"exam");
const prep=helper.get(byID("A1-01-01"),{
 explanation:"الحروف والنطق",vocabulary:[{de:"Apfel",ar:"تفاحة"}],
 alphabet:[["A","a","/aː/","Apfel","تفاحة"]],
 examples:[["Guten Tag","مرحباً"]],reading:"Ich lerne.",dialogue:[]
});
assert.deepEqual(prep.core.map(x=>x.id),["intro","grammar","audio","vocab","exercise","result"]);
assert.equal(prep.core.length,6);
assert.ok(prep.extras.every(x=>!prep.core.some(y=>y.id===x.id)));
assert.match(read("assets/primary-study.js"),/const tabs=flow\?\.core\|\|\[\]/);
assert.match(read("assets/primary-study.js"),/stage-sidebar-meter/);
assert.match(read("assets/primary-study.js"),/lesson-stage-footer/);
assert.match(read("course.html"),/assets\/lesson-flow\.js/);
console.log("STAGE FLOW CHECK PASS: "+items.length+" PDF topics, adaptive CEFR paths and optional material preserved. Classes:",typeCounts);
