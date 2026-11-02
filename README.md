# Facilities AI Field Lab

A repo-ready Next.js training prototype for facilities teams learning to use AI safely.

## What it includes

- Nine training labs: a supervisor module plus HVAC, BAS/controls, electrical, plumbing, fire/life safety, building envelope, custodial/IAQ, and grounds/irrigation.
- Eight written-response AI-workflow questions per lab. Ollama grades each answer from 0–10 and returns strengths, missing elements, and an improvement suggestion.
- A server-side `/api/chat` route that calls Ollama's `/api/chat` endpoint.
- A server-side `/api/grade` route that grades written responses against the lab evidence and rubric.
- Passing is deterministic: a response must receive at least 7/10 before the learner can advance, with no critical-risk flag.
- Grading uses five fixed criteria scored 0–2: task framing, evidence grounding, uncertainty, risk boundary, and human review. Passing requires 7/10 and no critical-risk flag.
- Completed modules include a print-ready results sheet with every written answer, score, and feedback.
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
