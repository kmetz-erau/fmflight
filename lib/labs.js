export const labs = {
  manual: {
    num: 'LAB 01 · SOURCE CHECKING',
    title: 'Ask the manual',
    description:
      'Use AI to find an answer, then prove it came from the source before anyone energizes the unit.',
    sourceTitle: 'SOURCE PACK · AHU START-UP GUIDE · p. 18',
    source: `Before energizing:\n• Confirm filters are installed and access panels are secured.\n• Verify the supply fan rotates in the correct direction.\n• Confirm the outdoor-air damper moves freely.\n• Check that the condensate trap is primed.\n\nImportant: The guide does not specify a universal fan rotation test voltage or a “normal” discharge temperature.`,
    starter: 'What are the pre-start checks listed in the guide?',
    question: 'Which follow-up is safest?',
    choices: [
      {
        text: 'Ask AI for the normal discharge temperature and use that as the acceptance limit.',
        correct: false,
        feedback: 'The source explicitly does not provide a universal value.',
      },
      {
        text: 'Open page 18 and confirm the four checks against the actual unit before energizing.',
        correct: true,
        feedback: 'Correct. The source and the equipment both need to be checked.',
      },
      {
        text: 'Skip the condensate trap; it is only relevant during cooling season.',
        correct: false,
        feedback: 'A missing or unprimed trap can create an immediate operational problem.',
      },
    ],
    tags: ['SOURCE CITATION', 'NO INVENTED VALUES', 'VERIFY IN FIELD'],
  },
  trouble: {
    num: 'LAB 02 · DIAGNOSIS',
    title: 'Troubleshoot safely',
    description:
      'Make AI suggest causes—but choose the next useful measurement yourself.',
    sourceTitle: 'CASE FILE · CONFERENCE ROOM 204',
    source: `Complaint: 76°F at 2:10 PM; setpoint 72°F.\nTrend: Zone temperature rising. Supply-air temperature is 55°F. Zone damper command is 100%.\nAI suggestions: bad sensor, low airflow, or excessive room load.\n\nKnown: A command is not proof that the damper physically moved.`,
    starter: 'What should I measure next?',
    question: 'What should you do next?',
    choices: [
      {
        text: 'Replace the zone sensor immediately; AI listed it first.',
        correct: false,
        feedback: 'A possible cause is not proof. You need a confirming measurement.',
      },
      {
        text: 'Command the damper to 100% again and wait for the room to catch up.',
        correct: false,
        feedback: 'Repeating a command does not verify physical airflow.',
      },
      {
        text: 'Verify actual airflow or damper position, then compare the zone sensor to a reference.',
        correct: true,
        feedback: 'Correct. You are testing the highest-value uncertainty before changing parts.',
      },
    ],
    tags: ['EVIDENCE FIRST', 'COMMAND ≠ PROOF', 'MEASURE BEFORE REPLACE'],
  },
  review: {
    num: 'LAB 03 · QUALITY CONTROL',
    title: 'Review the work order',
    description:
      'Catch invented details and missing hazards in a polished AI draft.',
    sourceTitle: 'AI-GENERATED WORK ORDER DRAFT',
    source: `Issue: AHU-2 is failing to cool because the compressor is low on refrigerant.\nAction: Technician will add refrigerant tomorrow and return the unit to normal operation.\nNotes: Customer was notified. No safety concerns.\n\nOriginal field note: “AHU-2 warm call. Supply fan running. SAT 63°F, setpoint 55°F. Filter looks loaded. Did not access roof due to rain.”`,
    starter: 'Summarize the field note without adding facts.',
    question: 'What is the most important correction?',
    choices: [
      {
        text: 'Change “low on refrigerant” to “possible low cooling capacity; diagnosis incomplete.”',
        correct: true,
        feedback: 'Correct. The work order must separate observed facts from an unverified diagnosis.',
      },
      {
        text: 'Keep the diagnosis but make the wording more concise.',
        correct: false,
        feedback: 'Concise unsupported claims are still unsafe and misleading.',
      },
      {
        text: 'Remove the rain detail because it makes the work order look unfinished.',
        correct: false,
        feedback: 'The access limitation is important context for the next technician.',
      },
    ],
    tags: ['OBSERVED VS INFERRED', 'SAFETY CONTEXT', 'HONEST HANDOFF'],
  },
};

export function buildSystemPrompt(lab) {
  return `You are a cautious AI copilot in a facilities training simulator. You are not a controls engineer, safety officer, or substitute for the manufacturer's instructions.\n\nRules:\n- Use only the evidence provided by the learner and the evidence pack below.\n- Clearly label observations, inferences, and unknowns.\n- Never invent setpoints, readings, code requirements, or manufacturer procedures.\n- Ask for a measurement or source check before recommending a part replacement or live-system change.\n- For safety-critical work, recommend following the site's approved procedure and involving a qualified person.\n- Keep the answer concise and explain what evidence supports it.\n\nEvidence pack (${lab.sourceTitle}):\n${lab.source}`;
}
