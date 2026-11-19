# FM Flight — AI Quest (new interactive game)

This package adds a **new playable game at `/quest`** and makes it the default homepage. It does **not** overwrite the existing AI Academy (`/game`) or original FM Journey (`/training`).

## Install

1. Extract this ZIP.
2. Copy its `app` and `lib` folders into the root of your existing `fmflight` repository, merging folders and replacing only matching files. The package contains `app/page.jsx`, `app/quest/page.jsx`, `app/quest/quest.css`, and `lib/academy-data.js`.
3. Run `npm install` and `npm run build` in your repository.
4. Commit and push; wait for Vercel to deploy.
5. Visit `/` or `/quest` to play. `/game` and `/training` remain accessible if their existing files are present.

## Gameplay

- Choose one of five trades.
- Explore a 12-location clickable campus mission map.
- Investigate six evidence cards per mission; four are relevant, two are distractions.
- Build a five-part CRAFT prompt or write a complete advanced prompt.
- Optionally call the existing `/api/ollama` AI endpoint; the main AI Detective exercise intentionally uses a simulated flawed response for consistent teaching.
- Flag unsupported AI claims and explain why they are problematic.
- Create a field-ready handoff and earn 1–3 stars, XP, and unlocks.
- Save progress automatically in the browser; choose another trade with the Home button without deleting XP.

## Important notes

- This is educational gameplay, not permission to perform physical repairs or hazardous work.
- Mission grading is a transparent heuristic, not a validated assessment of trade competency. The simulated AI claims are intentionally wrong.
- This package does not restore a missing `/training/page.jsx`; if that route is absent, restore the actual original page separately from Git history.
- No server, authentication, or database is required for the game. Live AI is optional and uses the preexisting API route.
