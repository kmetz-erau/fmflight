# FM Flight Career Mode — Gameplay v1

This add-on adds a playable career mode at `/game` without changing the existing FM Journey route.

## Install

Copy the `app/game` directory into your existing `fmflight/app/` directory. Run `npm install` and `npm run dev`, then open `http://localhost:3000/game`.

## Included

- Trade selection (5 trades)
- Campus dashboard and dispatch board
- Seven interactive missions with evidence, decision points, written handoffs, and consequences
- XP, leveling, career ranks, achievements, mission unlocks
- Local browser persistence and reset
- Optional AI tool panel that calls the existing `/api/ollama` endpoint

## Important limitations

- This is a first playable release, not the complete management simulator.
- The written handoff is required but **not automatically graded**. Mission success is based on the multiple-choice decision. The UI discloses this.
- Progress is stored in localStorage on the same browser only, not in an account.
- The AI panel depends on the repository's existing API configuration. If it is unavailable, the rest of the game works.
- Trade choice changes the profile but does not yet change mission content.
- No real-time timers, multiplayer, budgets, or staff simulation yet.

## Suggested next iteration

Add trade-specific mission variants, grade written handoffs with the existing grading API, and introduce dispatch resource constraints.
