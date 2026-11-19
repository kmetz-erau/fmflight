# Restore the actual original FM Journey

The earlier v6 package inadvertently installed a simplified 5 KB fallback. This package restores the **full historical ~49 KB original** from the Git repository, rather than supplying a substitute.

## Install

1. Extract this ZIP.
2. Open a terminal in your **local `fmflight` Git clone** (with its full Git history).
3. Run `node /path/to/extracted/scripts/restore-original.mjs .` (replace the script path with its real location).
4. Run `npm run build`.
5. Run `git add app/training/page.jsx app/training/layout.jsx && git commit -m "Restore full original FM Journey" && git push origin main`.
6. Wait for Vercel to deploy and visit `https://fmflight.vercel.app/training`.

The installer backs up the current training page to `app/training/page.jsx.pre-restore-backup` (not committed). It restores the full original `app/page.jsx` from Git object `dba7789ef0bba638fc8c4f3a7a89ba2d98f3ec9a`, originally committed before the game redesign. It also adds a Home / Choose trade link back to `/game?chooseTrade=1`.

It **does not change** `app/page.jsx`, `app/game`, `lib`, or your API routes. If the historical source cannot be found, it stops with an error rather than silently substituting a simplified page.

## Note

This ZIP contains a restoration script, not the original page itself. A full local Git clone is required. If you have only downloaded GitHub ZIP snapshots, clone the repository with Git first.
