# FM Flight — Activate Practical AI Skills

The files were uploaded to GitHub previously, but `app/quest/page.jsx` never rendered them. This package connects the hands-on practice component and saved prompt toolbox to the **active** route. It does not replace your work orders, Detective, Field Handoff, or original training.

## Install

1. Extract this ZIP on your computer.
2. Open a terminal in the extracted `fmflight-activation` directory.
3. Run `python scripts/install.py /path/to/your/fmflight` (Windows: `py scripts/install.py C:\\path\\to\\fmflight`). The target must be your **local Git repository**, not the ZIP folder.
4. In the fmflight repository, run `npm run build`.
5. Commit and push: `git add app/quest/page.jsx app/quest/PracticeConsole.jsx app/quest/practice.css && git commit -m "Activate practical AI workbench" && git push origin main`.
6. Wait for Vercel deployment, then open `/quest` and enter a mission's **AI Workbench**. You should see **Make the AI useful**. Return to campus to see **Saved AI prompts**.

## Confirm before deploying

Open `app/quest/page.jsx` and verify that it contains `import PracticeConsole`, `<PracticeConsole`, and `<PromptToolbox`. Merely uploading the two new component files does **not** activate them.

The installer makes backups in `.fmflight-backups` and is safe to rerun without duplicating UI components. If your page layout has changed unexpectedly, it stops instead of guessing.

## Limitations

Live AI requests depend on your existing `/api/ollama` configuration. Scripted practice is also available. This patch is tested for source activation, not end-to-end Vercel operation.
