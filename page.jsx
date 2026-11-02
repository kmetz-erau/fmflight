'use client';

import { useMemo, useState } from 'react';
import { labs } from '../lib/labs';

const labCount = Object.keys(labs).length;

function formatInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part);
}

function FormattedToolResponse({ text }) {
  return <div className="formattedResponse">{text.split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div className="responseSpacer" key={index} />;
    if (trimmed.startsWith('### ')) return <h4 key={index}>{formatInline(trimmed.slice(4))}</h4>;
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <div className="responseBullet" key={index}><span>•</span>{formatInline(trimmed.slice(2))}</div>;
    if (/^\d+\.\s/.test(trimmed)) return <div className="responseBullet" key={index}><span>{trimmed.match(/^\d+/)[0]}.</span>{formatInline(trimmed.replace(/^\d+\.\s/, ''))}</div>;
    return <p key={index}>{formatInline(trimmed)}</p>;
  })}</div>;
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

  const lab = activeLab ? labs[activeLab] : null;
  const trades = useMemo(() => ['All trades', ...new Set(Object.values(labs).map((item) => item.trade))], []);
  const visibleLabs = useMemo(() => Object.entries(labs).filter(([, item]) => tradeFilter === 'All trades' || item.trade === tradeFilter), [tradeFilter]);
  const progress = useMemo(() => Math.round((completed.length / labCount) * 100), [completed.length]);
  const question = lab?.questions[questionIndex];

  function openLab(key) { setActiveLab(key); setQuestionIndex(0); setAnswer(''); setGrade(null); setCopilotAnswer(''); setPrompt(labs[key].starter); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function closeLab() { setActiveLab(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  async function askCopilot(event) {
    event.preventDefault(); if (!prompt.trim() || !activeLab) return;
    setLoading(true); setError(''); setCopilotAnswer('');
    try { const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ labKey: activeLab, prompt }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setCopilotAnswer(data.answer); }
    catch (err) { setError(err.message || 'The copilot could not respond.'); } finally { setLoading(false); }
  }

  async function submitAnswer(event) {
    event.preventDefault(); if (!answer.trim() || !activeLab) return;
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
        <section className="hero"><div><div className="eyebrow">Facilities AI Field Lab</div><h1>Practice the AI workflow before it enters the work order.</h1><p>Scenario-based training for facilities teams: frame the task, use evidence, protect information, and review the result.</p></div><div className="heroCard"><div className="online"><i /> OLLAMA-READY ARCHITECTURE</div><strong>{labCount} labs</strong><p>10 written-response questions per lab</p><p>AI grades the learner’s reasoning, not their trade license knowledge.</p></div></section>
        <div className="progressLabel"><span>YOUR PRACTICE PATH</span><span>{completed.length} / {labCount} labs complete</span></div><div className="progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="filters">{trades.map((trade) => <button key={trade} className={tradeFilter === trade ? 'active' : ''} onClick={() => setTradeFilter(trade)}>{trade}</button>)}</div>
        <section className="cards">{visibleLabs.map(([key, item]) => <article className="module" key={key}><div className="num">{item.num}</div><div className="moduleMeta"><span>{item.trade}</span><span>{item.questions.length} written questions</span></div><h2>{item.title}</h2><p>{item.description}</p><button onClick={() => openLab(key)}>Start lab <span>→</span></button></article>)}</section>
        <div className="note"><b>Facilitator note:</b> Learners should explain their reasoning in their own words. AI feedback is coaching, not a certification decision.</div>
      </> : <section className="panel">
        <button className="back" onClick={closeLab}>← BACK TO OVERVIEW</button>
        <div className="panelHead"><div><div className="eyebrow">{lab.num} · QUESTION {questionIndex + 1} OF {lab.questions.length}</div><h1>{lab.title}</h1><p>{lab.description}</p></div><div className="tags">{lab.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <div className="questionNav"><span>LAB QUESTIONS</span><div>{lab.questions.map((_, index) => <button key={index} className={`${index === questionIndex ? 'current' : ''} ${index < questionIndex ? 'done' : ''}`} disabled={index > questionIndex} onClick={() => { setQuestionIndex(index); setAnswer(''); setGrade(null); setCopilotAnswer(''); }}>{index + 1}</button>)}</div><small>10 written AI-use questions · complete in order</small></div>
        <div className="labGrid"><div className="evidence"><h3>Evidence pack</h3><div className="document"><small>{lab.sourceTitle}</small>{lab.evidence.split('\n').map((line, index) => <p key={index}>{line || <>&nbsp;</>}</p>)}</div><div className="callout"><b>AI-use target:</b> {questionIndex < 3 ? 'Frame the task and ground the request.' : questionIndex < 6 ? 'Challenge the output and ask for verification.' : 'Protect data and create a reviewable handoff.'}</div></div>
          <div className="assistant"><h3>FM AI Tool</h3><div className="chat" onCopy={(event) => event.preventDefault()}><div className="aiLabel">FM AI TOOL</div>{copilotAnswer ? <FormattedToolResponse text={copilotAnswer} /> : <><p className="starter">Ask the FM AI Tool about this step.</p><p className="hint">Use it for brainstorming, summarizing, or identifying what to verify—but write your own answer below.</p></>}</div><form className="promptRow" onSubmit={askCopilot}><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask the FM AI Tool…" /><button disabled={loading}>{loading ? '…' : 'Ask'}</button></form></div></div>
        <div className="decision"><div className="questionCounter">WRITTEN RESPONSE · {questionIndex + 1} / {lab.questions.length}</div><h3>{question.prompt}</h3><form onSubmit={submitAnswer}><textarea className="answerBox" value={answer} onChange={(event) => setAnswer(event.target.value)} onPaste={(event) => { event.preventDefault(); setError('Please write your answer in your own words. Pasting from the FM AI Tool is disabled.'); }} onDrop={(event) => { event.preventDefault(); setError('Please write your answer in your own words. Drag-and-drop is disabled.'); }} placeholder="Write what you would do, ask, verify, or document…" rows={7} disabled={grading} /><div className="answerActions"><span>Write in your own words. Paste and drag-and-drop are disabled.</span><button className="gradeButton" disabled={grading || !answer.trim()}>{grading ? 'AI is grading…' : 'Submit for AI grading'}</button></div></form>{error && <div className="error">{error}</div>}{grade && <div className={`gradeCard ${grade.passed ? 'good' : 'needsWork'}`}><div className="gradeHeader"><b>{grade.passed ? 'Passed this question' : 'Revise and resubmit'}</b><strong>{grade.total}/10</strong></div><p>{grade.summary}</p><div className="criteriaGrid">{Object.entries(grade.criteria || {}).map(([key, item]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><b>{item.score}/2</b></div>)}</div>{grade.criticalFail && <p className="criticalFail"><b>Critical-risk rule triggered:</b> this answer cannot pass until the unsafe or unauthorized recommendation is corrected.</p>}{grade.strengths?.length > 0 && <><b>What you did well</b><ul>{grade.strengths.map((item) => <li key={item}>{item}</li>)}</ul></>}{grade.missing?.length > 0 && <><b>What to strengthen</b><ul>{grade.missing.map((item) => <li key={item}>{item}</li>)}</ul></>}{grade.improvement && <p><b>Next improvement:</b> {grade.improvement}</p>}{grade.passed && <button className="next" onClick={nextQuestion}>{questionIndex === lab.questions.length - 1 ? 'Complete lab ✓' : 'Next question →'}</button>}</div>}{completed.includes(activeLab) && <><div className="complete"><b>Module complete ✓</b><br />Your answers and AI feedback are ready to print.</div><button className="printButton" onClick={() => window.print()}>Print results and answers</button><div className="printSummary"><div className="printBrand">FACILITIES AI FIELD LAB · {lab.trade}</div><h2>{lab.title}</h2><p>Completed module results · AI-use workflow training</p>{lab.questions.map((item, index) => { const result = results[activeLab]?.[index]; return <section key={item.prompt}><h3>{index + 1}. {item.prompt}</h3><p><b>Learner answer:</b> {result?.answer || 'No answer recorded.'}</p><p><b>AI score:</b> {result?.grade?.total ?? '—'}/10 · {result?.grade?.summary || ''}</p>{result?.grade?.missing?.length > 0 && <p><b>Strengthen:</b> {result.grade.missing.join(' ')}</p>}</section>; })}</div></>}</div>
      </section>}
    </main>
  </>;
}
