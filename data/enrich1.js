(()=>{
'use strict';
const extra={
A1:[
["Wie heißt du? Ich heiße Ali. Schön, dich kennenzulernen.","ما اسمك؟ اسمي علي. سعيد بالتعرّف إليك."],
["Kannst du das bitte buchstabieren? Ja, natürlich.","هل تستطيع تهجئة ذلك من فضلك؟ نعم، بالتأكيد."],
["Drei Bücher kosten zehn Euro. Das ist nicht teuer.","ثلاثة كتب تكلّف عشرة يوروهات. هذا ليس غالياً."],
["Ich spreche Arabisch und ein bisschen Deutsch. Woher kommst du?","أتحدث العربية وقليلاً من الألمانية. من أين أنت؟"],
["Meine Freundin ist einundzwanzig Jahre alt. Wie alt bist du?","صديقتي عمرها إحدى وعشرون سنة. كم عمرك؟"],
["Meine Eltern wohnen in Rabat. Wir besuchen sie am Wochenende.","يسكن والداي في الرباط. نزورهما في عطلة نهاية الأسبوع."],
["Bist du heute zu Hause? Ja, ich bin hier.","هل أنت في المنزل اليوم؟ نعم، أنا هنا."],
["Hast du auch ein Handy? Ja, aber ich habe keinen Computer.","هل لديك هاتف أيضاً؟ نعم، لكن ليس لدي حاسوب."],
["Das Wohnzimmer ist groß. Mein Schlafzimmer ist klein.","غرفة المعيشة كبيرة. غرفة نومي صغيرة."],
["Wo ist der Schlüssel? Er liegt auf dem Tisch.","أين المفتاح؟ إنه فوق الطاولة."],
["Die Tasche ist rot und die Jacke ist schwarz. Die Schuhe sind neu.","الحقيبة حمراء والسترة سوداء. الأحذية جديدة."],
["Zum Frühstück trinke ich Tee. Meine Schwester isst ein Ei.","أشرب الشاي في الفطور. أختي تأكل بيضة."],
["Das kostet drei Euro. Ich bezahle mit Karte.","هذا يكلّف ثلاثة يوروهات. أدفع بالبطاقة."],
["Am Dienstag habe ich Unterricht. Am Sonntag bin ich frei.","عندي درس يوم الثلاثاء. أكون متفرغاً يوم الأحد."],
["Wir treffen uns um acht Uhr. Kommst du pünktlich?","سنلتقي في الثامنة. هل ستأتي في الوقت المحدد؟"],
["Danach frühstücke ich und gehe zur Arbeit. Abends lese ich.","بعد ذلك أتناول الفطور وأذهب إلى العمل. أقرأ مساءً."],
["Sie schreibt eine E-Mail. Wir lernen zusammen.","هي تكتب رسالة إلكترونية. نتعلم معاً."],
["Wann beginnt der Kurs? Der Kurs beginnt um neun Uhr.","متى تبدأ الدورة؟ تبدأ الدورة الساعة التاسعة."],
["Ich trinke keinen Kaffee. Aber ich trinke gern Tee.","لا أشرب القهوة. لكنني أحب شرب الشاي."],
["Gehen Sie geradeaus und dann nach rechts. Vielen Dank!","امشِ مباشرة ثم انعطف يميناً. شكراً جزيلاً!"],
["Wann fährt der nächste Zug? Er fährt um zehn Uhr.","متى ينطلق القطار التالي؟ ينطلق الساعة العاشرة."],
["Kann ich die Jacke anprobieren? Ja, die Umkleidekabine ist dort.","هل يمكنني تجربة السترة؟ نعم، غرفة تبديل الملابس هناك."],
["Ich lese gern Bücher und höre Musik. Was machst du gern?","أحب قراءة الكتب والاستماع إلى الموسيقى. ماذا تحب أن تفعل؟"],
["Der Arzt hat heute einen Termin frei. Gute Besserung!","لدى الطبيب موعد متاح اليوم. أتمنى لك الشفاء!"]
],
A2:[
["Am Samstag sind wir ins Kino gegangen. Der Film war interessant.","ذهبنا إلى السينما يوم السبت. كان الفيلم ممتعاً."],
["Die Fahrt dauert ungefähr zwei Stunden. Morgen fliegen wir zurück.","تستغرق الرحلة ساعتين تقريباً. سنعود بالطائرة غداً."],
["Damals hatte ich kein Auto. Heute fahre ich jeden Tag zur Arbeit.","آنذاك لم تكن لدي سيارة. اليوم أقود إلى العمل كل يوم."],
["Der Balkon ist klein, aber schön. Wir möchten die Wohnung besichtigen.","الشرفة صغيرة لكنها جميلة. نريد معاينة الشقة."],
["Leider kann ich am Donnerstag nicht. Haben Sie am Freitag Zeit?","للأسف لا أستطيع يوم الخميس. هل لديكم وقت يوم الجمعة؟"],
["Meine Kollegin arbeitet im Kundenservice. Wir unterstützen uns gegenseitig.","تعمل زميلتي في خدمة العملاء. نساعد بعضنا بعضاً."],
["Leider funktioniert das Gerät nicht. Haben Sie die Quittung dabei?","للأسف الجهاز لا يعمل. هل معك الإيصال؟"],
["Wenn du Fieber hast, solltest du dich ausruhen. Trinke genug Wasser.","إذا كانت لديك حمى ينبغي أن ترتاح. اشرب ماءً كافياً."],
["Zum Schluss würze ich die Suppe. Danach serviere ich das Essen.","في النهاية أضيف التوابل إلى الحساء. بعد ذلك أقدم الطعام."],
["Meine Prüfung ist nächsten Monat. Deshalb lerne ich jeden Abend.","امتحاني الشهر القادم. لذلك أدرس كل مساء."],
["Im Winter ist es oft kalt. Im Sommer scheint hier häufig die Sonne.","يكون الجو بارداً كثيراً في الشتاء. في الصيف تشرق الشمس هنا غالباً."],
["Ich habe dich gestern angerufen. Leider war dein Handy ausgeschaltet.","اتصلت بك أمس. للأسف كان هاتفك مغلقاً."],
["Sport macht mir Spaß, obwohl das Training manchmal anstrengend ist.","أستمتع بالرياضة رغم أن التدريب متعب أحياناً."],
["Wir haben uns gestern gestritten. Heute haben wir uns entschuldigt.","تشاجرنا أمس. اليوم اعتذر كل منا للآخر."],
["Am Samstag feiern wir Geburtstag. Kannst du etwas zu essen mitbringen?","سنحتفل بعيد الميلاد السبت. هل تستطيع إحضار شيء للأكل؟"],
["Für die Anmeldung brauche ich meinen Ausweis. Das Formular ist online.","للتسجيل أحتاج بطاقة هويتي. الاستمارة موجودة على الإنترنت."],
["Mit dem Fahrrad bin ich langsamer, aber ich spare Geld.","بالدراجة أكون أبطأ، لكنني أوفر المال."],
["Vielen Dank für Ihre Antwort. Ich freue mich über weitere Informationen.","شكراً جزيلاً على ردكم. يسعدني الحصول على معلومات إضافية."],
["Zum Glück hat jemand den Schlüssel gefunden. Jetzt bin ich erleichtert.","لحسن الحظ وجد شخص المفتاح. أشعر الآن بالارتياح."],
["Ich habe den Kundenservice kontaktiert. Die Lieferung soll morgen kommen.","تواصلت مع خدمة العملاء. من المفترض أن يصل التسليم غداً."],
["Wir benutzen weniger Plastik. So schützen wir die Umwelt.","نستخدم بلاستيكاً أقل. بهذه الطريقة نحمي البيئة."],
["In der Stadt sind die Wege kürzer. Auf dem Land ist die Luft sauberer.","في المدينة المسافات أقصر. في الريف الهواء أنظف."],
["Dafür muss ich zuerst die Prüfung bestehen. Ich bereite mich gut vor.","لذلك علي أولاً النجاح في الامتحان. أستعد جيداً."],
["Bleib ruhig und ruf im Notfall die 112 an. Nenne deinen Standort.","ابق هادئاً واتصل بالرقم 112 في الطوارئ. اذكر موقعك."]
]
};
window.DM_ENRICH1=extra;
})();
