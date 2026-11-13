/* Audit every requested German pronunciation against published, usable MP3
 * files. Run --strict AFTER audio generation; default mode reports pending
 * clips without falsely failing concurrent curriculum edits.
 */
import {readFileSync,statSync,existsSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {runInNewContext} from "node:vm";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const json=execFileSync(process.execPath,["scripts/audio_manifest.mjs","all"],{cwd:root,encoding:"utf8",maxBuffer:15*1024*1024});
const required=JSON.parse(json).entries;
const win={};
runInNewContext(readFileSync(resolve(root,"data/audio-index.js"),"utf8"),{window:win});
const map=win.DM_AUDIO_MAP||{};
const problems=[];
for(const entry of required){
 const target=map[entry.text];
 if(!target){problems.push("MISSING INDEX: "+entry.text);continue}
 if(target!==entry.path){problems.push("WRONG PATH: "+entry.text);continue}
 const file=resolve(root,target);
 if(!existsSync(file)||statSync(file).size<=1000)problems.push("MISSING MP3: "+target);
}
const st=JSON.parse(readFileSync(resolve(root,"data/audio-status.json"),"utf8"));
console.log("German audio inventory:",required.length,"requested;",Object.keys(map).length,"indexed;",problems.length,"missing or invalid; report:",st.generated,"generated");
if(problems.length){console.error(problems.slice(0,30).join("\n"))}
if(process.argv.includes("--strict")&&(problems.length||required.length!==st.requested||st.failures?.length)){
 console.error("STRICT AUDIO AUDIT FAILED: regenerate all German clips.");
 process.exitCode=1;
}
