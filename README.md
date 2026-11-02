# Facilities AI Field Lab

A repo-ready Next.js training prototype for facilities teams learning to use AI safely.

## What it includes

- Eight trade-based training labs covering HVAC, BAS/controls, electrical, plumbing, fire/life safety, building envelope, custodial/IAQ, and grounds/irrigation.
- Ten AI-workflow questions per lab focused on prompt framing, source grounding, uncertainty, verification, privacy, safety boundaries, and handoffs.
- A server-side `/api/chat` route that calls Ollama's `/api/chat` endpoint.
- Lab-specific evidence packs and conservative system prompts.
- No Ollama URL or credential is exposed to the browser.

## Run locally

```bash
npm install
cp .env.example .env.local
# Start Ollama separately, then download a model:
ollama pull llama3.1:8b
npm run dev
```

Open `http://localhost:3000`.

## Deploy with GitHub + Vercel GUI

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected Next.js settings.
3. In **Project Settings → Environment Variables**, add:
   - `OLLAMA_BASE_URL` — a URL reachable from Vercel, not `localhost`.
   - `OLLAMA_MODEL` — for example `llama3.1:8b`.
   - `OLLAMA_API_KEY` — optional bearer token if the endpoint requires authentication.
4. Redeploy after changing either variable.

For production, expose Ollama only through a secured network path and add authentication at that boundary. Do not place private facilities documents or live-system credentials in client-side code or public prompts.
