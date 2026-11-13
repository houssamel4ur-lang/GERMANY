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

    def test_model_still_local_and_nothink(self):
        self.assertEqual(bridge.MODEL, "qwen3:4b")
        self.assertIn("/no_think", bridge._system("A1", "free", True, None))


if __name__ == "__main__":
    unittest.main()
