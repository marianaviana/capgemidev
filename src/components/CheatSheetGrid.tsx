import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';
import { CheatCard } from '../data/cheatSheetData';
import { speakEnglish, stopSpeech } from '../utils/speech';

interface CheatSheetGridProps {
  cards: CheatCard[];
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  showToast: (msg: string) => void;
}

export const CheatSheetGrid: React.FC<CheatSheetGridProps> = ({
  cards,
  bookmarks,
  toggleBookmark,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  // Filter cards based on category, search, and bookmarks
  const filteredCards = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return cards.filter((card) => {
      // Category filter
      if (selectedCategory === 'bookmarks') {
        if (!bookmarks.includes(card.id)) return false;
      } else if (selectedCategory !== 'all' && card.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (!q) return true;

      const titleMatch = card.title.toLowerCase().includes(q);
      const subCategoryMatch = card.subCategory.toLowerCase().includes(q);
      const summaryMatch = card.summary.toLowerCase().includes(q);
      const bulletsMatch = card.bullets.some((b) => b.toLowerCase().includes(q));
      const tipMatch = card.interviewTip.toLowerCase().includes(q);
      const codeMatch = card.codeSnippet?.code.toLowerCase().includes(q);
      const englishMatch = card.englishPhrase?.phrase.toLowerCase().includes(q);

      return (
        titleMatch ||
        subCategoryMatch ||
        summaryMatch ||
        bulletsMatch ||
        tipMatch ||
        codeMatch ||
        englishMatch
      );
    });
  }, [cards, selectedCategory, searchQuery, bookmarks]);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    showToast('Código copiado para a área de transferência!');
    setTimeout(() => {
      setCopiedSnippetId(null);
    }, 2000);
  };

  const handlePlayAudio = (id: string, text: string) => {
    if (playingPhraseId === id) {
      stopSpeech();
      setPlayingPhraseId(null);
      return;
    }

    setPlayingPhraseId(id);
    const success = speakEnglish(
      text,
      0.95,
      () => setPlayingPhraseId(null),
      () => setPlayingPhraseId(null)
    );

    if (!success) {
      showToast('Áudio não suportado neste navegador.');
      setPlayingPhraseId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800/80">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Todos ({cards.length})
            </button>
            <button
              onClick={() => setSelectedCategory('terraform')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'terraform'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Terraform</span>
              <span className="text-xs text-amber-300 font-bold">★ Primário</span>
            </button>
            <button
              onClick={() => setSelectedCategory('azure')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'azure'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Azure / AZDO
            </button>
            <button
              onClick={() => setSelectedCategory('k8s')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'k8s'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Kubernetes
            </button>
            <button
              onClick={() => setSelectedCategory('github')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'github'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              GitHub Actions
            </button>
            <button
              onClick={() => setSelectedCategory('soft')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'soft'
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Capgemini & Soft Skills
            </button>
            {bookmarks.length > 0 && (
              <button
                onClick={() => setSelectedCategory('bookmarks')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                  selectedCategory === 'bookmarks'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Salvos ({bookmarks.length})</span>
              </button>
            )}
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conceito, erro, comando..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results count & Quick indicator */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span>Mostrando {filteredCards.length} de {cards.length} tópicos estratégicos</span>
            {searchQuery && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-blue-400">Filtrado por: "{searchQuery}"</span>
              </>
            )}
          </div>
          <span className="hidden sm:inline text-slate-400 text-xs">
            Dica: Clique no ícone de som para ouvir a pronúncia em inglês
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <p className="text-lg font-semibold text-slate-200">Nenhum tópico encontrado</p>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Não encontramos resultados para sua pesquisa atual. Tente alterar os termos ou selecionar a categoria "Todos".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Redefinir Filtros
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCards.map((card) => {
          const isBookmarked = bookmarks.includes(card.id);
          const isExpanded = !!expandedCards[card.id];
          const isPlayingAudio = playingPhraseId === card.id;

          return (
            <div
              key={card.id}
              className={`card-item bg-slate-900 border rounded-xl p-6 flex flex-col justify-between transition-all duration-200 shadow-sm ${
                card.isPrimary
                  ? 'border-purple-900/60 hover:border-purple-500/70'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3.5">
                {/* Zero-Pill Metadata Line: Category · SubCategory · Primary indicator */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{card.categoryLabel}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300">{card.subCategory}</span>
                    {card.isPrimary && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                          Skill Primária
                        </span>
                      </>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(card.id)}
                    title={isBookmarked ? 'Remover dos favoritos' : 'Salvar para revisar'}
                    className={`p-1.5 rounded transition-colors ${
                      isBookmarked
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 fill-amber-400/20" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Card Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {card.title}
                </h3>

                {/* Summary */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {card.summary}
                </p>

                {/* Bullets List */}
                <ul className="text-sm sm:text-base text-slate-200 space-y-2 list-disc list-inside">
                  {card.bullets.map((bullet, idx) => {
                    const colonIndex = bullet.indexOf(':');
                    if (colonIndex !== -1) {
                      const prefix = bullet.substring(0, colonIndex);
                      const rest = bullet.substring(colonIndex + 1);
                      return (
                        <li key={idx} className="leading-relaxed">
                          <strong className="text-slate-100 font-semibold">{prefix}:</strong>
                          <span className="text-slate-300">{rest}</span>
                        </li>
                      );
                    }
                    return (
                      <li key={idx} className="leading-relaxed text-slate-300">
                        {bullet}
                      </li>
                    );
                  })}
                </ul>

                {/* Code Snippet Box (if available) */}
                {card.codeSnippet && (
                  <div className="bg-slate-950 rounded-lg border border-slate-800/90 overflow-hidden">
                    <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 border-b border-slate-800/80 text-xs text-slate-300">
                      <span className="font-mono text-slate-200 font-semibold">
                        {card.codeSnippet.caption || card.codeSnippet.language}
                      </span>
                      <button
                        onClick={() => handleCopyCode(card.id, card.codeSnippet!.code)}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                        title="Copiar código"
                      >
                        {copiedSnippetId === card.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3.5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      <code>{card.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Bottom Section: Golden Interview Tip & English Audio */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 space-y-3">
                {/* Dica de Ouro Box */}
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Dica de Ouro (Entrevista Capgemini)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    {card.interviewTip}
                  </p>
                </div>

                {/* English Response Phrase & Audio Pronunciation */}
                {card.englishPhrase && (
                  <div className="bg-blue-950/20 border border-blue-900/40 p-3.5 rounded-lg text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                        Resposta em Inglês ({card.englishPhrase.context})
                      </span>
                      <button
                        onClick={() => handlePlayAudio(card.id, card.englishPhrase!.phrase)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          isPlayingAudio
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/50'
                        }`}
                        title="Ouvir pronúncia em inglês"
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Parar</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Ouvir</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-slate-100 font-medium text-sm sm:text-base">"{card.englishPhrase.phrase}"</p>
                    <p className="text-xs sm:text-sm text-slate-400 italic">PT: {card.englishPhrase.translation}</p>
                  </div>
                )}

                {/* Expand / Collapse In-Depth Questions */}
                {(card.deepDive || card.commonQuestions) && (
                  <div>
                    <button
                      onClick={() => toggleExpand(card.id)}
                      className="w-full flex items-center justify-between text-xs sm:text-sm text-slate-400 hover:text-slate-200 py-1.5 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                        Perguntas frequentes do entrevistador & Detalhes técnicos
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs sm:text-sm space-y-3.5">
                        {card.commonQuestions && (
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-slate-300 block uppercase">
                              Perguntas comuns:
                            </span>
                            <ul className="list-disc list-inside space-y-1.5 text-slate-200">
                              {card.commonQuestions.map((q, idx) => (
                                <li key={idx} className="leading-relaxed">{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {card.deepDive && (
                          <div className="space-y-1.5 pt-2.5 border-t border-slate-800">
                            <span className="text-xs font-semibold text-slate-300 block uppercase">
                              Pontos de aprofundamento:
                            </span>
                            <ul className="list-disc list-inside space-y-1.5 text-slate-200">
                              {card.deepDive.map((d, idx) => (
                                <li key={idx} className="leading-relaxed">{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
