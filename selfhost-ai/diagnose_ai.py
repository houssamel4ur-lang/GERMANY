"""No dependencies or paid APIs. Read-only diagnostics for localhost Ollama and bridge.

No private chat history, passwords, usernames, or thinking traces saved.
"""
from __future__ import annotations

import json
from pathlib import Path
import time
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

HERE = Path(__file__).resolve().parent
lines = []


def log(*items):
    line = " ".join(map(str, items))
    print(line, flush=True)
    lines.append(line)


def api(base, endpoint, obj=None, timeout=8):
    raw = None if obj is None else json.dumps(obj).encode("utf-8")
    req = Request(base + endpoint, data=raw,
                  headers={"Content-Type": "application/json"},
                  method="POST" if raw else "GET")
    with urlopen(req, timeout=timeout) as response:
        return json.loads(response.read(100_000).decode("utf-8"))


def status(name, callback):
    started = time.monotonic()
    try:
        value = callback()
        log(name, "OK", "elapsed=%.1fs" % (time.monotonic() - started))
        return value
    except (HTTPError, URLError, TimeoutError, OSError, ValueError) as exc:
        log(name, "FAILED:", type(exc).__name__, str(exc)[:180],
            "elapsed=%.1fs" % (time.monotonic() - started))
        return None


def main():
    log("Deutsch Mastery - diagnostic 2026.11.13.6")
    log("No user chat data is collected.")
    log("=" * 62)
    ollama = "http://127.0.0.1:11434"
    bridge = "http://127.0.0.1:8787"
    models = status("Ollama API", lambda: api(ollama, "/api/tags"))
    if isinstance(models, dict):
        log("Installed model tags:", ", ".join(
            m.get("name", "?") for m in models.get("models", []))[:300])
    info = status("Deutsch bridge", lambda: api(bridge, "/api/health"))
    if not isinstance(info, dict):
        log("NEXT: double-click START-STABLE-AI.cmd and keep it open.")
        return
    log("Bridge version:", info.get("bridge_version", "OLD/UNKNOWN"))
    log("Selected model:", info.get("model", "UNKNOWN"))
    log("Ready:", info.get("ready"))
    log("Voice ready:", info.get("speech_ready"))
    log("Mic ready:", info.get("transcription_configured"))
    if info.get("bridge_version") != "2026.11.13.6":
        log("NEXT: OLD PYTHON SERVER IS RUNNING. Close old window, then start stable AI.")
        return
    if not info.get("ready"):
        log("NEXT: Ollama model not available. Run START-STABLE-AI.cmd first.")
        return
    request = {"level": "A1", "scenario": "free", "correct": True,
               "messages": [{"role": "user", "content": "HALLO"}]}
    greeting = status("Local greeting", lambda: api(bridge, "/api/chat", request, timeout=12))
    if isinstance(greeting, dict):
        log("Greeting provider:", greeting.get("provider"))
        log("Greeting reply characters:", len(greeting.get("reply", "")))
    request["messages"][0]["content"] = "Ich lerne Deutsch."
    response = status("Real German model answer", lambda: api(
        bridge, "/api/chat", request, timeout=90))
    if isinstance(response, dict):
        log("Model provider:", response.get("provider"))
        log("Answer characters:", len(response.get("reply", "")))
        log("Model generation seconds:", response.get("elapsed_seconds"))
    if not isinstance(response, dict) or not response.get("reply"):
        log("NEXT: capture a screenshot of this report and the BLACK server window.")
    else:
        log("RESULT: Local text AI replied successfully; website should now work.")


if __name__ == "__main__":
    try:
        main()
    finally:
        target = HERE / "Deutsch-AI-Report.txt"
        target.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print("Saved:", target)
