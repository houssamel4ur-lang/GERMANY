(function(){
"use strict";
const master=window.DM_MASTER_CURRICULUM,lessons=window.DM_PRIMARY_LESSONS||[];
if(!master)return;
const count=level=>lessons.filter(x=>x.level===level).length;
document.getElementById("homeStats").innerHTML='<div class="stat"><div>📚</div><div><b>89 وحدة منظمة</b><span>452 نقطة محفوظة من ملفك</span></div></div><div class="stat"><div>✍️</div><div><b>'+lessons.length+' تدريباً أولياً</b><span>محتوى مؤلف حسب الموضوع</span></div></div><div class="stat"><div>🔊</div><div><b>تسجيلات MP3 ألمانية</b><span>بدون استخدام صوت لغة أخرى</span></div></div>';
const meta={A1:["المبتدئ","أساس النطق والتواصل والقواعد"],A2:["الأساسي المتقدم","الماضي والمقارنة والمواقف"],B1:["المتوسط","الرأي والمواقف المهنية"],B2:["فوق المتوسط","الحجاج والتحليل واللغة المتقدمة"]};
document.getElementById("homeLevels").innerHTML=master.levels.map(l=>'<a class="levelcard" href="syllabus.html?level='+l.level+'"><span class="lv">'+l.level+'</span><h3>'+meta[l.level][0]+'</h3><p>'+meta[l.level][1]+'</p><small>'+count(l.level)+' تدريباً أولياً من '+l.count+' موضوعاً ←</small></a>').join("");
const modules=(window.DM_LEARNING_MODULES||[]);
const picks=["A1-01-M01","A2-01-M01","B1-01-M01","B2-01-M01"];
const byTopic=new Map(lessons.map(x=>[x.id,x]));
document.getElementById("homeLessons").innerHTML=picks.map(id=>{
 const m=modules.find(x=>x.id===id);
 if(!m)return "";
 const n=m.topicIds.filter(t=>byTopic.has(t)).length;
 return '<a class="lessoncard" href="module.html?module='+id+'"><span class="badge">'+m.level+' · الوحدة '+m.index+'</span><h3>'+m.title+'</h3><p>'+m.topicIds.length+' نقاط مترابطة · '+n+' أجزاء بشروح وتدريبات متوفرة</p><small>افتح الوحدة المتكاملة ←</small></a>';
}).join("");
})();