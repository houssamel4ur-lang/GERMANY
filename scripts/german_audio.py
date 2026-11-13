#!/usr/bin/env python3
"""Pre-generate *German only* MP3 clips; never use an auto-detected locale."""
import asyncio
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import time
import edge_tts

VOICE = "de-DE-KatjaNeural"
ROOT = pathlib.Path.cwd()
SOURCE = pathlib.Path(sys.argv[1])
manifest = json.loads(SOURCE.read_text(encoding="utf-8"))
if manifest["voice"] != VOICE:
    raise ValueError("Unexpected voice")
failures = []
fallbacks = []
sem = asyncio.Semaphore(3)

async def render(entry):
    text, path = entry["text"], ROOT / entry["path"]
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.stat().st_size > 2500:
        return
    async with sem:
        err = None
        for attempt in range(3):
            try:
                temp = str(path)+".partial"
                if os.path.exists(temp):
                    os.remove(temp)
                await edge_tts.Communicate(text=text, voice=VOICE, rate="-5%").save(temp)
                if pathlib.Path(temp).stat().st_size < 1000:
                    raise RuntimeError("Audio file was unexpectedly small")
                os.replace(temp,path)
                return
            except Exception as exc:
                err=exc
                await asyncio.sleep(1.5*(attempt+1))
        # If online German neural synthesis is unavailable, use LOCAL GERMAN
        # eSpeak-ng voice, never the machine's language auto-detection.
        try:
            with tempfile.TemporaryDirectory() as folder:
                wav=os.path.join(folder,"de.wav")
                subprocess.run(["espeak-ng","-v","de","-s","145","-w",wav,text],check=True,stdout=subprocess.DEVNULL)
                subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-i",wav,"-codec:a","libmp3lame","-q:a","6","-y",str(path)],check=True)
            if path.stat().st_size < 1000:
                raise RuntimeError("espeak output invalid")
            fallbacks.append(text)
        except Exception as fallback_err:
            failures.append([text,str(err),str(fallback_err)])

async def main():
    start=time.monotonic()
    await asyncio.gather(*(render(e) for e in manifest["entries"]))
    produced={e["text"]:e["path"] for e in manifest["entries"] if (ROOT/e["path"]).is_file()}
    if not produced: raise RuntimeError("No German MP3 files were generated")
    (ROOT/"data"/"audio-index.js").write_text("/* German MP3 recordings; no browser-language fallback. */\nwindow.DM_AUDIO_MAP = "+json.dumps(produced,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")
    (ROOT/"data"/"audio-status.json").write_text(json.dumps({"voice":VOICE,"generated":len(produced),"requested":len(manifest["entries"]),"offline_german_fallbacks":len(fallbacks),"failures":failures,"elapsed_seconds":round(time.monotonic()-start,1)},ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"GERMAN AUDIO: {len(produced)}/{len(manifest['entries'])} clips; neural={len(produced)-len(fallbacks)}, German offline fallback={len(fallbacks)}, errors={len(failures)}")
    if failures:
        print("FAILED CLIPS:",failures[:5],file=sys.stderr)
        raise RuntimeError("Some clips could not be generated")

asyncio.run(main())
