// Coaching is based on observable prompt features, not a technical correctness grade.
export const COACH_SKILLS=[
 {name:'Context',pattern:/room|building|unit|equipment|work order|dispatch|rtu|panel|pump|door|walkway|location/i,question:'Which asset, room, and reported condition should I use?'},
 {name:'Task',pattern:/prepare|create|write|draft|organize|compare|list|checklist|questions|brief|identify/i,question:'What would help the crew most: a checklist, questions, or a handoff?'},
 {name:'Format',pattern:/short|checklist|bullet|table|sections|brief|numbered|format/i,question:'How should I format the result so a technician can use it quickly?'},
 {name:'Sources',pattern:/source|record|reported|observ|provided|only these|facts|notes/i,question:'Which work-order notes should I rely on, and which are just reports?'},
 {name:'Verification',pattern:/verify|unknown|missing|unconfirmed|do not|don't|qualified|supervisor|manual|procedure/i,question:'What must remain unverified, and who owns the final decision?'}
];
export function inspectPrompt(prompt){
 return COACH_SKILLS.map(s=>({name:s.name,ok:s.pattern.test(prompt),question:s.question}));
}
export function coachResponse(prompt,history=[],level='rookie'){
 const signals=inspectPrompt(prompt);
 const missing=signals.filter(s=>!s.ok);
 const previous=history.length?inspectPrompt(history.at(-1).prompt).filter(s=>s.ok).length:0;
 const current=signals.filter(s=>s.ok).length;
 const improved=history.length&&current>previous;
 const praise=improved?'Nice improvement from your previous request. ':current>=4?'That is a focused request. ':'Good start. ';
 if(!missing.length)return praise+'Before we use the result, which claim would you verify against the approved source?';
 if(level==='independent')return praise+'Review what is still missing from your instructions before trusting the output.';
 const selected=missing[0];
 return praise+selected.question+(level==='rookie'?' Add that to your next message and try again.':'');
}
export function practiceAnswer(prompt,work,history=[],level='rookie'){
 const coaching=coachResponse(prompt,history,level);
 const checks=inspectPrompt(prompt);
 const score=checks.filter(s=>s.ok).length;
 return 'SCRIPTED PRACTICE — NOT A LIVE AI RESPONSE\n\nBOLT: '+coaching+'\n\n'+(score>=4?
 'DRAFT FOR REVIEW\n• Reported work order: '+work+'\n• Unknowns: Physical condition, cause, and unverified details.\n• Verify: Check the approved source and assign a qualified human reviewer.\n• Output: Prepare a concise crew-ready draft; no repair or safety-critical action is authorized.':
 'I can draft something useful once the request identifies the job, intended output, evidence, and verification boundaries. No diagnosis or authorization is implied.');
}
export function coachLevel(completed){
 const n=Object.keys(completed||{}).length;
 return n>=4?'independent':n>=2?'apprentice':'rookie';
}
