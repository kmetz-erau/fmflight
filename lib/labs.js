// These are AI-use exercises with trade-specific context, not technical
// qualification tests. Replace the illustrative evidence with site-approved
// documents and examples before using them for operational training.
const choice = (text, correct, feedback) => ({ text, correct, feedback });

function aiQuestions(lab) {
  const { trade, scenario, evidence, risk, verification, goodHandoff, sensitive } = lab;
  return [
    { prompt: `What is the best first prompt for this ${trade} situation?`, choices: [
      choice(`“Fix this ${trade} problem.”`, false, 'Too vague. AI needs a defined task and the evidence you want it to use.'),
      choice(`“Summarize the ${scenario} using only the attached evidence. Separate observations, inferences, and unknowns.”`, true, 'Correct. This frames AI as an evidence-organizing assistant.'),
      choice('“Tell me everything an expert would know.”', false, 'That invites broad, unsupported content rather than a reviewable answer.'),
    ]},
    { prompt: 'What context should you add before asking AI for help?', choices: [
      choice('The asset or location, the task, the audience, and the source documents available.', true, 'Correct. Context reduces guessing and makes the output useful.'),
      choice('Only the desired conclusion.', false, 'That can bias the answer and hide uncertainty.'),
      choice('Every document in the department, whether relevant or not.', false, 'More context is not always better; irrelevant material creates noise.'),
    ]},
    { prompt: 'How should AI treat the evidence pack?', choices: [
      choice('As a source to cite, while clearly labeling anything the source does not establish.', true, 'Correct. Grounding and uncertainty are central habits.'),
      choice('As optional background if AI already knows the topic.', false, 'The training task is to use the supplied evidence, not generic memory.'),
      choice('As permission to fill in missing values with typical industry numbers.', false, 'Typical values can be wrong for the actual site or equipment.'),
    ]},
    { prompt: 'AI gives a confident answer that is not supported by the evidence. What should you do?', choices: [
      choice('Accept it because the wording is confident.', false, 'Confidence is not verification.'),
      choice('Ask AI to identify the exact source passage—or label the claim unverified.', true, 'Correct. Require traceability or keep the claim as a hypothesis.'),
      choice('Delete the source so AI can reason freely.', false, 'Removing evidence makes review harder, not safer.'),
    ]},
    { prompt: 'Which follow-up question improves the answer most?', choices: [
      choice(`“What information is missing before I act, and what is the safest way to verify it?”`, true, 'Correct. It turns an answer into a verification plan.'),
      choice('“Can you make that sound more certain?”', false, 'More certainty without more evidence is a quality problem.'),
      choice('“What would you do if you were physically here?”', false, 'AI is not physically inspecting the site and should not pretend it is.'),
    ]},
    { prompt: 'Which AI output needs the most correction?', choices: [
      choice(`“The likely issue is ${lab.badClaim}.”`, true, 'Correct. A likely cause must be labeled as a hypothesis and paired with a check.'),
      choice('“Here are the observations copied from the note.”', false, 'That can be useful if the copy is accurate.'),
      choice('“These are the questions I would ask the responsible trade.”', false, 'Question generation is an appropriate AI task.'),
    ]},
    { prompt: 'What is the correct safety boundary for this scenario?', choices: [
      choice('AI may replace the site procedure if its answer seems reasonable.', false, 'AI does not replace approved procedures, authorization, or qualified judgment.'),
      choice(`Use AI for preparation and documentation, but follow the approved procedure and escalate ${risk}.`, true, 'Correct. AI supports the workflow; it does not authorize hazardous work.'),
      choice('Avoid documenting the risk so the work order stays simple.', false, 'Risk context belongs in a responsible handoff.'),
    ]},
    { prompt: 'Which information should you remove or protect before sending it to an AI tool?', choices: [
      choice(`${sensitive}, unless the organization has approved that tool and data path.`, true, 'Correct. Minimize sensitive data and follow the organization’s AI policy.'),
      choice('Nothing; work information is never sensitive.', false, 'Facilities data can include personal, security, operational, or commercial information.'),
      choice('The evidence source, because citations are private.', false, 'Source provenance is valuable; protect sensitive content rather than deleting accountability.'),
    ]},
    { prompt: 'What should the final AI-assisted handoff contain?', choices: [
      choice(goodHandoff, true, 'Correct. A reviewable handoff shows what was observed, inferred, checked, and left open.'),
      choice('Only the AI-generated recommendation.', false, 'The next person needs the evidence and uncertainty, not just a conclusion.'),
      choice('A statement that AI was right.', false, 'AI is a tool; the handoff should describe the work and evidence.'),
    ]},
    { prompt: 'What is the strongest reflection after completing the task?', choices: [
      choice(`“I know what AI drafted, what I verified, and what still requires a ${verification}.”`, true, 'Correct. Good AI use ends with human review and a next action.'),
      choice('“AI saved time, so review was unnecessary.”', false, 'Time saved is not a substitute for review.'),
      choice('“The best prompt is the longest prompt.”', false, 'The best prompt is clear, scoped, and grounded in relevant evidence.'),
    ]},
  ];
}

const configs = [
  { key: 'hvac', trade: 'HVAC', difficulty: 'Foundations', num: 'HVAC 01 · AI WORKFLOW', title: 'Use AI with an air-handler manual', description: 'Practice turning a manual and a startup note into a source-grounded checklist.', sourceTitle: 'ILLUSTRATIVE SOURCE PACK · AHU START-UP GUIDE', scenario: 'an AHU pre-start checklist', evidence: 'The manual lists filters, access panels, fan rotation, outdoor-air damper movement, and a primed condensate trap. It does not provide a universal discharge temperature.', badClaim: 'the fan must be wired for a specific voltage', risk: 'before energizing equipment', verification: 'source check and field observation', sensitive: 'building access details and tenant information', goodHandoff: 'The cited source checks, observed status, open checks, and the person responsible for verification.', tags: ['PROMPT FRAMING', 'SOURCE GROUNDING', 'HUMAN REVIEW'] },
  { key: 'bas', trade: 'BAS / Controls', difficulty: 'Intermediate', num: 'BAS 01 · AI WORKFLOW', title: 'Use AI with BAS trends', description: 'Practice asking AI to organize a comfort complaint without letting it diagnose from one trend.', sourceTitle: 'ILLUSTRATIVE CASE · CONFERENCE ROOM 204', scenario: 'a warm conference-room complaint', evidence: 'Zone temperature is 76°F, setpoint is 72°F, supply air is 55°F, and damper command is 100%. A command is not proof of physical airflow.', badClaim: 'the actuator has definitely failed', risk: 'before changing a sensor, actuator, or controller', verification: 'actual airflow, physical position, and a reference reading', sensitive: 'occupant names, schedules, and security-related point names', goodHandoff: 'Observed trends, AI hypotheses labeled as hypotheses, the next measurement, and what was not confirmed.', tags: ['TREND INTERPRETATION', 'HYPOTHESES', 'NEXT MEASUREMENT'] },
  { key: 'electrical', trade: 'Electrical', difficulty: 'Safety-critical', num: 'ELEC 01 · AI WORKFLOW', title: 'Use AI for electrical triage', description: 'Practice using AI to structure a safe report without asking it to replace electrical procedures.', sourceTitle: 'ILLUSTRATIVE CASE · REPEATED BREAKER TRIP', scenario: 'a repeated breaker-trip report', evidence: 'A receptacle circuit tripped after a portable heater was connected. A damp ceiling tile is visible nearby. The cause is not established.', badClaim: 'the circuit is definitely overloaded', risk: 'before resetting, opening a panel, or troubleshooting energized equipment', verification: 'the approved electrical procedure and a qualified person', sensitive: 'panel schedules, security areas, and occupant information', goodHandoff: 'The report, affected circuit, immediate controls, evidence preserved, procedure followed, and escalation owner.', tags: ['SAFE BOUNDARIES', 'ESCALATION', 'DATA MINIMIZATION'] },
  { key: 'plumbing', trade: 'Plumbing', difficulty: 'Foundations', num: 'PLUMB 01 · AI WORKFLOW', title: 'Use AI for a leak handoff', description: 'Practice using AI to organize a water incident while keeping the source uncertain.', sourceTitle: 'ILLUSTRATIVE CASE · CEILING LEAK', scenario: 'a leak above an occupied tenant space', evidence: 'Water is near a ceiling light after rain. The nearest restroom is one floor above and a roof drain is nearby. No source is confirmed.', badClaim: 'the roof drain is clogged', risk: 'when water is near people or energized equipment', verification: 'the responsible trade and a safe site inspection', sensitive: 'tenant names, photos with personal information, and access codes', goodHandoff: 'Location, time, affected equipment, safe controls, photos handled appropriately, and the source still unconfirmed.', tags: ['FACTS VS ASSUMPTIONS', 'INCIDENT NOTES', 'HANDOFFS'] },
  { key: 'lifeSafety', trade: 'Fire / Life Safety', difficulty: 'Safety-critical', num: 'FLS 01 · AI WORKFLOW', title: 'Use AI around life-safety impairments', description: 'Practice using AI for documentation and escalation without bypassing an impairment procedure.', sourceTitle: 'ILLUSTRATIVE CASE · OFFLINE SMOKE DETECTOR POINT', scenario: 'an offline fire-alarm point in an occupied wing', evidence: 'One smoke-detector point is offline. A ceiling contractor worked nearby. The cause is unknown and the building is occupied.', badClaim: 'the contractor damaged the detector', risk: 'when a life-safety point may be impaired', verification: 'the designated responsible person and approved impairment procedure', sensitive: 'detector maps, security layouts, and occupancy details', goodHandoff: 'Point and area, time observed, panel state, responsible person notified, procedure status, and unknown cause.', tags: ['IMPAIRMENT', 'ESCALATION', 'PROVENANCE'] },
  { key: 'envelope', trade: 'Building Envelope', difficulty: 'Intermediate', num: 'ENVELOPE 01 · AI WORKFLOW', title: 'Use AI to review roof notes', description: 'Practice turning inspection notes into a cautious summary without claiming a hidden water path is proven.', sourceTitle: 'ILLUSTRATIVE NOTES · ROOF ZONE C', scenario: 'a roof-leak inspection summary', evidence: 'An interior stain is south of a patched penetration. No moisture reading was taken. Water may travel along assemblies and roof access has fall-protection requirements.', badClaim: 'the penetration is definitely the entry point', risk: 'before requesting roof access or recommending a repair', verification: 'a controlled inspection under the site access procedure', sensitive: 'roof plans, access routes, and photos that reveal security controls', goodHandoff: 'Direct observations, limitations, weather context, AI inferences labeled clearly, and the safe follow-up inspection.', tags: ['UNCERTAINTY', 'INSPECTION NOTES', 'SAFETY CONTEXT'] },
  { key: 'iaq', trade: 'Custodial / IAQ', difficulty: 'Foundations', num: 'IAQ 01 · AI WORKFLOW', title: 'Use AI with an IAQ complaint', description: 'Practice organizing an occupant complaint without making unsupported health claims.', sourceTitle: 'ILLUSTRATIVE CASE · STALE-AIR COMPLAINT', scenario: 'an indoor-air-quality complaint', evidence: 'A room smells stale in the afternoon. CO₂ is 1,250 ppm from an unverified sensor. Occupancy was 18. Filter date and outdoor-air measurement are unknown.', badClaim: 'the air is unsafe because of one CO₂ reading', risk: 'before communicating a health or safety conclusion', verification: 'sensor verification, operating context, and the approved IAQ process', sensitive: 'occupant names, health details, and room-use schedules', goodHandoff: 'The complaint, time pattern, data quality limits, observations, non-health claim language, and next checks.', tags: ['DATA QUALITY', 'COMMUNICATION', 'NO HEALTH CLAIMS'] },
  { key: 'grounds', trade: 'Grounds / Irrigation', difficulty: 'Foundations', num: 'GROUNDS 01 · AI WORKFLOW', title: 'Use AI with irrigation data', description: 'Practice distinguishing a controller command from actual water delivery and coverage.', sourceTitle: 'ILLUSTRATIVE CASE · IRRIGATION ZONE 7', scenario: 'a dry landscape zone with a successful controller log', evidence: 'The controller logged 20 minutes of runtime. Turf is dry, a valve box is wet, and no flow or head-coverage reading is attached.', badClaim: 'the controller is broken', risk: 'before increasing runtime or replacing components', verification: 'a safe field check of valve, flow, and coverage', sensitive: 'property maps, access schedules, and camera locations', goodHandoff: 'Controller command, observed dry area, checks pending, water-use concern, and the person assigned to verify delivery.', tags: ['RESOURCE USE', 'COMMAND VS RESULT', 'FIELD DATA'] },
];

export const labs = Object.fromEntries(configs.map((lab) => [lab.key, { ...lab, questions: aiQuestions(lab), starter: `Help me plan the AI-assisted workflow for ${lab.scenario}.` }]));

export function buildSystemPrompt(lab) {
  return `You are a cautious AI copilot in a facilities training simulator. You are not a licensed tradesperson, safety officer, or substitute for manufacturer instructions or site procedures.\n\nRules:\n- Use only the learner's evidence and the evidence pack below.\n- Label observations, inferences, and unknowns.\n- Never invent readings, setpoints, code requirements, or procedures.\n- Help the learner frame tasks, summarize, compare, draft, and identify verification steps.\n- Do not provide unsafe workarounds for electrical, life-safety, roof access, confined-space, chemical, or other hazardous work.\n- Protect personal, security-sensitive, and confidential facilities information.\n- Keep answers concise and explain what evidence supports them.\n\nEvidence pack (${lab.sourceTitle}):\n${lab.evidence}`;
}
