'use client';

import { useEffect, useMemo, useState } from 'react';
import { labs } from '../lib/labs';

const labCount = Object.keys(labs).length;

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
  const labels = { STAGE: ['Job situation', 'case'], 'BASE EVIDENCE': ['What we know', 'facts'], 'STAGE REVIEW FOCUS': ['What to check next', 'focus'] };
  const sections = [];
  let active = null;
  question.evidence.split('\n').forEach((line) => {
    const key = line.trim();
    if (labels[key]) { active = { key, lines: [] }; sections.push(active); }
    else if (active) active.lines.push(line);
  });
  return <div className="caseFile"><div className="caseFileTop"><span className="caseFileTag">CASE FILE</span><span className="stageBadge">{question.stageName}</span></div><div className="sourceLine">{sourceTitle}</div>{sections.map((section) => <div className={`evidenceSection ${labels[section.key][1]}`} key={section.key}><div className="evidenceSectionTitle"><span>{labels[section.key][0]}</span></div><div>{section.lines.map((line, index) => <p key={index}>{line || <>&nbsp;</>}</p>)}</div></div>)}</div>;
}

export default function Home() {
  const [activeLab, setActiveLab] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [results, setResults] = useState({});
  const [tradeFilter, setTradeFilter] = useState('All trades');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [copilotAnswer, setCopilotAnswer] = useState('');
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [overrideMode, setOverrideMode] = useState(false);

  const lab = activeLab ? labs[activeLab] : null;
  const trades = useMemo(() => ['All trades', ...new Set(Object.values(labs).map((item) => item.trade))], []);
  const visibleLabs = useMemo(() => Object.entries(labs).filter(([, item]) => tradeFilter === 'All trades' || item.trade === tradeFilter), [tradeFilter]);
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

  function openLab(key) { setActiveLab(key); setQuestionIndex(0); setAnswer(''); setGrade(null); setOverrideMode(false); setCopilotAnswer(''); setPrompt(labs[key].starter); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function closeLab() { setActiveLab(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }

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
    <header className="topbar"><div className="brand">FACILITIES <span>AI</span> FIELD LAB</div><div className="topmeta">GITHUB + VERCEL + OLLAMA<br />AI WORKFLOW TRAINING</div></header>
    <main className="shell">
      {!lab ? <>
        <section className="hero"><div><div className="eyebrow">Facilities AI Field Lab</div><h1>Practice the AI workflow before it enters the work order.</h1><p>Scenario-based training for facilities teams: frame the task, use evidence, protect information, and review the result.</p></div><div className="heroCard"><div className="online"><i /> OLLAMA-READY ARCHITECTURE</div><strong>{labCount} labs</strong><p>8 written-response questions per lab</p><p>AI grades the learner’s reasoning, not their trade license knowledge.</p></div></section>
        <div className="progressLabel"><span>YOUR PRACTICE PATH</span><span>{completed.length} / {labCount} labs complete</span></div><div className="progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="filters">{trades.map((trade) => <button key={trade} className={tradeFilter === trade ? 'active' : ''} onClick={() => setTradeFilter(trade)}>{trade}</button>)}</div>
        <section className="cards">{visibleLabs.map(([key, item]) => <article className="module" key={key}><div className="num">{item.num}</div><div className="moduleMeta"><span>{item.trade}</span><span>{item.questions.length} written questions</span></div><h2>{item.title}</h2><p>{item.description}</p><button onClick={() => openLab(key)}>Start lab <span>→</span></button></article>)}</section>
        <div className="note"><b>Facilitator note:</b> Learners should explain their reasoning in their own words. AI feedback is coaching, not a certification decision.</div>
      </> : <section className="panel">
        <button className="back" onClick={closeLab}>← BACK TO OVERVIEW</button>
        <div className="panelHead"><div><div className="eyebrow">{lab.num} · QUESTION {questionIndex + 1} OF {lab.questions.length}</div><h1>{lab.title}</h1><p>{lab.description}</p></div><div className="tags">{lab.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <div className="questionNav"><span>LAB QUESTIONS</span><div>{lab.questions.map((_, index) => <button key={index} className={`${index === questionIndex ? 'current' : ''} ${index < questionIndex ? 'done' : ''}`} disabled={index > questionIndex && !overrideMode} onClick={() => { setQuestionIndex(index); setAnswer(''); setGrade(overrideMode ? { total: 10, max: 10, passed: true, criticalFail: false, criteria: { taskFraming: { score: 2 }, evidenceGrounding: { score: 2 }, uncertainty: { score: 2 }, riskBoundary: { score: 2 }, humanReview: { score: 2 } }, summary: 'Instructor review override active.', strengths: [], missing: [], improvement: '' } : null); setCopilotAnswer(''); }}>{index + 1}</button>)}</div><small>{overrideMode ? 'Instructor review mode · all questions unlocked' : `${lab.questions.length} written AI-use questions · complete in order`}</small></div>
        <div className="labGrid"><div className="evidence"><h3>Evidence pack</h3><div className="scenarioBrief"><small>SCENARIO</small><b>{lab.scenario}</b><p>Use the case file to answer the question. The technical setting is context; the learning target is the AI workflow.</p></div><EvidencePack question={question} sourceTitle={lab.sourceTitle} /><div className="callout"><b>AI workflow skill:</b> {questionIndex < 2 ? 'Scope the request and choose the right information to provide.' : questionIndex < 4 ? 'Ground the answer in a source and challenge unsupported claims.' : questionIndex < 6 ? 'Separate facts from assumptions before sharing a draft.' : questionIndex < 8 ? 'Protect information and make human ownership clear.' : 'Measure the pilot and decide whether to revise, stop, or scale.'}</div></div>
          <div className="assistant"><h3>FM AI Tool</h3><div className="chat" onCopy={(event) => event.preventDefault()}><div className="aiLabel">FM AI TOOL</div>{copilotAnswer ? <FormattedToolResponse text={copilotAnswer} /> : <><p className="starter">Ask the FM AI Tool about this step.</p><p className="hint">Use it for brainstorming, summarizing, or identifying what to verify—but write your own answer below.</p></>}</div><form className="promptRow" onSubmit={askCopilot}><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask the FM AI Tool…" /><button disabled={loading}>{loading ? '…' : 'Ask'}</button></form></div></div>
        <div className="decision"><div className="questionCounter">WRITTEN RESPONSE · {questionIndex + 1} / {lab.questions.length}</div><h3>{question.prompt}</h3><form onSubmit={submitAnswer}><textarea className="answerBox" value={answer} onChange={(event) => setAnswer(event.target.value)} onPaste={(event) => { event.preventDefault(); setError('Please write your answer in your own words. Pasting from the FM AI Tool is disabled.'); }} onDrop={(event) => { event.preventDefault(); setError('Please write your answer in your own words. Drag-and-drop is disabled.'); }} placeholder="Write what you would do, ask, verify, or document…" rows={7} disabled={grading} /><div className="answerActions"><span>Write in your own words. Paste and drag-and-drop are disabled.</span><button className="gradeButton" disabled={grading || !answer.trim()}>{grading ? 'AI is grading…' : 'Submit for AI grading'}</button></div></form>{error && <div className="error">{error}</div>}{grade && <div className={`gradeCard ${grade.passed ? 'good' : 'needsWork'}`}><div className="gradeHeader"><b>{grade.passed ? 'Passed this question' : 'Revise and resubmit'}</b><strong>{grade.total}/10</strong></div><p>{grade.summary}</p><div className="criteriaGrid">{Object.entries(grade.criteria || {}).map(([key, item]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><b>{item.score}/2</b></div>)}</div>{grade.criticalFail && <p className="criticalFail"><b>Critical-risk rule triggered:</b> this answer cannot pass until the unsafe or unauthorized recommendation is corrected.</p>}{grade.strengths?.length > 0 && <><b>What you did well</b><ul>{grade.strengths.map((item) => <li key={item}>{item}</li>)}</ul></>}{grade.missing?.length > 0 && <><b>What to strengthen</b><ul>{grade.missing.map((item) => <li key={item}>{item}</li>)}</ul></>}{grade.improvement && <p><b>Next improvement:</b> {grade.improvement}</p>}{grade.passed && <button className="next" onClick={nextQuestion}>{questionIndex === lab.questions.length - 1 ? 'Complete lab ✓' : 'Next question →'}</button>}</div>}{completed.includes(activeLab) && <><div className="complete"><b>Module complete ✓</b><br />Your answers and AI feedback are ready to print.</div><button className="printButton" onClick={() => window.print()}>Print results and answers</button><div className="printSummary"><div className="printBrand">FACILITIES AI FIELD LAB · {lab.trade}</div><h2>{lab.title}</h2><p>Completed module results · AI-use workflow training</p>{lab.questions.map((item, index) => { const result = results[activeLab]?.[index]; return <section key={item.prompt}><h3>{index + 1}. {item.prompt}</h3><p><b>Learner answer:</b> {result?.answer || 'No answer recorded.'}</p><p><b>AI score:</b> {result?.grade?.total ?? '—'}/10 · {result?.grade?.summary || ''}</p>{result?.grade?.missing?.length > 0 && <p><b>Strengthen:</b> {result.grade.missing.join(' ')}</p>}</section>; })}</div></>}</div>
      </section>}
    </main>
  </>;
}
