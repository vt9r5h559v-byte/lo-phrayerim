const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const config = {
  gemini: {
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    url: `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
  },
  app: {
    name: 'לא פרייארים!',
    subtitle: 'הזכויות שלכם בעבודה',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;800&display=swap',
  },
};
