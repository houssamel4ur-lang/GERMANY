(function(){
"use strict";
const master=window.DM_MASTER_CURRICULUM,lessons=window.DM_PRIMARY_LESSONS||[];
if(!master)return;
const count=level=>lessons.filter(x=>x.level===level).length;
document.getElementById("homeStats").innerHTML='<div class="stat"><div>📚</div><div><b>452 موضوعاً</b><span>الفهرس المعتمد من ملفك</span></div></div><div class="stat"><div>✍️</div><div><b>'+lessons.length+' تدريباً أولياً</b><span>محتوى مؤلف حسب الموضوع</span></div></div><div class="stat"><div>🔊</div><div><b>تسجيلات MP3 ألمانية</b><span>بدون استخدام صوت لغة أخرى</span></div></div>';
const meta={A1:["المبتدئ","أساس النطق والتواصل والقواعد"],A2:["الأساسي المتقدم","الماضي والمقارنة والمواقف"],B1:["المتوسط","الرأي والمواقف المهنية"],B2:["فوق المتوسط","الحجاج والتحليل واللغة المتقدمة"]};
document.getElementById("homeLevels").innerHTML=master.levels.map(l=>'<a class="levelcard" href="syllabus.html?level='+l.level+'"><span class="lv">'+l.level+'</span><h3>'+meta[l.level][0]+'</h3><p>'+meta[l.level][1]+'</p><small>'+count(l.level)+' تدريباً أولياً من '+l.count+' موضوعاً ←</small></a>').join("");
const samples=["A1-01-01","A1-03-07","A1-04-10","A2-01-02","B1-03-01","B2-02-06"];
document.getElementById("homeLessons").innerHTML=samples.map(id=>{
const l=lessons.find(x=>x.id===id);if(!l)return "";
return '<a class="lessoncard" href="course.html?topic='+id+'"><span class="badge">'+l.level+'</span><h3>'+l.title+'</h3><p>'+l.explanation.slice(0,110)+'…</p><small>فتح التدريب ←</small></a>';
}).join("");
})();