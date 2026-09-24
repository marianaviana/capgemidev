import React from 'react';
import { Bookmark, Printer, Sparkles } from 'lucide-react';

export type ActiveTab = 'cheatsheet' | 'hp' | 'flashcards' | 'star' | 'cli' | 'guide';
export type FontSize = 'normal' | 'large' | 'xlarge';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  bookmarksCount: number;
  onPrint: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  bookmarksCount,
  onPrint,
  fontSize,
  setFontSize
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className="text-left font-bold text-slate-100 tracking-tight text-lg sm:text-xl hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
        >
          Capgemini & HP DevOps Hub
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm sm:text-base font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'cheatsheet'
                ? 'text-blue-400 border-b-2 border-blue-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Cheat Sheet Azure
          </button>

          <button
            onClick={() => setActiveTab('hp')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'hp'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'hover:text-emerald-300'
            }`}
          >
            <span>HP / HPE DevOps</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold">
              Novo
            </span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'flashcards'
                ? 'text-blue-400 border-b-2 border-blue-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Simulador Flashcards
          </button>

          <button
            onClick={() => setActiveTab('star')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'star'
                ? 'text-blue-400 border-b-2 border-blue-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Método S.T.A.R.
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'cli'
                ? 'text-blue-400 border-b-2 border-blue-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Comandos CLI
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'guide'
                ? 'text-blue-400 border-b-2 border-blue-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Guia & Inglês
          </button>
        </nav>

        {/* Zone 3: Primary actions & Font Size Control */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Font Size Adjuster for requested "aumente a fonte" */}
          <div
            className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold text-slate-300"
            title="Ajustar tamanho da fonte para leitura confortável"
          >
            <span className="px-2 text-slate-400 hidden sm:inline text-xs">Fonte:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded transition-colors ${
                fontSize === 'normal'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tamanho padrão (16.5px)"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded transition-colors ${
                fontSize === 'large'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Fonte Grande (18.5px)"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded transition-colors ${
                fontSize === 'xlarge'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Fonte Extra Grande (21px)"
            >
              A++
            </button>
          </div>

          {bookmarksCount > 0 && (
            <button
              onClick={() => setActiveTab('cheatsheet')}
              title={`${bookmarksCount} tópicos salvos`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-300 bg-amber-950/50 border border-amber-800/60 rounded-lg hover:bg-amber-900/40 transition-colors whitespace-nowrap"
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
              <span>{bookmarksCount} Salvos</span>
            </button>
          )}

          <button
            onClick={onPrint}
            title="Exportar versão limpa para revisão ou PDF"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation bar row for medium & smaller screens */}
      <div className="xl:hidden flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-800/80 mt-2.5 text-xs sm:text-sm pb-1">
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'cheatsheet' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          Cheat Sheet Azure
        </button>
        <button
          onClick={() => setActiveTab('hp')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 ${
            activeTab === 'hp'
              ? 'bg-emerald-600 text-white'
              : 'text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-800/40'
          }`}
        >
          <span>HP / HPE DevOps</span>
          <span className="text-[10px] bg-emerald-900 px-1 rounded text-emerald-200 font-bold">Novo</span>
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'flashcards' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          Simulador
        </button>
        <button
          onClick={() => setActiveTab('star')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'star' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          S.T.A.R.
        </button>
        <button
          onClick={() => setActiveTab('cli')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'cli' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          Comandos CLI
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'guide' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          Guia & Inglês
        </button>
      </div>
    </header>
  );
};
