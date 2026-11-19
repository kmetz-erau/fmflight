# FM Flight v6 — Training Route + Home / Choose Trade Fix

## Changes

- Includes **`app/training/page.jsx`** so `/training` is no longer a missing Next.js route.
- The installer attempts to restore the **exact historical FM Journey** from your local Git history. If the original commit is unavailable, a functional seven-stop training fallback is included instead.
- **Home / Choose trade** in AI Academy returns to the trade picker without deleting XP, mission history, or achievements.
- **Home / Choose trade** in original training links to `/game?chooseTrade=1`, which opens the trade picker.
- The homepage `/` still redirects to `/game`.

## Installation (recommended)

From a local clone of `kmetz-erau/fmflight`:

```bash
node /path/to/extracted/fmflight-ai-academy-v6/scripts/install.mjs /path/to/fmflight
cd /path/to/fmflight
npm install
npm run build
git add app lib
git commit -m "Restore training route and return home to trade selection"
git push origin main
```

Alternatively copy the included `app/` and `lib/` directories into your repository, preserving other files. This manual option installs the fallback training page; the installer is recommended for restoring the exact original from Git history.

## Verify

- `/` redirects to `/game`.
- `/game` shows trade selection for a new player.
- Choose a trade, then click **Home / Choose trade**: trade selection should reappear.
- `/training` loads a training page (no 404).
- Click **Home / Choose trade** in training: trade selection should reappear.
- Return to a previously played trade: XP and completed missions should remain saved.

Note: No live Vercel deployment or browser integration test was performed here.
