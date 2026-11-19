# FM Flight Career Mode v3 — homepage fix

This package fixes the issue where https://fmflight.vercel.app/ still opens the original game after Career Mode files are pushed.

## What changes

- `/` redirects to `/game`, the Career Mode dashboard.
- `/game` is the full v2 gameplay package (missions, campus, operations, XP, saves).
- The original homepage is preserved at `/training` by the installer.
- The Career Mode **Original training** links now point to `/training` instead of `/` (which would loop back to the game).

## Recommended installation (keeps the original training game)

1. Extract this ZIP anywhere outside your repository.
2. Open a terminal in the extracted folder.
3. Run: `node scripts/install.mjs /path/to/your/fmflight` (replace with your repository path). On Windows, use `node scripts/install.mjs "C:\\path\\to\\fmflight"`.
4. In your repository, run `npm install` and `npm run dev`.
5. Verify `/` redirects to `/game`, and `/training` still opens the original experience.
6. Commit and push the updated files to GitHub. Vercel will deploy if its Git integration is enabled.

## Manual installation

Before copying files, MOVE your existing `app/page.jsx` to `app/training/page.jsx` (create the training directory). Then merge the ZIP's `app/` and `lib/` directories into your repository. Do not overwrite your original training page without preserving it.

## Notes

This package does **not** deploy itself. GitHub and Vercel need to receive the changed files. Existing browser save data uses the same `fmflight-career-full-v2` key. AI features still require the existing `/api/ollama` route and provider environment configuration. The code was packaged and statically checked, but a full browser and Vercel build test was not available here.
