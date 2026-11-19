# FM Flight AI Detective v7 — visible wrong-answer feedback

This is a **complete replacement file** for `app/quest/page.jsx`, not a patch installer. It retains the original-work-order reference in Field Handoff and changes AI Detective so pressing **Check my findings** always displays a result, including when no claims were selected.

## Install (important)

1. Open your local `fmflight` repository.
2. Back up `app/quest/page.jsx`.
3. Copy this ZIP's `app/quest/page.jsx` over that exact path in the repository. Do not place the ZIP or an extra folder inside `app/quest`.
4. Check the installed file contains the text `WRONG SELECTION` and `MISSED MISTAKE`.
5. Run `npm run build`.
6. Commit and push **the actual changed file**:

```bash
git add app/quest/page.jsx
git commit -m "Show wrong-answer feedback in AI Detective"
git push origin main
```

7. Confirm Vercel deployed the latest commit and refresh `https://fmflight.vercel.app/quest` (Ctrl+Shift+R).

## Verify

Enter a mission, reach AI Detective, deliberately flag a supported claim, and click **Check my findings**. A prominent red `Not quite — check your selections` panel should appear with wrong-selection and missed-mistake counts. The claims show red `WRONG SELECTION` or `MISSED MISTAKE` messages. Adjust selections and try again.

If the live site does not show this, inspect `app/quest/page.jsx` on GitHub main and confirm it contains `WRONG SELECTION`. If it doesn't, the updated file was not pushed. If it does, verify Vercel is deploying the same repo/branch and that the latest deployment succeeded.

This package was source-checked and ZIP-verified; it has not been browser-playtested or deployed by the assistant. Replacing this file may overwrite unrelated edits made after the supplied source snapshot.
