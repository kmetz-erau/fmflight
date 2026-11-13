# Facilities AI Field Lab: FM Journey

An open-ended journey-style browser game that teaches practical AI habits for facilities and public-works crews.

## How to play

You first choose a skilled-trade route: HVAC/BAS, Electrical, Plumbing, Carpentry/General Maintenance, or Grounds/Roads. The work calls and scenarios change with that choice. At each stop, you use the in-game FM AI Tool to write a prompt, receive an Ollama response, inspect it, and decide what to use. Each stop teaches one usable AI move—writing a clear prompt, finding missing information, comparing documents, preparing field questions, and setting a safe stop condition. You then type the move you would actually make and see the consequence for time, safety, crew trust, and AI skill. Starter buttons provide coaching prompts; they are not answer choices.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Deploy with GitHub + Vercel

Import the repository as a Next.js project. The repository includes `vercel.json` with the Next.js build command and `.next` output directory.

Use these Vercel settings:

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Root Directory: the folder containing `package.json`

The game supports OpenRouter and Ollama. The scoring is local and intentionally checks for practical habits rather than trade-specific technical knowledge.

## Ollama configuration

The browser calls the included `/api/ollama` server route. Set these Vercel environment variables for the free OpenRouter route:

- `AI_PROVIDER`: `openrouter`
- `OPENROUTER_BASE_URL`: `https://openrouter.ai/api/v1`
- `OPENROUTER_MODEL`: `openrouter/free`
- `OPENROUTER_API_KEY`: your OpenRouter key
- `OPENROUTER_SITE_URL`: optional deployed Vercel URL

To switch back to Ollama, set `AI_PROVIDER=ollama` and use the `OLLAMA_*` variables instead.
