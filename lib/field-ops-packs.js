// Scenario packs are fictional training records. They are not equipment instructions.
const incidentNotes={
 dispatch:[
  ['Occupant call','Caller reports a comfort or service problem; the time and location are recorded but no cause is established.'],
  ['Dispatch update','The requester says the condition began before the morning shift; no qualified technician has inspected the equipment.'],
  ['Previous shift note','A similar complaint was logged last month, but no evidence links it to this incident.']
 ],
 sort:[
  ['Work-order attachment','A draft ticket contains a caller phone number and an access code; neither belongs in an AI prompt.'],
  ['Field intake','The reported condition has not been confirmed by a site visit.'],
  ['Records check','A screenshot is missing the asset identification and timestamp.']
 ],
 duel:[
  ['Asset register','The asset record uses a different room or zone label than the work order.'],
  ['Dispatch record','The work order lists a location that needs to be checked against the site directory.'],
  ['Site map note','The map legend is older than the current work order and may use retired room names.']
 ],
 detective:[
  ['Vendor reply','The vendor requests manufacturer, model, serial number, and verified symptom before identifying parts.'],
  ['Equipment photo','The photo does not show a readable nameplate; no model-specific source is attached.'],
  ['Maintenance history','A prior service note mentions a similar symptom but does not confirm the current cause.']
 ],
 handoff:[
  ['Shift log','The outgoing crew recorded the reported symptom but did not confirm a repair.'],
  ['Supervisor message','The next shift needs open questions, verified observations, and a named reviewer.'],
  ['Dispatch status','The ticket remains open pending qualified review and source verification.']
 ]
};
const variants=[
 {name:'Morning callback',detail:'A caller updated the reported time. The new report has not been field-verified.',claim:'The updated caller report proves the cause.',why:'A callback is still reported information, not verified diagnosis.'},
 {name:'Conflicting record',detail:'The equipment label in a supporting record does not match the work-order label.',claim:'Both equipment labels definitely refer to the same asset.',why:'Conflicting asset identifiers require an authoritative source check.'},
 {name:'Incomplete photo',detail:'A new photo arrived, but the model plate and measurement details are unreadable.',claim:'The photo confirms the exact replacement part needed.',why:'An unreadable photo cannot support a part selection.'},
 {name:'Old service note',detail:'A previous repair record describes a similar symptom, but it is from a different date.',claim:'The previous repair proves the current problem has the same cause.',why:'Similar symptoms on another date do not establish the current cause.'}
];
export function buildFieldPack(caseId,trade,mission,variantIndex=0){
 const v=variants[Math.abs(variantIndex)%variants.length];
 const notes=incidentNotes[caseId]||incidentNotes.dispatch;
 const location=trade.place;
 const work=mission.brief(trade);
 const records=[
  {id:'ticket',title:'Dispatch ticket',body:work,answer:'reported',why:'The ticket records a report, not a confirmed diagnosis.'},
  {id:'record',title:notes[0][0],body:notes[0][1]+' Location: '+location+'.',answer:'reported',why:'This is source information to cite as reported.'},
  {id:'update',title:v.name,body:v.detail+' Location under review: '+location+'.',answer:'unknown',why:'The new detail has not been reconciled with an authoritative source.'},
  {id:'missing',title:notes[1][0],body:notes[1][1],answer:'unknown',why:'This needs a field or source check before acting.'},
  {id:'private',title:'Restricted attachment',body:'A requester included private contact details and a building access credential (actual values withheld).',answer:'private',why:'Do not send personal information or access credentials to an AI tool.'}
 ];
 const claims=[
  {id:'reported',title:'The work order reports an issue at '+location+'.',answer:'supported',why:'The work order supports this as a reported issue, not a verified diagnosis.'},
  {id:'guess',title:v.claim,answer:'unverified',why:v.why},
  {id:'safety',title:'BOLT can authorize bypassing the approved procedure to speed up the response.',answer:'unsafe',why:'AI cannot approve hazardous work or override qualified personnel.'},
  {id:'source',title:'The available records should be compared and any mismatch sent for qualified review.',answer:'supported',why:'Comparing records and escalating uncertainty is appropriate AI-assisted preparation.'}
 ];
 return {work,location,records,claims,radio:'Dispatch received new information: '+v.detail+' The original work order remains open. Neither source has been confirmed in the field.',variant:v.name,notes:notes.map(n=>n[0]+': '+n[1])};
}
