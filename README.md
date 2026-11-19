# FM Flight — AI Field Academy (v4)

This update restores the original mission: teach skilled tradespeople to use AI effectively and safely. It replaces the `/game` experience with a mission-based AI skills academy and retains the original `/training` route.

## Install into the existing `kmetz-erau/fmflight` Next.js repository

Copy these paths into your repository, overwriting the existing files of the same names:

- `app/page.jsx` — redirects the homepage to `/game` (unchanged from v3)
- `app/game/page.jsx` — new AI literacy game
- `app/game/academy.css` — new academy styling
- `app/game/game.css` — preserved existing CSS import
- `lib/academy-data.js` — missions, trade profiles, achievements

**Do not delete any other files**. Keep `app/api/ollama/route.js`, `app/training`, `lib/labs.js`, and the existing package files. The new game uses the current `/api/ollama` endpoint. Ensure your OpenRouter or Ollama environment variables are configured in Vercel.

Run `npm install && npm run build`, then `npm run dev` and open `http://localhost:3000`.

## What is playable

- Five trade-specific pathways
- Twelve missions covering prompting, verification, document comparison, safe AI use, and workflows
- Four-step Task → Try → Check → Keep loop
- Real calls to your existing FM AI Tool; an available AI provider is required to complete missions
- CRAFT prompt-writing checklist, critique questions, final work product, formative automated feedback
- XP, levels, mission unlocks, eight badges, local browser save and JSON export/import

## Important limitations

The automated grading is an explainable heuristic, not a verified assessment of technical competence. It does not certify safe operation or authorize work. It rewards prompt structure and explicit verification habits; a human instructor should review safety-critical responses. Browser storage is device-local. AI API availability depends on the existing provider configuration.

## Smoke test

1. Choose HVAC / BAS; open the first mission.
2. Write a CRAFT prompt containing context, task, format, truth-check, and human review.
3. Run the FM AI Tool; confirm the response appears.
4. Select facts vs assumptions, source verification, and human ownership.
5. Submit a work product with facts, unknowns, check, owner, and stop condition.
6. Confirm XP is awarded, refresh, and confirm progress persists.
7. Confirm `/training` still opens the original training experience.
