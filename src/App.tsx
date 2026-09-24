import React, { useState, useEffect } from 'react';
import { Header, ActiveTab, FontSize } from './components/Header';
import { CheatSheetGrid } from './components/CheatSheetGrid';
import { HpDevOpsPage } from './components/HpDevOpsPage';
import { FlashcardsMode } from './components/FlashcardsMode';
import { StarBuilder } from './components/StarBuilder';
import { CliCommandPalette } from './components/CliCommandPalette';
import { InterviewGuide } from './components/InterviewGuide';
import { PrintView } from './components/PrintView';
import { CHEAT_CARDS } from './data/cheatSheetData';
import { CheckCircle2, Bookmark, Award, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hp');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('capgemini_devops_bookmarks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return ['tf-lifecycle', 'tf-state-azure'];
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_font_size') as FontSize;
      if (saved && ['normal', 'large', 'xlarge'].includes(saved)) {
        return saved;
      }
    }
    // Default to 'large' or 'normal' - let's set 'large' by default to fulfill "aumente a fonte" immediately!
    return 'large';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('capgemini_devops_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('app_font_size', fontSize);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
      document.documentElement.classList.add(`font-size-${fontSize}`);
    }
  }, [fontSize]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removido dos favoritos.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Adicionado aos favoritos para revisão!');
        return [...prev, id];
      }
    });
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '1') setActiveTab('cheatsheet');
      if (e.key === '2') setActiveTab('hp');
      if (e.key === '3') setActiveTab('flashcards');
      if (e.key === '4') setActiveTab('star');
      if (e.key === '5') setActiveTab('cli');
      if (e.key === '6') setActiveTab('guide');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isPrintMode) {
    return <PrintView cards={CHEAT_CARDS} onClose={() => setIsPrintMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Bar Header with Tab Navigation and Font Size Adjuster */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarksCount={bookmarks.length}
        onPrint={() => setIsPrintMode(true)}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Hero Announcement Bar / Context */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-2.5 text-slate-300">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              Ecossistemas:
            </span>
            <span className="font-semibold text-white">HP / HPE Hybrid Cloud & DevOps</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-blue-300 font-medium">Capgemini Azure & Terraform</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs sm:text-sm">
            <span>Atalhos: <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">1</kbd>–<kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">6</kbd></span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-emerald-400 font-medium">Fonte ampliada para leitura</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-amber-400 font-medium">Áudio Coach em Inglês</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'cheatsheet' && (
          <CheatSheetGrid
            cards={CHEAT_CARDS}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            showToast={showToast}
          />
        )}

        {activeTab === 'hp' && <HpDevOpsPage showToast={showToast} />}

        {activeTab === 'flashcards' && <FlashcardsMode />}

        {activeTab === 'star' && <StarBuilder showToast={showToast} />}

        {activeTab === 'cli' && <CliCommandPalette showToast={showToast} />}

        {activeTab === 'guide' && <InterviewGuide />}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/80 text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 px-4 mt-12 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Capgemini & HP / HPE DevOps Interview Hub · Preparação completa para entrevistas técnicas em Cloud, Nuvem Híbrida e IaC.
          </p>
          <div className="flex items-center gap-4 text-slate-300">
            <button
              onClick={() => setActiveTab('hp')}
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              Ecossistema HP / HPE
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('cheatsheet')}
              className="hover:text-blue-400 transition-colors font-medium"
            >
              Cheat Sheet Capgemini
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPrintMode(true)}
              className="hover:text-white transition-colors"
            >
              Versão Impressão / PDF
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
