import React, { useState } from 'react';

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
      { subtitle: 'הודעה מוקדמת', text: 'המעסיק לא יכול להגיד לכם "מחר אל תבואו". הוא חייב לתת לכם התראה מראש, בתשלום כמובן (לפי החוק, בדרך כלל יום התראה על כל חודש עבודה ב-6 החודשים הראשונים). אגב, גם אתם צריכים לתת התראה כזו מראש אם אתם רוצים להתפטר.' },
      { subtitle: 'זכות השימוע', text: 'לפני שמפטרים אתכם, המעסיק חייב לערוך לכם "שימוע" - שיחה שבה הוא מסביר מראש למה הוא שוקל לפטר אתכם, ונותן לכם הזדמנות אמיתית להסביר את הצד שלכם. אסור לפטר "על המקום".' }
    ],
    summary: 'החוק שומר עליכם: עמידה על הזכויות שלכם היא לא עילה חוקית לפיטורים. אל תפחדו לדרוש את מה שמגיע לכם.'
  }
];

export default function App() {
  const [currentCategory, setCurrentCategory] = useState(null);

  // הוספת סגנונות גלובליים (פונטים, כיווניות)
  React.useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he-IL';
    // הוספת פונט Heebo מ-Google Fonts
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
          onClick={() => setCurrentCategory(null)}
        >
          <div className="bg-yellow-400 text-slate-900 font-black p-2 rounded-lg text-xl leading-none rotate-2 hover:rotate-0 transition-all">
            לא פרייארים!
          </div>
          <h1 className="text-xl font-semibold hidden sm:block ml-2 text-slate-300">
            הזכויות שלכם בעבודה
          </h1>
        </div>
        {currentCategory && (
          <button 
            onClick={() => setCurrentCategory(null)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            חזרה לכל הזכויות &larr;
          </button>
        )}
      </div>
    </header>
  );

  const HomeView = () => (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-10 mt-6 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-800">
          אל תתנו שיעבדו עליכם.
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ברוכים הבאים למאגר הזכויות הכי ברור ופשוט לבני נוער. 
          בחרו את הנושא שמעניין אתכם וגלו מה מגיע לכם לפי החוק.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-4">
        {rightsData.map((category) => (
          <button
            key={category.id}
            onClick={() => setCurrentCategory(category)}
            className={`${category.color} ${category.borderColor} border-2 rounded-2xl p-4 sm:p-6 text-right hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md flex flex-col items-start h-full focus:outline-none focus:ring-4 focus:ring-slate-300`}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{category.icon}</div>
            <div className="flex-grow">
              <h3 className={`text-base sm:text-xl font-bold ${category.textColor} mb-1 leading-tight`}>
                {category.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 opacity-90 line-clamp-2">
                {category.summary}
              </p>
            </div>
            <div className={`mt-3 sm:mt-auto pt-1 text-xs sm:text-sm font-bold ${category.textColor} flex items-center gap-1`}>
              לכל הפרטים
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
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
      {/* כותרת הקטגוריה */}
      <div className={`${category.color} ${category.borderColor} border-b-4 rounded-3xl p-8 mb-8 text-center shadow-sm`}>
        <div className="text-6xl mb-4">{category.icon}</div>
        <h2 className={`text-3xl md:text-4xl font-extrabold ${category.textColor} mb-2`}>
          {category.title}
        </h2>
        <p className="text-lg text-slate-800 font-medium">
          {category.summary}
        </p>
      </div>

      {/* נקודות מידע */}
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

  return (
    <div className="min-h-screen flex flex-col pb-8">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto w-full">
        {currentCategory ? (
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