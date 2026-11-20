#!/usr/bin/env python3
"""Activate the practical AI UI in the actual Next.js Quest route."""
from pathlib import Path
import sys, shutil, datetime

repo = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv)>1 else Path.cwd()
package = Path(__file__).resolve().parents[1]
page = repo / 'app/quest/page.jsx'
if not page.is_file():
    sys.exit('ERROR: app/quest/page.jsx missing. Pass the path to your fmflight repo.')
s = page.read_text(encoding='utf-8')
required = ["import './quest.css';", "{screen==='map'&&<>", "{stage===1&&<div className=\"q-stage-layout\"", "{dispatchEvent&&stage===1&&"]
if not ('<PracticeConsole' in s and '<PromptToolbox' in s):
    missing = [x for x in required if x not in s]
    if missing: sys.exit('ERROR: Unsupported Quest page; unchanged. Missing: ' + repr(missing))
    s = s.replace("import './quest.css';", "import './quest.css';\nimport PracticeConsole, { PromptToolbox } from './PracticeConsole'; // FMFLIGHT_PRACTICE_ACTIVE", 1)
    s = s.replace("{screen==='map'&&<>", "{screen==='map'&&<><PromptToolbox/>", 1)
    needle = '{stage===1&&<div className="q-stage-layout"'
    s = s.replace(needle, '{stage===1&&<><PracticeConsole mission={mission} trade={trade} clues={clues} selectedEvidence={selectedEvidence} assembledPrompt={prompt}/><div className="q-stage-layout"', 1)
    pos = s.index('{dispatchEvent&&stage===1&&')
    before = s[:pos]
    close = before.rfind('</div>}')
    if close < 0 or len(before)-close > 100:
        sys.exit('ERROR: Could not locate Workbench closing tag; unchanged.')
    s = before[:close] + '</div></>}' + before[close+len('</div>}'):] + s[pos:]
else:
    if "from './PracticeConsole'" not in s:
        s = s.replace("import './quest.css';", "import './quest.css';\nimport PracticeConsole, { PromptToolbox } from './PracticeConsole'; // FMFLIGHT_PRACTICE_ACTIVE", 1)
backup = repo / '.fmflight-backups'
backup.mkdir(exist_ok=True)
stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
for file in [page,repo/'app/quest/PracticeConsole.jsx',repo/'app/quest/practice.css']:
    if file.exists(): shutil.copy2(file,backup/(file.name+'.'+stamp+'.bak'))
page.write_text(s,encoding='utf-8')
for name in ['PracticeConsole.jsx','practice.css']:
    shutil.copy2(package/'app/quest'/name,repo/'app/quest'/name)
assert '<PracticeConsole' in page.read_text() and '<PromptToolbox' in page.read_text()
print('SUCCESS: Practical AI practice is connected to the live app/quest/page.jsx route.')
print('Updated: app/quest/page.jsx, app/quest/PracticeConsole.jsx, app/quest/practice.css')
print('Backups:',backup)
