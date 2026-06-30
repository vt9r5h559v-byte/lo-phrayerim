import React, { useState, useEffect, useRef } from 'react';

// מאגר המידע של הזכויות (מעודכן לכללים הכלליים של העסקת נוער)
const rightsData = [
  {
    id: 'wage',
    title: 'שכר מינימום',
    icon: '💰',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    points: [
      { subtitle: 'עד גיל 16', text: '26.07 ₪ לשעה (לפחות).' },
      { subtitle: 'מגיל 16 עד 17', text: '27.94 ₪ לשעה (לפחות).' },
      { subtitle: 'מגיל 17 עד 18', text: '30.92 ₪ לשעה (לפחות).' },
      { subtitle: 'טיפ מנצח', text: 'המעסיק לא יכול להחליט לשלם לכם פחות מזה, גם אם "הסכמתם" לזה. הסכם כזה לא חוקי!' }
    ],
    summary: 'אסור לשלם לכם פחות משכר המינימום המותאם לגיל שלכם. מעודכן לשנת 2026.'
  },
  {
    id: 'trial',
    title: 'התלמדות וניסיון',
    icon: '🎓',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    points: [
      { subtitle: 'ימי התלמדות ("חפיפה")', text: 'חובה לשלם לכם על כל שעת התלמדות! אין דבר כזה "התלמדות בחינם".' },
      { subtitle: 'ימי ניסיון', text: 'גם אם עבדתם שעתיים בניסיון והמעסיק החליט שאתם לא מתאימים - הוא חייב לשלם לכם על השעתיים האלו.' },
      { subtitle: 'ישיבות צוות', text: 'ישיבת צוות נחשבת זמן עבודה לכל דבר. חובה לשלם עליה.' }
    ],
    summary: 'על כל דקה שאתם בעסק ודורשים מכם להיות בו - חובה לשלם.'
  },
  {
    id: 'hours',
    title: 'שעות עבודה ולילה',
    icon: '⏰',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    points: [
      { subtitle: 'מקסימום שעות ביום', text: 'מותר להעסיק נוער עד 8 שעות ביום (או עד 9 שעות במקום שעובד 5 ימים בשבוע).' },
      { subtitle: 'עבודת לילה (מתחת ל-16)', text: 'אסור לעבוד בין השעות 20:00 ל-08:00 בבוקר.' },
      { subtitle: 'עבודת לילה (גיל 16-18)', text: 'אסור לעבוד בין השעות 22:00 ל-06:00 (בחופשים יש חריגים עד 24:00, אבל חובה שהמעסיק ידאג להסעה הביתה).' }
    ],
    summary: 'אתם לא רובוטים. יש גבול לשעות שמותר להעסיק אתכם, ובלילה - לרוב אסור.'
  },
  {
    id: 'overtime',
    title: 'שעות נוספות',
    icon: '⏳',
    color: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    points: [
      { subtitle: 'החוק היבש', text: 'באופן כללי, החוק אוסר להעסיק בני נוער בשעות נוספות.' },
      { subtitle: 'ומה אם בכל זאת עבדתי?', text: 'אם כבר עבדתם, המעסיק חייב לשלם לכם תוספת!' },
      { subtitle: 'תעריף שעות נוספות', text: 'על השעתיים הנוספות הראשונות - 125% מהשכר. על כל שעה מעבר לזה - 150% מהשכר.' }
    ],
    summary: 'אסור להעסיק אתכם שעות נוספות, אבל אם עשיתם את זה - מגיע לכם הרבה יותר כסף לשעה.'
  },
  {
    id: 'breaks',
    title: 'הפסקות',
    icon: '🍔',
    color: 'bg-rose-100',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-200',
    points: [
      { subtitle: 'מתי מגיעה הפסקה?', text: 'ביום עבודה של 6 שעות ומעלה.' },
      { subtitle: 'כמה זמן?', text: 'מגיעה לכם הפסקה של 45 דקות לפחות. מתוכן חייבת להיות הפסקה רצופה של חצי שעה למנוחה ואוכל.' },
      { subtitle: 'האם משלמים על ההפסקה?', text: 'בדרך כלל לא (המעסיק יכול לקזז את הזמן). אבל! אם המעסיק דורש מכם להישאר בעסק בזמן ההפסקה - הוא חייב לשלם עליה.' }
    ],
    summary: 'עובדים מעל 6 שעות? מגיעה לכם הפסקה. תנוחו, תאכלו, ואל תוותרו עליה.'
  },
  {
    id: 'travel',
    title: 'דמי נסיעות',
    icon: '🚌',
    color: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-200',
    points: [
      { subtitle: 'מי זכאי?', text: 'כל עובד שגר במרחק של יותר מ-500 מטר ממקום העבודה (או שתי תחנות אוטובוס).' },
      { subtitle: 'כמה משלמים?', text: 'המעסיק חייב להחזיר הוצאות נסיעה (עד למקסימום של 22.60 ₪ ביום), או עלות "חופשי חודשי" - הזול מביניהם.' },
      { subtitle: 'איך מקבלים?', text: 'התשלום משולם בדרך כלל יחד עם המשכורת החודשית. אל תשכחו לבקש את זה!' }
    ],
    summary: 'הנסיעות לעבודה וחזרה הן על חשבון המעסיק, לא על חשבון השכר שלכם.'
  },
  {
    id: 'fines',
    title: 'קנסות וחוסרים בקופה',
    icon: '🚫',
    color: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    points: [
      { subtitle: 'קנסות', text: 'למעסיק אסור בשום אופן לקנוס אתכם על בעיות משמעת או איחורים (אלא אם יש הסכם קיבוצי, וזה נדיר בנוער).' },
      { subtitle: 'חוסר בקופה', text: 'לקוח ברח בלי לשלם? טעיתם בעודף? אסור לנכות את הכסף הזה מהמשכורת שלכם!' },
      { subtitle: 'שבירת ציוד', text: 'נשברה לכם כוס או צלחת בטעות? המעסיק לא יכול להכריח אתכם לשלם על זה דרך המשכורת.' }
    ],
    summary: 'המשכורת שלכם מוגנת. אי אפשר לקחת ממנה כסף בגלל "קנסות" שרירותיים.'
  },
  {
    id: 'tracking',
    title: 'רישום שעות עבודה',
    icon: '📝',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    points: [
      { subtitle: 'החובה על המעסיק', text: 'המעסיק חייב לנהל רישום מסודר של שעות העבודה שלכם.' },
      { subtitle: 'האחריות שלכם', text: 'אף פעם אל תסמכו רק על הרישום של המעסיק! תנהלו רישום משלכם בטלפון (שעת התחלה, שעת סיום והפסקות).' },
      { subtitle: 'תלוש שכר', text: 'חובה לתת לכם תלוש שכר מפורט עד ה-9 לכל חודש.' }
    ],
    summary: 'תמיד תתעדו את השעות שלכם. זה הכלי הכי חזק שלכם מול טעויות בשכר.'
  },
  {
    id: 'tips',
    title: 'טיפים (תשר)',
    icon: '💸',
    color: 'bg-lime-100',
    textColor: 'text-lime-800',
    borderColor: 'border-lime-200',
    points: [
      { subtitle: 'למי שייך הטיפ?', text: 'הטיפים שייכים לצוות העובדים. מותר לעשות "קופת טיפים" משותפת, אבל לבעל העסק אסור לקחת מהם אגורה לכיסו הפרטי.' },
      { subtitle: 'ניכוי "מס" מטיפים', text: 'אסור למעסיק לקחת לכם חלק מהטיפ בטענה של "מיסים" מתחת לשולחן! בני נוער לרוב בכלל לא מגיעים לתקרת המס (יש להם נקודות זיכוי שפוטרות אותם ממס הכנסה). אם מנכים לכם מס, זה חייב להופיע בצורה חוקית ומסודרת בתלוש המשכורת.' },
      { subtitle: 'השלמה לשכר מינימום', text: 'מעסיק יכול להחשיב את הטיפים כחלק משכר המינימום שלכם. אבל! אם באותו חודש הטיפים יצאו פחות משכר המינימום - הוא חייב להשלים לכם את ההפרש מכיסו.' }
    ],
    summary: 'הטיפים שלכם הם לא קופה קטנה של המעסיק, ואסור לו לנכות מהם "מס" על דעת עצמו.'
  },
  {
    id: 'firing',
    title: 'פיטורים והגנה',
    icon: '🛡️',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200',
    points: [
      { subtitle: 'הגנה על זכויות', text: 'אסור בשום אופן לפטר אתכם רק בגלל שדרשתם את הזכויות שלכם (כמו שכר מינימום או תשלום על התלמדות). בית הדין לעבודה רואה את זה בחומרה רבה ויכול לחייב את המעסיק בפיצויים כספיים גבוהים!' },
      { subtitle: 'הודעה מוקדמת', text: 'המעסיק לא יכול להגיד לכם "מחר אל תבואו". הוא חייב לתת לכם התראה מראש, בתשלום כמובן (לפי החוק, בדרך כלל יום התראה על כל חודש עבודה ב-6 החודשים הראשונות). אגב, גם אתם צריכים לתת התראה כזו מראש אם אתם רוצים להתפטר.' },
      { subtitle: 'זכות השימוע', text: 'לפני שמפטרים אתכם, המעסיק חייב לערוך לכם "שימוע" - שיחה שבה הוא מסביר מראש למה הוא שוקל לפטר אתכם, ונותן לכם הזדמנות אמיתית להסביר את הצד שלכם. אסור לפטר "על המקום".' }
    ],
    summary: 'החוק שומר עליכם: עמידה על הזכויות שלכם היא לא עילה חוקית לפיטורים. אל תפחדו לדרוש את מה שמגיע לכם.'
  }
];

export default function App() {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  React.useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he-IL';
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Heebo', sans-serif";
    document.body.className = "bg-slate-50 text-slate-900";
  }, []);

  const Header = () => (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => { setCurrentCategory(null); setIsChatOpen(false); setIsAnalyzerOpen(false); }}
        >
          <div className="bg-yellow-400 text-slate-900 font-black p-2 rounded-lg text-xl leading-none rotate-2 hover:rotate-0 transition-all">
            לא פרייארים!
          </div>
          <h1 className="text-xl font-semibold hidden sm:block ml-2 text-slate-300">
            הזכויות שלכם בעבודה
          </h1>
        </div>
        {(currentCategory || isChatOpen || isAnalyzerOpen) && (
          <button 
            onClick={() => { setCurrentCategory(null); setIsChatOpen(false); setIsAnalyzerOpen(false); }}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            חזרה &larr;
          </button>
        )}
      </div>
    </header>
  );

  const HomeView = () => (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8 mt-6 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-800">
          אל תתנו שיעבדו עליכם.
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ברוכים הבאים למאגר הזכויות הכי ברור ופשוט לבני נוער. 
          בחרו את הנושא שמעניין אתכם וגלו מה מגיע לכם לפי החוק.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-8 flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="flex-1 bg-[#fcfcfc] border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:scale-[1.01] group text-right focus:outline-none focus:ring-4 focus:ring-slate-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-3 rounded-full text-3xl shadow-inner border border-slate-200">
              🤖
            </div>
            <div>
              <h3 className="text-slate-800 font-bold text-lg mb-1">
                היי, אני פלג ה-AI!
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                שאלו אותי על זכויות בעבודה.
              </p>
            </div>
          </div>
          <div className="bg-slate-500 text-white px-4 py-2 rounded-xl font-bold text-sm hidden sm:block group-hover:bg-slate-600 transition-colors shadow-sm">
            התחלת שיחה
          </div>
        </button>

        <button 
          onClick={() => setIsAnalyzerOpen(true)}
          className="flex-1 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:scale-[1.01] group text-right focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-3xl shadow-inner border border-emerald-200">
              📄
            </div>
            <div>
              <h3 className="text-emerald-800 font-bold text-lg mb-1">
                בדוק את התלוש שלי
              </h3>
              <p className="text-emerald-600 text-sm font-medium">
                העלו צילום או PDF של התלוש ונבדוק אם עבדו עליכם.
              </p>
            </div>
          </div>
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hidden sm:block group-hover:bg-emerald-700 transition-colors shadow-sm">
            סריקת תלוש
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {rightsData.map((category) => (
          <button
            key={category.id}
            onClick={() => setCurrentCategory(category)}
            className={`${category.color} ${category.borderColor} border-2 rounded-2xl p-6 text-right hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md flex flex-col items-start gap-4 focus:outline-none focus:ring-4 focus:ring-slate-300`}
          >
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h3 className={`text-xl font-bold ${category.textColor} mb-1`}>
                {category.title}
              </h3>
              <p className="text-sm text-slate-700 opacity-90 line-clamp-2">
                {category.summary}
              </p>
            </div>
            <div className={`mt-auto text-sm font-bold ${category.textColor} flex items-center gap-1`}>
              לכל הפרטים
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const DetailView = ({ category }) => (
    <div className="max-w-2xl mx-auto px-4 mt-6 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className={`${category.color} ${category.borderColor} border-b-4 rounded-3xl p-8 mb-8 text-center shadow-sm`}>
        <div className="text-6xl mb-4">{category.icon}</div>
        <h2 className={`text-3xl md:text-4xl font-extrabold ${category.textColor} mb-2`}>
          {category.title}
        </h2>
        <p className="text-lg text-slate-800 font-medium">
          {category.summary}
        </p>
      </div>

      <div className="space-y-4">
        {category.points.map((point, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="bg-yellow-400 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-black">
                {index + 1}
              </span>
              {point.subtitle}
            </h4>
            <p className="text-slate-600 leading-relaxed mr-8 text-lg">
              {point.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center pb-12">
        <button 
          onClick={() => setCurrentCategory(null)}
          className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          הבנתי, חזרה לכל הזכויות
        </button>
      </div>
    </div>
  );

  const PaySlipAnalyzer = () => {
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

    const convertToBase64 = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
    };

    const analyzePaySlip = async () => {
      if (selectedFiles.length === 0 || isAnalyzing) return;
      setIsAnalyzing(true);
      setAnalysisResult('');

      try {
        const systemPrompt = `אתה מומחה לניתוח תלושי שכר של בני נוער בישראל. הניתוח מתבצע על פי חוקי העבודה בישראל בלבד. עליך לעקוב אחר ההנחיות הבאות בקפידה:
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

        const parts = await Promise.all(selectedFiles.map(async (f) => ({
            inlineData: {
                mimeType: f.type,
                data: await convertToBase64(f.file)
            }
        })));

        const payload = {
          contents: [{
            role: "user",
            parts: [
                { text: systemPrompt },
                ...parts
            ]
          }]
        };

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content?.parts[0]?.text) {
          setAnalysisResult(data.candidates[0].content.parts[0].text);
        } else {
          setAnalysisResult('❌ סליחה, לא הצלחתי לפענח את הקבצים. נסו להעלות קבצים ברורים יותר (תמונות או PDF).');
        }
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
                  <>
                    <span className="animate-spin text-2xl">⏳</span> בודק לעומק...
                  </>
                ) : (
                  "התחל בדיקה מקיפה"
                )}
              </button>
              <button 
                onClick={() => setSelectedFiles([])}
                className="text-sm text-slate-500 underline w-full"
              >
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
  };

  const ChatView = () => {
    const [messages, setMessages] = useState([
      { role: 'model', text: 'היי! אני פלג, עוזר ה-AI של "לא פראיירים". מה קורה בעבודה? יש משהו ספציפי שתרצו לשאול אותי לגבי הזכויות שלכם?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
      if (!inputText.trim() || isLoading) return;

      const userMsg = { role: 'user', text: inputText };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInputText('');
      setIsLoading(true);

      try {
        const systemPrompt = "אתה 'פלג', עוזר AI באפליקציה 'לא פראיירים' שעוזרת לבני נוער בישראל להבין את זכויותיהם בעבודה. דבר אליהם בצורה חברית, נעימה ובגובה העיניים (כמו חבר שרוצה לעזור, אבל בשום אופן אל תשתמש בסלנג מאולץ כמו 'אח שלי', 'כפרה', 'גבר' וכו'). אל תישמע רובוטי. תן מידע מדויק, קצר ואמין מאוד המבוסס על חוקי העבודה בישראל לנוער (השתמש בכלי החיפוש במידת הצורך). אם אינך בטוח, ציין שכדאי להתייעץ עם גורם מוסמך כמו הסתדרות הנוער העובד והלומד.";
        
        const apiMessages = newMessages.map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

        const payload = {
          contents: apiMessages,
          tools: [{ "google_search": {} }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        };

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content?.parts[0]?.text) {
          setMessages(prev => [...prev, { role: 'model', text: data.candidates[0].content.parts[0].text }]);
        } else {
          setMessages(prev => [...prev, { role: 'model', text: 'אופס, משהו השתבש לי בחיבור. אפשר לנסות שוב?' }]);
        }
      } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { role: 'model', text: 'סליחה, יש לי כרגע תקלה זמנית בשרת. נסו שוב עוד מעט!' }]);
      } finally {
        setIsLoading(false);
      }
    };

      return (
        <div className="max-w-2xl mx-auto px-4 mt-6 h-[75vh] flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="bg-slate-900 rounded-t-2xl p-4 text-white shadow-md flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full text-2xl">🤖</div>
            <div>
              <h2 className="font-bold text-lg">פלג - עוזר זכויות הנוער</h2>
              <p className="text-xs text-slate-300 opacity-90">מבוסס בינה מלאכותית, יכול לטעות לפעמים.</p>
            </div>
          </div>
          
          <div className="flex-grow bg-white border-x border-slate-200 overflow-y-auto p-4 space-y-4 shadow-inner">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 text-sm md:text-base leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-2xl rounded-tl-sm' 
                    : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
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
    };

  return (
    <div className="min-h-screen flex flex-col pb-8">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto w-full">
        {isAnalyzerOpen ? (
          <PaySlipAnalyzer />
        ) : isChatOpen ? (
          <ChatView />
        ) : currentCategory ? (
          <DetailView category={currentCategory} />
        ) : (
          <HomeView />
        )}
      </main>

      <footer className="mt-auto pt-12 pb-6 px-4 text-center text-sm text-slate-500">
        <p>
          המידע באפליקציה "לא פראיירים" מוגש כשירות לציבור ואינו מהווה ייעוץ משפטי מחייב. 
          <br className="hidden sm:block" /> במקרה של מחלוקת, החוק והפסיקה הם הקובעים.
        </p>
      </footer>
    </div>
  );
}