import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const code=read("ai-backend/src/worker.js");
const mod=await import("data:text/javascript;base64,"+Buffer.from(code).toString("base64"));
const worker=mod.default;
const origin="https://houssamel4ur-lang.github.io";
const env={OPENAI_API_KEY:"sk-test-NEVER-REAL",AI_ACCESS_CODE:"local-test-unique-code",ALLOWED_ORIGIN:origin,AI_MODEL:"gpt-4.1-mini",TTS_MODEL:"gpt-4o-mini-tts",STT_MODEL:"gpt-4o-mini-transcribe"};
const invoke=(path,options={})=>worker.fetch(new Request("https://worker.example"+path,{...options,headers:{"Origin":origin,...(options.headers||{})}}),env);
const auth={"X-Coach-Access":env.AI_ACCESS_CODE};
assert.equal((await invoke("/api/health")).status,401,"private access code must be required");
const health=await invoke("/api/health",{headers:auth});
assert.equal(health.status,200);assert.equal((await health.json()).ready,true);
const foreign=await worker.fetch(new Request("https://worker.example/api/health",{headers:{"Origin":"https://bad-site.example",...auth}}),env);
assert.equal(foreign.status,403,"foreign origins must be rejected");
const preflight=await invoke("/api/chat",{method:"OPTIONS"});
assert.equal(preflight.status,204);assert.equal(preflight.headers.get("Access-Control-Allow-Origin"),origin);
const originalFetch=globalThis.fetch;
try{
 let bodySent=null;
 globalThis.fetch=async (url,opts)=>{
   assert.equal(url,"https://api.openai.com/v1/responses");
   assert.equal(opts.headers.Authorization,"Bearer "+env.OPENAI_API_KEY);
   bodySent=JSON.parse(opts.body);
   return Response.json({output:[{type:"message",content:[{type:"output_text",text:"Hallo! Wie geht es dir?"}]}]});
 };
 const chat=await invoke("/api/chat",{method:"POST",headers:{...auth,"Content-Type":"application/json"},body:JSON.stringify({level:"A1",scenario:"free",correct:true,messages:[{role:"user",content:"Hallo!"}]})});
 assert.equal(chat.status,200);
 assert.equal((await chat.json()).reply,"Hallo! Wie geht es dir?");
 assert.equal(bodySent.store,false,"conversations should not be stored through Responses API");
 assert.match(bodySent.instructions,/CEFR A1/);
 assert.equal(bodySent.input.at(-1).content,"Hallo!");
 const invalid=await invoke("/api/chat",{method:"POST",headers:{...auth,"Content-Type":"application/json"},body:JSON.stringify({level:"C2",scenario:"free",correct:true,messages:[{role:"user",content:"Hallo"}]})});
 assert.equal(invalid.status,400);
 globalThis.fetch=async (url,opts)=>{
   assert.equal(url,"https://api.openai.com/v1/audio/speech");
   assert.match(JSON.parse(opts.body).instructions,/STANDARD GERMAN/);
   return new Response(new Uint8Array([73,68,51,3,0,2]),{headers:{"Content-Type":"audio/mpeg"}});
 };
 const sound=await invoke("/api/speak",{method:"POST",headers:{...auth,"Content-Type":"application/json"},body:JSON.stringify({text:"Guten Morgen",level:"A1"})});
 assert.equal(sound.status,200);
 assert.equal(sound.headers.get("Content-Type"),"audio/mpeg");
 globalThis.fetch=async (url,opts)=>{
   assert.equal(url,"https://api.openai.com/v1/audio/transcriptions");
   assert.equal(opts.body.get("language"),"de");
   return Response.json({text:"Ich heiße Lena."});
 };
 const fd=new FormData();fd.append("audio",new Blob([new Uint8Array(650)],{type:"audio/webm"}),"speech.webm");
 const stt=await invoke("/api/transcribe",{method:"POST",headers:auth,body:fd});
 assert.equal(stt.status,200);assert.equal((await stt.json()).text,"Ich heiße Lena.");
}finally{globalThis.fetch=originalFetch}
for(const path of ["index.html","syllabus.html","course.html","module.html","ai.html"]){
 assert.match(read(path),/href="ai.html"/,"AI navigation link missing: "+path);
}
assert.match(read("ai.html"),/id="recordBtn"/);
assert.match(read("ai.html"),/id="levelSelect"/);
assert.match(read("ai.html"),/id="autoSpeak"/);
assert.match(read("assets/ai-chat.js"),/\/api\/chat/);
assert.match(read("assets/ai-chat.js"),/\/api\/transcribe/);
assert.match(read("assets/ai-chat.js"),/\/api\/speak/);
assert.ok(!read("assets/ai-config.js").includes("sk-"),"Never publish a secret in frontend config");
assert.ok(!read("assets/ai-chat.js").includes("speechSynthesis"),"Never use wrong-language browser TTS");
console.log("AI CHECK PASS: four levels, protected backend, CORS, real chat, German TTS and STT contracts, and static interface.");
