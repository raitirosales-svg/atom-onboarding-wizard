const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';

export async function generateWithGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const key = GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured. Add VITE_GEMINI_API_KEY to your .env file.');

  const contents = [{ role: 'user', parts: [{ text: prompt }] }];
  const systemInstruction_obj = systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        ...(systemInstruction_obj ? { systemInstruction: systemInstruction_obj } : {}),
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}
