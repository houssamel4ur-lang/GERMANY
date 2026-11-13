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
