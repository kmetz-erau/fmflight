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
 {id:'facts',label:'What was reported',pattern:/\b(?:report(?:s|ed)?|records?|notes?|sources?|observations?|observed)\b/i,found:'You mentioned the reported information. Make sure it matches the work order.'},
 {id:'unknowns',label:'What we still need to know',pattern:/\b(?:unknowns?|missing|unverified|uncertain|unconfirmed|not (?:yet )?(?:confirmed|known|verified|recorded|provided)|no (?:verified|confirmed)|(?:has|have) not been (?:confirmed|verified))\b/i,found:'You pointed out missing information. Make sure the gaps are specific to this job.'},
 {id:'verification',label:'What needs checking',pattern:/\b(?:verify|verification|confirm|check|review)\b/i,found:'You mentioned a check or review. Say who needs to do it.'}
];

export function getWritingFeedback(value,job){
 const text=String(value||'');
 // Require a meaningful phrase around a cue so isolated headings do not earn a point.
 const passages=text.split(/\n|(?<=[.!?])\s+/).map(line=>line.trim()).filter(line=>(line.match(/[\p{L}\p{N}]+/gu)||[]).length>=3);
 const source=job?.docs?.[0]?.name;
 const suggestions={
  facts:source?'Add what the work order or "'+source+'" says happened.':'Add what was reported and where the information came from.',
  unknowns:'Add what you still do not know about this job.',
  verification:'Add what needs to be checked and who should check it.'
 };
 const items=CRITERIA.map(criterion=>{
  const evidence=passages.find(line=>criterion.pattern.test(line))||'';
  return {id:criterion.id,label:criterion.label,found:Boolean(evidence),evidence:evidence.length>200?evidence.slice(0,197)+'…':evidence,message:evidence?criterion.found:suggestions[criterion.id]};
 });
 const score=items.filter(item=>item.found).length;
 const summaries=['Your draft needs a few more details. See what to add below.','Good start. Two things to add.','Almost there. One thing to add.','All three parts are in your draft. Check them against the original work order.'];
 return {score,items,summary:summaries[score]};
}
