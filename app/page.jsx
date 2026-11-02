'use client';

import { useMemo, useState } from 'react';
import { labs } from '../lib/labs';

export default function Home() {
  const [activeLab, setActiveLab] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const lab = activeLab ? labs[activeLab] : null;
  const progress = useMemo(() => Math.round((completed.length / 3) * 100), [completed.length]);

  function openLab(key) {
    setActiveLab(key);
    setPrompt(labs[key].starter);
    setAnswer('');
    setError('');
    setSelected(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function askCopilot(event) {
    event.preventDefault();
    if (!prompt.trim() || !activeLab) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labKey: activeLab, prompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The copilot could not respond.');
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function choose(index) {
    setSelected(index);
    if (lab.choices[index].correct && !completed.includes(activeLab)) {
      setCompleted([...completed, activeLab]);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">FACILITIES <span>AI</span> FIELD LAB</div>
        <div className="topmeta">GITHUB + VERCEL + OLLAMA<br />TRAINING PROTOTYPE</div>
      </header>
      <main className="shell">
        {!lab ? (
          <>
            <section className="hero">
              <div>
                <div className="eyebrow">A safe place to practice</div>
                <h1>Use AI like a junior assistant—not an authority.</h1>
                <p>Interactive scenarios for facilities teams. Gather evidence, ask better questions, and verify the answer before anyone touches a live system.</p>
              </div>
              <div className="heroCard"><div className="online"><i /> OLLAMA-READY ARCHITECTURE</div><strong>3 short labs</strong><p>Manual lookup · Troubleshooting · Work-order review</p><p>AI responses come through a server-side route, so your Ollama endpoint is not exposed in the browser.</p></div>
            </section>
            <div className="progressLabel"><span>YOUR PRACTICE PATH</span><span>{completed.length} / 3 labs complete</span></div>
            <div className="progress"><i style={{ width: `${progress}%` }} /></div>
            <section className="cards">
              {Object.entries(labs).map(([key, item], index) => <article className="module" key={key}><div className="num">{item.num}</div><h2>{item.title}</h2><p>{item.description}</p><button onClick={() => openLab(key)}>Start lab <span>→</span></button></article>)}
            </section>
            <div className="note"><b>Facilitator note:</b> Ask learners to explain what they would verify in the field. A fluent answer is not evidence.</div>
          </>
        ) : (
          <section className="panel">
            <button className="back" onClick={() => setActiveLab(null)}>← BACK TO OVERVIEW</button>
            <div className="panelHead"><div><div className="eyebrow">{lab.num}</div><h1>{lab.title}</h1><p>{lab.description}</p></div><div className="tags">{lab.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
            <div className="labGrid">
              <div className="evidence"><h3>Evidence pack</h3><div className="document"><small>{lab.sourceTitle}</small>{lab.source.split('\n').map((line, index) => <p key={index}>{line || <>&nbsp;</>}</p>)}</div><div className="callout"><b>Rule of thumb:</b> Ask AI to point to evidence. If it cannot, treat the statement as a hypothesis.</div></div>
              <div className="assistant"><h3>AI copilot sandbox</h3><div className="chat"><div className="aiLabel">OLLAMA COPILOT</div>{answer ? <p>{answer}</p> : <><p className="starter">{lab.starter}</p><p className="hint">Try a question below, then compare the response to the evidence pack.</p></>}</div><form className="promptRow" onSubmit={askCopilot}><input value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Ask the copilot…" /><button disabled={loading}>{loading ? '…' : 'Ask'}</button></form>{error && <div className="error">{error}</div>}</div>
            </div>
            <div className="decision"><h3>Decision point</h3><p><b>{lab.question}</b></p><div className="choices">{lab.choices.map((choice, index) => <button className={`choice ${selected === index ? (choice.correct ? 'correct' : 'wrong') : ''}`} key={choice.text} onClick={() => choose(index)}>{choice.text}</button>)}</div>{selected !== null && <div className={`feedback ${lab.choices[selected].correct ? 'good' : 'bad'}`}><b>{lab.choices[selected].correct ? 'Good decision.' : 'Try again.'}</b> {lab.choices[selected].feedback}</div>}{completed.includes(activeLab) && <div className="complete"><b>Lab complete ✓</b><br />You practiced using AI to accelerate the work while keeping evidence and professional judgment in control.</div>}</div>
          </section>
        )}
      </main>
    </>
  );
}
