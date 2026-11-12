(()=>{
'use strict';
const extended={
'a1-01':{
focus:'تتعرف إلى شخص جديد، وتحييه، وتسأله عن اسمه وبلده مستخدماً du وSie عند الحاجة.',
grammar:'التحية: Hallo بين الأصدقاء، وGuten Tag في المواقف الرسمية. للسؤال عن الاسم بصورة غير رسمية قل Wie heißt du? وللمخاطبة الرسمية قل Wie heißen Sie? للتعريف بالنفس قل Ich heiße Sara أو Mein Name ist Sara. في الألمانية يحتل الفعل المصرف غالباً الموضع الثاني في الجملة الخبرية: Ich heiße Sara. وتأتي صيغة الفعل قبل الفاعل في سؤال نعم/لا: Heißt du Ali? في السؤال باستخدام أداة استفهام: Wie heißt du? انتبه إلى أن الحرف ß في heißt يُكتب بصورة مختلفة عن ss، وصوت ch في ich ليس الشين العربية تماماً.',
reading:'Hallo! Ich heiße Sara. Ich bin zwanzig Jahre alt. Ich komme aus Marokko, aber jetzt wohne ich in Berlin. Heute gehe ich in einen Deutschkurs. Dort treffe ich Ali. Er sagt: „Guten Morgen! Wie heißt du?“ Ich antworte: „Ich heiße Sara. Und du?“ Er sagt: „Mein Name ist Ali. Schön, dich kennenzulernen!“ Wir lernen zusammen Deutsch. Am Ende sagen wir: „Auf Wiedersehen!“',
textAr:'مرحباً! اسمي سارة. عمري عشرون سنة. أنا من المغرب، لكنني أسكن الآن في برلين. أذهب اليوم إلى دورة ألمانية. هناك ألتقي علياً. يقول: «صباح الخير! ما اسمك؟» أجيب: «اسمي سارة. وأنت؟» يقول: «اسمي علي. تشرفت بمعرفتك!» نتعلم الألمانية معاً. في النهاية نقول: «إلى اللقاء!»',
dialogue:[
['Guten Morgen! Wie heißt du?','صباح الخير! ما اسمك؟'],
['Hallo! Ich heiße Sara. Und du?','مرحباً! اسمي سارة. وأنت؟'],
['Ich heiße Ali. Woher kommst du?','اسمي علي. من أين أنت؟'],
['Ich komme aus Marokko. Und du?','أنا من المغرب. وأنت؟'],
['Ich komme auch aus Marokko. Schön, dich kennenzulernen!','أنا أيضاً من المغرب. تشرفت بمعرفتك!'],
['Freut mich! Auf Wiedersehen!','سررت بلقائك! إلى اللقاء!']
],
additionalWords:[
['Wie heißen Sie?','ما اسم حضرتك؟','ڤي هايسن زي؟'],
['Mein Name ist ...','اسمي ...','ماين نامه إيسْت'],
['Woher kommst du?','من أين أنت؟','ڤوهير كومْست دو؟'],
['Ich komme aus ...','أنا من ...','إيش كومه آوس'],
['Freut mich!','سررت بلقائك!','فرويت ميش'],
['Schön, dich kennenzulernen!','تشرفت بمعرفتك!','شون ديش كِنن تسو ليرنن'],
['Tschüss!','وداعاً!','تشوس'],
['auch','أيضاً','آوخ']
],
comprehension:[
{q:'أين تسكن سارة الآن؟',options:['في برلين','في ميونخ','في الرباط'],answer:'في برلين',explain:'Sara wohnt jetzt in Berlin.'},
{q:'أين التقت سارة بعلي؟',options:['في دورة اللغة الألمانية','في محطة القطار','في السوق'],answer:'في دورة اللغة الألمانية',explain:'Sie treffen sich im Deutschkurs.'},
{q:'ما الصيغة الرسمية للسؤال عن الاسم؟',options:['Wie heißen Sie?','Wie heißt du?','Woher kommst du?'],answer:'Wie heißen Sie?',explain:'Sie ist die höfliche Anrede.'}
]
},
'a2-01':{
focus:'تصف أحداث عطلة سابقة باستخدام Perfekt وتفرق بين الفعل المساعد haben وsein.',
grammar:'يتكوّن Perfekt من haben أو sein مصروفاً في الموضع الثاني، ثم Partizip II في نهاية الجملة: Ich habe gelernt. Ich bin gefahren. تُستخدم sein عادة مع كثير من أفعال الحركة أو تغير الحالة، مثل gehen, fahren, kommen؛ بينما تُستخدم haben مع أغلب الأفعال الأخرى، مثل kaufen, besuchen, lernen. مع الأفعال المنتظمة غالباً تُضاف ge- و-t، مثل machen → gemacht، بينما تأتي أفعال قوية بتصريف خاص، مثل fahren → gefahren. مثال سؤال: Was hast du gestern gemacht? عند تقديم ظرف الزمن Gestern يأتي الفعل المساعد بعده مباشرة: Gestern habe ich gearbeitet.',
reading:'Letztes Wochenende habe ich viel erlebt. Am Samstag bin ich mit meiner Schwester nach Rabat gefahren. Wir haben zuerst einen Freund besucht und danach in einem kleinen Restaurant gegessen. Am Nachmittag haben wir ein Museum besichtigt. Die Ausstellung war interessant, obwohl es viele Besucher gab. Am Sonntag bin ich früh aufgestanden. Ich habe meine Hausaufgaben gemacht und später einen deutschen Film gesehen. Danach habe ich neue Wörter wiederholt. Das Wochenende war schön, aber am Abend war ich müde.',
textAr:'عشت تجارب كثيرة في عطلة نهاية الأسبوع الماضية. يوم السبت ذهبت مع أختي إلى الرباط. زرنا صديقاً أولاً ثم أكلنا في مطعم صغير. بعد الظهر زرنا متحفاً. كان المعرض ممتعاً رغم كثرة الزوار. يوم الأحد استيقظت مبكراً. أنجزت واجباتي المدرسية ثم شاهدت فيلماً ألمانياً. بعد ذلك راجعت كلمات جديدة. كانت عطلة نهاية الأسبوع جميلة، لكنني شعرت بالتعب مساءً.',
dialogue:[
['Was hast du am Wochenende gemacht?','ماذا فعلت في عطلة نهاية الأسبوع؟'],
['Ich bin nach Rabat gefahren.','سافرت إلى الرباط.'],
['Hast du dort Freunde besucht?','هل زرت أصدقاء هناك؟'],
['Ja, und wir haben zusammen gegessen.','نعم، وأكلنا معاً.'],
['Wann bist du zurückgekommen?','متى عدت؟'],
['Ich bin am Sonntagabend zurückgekommen.','عدت مساء الأحد.']
],
additionalWords:[
['erlebt','عاش تجربة'],
['gefahren','سافر بوسيلة نقل'],
['besichtigt','زار مكاناً للمعاينة'],
['aufgestanden','استيقظ'],
['gesehen','رأى'],
['wiederholt','راجع أو كرر'],
['zurückgekommen','عاد'],
['müde','متعب']
],
comprehension:[
{q:'إلى أي مدينة ذهب المتحدث يوم السبت؟',options:['الرباط','فاس','برلين'],answer:'الرباط',explain:'Er ist nach Rabat gefahren.'},
{q:'ماذا فعل يوم الأحد بعد الواجبات؟',options:['شاهد فيلماً ألمانياً','ذهب إلى المتحف','زار صديقاً'],answer:'شاهد فيلماً ألمانياً',explain:'Er hat einen deutschen Film gesehen.'},
{q:'أي جملة تستخدم sein بشكل صحيح في Perfekt؟',options:['Ich bin gefahren.','Ich habe gefahren.','Ich bin gekauft.'],answer:'Ich bin gefahren.',explain:'fahren mit Ortswechsel nutzt meist sein.'}
]
},
'b1-01':{
focus:'تناقش موضوع العمل الجماعي وتقترح حلولاً مع تقديم أسباب واضحة في اجتماع.',
grammar:'في المستوى B1 يصبح الربط المنطقي بين الأفكار مهماً. استخدم weil أو da لبيان السبب، ويأتي الفعل المصرف في آخر الجملة التابعة: Wir warten, weil die Unterlagen fehlen. أما deshalb فيبدأ جملة رئيسية يأتي الفعل بعدها: Die Unterlagen fehlen. Deshalb warten wir. للتعبير عن الاقتراح المهذب استخدم Konjunktiv II: Wir könnten morgen beginnen. ويمكن استعمال Ich schlage vor, dass wir zuerst die Aufgaben verteilen؛ لأن dass تدفع الفعل إلى نهاية الجملة. تدرب على صياغة موقف مع سبب ومثال ثم توصية.',
reading:'Seit drei Monaten arbeite ich in einer kleinen Firma. Unsere Abteilung entwickelt eine neue Website für Kunden. Das Projekt ist interessant, aber die Aufgaben sind nicht immer klar verteilt. In der letzten Besprechung haben einige Kolleginnen und Kollegen gesagt, dass sie mehr Informationen brauchen. Deshalb habe ich vorgeschlagen, einen gemeinsamen Plan zu erstellen. Zuerst haben wir die wichtigsten Aufgaben gesammelt, danach haben wir Zuständigkeiten festgelegt. Obwohl wir unterschiedliche Meinungen hatten, konnten wir uns auf einen Zeitplan einigen. Ich finde es wichtig, regelmäßig miteinander zu sprechen, weil Missverständnisse sonst zu Verzögerungen führen können. Nächste Woche überprüfen wir, welche Aufgaben bereits erledigt sind.',
textAr:'أعمل منذ ثلاثة أشهر في شركة صغيرة. يطوّر قسمنا موقعاً جديداً للعملاء. المشروع ممتع، لكن المهام لا توزّع دائماً بوضوح. قال بعض الزملاء في الاجتماع الأخير إنهم يحتاجون إلى معلومات أكثر. لذلك اقترحت إعداد خطة مشتركة. جمعنا أولاً أهم المهام، ثم حدّدنا المسؤوليات. ورغم اختلاف آرائنا استطعنا الاتفاق على جدول زمني. أرى أن التواصل المنتظم مهم لأن سوء الفهم قد يؤدي إلى تأخيرات. الأسبوع المقبل سنتحقق من المهام التي أُنجزت بالفعل.',
dialogue:[
['Wie läuft unser neues Projekt?','كيف يسير مشروعنا الجديد؟'],
['Gut, aber einige Aufgaben sind noch unklar.','جيد، لكن بعض المهام ما زالت غير واضحة.'],
['Was schlägst du vor?','ماذا تقترح؟'],
['Wir könnten die Aufgaben heute neu verteilen.','يمكننا إعادة توزيع المهام اليوم.'],
['Das klingt sinnvoll. Wer übernimmt die Dokumentation?','يبدو ذلك منطقياً. من يتولى التوثيق؟'],
['Ich kann das übernehmen, wenn wir den Zeitplan festlegen.','أستطيع تولي ذلك إذا حددنا الجدول الزمني.']
],
additionalWords:[
['die Zuständigkeit','الاختصاص أو المسؤولية'],
['die Verzögerung','التأخير'],
['sich einigen','يتوصل إلى اتفاق'],
['festlegen','يحدد'],
['erledigen','ينجز'],
['die Unterlage','المستند'],
['das Missverständnis','سوء الفهم'],
['der Zeitplan','الجدول الزمني']
],
comprehension:[
{q:'لماذا اقترح المتحدث خطة مشتركة؟',options:['لأن توزيع المهام غير واضح','لأن الشركة أغلقت','لأن المشروع انتهى'],answer:'لأن توزيع المهام غير واضح',explain:'Die Aufgaben waren nicht klar verteilt.'},
{q:'ما القرار الذي توصل إليه الفريق؟',options:['الاتفاق على جدول زمني','إلغاء المشروع','تغيير الشركة'],answer:'الاتفاق على جدول زمني',explain:'Sie konnten sich auf einen Zeitplan einigen.'},
{q:'أي صيغة مناسبة للاقتراح المهذب؟',options:['Wir könnten die Aufgaben verteilen.','Wir verteilt die Aufgaben.','Wir verteilen könnten Aufgaben.'],answer:'Wir könnten die Aufgaben verteilen.',explain:'Konjunktiv II mit könnten plus Infinitiv.'}
]
},
'b2-01':{
focus:'تبني حجة متوازنة حول الوسائط الرقمية وتناقش النتائج الاجتماعية مع عرض موقف مضاد وتوصية.',
grammar:'يتطلب النقاش في B2 عرض أطروحة وحجج مؤيدة ومعارضة ثم استنتاج مدعوم. يمكن الاستعانة بالبنى einerseits ... andererseits لعرض جانبين، وzwar ... aber لإقرار حقيقة مع تقييدها، وobwohl لبيان التنازل (الفعل في نهاية الجملة التابعة)، وdennoch للاستدراك في جملة رئيسية. مثال: Obwohl soziale Medien den Zugang zu Informationen erleichtern, können sie auch Desinformation verbreiten. Zur Bewertung يجب استعمال عبارات محسوبة مثل Es lässt sich argumentieren, dass ... وUnter bestimmten Voraussetzungen ... وليس الجزم دون دليل. يجب توضيح معيار المقارنة وحدود التعميم.',
reading:'Digitale Medien prägen unseren Alltag immer stärker. Einerseits ermöglichen sie einen schnellen Zugang zu Informationen und erleichtern den Austausch über große Entfernungen hinweg. Gerade für Menschen, die in unterschiedlichen Ländern leben, können soziale Netzwerke eine wichtige Verbindung darstellen. Andererseits verbreiten sich dort auch falsche oder irreführende Behauptungen. Wer Nachrichten unkritisch weiterleitet, kann unbeabsichtigt zur Verbreitung von Desinformation beitragen. Ein pauschales Verbot wäre jedoch keine überzeugende Lösung, denn digitale Kommunikation bietet auch gesellschaftliche Chancen. Stattdessen sollte die Medienkompetenz bereits in der Schule gefördert werden. Dazu gehört, Quellen zu vergleichen, zwischen Tatsachen und Meinungen zu unterscheiden und die eigene Reaktion auf emotionale Inhalte zu hinterfragen. Zugleich tragen Plattformen Verantwortung dafür, problematische Inhalte transparent zu behandeln. Entscheidend ist letztlich, die Vorteile digitaler Medien zu nutzen, ohne ihre Risiken zu ignorieren.',
textAr:'تؤثر الوسائط الرقمية في حياتنا اليومية بصورة متزايدة. فمن جهة تتيح وصولاً سريعاً إلى المعلومات وتسهّل التواصل عبر مسافات بعيدة. ويمكن لشبكات التواصل أن تشكل صلة مهمة بين أشخاص يعيشون في بلدان مختلفة. ومن جهة أخرى تنتشر عبرها ادعاءات خاطئة أو مضللة. وقد يساهم من يشارك الأخبار دون نقد، من غير قصد، في نشر المعلومات المضللة. لكن الحظر العام ليس حلاً مقنعاً، لأن التواصل الرقمي يحمل فرصاً اجتماعية أيضاً. وبدلاً من ذلك ينبغي تعزيز الثقافة الإعلامية منذ المدرسة. ويشمل ذلك مقارنة المصادر والتمييز بين الحقائق والآراء والتفكير في ردود أفعالنا تجاه المحتوى العاطفي. كما تتحمل المنصات مسؤولية التعامل بشفافية مع المحتوى الإشكالي. والحاسم في النهاية هو الاستفادة من مزايا الوسائط الرقمية دون تجاهل مخاطرها.',
dialogue:[
['Ich glaube, soziale Medien bieten vor allem Vorteile.','أعتقد أن وسائل التواصل تقدم فوائد بالدرجة الأولى.'],
['Das stimmt teilweise, aber wir sollten die Risiken nicht unterschätzen.','هذا صحيح جزئياً، لكن ينبغي ألا نستهين بالمخاطر.'],
['Welche Risiken meinst du konkret?','ما المخاطر التي تقصدها تحديداً؟'],
['Zum Beispiel verbreiten sich falsche Informationen besonders schnell.','مثلاً تنتشر المعلومات الخاطئة بسرعة خاصة.'],
['Sollten wir solche Plattformen dann stärker regulieren?','هل ينبغي إذن تنظيم هذه المنصات بدرجة أكبر؟'],
['Meiner Ansicht nach brauchen wir sowohl klare Regeln als auch bessere Medienbildung.','أرى أننا نحتاج إلى قواعد واضحة وإلى تعليم إعلامي أفضل معاً.']
],
additionalWords:[
['einerseits','من جهة'],
['andererseits','من جهة أخرى'],
['die Desinformation','المعلومات المضللة'],
['die Medienkompetenz','الثقافة الإعلامية'],
['hinterfragen','يفحص نقدياً'],
['die Tatsache','الحقيقة الواقعية'],
['unbeabsichtigt','دون قصد'],
['pauschal','عام أو شامل']
],
comprehension:[
{q:'لماذا يعارض النص الحظر العام؟',options:['لأن الوسائط الرقمية تقدم فرصاً اجتماعية أيضاً','لأن جميع الأخبار صحيحة','لأن المدارس لا تستخدم الإنترنت'],answer:'لأن الوسائط الرقمية تقدم فرصاً اجتماعية أيضاً',explain:'Digitale Kommunikation bietet auch gesellschaftliche Chancen.'},
{q:'ما الحل الذي يدعمه الكاتب؟',options:['تعزيز الثقافة الإعلامية والمسؤولية','منع القراءة عبر الإنترنت','الاكتفاء بمصدر واحد'],answer:'تعزيز الثقافة الإعلامية والمسؤولية',explain:'Medienkompetenz und Plattformverantwortung.'},
{q:'أي تعبير مناسب لتقديم حجة مقابلة؟',options:['Andererseits ...','Zum Geburtstag ...','Guten Morgen ...'],answer:'Andererseits ...',explain:'Andererseits markiert einen Kontrast.'}
]
}
};
window.DM_SPOTLIGHTS=extended;
})();