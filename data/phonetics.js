(function(){
"use strict";
// Original teaching material for PDF syllabus A1 / Unit 01: Alphabet & Pronunciation
window.DM_PHONETICS={
title:"الحروف والنطق",level:"A1",unit:"01",
goal:"تميّز أسماء الحروف والأصوات الألمانية الخاصة، وتفرّق بين الحركات الطويلة والقصيرة وتتهجّى الاسم.",
letters:[
["A","Apfel","تفاحة"],["B","Buch","كتاب"],["C","Computer","حاسوب"],["D","Danke","شكراً"],
["E","Essen","طعام"],["F","Fisch","سمك"],["G","Garten","حديقة"],["H","Haus","منزل"],
["I","Insel","جزيرة"],["J","Jahr","سنة"],["K","Kind","طفل"],["L","Liebe","حب"],
["M","Mutter","أم"],["N","Name","اسم"],["O","Ofen","فرن"],["P","Papier","ورق"],
["Q","Quelle","مصدر / نبع"],["R","Radio","راديو"],["S","Sonne","شمس"],["T","Tag","يوم"],
["U","Uhr","ساعة"],["V","Vater","أب"],["W","Wasser","ماء"],["X","Xylophon","إكسيليفون"],
["Y","Yoga","يوغا"],["Z","Zeit","وقت"],["Ä","Ärger","انزعاج"],["Ö","Öl","زيت"],
["Ü","Übung","تمرين"],["ß","Straße","شارع"]
],
special:[
["sch","Schule","صوت قريب من الشين العربية، كما في Schule"],
["ch بعد i/e","ich","صوت احتكاكي أمامي /ç/ وليس شيناً عربية تماماً"],
["ch بعد a/o/u","Buch","صوت حلقي /x/ قريب من الخاء"],
["sp في بداية المقطع","Sport","عادة /ʃp/؛ شْب"],
["st في بداية المقطع","Straße","عادة /ʃt/؛ شْت"],
["z","Zeit","غالباً /ts/؛ تْس"],
["w","Wasser","غالباً /v/؛ ڤ"],
["v في كلمات شائعة","Vater","قد ينطق /f/؛ توجد استثناءات حسب الكلمة"],
["ei","mein","عادة /aɪ/ مثل آي"],
["ie","Liebe","غالباً /iː/ ياء طويلة"]
],
longShort:[
["bieten","bitten","في bieten صوت i طويل /iː/، وفي bitten صوت i قصير /ɪ/"],
["Ofen","offen","في Ofen حرف o طويل /oː/، وفي offen قصير /ɔ/"],
["Staat","Stadt","في Staat صوت a طويل /aː/، وفي Stadt صوت a قصير /a/"],
["Miete","Mitte","في Miete صوت i طويل، وفي Mitte قصير"]
],
stress:[
["Mutter","غالباً النبر على المقطع الأول: MUT-ter"],
["arbeiten","غالباً النبر على المقطع الأول: AR-bei-ten"],
["verstehen","النبر على المقطع الثاني: ver-STEH-en"],
["Telefon","النبر على المقطع الأخير: Te-le-FON"]
],
questions:[
{q:"ماذا يرمز الصوت sch غالباً في الألمانية؟",options:["صوت ش قريب من العربية","صوت تْس","صوت ك"],answer:0},
{q:"استمع إلى كلمة Schule. ما المجموعة التي تبدأ بها؟",audio:"Schule",options:["sch","ch","st"],answer:0},
{q:"كيف يُنطق الحرف z غالباً؟",options:["تْس /ts/","ز فقط","ش"],answer:0},
{q:"ما الصوت الأول في كلمة Straße؟",audio:"Straße",options:["/ʃt/","/st/ الإنجليزية","/ts/"],answer:0},
{q:"في الكلمة الألمانية Liebe، ماذا تشير ie غالباً؟",options:["صوت i طويل","صوت ei","صوت u قصير"],answer:0},
{q:"أي كلمة فيها صوت i أطول؟",audio:"bieten, bitten",options:["bieten","bitten","كلاهما بنفس المدة"],answer:0},
{q:"كيف يُنطق الحرف w في Wasser غالباً؟",audio:"Wasser",options:["/v/ مثل ڤ","/w/ الإنجليزية","/f/ دائماً"],answer:0},
{q:"أي زوج يوضح اختلاف ch بحسب موقعه؟",options:["ich وBuch","Tag وZeit","Name وMutter"],answer:0},
{q:"ما الصوت الشائع لحرف v في Vater؟",audio:"Vater",options:["/f/","/v/ في كل كلمة ألمانية","/ʃ/"],answer:0},
{q:"لماذا يجب الاستماع إلى الكلمات بدل الاعتماد على الكتابة العربية فقط؟",options:["لأن بعض الأصوات الألمانية لا مقابل دقيق لها بالعربية","لأن الحروف الألمانية لا تُنطق","لأن الأسماء لا تُقرأ بالألمانية"],answer:0}
]
};
})();