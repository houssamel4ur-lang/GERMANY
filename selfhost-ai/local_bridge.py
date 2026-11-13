"""Deutsch Mastery: zero-dependency, localhost-only Qwen3 bridge.

Launch with Python 3.9+ on the same Windows machine as Ollama.
No paid API, public listening socket, or secret in a website.
"""
from __future__ import annotations

from collections import defaultdict, deque
from email import policy
from email.parser import BytesParser
from importlib.util import find_spec
import io
import tempfile
import wave
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import re
import threading
import time
import webbrowser
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen

HOST = "127.0.0.1"
PORT = 8787
OLLAMA = "http://127.0.0.1:11434"
AVAILABLE_MODELS = {"qwen3:4b", "llama3.2:3b"}
MODEL = os.getenv("DEUTSCH_AI_MODEL", "qwen3:4b").strip()
if MODEL not in AVAILABLE_MODELS:
    MODEL = "qwen3:4b"
BRIDGE_VERSION = "2026.11.13.5"
VOICE_DIR = Path(__file__).resolve().parent / "voices"
PIPER_PATH = VOICE_DIR / "de_DE-thorsten-high.onnx"
WHISPER_SIZE = "base"
MAX_RECORDING = 5_000_000
_STT = None
_TTS = None
_AUDIO_LOCK = threading.Lock()
ALLOWED_ORIGINS = {
    "https://houssamel4ur-lang.github.io",
    "http://localhost:8000", "http://127.0.0.1:8000",
    "http://localhost:8765", "http://127.0.0.1:8765",
}
VALID_LEVELS = {
    "A1": "Very simple Standard German: one or two short sentences, easy vocabulary, present tense, one question.",
    "A2": "Everyday Standard German: two or three sentences, everyday situations and natural follow-up.",
    "B1": "Intermediate Standard German: three or four varied sentences with reasons and relevant follow-up.",
    "B2": "Natural, nuanced Standard German: several varied sentences and thoughtful discussion.",
}
SCENARIOS = {
    "free": "free, learner-led conversation", "introductions": "introductions",
    "cafe": "ordering in a café", "shopping": "shopping", "travel": "travel",
    "job": "job interviews", "daily": "daily life", "debate": "discussing opinions",
}
ROOT = Path(__file__).resolve().parent
CONTEXT = ROOT / "curriculum-context.json"
RATE = defaultdict(deque)
LOCK = threading.Lock()


def _ollama(path, payload=None, timeout=4):
    body = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = Request(OLLAMA + path, data=body, headers={"Content-Type": "application/json"}, method="POST" if body else "GET")
    with urlopen(req, timeout=timeout) as res:
        return json.loads(res.read(200_000).decode("utf-8"))


def _topics():
    if not CONTEXT.is_file():
        # Download our own public curriculum once; AI inference remains fully local.
        try:
            url = "https://houssamel4ur-lang.github.io/GERMANY/selfhost-ai/curriculum-context.json"
            with urlopen(Request(url, headers={"User-Agent": "DeutschMasteryLocal/1.0"}), timeout=5) as res:
                content = res.read(3_000_001)
            if len(content) <= 3_000_000 and len(json.loads(content).get("topics", [])) == 452:
                CONTEXT.write_bytes(content)
        except (URLError, HTTPError, OSError, TimeoutError, ValueError, TypeError):
            pass
    try:
        return {topic["id"]: topic for topic in json.loads(CONTEXT.read_text(encoding="utf-8")).get("topics", [])}
    except (OSError, ValueError, KeyError, TypeError):
        return {}


TOPICS = _topics()


def _lesson(lesson_id, level):
    lesson = TOPICS.get(lesson_id)
    if not lesson or lesson.get("level") != level:
        return ""
    lines = ["Site curriculum focus (draft material, not independently verified):",
             "Lesson title: " + str(lesson.get("title", ""))[:150],
             "Explanation: " + str(lesson.get("explanation", ""))[:700]]
    for ex in lesson.get("examples", [])[:3]:
        lines.append(str(ex.get("de", ""))[:150] + " — " + str(ex.get("ar", ""))[:150])
    return "\n".join(lines)


def _system(level, scenario, correct, lesson_id):
    # Compact, level-appropriate prompt: fewer prompt tokens on a CPU-only PC.
    rules = [
        "Du bist Deutsch Partner, ein freundlicher KI-Deutschlehrer.",
        "Antworte NUR direkt mit der endgültigen Antwort auf Deutsch. Keine Analyse, kein Thinking, kein JSON.",
        "Schreibe natürliches, korrektes Hochdeutsch. Verwende keine englischen Wörter.",
        "Niveau " + level + ": " + VALID_LEVELS[level],
        "Thema: " + SCENARIOS[scenario] + ". Reagiere auf die letzte Nachricht.",
        "Antworte kurz. Stelle höchstens eine passende Rückfrage.",
        "Gib eine kurze Erklärung auf Darija nur, wenn der Lernende darum bittet.",
        ("Korrigiere höchstens einen wichtigen Fehler mit '💡 Besser:'." if correct
         else "Korrigiere nicht, außer wenn ausdrücklich darum gebeten wird."),
        "Erfinde keine persönlichen Details über den Lernenden.",
    ]
    if MODEL.startswith("qwen3"):
        rules.insert(0, "/no_think")
    if isinstance(lesson_id, str) and lesson_id in TOPICS:
        rules.append(_lesson(lesson_id, level))
    return "\n".join(rules)


def _voice_available():
    # Installer performs a real Piper synthesis check before flagging ready.
    return (find_spec("piper") is not None
            and PIPER_PATH.is_file()
            and PIPER_PATH.with_suffix(".onnx.json").is_file()
            and (VOICE_DIR / ".piper-ready").is_file())


def _stt_available():
    # A package alone is not proof that the Whisper model is downloaded.
    return find_spec("faster_whisper") is not None and (VOICE_DIR / ".whisper-ready").is_file()


def _wav_bytes(text):
    global _TTS
    if _TTS is None:
        from piper import PiperVoice
        _TTS = PiperVoice.load(str(PIPER_PATH))
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wav:
        _TTS.synthesize_wav(text, wav)
    return buf.getvalue()


def _recognize_audio(payload, suffix):
    global _STT
    filename = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as dst:
            filename = dst.name
            dst.write(payload)
        if _STT is None:
            from faster_whisper import WhisperModel
            _STT = WhisperModel(WHISPER_SIZE, device="cpu", compute_type="int8")
        segments, _ = _STT.transcribe(filename, language="de", beam_size=2, vad_filter=False, condition_on_previous_text=False)
        return " ".join(segment.text.strip() for segment in segments).strip()
    finally:
        if filename:
            Path(filename).unlink(missing_ok=True)

def _fast_greeting(message, level):
    """Instant, deterministic German greeting for the common first turn.

    This is a local app reply, clearly marked as such, not misrepresented
    as model-generated. Full dialogue continues through Qwen3.
    """
    normalized = message.strip().casefold().rstrip("!?. ").strip()
    if normalized not in {"hallo", "hi", "hey", "guten tag", "guten morgen", "guten abend", "servus", "moin"}:
        return ""
    return {
        "A1": "Hallo! Schön, dass du da bist. Wie geht es dir?",
        "A2": "Hallo! Schön, dich kennenzulernen. Wie war dein Tag bisher?",
        "B1": "Hallo! Schön, dass wir miteinander Deutsch üben. Worüber möchtest du sprechen?",
        "B2": "Hallo! Ich freue mich auf unser Gespräch. Welches Thema interessiert dich heute besonders?",
    }[level]


def _clean(reply):
    """Only a final answer can be returned to the public learner chat.

    Ollama's separate message.thinking field is intentionally not accessed.
    These checks protect against malformed thought tags or an unexpected model
    regression where analysis is placed directly in message.content.
    """
    if not isinstance(reply, str):
        return ""
    reply = re.sub(r"<think\b[^>]*>[\s\S]*?</think\s*>", "", reply, flags=re.I)
    reply = re.sub(r"<think\b[^>]*>[\s\S]*$", "", reply, flags=re.I)
    reply = re.sub(r"</think\s*>", "", reply, flags=re.I)
    reply = re.sub(r"(?is)^\s*Thinking\.{3}[\s\S]{0,4000}?\.{3}\s*done thinking\.\s*", "", reply)
    reply = re.sub(r"(?i)^\s*(?:Thinking\s*\.{3}|\.{3}\s*done thinking\.?|\[analysis\]|analysis:)\s*", "", reply)
    reply = reply.strip()
    if re.search(r"(?i)(?:^Okay[,]? the (?:user|learner)|^The (?:user|learner) (?:wants|asks|said)|^I (?:need|should|must) to|^Let me (?:think|plan)|^Final plan:|^First, I (?:need|should)|^Wait, (?:the user|they said)|^\*checks requirements|\b(?:the learner said|the user said|the instruction says|I should respond|Let me think|the prompt says|one or two sentences)\b)", reply):
        return ""
    return reply[:1400]



def _model_content(response):
    """Read only the final response, never Ollama's separate thinking field."""
    raw = response.get("message", {}).get("content", "")
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, dict) and isinstance(parsed.get("reply"), str):
            raw = parsed["reply"]
    except (ValueError, TypeError, AttributeError):
        pass
    return _clean(raw)


def _generate_final(query, level):
    """One controlled retry if a model returns an empty or reasoning-only answer."""
    options = {"temperature": 0.55, "top_p": 0.9,
               "num_ctx": 1536 if level in ("A1", "A2") else 2048,
               "num_predict": {"A1": 90, "A2": 115, "B1": 150, "B2": 180}[level]}
    payload = {"model": MODEL, "messages": query, "stream": False,
               "keep_alive": "30m", "options": options}
    if MODEL.startswith("qwen3"):
        payload["think"] = False
    result = _ollama("/api/chat", payload, timeout=240)
    first = _model_content(result)
    if first:
        return first
    # Do not display the first reasoning text. Retry with one focused turn
    # rather than more output tokens or a strict JSON grammar.
    print("[Deutsch AI] Rejected empty/reasoning-only output; retrying once.", flush=True)
    retry = [
        {"role": "system", "content":
         ("/no_think\n" if MODEL.startswith("qwen3") else "") +
         "Du bist Deutsch Partner. Antworte direkt und ausschließlich "
         "mit 1 bis 3 kurzen, korrekten deutschen Sätzen. "
         "Keine Analyse, keine Erklärung deines Vorgehens."},
        {"role": "user", "content":
         ("/no_think\n" if MODEL.startswith("qwen3") else "") + query[-1]["content"]},
    ]
    retry_payload = {"model": MODEL, "messages": retry, "stream": False,
                     "keep_alive": "30m",
                     "options": {"temperature": 0.35, "num_ctx": 1024,
                                 "num_predict": 100}}
    if MODEL.startswith("qwen3"):
        retry_payload["think"] = False
    result = _ollama("/api/chat", retry_payload, timeout=160)
    return _model_content(result)


class Handler(BaseHTTPRequestHandler):
    server_version = "DeutschMasteryLocal/1.0"

    def _cors(self):
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Coach-Access")
            self.send_header("Access-Control-Allow-Private-Network", "true")
        return origin

    def _response(self, code, payload):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(data)

    def _allowed(self):
        host = self.headers.get("Host", "")
        if host not in (f"{HOST}:{PORT}", f"localhost:{PORT}"):
            self._response(403, {"error": "Invalid host"})
            return False
        origin = self.headers.get("Origin", "")
        if origin and origin not in ALLOWED_ORIGINS:
            self._response(403, {"error": "Web origin not allowed"})
            return False
        return True

    def _limit(self):
        now = time.monotonic()
        with LOCK:
            bucket = RATE[self.client_address[0]]
            while bucket and now - bucket[0] > 60:
                bucket.popleft()
            if len(bucket) >= 30:
                self._response(429, {"error": "Many requests. Try again in a minute."})
                return False
            bucket.append(now)
        return True

    def do_OPTIONS(self):
        if not self._allowed():
            return
        self.send_response(204)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        if not self._allowed() or not self._limit():
            return
        if self.path != "/api/health":
            self._response(404, {"error": "Not found"})
            return
        try:
            models = _ollama("/api/tags")
            present = MODEL in [m.get("name") for m in models.get("models", [])]
        except (URLError, HTTPError, TimeoutError, ValueError, KeyError):
            present = False
        self._response(200, {"ready": present, "provider": "self-hosted", "model": MODEL,
                             "speech_ready": _voice_available(), "transcription_configured": _stt_available(),
                             "voice_mode": "local-turn-taking",
                             "bridge_version": BRIDGE_VERSION,
                             "message": (MODEL + " local is ready") if present else ("Start Ollama and load " + MODEL)})

    def _binary(self, mime, payload):
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(payload)

    def _speech(self):
        if not _voice_available():
            self._response(503, {"error": "خاص تثبيت Piper والصوت الألماني على PC أولاً."})
            return
        try:
            length = int(self.headers.get("Content-Length", "-1"))
            if not 0 < length <= 6_000:
                self._response(413, {"error": "Text too long"})
                return
            data = json.loads(self.rfile.read(length))
            text = data.get("text")
            if not isinstance(text, str) or not 0 < len(text.strip()) <= 650 or data.get("level", "A1") not in VALID_LEVELS:
                raise ValueError("Invalid text or level")
        except (ValueError, AttributeError, TypeError):
            self._response(400, {"error": "Invalid speech request"})
            return
        try:
            with _AUDIO_LOCK:
                rendered = _wav_bytes(text)
            self._binary("audio/wav", rendered)
        except Exception as exc:
            print("[Deutsch AI] Piper failed:", type(exc).__name__, str(exc)[:160], flush=True)
            self._response(503, {"error": "Piper ما قدرش يولّد الصوت. شوف النافذة الكحلة ديال السيرفر."})

    def _transcription(self):
        if not _stt_available():
            self._response(503, {"error": "خاص تثبيت faster-whisper على PC أولاً."})
            return
        try:
            length = int(self.headers.get("Content-Length", "-1"))
            if not 400 < length <= MAX_RECORDING + 60_000:
                self._response(413, {"error": "Audio too long"})
                return
            content_type = self.headers.get("Content-Type", "")
            if not content_type.startswith("multipart/form-data;"):
                self._response(415, {"error": "Expected multipart audio"})
                return
            raw = self.rfile.read(length)
            envelope = b"MIME-Version: 1.0\r\nContent-Type: " + content_type.encode("ascii") + b"\r\n\r\n" + raw
            parsed = BytesParser(policy=policy.default).parsebytes(envelope)
            part = next((p for p in parsed.iter_parts()
                         if p.get_param("name", header="content-disposition") == "audio"), None)
            if part is None:
                raise ValueError("Missing audio")
            kind = part.get_content_type()
            suffix = {"audio/webm": ".webm", "audio/mp4": ".mp4", "audio/ogg": ".ogg",
                      "audio/wav": ".wav", "audio/x-wav": ".wav", "audio/mpeg": ".mp3"}.get(kind)
            if suffix is None:
                raise ValueError("Unsupported audio format")
            audio = part.get_payload(decode=True)
            if not audio or not 400 <= len(audio) <= MAX_RECORDING:
                raise ValueError("Invalid audio length")
        except (ValueError, TypeError, AttributeError, UnicodeError):
            self._response(400, {"error": "Invalid audio recording"})
            return
        try:
            with _AUDIO_LOCK:
                transcript = _recognize_audio(audio, suffix)
            self._response(200, {"text": transcript[:1500], "provider": "self-hosted"})
        except Exception as exc:
            print("[Deutsch AI] Whisper failed:", type(exc).__name__, str(exc)[:160], flush=True)
            self._response(503, {"error": "Whisper ما قدرش يحوّل التسجيل لنص. راجع النافذة الكحلة."})

    def do_POST(self):
        if not self._allowed() or not self._limit():
            return
        if self.path == "/api/speak":
            self._speech()
            return
        if self.path == "/api/transcribe":
            self._transcription()
            return
        if self.path != "/api/chat":
            self._response(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "-1"))
            if not 0 < length <= 40_000:
                self._response(413, {"error": "Message too long"})
                return
            data = json.loads(self.rfile.read(length))
            level = data.get("level")
            scenario = data.get("scenario")
            messages = data.get("messages")
            correct = data.get("correct", True)
            lesson_id = data.get("lesson_id")
            if level not in VALID_LEVELS or scenario not in SCENARIOS or type(correct) is not bool:
                raise ValueError("Invalid level or topic")
            if not isinstance(messages, list) or not 1 <= len(messages) <= 30:
                raise ValueError("Invalid conversation length")
            safe = []
            for m in messages[-(6 if level in ("A1", "A2") else 8):]:
                if not isinstance(m, dict) or m.get("role") not in ("user", "assistant"):
                    raise ValueError("Invalid message")
                content = m.get("content")
                if not isinstance(content, str) or not 0 < len(content.strip()) <= 1500:
                    raise ValueError("Invalid message text")
                safe.append({"role": m["role"], "content": content})
            if safe[-1]["role"] != "user":
                raise ValueError("Last message must be from learner")
        except (ValueError, TypeError, AttributeError, json.JSONDecodeError) as e:
            self._response(400, {"error": str(e)[:160]})
            return
        quick_reply = _fast_greeting(safe[-1]["content"], level)
        if quick_reply:
            self._response(200, {"reply": quick_reply, "level": level,
                                 "provider": "local-greeting", "elapsed_seconds": 0})
            return
        query = [{"role": "system", "content": _system(level, scenario, correct, lesson_id)}, *safe]
        try:
            started = time.monotonic()
            reply = _generate_final(query, level)
            if not reply:
                self._response(502, {"error": "Qwen3 ما رجّعش جواب نهائي حتى بعد إعادة محاولة محلية. جرّب سؤال أقصر بعد ما يسالي تثبيت الصوت."})
                return
            seconds = round(time.monotonic() - started, 1)
            print("[Deutsch AI] Final reply: %.1fs, %d chars" % (seconds, len(reply)), flush=True)
            self._response(200, {"reply": reply, "level": level, "provider": "self-hosted",
                                 "elapsed_seconds": seconds})
        except HTTPError as exc:
            detail = exc.read(800).decode("utf-8", errors="replace")
            print("[Deutsch AI] Ollama HTTP %d: %s" % (exc.code, detail[:300]), flush=True)
            self._response(502, {"error": "Ollama رجّع خطأ "+str(exc.code)+". راجع النافذة الكحلة للمزيد من التفاصيل."})
        except TimeoutError:
            self._response(504, {"error": "Qwen3 تأخر بزاف على PC. سدّ البرامج الثقيلة وعاود المحاولة."})
        except (URLError, ValueError, KeyError, OSError) as exc:
            print("[Deutsch AI] Ollama request error:", str(exc)[:300], flush=True)
            self._response(503, {"error": "تعذر الاتصال بـOllama المحلي. تأكد أن Ollama خدام وأن الموديل "+MODEL+" محمّل."})

    def log_message(self, fmt, *args):
        print("[Deutsch AI] " + (fmt % args))


def main():
    print("=" * 54)
    print("Deutsch Mastery AI - 100% LOCAL - " + MODEL)
    print("No commercial AI API. No public network server.")
    print("Local address: http://127.0.0.1:8787/api/health")
    print("Site: https://houssamel4ur-lang.github.io/GERMANY/ai.html")
    print("To stop: close this window or press Ctrl+C")
    print("=" * 54)
    try:
        with ThreadingHTTPServer((HOST, PORT), Handler) as server:
            webbrowser.open("https://houssamel4ur-lang.github.io/GERMANY/ai.html")
            server.serve_forever(poll_interval=0.2)
    except OSError as e:
        print("Could not open local port 8787:", e)
        raise SystemExit(1)
    except KeyboardInterrupt:
        print("\nLocal AI stopped")


if __name__ == "__main__":
    main()
