import { config } from '../config';

/**
 * Send a request to the Gemini API and return the generated text.
 * @param {object} payload - The full request body (contents, systemInstruction, tools, etc.)
 * @returns {Promise<string|null>} The generated text, or null if no content was returned.
 */
export async function callGemini(payload) {
  const response = await fetch(config.gemini.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody?.error?.message || `Gemini API error: ${response.status}`
    );
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

/**
 * Convert a File object to a base64-encoded string (without the data URL prefix).
 */
export function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
}
