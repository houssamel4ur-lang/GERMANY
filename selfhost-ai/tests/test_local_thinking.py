"""Local no-paid-API guard tests. Runs offline with Python stdlib."""
import importlib.util
from pathlib import Path
import unittest

source = Path(__file__).resolve().parents[1] / "local_bridge.py"
spec = importlib.util.spec_from_file_location("local_bridge", source)
bridge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bridge)


class FinalOnlyReplyTests(unittest.TestCase):
    def test_tagged_thought(self):
        self.assertEqual(bridge._clean("<think>private chain</think>Hallo!"), "Hallo!")

    def test_unclosed_tag(self):
        self.assertEqual(bridge._clean("<think>secret thoughts"), "")

    def test_plain_english_thought(self):
        sample = ("Okay, the learner said \"HALLO\". I need to respond in natural, warm German "
                  "as a Deutsch Partner. Since they're at A1 level, I should use very simple sentences.")
        self.assertEqual(bridge._clean(sample), "")

    def test_german_answer(self):
        self.assertEqual(bridge._clean("Hallo! Wie geht es dir?"), "Hallo! Wie geht es dir?")

    def test_instant_first_greeting(self):
        self.assertIn("Wie geht es dir?", bridge._fast_greeting("HALLO", "A1"))
        self.assertEqual(bridge._fast_greeting("Ich heiße Ali.", "A1"), "")

    def test_retries_once_and_does_not_publish_reasoning(self):
        from unittest.mock import patch
        bogus = {"message": {"content": "Okay, the learner said HALLO. I need to respond in German."}}
        valid = {"message": {"content": "Hallo! Wie geht es dir?"}}
        with patch.object(bridge, "_ollama", side_effect=[bogus, valid]) as mock:
            answer = bridge._generate_final([
                {"role": "system", "content": bridge._system("A1", "free", True, None)},
                {"role": "user", "content": "Ich lerne Deutsch."},
            ], "A1")
        self.assertEqual(answer, "Hallo! Wie geht es dir?")
        self.assertEqual(mock.call_count, 2)

    def test_model_still_local_and_nothink(self):
        self.assertEqual(bridge.MODEL, "qwen3:4b")
        self.assertEqual(bridge.BRIDGE_VERSION, "2026.11.13.6")
        self.assertIn("/no_think", bridge._system("A1", "free", True, None))

    def test_nonthinking_model_omits_no_think_and_native_think_flag(self):
        from unittest.mock import patch
        with patch.object(bridge, "MODEL", "llama3.2:3b"):
            prompt = bridge._system("A1", "free", True, None)
            self.assertNotIn("/no_think", prompt)
            with patch.object(bridge, "_ollama", return_value={"message":{"content":"Hallo! Wie heißt du?"}}) as mock:
                reply = bridge._generate_final([
                    {"role":"system","content":prompt},
                    {"role":"user","content":"Ich lerne Deutsch."}], "A1")
            self.assertEqual(reply, "Hallo! Wie heißt du?")
            self.assertNotIn("think", mock.call_args.args[1])



if __name__ == "__main__":
    unittest.main()
