import React, { useState, useRef } from 'react';
import { callGemini, fileToBase64 } from '../services/geminiApi';

const SYSTEM_PROMPT = `אתה מומחה לניתוח תלושי שכר של בני נוער בישראל. הניתוח מתבצע על פי חוקי העבודה בישראל בלבד. עליך לעקוב אחר ההנחיות הבאות בקפידה:
1. קרא את כל המסמכים המצורפים (תמונות/PDF) כמסמך אחד.
2. אם המידע בתלוש לא ברור, מטושטש או באיכות נמוכה, אל תנחש. בקש מהמשתמש להעלות קובץ ברור יותר.
3. אם חסרים עמודים או נראה שהתלוש לא מלא, בקש מהמשתמש להעלות את כל התלוש.
4. אם חסרים נתונים הכרחיים לביצוע חישובים (כמו גיל העובד או מספר שעות העבודה), שאל את המשתמש לגביהם לפני הסקת מסקנות.
5. לכל מסקנה או אזהרה שאתה נותן, ציין במפורש על סמך מה הגעת אליה (למשל: "לא מופיעה שורת דמי נסיעות בתלוש", "שכר השעה נמוך משכר המינימום לגיל 16").
6. השתמש בשפה זהירה ומקצועית: לעולם אל תקבע בוודאות שהמעסיק עבר על החוק. השתמש בביטויים כמו "נמצאו חוסרים", "נראה ש...", "יש לבדוק מול המעסיק".
7. מבנה הדו"ח הנדרש:
   📋 סיכום התלוש
   ✅ סעיפים שנראים תקינים (עם הסבר).
   ⚠️ סעיפים הדורשים בדיקה נוספת (ציין במפורש איזה סעיף חסר או לא ברור).
   ❌ סעיפים שנראים חסרים/חריגים (ציין במפורש על מה מתבססת הטענה).
   💰 חישוב כספי (אם רלוונטי, פרט כיצד חושב. אם לא ניתן לחשב, ציין מדוע).
8. חתימה סופית (בחר אחת):
   🟢 לסיכום: התלוש נראה תקין ולא נמצאו סימנים בולטים לטעויות או להפרת זכויות.
   🔴 לסיכום: נמצאו מספר נקודות שנראות חריגות בתלוש. אין בכך בהכרח הוכחה להפרת חוק, אך מומלץ לבדוק את הנושאים מול המעסיק. אם לאחר הבדיקה עדיין קיים ספק, מומלץ לפנות לייעוץ מקצועי.`;

export default function PaySlipAnalyzer() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const fileInputRef = useRef(null);

  const handleFilesUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map(file => ({
      name: file.name,
      type: file.type,
      dataUrl: URL.createObjectURL(file),
      file: file
    }));
    setSelectedFiles(fileObjects);
    setAnalysisResult('');
  };

  const analyzePaySlip = async () => {
    if (selectedFiles.length === 0 || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      const parts = await Promise.all(selectedFiles.map(async (f) => ({
        inlineData: {
          mimeType: f.type,
          data: await fileToBase64(f.file)
        }
      })));

      const payload = {
        contents: [{
          role: "user",
          parts: [
            { text: SYSTEM_PROMPT },
            ...parts
          ]
        }]
      };

      const text = await callGemini(payload);
      setAnalysisResult(text || '❌ סליחה, לא הצלחתי לפענח את הקבצים. נסו להעלות קבצים ברורים יותר (תמונות או PDF).');
    } catch (error) {
      console.error(error);
      setAnalysisResult('❌ תקלה זמנית בשרת הבדיקה. נסו שוב מאוחר יותר!');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mt-6 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="bg-emerald-50 border-b-4 border-emerald-200 rounded-3xl p-8 mb-6 text-center shadow-sm">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-800 mb-2">
          בדיקת תלוש שכר מקצועית
        </h2>
        <p className="text-lg text-emerald-900 font-medium max-w-lg mx-auto">
          העלו קבצי PDF או תמונות של התלוש. המערכת תבצע בדיקה מקיפה לפי חוקי העבודה בישראל.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        {!selectedFiles.length ? (
          <div
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="text-5xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">📎</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">העלו את קבצי התלוש</h3>
            <p className="text-slate-500">תומך בתמונות (JPG, PNG) וב-PDF (גם מסמכים מרובי עמודים)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilesUpload}
              accept="image/*,application/pdf"
              multiple
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="bg-slate-100 border p-2 rounded text-xs font-semibold flex items-center gap-1">
                  {file.type.includes('image') ? '🖼️' : '📄'} {file.name.slice(0, 15)}...
                </div>
              ))}
            </div>
            <button
              onClick={analyzePaySlip}
              disabled={isAnalyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-lg"
            >
              {isAnalyzing ? (
                <><span className="animate-spin text-2xl">⏳</span> בודק לעומק...</>
              ) : (
                "התחל בדיקה מקיפה"
              )}
            </button>
            <button onClick={() => setSelectedFiles([])} className="text-sm text-slate-500 underline w-full">
              נקה בחירה
            </button>
          </div>
        )}
      </div>

      {analysisResult && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 animate-in zoom-in-95 duration-300">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3">
            <span>📊</span> דוח ניתוח התלוש
          </h3>
          <div className="text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
            {analysisResult}
          </div>
        </div>
      )}
    </div>
  );
}
