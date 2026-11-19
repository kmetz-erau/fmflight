import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const repo=resolve(process.argv[2]||'.');
const file=join(repo,'app/quest/page.jsx');
if(!existsSync(file)){console.error('Cannot find app/quest/page.jsx. Pass your fmflight repository path.');process.exit(1)}
let s=readFileSync(file,'utf8');
if(s.includes('detectiveChecked') && s.includes('DETECTIVE REVIEW:')){console.log('Detective review already installed.');process.exit(0)}
if(s.includes('detectiveChecked')){console.error('Older feedback patch detected. Restore the unmodified page before applying this installer, or use the full replacement file in this ZIP.');process.exit(1)}
const replacements=[
["[marked,setMarked]=useState([]),[feedback,setFeedback]=useState(false)","[marked,setMarked]=useState([]),[feedback,setFeedback]=useState(false),[detectiveAttempts,setDetectiveAttempts]=useState(0),[detectiveChecked,setDetectiveChecked]=useState(false)"],
["setMarked([]);setFeedback(false);setHandoff('');", "setMarked([]);setFeedback(false);setDetectiveAttempts(0);setDetectiveChecked(false);setHandoff('');"],
["function evaluate(){if(!correctBad||falseMarks)return;setFeedback(true)}", "function evaluate(){setDetectiveAttempts(n=>n+1);setDetectiveChecked(true);if(correctBad&&!falseMarks)setFeedback(true)}"],
["if(!feedback)setMarked(s=>s.includes(c.id)?s.filter(x=>x!==c.id):[...s,c.id])", "if(!feedback){setDetectiveChecked(false);setMarked(s=>s.includes(c.id)?s.filter(x=>x!==c.id):[...s,c.id])}"],
["{feedback&&<em className={c.bad?'bad':'good'}>{c.bad?'⚠ Unsupported: ':'✓ Grounded: '}{c.why}</em>}", "{(feedback||(detectiveChecked&&marked.includes(c.id)))&&<em className={c.bad?'bad':'good'}>{c.bad?'⚠ Unsupported: ':'✓ Grounded: '}{c.why}</em>}{detectiveChecked&&!feedback&&!marked.includes(c.id)&&c.bad&&<em className=\"bad\">⚠ You missed a questionable claim. Look for unsupported certainty or authority.</em>}{detectiveChecked&&!feedback&&marked.includes(c.id)&&!c.bad&&<em className=\"bad\">✕ This claim is supported. Unflag it to avoid a false positive.</em>}"],
["{marked.length} claims flagged", "{marked.length} claims flagged · {detectiveAttempts} checks"],
["{marked.length>0&&(!correctBad||falseMarks)&&<small className=\"q-muted\">Select all unsupported claims, but avoid flagging grounded ones. Try again.</small>}", "{detectiveChecked&&!feedback&&<div className=\"q-detective-feedback\" role=\"status\"><strong>DETECTIVE REVIEW: Some answers need another look.</strong><p>{claims.filter(c=>c.bad&&!marked.includes(c.id)).length} problematic claim(s) missed · {claims.filter(c=>!c.bad&&marked.includes(c.id)).length} supported claim(s) flagged by mistake.</p><p>Red cards explain incorrect selections and missed mistakes. Correctly supported claims should stay unflagged. Change your choices and press Check my findings again.</p><button className=\"q-quiet\" onClick={()=>setDetectiveChecked(false)}>Revise my selections ↻</button></div>}"],
["setFeedback(false);setMarked([])","setFeedback(false);setMarked([]);setDetectiveChecked(false)"]
];
for(const [a,b] of replacements){if(!s.includes(a)){console.error('Expected code not found; no changes made: '+a.slice(0,110));process.exit(1)}s=s.replace(a,b)}
writeFileSync(file+'.before-detective-v6.bak',readFileSync(file,'utf8'));
writeFileSync(file,s);
console.log('Updated AI Detective feedback in '+file);
