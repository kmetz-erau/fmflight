# FM Flight AI Detective — wrong-answer feedback v6

The live GitHub page was checked: its `evaluate()` function returned silently for incorrect choices. This fixes that behavior.

## Preferred installation (preserves your existing changes)

From the extracted ZIP folder, run:

```bash
node scripts/install.mjs /path/to/your/fmflight
```

The installer edits only `app/quest/page.jsx` and creates `app/quest/page.jsx.before-detective-v6.bak`. It expects the unpatched Detective logic found in the repository on Nov 19, 2026; it stops without editing if the expected code has changed. If it detects the older feedback patch, do not use the replacement blindly; reconcile changes manually.

## Alternative

`replacement/app/quest/page.jsx` is a complete, patched version based on the inspected game page. Copy it to `app/quest/page.jsx` only if you prefer replacing the whole page; doing so can overwrite later edits.

## Behavior

After selecting claims, press **Check my findings**. If incorrect, the scorecard shows a red Detective Review message, counts missed problems and false positives, and annotates mistaken selections. Players can correct selections and retry. Successful checks show explanations and unlock Field Handoff. No changes to other game routes or training.

## Deploy

Run `npm run build`, commit and push the modified `app/quest/page.jsx`, and wait for Vercel deployment. Hard refresh `/quest` after deployment.

This package was tested by applying its installer to a local copy of the inspected source. It has not been browser-playtested or deployed.
