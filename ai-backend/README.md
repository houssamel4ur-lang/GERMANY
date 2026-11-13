# Deutsch Partner AI — secure backend setup

This Worker provides a **real, non-scripted German AI conversation** for `ai.html`, with CEFR level adaptation (A1/A2/B1/B2), German speech recognition, and neural audio replies.

## Deploy the Worker

You need your **own Cloudflare account**, a separately billed **OpenAI API account with available credits**, and Node.js. A ChatGPT subscription is not an OpenAI API credit balance.

1. In this repository, open a terminal in `ai-backend/`.
2. Run `npx wrangler deploy` (sign in to Cloudflare when prompted).
3. Add secrets **privately**:
   ```sh
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put AI_ACCESS_CODE
   ```
   Generate a random, non-guessable `AI_ACCESS_CODE` of at least 8 characters and keep it private. **NEVER put your OpenAI API key in `ai.html`, JavaScript, a GitHub commit, a public form or this chat.**
4. Take the deployed URL shown by Wrangler (example `https://deutsch-mastery-coach.<your-subdomain>.workers.dev`; this is an **example, not a deployed URL**).
5. Update only `apiBase` in the public `assets/ai-config.js`:
   ```js
   window.DEUTSCH_AI_CONFIG={apiBase:"https://YOUR-ACTUAL-WORKER.workers.dev",maxTurns:12};
   ```
6. Open [the German chat page](https://houssamel4ur-lang.github.io/GERMANY/ai.html), enter your **AI_ACCESS_CODE** (not the OpenAI key) and click **اختبار الاتصال**.

The access code is for **personal/private practice**. If you want this feature available to every public visitor, implement stronger authentication, per-user quotas, abuse prevention and billing limits **before** removing the access-code check. An access code that is shared widely is not a sufficient cost-control mechanism.

## Endpoint contracts

- `GET /api/health` + `X-Coach-Access`: returns `{ready:true|false}`.
- `POST /api/chat` + access header: JSON `{level:"A1",scenario:"free",correct:true,messages:[{role:"user",content:"Hallo"}]}` → `{reply:"..." }`
- `POST /api/speak`: JSON `{text:"Hallo!",level:"A1"}` → MP3 audio.
- `POST /api/transcribe`: multipart/form-data `audio` (WebM / MP4 / OGG, max 5 MB) → German transcript.

All AI calls come from the Worker; the OpenAI API key is never sent to the browser. CORS allows the known GitHub Pages origin. Only the last 12 dialogue turns are sent by the browser, and the Worker does not maintain a conversation database. `store:false` is sent to the Responses API. The external AI service processes the data according to its own terms.

**Audio disclosure:** reply audio is AI-generated, *not* a human recording. Spoken German quality should be checked with native speakers; these models do not certify accent accuracy.

## Maintenance

As of November 2026, the `gpt-4o-mini-tts` speech endpoint has a published shutdown date of **January 6, 2027** and `gpt-4o-mini-transcribe` has a published shutdown date of **February 26, 2027**. The Worker isolates `TTS_MODEL` and `STT_MODEL` as environment variables, but migration to the current Realtime/speech APIs will be needed before then. The static interface will not be able to fix a withdrawn model on its own.

Do not deploy this feature in a public unmetered setting without additional cost controls and testing.
