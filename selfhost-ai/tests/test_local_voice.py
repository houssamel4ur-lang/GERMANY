"""Offline regression tests for Deutsch Mastery speech and voice call APIs.

Uses only the Python standard library. Real Piper/Whisper inference is verified
on the user's PC by PREPARE-VOICE.py, not in GitHub Actions.
"""
import importlib.util
import http.client
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import types
import unittest
from unittest.mock import patch
import wave

SOURCE = Path(__file__).resolve().parents[1] / "local_bridge.py"
spec = importlib.util.spec_from_file_location("local_bridge_audio", SOURCE)
bridge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bridge)


class SpeechSetupTests(unittest.TestCase):
    def test_voice_markers_are_required(self):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            model = directory / "de_DE-thorsten-high.onnx"
            model.write_bytes(b"FAKE")
            model.with_suffix(".onnx.json").write_text("{}")
            with patch.object(bridge, "VOICE_DIR", directory), \
                 patch.object(bridge, "PIPER_PATH", model), \
                 patch.object(bridge, "find_spec", return_value=object()):
                self.assertFalse(bridge._voice_available())
                self.assertFalse(bridge._stt_available())
                (directory / ".piper-ready").write_text("ok")
                (directory / (".whisper-" + bridge.WHISPER_SIZE + "-ready")).write_text("ok")
                self.assertTrue(bridge._voice_available())
                self.assertTrue(bridge._stt_available())

    def test_piper_audio_is_valid_riff_wav(self):
        class Voice:
            @staticmethod
            def synthesize_wav(text, dst):
                dst.setnchannels(1)
                dst.setsampwidth(2)
                dst.setframerate(22050)
                dst.writeframes(b"\0\0" * 2000)
        piper = types.ModuleType("piper")
        piper.PiperVoice = types.SimpleNamespace(load=lambda path: Voice())
        with patch.dict(sys.modules, {"piper": piper}), patch.object(bridge, "_TTS", None):
            with patch.object(bridge, "PIPER_PATH", Path("fake.onnx")):
                audio = bridge._wav_bytes("Hallo, ich lerne Deutsch.")
        self.assertTrue(audio.startswith(b"RIFF"))
        self.assertGreater(len(audio), 500)

    def test_whisper_transcription_and_temp_file_cleanup(self):
        seen = {}
        class MockWhisper:
            def __init__(self, *args, **kwargs):
                pass
            def transcribe(self, filename, **kwargs):
                seen["filename"] = filename
                seen["language"] = kwargs["language"]
                seen["short_speech"] = kwargs["vad_filter"]
                self.assert_file = Path(filename).is_file()
                return [types.SimpleNamespace(text="Hallo, ich lerne Deutsch.")], {}
        faster = types.ModuleType("faster_whisper")
        faster.WhisperModel = MockWhisper
        with patch.dict(sys.modules, {"faster_whisper": faster}), patch.object(bridge, "_STT", None):
            text = bridge._recognize_audio(b"fake input bytes", ".webm")
        self.assertIn("Hallo", text)
        self.assertEqual(seen["language"], "de")
        self.assertEqual(seen["short_speech"], False)
        self.assertEqual(bridge.WHISPER_SIZE, "small")
        self.assertFalse(Path(seen["filename"]).exists())


class LocalHTTPVoiceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = bridge.ThreadingHTTPServer(("127.0.0.1", 0), bridge.Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=2)

    def request(self, path, raw, content_type):
        conn = http.client.HTTPConnection("127.0.0.1", self.server.server_address[1], timeout=5)
        conn.request("POST", path, body=raw, headers={
            "Host": "127.0.0.1:8787",
            "Content-Type": content_type,
            "Content-Length": str(len(raw)),
        })
        response = conn.getresponse()
        data = response.read()
        result = response.status, response.getheader("Content-Type"), data
        conn.close()
        return result

    def test_speech_endpoint_returns_audio(self):
        audio = b"RIFF" + b"\x00" * 80
        with patch.object(bridge, "_voice_available", return_value=True), \
             patch.object(bridge, "_wav_bytes", return_value=audio):
            request = json.dumps({"text":"Guten Tag! Wie geht es dir?","level":"A1"}).encode()
            status, content_type, data = self.request("/api/speak", request, "application/json")
        self.assertEqual(status, 200)
        self.assertEqual(content_type, "audio/wav")
        self.assertEqual(data, audio)

    def test_mic_endpoint_accepts_browser_multipart(self):
        boundary = "test-local-deutsch-voice"
        audio = b"f" * 1100
        raw = (
            ("--" + boundary + "\r\nContent-Disposition: form-data; name=\"audio\"; filename=\"speech.webm\"\r\n"
             "Content-Type: audio/webm;codecs=opus\r\n\r\n").encode()
            + audio + ("\r\n--" + boundary + "--\r\n").encode()
        )
        with patch.object(bridge, "_stt_available", return_value=True), \
             patch.object(bridge, "_recognize_audio", return_value="Hallo!"):
            status, mime, response = self.request("/api/transcribe", raw, "multipart/form-data; boundary="+boundary)
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(response)["text"], "Hallo!")


if __name__ == "__main__":
    unittest.main()
