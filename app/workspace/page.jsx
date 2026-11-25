'use client';
import {useEffect,useRef,useState} from 'react';
import {TRADES} from '../../lib/academy-data';
import {TRADE_JOBS} from '../../lib/workspace-trade-jobs';
import {getWritingFeedback,loadCompletedWork,saveCompletedWork,workKey} from '../../lib/workspace-progress';
import './simple.css';

const KEY='fmflight-simple-v1';
const TOOLBOX='fmflight-workspace-v1';
export default function SimpleFlight(){
 const [tradeId,setTradeId]=useState(''),[jobId,setJobId]=useState(null),[messages,setMessages]=useState([]),[draft,setDraft]=useState(''),[final,setFinal]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[hint,setHint]=useState(false),[toolbox,setToolbox]=useState([]),[view,setView]=useState('home'),[ready,setReady]=useState(false),[saved,setSaved]=useState(false);
 const [completed,setCompleted]=useState({}),[copyState,setCopyState]=useState('idle'),[saveError,setSaveError]=useState(''),[toolboxReturn,setToolboxReturn]=useState('home');
 const finalField=useRef(null),completionHeading=useRef(null),copyRequest=useRef(0),chatRequest=useRef(0),chatController=useRef(null);
 useEffect(()=>{
  try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(TRADES.some(t=>t.id===v.tradeId))setTradeId(v.tradeId)}catch{}
  try{const v=JSON.parse(localStorage.getItem(TOOLBOX)||'{}');if(Array.isArray(v.saved))setToolbox(v.saved)}catch{}
  try{setCompleted(loadCompletedWork(localStorage))}catch{setSaveError('Saved work could not be loaded in this browser. Your current draft is still available below.')}
  setReady(true);
 },[]);
 useEffect(()=>{if(ready){try{localStorage.setItem(KEY,JSON.stringify({tradeId}))}catch{}}},[ready,tradeId]);
 useEffect(()=>{copyRequest.current+=1;setCopyState('idle');if(view==='complete')completionHeading.current?.focus();},[view]);
 useEffect(()=>()=>{copyRequest.current+=1;chatRequest.current+=1;chatController.current?.abort()},[]);
 const trade=TRADES.find(t=>t.id===tradeId);
 const jobs=TRADE_JOBS[tradeId]||[];
 const job=jobs.find(j=>j.id===jobId);
 const records=job?.docs||[];
 const last=messages.at(-1);
 const feedback=getWritingFeedback(final,job);
 const completion=completed[workKey(tradeId,jobId)];
 const completedCount=jobs.filter(j=>completed[workKey(tradeId,j.id)]).length;
 const jobIndex=jobs.findIndex(j=>j.id===jobId);
 const nextJob=[...jobs.slice(jobIndex+1),...jobs.slice(0,jobIndex+1)].find(j=>!completed[workKey(tradeId,j.id)]);
 const canFinish=final.trim().length>=40;
 function pickTrade(id){setTradeId(id);setJobId(null);setView('home');reset()}
 function reset(){chatRequest.current+=1;chatController.current?.abort();copyRequest.current+=1;setBusy(false);setMessages([]);setDraft('');setFinal('');setError('');setHint(false);setSaved(false);setCopyState('idle');setSaveError('')}
 function pickJob(id){reset();setJobId(id);const entry=completed[workKey(tradeId,id)];if(entry){setFinal(entry.text);setView('complete')}else{setView('work')}}
 function goHome(){reset();setJobId(null);setView('home')}
 function updateFinal(text){copyRequest.current+=1;setFinal(text);setCopyState('idle');setSaveError('')}
 function useDraft(){if(last){updateFinal(last.reply);finalField.current?.focus()}}
 async function copyWork(){
  if(!canFinish||copyState==='pending')return;
  const request=++copyRequest.current;
  setCopyState('pending');
  try{
   if(typeof navigator.clipboard?.writeText!=='function')throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(final);
   if(request===copyRequest.current)setCopyState('copied');
  }catch{
   if(request!==copyRequest.current)return;
   const field=finalField.current;
   if(field){field.focus();field.select();setCopyState('manual')}
   else setCopyState('unavailable');
  }
 }
 function finishWork(){
  if(!job||!canFinish||busy)return;
  setSaveError('');
  try{
   const entry={tradeId,jobId:job.id,text:final,completedAt:new Date().toISOString()};
   setCompleted(saveCompletedWork(localStorage,entry));
   setView('complete');
  }catch{
   setSaveError('Your work could not be saved in this browser. Your draft is still here. Try Finish work order again, or copy your work before leaving.');
  }
 }
 const copyMessage=copyState==='copied'?'Copied to clipboard. Paste it into your document or email.':copyState==='manual'?'Automatic copying is unavailable. Your text is selected: press Ctrl+C or ⌘C, or use your device’s Copy menu.':copyState==='unavailable'?'Automatic copying is unavailable. Select your draft and use your device’s Copy command.':copyState==='pending'?'Copying your work…':'';
 function example(){setDraft('Using only the work-order records, '+job.task+' Please create a short '+job.output.toLowerCase()+'. Separate reported facts, unknowns, and verification questions. Do not invent readings, part numbers, diagnoses, or authorizations.')}
 async function ask(){
  if(!job||!draft.trim()||busy)return;
  const request=++chatRequest.current;const controller=new AbortController();chatController.current=controller;
  setBusy(true);setError('');
  try{
   const history=messages.slice(-4).map(m=>'Technician: '+m.prompt+'\nBOLT: '+m.reply).join('\n\n');
   const scenario=['Fictional training work order: '+job.title,'Location: '+job.location,'Asset: '+job.asset,'Task: '+job.task,...records.map(d=>d.name+': '+d.body),'Previous conversation:\n'+history,'Use only supplied records. Treat observations as reported, preserve unknowns, and require qualified verification.'].join('\n\n');
   const r=await fetch('/api/ollama',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:draft,scenario}),signal:controller.signal});
   const data=await r.json();if(request!==chatRequest.current)return;if(!r.ok)throw Error(data.error||'AI service unavailable');
   const reply=String(data.response||'').trim();if(!reply)throw Error('No AI response returned');
   setMessages(v=>[...v,{prompt:draft,reply}].slice(-8));setDraft(value=>value===draft?'':value);
  }catch(e){if(request===chatRequest.current&&e.name!=='AbortError')setError(String(e.message)+' — Check the AI service or try again.')}finally{if(request===chatRequest.current){setBusy(false);chatController.current=null}}
 }
 function savePrompt(){
  const prompt=last?.prompt||draft;if(!prompt.trim()||!job)return;
  const next=[{id:Date.now(),trade:trade.name,name:job.title,prompt},...toolbox].slice(0,30);
  try{const existing=JSON.parse(localStorage.getItem(TOOLBOX)||'{}');localStorage.setItem(TOOLBOX,JSON.stringify({...existing,saved:next}));setToolbox(next);setSaved(true)}catch{setError('This browser could not save the prompt. Your conversation is still available.')}
 }
 const signals=feedback.items.map(item=>[item.label,item.found]);
 if(!ready)return <main className="sf-root">Loading FM Flight…</main>;
 return <main className="sf-root"><div className="sf-shell"><header className="sf-nav"><button className="sf-brand" onClick={goHome}><span>✦</span><strong>FM FLIGHT<small>Practical AI training</small></strong></button><div className="sf-nav-actions"><button onClick={()=>{setToolboxReturn(view);setView('toolbox')}}>My AI Toolkit</button><a href="/workspace/advanced">More Training ↗</a></div></header>
 {view==='toolbox'?<section className="sf-home"><button className="sf-back" onClick={()=>setView(toolboxReturn)}>← Back</button><h1>My AI Toolkit</h1><p>Reusable prompts you've saved while practicing.</p>{toolbox.length?<div className="sf-tool-list">{toolbox.map(x=><article key={x.id}><strong>{x.name}</strong><small>{x.trade}</small><p>{x.prompt}</p><button onClick={()=>navigator.clipboard?.writeText(x.prompt)}>Copy prompt</button></article>)}</div>:<div className="sf-empty">No saved prompts yet. Complete a BOLT conversation and save a useful prompt.</div>}</section>:!trade?<section className="sf-home"><div className="sf-eyebrow">GET STARTED · STEP 1 OF 3</div><h1>What trade do you work in?</h1><p>Pick your trade. We'll give you realistic work orders and show you how AI can help.</p><div className="sf-trades">{TRADES.map(t=><button key={t.id} onClick={()=>pickTrade(t.id)}><span>{t.icon}</span><strong>{t.name}</strong><small>Choose trade →</small></button>)}</div></section>:!job?<section className="sf-home"><button className="sf-back" onClick={()=>pickTrade('')}>← Change trade</button><div className="sf-eyebrow">{trade.name} · STEP 1 OF 3</div><h1>Pick a work order</h1><p>Choose a realistic job. You'll use BOLT to turn the information into something useful.</p><p className="sf-progress" aria-live="polite">{completedCount} of {jobs.length} work orders completed in {trade.name}.</p><div className="sf-jobs">{jobs.map((j,i)=><button key={j.id} onClick={()=>pickJob(j.id)}><span className="sf-job-num">0{i+1}</span><div><strong>{j.title}</strong><small>{j.location} · {j.type}</small></div><span className={completed[workKey(tradeId,j.id)]?'sf-complete-label':''}>{completed[workKey(tradeId,j.id)]?'✓ Complete':'Open'}</span></button>)}</div></section>:view==='complete'?<section className="sf-completion">
 <button className="sf-back" onClick={goHome}>All work orders</button>
 <div className="sf-completion-header">
  <div><div className="sf-eyebrow">PRACTICE COMPLETE · {trade.name}</div><h1 ref={completionHeading} tabIndex={-1}>Work order complete</h1><p>{job.title}</p><p className="sf-progress">{completedCount} of {jobs.length} work orders completed.</p></div>
  <div className="sf-score" aria-label={`${feedback.score} of 3 job details included`}><strong>{feedback.score}<span> / 3</span></strong><span>Job details included</span></div>
 </div>
 <p className="sf-save-confirmation" role="status">Your work is saved in this browser. You can reopen it from the work-order list.</p>
 <section className="sf-card sf-review" aria-labelledby="sf-review-title">
  <h2 id="sf-review-title">How did you do?</h2><p>{feedback.summary}</p>
  <p className="sf-check-explainer">This quick check looks for three things in your writing. It does not check whether the information is correct.</p>
  <ul className="sf-feedback-list">{feedback.items.map(item=><li key={item.id} className={item.found?'found':''}><div><strong>{item.label}</strong><span>{item.found?'✓ Included':'+ Add this'}</span></div><p>{item.message}</p>{item.evidence&&<blockquote>{item.evidence}</blockquote>}</li>)}</ul>
  <div className="sf-actions"><button className="sf-secondary" onClick={()=>setView('work')}>Make changes to my work</button></div>
 </section>
 <section className="sf-card sf-saved-work"><h2>Your saved work</h2><label className="sf-compose-label" htmlFor="sf-completed-text">{job.output}</label><textarea id="sf-completed-text" ref={finalField} rows={7} value={final} readOnly/><button className="sf-secondary" onClick={copyWork} disabled={copyState==='pending'}>{copyState==='copied'?'✓ Copied':copyState==='pending'?'Copying…':'Copy finished work'}</button><p className={'sf-copy-status '+(copyState==='manual'?'manual':'')} role="status" aria-live="polite" aria-atomic="true">{copyMessage}</p></section>
 <div className="sf-next-work">{nextJob?<><div><h2>Keep going</h2><p>Next: {nextJob.title}</p></div><button className="sf-primary" onClick={()=>pickJob(nextJob.id)}>Next work order</button></>:<><div><h2>All {jobs.length} work orders in this trade are complete</h2><p>Choose another trade or review your saved work.</p></div><button className="sf-primary" onClick={()=>pickTrade('')}>Choose another trade</button><button className="sf-secondary" onClick={goHome}>Review completed work</button></>}</div>
 </section>:<><div className="sf-work-top"><button className="sf-back" onClick={goHome}>← All work orders</button><span>{trade.name} · {job.location}</span></div><div className="sf-work-head"><div className="sf-eyebrow">WORK ORDER · {job.asset}</div><h1>{job.title}</h1><p>{job.task}</p></div><div className="sf-steps"><span className="active">1. Review the job</span><span className={!final.trim()?'active':''}>2. Ask BOLT</span><span className={final.trim()?'active':''}>3. Finish the work</span></div><div className="sf-layout"><div className="sf-main"><section className="sf-card sf-chat-card"><div className="sf-card-title"><span className="sf-bolt-icon">✦</span><div><h2>Ask BOLT</h2><p>Your AI assistant already has the work order and its supporting records.</p></div></div><div className="sf-chat" aria-live="polite">{messages.length?messages.map((m,i)=><div key={i}><div className="sf-msg-user"><strong>You</strong><p>{m.prompt}</p></div><div className="sf-msg-bolt"><strong>✦ BOLT · Live AI</strong><pre>{m.reply}</pre></div></div>):<div className="sf-msg-bolt"><strong>✦ BOLT</strong><p>I've got the work order and source notes. What would you like me to help prepare? You can start with “Help me prepare for this job.”</p></div>}</div><label className="sf-compose-label" htmlFor="sf-prompt">Your message</label><textarea id="sf-prompt" rows={4} value={draft} onChange={e=>{setDraft(e.target.value);setSaved(false)}} placeholder="Help me prepare for this job…"/><div className="sf-actions"><button className="sf-secondary" onClick={example}>Show example</button><button className="sf-secondary" onClick={()=>setHint(v=>!v)}>{hint?'Hide tip':'Need a tip?'}</button><button className="sf-primary" onClick={ask} disabled={busy||!draft.trim()}>{busy?'BOLT is thinking…':'Send to BOLT →'}</button></div>{hint&&<p className="sf-tip">A useful prompt tells BOLT what to create, what records to use, and what information still needs verification.</p>}{error&&<p role="alert" className="sf-error">{error}</p>}{last&&<div className="sf-after-chat"><button className="sf-secondary" onClick={()=>{setDraft('Please improve your last response. Cite the supplied records, separate reported facts from assumptions, and identify what a qualified technician must verify.')}}>↻ Improve BOLT's answer</button><button className="sf-secondary" onClick={savePrompt}>{saved?'✓ Prompt saved':'☆ Save useful prompt'}</button></div>}</section><section className="sf-card sf-finish"><div className="sf-eyebrow">STEP 3 · FINISH THE JOB</div><h2>Make the result useful</h2><p>Turn BOLT's answer into a checklist, email, comparison, or handoff a coworker could review.</p><button className="sf-secondary" disabled={!last} onClick={useDraft}>Use BOLT's draft</button><label className="sf-compose-label sf-final-label" htmlFor="sf-final-work">Your work product</label><textarea id="sf-final-work" ref={finalField} rows={9} value={final} onChange={e=>updateFinal(e.target.value)} placeholder="Your final work product…"/><div className="sf-checks">{signals.map(([name,ok])=><span key={name} className={ok?'ok':''}>{ok?'✓':'○'} {name}</span>)}</div><p className="sf-writing-score">Job check: {feedback.score} of 3 details included. Finish to see what to improve.</p><div className="sf-actions"><button className="sf-secondary" disabled={!canFinish||copyState==='pending'} onClick={copyWork}>{copyState==='copied'?'✓ Copied':copyState==='pending'?'Copying…':'Copy finished work'}</button><button className="sf-primary" disabled={!canFinish||busy} onClick={finishWork}>{completion?'Save updated work':'Finish work order'}</button></div><p className={'sf-copy-status '+(copyState==='manual'?'manual':'')} role="status" aria-live="polite" aria-atomic="true">{copyMessage}</p>{saveError&&<p className="sf-error" role="alert">{saveError}</p>}<p className="sf-finish-help">Finish to save your work and see three simple checks. You can complete the job with any score.</p><p className="sf-footnote">For training only. BOLT's output is not a verified diagnosis or work authorization. A qualified person must review technical content.</p></section></div><aside className="sf-sidebar"><div className="sf-card"><div className="sf-eyebrow">YOUR JOB FILE</div><h3>{job.location}</h3><p><strong>Asset:</strong> {job.asset}</p><p><strong>Deliverable:</strong> {job.output}</p><details><summary>View supporting records ({records.length})</summary>{records.map((d,i)=><div className="sf-record" key={i}><strong>{d.name}</strong><p>{d.body}</p></div>)}</details></div><div className="sf-card sf-help"><h3>One thing to remember</h3><p>AI is good at organizing information. It cannot confirm what happened in the field. Check important claims against reliable sources.</p></div></aside></div></>}
 <footer>FM Flight · AI training for the skilled trades · Use only approved AI services and sanitized work information.</footer></div></main>;
}

