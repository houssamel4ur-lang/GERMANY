# Deutsch Mastery AI — ذكاء اصطناعي ديالنا بلا ربط بمزود AI

هاد النظام كيخدم بنموذج مفتوح على الحاسوب أو السيرفر اللي كتملك وتتحكم فيه، وما كيستعمل حتى API للاستدلال من OpenAI أو Claude أو Gemini.

## المكونات

- المحادثة: Qwen3 8B عبر Ollama محلياً.
- التعرف على الكلام الألماني: faster-whisper محلياً.
- النطق الألماني: Piper وصوت de_DE-thorsten-high المحلي.
- الواجهة: الصفحة ai.html على GitHub Pages، والخادم في هاد المجلد.
- المكالمة الصوتية: الميكروفون كيسجل الجملة حتى كتسكت؛ Whisper يحولها لنص، Qwen3 يجاوب بحرية، وPiper ينطق الجواب، ثم كيعاود يستمع.

**مهم:** هادشي هو مساعد خاص بموقعك مبني على أوزان مفتوحة ومضبوط للتعليم، ماشي موديل لغوي كامل مدرّب من الصفر. تقدر تطور عليه تدريب LoRA لاحقاً باستعمال حوارات أصلية صحيحة.

## المتطلبات

- Windows مع Docker Desktop/WSL2 أو Linux، أو سيرفر ديالك يبقى شغال.
- 16GB RAM مستحسنة للبداية مع Qwen3 8B. فالـCPU يمكن تكون المحادثة بطيئة، وGPU كتعاون بزاف.
- الإنترنت ضروري أول مرة لتنزيل النماذج؛ بعد ما تتثبت ما تحتاجش خدمة AI خارجية للاستدلال.
- إذا بغيتي الحوار يخدم من الهاتف عبر الإنترنت، خاص السيرفر ديالك يكون متاحاً عبر عنوان HTTPS عمومي. GitHub Pages بوحدو ما يقدرش يشغل موديلات AI.

## التشغيل ب Docker

من جذر مشروع GERMANY:

    cd selfhost-ai
    cp .env.example .env

على Windows PowerShell استعمل:

    Copy-Item .env.example .env

فتح .env وبدل COACH_ACCESS_CODE برمز فريد طويل (12 حرف على الأقل، ويفضل 24 أو أكثر). ما ترفعش .env لـGitHub.

    docker compose up -d --build
    docker compose exec ollama ollama pull qwen3:8b
    docker compose run --rm coach python -m piper.download_voices --data-dir /opt/voices de_DE-thorsten-high

Whisper غادي ينزل نموذج small في أول استعمال. باش تحضّرو قبل الاستماع:

    docker compose exec coach python -c "from faster_whisper import WhisperModel; WhisperModel('small', device='cpu', compute_type='int8')"

اختبر:

    curl -H "X-Coach-Access: YOUR_PRIVATE_CODE" http://127.0.0.1:8787/api/health

خاص ترجع ready=true وprovider=self-hosted وspeech_ready=true (من بعد تنزيل Piper). إذا ready=false راجع:

    docker compose logs coach
    docker compose exec ollama ollama list

ممكن تبني موديل بتعليمات العلامة التجارية ديالك باستعمال Modelfile الموجود فالمجلد، ولكن تعليمات المستويات والتعليم موجودة كذلك على السيرفر.

## ربط GitHub Pages بالسيرفر ديالك

السيرفر افتراضياً متاح غير ف 127.0.0.1:8787، ومينفعش تفتح منفذ Ollama 11434 لعموم الإنترنت.

باش يدخل المتعلم من الموقع ديالك، وفر عنوان HTTPS خاص بك مع reverse proxy، مثلاً عبر Caddy على نفس الجهاز. هاد المثال غير توضيحي، ماشي رابط منشور:

    coach.example.com {
        reverse_proxy 127.0.0.1:8787
    }

فملف assets/ai-config.js حط الرابط العمومي الحقيقي:

    window.DEUTSCH_AI_CONFIG={apiBase:"https://coach.example.com",maxTurns:12};

عمر COACH_ACCESS_CODE في .env **فقط**، والمستخدم كيدخلو من واجهة الموقع عند الاتصال. ما تحطوش ف JavaScript ولا في GitHub. حدّ عدد الطلبات وراقب الاستهلاك ديال الجهاز إذا غادي تفتح الخدمة لعدد كبير ديال المستخدمين.

بلا سيرفر شغال وHTTPS مضبوط، واجهة الذكاء الاصطناعي كتبان غير مفعّلة بوضوح، وما كتستعملش API خارجي كبديل.

## الامتحانات والجودة والخصوصية

الردود حسب A1/A2/B1/B2 هي تعليمات خاصة بالموديل المحلي؛ ماشي ضمان مطلق بالدقة. الصوت الناتج اصطناعي وليس شخصاً حقيقياً، وخص اختبار النطق مع متحدث ألماني متمكن. الصوتيات المسجلة القديمة ديال الدروس باقية منفصلة.

خادمنا ما كيحفظش نصوص الجلسات في قاعدة بيانات. الصوتيات المؤقتة كتتمسح بعد التعرف على الكلام. تنزيل ملفات النماذج أول مرة كيحتاج اتصالاً بمستودعات خارجية، ولكن بعد التحضير ما كاين حتى إرسال للنص والصوت لخدمة AI مدفوعة من هاد الكود.

قبل الاستخدام التجاري تأكد من تراخيص الأوزان، صوت Piper، ومصدر بيانات التدريب. Piper نفسها GPL وتراخيص الأصوات كتختلف.

## واجهات الخادم

- GET /api/health للتحقق من وجود النموذج.
- POST /api/chat بالمستوى والموضوع ورسائل الحوار.
- POST /api/speak لتحويل الجملة الألمانية إلى WAV محلياً.
- POST /api/transcribe لكتابة ما قاله المتعلم بالألمانية.

جميع المسارات كتحتاج X-Coach-Access الخاص بالسيرفر.

## اختبارات

من مجلد selfhost-ai وبعد تثبيت fastapi وhttpx وpython-multipart:

    python -m unittest discover -s tests -v

ومن جذر المشروع:

    node tests/ai-check.mjs

هذي اختبارات للكود والعقود؛ جودة المحادثة والصوت ما كتتأكدش حتى تشغل النموذج وتجرّبو عملياً.
