# FM Flight — Work Orders v2

This fixes **both** the ticket content and its display in AI Quest. Every one of the 12 missions now generates a structured, trade-specific ticket containing a work order number, priority, report time, requester, exact building/room or outdoor location, asset, site contact, reported condition, dispatch notes, deadline, and AI support request. All details are fictional training examples.

## Install

Extract the ZIP, then from its extracted directory run:

```bash
node scripts/install.mjs /path/to/your/fmflight
```

Replace `/path/to/your/fmflight` with the path to your local Git repository. The installer backs up the two existing files to `.fmflight-backups/`, replaces `lib/academy-data.js`, and **appends** ticket styling to `app/quest/quest.css` (it does not replace the rest of the CSS or your game page).

Then in your FM Flight repo:

```bash
npm run build
git add lib/academy-data.js app/quest/quest.css
git commit -m "Show realistic trade-specific dispatch work orders"
git push origin main
```

Check the deployed `/quest` page, choose a trade, open mission 1, and verify the ticket starts with `WORK ORDER WO-02601` and shows a specific room/location. The Field Handoff should show the same ticket. Check GitHub for `FMFLIGHT_REALISTIC_WORKORDERS_V1` and `FMFLIGHT_WORKORDER_DISPLAY_V2` if you still see the old content.

**Note:** Do not just upload the ZIP to Vercel; these source changes must be committed and deployed. This release has not been browser-tested on your production deployment.
