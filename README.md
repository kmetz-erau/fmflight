# FM Flight AI Quest - Gameplay Expansion

This is a drop-in update for the **existing AI Quest** at `/quest`, not a replacement for the Original FM Journey or AI Academy.

## New gameplay
- **Live dispatch interruption** after the AI Workbench: an incoming report conflicts with the original work order. Players must preserve the uncertainty and choose how to update their AI workflow. Wrong decisions show immediate explanations and allow retry.
- **Boss missions** every fourth mission (4, 8, 12), with two additional AI claims to investigate.
- **BOLT companion**: optional contextual Detective hint. Hints reduce the maximum star reward but never block progression.
- **Updated rewards**: a three-star finish requires a good dispatch decision and no Detective hints, plus the existing quality requirements.
- **Preserved**: wrong-answer Detective feedback, original work-order display at Field Handoff, trade selection, save data, existing AI endpoint, XP and mission unlocks.

## Install
1. Extract this ZIP.
2. Copy `app/quest/page.jsx` and `app/quest/quest.css` into your existing `fmflight` repository, replacing those two files. **Do not replace your other pages or `lib` folder.**
3. Run `npm run build` inside your repository.
4. Commit and push the two changed files, then wait for Vercel deployment.
5. Open `https://fmflight.vercel.app/quest` and hard-refresh.

## Test checklist
- Start a mission, gather three or four relevant clues, equip a prompt, and run the AI.
- Confirm a dispatch interruption appears before Detective.
- Choose a wrong option and confirm feedback + retry; choose the option preserving both reports to proceed.
- On mission 4, 8, or 12, confirm seven AI claims rather than five.
- In Detective, flag a supported claim and check findings: the existing red wrong-answer feedback must still appear.
- Ask BOLT for a hint, finish the mission, and confirm the star result.
- In Field Handoff, confirm the original work order is visible.

## Notes
- This is an educational simulation, not an authorization for physical maintenance work.
- This update preserves localStorage key `fmflight-ai-quest-v1`, so progress should remain.
- JSX syntax and TypeScript transpilation were checked. A full Next.js build and live browser playtest were not possible in this environment.
