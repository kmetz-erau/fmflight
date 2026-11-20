# FM Flight — Practical AI Skills Upgrade (v1)

This adds **hands-on AI practice** inside the existing AI Quest Workbench without replacing the working game.

## What's new

- **Real AI practice is the default:** Players write their own prompt and send it to the existing `/api/ollama` route. If the provider fails, the error is shown; a clearly labeled **Scripted practice** mode remains available.
- **Improve and retry:** Players can revise prompts and rerun them, review the last answer, and compare earlier attempts.
- **BOLT's contextual coaching:** Five practical checks (job context, task, format, uncertainty, human verification), with specific hints. This is a heuristic coaching checklist, not an AI quality or safety certification.
- **Personal prompt toolbox:** Save and copy reusable prompts. Stored in the same browser via `localStorage`; no account sync.
- **Preserves:** Realistic work orders, dispatch events, Detective feedback, Field Handoff, existing XP, trade selection, `/training`, and `/game`.

## Install

Extract the ZIP. In a terminal run:

```bash
python3 scripts/install.py /path/to/your/fmflight
```

Or, from the extracted folder, run `python3 scripts/install.py` if the current directory is the repository root.

The installer adds `app/quest/PracticeConsole.jsx`, `app/quest/practice.css` and patches **only** `app/quest/page.jsx` to show the practice workbench and toolbox. It backs up the old page to `.fmflight-backups/quest-page-before-practical-ai.jsx` and refuses to overwrite existing practice files or an unknown source layout. It does not modify `lib/academy-data.js`, `app/training`, or your API routes.

Then run:

```bash
npm install
npm run build
git add app/quest/page.jsx app/quest/PracticeConsole.jsx app/quest/practice.css
git commit -m "Add practical AI coaching and prompt toolbox"
git push origin main
```

Wait for Vercel deployment. Open `https://fmflight.vercel.app/quest`, select a trade, enter a mission, collect evidence, and enter the AI Workbench.

## Smoke test

1. In Workbench, open **Make the AI useful**, load your workbench setup, edit it, and confirm BOLT's coaching changes.
2. Run a prompt in **Live FM AI Tool** mode. The configured AI provider must be reachable for a live response.
3. If it is unavailable, confirm the error appears; switch to **Scripted practice (offline)** and verify the response is labeled scripted.
4. Improve the prompt, rerun, and expand **Compare earlier attempts**.
5. Save a reusable prompt; return to the campus and check **Saved AI prompts**. Copy it.
6. Finish AI Detective and Field Handoff; ensure original gameplay and progress are unaffected.

## Important

This is an additive learning upgrade. The existing mission progression remains available even if the live AI provider is offline. Prompts and AI responses are educational drafts and must be verified by qualified people against approved procedures before real-world use. Avoid entering personal, access, or security-sensitive information.

**Verification performed:** Python installer syntax and JSX parse checks on a local copy of the inspected game page. A complete Next.js build, live AI integration, and browser playtest were not performed.
