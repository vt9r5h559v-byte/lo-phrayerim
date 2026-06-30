import React, { useState, useEffect } from 'react';
import { config } from './config';
import { rightsData } from './data/rightsData';
import Header from './components/Header';
import HomeView from './components/HomeView';
import DetailView from './components/DetailView';
import ChatView from './components/ChatView';
import PaySlipAnalyzer from './components/PaySlipAnalyzer';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = config.app.fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Heebo', sans-serif";
    document.body.className = "bg-slate-50 text-slate-900";
  }, []);

  const goHome = () => {
    setCurrentCategory(null);
    setIsChatOpen(false);
    setIsAnalyzerOpen(false);
  };

  const showBack = !!(currentCategory || isChatOpen || isAnalyzerOpen);

  const renderView = () => {
    if (isAnalyzerOpen) return <PaySlipAnalyzer />;
    if (isChatOpen) return <ChatView />;
    if (currentCategory) return <DetailView category={currentCategory} onBack={goHome} />;
    return (
      <HomeView
        categories={rightsData}
        onSelectCategory={setCurrentCategory}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAnalyzer={() => setIsAnalyzerOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col pb-8">
      <Header showBack={showBack} onBack={goHome} />

      <main className="flex-grow max-w-5xl mx-auto w-full">
        {renderView()}
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