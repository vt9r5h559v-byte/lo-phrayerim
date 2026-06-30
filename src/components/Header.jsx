import React from 'react';
import { config } from '../config';

export default function Header({ showBack, onBack }) {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onBack}
        >
          <div className="bg-yellow-400 text-slate-900 font-black p-2 rounded-lg text-xl leading-none rotate-2 hover:rotate-0 transition-all">
            {config.app.name}
          </div>
          <h1 className="text-xl font-semibold hidden sm:block ml-2 text-slate-300">
            {config.app.subtitle}
          </h1>
        </div>
        {showBack && (
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            חזרה &larr;
          </button>
        )}
      </div>
    </header>
  );
}
