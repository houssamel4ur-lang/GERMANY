# Deutsch Mastery Qwen3 4B — free Windows local chat

This is the text-chat-first local setup using the Qwen3 4B model already downloaded with Ollama.

1. Install Ollama and download qwen3:4b once (already done on your PC).
2. Install Python 3.9+ only if Windows doesn't already have it (free).
3. Download/unzip this folder or the two-file starter package: START-DEUTSCH-AI.cmd and local_bridge.py.
4. Double-click START-DEUTSCH-AI.cmd. A window starts the local bridge and the browser opens https://houssamel4ur-lang.github.io/GERMANY/ai.html.
5. Keep the black terminal window running while using the site. Closing it stops the local assistant.

This setup needs no Docker, AI API key, or subscription. It binds only to 127.0.0.1:8787 and talks to Ollama at 127.0.0.1:11434. Only the same PC's browser can use the local AI; this does NOT provide AI to remote visitors of GitHub Pages.

## Supported today

- Generated written conversations for German A1/A2/B1/B2
- Learner-level controls and optional gentle corrections
- Topic selection and lesson context (when curriculum-context.json is adjacent to the bridge)
- Thinking mode disabled for Ollama responses; an extra output filter rejects accidental plain-language thinking.
- No paid AI or cloud inference

Voice and microphone can now run on the same PC **without paid APIs**, but require a one-time installation:
1. Close the running START-DEUTSCH-AI.cmd window.
2. Double-click INSTALL-VOICE.cmd to install faster-whisper and Piper and download the free de_DE-thorsten-high German voice.
3. Restart START-DEUTSCH-AI.cmd. The site can then activate German TTS and microphone dictation, plus turn-taking voice chat. Whisper's free base model downloads on first use.
This needs extra RAM/disk space, and naturalness/accuracy depends on the PC and speech models. If voice isn't installed or fails, text chat still works. Videos and live Internet search are NOT enabled by this launcher. Browser local-network protections may affect localhost requests from GitHub Pages; this is not yet verified on the user's Windows machine.

If Python isn't found, install from https://www.python.org/downloads/windows/ and double-click again. If the site says it cannot connect, check Ollama and use the page's connection test. Do NOT expose localhost ports to the public Internet.

Software and inference API cost: $0. Hardware, electricity and existing Internet costs not included.

## Updating an existing installation

If you already have the earlier ZIP, **close its old black server window** and replace `local_bridge.py` plus the Windows command files from the updated archive. Reload the website with Ctrl+Shift+R. Keeping the old server window open means old model-output filtering and voice routes continue to be used.

## Slow replies or repeated connection errors

The November 13 fast patch keeps the existing Qwen3 4B model but lowers CPU memory/context work, avoids strict JSON decoding, limits reply length, and keeps the model loaded for 30 minutes to reduce cold starts. The website now shows the server's actual error message instead of repeating generic German text. Keep in mind response speed still depends on your Windows PC's CPU/GPU and available RAM; this update cannot guarantee instant answers.

**Important:** Close the old black `START-DEUTSCH-AI.cmd` window; replace `local_bridge.py` with the new file, start the batch file again, then reload the AI webpage with Ctrl+Shift+R. A GitHub change does not automatically update the running Python file on your computer.

## Fix for HALLO showing rejected thinking (November 13)

Updated bridge **2026.11.13.3** handles elementary greetings instantly in application code, and uses Qwen3 for actual free conversation. If Ollama returns an empty answer or an analysis-like transcript, the bridge makes **one** shorter retry, never displaying model reasoning. The website checks `bridge_version` so you can tell if it is still talking to an older local bridge. Keep the Windows `START-DEUTSCH-AI.cmd` window closed while replacing files; GitHub Pages cannot update software installed on your PC. Install/finish Whisper and Piper separately; background downloads may slow the PC temporarily.

## Stable no-thinking German AI (if Qwen3 returns no final text)

If you still get 'no final answer' or a thinking-only response, use **START-STABLE-AI.cmd**. It downloads and launches a separate **Llama 3.2 3B** model (about 2GB once), which officially supports German and is not a thinking-oriented model. Your existing Qwen3:4b model is NOT deleted. The startup updates local_bridge.py from your own GitHub repository and sets the local model only for that window. Review the model's Meta Community License before public or commercial deployment. No paid AI API.

Close the old black AI window FIRST (localhost port 8787 must be free), then double click START-STABLE-AI.cmd and keep that window open. Reload the website and test a conversation. You can run DIAGNOSE-AI.cmd to save a simple technical report: model and bridge version, localhost health, basic greeting and non-personal real German-model test. It doesn't save reasoning or chat history.

## One-click German voice and practice calls (2026-11-13)

The easiest path on Windows is **START-VOICE-AI.cmd**. Close every old black Deutsch AI server window first (port 8787 must be unused). Double-click the new launcher. It downloads the current Python server and voice setup from your own GitHub repository, keeps the already downloaded Qwen3 and Llama models, installs the two free speech libraries (if missing), downloads the German Piper Thorsten voice (if missing), and runs **PREPARE-VOICE.py**. That script performs **real German WAV synthesis** and a **real Whisper transcription test** before marking the engines as ready.

The website now exposes an always-visible call bar: **Test Voice**, **Start Call**, **Send Spoken Sentence**, **End Call**, plus a separate dictation microphone and auto-read setting. Voice calls are **turn-taking (half duplex)**: while you speak it listens, after silence (or the Send button) it transcribes and generates a German response, then Piper reads it, then listening resumes. It is not instantaneous/full-duplex or a real telephone call. The runtime may be slow on low-RAM PCs because both Whisper and the German LLM run on the user's CPU. Browser microphone permission is required. Same-PC only; remote visitors cannot call the user's local service via GitHub Pages. No commercial AI, STT or TTS API.

If the buttons stay disabled, click **Test Connection**. If German voice is missing, run `INSTALL-VOICE.cmd` to see the actual installation error. Restart the local AI terminal after installing, then reload the page with Ctrl+Shift+R. The site checks bridge version `2026.11.13.5` to prevent old programs from pretending that voice is ready.
