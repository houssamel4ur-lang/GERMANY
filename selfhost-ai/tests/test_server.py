"""Offline HTTP contract tests. Never download a model or call a paid AI API."""
import sys
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server

SECRET = "unit-test-private-code-123456789"


class SelfHostedCoachTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        server.CODE = SECRET
        server._rate.clear()
        cls.client = TestClient(server.app)

    def authorized(self):
        return {"X-Coach-Access": SECRET}

    def test_password_required(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 401)

    def test_health_with_local_model(self):
        with patch.object(server, "_model_available", new=AsyncMock(return_value=True)):
            response = self.client.get("/api/health", headers=self.authorized())
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ready"])
        self.assertEqual(payload["provider"], "self-hosted")
        self.assertEqual(response.headers.get("cache-control"), "no-store")

    def test_cefr_levels_and_prompt(self):
        for level in ("A1", "A2", "B1", "B2"):
            text = server.prompt(level, "free", True)
            self.assertIn(level, text)
            self.assertIn("natural", text.lower())
        with self.assertRaises(ValueError):
            server.prompt("C2", "free", True)

    def test_german_reply_with_fake_local_model(self):
        request = {
            "level": "A1",
            "scenario": "cafe",
            "correct": True,
            "messages": [{"role": "user", "content": "Guten Morgen!"}],
        }
        mock = AsyncMock(return_value="Guten Morgen! Möchtest du einen Kaffee?")
        with patch.object(server, "_generate_local", new=mock):
            response = self.client.post("/api/chat", headers=self.authorized(), json=request)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Möchtest", response.json()["reply"])
        mock.assert_awaited_once()
        self.assertEqual(response.json()["provider"], "self-hosted")

    def test_invalid_learner_level(self):
        response = self.client.post("/api/chat", headers=self.authorized(), json={
            "level": "C2",
            "scenario": "free",
            "correct": True,
            "messages": [{"role": "user", "content": "Hallo!"}],
        })
        self.assertEqual(response.status_code, 400)

    def test_only_german_transcription(self):
        with patch.object(server, "_transcribe_local", return_value="Ich heiße Sara.") as transcriber:
            response = self.client.post(
                "/api/transcribe",
                headers=self.authorized(),
                files={"audio": ("speech.webm", b"x" * 900, "audio/webm")},
            )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["text"], "Ich heiße Sara.")
        transcriber.assert_called_once()

    def test_local_speech_returns_wav(self):
        with patch.object(server, "PIPER_VOICE_PATH", Path(__file__)):
            with patch.object(server, "_synthesize_local", return_value=b"RIFF1234WAVE"):
                response = self.client.post(
                    "/api/speak",
                    headers=self.authorized(),
                    json={"text": "Guten Tag", "level": "A1"},
                )
        self.assertEqual(response.status_code, 200)
        self.assertIn("audio/wav", response.headers["content-type"])

    def test_curriculum_context_is_local(self):
        data = server._curriculum()
        self.assertEqual(len(data), 452)
        self.assertIn("A1-01-01", data)
        focused = server.lesson_context("A1-01-01", "A1")
        self.assertIn("Tutor focus", focused)
        self.assertEqual(server.lesson_context("A1-01-01", "B1"), "")

    def test_no_commercial_ai_url(self):
        text = Path(server.__file__).read_text(encoding="utf-8")
        for forbidden in ("https://api.openai.com", "https://api.anthropic.com", "https://generativelanguage.googleapis.com"):
            self.assertNotIn(forbidden, text)


if __name__ == "__main__":
    unittest.main()
