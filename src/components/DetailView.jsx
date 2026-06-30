import React from 'react';

export default function DetailView({ category, onBack }) {
  return (
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
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="bg-yellow-400 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-black">
                {index + 1}
              </span>
              {point.subtitle}
            </h4>
            <p className="text-slate-600 leading-relaxed mr-8 text-lg">{point.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center pb-12">
        <button onClick={onBack} className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
          הבנתי, חזרה לכל הזכויות
        </button>
      </div>
    </div>
  );
}
