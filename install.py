from pathlib import Path
import sys, shutil
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
page=root/'app/quest/page.jsx'; css=root/'app/quest/quest.css'
if not page.exists() or not css.exists(): sys.exit('ERROR: Provide the path to your fmflight repository (app/quest/page.jsx missing).')
s=page.read_text(); c=css.read_text()
if 'FMFLIGHT_FUN_V1' in s: sys.exit('Already installed. No changes made.')
checks=['function App(){','function start(m){','function evaluate(){','function submit(){',"{screen==='map'&&<>",'<div className="q-profile">','<div className="q-victory">']
missing=[x for x in checks if x not in s]
if missing: sys.exit('ERROR: Game source changed; no files modified. Missing: '+repr(missing))
helper='''// FMFLIGHT_FUN_V1 — optional quick-play training with deterministic, evidence-based feedback.
const DRILLS=[
 {id:'part',title:'The mystery part number',location:'Science Building · Room 214',report:'An AI recommends actuator part FM-RTU3-842, but the equipment photo has no readable model plate.',choices:['Order the part because the AI sounds confident.','Request the unit model and check the OEM parts reference.','Tell the vendor the AI has approved the replacement.'],answer:1,why:'Without verified model data and an OEM source, a specific part number is unsupported. AI can help prepare the vendor questions.'},
 {id:'trip',title:'The repeated trip',location:'West Wing · Room 118',report:'The lights went out twice, a portable heater was connected, and a ceiling tile is damp. AI suggests resetting the breaker.',choices:['Ask a qualified electrician to follow the approved procedure and document the hazard.','Reset it once to see whether the fault returns.','Ask AI which breaker to open.'],answer:0,why:'AI cannot authorize an electrical reset or hazardous work. The proper training response is to document facts and escalate to a qualified person.'},
 {id:'records',title:'Two room numbers',location:'Student Services · Room 104',report:'The work order says Room 104, but the asset register says Room 104A. AI silently picks 104A.',choices:['Change the ticket to 104A.','Use whichever room appears most often.','Flag the mismatch and ask dispatch to verify the location.'],answer:2,why:'Conflicting records must stay visible until an authorized person verifies the location. AI should compare, not decide.'},
 {id:'privacy',title:'The access-code leak',location:'Maintenance Shop · Bay 2',report:'A request includes a resident phone number and a door access code. AI only needs to draft a work checklist.',choices:['Remove unnecessary personal and access information before using AI.','Send the whole note so AI has maximum context.','Include the access code but remove the phone number.'],answer:0,why:'Data minimization matters. Do not include credentials or personal details that the task does not require.'},
 {id:'bas',title:'Command is not proof',location:'Science Building · Room 214',report:'BAS displays a 100% damper command. AI says that proves the damper is fully open.',choices:['Accept the BAS display as physical confirmation.','Label the physical position as unverified and plan an authorized field check.','Replace the actuator based on the command.'],answer:1,why:'A control command is not a physical measurement. The AI should separate observations, hypotheses, and verification steps.'}
];
'''
s=s.replace('function App(){',helper+'\nfunction App(){',1)
s=s.replace('function App(){','''function App(){
const [drillOpen,setDrillOpen]=useState(false),[drillPick,setDrillPick]=useState(null),[drillChecked,setDrillChecked]=useState(false),[drillIndex,setDrillIndex]=useState(0),[boltOpen,setBoltOpen]=useState(false);
''',1)
s=s.replace('function start(m){','function start(m){setDrillOpen(false);setDrillChecked(false);setDrillPick(null);',1)
s=s.replace("const trade=TRADES.find(t=>t.id===save.trade)","const trade=TRADES.find(t=>t.id===save.trade)",1)
# Daily drill available every day, reward only once per local date, saved alongside existing progress.
needle="const next=MISSIONS.find(m=>!save.completed[m.id]&&unlocked(m))||MISSIONS[0];"
if needle not in s: sys.exit('ERROR: Could not locate mission selection. No changes made.')
s=s.replace(needle,needle+'''
const drill=DRILLS[drillIndex%DRILLS.length];
const todayKey=new Date().toLocaleDateString('en-CA');
const drillClaimed=save.lastDrill===todayKey;
function beginDrill(){setDrillIndex((new Date().getDate()+new Date().getMonth()*31)%DRILLS.length);setDrillPick(null);setDrillChecked(false);setDrillOpen(true)}
function checkDrill(){if(drillPick===null)return;setDrillChecked(true);if(drillPick===drill.answer&&!drillClaimed){setSave(v=>({...v,xp:v.xp+60,lastDrill:todayKey}))}}
''',1)
# Insert UI ahead of campus grid
needle='<div className="q-section"><div><span className="q-kicker">THE CAMPUS</span>'
if needle not in s: sys.exit('ERROR: Campus section changed. No files modified.')
ui='''<section className="q-fun-drill" aria-label="Daily Dispatch Drill"><div className="q-fun-drill-head"><div><span className="q-kicker">⚡ QUICK PLAY · DISPATCH DRILL</span><h2>One call. One decision. Real AI judgment.</h2><p>Take a 60-second scenario between full missions. Correct calls earn 60 XP once per day.</p></div><button className="q-primary" onClick={beginDrill}>{drillClaimed?'Replay today’s drill':'Play daily drill →'}</button></div>{drillOpen&&<div className="q-fun-drill-body"><div className="q-fun-ticket"><strong>📻 {drill.title}</strong><span>📍 {drill.location}</span><p>{drill.report}</p></div><h3>What should the technician do with this AI output?</h3><div className="q-fun-answers">{drill.choices.map((choice,i)=><button key={i} disabled={drillChecked} className={'q-fun-answer '+(drillPick===i?'chosen ':'')+(drillChecked&&i===drill.answer?'right ':'')+(drillChecked&&drillPick===i&&i!==drill.answer?'wrong':'')} onClick={()=>setDrillPick(i)}>{String.fromCharCode(65+i)}. {choice}</button>)}</div>{drillChecked&&<div className={'q-fun-result '+(drillPick===drill.answer?'success':'retry')} role="status"><strong>{drillPick===drill.answer?'✓ Correct call!':'↻ Not quite — here is why'}</strong><p>{drill.why}</p>{drillPick===drill.answer?<p>{drillClaimed?'Daily reward already collected. Keep practicing!':'Great work. Your daily drill reward has been recorded.'}</p>:<button onClick={()=>{setDrillChecked(false);setDrillPick(null)}}>Try again →</button>}</div>}{!drillChecked&&<button className="q-primary" disabled={drillPick===null} onClick={checkDrill}>Check my decision →</button>}<button className="q-quiet" onClick={()=>setDrillOpen(false)}>Close drill</button></div>}</section>
'''
s=s.replace(needle,ui+needle,1)
# BOLT floating panel for useful contextual encouragement, no answer reveal
needle='<footer className="q-footer">FM Flight'
if needle not in s: sys.exit('ERROR: Footer changed. No files modified.')
bolt='''<div className="q-bolt-widget"><button className="q-bolt-toggle" aria-expanded={boltOpen} onClick={()=>setBoltOpen(v=>!v)}>🤖 BOLT {boltOpen?'−':'+'}</button>{boltOpen&&<div className="q-bolt-chat" role="status"><strong>🤖 BOLT · Field buddy</strong><p>{screen==='map'?'Dispatch is busy! Try a quick drill or pick a building. Every good AI decision starts with the actual job.':stage===0?'Check the ticket, the source record, and the safety note. A rumor is not evidence.':stage===1?'Give me useful evidence and tell me what not to assume. A short checklist beats a confident guess.':stage===2?'Look for invented facts, certainty without measurements, and actions AI cannot authorize. I will not give away the answers.':result?'Nice work! What could you verify better on a replay?':'Keep the original work order visible. Tell the next crew what is known, what is unknown, and who owns the decision.'}</p><button onClick={()=>setBoltOpen(false)}>Got it ✓</button></div>}</div>
'''
s=s.replace(needle,bolt+needle,1)
# Victory presentation only
s=s.replace('<div className="q-victory"><div className="q-stars">','<div className="q-victory q-fun-victory"><div className="q-fun-burst" aria-hidden="true">✦ ✧ ✦</div><div className="q-stars">',1)
s=s.replace('<h2>Mission complete!</h2>','<h2>MISSION CLEARED!</h2><div className="q-fun-rank">{result.stars===3?"🏆 MASTERFUL FIELD WORK":result.stars===2?"⭐ STRONG TECHNICIAN": "🔧 MISSION FINISHED"}</div>',1)
css_add='''
/* FMFLIGHT_FUN_V1: Dispatch Drill, BOLT, and mission celebrations */
.q-fun-drill{margin:22px 0;padding:22px;border:1px solid #347b83;border-radius:18px;background:linear-gradient(120deg,#173d4d,#102b3d)}
.q-fun-drill-head{display:flex;justify-content:space-between;align-items:center;gap:20px}.q-fun-drill h2{margin:6px 0}.q-fun-drill p{color:#c3d9e4;margin:6px 0}.q-fun-drill-body{margin-top:18px;padding-top:18px;border-top:1px solid #376376;display:grid;gap:12px}.q-fun-ticket{display:grid;gap:6px;background:#0b2030;border:1px solid #496a7b;border-radius:12px;padding:18px}.q-fun-ticket strong{color:#fff;font-size:1.15rem}.q-fun-ticket span{color:#8ce6cb}.q-fun-answers{display:grid;gap:9px}.q-fun-answer{color:#eaf5fc;text-align:left;padding:13px 16px;background:#1a394d;border:1px solid #3b6072;border-radius:10px}.q-fun-answer.chosen{border-color:#f1c878;background:#3a3d45}.q-fun-answer.right{border-color:#68e1a6;background:#1b4c42}.q-fun-answer.wrong{border-color:#ff8f87;background:#542d38}.q-fun-result{border-radius:10px;padding:16px}.q-fun-result.success{background:#174c3c;border:1px solid #53d2a0}.q-fun-result.retry{background:#4d302b;border:1px solid #d58c78}.q-fun-result button,.q-bolt-chat button{background:#77e2c1;color:#092b2a;border:0;border-radius:7px;padding:8px 12px;font-weight:800}.q-bolt-widget{position:fixed;right:22px;bottom:20px;z-index:90;display:flex;flex-direction:column;align-items:flex-end;gap:8px}.q-bolt-toggle{border:1px solid #7de4c5;background:#133b44;color:#e7fff8;padding:12px 18px;border-radius:999px;font-weight:900;box-shadow:0 5px 20px #0007}.q-bolt-chat{max-width:min(340px,calc(100vw - 44px));padding:18px;border-radius:16px;background:#17364b;color:#e9f7fa;border:1px solid #66c6b5;box-shadow:0 12px 30px #0008}.q-bolt-chat p{margin:10px 0;color:#c4e0e9}.q-fun-victory{position:relative;overflow:hidden;border:1px solid #d6b66c;border-radius:15px;padding:24px 12px;background:radial-gradient(circle at top,#3a4939,#132a38 72%);animation:q-fun-rise .45s ease-out}.q-fun-burst{text-align:center;color:#ffdb75;font-size:2.4rem;letter-spacing:14px;animation:q-fun-glow 1.4s ease-in-out 2}.q-fun-rank{text-align:center;color:#ffdd8b;font-weight:900;letter-spacing:.06em;margin:10px 0}@keyframes q-fun-rise{from{transform:translateY(10px);opacity:.5}to{transform:translateY(0);opacity:1}}@keyframes q-fun-glow{50%{transform:scale(1.12);filter:brightness(1.5)}}@media(max-width:720px){.q-fun-drill-head{flex-direction:column;align-items:flex-start}.q-bolt-widget{right:12px;bottom:12px}}@media(prefers-reduced-motion:reduce){.q-fun-victory,.q-fun-burst{animation:none}}
'''
shutil.copy2(page,page.with_suffix('.jsx.bak-fun-v1'));shutil.copy2(css,css.with_suffix('.css.bak-fun-v1'))
page.write_text(s);css.write_text(c+'\n'+css_add)
print('Installed FMFLIGHT_FUN_V1 into',root)
print('Changed:',page.relative_to(root),css.relative_to(root))
print('Backups: *.bak-fun-v1')
