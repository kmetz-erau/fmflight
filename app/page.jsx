'use client';

import { useMemo, useState } from 'react';
import { labs } from '../lib/labs';

const labCount = Object.keys(labs).length;

export default function Home() {
  const [activeLab, setActiveLab] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [tradeFilter, setTradeFilter] = useState('All trades');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const lab = activeLab ? labs[activeLab] : null;
  const trades = useMemo(() => ['All trades', ...new Set(Object.values(labs).map((item) => item.trade))], []);
  const visibleLabs = useMemo(() => Object.entries(labs).filter(([, item]) => tradeFilter === 'All trades' || item.trade === tradeFilter), [tradeFilter]);
  const progress = useMemo(() => Math.round((completed.length / labCount) * 100), [completed.length]);
  const question = lab?.questions[questionIndex];

  function openLab(key) {
    setActiveLab(key); setQuestionIndex(0); setSelected(null); setPrompt(labs[key].starter); setAnswer(''); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeLab() { setActiveLab(null); setSelected(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  async function askCopilot(event) {
    event.preventDefault();
    if (!prompt.trim() || !activeLab) return;
    setLoading(true); setError(''); setAnswer('');
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ labKey: activeLab, prompt }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The copilot could not respond.');
      setAnswer(data.answer);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  function choose(index) { setSelected(index); }

  function nextQuestion() {
    if (!question.choices[selected].correct) return;
    if (questionIndex < lab.questions.length - 1) {
      setQuestionIndex(questionIndex + 1); setSelected(null); setAnswer(''); setPrompt('');
    } else {
      setCompleted((current) => current.includes(activeLab) ? current : [...current, activeLab]);
    }
  }

  return <>
    <header className="topbar"><div className="brand">FACILITIES <span>AI</span> FIELD LAB</div><div className="topmeta">GITHUB + VERCEL + OLLAMA<br />AI WORKFLOW TRAINING</div></header>
    <main className="shell">
      {!lab ? <>
        <section className="hero"><div><div className="eyebrow">A safe place to practice</div><h1>Use AI like a junior assistant—not an authority.</h1><p>Trade-specific scenarios that teach facilities teams how to frame tasks, ground AI in evidence, protect sensitive information, and verify the output.</p></div><div className="heroCard"><div className="online"><i /> OLLAMA-READY ARCHITECTURE</div><strong>{labCount} trade labs</strong><p>10 AI-use questions per lab</p><p>AI responses come through a server-side route, so your Ollama endpoint is not exposed in the browser.</p></div></section>
        <div className="progressLabel"><span>YOUR PRACTICE PATH</span><span>{completed.length} / {labCount} labs complete</span></div><div className="progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="filters">{trades.map((trade) => <button key={trade} className={tradeFilter === trade ? 'active' : ''} onClick={() => setTradeFilter(trade)}>{trade}</button>)}</div>
        <section className="cards">{visibleLabs.map(([key, item]) => <article className="module" key={key}><div className="num">{item.num}</div><div className="moduleMeta"><span>{item.trade}</span><span>{item.questions.length} questions</span></div><h2>{item.title}</h2><p>{item.description}</p><button onClick={() => openLab(key)}>Start lab <span>→</span></button></article>)}</section>
        <div className="note"><b>Facilitator note:</b> The technical setting is context. The learning target is the AI workflow: scope it, ground it, challenge it, protect data, and verify the result.</div>
      </> : <section className="panel">
        <button className="back" onClick={closeLab}>← BACK TO OVERVIEW</button>
        <div className="panelHead"><div><div className="eyebrow">{lab.num} · QUESTION {questionIndex + 1} OF {lab.questions.length}</div><h1>{lab.title}</h1><p>{lab.description}</p></div><div className="tags">{lab.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <div className="questionNav"><span>LAB QUESTIONS</span><div>{lab.questions.map((_, index) => <button key={index} className={`${index === questionIndex ? 'current' : ''} ${index < questionIndex ? 'done' : ''}`} disabled={index > questionIndex} onClick={() => { setQuestionIndex(index); setSelected(null); setAnswer(''); setPrompt(''); }}>{index + 1}</button>)}</div><small>10 AI-use questions · complete in order</small></div>
        <div className="labGrid"><div className="evidence"><h3>Evidence pack</h3><div className="document"><small>{lab.sourceTitle}</small>{lab.evidence.split('\n').map((line, index) => <p key={index}>{line || <>&nbsp;</>}</p>)}</div><div className="callout"><b>AI-use target:</b> {questionIndex < 3 ? 'Frame the task and ground the request.' : questionIndex < 6 ? 'Challenge the output and ask for verification.' : 'Protect data and create a reviewable handoff.'}</div></div>
          <div className="assistant"><h3>AI copilot sandbox</h3><div className="chat"><div className="aiLabel">OLLAMA COPILOT</div>{answer ? <p>{answer}</p> : <><p className="starter">Ask the copilot about this step.</p><p className="hint">Use the evidence pack. Ask it to show uncertainty and identify what still needs verification.</p></>}</div><form className="promptRow" onSubmit={askCopilot}><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask the copilot…" /><button disabled={loading}>{loading ? '…' : 'Ask'}</button></form>{error && <div className="error">{error}</div>}</div></div>
        <div className="decision"><div className="questionCounter">AI WORKFLOW CHECK · {questionIndex + 1} / {lab.questions.length}</div><h3>{question.prompt}</h3><div className="choices">{question.choices.map((item, index) => <button className={`choice ${selected === index ? (item.correct ? 'correct' : 'wrong') : ''}`} key={item.text} onClick={() => choose(index)}>{item.text}</button>)}</div>{selected !== null && <div className={`feedback ${question.choices[selected].correct ? 'good' : 'bad'}`}><b>{question.choices[selected].correct ? 'Good decision.' : 'Try again.'}</b> {question.choices[selected].feedback}</div>}{selected !== null && question.choices[selected].correct && <button className="next" onClick={nextQuestion}>{questionIndex === lab.questions.length - 1 ? 'Complete lab ✓' : 'Next question →'}</button>}{completed.includes(activeLab) && <div className="complete"><b>Lab complete ✓</b><br />You practiced using AI as a scoped, evidence-grounded assistant while keeping human judgment in control.</div>}</div>
      </section>}
    </main>
  </>;
}
