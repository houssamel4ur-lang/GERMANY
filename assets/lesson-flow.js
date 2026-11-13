/* Pedagogically structured lessons, not one fixed eight-step template.
 * Every topic retains its source PDF position and all authored material.
 * Pure data helper: can be tested without a browser, audio device or API.
 */
(function(){
"use strict";
const names={
 intro:"الهدف والتمهيد",
 grammar:"الشرح خطوة بخطوة",
 vocab:"الكلمات والتعبيرات",
 audio:"استمع وقلّد",
 conversation:"التواصل الشفهي",
 reading:"افهم النص ثم اكتب",
 exercise:"تدريبات الدرس",
 result:"النتيجة والمراجعة"
};
const typeNames={
 pronunciation:"الحروف والنطق",
 grammar:"القواعد",
 communication:"التواصل والمواقف",
 listening:"فهم المسموع",
 reading:"القراءة والفهم",
 writing:"الكتابة والتعبير",
 speaking:"المحادثة والتعبير الشفهي",
 exam:"التدريب والامتحان"
};
const sequences={
 pronunciation:["intro","grammar","audio","vocab","exercise","result"],
 grammar:["intro","grammar","vocab","audio","reading","exercise","result"],
 communication:["intro","vocab","audio","conversation","reading","exercise","result"],
 listening:["intro","audio","vocab","reading","exercise","result"],
 reading:["intro","reading","vocab","exercise","result"],
 writing:["intro","grammar","reading","exercise","result"],
 speaking:["intro","vocab","conversation","audio","exercise","result"],
 exam:["intro","reading","audio","exercise","result"]
};
function classify(topic){
 const sectionId=String(topic?.id||"").slice(0,5);
 const title=String(topic?.title||"").normalize("NFKC");
 if(sectionId==="A1-01")return "pronunciation";
 if(["A1-03","A2-01","B1-01","B2-01"].includes(sectionId))return "grammar";
 // These larger syllabus sections contain multiple different real-world skills.
 if(sectionId==="B2-03"){
  return /استماع|المسموع|النقاشات|المقابلات|المقابالت|التقارير|الوثائقيات|المحاضرات|السرعة الطبيعية|تدوين الملاحظات|المواقف الضمنية/i.test(title)?"listening":"reading";
 }
 if(sectionId==="B2-04"){
  return /التحدث|الشفهي|العرض|المناقشة|إدارة الحوار|Diskussion|الأسئلة غير المتوقعة|التعبيرات الطبيعية|النبر والتنغيم|الدفاع عن الموقف|الاعتراض المهذب|الشك والاحتمال|الحلول الواقعية|مقارنة البدائل|إعادة الصياغة شفويا/i.test(title)?"speaking":"writing";
 }
 if(["A1-05","A2-03","B1-03","B2-05"].includes(sectionId)){
  if(/امتحان|اختبار|محاكاة|المراجعة النهائية|مراجعة B1 وB2|تحليل نقاط الضعف|إدارة الوقت/i.test(title))return "exam";
  if(/استماع|المسموع|الصوتية|Hören|الاذاعية|الإذاعية|الأخبار|محادثات قصيرة|فهم البرامج/i.test(title))return "listening";
  if(/قراءة|القراءة|Lesen|إعلان|النصوص|تلخيص|استخراج الأفكار|ملاحظات/i.test(title))return "reading";
  if(/كتابة|رسالة|بريد|نص رأي|Schreiben|استفسار|شكوى|استمارة/i.test(title))return "writing";
  if(/تقديم|التحدث|المحادثة|حوار|تخطيط|مناقشة|شفهي|العرض|Sprechen|الطالقة|النطق|الرأي|الحجج|وصف|الموافقة|الاتفاق|الاختلاف|الاعتراض|الحلول/i.test(title))return "speaking";
  return "communication";
 }
 return "communication";
}
function hasLongReading(lesson){
 return String(lesson?.reading||"").trim().split(/\s+/).filter(Boolean).length>=18;
}
function hasDialogue(lesson){
 const turns=(lesson?.dialogue||[]).filter(x=>Array.isArray(x)&&x[0]&&x[1]);
 return turns.length>=3&&!turns.every(x=>(lesson?.examples||[]).some(e=>e[0]===x[0]));
}
function meaningful(stage,lesson){
 if(stage==="vocab")return (lesson?.vocabulary||[]).length>0;
 if(stage==="audio")return (lesson?.vocabulary||[]).some(x=>x.de)|| (lesson?.pronunciation||[]).length>0||
  (lesson?.examples||[]).length>0||(lesson?.alphabet||[]).length>0;
 if(stage==="grammar")return !!String(lesson?.explanation||"").trim()||(lesson?.grammarBlocks||[]).length>0;
 if(stage==="conversation")return hasDialogue(lesson)||(lesson?.rolePlay||[]).length>0;
 if(stage==="reading")return hasLongReading(lesson)||(lesson?.readingQuestions||[]).length>0||
   !!String(lesson?.writingModel||"").trim();
 return true;
}
function get(topic,lesson){
 const kind=classify(topic);
 const core=sequences[kind].filter(x=>meaningful(x,lesson));
 // Do not hide already-authored activity. Less central skills are offered
 // after the clear ordered learning path, separately from required stages.
 const extras=["grammar","vocab","audio","conversation","reading"].filter(
  x=>!core.includes(x)&&meaningful(x,lesson)
 );
 const titleMap={...names};
 if(kind==="pronunciation"){
  titleMap.grammar="افهم الأصوات والقواعد";
  titleMap.audio="تدريب الأذن والنطق";
  titleMap.vocab="كلمات لتثبيت الأصوات";
 }else if(kind==="grammar"){
  titleMap.grammar="القاعدة والأمثلة";
  titleMap.vocab="مصطلحات الأمثلة";
  titleMap.audio="استمع للأمثلة";
  titleMap.reading="القاعدة داخل نص";
 }else if(kind==="listening"){
  titleMap.audio="استمع وافهم";
  titleMap.reading="تأكد من الفهم";
 }else if(kind==="reading"){
  titleMap.reading="اقرأ وحلّل النص";
  titleMap.vocab="مفردات النص";
 }else if(kind==="writing"){
  titleMap.grammar="ابنِ الجمل والأسلوب";
  titleMap.reading="نموذج وكتابة";
 }else if(kind==="speaking"){
  titleMap.conversation="تدرّب على الحوار";
  titleMap.audio="اسمع وكرّر";
 }
 return {
  kind,kindTitle:typeNames[kind],
  core:core.map((id,i)=>({id,label:titleMap[id],number:i+1})),
  extras:extras.map(id=>({id,label:titleMap[id]}))
 };
}
window.DM_LESSON_FLOW={classify,get,hasDialogue,hasLongReading};
})();
