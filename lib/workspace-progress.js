import {TRADE_JOBS} from './workspace-trade-jobs.js';

export const PROGRESS_KEY='fmflight-progress-v1';
export function workKey(tradeId,jobId){return tradeId+':'+jobId}

export function loadCompletedWork(storage){
 const raw=storage.getItem(PROGRESS_KEY);
 if(!raw)return {};
 const data=JSON.parse(raw);
 if(data?.version!==1||!data.records||typeof data.records!=='object'||Array.isArray(data.records))throw new Error('Unrecognized progress data');
 const records={};
 for(const [key,entry] of Object.entries(data.records)){
  if(!entry||typeof entry.text!=='string'||entry.text.trim().length<40||typeof entry.completedAt!=='string')continue;
  if(!Array.isArray(TRADE_JOBS[entry.tradeId])||!TRADE_JOBS[entry.tradeId].some(job=>job.id===entry.jobId)||key!==workKey(entry.tradeId,entry.jobId))continue;
  records[key]={tradeId:entry.tradeId,jobId:entry.jobId,text:entry.text,completedAt:entry.completedAt};
 }
 return records;
}

export function saveCompletedWork(storage,entry){
 if(!Array.isArray(TRADE_JOBS[entry.tradeId])||!TRADE_JOBS[entry.tradeId].some(job=>job.id===entry.jobId)||typeof entry.text!=='string'||entry.text.trim().length<40)throw new Error('A work product is required');
 const records={...loadCompletedWork(storage),[workKey(entry.tradeId,entry.jobId)]:entry};
 storage.setItem(PROGRESS_KEY,JSON.stringify({version:1,records}));
 return records;
}

const CRITERIA=[
 {id:'facts',label:'Reported facts',pattern:/\b(?:report(?:s|ed)?|records?|notes?|sources?|observations?|observed)\b/i,found:'Source or report wording is present. Compare the statement with the original record.'},
 {id:'unknowns',label:'Unknowns',pattern:/\b(?:unknowns?|missing|unverified|uncertain|unconfirmed|not (?:yet )?(?:confirmed|known|verified|recorded|provided)|no (?:verified|confirmed)|(?:has|have) not been (?:confirmed|verified))\b/i,found:'Uncertainty wording is present. Check that it identifies the actual gap in the records.'},
 {id:'verification',label:'Verification',pattern:/\b(?:verify|verification|confirm|check|review)\b/i,found:'Review wording is present. Make the next check and the responsible person clear.'}
];

export function getWritingFeedback(value,job){
 const text=String(value||'');
 // Require a meaningful phrase around a cue so isolated headings do not earn a point.
 const passages=text.split(/\n|(?<=[.!?])\s+/).map(line=>line.trim()).filter(line=>(line.match(/[\p{L}\p{N}]+/gu)||[]).length>=3);
 const source=job?.docs?.[0]?.name;
 const suggestions={
  facts:source?'Identify which information comes from "'+source+'" or another supporting record.':'Identify which record or person reported the information.',
  unknowns:'State what is still unknown, missing, or unconfirmed in this work order.',
  verification:'Add a specific check and name who should confirm it, such as a qualified technician or supervisor.'
 };
 const items=CRITERIA.map(criterion=>{
  const evidence=passages.find(line=>criterion.pattern.test(line))||'';
  return {id:criterion.id,label:criterion.label,found:Boolean(evidence),evidence:evidence.length>200?evidence.slice(0,197)+'…':evidence,message:evidence?criterion.found:suggestions[criterion.id]};
 });
 const score=items.filter(item=>item.found).length;
 const summaries=['The writing cues are not clear yet. Use the suggestions below to strengthen the draft.','One writing cue is present. Review the other two suggestions.','Two writing cues are present. One suggestion remains.','All three writing cues are present. Compare the draft with the source records.'];
 return {score,items,summary:summaries[score]};
}
