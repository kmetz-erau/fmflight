# FM Flight — Full Career & Campus Game (v2)

This package extends the existing `kmetz-erau/fmflight` Next.js 15 application without replacing the original training game.

## Install

1. Copy `app/game/page.jsx` and `app/game/game.css` to the same paths in your repository.
2. Copy `lib/game-data.js` into your repository's `lib/` folder.
3. Keep your existing `app/api/ollama/route.js` and `.env.local` configuration.
4. Run `npm install` and `npm run dev` from your repository root.
5. Visit `http://localhost:3000/game`.

## Features

- Six clickable campus buildings and filtered work-order dispatch
- Twelve missions with gated difficulty and trade-neutral workplace evidence
- Multiple-choice decision plus written handoff assessment; correct decision and sufficient handoff both required
- XP, ranks, eight achievements, and mission replay without repeat XP farming
- Operations budget, hiring, daily payroll, preventive maintenance, safety training, backlog, and rotating events
- Operations log, local browser autosave, JSON save export/import, and migration from v1 saves
- Existing `/api/ollama` AI assistant remains optional for each mission
- Original application remains at `/`

## Notes and limitations

This is a complete playable browser-game loop, not a 3D simulation or real-time multiplayer system. The six facilities are illustrated with interactive CSS cards rather than a 3D map. Mission writing is assessed with an explicitly heuristic local rubric, not by a qualified instructor or a validated assessment system. Trade selection changes the player's profile; missions are currently shared across trades. Save data is local to each browser unless exported. No authentication or leaderboard is included. The AI tool requires your existing configured provider.

The management economy is intentionally lightweight; advancing a day can produce negative credits, and the scenario event sequence is deterministic for repeatable play. The game is a training exercise and cannot authorize real-world operational actions.
