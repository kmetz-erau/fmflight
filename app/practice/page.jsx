'use client';
import {useEffect,useMemo,useState} from 'react';
import {TRADES,MISSIONS} from '../../lib/academy-data';
import './practice.css';

const KEY='fmflight-practical-simulator-v1';
const MODES=[{id:'guided',name:'Guided Practice',description:'Targeted coaching as you work.'},{id:'challenge',name:'Job Challenge',description:'Work independently, then review feedback.'},{id:'assessment',name:'Independent Assessment',description:'No hints until submission.'}];
const JOBS=[
 {id:'history',title:'Find recurring maintenance issues',mission:7,task:'Use AI to identify recurring themes in the maintenance history and produce a brief for the next shift.',records:['2026-09-03 · Occupant reported intermittent discomfort; no field cause documented.','2026-09-19 · Technician recorded an intermittent complaint; no verified repair noted.','2026-10-11 · Similar complaint received. BAS trend attachment not included.','2026-11-07 · Occupant called again; equipment identification needs confirmation.'],deliverable:'A concise pattern summary with source references, missing evidence, and follow-up questions.'},
 {id:'vendor',title:'Prepare a vendor clarification',mission:2,task:'Use AI to prepare a vendor email that asks for the information needed before identifying a replacement part.',records:['Vendor message: A replacement component may be required; no exact model or serial number was supplied.','Equipment photo: Nameplate unreadable.','Purchasing note: No OEM-approved part number has been verified.'],deliverable:'A vendor clarification request with no invented part numbers or authorization.'},
 {id:'compare',title:'Resolve a document discrepancy',mission:3,task:'Use AI to compare the work order and asset record without assuming either source is correct.',records:['Work order: Asset located in the main building room listed on dispatch ticket.','Asset register: Similar equipment listed in the annex location.','Site directory: Room label has not been confirmed by dispatch.'],deliverable:'A source-labeled discrepancy summary and verification plan.'},
 {id:'handoff',title:'Build a crew-ready handoff',mission:7,task:'Use AI to organize incomplete shift notes into a concise, reliable handoff.',records:['Dispatch note: Reported issue remains open.','Shift log: No completed repair or final diagnosis documented.','Supervisor note: Next shift must check approved procedures and confirm outstanding details.'],deliverable:'A practical handoff separating reported facts, unknowns, next checks, and responsible reviewer.'}
];
const signals=[
 ['Context',/room|building|asset|unit|equipment|work order|location|rtu|panel|pump|door/i,'Include the asset, location, and reported condition.'],
 ['Task',/prepare|create|write|draft|organize|compare|summarize|identify|list/i,'Tell AI exactly what to produce.'],
 ['Source grounding',/record|source|note|provided|only|reported|evidence|cite/i,'Tell AI to rely on the supplied records.'],
 ['Format',/checklist|bullet|brief|table|sections|email|list/i,'Specify a usable output format.'],
 ['Verification',/verify|unknown|missing|unconfirmed|qualified|review|do not|don't|supervisor/i,'Name uncertainty and human verification.']
];
function evaluate(text,records){
 const t=text.trim(),lower=t.toLowerCase();
 const checks=[
  ['Reported facts',/(reported|record|note|source|observ)/i.test(t)],
  ['Missing information',/(unknown|missing|unconfirmed|not verified|uncertain)/i.test(t)],
  ['Verification plan',/(verify|confirm|check|approved|manual|source)/i.test(t)],
  ['Human ownership',/(qualified|supervisor|technician|reviewer|dispatch|owner)/i.test(t)],
  ['Useful work product',/(handoff|brief|checklist|summary|questions|email|comparison|next step)/i.test(t)]
 ];
 const unsafe=/(ai (has|can|will) (authorized|authorize|approved)|bypass (the )?(procedure|safety)|ignore (the )?hazard|repair (is|was) completed)/i.test(t);
 const score=Math.max(0,checks.filter(x=>x[1]).length*20-(unsafe?40:0));
 return {score,checks,unsafe,notes:[...checks.filter(x=>!x[1]).map(x=>'Add: '+x[0].toLowerCase()+'.'),...(unsafe?['Remove any claim that AI authorized work or that an unverified repair is complete.']:[])],disclaimer:'Automated checks identify writing signals only. They do not establish technical correctness or authorize work.'};
}
const starter=(job,trade,work)=>'For a qualified '+trade.name+' technician, use only these provided work-order records to '+job.task.toLowerCase()+'\n\n'+work+'\n\n'+job.records.map(x=>'- '+x).join('\n')+'\n\nSeparate reported facts from unknowns. Cite source notes, identify missing information, and assign qualified review. Do not invent measurements, diagnoses, part numbers, or authorizations. Output: '+job.deliverable;
export default function PracticalSimulator(){
 const [tradeId,setTradeId]=useState(''),[mode,setMode]=useState('guided'),[jobId,setJobId]=useState('history'),[prompt,setPrompt]=useState(''),[reply,setReply]=useState(''),[result,setResult]=useState(''),[runs,setRuns]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[review,setReview]=useState(null),[toolbox,setToolbox]=useState([]),[loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(Array.isArray(v.toolbox))setToolbox(v.toolbox);if(v.tradeId)setTradeId(v.tradeId)}catch{}setLoaded(true)},[]);
 useEffect(()=>{if(loaded)localStorage.setItem(KEY,JSON.stringify({tradeId,toolbox}))},[tradeId,toolbox,loaded]);
 const trade=TRADES.find(x=>x.id===tradeId),job=JOBS.find(x=>x.id===jobId)||JOBS[0],work=trade?MISSIONS[job.mission].brief(trade):'';
 const promptChecks=signals.map(([name,rx,hint])=>({name,ok:rx.test(prompt),hint}));
 function changeJob(id){setJobId(id);setPrompt('');setReply('');setResult('');setRuns([]);setReview(null);setError('')}
 async function run(){
  if(!trade||prompt.trim().length<25||busy)return;
  setBusy(true);setError('');
  try{
   const context=[work,...job.records,'ASSIGNMENT: '+job.task,'PREVIOUS AI EXCHANGES:',...runs.slice(-3).flatMap(r=>['TECHNICIAN: '+r.prompt,'AI: '+r.answer])].join('\n');
   const r=await fetch('/api/ollama',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,scenario:context})});
   const data=await r.json();if(!r.ok)throw Error(data.error||'AI unavailable');
   const answer=String(data.response||'').trim();if(!answer)throw Error('AI returned an empty response');
   setReply(answer);setRuns(v=>[...v,{prompt,answer}].slice(-5));
  }catch(e){setError(e.message+' — Check the configured AI provider. No simulated answer has been substituted.')}finally{setBusy(false)}
 }
 function submit(){if(result.trim().length<50)return;setReview(evaluate(result,job.records))}
 function savePrompt(){if(!prompt.trim())return;setToolbox(v=>[{id:Date.now(),title:job.title,trade:trade.name,prompt},...v].slice(0,25))}
 if(!loaded)return <main className="ps-root">Loading…</main>;
 return <main className="ps-root"><div className="ps-shell"><header className="ps-nav"><strong>FM FLIGHT <small>Practical AI Simulator</small></strong><nav><a href="/ops">Field Ops</a><a href="/quest">AI Quest</a><a href="/training">Original Training</a></nav></header><section className="ps-hero"><span>HANDS-ON AI SKILLS FOR THE TRADES</span><h1>Use AI to get real work done.</h1><p>Work with a realistic service ticket, ask AI for something useful, improve its response, and deliver a result a coworker could review. No artificial countdowns or mandatory quizzes.</p></section>
 <div className="ps-setup"><label>Choose your trade<select value={tradeId} onChange={e=>setTradeId(e.target.value)}><option value="">Select a trade…</option>{TRADES.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label>Practice mode<select value={mode} onChange={e=>setMode(e.target.value)}>{MODES.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label><p>{MODES.find(m=>m.id===mode)?.description}</p></div>
 {trade&&<><div className="ps-jobs">{JOBS.map(j=><button key={j.id} className={jobId===j.id?'active':''} onClick={()=>changeJob(j.id)}>{j.title}</button>)}</div><section className="ps-layout"><div className="ps-main"><article className="ps-panel"><div className="ps-kicker">01 · WORK ORDER & SOURCE PACK</div><h2>{job.title}</h2><p className="ps-work">{work}</p><h3>Your assignment</h3><p>{job.task}</p><h3>Supporting records</h3>{job.records.map((x,i)=><div className="ps-record" key={i}><strong>Record {i+1}</strong><p>{x}</p></div>)}<p className="ps-deliverable"><strong>Deliverable:</strong> {job.deliverable}</p></article><article className="ps-panel"><div className="ps-kicker">02 · WORK WITH BOLT</div><h2>AI workspace</h2><p>Write an instruction for BOLT. Test it, review the answer, and try a better version. The AI response is not a verified field finding.</p><div className="ps-actions"><button onClick={()=>setPrompt(starter(job,trade,work))}>Load an example prompt</button><button onClick={savePrompt} disabled={!prompt.trim()}>Save my prompt</button></div><textarea rows={7} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="What do you want BOLT to do with these records?"/>{mode==='guided'&&<div className="ps-hints">{promptChecks.map(c=><div key={c.name}><b>{c.ok?'✓':'○'} {c.name}</b>{!c.ok&&<small>{c.hint}</small>}</div>)}</div>}<button className="ps-primary" onClick={run} disabled={busy||prompt.trim().length<25}>{busy?'BOLT is working…':runs.length?'↻ Run revised prompt':'▶ Ask BOLT'}</button>{error&&<p role="alert" className="ps-error">{error}</p>}{runs.map((r,i)=><div className="ps-exchange" key={i}><strong>Attempt {i+1} · Your prompt</strong><p>{r.prompt}</p><strong>BOLT · Live AI response</strong><pre>{r.answer}</pre><button onClick={()=>{setPrompt(r.prompt+'\n\nPlease revise the response to identify unsupported claims, cite the supplied records, and separate facts from unknowns.');setReview(null)}}>Improve this response ↻</button></div>)}</article><article className="ps-panel"><div className="ps-kicker">03 · PRODUCE A USEFUL RESULT</div><h2>Final work product</h2><p>Use the AI response as a draft, not as proof. Edit it into something a qualified coworker could review.</p><button onClick={()=>setResult(reply)} disabled={!reply}>Use latest AI draft</button><textarea rows={11} value={result} onChange={e=>{setResult(e.target.value);setReview(null)}} placeholder="Prepare a concise, source-grounded handoff, vendor message, or comparison…"/><button className="ps-primary" onClick={submit} disabled={result.trim().length<50}>Review my work →</button>{review&&<div className="ps-review"><h3>Formative review · {review.score}/100</h3>{review.checks.map(([n,ok])=><p key={n}>{ok?'✓':'○'} {n}</p>)}{review.notes.map((n,i)=><p key={i}>{n}</p>)}<small>{review.disclaimer}</small><div className="ps-actions"><button onClick={()=>setReview(null)}>Revise and resubmit</button><button onClick={()=>navigator.clipboard?.writeText(result)}>Copy finished work</button></div></div>}</article></div><aside className="ps-side"><div className="ps-panel"><h3>What success looks like</h3><p>Produce a concise work product, keep facts separate from assumptions, identify what needs verification, and name the qualified reviewer.</p><p>This is a practice environment, not a repair authorization or technical certification.</p></div><div className="ps-panel"><h3>Your prompt toolbox</h3>{toolbox.length?toolbox.slice(0,10).map(x=><div className="ps-tool" key={x.id}><strong>{x.title}</strong><small>{x.trade}</small><button onClick={()=>{setPrompt(x.prompt);window.scrollTo({top:0,behavior:'smooth'})}}>Reuse</button><button onClick={()=>navigator.clipboard?.writeText(x.prompt)}>Copy</button></div>):<p>Save a useful prompt to build your personal collection.</p>}</div></aside></section></>}
 <footer>FM Flight · Practical AI Skills · Use approved workplace AI tools and follow organizational data-handling policies.</footer></div></main>;
}
