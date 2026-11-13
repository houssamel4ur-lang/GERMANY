import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const root=new URL("../",import.meta.url);
for(const path of [
 "selfhost-ai/server.py","selfhost-ai/requirements.txt",
 "selfhost-ai/Dockerfile","selfhost-ai/compose.yaml",
 "selfhost-ai/README.md","selfhost-ai/Modelfile",
 "assets/ai-chat.js","assets/ai-live.js","assets/ai-config.js","ai.html"
]) assert.ok(existsSync(new URL(path,root)),path+" missing");
const py=read("selfhost-ai/server.py");
assert.match(py,/OLLAMA_URL/,"LLM needs local Ollama endpoint");
assert.match(py,/\/api\/chat/);
assert.match(py,/\/api\/transcribe/);
assert.match(py,/\/api\/speak/);
assert.match(py,/PiperVoice/);
assert.match(py,/WhisperModel/);
assert.match(py,/language="de"/);
assert.match(py,/hmac\.compare_digest/);
assert.match(py,/COACH_ACCESS_CODE/);
const corpus=JSON.parse(read("selfhost-ai/curriculum-context.json"));
assert.equal(corpus.topics.length,452,"all source PDF topics should be represented in the tutor");
assert.equal(corpus.topics.filter(x=>x.coverage==="draft_interactive").length,230,"authored lessons should be included in context");
assert.match(py,/lesson_context\(/,"tutor should accept focused lesson context");
assert.match(read("assets/ai-chat.js"),/lesson_id:/,"AI frontend must send lesson focus");
assert.doesNotMatch(py,/https:\/\/api\.openai\.com|https:\/\/api\.anthropic\.com|https:\/\/generativelanguage\.googleapis\.com/,"no external inference allowed");
const app=read("assets/ai-chat.js"),live=read("assets/ai-live.js");
assert.match(live,/\/api\/chat/);
assert.match(live,/\/api\/transcribe/);
assert.match(live,/\/api\/speak/);
assert.doesNotMatch(live,/realtime\/calls|client_secrets/,"live mode must use user's own server");
assert.doesNotMatch(app+live,/speechSynthesis/,"must not fallback to wrong-language browser TTS");
assert.match(read("ai.html"),/id="startLive"/);
assert.match(read("ai.html"),/id="endLive"/);
assert.match(read("ai.html"),/id="levelSelect"/);
assert.equal((read("ai.html").match(/<option value="(?:A1|A2|B1|B2)">/g)||[]).length,4,"all CEFR levels");
assert.match(read("assets/ai-config.js"),/apiBase:"http:\/\/127\.0\.0\.1:8787"/,"local API only, no paid server");
assert.match(read("selfhost-ai/local_bridge.py"),/qwen3:4b/,"local Qwen3 4B model");
assert.match(read("selfhost-ai/local_bridge.py"),/127\.0\.0\.1/,"bridge must stay on loopback");
assert.match(read("selfhost-ai/local_bridge.py"),/def _voice_available\(/,"voice readiness detection should exist");
assert.match(read("selfhost-ai/local_bridge.py"),/def _speech\(/,"local German TTS endpoint should exist");
assert.match(read("selfhost-ai/local_bridge.py"),/def _transcription\(/,"local German Whisper endpoint should exist");
assert.match(read("selfhost-ai/local_bridge.py"),/"think": False/,"disable native model thinking");
assert.match(read("selfhost-ai/local_bridge.py"),/"keep_alive": "30m"/,"avoid cold-start model load every few minutes");
assert.match(read("selfhost-ai/local_bridge.py"),/"num_ctx": 1536/,"compact CPU context window");
assert.doesNotMatch(read("selfhost-ai/local_bridge.py"),/"format": \{"type": "object"/,"avoid structured decoding overhead on local CPU");
assert.doesNotMatch(read("assets/ai-chat.js"),/Ich denke nach|Verbindung fehlgeschlagen/,"chat should show neither thinking nor repetitive generic errors");
assert.match(read("assets/ai-chat.js"),/ai-request-error/,"show the actual failure and let users retry");
assert.match(read("ai.html"),/ai-voice-details/,"optional voice controls should be available");

assert.doesNotMatch(read("assets/ai-config.js"),/sk-[A-Za-z0-9]{10}/,"no secrets in public config");
const compose=read("selfhost-ai/compose.yaml");
assert.match(compose,/ollama\/ollama/);
assert.match(compose,/127\.0\.0\.1:8787:8787/);
assert.doesNotMatch(compose,/\n\s*-\s*["']?11434:11434/,"Ollama must remain private");
console.log("SELFHOST AI CHECK PASS: own Ollama LLM, private auth, German Piper and Whisper, no external inference API, local hands-free chat.");
