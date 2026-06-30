import React, { useState, useEffect, useRef } from 'react';
import { callGemini } from '../services/geminiApi';

const SYSTEM_PROMPT = "אתה 'פלג', עוזר AI באפליקציה 'לא פראיירים' שעוזרת לבני נוער בישראל להבין את זכויותיהם בעבודה. דבר אליהם בצורה חברית, נעימה ובגובה העיניים (כמו חבר שרוצה לעזור, אבל בשום אופן אל תשתמש בסלנג מאולץ כמו 'אח שלי', 'כפרה', 'גבר' וכו'). אל תישמע רובוטי. תן מידע מדויק, קצר ואמין מאוד המבוסס על חוקי העבודה בישראל לנוער (השתמש בכלי החיפוש במידת הצורך). אם אינך בטוח, ציין שכדאי להתייעץ עם גורם מוסמך כמו הסתדרות הנוער העובד והלומד.";

const INITIAL_MESSAGE = {
  role: 'model',
  text: 'היי! אני פלג, עוזר ה-AI של "לא פראיירים". מה קורה בעבודה? יש משהו ספציפי שתרצו לשאול אותי לגבי הזכויות שלכם?'
};

export default function ChatView() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = { role: 'user', text: inputText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const payload = {
        contents: apiMessages,
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
      };

      const text = await callGemini(payload);
      setMessages(prev => [...prev, {
        role: 'model',
        text: text || 'אופס, משהו השתבש לי בחיבור. אפשר לנסות שוב?'
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'סליחה, יש לי כרגע תקלה זמנית בשרת. נסו שוב עוד מעט!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mt-6 h-[75vh] flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-300">
      {/* Chat header */}
      <div className="bg-slate-900 rounded-t-2xl p-4 text-white shadow-md flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full text-2xl">🤖</div>
        <div>
          <h2 className="font-bold text-lg">פלג - עוזר זכויות הנוער</h2>
          <p className="text-xs text-slate-300 opacity-90">מבוסס בינה מלאכותית, יכול לטעות לפעמים.</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow bg-white border-x border-slate-200 overflow-y-auto p-4 space-y-4 shadow-inner">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 text-sm md:text-base leading-relaxed ${
              msg.role === 'user'
                ? 'bg-slate-800 text-white rounded-2xl rounded-tl-sm'
                : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 p-3 rounded-2xl rounded-tr-sm flex items-center gap-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-100">●</span>
              <span className="animate-pulse delay-200">●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-3 rounded-b-2xl border-x border-b border-slate-200 shadow-md flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="שאלו את פלג שאלה..."
          className="flex-grow bg-slate-100 border border-transparent focus:border-slate-400 rounded-xl px-4 py-2 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
          disabled={isLoading}
          dir="auto"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputText.trim()}
          className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
