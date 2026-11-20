# FM Flight — Fun Upgrade v1

This **patches the existing game** rather than replacing it. It preserves the realistic work orders, Evidence Hunt, AI Workbench, AI Detective feedback, Field Handoff, original training, and save data.

## Features

- **Daily Dispatch Drill**: five rotating, trade-relevant mini-scenarios; one daily +60 XP award, repeatable for practice, immediate explanations and retries. The daily date is based on the player's browser local date. This is intentionally an optional mode.
- **BOLT field buddy**: contextual hints on the campus and each mission stage; doesn't reveal Detective answers.
- **Mission-clear celebration**: stronger star/rank presentation and motion with reduced-motion support.

## Install

Run from a local copy of this package:

```bash
python3 scripts/install.py /path/to/fmflight
cd /path/to/fmflight
npm install
npm run build
```

If the build passes, commit **both** `app/quest/page.jsx` and `app/quest/quest.css`, then push to your deployment branch. Do not commit the `*.bak-fun-v1` backup files. The installer refuses to run twice and fails without changing files if it cannot find expected source sections.

The patch does **not** overwrite the academy data file, so the realistic tickets remain in place. It does **not** update the live Vercel site automatically.

## Verify

1. Open `/quest`, select a trade, and look for **QUICK PLAY · DISPATCH DRILL** above the campus map.
2. Select a wrong answer and click **Check my decision**; confirm an explanation and retry button.
3. Complete a drill correctly; confirm 60 XP awarded only once that day.
4. Open BOLT on the campus and inside a mission; check the contextual message.
5. Complete an existing mission and check the new **MISSION CLEARED!** screen.
6. Check that Detective wrong-answer feedback and Field Handoff still work.

**Status:** Installer is syntax-checked and tested against source fixtures; a full browser test and Vercel deployment are still required.
