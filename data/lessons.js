(()=>{
"use strict";
const vocabulary={
 A1:[
["التحيات والتعارف","Hallo! Ich heiße Sara.","مرحباً! اسمي سارة.","Hallo=مرحباً;Guten Morgen=صباح الخير;Guten Tag=نهارك سعيد;Wie heißt du?=ما اسمك؟;Ich heiße ...=اسمي ...;Auf Wiedersehen=إلى اللقاء;Danke=شكراً;Bitte=من فضلك"],
["الحروف والأصوات","Mein Name ist Ali.","اسمي علي.","der Buchstabe=الحرف;der Name=الاسم;buchstabieren=يتهجّى;langsam=ببطء;wiederholen=يكرر;hören=يسمع;sprechen=يتحدث;verstehen=يفهم"],
["الأرقام من صفر إلى مئة","Ich habe zwei Bücher.","لدي كتابان.","null=صفر;eins=واحد;zwei=اثنان;drei=ثلاثة;zehn=عشرة;zwanzig=عشرون;hundert=مئة;die Zahl=العدد"],
["البلدان واللغات","Ich komme aus Marokko.","أنا من المغرب.","Deutschland=ألمانيا;Marokko=المغرب;kommen=يأتي;wohnen=يسكن;sprechen=يتحدث;Deutsch=الألمانية;Arabisch=العربية;die Sprache=اللغة"],
["العمر والمعلومات الشخصية","Ich bin zwanzig Jahre alt.","عمري عشرون سنة.","alt=كبير في السن;das Alter=العمر;das Jahr=السنة;jung=شاب;geboren=مولود;ledig=أعزب;verheiratet=متزوج;die Adresse=العنوان"],
["الأسرة والأقارب","Meine Schwester wohnt in Berlin.","أختي تسكن في برلين.","die Mutter=الأم;der Vater=الأب;der Bruder=الأخ;die Schwester=الأخت;die Eltern=الوالدان;das Kind=الطفل;die Familie=الأسرة;der Sohn=الابن"],
["الضمائر والفعل sein","Wir sind heute zu Hause.","نحن اليوم في المنزل.","ich=أنا;du=أنت;er=هو;sie=هي;wir=نحن;ihr=أنتم;sind=نكون;ist=يكون"],
["الفعل haben والملكية","Ich habe einen Computer.","لدي حاسوب.","haben=يملك;der Computer=الحاسوب;das Handy=الهاتف;das Buch=الكتاب;die Tasche=الحقيبة;mein=لي;dein=لك;kein=لا شيء من"],
["المنزل والغرف","Die Küche ist neben dem Bad.","المطبخ بجانب الحمام.","das Haus=المنزل;die Wohnung=الشقة;das Zimmer=الغرفة;die Küche=المطبخ;das Bad=الحمام;die Tür=الباب;das Fenster=النافذة;das Bett=السرير"],
["الأشياء وأدوات التعريف","Der Tisch ist groß.","الطاولة كبيرة.","der Tisch=الطاولة;der Stuhl=الكرسي;die Lampe=المصباح;das Heft=الدفتر;der Schlüssel=المفتاح;die Uhr=الساعة;groß=كبير;klein=صغير"],
["الألوان والصفات","Mein Auto ist blau.","سيارتي زرقاء.","rot=أحمر;blau=أزرق;grün=أخضر;schwarz=أسود;weiß=أبيض;schön=جميل;neu=جديد;alt=قديم"],
["الطعام والشراب","Ich trinke Wasser und esse Brot.","أشرب الماء وآكل الخبز.","das Wasser=الماء;das Brot=الخبز;die Milch=الحليب;der Kaffee=القهوة;der Tee=الشاي;essen=يأكل;trinken=يشرب;der Hunger=الجوع"],
["السوق والتسوق","Wie viel kostet das Brot?","كم ثمن الخبز؟","kaufen=يشتري;kosten=يكلّف;teuer=غالٍ;billig=رخيص;das Geld=المال;der Preis=السعر;der Laden=المحل;bezahlen=يدفع"],
["أيام الأسبوع","Am Montag arbeite ich.","أعمل يوم الاثنين.","Montag=الاثنين;Dienstag=الثلاثاء;Mittwoch=الأربعاء;Donnerstag=الخميس;Freitag=الجمعة;Samstag=السبت;Sonntag=الأحد;heute=اليوم"],
["الوقت والساعة","Es ist halb acht.","الساعة السابعة والنصف.","die Uhrzeit=الوقت;die Stunde=الساعة;die Minute=الدقيقة;früh=مبكراً;spät=متأخراً;halb=نصف;viertel=ربع;um=عند الساعة"],
["الروتين اليومي","Ich stehe jeden Morgen um sieben Uhr auf.","أستيقظ كل صباح الساعة السابعة.","aufstehen=ينهض;frühstücken=يتناول الفطور;duschen=يستحم;arbeiten=يعمل;lernen=يتعلم;schlafen=ينام;abends=مساءً;morgens=صباحاً"],
["الأفعال في المضارع","Du lernst jeden Tag Deutsch.","أنت تتعلم الألمانية كل يوم.","lernen=يتعلم;machen=يفعل;spielen=يلعب;arbeiten=يعمل;lesen=يقرأ;schreiben=يكتب;fragen=يسأل;antworten=يجيب"],
["طرح الأسئلة","Wo wohnst du?","أين تسكن؟","wer=من;was=ماذا;wo=أين;woher=من أين;wann=متى;wie=كيف;warum=لماذا;welche=أيّ"],
["النفي بـ nicht و kein","Ich habe heute keine Zeit.","ليس لدي وقت اليوم.","nicht=لا;kein=ليس أي;die Zeit=الوقت;frei=متفرغ;heute=اليوم;leider=للأسف;nie=أبداً;immer=دائماً"],
["الاتجاهات والأماكن","Der Bahnhof ist links.","محطة القطار على اليسار.","links=يسار;rechts=يمين;geradeaus=مباشرة;der Bahnhof=محطة القطار;die Straße=الشارع;die Schule=المدرسة;die Bank=المصرف;die Apotheke=الصيدلية"],
["المواصلات والتذاكر","Ich fahre mit dem Bus zur Arbeit.","أذهب إلى العمل بالحافلة.","der Bus=الحافلة;der Zug=القطار;die Fahrkarte=التذكرة;fahren=يسافر بوسيلة نقل;einsteigen=يركب;aussteigen=ينزل;die Haltestelle=الموقف;die Fahrt=الرحلة"],
["الملابس والشراء","Ich suche eine schwarze Jacke.","أبحث عن سترة سوداء.","die Jacke=السترة;das Hemd=القميص;die Hose=السروال;die Schuhe=الأحذية;die Größe=المقاس;anprobieren=يجرّب اللباس;tragen=يرتدي;passen=يناسب"],
["الهوايات وأوقات الفراغ","Am Wochenende spiele ich Fußball.","ألعب كرة القدم في نهاية الأسبوع.","das Hobby=الهواية;schwimmen=يسبح;kochen=يطبخ;tanzen=يرقص;reisen=يسافر;lesen=يقرأ;gern=بسرور;das Wochenende=عطلة نهاية الأسبوع"],
["الصحة والموعد الطبي","Ich habe Kopfschmerzen und brauche einen Termin.","أعاني من صداع وأحتاج إلى موعد.","der Arzt=الطبيب;die Ärztin=الطبيبة;krank=مريض;der Schmerz=الألم;der Termin=الموعد;die Apotheke=الصيدلية;das Fieber=الحمّى;gesund=بصحة جيدة"]
 ],
 A2:[
["مراجعة الماضي Perfekt","Gestern habe ich meine Freundin besucht.","زرت صديقتي أمس.","gestern=أمس;besuchen=يزور;gearbeitet=عمل;gelernt=تعلّم;gekauft=اشترى;gemacht=فعل;das Wochenende=نهاية الأسبوع;letzte Woche=الأسبوع الماضي"],
["السفر والتخطيط للرحلة","Wir haben ein Hotel am Meer gebucht.","حجزنا فندقاً قرب البحر.","buchen=يحجز;das Hotel=الفندق;die Reise=السفر;der Urlaub=العطلة;der Koffer=الحقيبة;der Flughafen=المطار;der Pass=جواز السفر;ankommen=يصل"],
["الوصف في الماضي","Früher wohnte ich auf dem Land.","كنت أسكن في الريف سابقاً.","früher=سابقاً;damals=آنذاك;war=كان;hatte=كان لديه;das Dorf=القرية;die Stadt=المدينة;umziehen=ينتقل للسكن;die Erinnerung=الذكرى"],
["السكن والبحث عن شقة","Die Wohnung ist hell, aber die Miete ist hoch.","الشقة مضيئة لكن الإيجار مرتفع.","die Miete=الإيجار;der Vermieter=المالك;hell=مضيء;die Nebenkosten=المصاريف الإضافية;möbliert=مفروش;die Anzeige=الإعلان;der Umzug=الانتقال;die Kaution=الوديعة"],
["المواعيد وتغيير الخطط","Können wir den Termin auf Freitag verschieben?","هل يمكننا تأجيل الموعد إلى الجمعة؟","verschieben=يؤجل;absagen=يلغي;vereinbaren=يتفق على موعد;der Kalender=التقويم;pünktlich=في الوقت;die Verspätung=التأخير;dringend=عاجل;frei haben=يكون متفرغاً"],
["العمل والمهنة","Ich arbeite seit zwei Jahren in einer Firma.","أعمل منذ سنتين في شركة.","der Beruf=المهنة;die Stelle=الوظيفة;die Firma=الشركة;das Gehalt=الراتب;der Vertrag=العقد;die Bewerbung=طلب التوظيف;die Erfahrung=الخبرة;die Schicht=نوبة العمل"],
["الشراء والإرجاع","Ich möchte dieses Gerät zurückgeben.","أود إرجاع هذا الجهاز.","zurückgeben=يرجع;umtauschen=يستبدل;die Quittung=الإيصال;kaputt=معطّل;die Garantie=الضمان;die Reklamation=الشكوى;der Kunde=الزبون;bestellen=يطلب"],
["الصحة والنصائح","Du solltest mehr Wasser trinken.","ينبغي لك شرب مزيد من الماء.","sollte=ينبغي;die Untersuchung=الفحص;der Blutdruck=ضغط الدم;die Medizin=الدواء;die Tablette=القرص الدوائي;der Husten=السعال;die Übung=التمرين;die Erholung=الراحة"],
["الطعام والوصفات","Zuerst schneide ich das Gemüse, dann koche ich die Suppe.","أقطع الخضار أولاً ثم أطبخ الحساء.","zuerst=أولاً;danach=بعد ذلك;schneiden=يقطع;kochen=يطبخ;backen=يخبز;die Zutat=المكوّن;das Rezept=الوصفة;die Suppe=الحساء"],
["التعليم والدورات","Ich lerne Deutsch, weil ich in Deutschland studieren möchte.","أتعلم الألمانية لأنني أريد الدراسة في ألمانيا.","der Kurs=الدورة;die Prüfung=الامتحان;bestehen=ينجح;das Zeugnis=الشهادة;der Unterricht=الدرس;die Aufgabe=الواجب;üben=يتدرب;die Note=النقطة"],
["الطقس والفصول","Obwohl es regnet, gehen wir spazieren.","رغم أن الجو ممطر، سنخرج للمشي.","der Regen=المطر;die Wolke=السحابة;die Temperatur=درجة الحرارة;der Frühling=الربيع;der Sommer=الصيف;der Herbst=الخريف;der Winter=الشتاء;der Wind=الرياح"],
["التواصل عبر الهاتف","Kannst du mir später eine Nachricht schicken?","هل تستطيع إرسال رسالة لي لاحقاً؟","anrufen=يتصل هاتفياً;die Nachricht=الرسالة;schicken=يرسل;der Empfang=التغطية;das Passwort=كلمة المرور;die Verbindung=الاتصال;erreichbar=متاح للاتصال;das Gespräch=المحادثة"],
["الهوايات والرياضة","Seit einem Jahr gehe ich regelmäßig ins Fitnessstudio.","منذ سنة أذهب بانتظام إلى النادي الرياضي.","regelmäßig=بانتظام;trainieren=يتدرب;die Mannschaft=الفريق;gewinnen=يفوز;verlieren=يخسر;die Bewegung=الحركة;anstrengend=متعب;das Ziel=الهدف"],
["المشاعر والعلاقات","Ich freue mich auf unseren Besuch.","أتطلع إلى زيارتنا.","sich freuen=يفرح;traurig=حزين;zufrieden=راضٍ;wütend=غاضب;die Freundschaft=الصداقة;vertrauen=يثق;streiten=يتشاجر;sich entschuldigen=يعتذر"],
["الأعياد والمناسبات","Wir laden unsere Freunde zum Fest ein.","ندعو أصدقاءنا إلى الاحتفال.","einladen=يدعو;feiern=يحتفل;das Geschenk=الهدية;der Geburtstag=عيد الميلاد;die Einladung=الدعوة;die Hochzeit=الزفاف;der Feiertag=العطلة الرسمية;gratulieren=يهنئ"],
["الخدمات العامة","Ich muss meinen neuen Wohnsitz anmelden.","يجب أن أسجل محل إقامتي الجديد.","das Bürgeramt=مكتب شؤون المواطنين;anmelden=يسجل;der Ausweis=بطاقة الهوية;das Formular=الاستمارة;unterschreiben=يوقع;die Behörde=الإدارة;die Unterlage=المستند;die Öffnungszeit=ساعات العمل"],
["المقارنة والتفضيل","Dieser Zug ist schneller als der Bus.","هذا القطار أسرع من الحافلة.","schneller=أسرع;besser=أفضل;günstiger=أقل سعراً;am besten=الأفضل;vergleichen=يقارن;die Auswahl=الاختيار;praktisch=عملي;bequem=مريح"],
["الرسائل والبريد الإلكتروني","Ich schreibe Ihnen, weil ich eine Frage habe.","أكتب إليكم لأن لدي سؤالاً.","die E-Mail=البريد الإلكتروني;der Betreff=الموضوع;die Anrede=التحية الافتتاحية;mit freundlichen Grüßen=مع خالص التحية;die Antwort=الرد;die Bitte=الطلب;die Anfrage=الاستفسار;die Anlage=المرفق"],
["حوادث ومواقف يومية","Ich habe meinen Schlüssel verloren.","فقدت مفتاحي.","verlieren=يفقد;finden=يجد;der Unfall=الحادث;die Polizei=الشرطة;die Hilfe=المساعدة;vergessen=ينسى;passieren=يحدث;vorsichtig=حذر"],
["التسوق الإلكتروني","Die Bestellung ist noch nicht angekommen.","لم يصل الطلب بعد.","die Bestellung=الطلب;die Lieferung=التوصيل;das Paket=الطرد;der Versand=الشحن;der Warenkorb=سلة التسوق;die Rückgabe=الإرجاع;überweisen=يحوّل مالاً;das Konto=الحساب"],
["البيئة اليومية","Wir trennen zu Hause Papier und Plastik.","نفصل الورق والبلاستيك في المنزل.","der Müll=القمامة;trennen=يفصل;recyceln=يعيد التدوير;das Papier=الورق;die Umwelt=البيئة;sparen=يوفر;der Strom=الكهرباء;die Energie=الطاقة"],
["المدينة والريف","Auf dem Land ist es ruhiger als in der Stadt.","الريف أهدأ من المدينة.","das Land=الريف;die Gegend=المنطقة;ruhig=هادئ;laut=صاخب;die Nachbarschaft=الحيّ;die Natur=الطبيعة;die Infrastruktur=البنية التحتية;das Dorf=القرية"],
["الخطط المستقبلية","Nächstes Jahr möchte ich eine Ausbildung beginnen.","أريد أن أبدأ تدريباً مهنياً السنة القادمة.","nächstes Jahr=السنة القادمة;die Ausbildung=التكوين المهني;der Plan=الخطة;vorhaben=ينوي;entscheiden=يقرر;die Zukunft=المستقبل;vorbereiten=يستعد;hoffen=يأمل"],
["التعامل مع المواقف الطارئة","Wenn du Hilfe brauchst, ruf mich an.","إذا احتجت إلى مساعدة فاتصل بي.","die Notrufnummer=رقم الطوارئ;der Notfall=الطوارئ;die Gefahr=الخطر;helfen=يساعد;retten=ينقذ;dringend=عاجل;die Verletzung=الإصابة;die Feuerwehr=الإطفاء"]
 ]
};
const grammar={
A1:[
"التحيات الرسمية وغير الرسمية: استخدم Hallo مع الأصدقاء، وGuten Tag في المواقف الرسمية. اسأل عن الاسم بـ Wie heißt du? أو Wie heißen Sie? للصيغة الرسمية.",
"الأسماء الألمانية تبدأ بحرف كبير. للتأكد من التهجئة قل: Wie schreibt man das? ثم استمع إلى الأحرف واحداً واحداً.",
"الأعداد المركبة بين 21 و99 تُقرأ عادة بالآحاد ثم und ثم العشرات، مثل einundzwanzig = 21.",
"الفعل kommen يأتي: ich komme, du kommst, er kommt. للسؤال عن الأصل قل Woher kommst du?",
"يُعبَّر عن العمر بـ sein: Ich bin 20 Jahre alt. لا تستخدم haben مباشرة للتعبير عن العمر.",
"الملكية: mein Bruder, meine Schwester. يتغيّر شكل ضمير الملكية حسب جنس الاسم وحالته.",
"تصريف sein: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
"تصريف haben: ich habe, du hast, er/sie/es hat. المفعول به المذكر يأتي غالباً einen.",
"مواقع الأشياء: in, auf, neben, unter. قد تتطلب حروف الجر حالة الداتيف أو الأكوزاتيف حسب الحركة أو الثبات.",
"أدوات التعريف في حالة الرفع: der للمذكر، die للمؤنث، das للمحايد، die للجمع. احفظ كل اسم مع أداته.",
"الصِّفة الخبرية بعد sein لا تتغير: Das Auto ist blau. أما قبل الاسم فتنتهي بنهايات بحسب الجنس والحالة.",
"الفعل المصرف عادة في المرتبة الثانية بالجملة الخبرية: Ich trinke Wasser. في سؤال نعم/لا يتقدم الفعل: Trinkst du Wasser?",
"للسؤال عن السعر: Wie viel kostet ...? وللتعبير عن رغبة مهذبة: Ich möchte ...",
"أيام الأسبوع أسماء وتبدأ بحرف كبير: am Montag، am Freitag. تُستعمل am مع اليوم.",
"لذكر الساعة استعمل um: um acht Uhr. نصف الثامنة بالألمانية halb acht = 7:30.",
"الأفعال القابلة للفصل: aufstehen ← ich stehe ... auf. الجزء المنفصل ينتقل إلى آخر الجملة.",
"نهايات المضارع للأفعال المنتظمة: ich -e, du -st, er -t, wir -en, ihr -t, sie -en.",
"أسئلة W تبدأ بأداة السؤال ثم الفعل المصرف: Wo wohnst du? Wann kommst du?",
"استعمل kein لنفي اسم غير معرّف: Ich habe kein Auto؛ وnicht لنفي الفعل أو الصفة أو ظرف.",
"الاتجاهات: Gehen Sie geradeaus. Biegen Sie rechts ab. صيغة Sie مهذبة في الإرشاد.",
"الفعل fahren يُستعمل غالباً مع وسائل النقل، ويمكن استخدام mit + Dativ: mit dem Bus.",
"صيغة المفعول للمذكر: einen Mantel. مع مقاس الملابس نسأل: Welche Größe haben Sie?",
"الظروف gern, lieber, am liebsten تعبر عن درجة التفضيل: Ich spiele gern Fußball.",
"عبارات الصحة الأساسية: Ich habe Kopfschmerzen. Ich brauche einen Termin. لا تُعد هذه العبارات بديلاً عن نصيحة طبية."
],
A2:[
"زمن Perfekt: haben/sein المصرف + Partizip II في آخر الجملة: Ich habe gelernt. استخدم sein مع كثير من أفعال الحركة والتغير.",
"في الماضي يُستعمل haben/sein مع التصريف الثالث. انتبه للفعل buchen → gebucht.",
"الفعلان sein وhaben شائعان بصيغة Präteritum: ich war, ich hatte. ويُستخدم الماضي في وصف العادات القديمة.",
"الجملة التابعة بـ aber تظل جملة رئيسية عادية: Die Miete ist hoch, aber die Wohnung ist hell.",
"الأفعال المركبة: einen Termin vereinbaren/verschieben/absagen؛ وافعال modal: Können wir ...?",
"حرف الجر seit مع Dativ للدلالة على بداية مدة مستمرة: seit zwei Jahren.",
"الفعل möchten للتعبير المهذب عن الرغبة؛ والفعل zurückgeben قابل للفصل: ich gebe ... zurück.",
"لإبداء نصيحة استخدم sollte: Du solltest zum Arzt gehen. تبقى صيغة المصدر في نهاية الجملة.",
"عبارات التسلسل الزمني: zuerst, danach, dann, schließlich؛ مع الحفاظ على موضع الفعل.",
"weil تُدخل جملة تابعة والفعل المصرف يذهب لآخرها: ..., weil ich Deutsch lernen möchte.",
"obwohl تُدخل جملة تنازلية والفعل في النهاية: Obwohl es regnet, gehen wir spazieren.",
"الأفعال مع Dativ وAkkusativ: Ich schicke dir eine Nachricht. dir للمستفيد وeine Nachricht للمفعول.",
"seit مع المدة المستمرة حتى الآن: seit einem Jahr؛ ومع الزمن الماضي المنتهي استخدم vor einem Jahr.",
"الأفعال الانعكاسية: Ich freue mich; Du freust dich؛ انتبه للضمير الصحيح.",
"الأفعال المنفصلة: einladen → Ich lade meine Freunde ein; eingeladen في Perfekt.",
"الأفعال مع المفعول: Ich muss das Formular ausfüllen. يجب وضع مصدر الفعل بعد müssen.",
"المقارنة: schnell → schneller → am schnellsten؛ مع als: schneller als.",
"الرسائل الرسمية تبدأ بـ Sehr geehrte Damen und Herren أو بصيغة محددة، وتنتهي غالباً بـ Mit freundlichen Grüßen.",
"Perfekt مع haben: Ich habe den Schlüssel verloren. الترتيب: فعل مساعد في المرتبة الثانية وتصريف ثالث في النهاية.",
"النفي الزمني بـ noch nicht: Die Bestellung ist noch nicht angekommen.",
"في الأمر الجمعي مع wir: Trennen wir den Müll. ومع müssen: Wir müssen Müll trennen.",
"الصفات المقارنة تتبع نمط ruhiger als؛ وتُستعمل als عند المقارنة بين شيئين مختلفين.",
"الخطة المستقبلية يمكن التعبير عنها بالمضارع مع ظرف زمن: Nächstes Jahr beginne ich eine Ausbildung.",
"جملة الشرط بـ wenn: Wenn du Hilfe brauchst, ruf mich an. انتبه للفعل في آخر جملة الشرط."
]
};
function make(level,records){return records.map((v,i)=>{
let [title,example,exampleAr,raw]=v;let words=raw.split(';').map(x=>{let ix=x.indexOf('=');return {de:x.slice(0,ix),ar:x.slice(ix+1)}}).filter(x=>x.de&&x.ar);
return {id:level.toLowerCase()+'-'+String(i+1).padStart(2,'0'),n:i+1,level,title,focus:'تعلّم مفردات وتراكيب '+title+' واستخدمها في جمل صحيحة.',grammar:grammar[level]?.[i]||'',example,exampleAr,reading:example,textAr:exampleAr,words,dialogue:[[example,exampleAr],[words[0].de,words[0].ar]],minutes:40};
})}
window.DM_PART1=[...make('A1',vocabulary.A1),...make('A2',vocabulary.A2)];
})();

(()=>{
"use strict";
const vocabulary={
B1:[
["المشاركة في نقاش حول العمل","In unserer Abteilung sprechen wir oft über neue Projekte.","نتحدث كثيراً في قسمنا عن مشاريع جديدة.","die Abteilung=القسم;das Projekt=المشروع;die Besprechung=الاجتماع;der Vorschlag=الاقتراح;die Zusammenarbeit=التعاون;vereinbaren=يتفق على;die Verantwortung=المسؤولية;die Aufgabe=المهمة"],
["السبب والنتيجة","Da der Zug ausgefallen ist, komme ich später.","بما أن القطار أُلغي فسأصل متأخراً.","ausfallen=يُلغى;deshalb=لذلك;deswegen=لهذا السبب;aus diesem Grund=لهذا السبب;die Ursache=السبب;die Folge=النتيجة;später=لاحقاً;die Störung=العطل"],
["وصف تجربة شخصية","Als ich zum ersten Mal allein gereist bin, war ich nervös.","عندما سافرت وحدي للمرة الأولى كنت متوتراً.","die Erfahrung=التجربة;nervös=متوتر;zum ersten Mal=للمرة الأولى;erleben=يعيش تجربة;unerwartet=غير متوقع;die Reise=الرحلة;die Erinnerung=الذكرى;mutig=شجاع"],
["التعبير عن الرأي","Meiner Meinung nach ist regelmäßiges Üben sehr wichtig.","في رأيي التدريب المنتظم مهم جداً.","meiner Meinung nach=في رأيي;ich finde=أرى أن;zustimmen=يوافق;widersprechen=يعارض;das Argument=الحجة;überzeugend=مقنع;begründen=يبرر;die Meinung=الرأي"],
["تقديم اقتراحات وحلول","Wir könnten zuerst die wichtigsten Probleme lösen.","يمكننا حل أهم المشكلات أولاً.","der Vorschlag=الاقتراح;die Lösung=الحل;verbessern=يحسن;zuerst=أولاً;die Priorität=الأولوية;umsetzen=ينفذ;die Möglichkeit=الإمكانية;das Problem=المشكلة"],
["المدرسة والنظام التعليمي","Viele Schülerinnen und Schüler bereiten sich auf Prüfungen vor.","يستعد كثير من التلاميذ للامتحانات.","die Schule=المدرسة;die Ausbildung=التكوين;das Studium=الدراسة الجامعية;der Abschluss=الشهادة النهائية;die Prüfung=الامتحان;die Voraussetzung=الشرط المسبق;vorbereiten=يستعد;der Lernplan=خطة التعلم"],
["رسائل رسمية وشكاوى","Hiermit möchte ich mich über die verspätete Lieferung beschweren.","أود بموجب هذه الرسالة تقديم شكوى بشأن التسليم المتأخر.","die Beschwerde=الشكوى;die Lieferung=التسليم;verspätet=متأخر;die Rückmeldung=الرد;die Frist=المهلة;erstatten=يعيد مالاً;erwarten=يتوقع;die Kundschaft=العملاء"],
["السيرة الذاتية ومقابلة العمل","Ich habe während meiner Ausbildung praktische Erfahrungen gesammelt.","اكتسبت خبرة عملية أثناء تكويني المهني.","der Lebenslauf=السيرة الذاتية;die Stärke=نقطة القوة;die Schwäche=نقطة الضعف;die Erfahrung=الخبرة;die Qualifikation=المؤهل;die Bewerbung=الترشح;das Vorstellungsgespräch=مقابلة العمل;zuverlässig=موثوق"],
["التخطيط للمستقبل","Wenn ich die Prüfung bestehe, möchte ich eine Weiterbildung machen.","إذا نجحت في الامتحان أود متابعة تكوين إضافي.","bestehen=ينجح;die Weiterbildung=التكوين المستمر;die Zukunft=المستقبل;planen=يخطط;erreichen=يحقق;das Ziel=الهدف;die Entscheidung=القرار;die Entwicklung=التطور"],
["السكن والمجتمع","In unserer Nachbarschaft gibt es viele kulturelle Angebote.","توجد في حيّنا أنشطة ثقافية كثيرة.","die Nachbarschaft=الحي;das Angebot=العرض;die Gemeinde=الجماعة المحلية;die Miete=الإيجار;die Integration=الاندماج;der Kontakt=التواصل;gemeinsam=معاً;der Verein=الجمعية"],
["الأخبار ووسائل الإعلام","Bevor ich eine Nachricht teile, überprüfe ich die Quelle.","قبل أن أشارك خبراً أتحقق من مصدره.","die Nachricht=الخبر;die Quelle=المصدر;überprüfen=يتحقق;die Zeitung=الصحيفة;der Bericht=التقرير;veröffentlichen=ينشر;glaubwürdig=موثوق;die Überschrift=العنوان الرئيسي"],
["العادات الصحية","Wer regelmäßig schläft, kann sich oft besser konzentrieren.","من ينام بانتظام يستطيع غالباً التركيز بصورة أفضل.","die Gewohnheit=العادة;der Schlaf=النوم;sich konzentrieren=يركز;die Ernährung=التغذية;die Bewegung=النشاط البدني;ausreichend=كافٍ;die Gesundheit=الصحة;die Belastung=الضغط"],
["الاقتصاد الشخصي","Ich versuche, jeden Monat einen Teil meines Einkommens zu sparen.","أحاول ادخار جزء من دخلي كل شهر.","das Einkommen=الدخل;die Ausgabe=المصروف;das Budget=الميزانية;der Kredit=القرض;die Rechnung=الفاتورة;sparen=يدخر;die Versicherung=التأمين;die Kosten=التكاليف"],
["التكنولوجيا في الحياة","Seitdem ich eine Lern-App benutze, übe ich häufiger.","منذ أن بدأت استخدام تطبيق تعليمي أصبحت أتدرب أكثر.","die Anwendung=التطبيق;die Datei=الملف;hochladen=يرفع ملفاً;herunterladen=ينزل ملفاً;der Datenschutz=حماية البيانات;die Einstellung=الإعداد;die Benachrichtigung=الإشعار;die Sicherheit=الأمان"],
["المقارنة بين البدائل","Einerseits ist das Fahrrad günstig, andererseits ist der Weg lang.","من جهة الدراجة رخيصة ومن جهة أخرى الطريق طويل.","einerseits=من جهة;andererseits=من جهة أخرى;der Vorteil=الميزة;der Nachteil=العيب;abwägen=يوازن;die Alternative=البديل;geeignet=مناسب;die Entscheidung=القرار"],
["السفر وحل المشكلات","Obwohl unser Flug verspätet war, haben wir den Anschlusszug erreicht.","رغم تأخر رحلتنا الجوية لحقنا بالقطار المتصل.","die Verspätung=التأخير;der Anschlusszug=قطار الربط;die Reservierung=الحجز;umbuchen=يعيد الحجز;die Erstattung=التعويض;die Verbindung=الوصلة;erreichen=يلحق;der Flug=الرحلة الجوية"],
["البيئة والاستدامة","Wir können Energie sparen, indem wir Geräte vollständig ausschalten.","يمكننا توفير الطاقة بإطفاء الأجهزة تماماً.","die Nachhaltigkeit=الاستدامة;die Energie=الطاقة;ausschalten=يطفئ;die Ressource=المورد;vermeiden=يتجنب;der Abfall=النفايات;der Verbrauch=الاستهلاك;die Umwelt=البيئة"],
["الثقافة والعادات","In verschiedenen Regionen werden Feste unterschiedlich gefeiert.","تُحتفل بالمناسبات بطرق مختلفة في المناطق المتنوعة.","die Kultur=الثقافة;die Tradition=التقليد;die Region=المنطقة;die Vielfalt=التنوع;der Brauch=العرف;die Feier=الاحتفال;die Bedeutung=الأهمية;die Herkunft=الأصل"],
["الصداقة وسوء الفهم","Nachdem wir offen gesprochen hatten, war das Missverständnis geklärt.","بعد أن تحدثنا بصراحة زال سوء الفهم.","das Missverständnis=سوء الفهم;klären=يوضح;offen=بصراحة;sich versöhnen=يتصالح;die Beziehung=العلاقة;das Vertrauen=الثقة;der Konflikt=النزاع;die Entschuldigung=الاعتذار"],
["العمل التطوعي","Ich engagiere mich ehrenamtlich, um anderen Menschen zu helfen.","أشارك في العمل التطوعي لمساعدة الآخرين.","ehrenamtlich=تطوعي;das Engagement=المشاركة;die Unterstützung=الدعم;helfen=يساعد;die Gemeinschaft=المجتمع;die Organisation=المنظمة;die Spende=التبرع;die Verantwortung=المسؤولية"],
["وصف رسم بياني بسيط","Die Zahl der Teilnehmenden ist im letzten Jahr gestiegen.","ارتفع عدد المشاركين في السنة الماضية.","das Diagramm=الرسم البياني;steigen=يرتفع;sinken=ينخفض;der Anteil=النسبة;die Zahl=العدد;der Vergleich=المقارنة;die Entwicklung=التطور;die Statistik=الإحصاء"],
["التعلم المستقل","Es ist sinnvoll, neue Wörter regelmäßig zu wiederholen.","من المفيد مراجعة الكلمات الجديدة بانتظام.","selbstständig=بشكل مستقل;wiederholen=يراجع;der Fortschritt=التقدم;die Methode=الطريقة;das Ziel=الهدف;die Motivation=الحافز;die Gewohnheit=العادة;der Fehler=الخطأ"],
["الهجرة والاندماج اللغوي","Wer eine neue Sprache lernt, kann leichter Kontakte knüpfen.","من يتعلم لغة جديدة يستطيع إنشاء علاقات بسهولة أكبر.","die Integration=الاندماج;der Aufenthalt=الإقامة;die Behörde=الإدارة;die Sprache=اللغة;die Begegnung=اللقاء;Kontakte knüpfen=يُنشئ علاقات;die Voraussetzung=الشرط;die Gemeinschaft=المجتمع"],
["عرض فكرة والدفاع عنها","Ich halte diesen Vorschlag für sinnvoll, weil er Zeit spart.","أعتبر هذا الاقتراح مفيداً لأنه يوفر الوقت.","der Standpunkt=وجهة النظر;vertreten=يدافع عن;die Begründung=التبرير;das Beispiel=المثال;die Schlussfolgerung=الاستنتاج;die Diskussion=المناقشة;die Zustimmung=الموافقة;der Einwand=الاعتراض"]
],
B2:[
["بناء حجة متوازنة","Obwohl digitale Medien viele Chancen bieten, müssen wir ihre Risiken berücksichtigen.","رغم أن الوسائط الرقمية تقدم فرصاً كثيرة علينا مراعاة مخاطرها.","berücksichtigen=يراعي;abwägen=يوازن;die Herausforderung=التحدي;die Auswirkung=الأثر;die Perspektive=المنظور;die These=الأطروحة;die Begründung=التبرير;die Gegenposition=الموقف المقابل"],
["العمل المرن ومستقبل الوظائف","Flexible Arbeitsmodelle können die Produktivität steigern, sofern klare Regeln gelten.","يمكن لأنماط العمل المرنة رفع الإنتاجية شرط وجود قواعد واضحة.","die Arbeitswelt=عالم العمل;die Produktivität=الإنتاجية;flexibel=مرن;die Voraussetzung=الشرط;die Vereinbarkeit=التوفيق;die Arbeitszeit=وقت العمل;die Verantwortung=المسؤولية;die Regelung=التنظيم"],
["التعليم الرقمي","Digitale Lernangebote sollten Präsenzunterricht sinnvoll ergänzen, statt ihn vollständig zu ersetzen.","ينبغي للعروض التعليمية الرقمية أن تكمل التعليم الحضوري بصورة مفيدة بدلاً من استبداله تماماً.","der Präsenzunterricht=التعليم الحضوري;ergänzen=يكمل;ersetzen=يستبدل;die Lernplattform=المنصة التعليمية;der Zugang=الوصول;die Kompetenz=الكفاءة;die Selbstständigkeit=الاستقلالية;die Förderung=الدعم"],
["التكنولوجيا والخصوصية","Bei der Verarbeitung persönlicher Daten ist Transparenz besonders wichtig.","الشفافية مهمة جداً عند معالجة البيانات الشخصية.","die Verarbeitung=المعالجة;die Privatsphäre=الخصوصية;der Datenschutz=حماية البيانات;die Einwilligung=الموافقة;die Transparenz=الشفافية;die Speicherung=التخزين;die Nutzung=الاستخدام;die Verantwortung=المسؤولية"],
["الاستدامة والطاقة","Eine erfolgreiche Energiewende erfordert langfristige Investitionen und gesellschaftliche Akzeptanz.","يتطلب تحول الطاقة الناجح استثمارات طويلة الأجل وقبولاً مجتمعياً.","die Energiewende=تحول الطاقة;die Investition=الاستثمار;die Akzeptanz=القبول;erneuerbar=متجدد;der Verbrauch=الاستهلاك;die Maßnahme=الإجراء;die Emission=الانبعاث;die Nachhaltigkeit=الاستدامة"],
["الاقتصاد والتضخم","Steigende Preise belasten Haushalte mit niedrigem Einkommen besonders stark.","تضغط الأسعار المرتفعة بقوة خاصة على الأسر ذات الدخل المنخفض.","die Inflation=التضخم;die Kaufkraft=القوة الشرائية;das Einkommen=الدخل;belasten=يثقل كاهل;die Nachfrage=الطلب;das Angebot=العرض;die Entwicklung=التطور;der Haushalt=الأسرة"],
["الصحة العامة والوقاية","Vorbeugende Maßnahmen sind oft wirksamer als eine späte Behandlung.","التدابير الوقائية غالباً أنجع من العلاج المتأخر.","die Vorbeugung=الوقاية;die Maßnahme=التدبير;wirksam=فعال;die Behandlung=العلاج;das Gesundheitssystem=النظام الصحي;die Versorgung=الرعاية;die Forschung=البحث العلمي;die Belastung=الضغط"],
["المجتمع والتنوع الثقافي","Eine offene Gesellschaft profitiert davon, unterschiedliche Perspektiven einzubeziehen.","يستفيد المجتمع المنفتح من إشراك وجهات النظر المختلفة.","die Vielfalt=التنوع;die Teilhabe=المشاركة;die Perspektive=المنظور;einbeziehen=يُشرك;die Toleranz=التسامح;die Gleichberechtigung=المساواة في الحقوق;die Gesellschaft=المجتمع;die Begegnung=اللقاء"],
["الذكاء الاصطناعي","Künstliche Intelligenz kann Prozesse beschleunigen, wirft jedoch ethische Fragen auf.","يمكن للذكاء الاصطناعي تسريع العمليات لكنه يثير أسئلة أخلاقية.","die künstliche Intelligenz=الذكاء الاصطناعي;die Ethik=الأخلاق;der Algorithmus=الخوارزمية;die Entscheidung=القرار;automatisieren=يؤتمت;die Verantwortung=المسؤولية;die Auswirkung=الأثر;die Kontrolle=الرقابة"],
["تحليل تقارير إعلامية","Die Darstellung eines Ereignisses hängt häufig von der Auswahl der Quellen ab.","يعتمد عرض الحدث غالباً على اختيار المصادر.","die Berichterstattung=التغطية الإعلامية;die Darstellung=العرض;die Quelle=المصدر;die Einordnung=وضع الأمر في سياقه;die Behauptung=الادعاء;die Überprüfung=التحقق;die Verzerrung=التحريف;die Öffentlichkeit=الجمهور"],
["الهجرة وسوق العمل","Zuwanderung kann dem Fachkräftemangel entgegenwirken, wenn Integration gelingt.","يمكن للهجرة أن تساعد في معالجة نقص العمال المهرة إذا نجح الاندماج.","die Zuwanderung=الهجرة الوافدة;der Fachkräftemangel=نقص الكفاءات;entgegenwirken=يواجه;die Integration=الاندماج;die Anerkennung=الاعتراف;der Arbeitsmarkt=سوق العمل;die Qualifikation=التأهيل;die Teilhabe=المشاركة"],
["المدن والتخطيط الحضري","Gut geplante Städte schaffen Raum für Begegnung und nachhaltige Mobilität.","تخلق المدن المخططة جيداً فضاءً للتلاقي والتنقل المستدام.","die Stadtplanung=التخطيط الحضري;die Infrastruktur=البنية التحتية;die Mobilität=التنقل;der Wohnraum=السكن;die Verdichtung=التكثيف العمراني;die Lebensqualität=جودة الحياة;die Begegnung=التلاقي;die Grünfläche=المساحة الخضراء"],
["العمل عن بعد","Ob Homeoffice langfristig sinnvoll ist, hängt von der jeweiligen Tätigkeit ab.","تعتمد جدوى العمل من المنزل على المدى الطويل على طبيعة النشاط المعني.","das Homeoffice=العمل من المنزل;die Tätigkeit=النشاط المهني;langfristig=على المدى الطويل;die Zusammenarbeit=التعاون;die Erreichbarkeit=إمكانية التواصل;die Belastung=العبء;die Flexibilität=المرونة;die Produktivität=الإنتاجية"],
["العلوم ونتائج الدراسات","Die Ergebnisse der Untersuchung legen nahe, dass weitere Forschung nötig ist.","تشير نتائج الدراسة إلى ضرورة مزيد من البحث.","die Untersuchung=الدراسة;das Ergebnis=النتيجة;die Hypothese=الفرضية;die Stichprobe=العينة;die Schlussfolgerung=الاستنتاج;die Forschung=البحث;die Erkenntnis=المعرفة المكتسبة;nachweisen=يثبت"],
["الأخلاق والمسؤولية","Technischer Fortschritt sollte stets mit gesellschaftlicher Verantwortung verbunden sein.","ينبغي أن يرتبط التقدم التقني دائماً بالمسؤولية المجتمعية.","die Verantwortung=المسؤولية;die Gerechtigkeit=العدالة;das Dilemma=المعضلة;die Abwägung=الموازنة;die Konsequenz=النتيجة;die Entscheidung=القرار;die Norm=المعيار;die Freiheit=الحرية"],
["التغير المناخي","Die Anpassung an den Klimawandel erfordert Maßnahmen auf mehreren Ebenen.","يتطلب التكيف مع التغير المناخي إجراءات على مستويات متعددة.","der Klimawandel=تغير المناخ;die Anpassung=التكيف;die Maßnahme=الإجراء;die Emission=الانبعاث;die Dürre=الجفاف;die Widerstandsfähigkeit=القدرة على الصمود;die Ebene=المستوى;die Verantwortung=المسؤولية"],
["اللغة والهوية","Mehrsprachigkeit kann die persönliche Identität bereichern und neue Möglichkeiten eröffnen.","يمكن للتعدد اللغوي إثراء الهوية الشخصية وفتح إمكانيات جديدة.","die Mehrsprachigkeit=التعدد اللغوي;die Identität=الهوية;bereichern=يثري;eröffnen=يفتح;die Zugehörigkeit=الانتماء;die Kommunikation=التواصل;der Ausdruck=التعبير;die Muttersprache=اللغة الأم"],
["الثقافة والتغير الاجتماعي","Kulturelle Traditionen verändern sich, ohne zwangsläufig an Bedeutung zu verlieren.","تتغير التقاليد الثقافية دون أن تفقد أهميتها بالضرورة.","die Tradition=التقليد;der Wandel=التغير;die Bedeutung=الأهمية;bewahren=يحافظ على;die Generation=الجيل;die Wertvorstellung=التصور القيمي;die Gesellschaft=المجتمع;die Entwicklung=التطور"],
["النقاش وإدارة الخلاف","Ein konstruktiver Dialog setzt voraus, dass beide Seiten einander zuhören.","يفترض الحوار البنّاء أن يستمع كل طرف إلى الآخر.","konstruktiv=بنّاء;der Dialog=الحوار;die Voraussetzung=الشرط;der Kompromiss=التسوية;der Widerspruch=الاعتراض;die Position=الموقف;die Einigung=الاتفاق;die Argumentation=الحجاج"],
["تقييم السياسات العامة","Bei der Bewertung einer Maßnahme müssen sowohl Kosten als auch Nutzen betrachtet werden.","عند تقييم إجراء يجب النظر في تكاليفه وفوائده.","die Maßnahme=الإجراء;die Bewertung=التقييم;die Wirkung=الأثر;die Kosten=التكاليف;der Nutzen=المنفعة;die Umsetzung=التنفيذ;die Wirksamkeit=الفعالية;der Vergleich=المقارنة"],
["التواصل المهني الرسمي","Ich wäre Ihnen dankbar, wenn Sie mir die Unterlagen zeitnah zukommen lassen könnten.","سأكون ممتناً إذا أمكنكم إرسال المستندات لي قريباً.","zeitnah=في أقرب وقت;die Unterlage=المستند;zukommen lassen=يرسل;die Rückfrage=الاستفسار الإضافي;die Vereinbarung=الاتفاق;die Frist=المهلة;die Zuständigkeit=الاختصاص;die Abstimmung=التنسيق"],
["الأدب وتحليل النصوص","Die Erzählperspektive beeinflusst, wie Leserinnen und Leser die Handlung wahrnehmen.","تؤثر زاوية السرد في طريقة إدراك القراء للأحداث.","die Erzählperspektive=زاوية السرد;die Handlung=الأحداث;die Figur=الشخصية;das Motiv=الدافع أو الثيمة;die Interpretation=التأويل;die Metapher=الاستعارة;die Wirkung=الأثر;der Zusammenhang=الترابط"],
["عرض تقديمي منظم","Abschließend möchte ich die wichtigsten Ergebnisse zusammenfassen.","ختاماً أود تلخيص أهم النتائج.","abschließend=ختاماً;zusammenfassen=يلخص;die Gliederung=الهيكلة;der Schwerpunkt=المحور الرئيسي;die These=الأطروحة;der Beleg=الدليل;die Überleitung=الانتقال;das Fazit=الخلاصة"],
["حلّ المشكلات المعقدة","Um eine tragfähige Lösung zu entwickeln, sollten wir zunächst die Ursachen untersuchen.","لتطوير حل قابل للاستمرار ينبغي أولاً فحص الأسباب.","tragfähig=قابل للاستمرار;die Ursache=السبب;untersuchen=يفحص;die Strategie=الاستراتيجية;die Umsetzung=التنفيذ;die Konsequenz=النتيجة;die Priorität=الأولوية;die Abwägung=الموازنة"]
]};
const grammar={
B1:[
"التعبير عن الرأي في سياق العمل: Ich schlage vor, dass ...؛ في جملة dass يأتي الفعل المصرف في النهاية.",
"السبب والنتيجة: weil/da يقدمان جملة تابعة؛ deshalb/deswegen يبدآن جملة رئيسية ويأتي بعدهما الفعل مباشرة.",
"الماضي السردي: als لحدث واحد في الماضي؛ wenn للأحداث المتكررة أو الشرطية. قارن Als ich jung war ... و Immer wenn ...",
"عبارات الموقف: Meiner Meinung nach..., Ich bin der Ansicht, dass...؛ استعمل deshalb مع السبب.",
"Konjunktiv II للطلب أو الاقتراح: Wir könnten ... / Man sollte ... مع مصدر الفعل في نهاية الجملة.",
"الاسم المشتق وأسلوب المبني للمجهول: Die Prüfung wird vorbereitet. التدريب على نصوص التعليم الرسمي.",
"الأسلوب الرسمي: Hiermit möchte ich ...؛ احرص على البنية المهذبة والبريد المنظم.",
"الربط بين الخبرات: während + Genitiv اسمياً، أو während + جملة فرعية والفعل في النهاية.",
"جملة الشرط الحقيقية: Wenn ich bestehe, ...؛ يمكن تقديم جواب الشرط ويأتي الفعل بعد الفاصلة.",
"الجملة الوصفية باستخدام Relativsatz: Menschen, die hier wohnen, ...؛ الفعل آخر الجملة.",
"قبل القيام بعمل: Bevor ich die Nachricht teile, ...؛ المصدر في آخر الجملة التابعة.",
"الاسم الموصول wer: Wer regelmäßig übt, ...؛ الجملة الموصولة هنا شرط عام.",
"zu + Infinitiv مع الأفعال المناسبة: Ich versuche, Geld zu sparen.",
"seitdem يربط بداية حدث مستمر بأثره: Seitdem ich übe, ...",
"einerseits ... andererseits يقدم نقطتين متقابلتين. يبدأ الفعل مباشرة بعد الظروف المتصدرة.",
"obwohl وجملة تابعة: Obwohl der Flug verspätet war, ...",
"indem يشرح الوسيلة: Wir sparen Energie, indem wir ...",
"المجهول في الحاضر: In der Region werden Feste gefeiert. werden + Partizip II.",
"Nachdem + Plusquamperfekt عند التأكيد على أن حدثاً سبق حدثاً ماضياً.",
"um ... zu + Infinitiv للتعبير عن الهدف عندما يكون فاعل الجزأين واحداً.",
"وصف بيانات التغيّر: Die Zahl ist gestiegen / gesunken. استخدم أفعال دقيقة ومراجع زمنية واضحة.",
"Es ist + Adjektiv + zu + Infinitiv: Es ist wichtig, zu wiederholen.",
"جملة موصولة معمّمة: Wer eine Sprache lernt, ...؛ الفعل يأتي أخيراً في جملة Wer.",
"halte ... für + Adjektiv: Ich halte den Vorschlag für sinnvoll؛ لتبرير الموقف استخدم weil."
],
B2:[
"الحجج المتوازنة: obwohl + جملة تابعة، dennoch + جملة رئيسية. بيّن الموقف والحجة المضادة ثم النتيجة.",
"sofern يعبر عن شرط مقيد: ... sofern klare Regeln gelten. ناقش متى يتحقق الشرط.",
"statt ... zu + Infinitiv / anstatt dass؛ للبدائل التعليمية. استخدم التعبيرات المجردة بوضوح.",
"Nominalisierung: bei der Verarbeitung...؛ يحول الفعل إلى اسم لإضفاء طابع رسمي.",
"الأسماء المركبة في الاقتصاد والبيئة؛ erfordern + Akkusativ، وأسلوب الأسماء المجردة.",
"الصفات المشتقة: steigend, sinkend. ميّز بين die steigenden Preise و die Preise steigen.",
"المقارنة الرسمية: wirksamer als ...؛ وVorgangspassiv عند وصف إجراءات عامة.",
"الفعل profitieren von + Dativ؛ والتعبير عن العلاقات السببية المجردة.",
"Konjunktiv II وصيغ التحفظ: könnte ... / würde ...؛ ناقش التأثيرات دون الجزم.",
"الصياغة الإعلامية غير المباشرة: laut Bericht، zufolge + Dativ، وKonjunktiv I في نقل أقوال الآخرين.",
"جملة شرطية مع wenn يربط نجاح الاندماج بالنتيجة، والربط بـ sofern/falls.",
"Partizip I صفةً: gut geplante Städte؛ اسم الفاعل المشتق يوافق نهايات الصفات.",
"Ob + Nebensatz للسؤال غير المباشر: Ob ... sinnvoll ist, hängt davon ab.",
"أفعال التحفظ العلمي: Ergebnisse legen nahe, dass ...؛ فرّق بين إثبات الفرضية وترجيحها.",
"المبني للمجهول مع Modalverb: sollte ... verbunden sein؛ تجنب الصياغة الجازمة.",
"Substantivierung في النصوص العلمية: die Anpassung an ...؛ وerfordern + Akkusativ.",
"verb + zu: Möglichkeiten eröffnen; nominalisierte Begriffe للمناقشات الاجتماعية.",
"ohne ... zu + Infinitiv للتعبير عن حدث لا يصاحبه الحدث المذكور.",
"voraussetzen, dass ... / etwas setzt etwas voraus؛ استخدم نبرة تفاوض مهنية.",
"sowohl ... als auch للتعبير عن الجمع، وbei + Dativ مع الأسماء.",
"الطلب المهذب بـ Konjunktiv II: Ich wäre Ihnen dankbar, wenn ... könnten.",
"الأفعال السببية: beeinflussen, bewirken؛ والاسم المعنوي لتعليق النص.",
"صياغة عرض: Zunächst ... Darüber hinaus ... Abschließend ...؛ انتقال منطقي.",
"um ... zu + Infinitiv يحدد الغاية، والاستعانة بـ sollten في توصية مدروسة."
]};
function make(level,records){return records.map((v,i)=>{
const [title,example,exampleAr,raw]=v;
const words=raw.split(';').map(x=>{const j=x.indexOf('=');return {de:x.slice(0,j),ar:x.slice(j+1)}}).filter(x=>x.de&&x.ar);
return {id:level.toLowerCase()+'-'+String(i+1).padStart(2,'0'),n:i+1,level,title,focus:'توسيع مهارات التواصل والتحليل في موضوع '+title+'.',grammar:grammar[level][i],example,exampleAr,reading:example,textAr:exampleAr,words,dialogue:[[example,exampleAr],[words[0].de,words[0].ar]],minutes:level==='B2'?60:50};
})}
window.DM_PART2=[...make('B1',vocabulary.B1),...make('B2',vocabulary.B2)];
})();

window.DM_LESSONS=[...(window.DM_PART1||[]),...(window.DM_PART2||[])];
