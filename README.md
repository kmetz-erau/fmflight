# FM Flight v5 — Original training restored + Home button

This patch fixes the broken **Original training** link in v4 and adds an explicit **Home** button to the AI Academy and the original training page. The Academy remains at `/game`, the homepage redirects to `/game`, and the original FM Journey is restored at `/training`.

## Installation (important)

The original training page is ~49 KB and was accidentally omitted from the v4 package. To restore the exact original rather than replacing it with a simplified copy, this installer reads its original Git blob from your existing repository history.

1. Extract this ZIP **outside** your local `fmflight` repository.
2. Open a terminal in the extracted folder.
3. Run `node scripts/install.mjs /path/to/your/fmflight` (Windows example: `node scripts/install.mjs C:\Users\you\projects\fmflight`).
4. In your `fmflight` directory, run `npm run build`.
5. Commit and push the changes to GitHub. Vercel will redeploy if connected.

**Do not simply copy the files:** The installer creates `app/training/page.jsx` from the original Git history; copying the package alone will leave `/training` broken. The installer aborts before changing files if it cannot locate the original page.

## Verify

- `/` redirects to `/game`.
- `/game` opens the AI Academy; its Home button returns to the Academy dashboard without losing saved XP.
- `/training` opens the original seven-stop FM Journey; its Home button returns to `/game`.
- Both experiences still use the existing `/api/ollama` endpoint.

The package does not overwrite your AI API, credentials, or Next.js config.
