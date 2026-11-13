import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const systemPrompt = `You are FM AI Tool, a coaching assistant inside a facilities workforce game. Respond in plain text only. Do not use Markdown symbols, tables, headings with #, or asterisks. Keep it practical and under 180 words. Help the player prepare, organize, compare, or draft. Do not make a safety-critical, code, chemical, electrical, traffic-control, or repair decision. Clearly label what is known, what is missing, what to verify, and who owns the final decision. If the prompt asks you to choose the final action, explain that a qualified human or approved procedure must decide.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = String(body?.prompt || '').trim();
    const scenario = String(body?.scenario || '').trim();
    if (!prompt || !scenario) {
      return NextResponse.json({ error: 'A prompt and current job situation are required.' }, { status: 400 });
    }

    const provider = (process.env.AI_PROVIDER || 'ollama').toLowerCase();
    const fullPrompt = `JOB SITUATION:\n${scenario}\n\nPLAYER PROMPT:\n${prompt}`;

    if (provider === 'openrouter') {
      const apiKey = process.env.OPENROUTER_API_KEY;
      const baseUrl = (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
      const model = process.env.OPENROUTER_MODEL || 'openrouter/free';
      if (!apiKey) return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured.' }, { status: 500 });
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          ...(process.env.OPENROUTER_SITE_URL ? { 'HTTP-Referer': process.env.OPENROUTER_SITE_URL } : {}),
          'X-Title': 'FM Journey',
        },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: fullPrompt }], temperature: 0.2, max_tokens: 260 }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return NextResponse.json({ error: data?.error?.message || `OpenRouter returned ${response.status}.` }, { status: 502 });
      const content = data?.choices?.[0]?.message?.content;
      const text = Array.isArray(content) ? content.map((part) => part?.text || '').join('') : content;
      return NextResponse.json({ response: String(text || '').trim(), model, provider });
    }

    const baseUrl = (process.env.OLLAMA_BASE_URL || '').replace(/\/$/, '');
    const model = process.env.OLLAMA_MODEL || 'gemma4:31b';
    if (!baseUrl) return NextResponse.json({ error: 'OLLAMA_BASE_URL is not configured.' }, { status: 500 });

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.OLLAMA_API_KEY ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model,
        stream: false,
        prompt: `${systemPrompt}\n\n${fullPrompt}`,
        options: { temperature: 0.2, num_predict: 260 },
      }),
      signal: AbortSignal.timeout(45000),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: data?.error || `Ollama returned ${response.status}.` }, { status: 502 });
    return NextResponse.json({ response: String(data?.response || '').trim(), model, provider });
  } catch (error) {
    const message = error?.name === 'TimeoutError' ? 'FM AI Tool timed out. Check that the selected AI provider is reachable.' : 'Could not reach the selected AI provider. Check its URL, model, and API key.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
