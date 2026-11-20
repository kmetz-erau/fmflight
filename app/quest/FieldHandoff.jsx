'use client';
import {useEffect,useMemo,useState} from 'react';
import './handoff.css';

const OWNERS=['Assigned technician','Trade supervisor','Qualified specialist','Dispatch / work control'];
const MODES=[
  {id:'crew',label:'Crew radio',icon:'📻',hint:'Short and direct for the next technician.'},
  {id:'dispatch',label:'Dispatch update',icon:'📋',hint:'Clear status, unknowns, and next action.'},
  {id:'supervisor',label:'Supervisor brief',icon:'🛡️',hint:'Highlight risk and approval boundaries.'}
];
export default function FieldHandoff({mission,trade,clues,seen,onSend,result}){
 const [selected,setSelected]=useState([]);
 const [owner,setOwner]=useState('');
 const [mode,setMode]=useState('crew');
 const [unknown,setUnknown]=useState(true);
 const [verify,setVerify]=useState(true);
 const [draft,setDraft]=useState('');
 const [edited,setEdited]=useState(false);
 const [preview,setPreview]=useState(false);
 const [error,setError]=useState('');
 const available=useMemo(()=>clues.filter(c=>seen.includes(c.id)),[clues,seen]);
 useEffect(()=>{setSelected([]);setOwner('');setMode('crew');setUnknown(true);setVerify(true);setDraft('');setEdited(false);setPreview(false);setError('')},[mission?.id]);
 const selectedClues=available.filter(c=>selected.includes(c.id));
 const text=useMemo(()=>{
  const lines=[
   (mode==='crew'?'CREW RADIO HANDOFF':mode==='dispatch'?'DISPATCH STATUS UPDATE':'SUPERVISOR REVIEW REQUEST')+' — '+mission.title,
   'Work order: '+mission.brief(trade),
   'Reported facts / source notes:',
   ...(selectedClues.length?selectedClues.map(c=>'- '+c.title+': '+c.body):['- No source evidence selected.']),
   unknown?'Unknowns: Cause, actual site condition, and unverified details remain unconfirmed.':'Unknowns: Not yet documented.',
   verify?'Verification: Check the current approved procedure, source records, and field observations before deciding next action.':'Verification: Not yet assigned.',
   'Human owner: '+(owner||'Not assigned')+'.',
   'Next step: Prepare a '+mission.artifact+' for review. AI does not authorize repairs, hazardous actions, or return to service.'
  ];
  return lines.join('\n\n');
 },[mode,mission,trade,selectedClues,unknown,verify,owner]);
 const outgoing=edited?draft:text;
 const ready=selectedClues.some(c=>c.important)&&owner&&unknown&&verify&&outgoing.trim().length>=75;
 function send(){
  if(!ready){setError('Before sending: include at least one relevant source, mark unknowns, assign verification, and choose the human owner.');return}
  setError('');
  onSend(outgoing);
 }
 return <div className="fh-wrap">
  <section className="fh-ticket">
   <div className="fh-top"><span>📟 LIVE DISPATCH CONSOLE</span><span>MISSION {String(mission.id).toUpperCase()}</span></div>
   <h3>{mission.title}</h3>
   <p>{mission.brief(trade)}</p>
   <div className="fh-meta"><span>📍 {mission.building}</span><span>🔧 {trade.name}</span><span>🎯 {mission.artifact}</span></div>
  </section>
  <div className="fh-columns">
   <section className="fh-main">
    <div className="fh-step"><span>01</span><div><h3>Load your evidence</h3><p>Tap the notes you want dispatch to receive. Only include sources you examined.</p></div></div>
    <div className="fh-clues">{available.map(c=><button key={c.id} disabled={!!result} className={'fh-clue '+(selected.includes(c.id)?'active':'')} onClick={()=>{setSelected(v=>v.includes(c.id)?v.filter(x=>x!==c.id):[...v,c.id]);setEdited(false);setPreview(false)}}><span>{c.icon}</span><strong>{c.title}</strong><small>{c.type} {c.important?'· Relevant':'· Unverified / outdated'}</small><b>{selected.includes(c.id)?'✓ Loaded':'+ Add'}</b></button>)}</div>
    <div className="fh-step"><span>02</span><div><h3>Choose the radio channel</h3><p>How will you communicate this work order?</p></div></div>
    <div className="fh-modes">{MODES.map(m=><button key={m.id} disabled={!!result} className={mode===m.id?'active':''} onClick={()=>{setMode(m.id);setEdited(false);setPreview(false)}}><strong>{m.icon} {m.label}</strong><small>{m.hint}</small></button>)}</div>
    <div className="fh-step"><span>03</span><div><h3>Set your guardrails</h3><p>Don't let an AI draft turn guesses into field instructions.</p></div></div>
    <label className="fh-toggle"><input type="checkbox" checked={unknown} disabled={!!result} onChange={e=>{setUnknown(e.target.checked);setEdited(false)}}/> Keep unknowns explicitly unconfirmed</label>
    <label className="fh-toggle"><input type="checkbox" checked={verify} disabled={!!result} onChange={e=>{setVerify(e.target.checked);setEdited(false)}}/> Require source and field verification</label>
    <label className="fh-owner">Who owns the next decision?<select value={owner} disabled={!!result} onChange={e=>{setOwner(e.target.value);setEdited(false)}}><option value="">Assign a qualified human owner…</option>{OWNERS.map(o=><option key={o}>{o}</option>)}</select></label>
   </section>
   <aside className="fh-console">
    <div className="fh-step"><span>04</span><div><h3>Transmit your handoff</h3><p>Preview the generated message, then send it for review.</p></div></div>
    <div className="fh-status"><span>{selectedClues.length} sources loaded</span><span>{owner?'✓ Owner assigned':'○ Owner missing'}</span></div>
    <div className="fh-preview"><div className="fh-preview-title">📡 OUTGOING MESSAGE <span>{mode.toUpperCase()}</span></div>{edited?<textarea aria-label="Edit outgoing handoff" rows={15} value={draft} disabled={!!result} onChange={e=>setDraft(e.target.value)}/>:<pre>{text}</pre>}</div>
    <div className="fh-actions"><button disabled={!!result} onClick={()=>{setDraft(outgoing);setEdited(true);setPreview(false)}}>✎ Edit message</button><button onClick={()=>setPreview(v=>!v)}>{preview?'Hide preview':'🔎 Final review'}</button></div>
    {preview&&<div className="fh-review"><strong>Pre-transmission check</strong><p>{selectedClues.some(c=>c.important)?'✓ Relevant evidence included':'○ Include a reliable source'}</p><p>{unknown?'✓ Uncertainty preserved':'○ Mark unverified information'}</p><p>{verify?'✓ Verification required':'○ Add verification step'}</p><p>{owner?'✓ '+owner+' responsible':'○ Assign a human owner'}</p></div>}
    {error&&<p className="fh-error" role="alert">{error}</p>}
    {!result?<button className="fh-send" disabled={!ready} onClick={send}>📨 SEND TO DISPATCH →</button>:<div className="fh-sent">✓ Handoff transmitted for simulated review</div>}
    <p className="fh-note">Simulated handoff only. No field inspection, repair, or approval is performed. The automated score checks writing signals, not technical correctness.</p>
   </aside>
  </div>
 </div>;
}
