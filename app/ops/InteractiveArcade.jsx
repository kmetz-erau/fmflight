'use client';
import {useEffect,useState} from 'react';
import './interactive-arcade.css';
const bins=[['reported','📋 Reported facts'],['unknown','❔ Needs verification'],['private','🔒 Keep out of AI']];
const labels=[['supported','📗 Supported'],['unverified','🔍 Unverified'],['unsafe','🛑 Unauthorized']];
export default function InteractiveArcade({work,facts,caseId,onComplete}){
 const [round,setRound]=useState(0),[sort,setSort]=useState({}),[links,setLinks]=useState({}),[radio,setRadio]=useState(''),[checked,setChecked]=useState(false),[mistakes,setMistakes]=useState(0),[selected,setSelected]=useState(null);
 useEffect(()=>{setRound(0);setSort({});setLinks({});setRadio('');setChecked(false);setMistakes(0);setSelected(null)},[caseId]);
 const cards=[
 {id:'ticket',title:'Dispatch ticket',body:work,answer:'reported',why:'The work order is reported information, not a confirmed diagnosis.'},
 {id:'field',title:'Field note',body:facts[0]||'Condition reported by the caller.',answer:'reported',why:'Treat supplied observations as reported, not independently verified.'},
 {id:'missing',title:'Missing field check',body:'The cause and physical condition have not been confirmed.',answer:'unknown',why:'The cause is not established until a qualified person verifies it.'},
 {id:'secret',title:'Sensitive attachment',body:'Occupant contact number and access code (values withheld).',answer:'private',why:'Personal information and access codes are not needed in an AI prompt.'}
 ];
 const claims=[
 {id:'a',title:'The dispatch ticket reports the described condition.',answer:'supported',why:'This is supported as a reported condition, not a field-verified measurement.'},
 {id:'b',title:'BOLT proved a component has failed without field inspection.',answer:'unverified',why:'AI cannot confirm a physical failure from the available notes.'},
 {id:'c',title:'BOLT can authorize skipping approved safety procedures.',answer:'unsafe',why:'Only authorized people and procedures control hazardous work.'}
 ];
 const radioChoices=[['ignore','Ignore the update and send the first AI answer.'],['assume','Treat the new report as confirmed truth.'],['verify','Keep both reports, revise the AI prompt, and request field verification.']];
 const items=round===0?cards:claims,answers=round===0?sort:links;
 const complete=round===2?!!radio:items.every(x=>answers[x.id]);
 const wrong=round===2?(radio==='verify'?[]:[{id:'radio',why:'Conflicting reports must remain visible until verified.'}]):items.filter(x=>answers[x.id]!==x.answer);
 function check(){if(!complete)return;setChecked(true);if(wrong.length)setMistakes(n=>n+wrong.length)}
 function next(){if(wrong.length)return;if(round===2)onComplete(mistakes);else{setRound(n=>n+1);setChecked(false);setSelected(null)}}
 function pick(id,value){if(round===0)setSort(v=>({...v,[id]:value}));else setLinks(v=>({...v,[id]:value}))}
 return <section className="ia-shell"><header><span>⚡ FIELD OPS SKILL ARCADE · ROUND {round+1}/3</span><h2>{['Sort the evidence','Connect AI claims to evidence','Radio interruption'][round]}</h2><p>{['Tap a document and a bin, or use the dropdown.','Decide whether each AI statement is grounded, unverified, or unauthorized.','Dispatch has a conflicting update. What should happen next?'][round]}</p></header><div className="ia-meter"><i style={{width:((round+1)*100/3)+'%'}}/></div>
 {round===0&&<><div className="ia-grid">{cards.map(c=><article key={c.id} className={'ia-card '+(checked&&sort[c.id]!==c.answer?'ia-wrong':'')}><button disabled={checked} onClick={()=>setSelected(c.id)}><strong>{c.title}</strong><p>{c.body}</p><small>{selected===c.id?'✓ Selected — choose a bin':'Tap to select'}</small></button><select aria-label={'Sort '+c.title} disabled={checked} value={sort[c.id]||''} onChange={e=>pick(c.id,e.target.value)}><option value="">Choose bin…</option>{bins.map(b=><option key={b[0]} value={b[0]}>{b[1]}</option>)}</select>{checked&&sort[c.id]!==c.answer&&<p className="ia-explain">{c.why}</p>}</article>)}</div><div className="ia-bins">{bins.map(b=><button key={b[0]} disabled={checked||!selected} onClick={()=>{pick(selected,b[0]);setSelected(null)}}><strong>{b[1]}</strong><small>{cards.filter(c=>sort[c.id]===b[0]).length} attached</small></button>)}</div></>}
 {round===1&&<div className="ia-grid">{claims.map(c=><article key={c.id} className={'ia-card '+(checked&&links[c.id]!==c.answer?'ia-wrong':'')}><strong>🤖 AI CLAIM</strong><p>{c.title}</p><div className="ia-choices">{labels.map(l=><button key={l[0]} disabled={checked} className={links[c.id]===l[0]?'selected':''} onClick={()=>pick(c.id,l[0])}>{l[1]}</button>)}</div>{checked&&links[c.id]!==c.answer&&<p className="ia-explain">{c.why}</p>}</article>)}</div>}
 {round===2&&<div className="ia-radio"><div className="ia-alert"><strong>📻 INCOMING DISPATCH UPDATE</strong><p>The caller reports different details from the original ticket. Neither report has been field-verified.</p><details><summary>View original work order</summary><p>{work}</p></details></div>{radioChoices.map(c=><button key={c[0]} disabled={checked} className={radio===c[0]?'selected':''} onClick={()=>setRadio(c[0])}>{c[1]}</button>)}{checked&&wrong.length>0&&<p className="ia-explain">{wrong[0].why}</p>}</div>}
 {checked&&<div role="status" className={'ia-feedback '+(wrong.length?'bad':'good')}><strong>{wrong.length?'⚠ Reconsider these decisions':'✓ Challenge cleared'}</strong><p>{wrong.length?'Read the highlighted explanations, then try again.':'Good judgment. You kept evidence and human verification in the workflow.'}</p></div>}
 <footer><span>{mistakes} correction(s) · Mistakes teach, they don't end the shift.</span>{!checked?<button disabled={!complete} onClick={check}>Check my moves →</button>:wrong.length?<button onClick={()=>setChecked(false)}>Try again ↻</button>:<button onClick={next}>{round===2?'Finish challenge →':'Next round →'}</button>}</footer>
 </section>;
}
