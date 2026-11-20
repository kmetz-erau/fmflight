# FM Flight: realistic work orders

This update improves all 12 AI Quest dispatch tickets across the five trade pathways. Each ticket now shows a unique work order number, priority, reported time, requester, specific building/room or outdoor location, asset, site contact, realistic reported condition, dispatch notes, response window, and the AI-assisted task. All locations and contacts are fictional training examples.

## Install

1. Extract the ZIP.
2. From inside the extracted folder, run `node install.mjs /path/to/fmflight` (replace the path with your local repository path).
3. In your FM Flight repository, run `npm run build`.
4. Commit **only** the updated `lib/academy-data.js` file and push it to GitHub. Vercel should deploy the change.

The installer backs up the existing data file and can be run again safely. It doesn't replace any pages, mission logic, AI Detective feedback, or handoff UI. The revised dispatch ticket flows into Evidence Hunt, AI Workbench, and Field Handoff because they already use `mission.brief(trade)`.

If a field note was previously identical to the full ticket, it now starts with a concise work-order observation, making the evidence board more believable.
