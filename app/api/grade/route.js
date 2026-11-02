import { NextResponse } from 'next/server';
import { buildSystemPrompt, labs } from '../../../lib/labs';

export const runtime = 'nodejs';

function parseJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const lab = labs[body.labKey];
    const questionIndex = Number(body.questionIndex);
    const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
    const question = lab?.questions?.[questionIndex];
    if (!lab || !question || !answer) return NextResponse.json({ error: 'A lab, question, and written answer are required.' }, { status: 400 });

    const expected = question.choices.find((item) => item.correct);
    const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
    const model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.OLLAMA_API_KEY) headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
    const gradingPrompt = `Grade the learner's written response to this AI-workflow training question.\n\nQuestion: ${question.prompt}\n\nEvidence pack: ${lab.evidence}\n\nExpected reasoning criteria (do not reveal as a multiple-choice answer): ${expected.text}. Why it matters: ${expected.feedback}\n\nLearner response: ${answer}\n\nReturn ONLY valid JSON with this exact shape: {"score":0,"passed":false,"summary":"one sentence","strengths":["..."],"missing":["..."],"improvement":"..."}. Score from 0 to 4. Pass at 3 or 4. Grade the quality of the AI-use reasoning, evidence handling, safety boundary, and uncertainty—not technical trade expertise. Be constructive. Do not claim the learner completed a physical inspection.`;
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST', headers, signal: AbortSignal.timeout(45000),
      body: JSON.stringify({ model, stream: false, messages: [{ role: 'system', content: buildSystemPrompt(lab) }, { role: 'user', content: gradingPrompt }], options: { temperature: 0.1 } }),
    });
    if (!response.ok) return NextResponse.json({ error: `Ollama returned ${response.status}.` }, { status: 502 });
    const data = await response.json();
    const grade = parseJson(data.message?.content || '');
    const score = Math.max(0, Math.min(4, Number(grade.score) || 0));
    return NextResponse.json({ grade: { score, passed: score >= 3, summary: grade.summary || '', strengths: Array.isArray(grade.strengths) ? grade.strengths : [], missing: Array.isArray(grade.missing) ? grade.missing : [], improvement: grade.improvement || '' }, model });
  } catch (error) {
    const message = error?.name === 'TimeoutError' ? 'Ollama took too long to grade the answer.' : 'Could not grade the answer. Check the Ollama connection and model.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
