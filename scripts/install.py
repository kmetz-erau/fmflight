#!/usr/bin/env python3
"""Install the practical AI loop without replacing existing Quest or work-order files."""
from pathlib import Path
import sys,shutil
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
source=Path(__file__).resolve().parents[1]
page=root/'app/quest/page.jsx'
if not page.is_file():sys.exit('ERROR: app/quest/page.jsx not found. Pass your fmflight repository path.')
s=page.read_text(encoding='utf-8')
if 'FMFLIGHT_PRACTICAL_AI_V1' in s:sys.exit('Already installed; no changes made.')
checks=["import './quest.css';", "{screen==='map'&&<>", "{stage===1&&", '<aside className="q-panel q-inspector">', 'const prompt=']
missing=[x for x in checks if x not in s]
if missing:sys.exit('ERROR: Unexpected Quest source; no files changed. Missing: '+str(missing))
# Avoid touching the AI Detective or Field Handoff; the new workbench is additive.
s=s.replace("import './quest.css';", "import './quest.css';\nimport PracticeConsole,{PromptToolbox} from './PracticeConsole'; // FMFLIGHT_PRACTICAL_AI_V1",1)
needle="{screen==='map'&&<>"
s=s.replace(needle,needle+'<PromptToolbox/>',1)
needle='{stage===1&&<div className="q-stage-layout"><div className="q-panel">'
if needle not in s:sys.exit('ERROR: Workbench layout changed; no files modified.')
s=s.replace(needle,'{stage===1&&<><PracticeConsole mission={mission} trade={trade} clues={clues} selectedEvidence={selectedEvidence} assembledPrompt={prompt}/><div className="q-stage-layout"><div className="q-panel">',1)
# Close the fragment at the end of stage 1, before the independent dispatch overlay.
needle='{dispatchEvent&&stage===1&&'
if needle not in s:sys.exit('ERROR: Dispatch overlay missing; no files modified.')
position=s.index(needle)
left=s[:position]
if not left.rstrip().endswith('</div>}'):sys.exit('ERROR: Unexpected end of workbench stage; no files modified.')
idx=left.rfind('</div>}')
s=left[:idx]+'</div></>}'+left[idx+len('</div>}'):]+s[position:]
for name in ['PracticeConsole.jsx','practice.css']:
 target=root/'app/quest'/name
 if target.exists():sys.exit('ERROR: '+name+' already exists; refusing to overwrite.')
backup=root/'.fmflight-backups';backup.mkdir(exist_ok=True)
shutil.copy2(page,backup/'quest-page-before-practical-ai.jsx')
page.write_text(s,encoding='utf-8')
for name in ['PracticeConsole.jsx','practice.css']:shutil.copy2(source/'app/quest'/name,root/'app/quest'/name)
print('Installed practical AI coaching, live AI retry, and saved prompt toolbox.')
print('Changed: app/quest/page.jsx; added app/quest/PracticeConsole.jsx and app/quest/practice.css')
print('Backup: .fmflight-backups/quest-page-before-practical-ai.jsx')
