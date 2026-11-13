(function(){
"use strict";
const maps={
A1:{
2:["A1-03-07","A1-03-08","A1-03-36"],
3:["A1-03-01","A1-03-04","A1-03-05"],
4:["A1-03-10","A1-03-13","A1-03-15"],
5:["A1-03-17","A1-03-19","A1-03-14"],
6:["A1-03-26","A1-03-25",null],
7:["A1-03-28","A1-03-23","A1-03-35"],
8:["A1-03-29","A1-03-20",null],
9:["A1-02-02","A1-02-04","A1-02-10"],
10:["A1-04-01","A1-04-07","A1-04-08"],
11:["A1-04-18","A1-04-10","A1-04-12"],
12:["A1-04-14","A1-04-16","A1-04-17"],
13:["A1-05-10",null,null],
14:["A1-05-09",null,null],
15:["A1-05-08","A1-05-07",null],
16:["A1-05-01","A1-05-05","A1-02-08"]
},
A2:{
1:["A2-01-02","A2-01-16","A2-01-19"],
2:["A2-01-03","A2-01-05","A2-01-07"],
3:["A2-01-09","A2-01-11","A2-01-14"],
4:["A2-01-23","A2-01-27","A2-01-24"],
5:["A2-01-30","A2-01-32","A2-01-45"],
6:["A2-01-18","A2-01-41","A2-01-20"],
7:["A2-01-37","A2-01-38","A2-01-35"],
8:["A2-01-21","A2-01-42","A2-01-40"],
9:["A2-02-04","A2-03-01","A2-03-10"],
10:["A2-02-05","A2-02-07","A2-02-15"],
11:["A2-02-11","A2-02-13","A2-03-03"],
12:["A2-02-08","A2-02-10","A2-02-17"],
13:["A2-03-12","A2-02-06","A2-03-13"],
14:["A2-03-11","A2-03-09",null],
15:["A2-03-08",null,null],
16:[null,"A2-03-07","A2-03-04"]
}
};
const themeMaps={
B1:["B1-02-07","B1-01-33","B1-02-29","B1-03-01","B1-03-05","B1-02-01","B1-03-11","B1-02-05","B1-02-27","B1-02-11","B1-02-19","B1-02-12","B1-02-23","B1-02-17","B1-03-03","B1-02-20","B1-02-15","B1-02-25","B1-02-09","B1-02-22","B1-03-19",null,"B1-02-21","B1-03-02"],
B2:["B2-04-03",null,"B2-02-02","B2-02-11","B2-02-12","B2-02-07","B2-02-16","B2-02-20","B2-02-06","B2-02-10",null,"B2-02-15","B2-02-31","B2-02-29","B2-02-28","B2-02-14","B2-02-21","B2-02-01","B2-02-32",null,"B2-04-09","B2-02-25","B2-04-19","B2-04-25"]
};
const master=window.DM_MASTER_CURRICULUM, catalog=window.DM_LESSONS||[], course=[];
function add(id,base,part){
 if(!id||!base)return;
 const topic=master.topics.find(x=>x.id===id);
 if(!topic)throw Error("Mapped topic missing "+id);
 if(course.some(x=>x.id===id))throw Error("Duplicate authored topic "+id);
 const ex=part?[part[1],part[2]]:[base.example,base.exampleAr];
 course.push({id,level:topic.level,title:topic.title,
 kind:part?"focused-topic":"theme-practice",
 explanation:part?part[0]:base.grammar,
 examples:[ex,[base.example,base.exampleAr]].filter(x=>x[0]&&x[1]).filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i),
 vocabulary:(base.words||[]).map(x=>Array.isArray(x)?{de:x[0],ar:x[1]}:{de:x.de,ar:x.ar}),
 reading:Array.isArray(base.reading)?base.reading[0]:(base.reading||base.example),translation:Array.isArray(base.reading)?base.reading[1]:(base.textAr||base.exampleAr),dialogue:base.dialogue||[],
 writing:base.writing||"اكتب خمس جمل مترابطة بالألمانية حول هذا الموضوع، وراجع ترتيب الأفعال والروابط.",
 questions:part?[{prompt:part[3][0],answer:part[3][1],options:part[3].slice(1),type:"grammar"},...(Array.isArray(base.reading)&&Array.isArray(base.reading[2])?[{prompt:base.reading[2][0],answer:base.reading[2][1],options:base.reading[2].slice(1),type:"reading"}]:[])]:[],
 source:part?"authored-unit-"+base.n:"practice-"+base.id,
 status:"draft_interactive",
 quality:"تدريب موضوعي قابل للاستخدام، لكن يحتاج توسيعاً ومراجعة لغوية متخصصة قبل اعتباره درساً نهائياً."});
}
function findUnit(level,n){
 const part=n<=8?"PART1":"PART2",base=window["DM_COURSE_"+level+"_"+part]||[];
 return base.find(x=>x.n===n);
}
for(const [level,unitMap] of Object.entries(maps)){
 for(const [n,ids] of Object.entries(unitMap)){
  const base=findUnit(level,Number(n));
  if(!base)throw Error("Missing authored unit "+level+" "+n);
  ids.forEach((id,i)=>add(id,base,base.parts[i]));
 }
}
for(const [level,ids] of Object.entries(themeMaps)){
 const base=catalog.filter(x=>x.level===level);
 ids.forEach((id,i)=>add(id,base[i],null));
}
window.DM_PRIMARY_LESSONS=course;
})();