import React from 'react';

export default function HomeView({ categories, onSelectCategory, onOpenChat, onOpenAnalyzer }) {
  return (
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

      {/* Action buttons: Chat + Pay Slip Analyzer */}
      <div className="max-w-4xl mx-auto px-4 mb-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={onOpenChat}
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
          onClick={onOpenAnalyzer}
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

      {/* Category cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
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
}
