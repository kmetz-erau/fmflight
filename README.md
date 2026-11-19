# FM Flight AI Quest - Field Handoff work order visibility fix

The live GitHub source already contains a reference to the original work order in the left column. This update also pins a highly visible, always-expanded dispatch card in the right-hand Field Handoff sidebar, immediately above Mission Debrief. It shows the original scenario, mission title, location, trade, deliverable, and expandable collected evidence.

## Install

Extract this ZIP. From the extracted folder, run:

```bash
node scripts/install.mjs /path/to/your/fmflight
```

Or run `node /path/to/extracted/scripts/install.mjs .` from your local FM Flight repository root.

Then run `npm run build`, review the Field Handoff stage, and commit/push `app/quest/page.jsx` to GitHub. Vercel must deploy the new commit before the live site changes.

The installer modifies only `app/quest/page.jsx`, backs it up to `app/quest/page.jsx.before-handoff-fix.bak`, and is safe to run again. It does not modify the original training page or AI Academy. Do not commit the `.bak` file.
