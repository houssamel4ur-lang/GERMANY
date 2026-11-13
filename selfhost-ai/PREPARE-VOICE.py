"""One-time offline speech engine preparation for Deutsch Mastery on Windows.

Downloads the official German Piper voice and Whisper's multilingual base model
via their installed open-source Python packages. Does not send learner audio to
any external service. Creates readiness stamps only after real engine tests.
"""
from pathlib import Path
import os
import io
import wave

ROOT = Path(__file__).resolve().parent
VOICE_DIR = ROOT / "voices"
VOICE = VOICE_DIR / "de_DE-thorsten-high.onnx"
STT_MODEL = os.getenv("DEUTSCH_STT_MODEL", "small").strip().lower()
if STT_MODEL not in {"base", "small"}:
    STT_MODEL = "small"


def main():
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    piper_stamp = VOICE_DIR / ".piper-ready"
    whisper_stamp = VOICE_DIR / (".whisper-" + STT_MODEL + "-ready")

    print("[1/2] Testing the German voice engine (Piper)", flush=True)
    if not VOICE.is_file() or not VOICE.with_suffix(".onnx.json").is_file():
        raise RuntimeError("Piper German voice files are missing from voices/")

    from piper import PiperVoice
    tts = PiperVoice.load(str(VOICE))
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav:
        tts.synthesize_wav("Hallo! Ich lerne heute Deutsch.", wav)
    sample = buffer.getvalue()
    if not sample.startswith(b"RIFF") or len(sample) < 500:
        raise RuntimeError("Piper generated no valid WAV audio")
    piper_stamp.write_text("ok\n", encoding="utf-8")
    print("[OK] Piper generated German WAV audio.", flush=True)

    print("[2/2] Downloading and preparing multilingual Whisper "+STT_MODEL+" (one-time, no paid API)", flush=True)
    from faster_whisper import WhisperModel
    recognizer = WhisperModel(STT_MODEL, device="cpu", compute_type="int8")
    # Decode exactly the WAV created locally: validates the complete
    # recorded-audio -> STT path without the user's microphone.
    segments, _ = recognizer.transcribe(io.BytesIO(sample), language="de",
                                        beam_size=5, vad_filter=False, temperature=0.0)
    recognized = " ".join(part.text.strip() for part in segments).strip()
    if not recognized:
        raise RuntimeError("Whisper could not decode the local test recording")
    whisper_stamp.write_text("ok\n", encoding="utf-8")
    print("[OK] Whisper transcribed the locally synthesized German sample.", flush=True)
    print("VOICE READY: Piper (German speech) + Whisper (German microphone)", flush=True)


if __name__ == "__main__":
    main()
