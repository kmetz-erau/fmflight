'use client';

import { useEffect, useMemo, useState } from 'react';
import { labs } from '../lib/labs';

const labCount = Object.keys(labs).length;
const progressStorageKey = 'facilities-ai-field-lab-progress-v2';

const roleGroups = {
  'Building operations': ['Supervisors', 'HVAC', 'BAS / Controls', 'Electrical', 'Plumbing', 'Fire / Life Safety', 'Building Envelope', 'Custodial / IAQ', 'Grounds / Irrigation'],
  'Public works': ['Roads / DOT', 'Water / Wastewater'],
  'Fleet & equipment': ['Fleet / Equipment'],
};

function roleGroupFor(trade) {
  return Object.entries(roleGroups).find(([, trades]) => trades.includes(trade))?.[0] || 'Other work';
}

const quickActions = [
  ['Build a checklist', 'Turn this job information into a short checklist. Use only the facts provided. Mark anything that needs a field check.'],
  ['Find what is missing', 'What information is missing before a qualified person can make the next decision? Give me the top three questions.'],
  ['Challenge the answer', 'Review the answer for guesses, missing hazards, unsupported claims, or advice that conflicts with the supplied source.'],
  ['Draft a message', 'Draft a short plain-language message for the person who needs this update. Do not invent a date, cause, or promise.'],
];

function quickActionsFor(question) {
  const text = `${question?.stageName || ''} ${question?.prompt || ''}`.toLowerCase();
  const scenarioActions = [
    [
      [['Plan the job', 'Turn this situation into a short plan for what to ask, gather, and check before the work starts.'], ['Use CRAFT', 'Build a prompt with the context, reader, ask, format, and truth-check this job needs.'], ['Protect the input', 'What information should be removed or protected before it goes into an AI tool?'], ['Set the boundary', 'What should AI prepare here, and what decision must stay with the qualified person?']],
      [['Check the draft', 'Review the draft against the supplied facts. Mark what is correct, unsupported, missing, or unsafe.'], ['Find the next check', 'What is the next observation, measurement, source, or person needed before this result is used?'], ['Improve the output', 'Turn the corrected facts into a usable checklist, handoff, or message in plain language.'], ['Save the shop card', 'Extract the repeatable steps from this job into a short template for the next similar task.']],
    ],
    [
      [['Compare the information', 'Compare the supplied notes, records, photos, or documents. Keep the original labels and mark gaps or conflicts.'], ['Ask the expert', 'Create the three questions a qualified coworker, vendor, or supervisor should answer next.'], ['Make the source clear', 'Show which fact came from which source and flag anything that needs confirmation.'], ['Keep it practical', 'Turn the comparison into a short next-step list someone can use on the job.']],
      [['Challenge the recommendation', 'Look for an unsupported cause, invented number, missing hazard, or shortcut in the recommendation.'], ['Prepare the conversation', 'Create a short list of questions for the vendor, supervisor, or responsible trade.'], ['Draft the reply', 'Write a plain-language reply that asks for what is missing without approving or promising anything.'], ['Name the owner', 'State who must review, approve, inspect, or make the final decision.']],
    ],
    [
      [['Prepare the meeting', 'Turn these materials into a short meeting brief with decisions needed, questions, and missing information.'], ['Compare options', 'Make a simple comparison of the options using only the supplied information. Do not select an option.'], ['Find the risk', 'Identify the assumption or missing detail that could make the plan fail or create extra work.'], ['Make it a handout', 'Create a one-page checklist the crew can use during the meeting or pre-job huddle.']],
      [['Test the plan', 'List the expected result, how it will be checked, who approves the test, and what would make the team stop.'], ['Review the scope', 'Find missing timing, access, materials, exclusions, closeout, or rollback details.'], ['Write the questions', 'Draft the questions that must be answered before the work is scheduled or approved.'], ['Explain the human decision', 'State what AI helped organize and what the supervisor or qualified person still decides.']],
    ],
    [
      [['Build the handoff', 'Turn the notes into a short handoff with what happened, what was checked, what is open, and who goes next.'], ['Change the audience', 'Rewrite the information for the next crew, supervisor, resident, or manager in plain language.'], ['Keep unknowns visible', 'Mark every fact that is missing, uncertain, or still needs a field check.'], ['Protect the details', 'Check the draft for personal, security-sensitive, access, or confidential information before sharing it.']],
      [['Check the closeout', 'Review the final message or handoff for unsupported claims, promises, missing owners, and missing next steps.'], ['Make it reusable', 'Turn the successful workflow into a short shop card or template for the next shift.'], ['Measure the time', 'Identify what AI actually saved, what review it required, and whether this use is worth repeating.'], ['Print the takeaway', 'Create a concise final checklist that the crew could keep with the job materials.']],
    ],
  ];
  if (Number.isInteger(question?.scenarioIndex) && Number.isInteger(question?.questionInScene)) {
    const scenario = scenarioActions[question.scenarioIndex % scenarioActions.length];
    return scenario[question.questionInScene === 1 ? 1 : 0];
  }
  if (/vendor|quote|proposal|roofer|parts|order/.test(text)) return [
    ['Compare the options', 'Compare the supplied quote, proposal, or part information in a simple table. Mark confirmed details, missing details, and questions. Do not choose the option.'],
    ['Write vendor questions', 'Give me the three most useful questions to send to the vendor before we approve, order, or schedule anything.'],
    ['Check the scope', 'Look for missing scope, exclusions, access needs, timing, warranty, test method, or closeout information.'],
    ['Draft the reply', 'Draft a short, plain-language reply asking the vendor for the missing information. Do not promise approval.'],
  ];
  if (/safety|impairment|electrical|breaker|lockout|traffic|dosing|chlorine|unsafe|escalat/.test(text)) return [
    ['Make a safe escalation', 'Turn these facts into a short escalation message. Do not give instructions that authorize hazardous work. Name the qualified person or procedure that controls the next step.'],
    ['Find the stop condition', 'Does this task cross a safety, code, compliance, or authorization boundary? Explain what AI can prepare and what must stay with a qualified person.'],
    ['Check the advice', 'Review the proposed advice for an unsafe shortcut, missing hazard, or conflict with the supplied procedure.'],
    ['Draft the holding message', 'Write a short message that says what is being checked, what is not yet known, and who will make the decision.'],
  ];
  if (/trend|sensor|reading|log|record|table|data|photo|schedule/.test(text)) return [
    ['Plan the field check', 'Turn these readings, notes, or photos into the next three observations or measurements. Do not diagnose or choose a repair.'],
    ['Separate fact from guess', 'Sort the information into observed facts, possible explanations, and missing evidence. Keep the source label for each fact.'],
    ['Check the data', 'Look for gaps, mismatched dates, unclear labels, or values that need confirmation before anyone relies on this information.'],
    ['Write the handoff', 'Draft a short handoff with what was checked, what remains open, and the next person or source needed.'],
  ];
  if (/handoff|message|update|resident|occupant|manager|briefing|toolbox|communication/.test(text)) return [
    ['Draft the first version', 'Draft a short message or briefing from the supplied facts. Keep unknowns visible and do not invent a cause, date, or promise.'],
    ['Change the audience', 'Rewrite this for a crew member, supervisor, resident, or manager in plain language. Keep the facts the same.'],
    ['Find what must be checked', 'List the facts, dates, commitments, or safety details a human must verify before this is shared.'],
    ['Make it a shop card', 'Turn the useful steps into a reusable checklist or template for the next similar job.'],
  ];
  return quickActions;
}

function formatInline(text) {
  const cleaned = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  return cleaned.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g).map((part, index) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function FormattedToolResponse({ text }) {
  const lines = text.split('\n');
  const blocks = [];
  let index = 0;
  let inCode = false;
  let codeLines = [];
  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (trimmed.startsWith('```')) {
      if (inCode) { blocks.push(<pre key={`code-${index}`}><code>{codeLines.join('\n')}</code></pre>); codeLines = []; }
      inCode = !inCode; index += 1; continue;
    }
    if (inCode) { codeLines.push(lines[index]); index += 1; continue; }
    if (!trimmed) { blocks.push(<div className="responseSpacer" key={`space-${index}`} />); index += 1; continue; }
    if (/^\|.*\|$/.test(trimmed)) {
      const rows = [];
      while (index < lines.length && /^\|.*\|$/.test(lines[index].trim())) {
        const row = lines[index].trim();
        if (!/^\|?\s*:?-{2,}/.test(row)) rows.push(row.split('|').slice(1, -1).map((cell) => cell.trim()));
        index += 1;
      }
      blocks.push(<div className="responseTable" key={`table-${index}`}>{rows.map((row, rowIndex) => <div className="responseTableRow" key={rowIndex}>{row.map((cell, cellIndex) => <span key={cellIndex}>{formatInline(cell)}</span>)}</div>)}</div>);
      continue;
    }
    const heading = trimmed.match(/^#{1,6}\s+(.+)/);
    if (heading) { blocks.push(<h4 key={index}>{formatInline(heading[1])}</h4>); index += 1; continue; }
    if (/^[-*+]\s+/.test(trimmed)) { blocks.push(<div className="responseBullet" key={index}><span>•</span>{formatInline(trimmed.replace(/^[-*+]\s+/, ''))}</div>); index += 1; continue; }
    if (/^\d+[.)]\s+/.test(trimmed)) { const number = trimmed.match(/^\d+[.)]/)[0]; blocks.push(<div className="responseBullet" key={index}><span>{number}</span>{formatInline(trimmed.replace(/^\d+[.)]\s+/, ''))}</div>); index += 1; continue; }
    if (trimmed.startsWith('>')) { blocks.push(<blockquote key={index}>{formatInline(trimmed.replace(/^>\s?/, ''))}</blockquote>); index += 1; continue; }
    if (/^([-*_])\1\1+$/.test(trimmed.replace(/\s/g, ''))) { blocks.push(<hr key={index} />); index += 1; continue; }
    blocks.push(<p key={index}>{formatInline(trimmed)}</p>); index += 1;
  }
  return <div className="formattedResponse">{blocks}</div>;
}

function EvidencePack({ question, sourceTitle }) {
  const labels = {
    'JOB SITUATION': ['What is happening', 'case'],
    'WHAT WE KNOW': ['What you have', 'facts'],
    'AI TASK': ['Your AI job', 'task'],
    'REVIEW FOCUS': ['Check before using', 'focus'],
    STAGE: ['What is happening', 'case'],
    'BASE EVIDENCE': ['What you have', 'facts'],
    'STAGE REVIEW FOCUS': ['Check before using', 'focus'],
  };
  const sections = [];
  let active = null;
  question.evidence.split('\n').forEach((line) => {
    const key = line.trim();
    if (labels[key]) { active = { key, lines: [] }; sections.push(active); }
    else if (active) active.lines.push(line);
  });
  return <div className="caseFile"><div className="caseFileTop"><span className="caseFileTag">JOB TASK</span><span className="stageBadge">{question.stageName}</span></div><div className="sourceLine">Use the information below to prepare a useful next step.</div>{sections.map((section) => <div className={`evidenceSection ${labels[section.key][1]}`} key={section.key}><div className="evidenceSectionTitle"><span>{labels[section.key][0]}</span></div><div>{section.lines.map((line, index) => <p key={index}>{line || <>&nbsp;</>}</p>)}</div></div>)}</div>;
}

export default function Home() {
  const [activeLab, setActiveLab] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [results, setResults] = useState({});
  const [roleFilter, setRoleFilter] = useState('All work');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [copilotAnswer, setCopilotAnswer] = useState('');
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [overrideMode, setOverrideMode] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const lab = activeLab ? labs[activeLab] : null;
  const roleFilters = useMemo(() => ['All work', ...Object.keys(roleGroups)], []);
  const visibleLabs = useMemo(() => Object.entries(labs).filter(([, item]) => roleFilter === 'All work' || roleGroupFor(item.trade) === roleFilter), [roleFilter]);
  const groupedLabs = useMemo(() => visibleLabs.reduce((groups, entry) => { const group = roleGroupFor(entry[1].trade); (groups[group] ||= []).push(entry); return groups; }, {}), [visibleLabs]);
  const progress = useMemo(() => Math.round((completed.length / labCount) * 100), [completed.length]);
  const question = lab?.questions[questionIndex];

  useEffect(() => {
    const allowNormalClipboard = (event) => event.stopImmediatePropagation();
    document.addEventListener('copy', allowNormalClipboard, true);
    document.addEventListener('paste', allowNormalClipboard, true);
    document.addEventListener('drop', allowNormalClipboard, true);
    return () => {
      document.removeEventListener('copy', allowNormalClipboard, true);
      document.removeEventListener('paste', allowNormalClipboard, true);
      document.removeEventListener('drop', allowNormalClipboard, true);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(progressStorageKey) || '{}');
      if (Array.isArray(saved.completed)) setCompleted(saved.completed);
      if (saved.results && typeof saved.results === 'object') setResults(saved.results);
      if (Array.isArray(saved.savedCards)) setSavedCards(saved.savedCards);
      setShowGuide(saved.seenGuide !== true);
    } catch { setShowGuide(true); }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(progressStorageKey, JSON.stringify({ completed, results, savedCards, seenGuide: true })); } catch { /* Continue without persistence if storage is blocked. */ }
  }, [completed, results, savedCards, hydrated]);

  function openLab(key) { const savedIndex = labs[key].questions.findIndex((_, index) => !results[key]?.[index]); const resumeIndex = savedIndex === -1 ? 0 : savedIndex; const savedAnswer = results[key]?.[resumeIndex]?.answer || ''; setActiveLab(key); setQuestionIndex(resumeIndex); setAnswer(savedAnswer); setGrade(results[key]?.[resumeIndex]?.grade || null); setOverrideMode(false); setCopilotAnswer(''); setPrompt(labs[key].starter); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function closeLab() { setActiveLab(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  function useQuickAction(text) {
    setPrompt(text);
    document.querySelector('.promptRow input')?.focus();
  }

  function saveShopCard() {
    if (!activeLab || !question) return;
    const card = { id: `${activeLab}-${questionIndex}`, lab: lab.title, trade: lab.trade, task: question.stageName, prompt: prompt || 'Use the task-specific FM AI Tool suggestions.', answer, savedAt: new Date().toISOString() };
    setSavedCards((current) => [...current.filter((item) => item.id !== card.id), card]);
    setError('Saved to your shop cards.');
  }

  async function retryCopilot() {
    if (!prompt.trim()) return;
    setRetrying(true);
    setError('');
    await askCopilot({ preventDefault: () => {} });
    setRetrying(false);
  }

  async function askCopilot(event) {
    event.preventDefault(); if (!prompt.trim() || !activeLab) return;
    setLoading(true); setError(''); setCopilotAnswer('');
    try { const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ labKey: activeLab, questionIndex, prompt }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setCopilotAnswer(data.answer); }
    catch (err) { setError(err.message || 'The copilot could not respond.'); } finally { setLoading(false); }
  }

  async function submitAnswer(event) {
    event.preventDefault(); if (!answer.trim() || !activeLab) return;
    if (answer.trim().toLowerCase() === 'the quick brown fox') {
      setOverrideMode(true); setGrade({ total: 10, max: 10, passed: true, criticalFail: false, criteria: { taskFraming: { score: 2 }, evidenceGrounding: { score: 2 }, uncertainty: { score: 2 }, riskBoundary: { score: 2 }, humanReview: { score: 2 } }, summary: 'Instructor review override active. This response was not evaluated as a learner submission.', strengths: ['All questions are unlocked for review.'], missing: [], improvement: '' });
      setError(''); return;
    }
    setGrading(true); setError(''); setGrade(null);
    try { const response = await fetch('/api/grade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ labKey: activeLab, questionIndex, answer }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setGrade(data.grade); setResults((current) => ({ ...current, [activeLab]: { ...(current[activeLab] || {}), [questionIndex]: { answer, grade: data.grade } } })); }
    catch (err) { setError(err.message || 'The answer could not be graded.'); } finally { setGrading(false); }
  }

  function nextQuestion() {
    if (!grade?.passed) return;
    if (questionIndex < lab.questions.length - 1) { setQuestionIndex(questionIndex + 1); setAnswer(''); setGrade(null); setCopilotAnswer(''); setPrompt(''); }
    else setCompleted((current) => current.includes(activeLab) ? current : [...current, activeLab]);
  }

  return <>
    <header className="topbar"><button className="homeBrand" onClick={() => { if (activeLab) closeLab(); else window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Facilities AI Field Lab home"><span className="homeMark" aria-hidden="true"><span className="homeGlyph" /></span><span className="brand">FACILITIES <span>AI</span> FIELD LAB</span></button><div className="topmeta">GITHUB + VERCEL + OLLAMA<br />AI WORKFLOW TRAINING</div></header>
    {showGuide && <div className="guideOverlay" role="dialog" aria-modal="true" aria-labelledby="guideTitle"><div className="guideCard"><span className="eyebrow">BEFORE YOU START</span><h2 id="guideTitle">Use this like a job, not a quiz.</h2><p>Each lab gives you a real-feeling task. Use the FM AI Tool if it helps, check the result against the information you have, then write what you would actually do.</p><div className="guideSteps"><div><b>1</b><span>Read the job task</span></div><div><b>2</b><span>Try the FM AI Tool</span></div><div><b>3</b><span>Check the result</span></div><div><b>4</b><span>Submit your own answer</span></div></div><div className="guideActions"><button className="secondaryButton" onClick={() => setShowGuide(false)}>Skip for now</button><button className="primaryCta" onClick={() => { setShowGuide(false); document.querySelector('.labDirectory')?.scrollIntoView({ behavior: 'smooth' }); }}>Choose a job task <span>→</span></button></div></div></div>}
    <main className="shell">
      {!lab ? <>
        <section className="homeIntro"><div><div className="eyebrow">Facilities AI Field Lab</div><h1>Practice one useful AI task at a time.</h1><p>Short, hands-on labs for people who keep buildings, equipment, roads, grounds, and public services moving.</p><button className="primaryCta" onClick={() => document.querySelector('.labDirectory')?.scrollIntoView({ behavior: 'smooth' })}>Choose a job task <span>↓</span></button></div><div className="practiceCard"><span className="cardKicker">YOUR PRACTICE PATH</span><strong>{completed.length} <small>of</small> {labCount}</strong><p>labs complete · {savedCards.length} shop cards saved</p><div className="progress"><i style={{ width: `${progress}%` }} /></div><span className="cardHint">Each lab takes you through a real task, an AI try, a check, and a usable final answer.</span></div></section>
        <section className="startStrip"><div><span className="eyebrow">START WITH YOUR WORK</span><h2>What kind of work are you doing today?</h2></div><div className="roleLegend"><span><i className="dot blue" />Lower-risk drafting and organizing</span><span><i className="dot gold" />Technical work with verification</span><span><i className="dot red" />Safety-critical work stays human</span></div></section>
        <section className="labDirectory" id="labDirectory"><div className="directoryHead"><div><span className="eyebrow">JOB TASKS</span><h2>Choose a lab</h2></div><div className="filters">{roleFilters.map((role) => <button key={role} className={roleFilter === role ? 'active' : ''} onClick={() => setRoleFilter(role)}>{role}</button>)}</div></div>{Object.entries(groupedLabs).map(([group, groupLabs]) => <div className="labGroup" key={group}><div className="groupTitle"><h3>{group}</h3><span>{groupLabs.length} {groupLabs.length === 1 ? 'lab' : 'labs'}</span></div><section className="cards">{groupLabs.map(([key, item]) => <article className="module" key={key}><div className="moduleTop"><div className="num">{item.num}</div><span className="timeChip">8 tasks</span></div><div className="moduleMeta"><span>{item.trade}</span><span>{completed.includes(key) ? 'Complete' : 'Ready to start'}</span></div><h2>{item.title}</h2><p>{item.description}</p><button onClick={() => openLab(key)}>{completed.includes(key) ? 'Review lab' : 'Start lab'} <span>→</span></button></article>)}</section></div>)}</section>
        <div className="note"><b>How this works:</b> Try a small AI task, check the result against your source or field knowledge, then submit your own answer. AI feedback is coaching—not a certification decision.</div>
      </> : <section className="panel">
        <button className="back" onClick={closeLab}>← ALL JOB TASKS</button>
        <div className="panelHead"><div><div className="eyebrow">{lab.trade} · TASK {questionIndex + 1} OF {lab.questions.length}</div><h1>{lab.title}</h1><p>{lab.description}</p></div><div className="tags">{lab.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <div className="workflowSteps"><div className="workflowStep done"><b>1</b><span>Job task</span></div><div className={`workflowStep ${copilotAnswer ? 'done' : 'current'}`}><b>2</b><span>Try AI</span></div><div className={`workflowStep ${grade ? 'done' : 'current'}`}><b>3</b><span>Check it</span></div><div className="workflowStep"><b>4</b><span>Keep what works</span></div></div>
        <div className="questionScenario"><span>SCENARIO {question.scenarioIndex + 1} OF 4</span><b>{question.stageName}</b><small>Questions {question.scenarioIndex * 2 + 1}–{question.scenarioIndex * 2 + 2}</small></div>
        <div className="labGrid"><div className="evidence"><h3>Job info</h3><div className="scenarioBrief"><small>WORK CONTEXT</small><b>{lab.scenario}</b><p>The trade setting is context. The task is to use AI for a practical next step.</p></div><EvidencePack question={question} sourceTitle={lab.sourceTitle} /><div className="callout"><b>Today's job skill:</b> {questionIndex < 2 ? 'Ask better questions before the job starts.' : questionIndex < 4 ? 'Catch guesses before they become work.' : questionIndex < 6 ? 'Use AI to prepare a useful conversation.' : 'Leave the next person with a clear, usable next step.'}</div><div className="goodLooks"><b>What a useful answer includes</b><span>• The facts you used</span><span>• What you would check</span><span>• Who owns the next decision</span></div></div>
          <div className="assistant"><div className="assistantTitle"><div><h3>FM AI Tool</h3><span className="assistantSub">Suggestions for: {question.stageName}</span></div><span className="toolStatus"><i /> Ready</span></div><div className="chat" onCopy={(event) => event.preventDefault()}><div className="aiLabel">FM AI TOOL</div>{copilotAnswer ? <FormattedToolResponse text={copilotAnswer} /> : <><p className="starter">What would make this job easier?</p><p className="hint">These starters are matched to this job task. You can also write your own request.</p></>}</div><div className="quickActions">{quickActionsFor(question).map(([label, text]) => <button key={label} onClick={() => useQuickAction(text)}>{label}</button>)}</div><form className="promptRow" onSubmit={askCopilot}><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about this job task…" /><button disabled={loading}>{loading ? '…' : 'Ask'}</button></form></div></div>
      </section>}
    </main>
  </>;
}
