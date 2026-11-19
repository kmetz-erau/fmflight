import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(process.argv[2] || '.');
const path = join(root, 'app/quest/page.jsx');
if (!existsSync(path)) { console.error('Missing app/quest/page.jsx. Run from the FM Flight repository.'); process.exit(1); }
let source = readFileSync(path, 'utf8');
const marker = '<aside className="q-panel q-inspector"><span className="q-kicker">MISSION DEBRIEF</span>';
if (!source.includes(marker)) { console.error('Could not find Field Handoff sidebar. No changes made.'); process.exit(1); }
const card = `<aside className="q-panel q-inspector"><section aria-label="Original work order pinned for field handoff" style={{background:'#173e50',border:'2px solid #72e4c4',borderRadius:14,padding:18,marginBottom:16,boxShadow:'0 0 0 3px #72e4c415'}}><div style={{fontSize:12,fontWeight:900,letterSpacing:'.12em',color:'#90f4d3',marginBottom:9}}>📋 DISPATCH · ORIGINAL WORK ORDER</div><h3 style={{fontSize:20,color:'#fff',margin:'0 0 12px'}}>{mission.title}</h3><p style={{color:'#e7f5ff',fontSize:15,lineHeight:1.7,whiteSpace:'pre-wrap',margin:'0 0 12px'}}>{mission.brief(trade)}</p><div style={{borderTop:'1px solid #547c89',paddingTop:10,fontSize:13,color:'#c7e9ed'}}>📍 {mission.building} · 🛠 {trade.name}<div style={{marginTop:7}}><strong>Deliverable:</strong> {mission.artifact}</div></div><details style={{marginTop:14,color:'#e7f5ff'}}><summary style={{cursor:'pointer',fontWeight:800}}>View collected evidence ({clues.filter(c=>seen.includes(c.id)).length})</summary><div style={{display:'grid',gap:10,marginTop:12}}>{clues.filter(c=>seen.includes(c.id)).map(c=><div key={c.id} style={{padding:10,background:'#102c3a',borderRadius:8}}><strong>{c.icon} {c.title}</strong><p style={{fontSize:13,marginTop:6}}>{c.body}</p></div>)}</div></details></section><span className="q-kicker">MISSION DEBRIEF</span>`;
if (source.includes('Original work order pinned for field handoff')) { console.log('Pinned work order already installed.'); process.exit(0); }
const backup = path + '.before-handoff-fix.bak';
if (!existsSync(backup)) copyFileSync(path, backup);
source = source.replace(marker, card);
writeFileSync(path, source);
console.log('Installed pinned original work order in Field Handoff. Backup: ' + backup);
