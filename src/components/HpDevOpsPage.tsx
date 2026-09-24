import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Server,
  Cloud,
  Cpu,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles,
  GitBranch,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import {
  HP_DEVOPS_CARDS,
  HP_INTERVIEW_QUESTIONS,
  HpDevOpsCard,
  HpInterviewSimulationQuestion
} from '../data/hpDevOpsData';
import { speakEnglish, stopSpeech } from '../utils/speech';

interface HpDevOpsPageProps {
  showToast: (msg: string) => void;
}

export const HpDevOpsPage: React.FC<HpDevOpsPageProps> = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'cards' | 'questions' | 'architecture' | 'glossary'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'hp-greenlake': true,
    'hp-nonstop': true
  });
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    'hp-q1': true,
    'hp-q2': true
  });

  const filteredCards = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return HP_DEVOPS_CARDS.filter((card) => {
      if (selectedCategory !== 'all' && card.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      const titleMatch = card.title.toLowerCase().includes(q);
      const subtitleMatch = card.subtitle.toLowerCase().includes(q);
      const summaryMatch = card.summary.toLowerCase().includes(q);
      const pointsMatch = card.keyPoints.some((p) => p.toLowerCase().includes(q));
      const tipMatch = card.interviewTip.toLowerCase().includes(q);
      const codeMatch = card.codeSnippet?.code.toLowerCase().includes(q);
      const englishMatch = card.englishInterviewPhrase.phrase.toLowerCase().includes(q);

      return titleMatch || subtitleMatch || summaryMatch || pointsMatch || tipMatch || codeMatch || englishMatch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    showToast('Código copiado com sucesso!');
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner with HP/HPE Strategic Context */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-full flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" />
              HP / HPE DevOps Ecosystem
            </span>
            <span className="text-sm text-slate-300 font-medium">
              Especialização em Nuvem Híbrida & Automação Corporativa
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Guia de Engenharia DevOps HP / HPE
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Para atuar no ecossistema da <strong className="text-emerald-400">HP / HPE (Hewlett Packard Enterprise)</strong>,
            é essencial dominar tanto a stack moderna de mercado quanto as soluções corporativas proprietárias.
            O foco atual da empresa está fortemente voltado para a <strong className="text-white">nuvem híbrida</strong>,
            <strong className="text-white"> automação de ponta a ponta</strong> e <strong className="text-white">modernização de sistemas legados de missão crítica</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-sm">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-xs block">Nuvem Híbrida Central</span>
              <strong className="text-emerald-400 text-sm font-semibold">HPE GreenLake PCE</strong>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-xs block">CI/CD & GitOps</span>
              <strong className="text-blue-400 text-sm font-semibold">GitHub Actions & Jenkins</strong>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-xs block">IaC & Configuração</span>
              <strong className="text-amber-400 text-sm font-semibold">Ansible & Terraform</strong>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-xs block">Missão Crítica (100% Up)</span>
              <strong className="text-purple-400 text-sm font-semibold">HPE NonStop & RHEL/SUSE</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('cards')}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeSubTab === 'cards'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tópicos da Stack & Ferramentas</span>
          <span className="bg-emerald-950/80 text-emerald-200 text-xs px-2 py-0.5 rounded-full">
            {HP_DEVOPS_CARDS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('questions')}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeSubTab === 'questions'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Perguntas de Entrevista HP</span>
          <span className="bg-emerald-950/80 text-emerald-200 text-xs px-2 py-0.5 rounded-full">
            {HP_INTERVIEW_QUESTIONS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeSubTab === 'architecture'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Arquitetura Híbrida HPE</span>
        </button>

        <button
          onClick={() => setActiveSubTab('glossary')}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeSubTab === 'glossary'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Glossário & Framework CALMS</span>
        </button>
      </div>

      {/* VIEW 1: CARDS & STACK DETAILS */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Category segmented filter */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  Todas as Áreas ({HP_DEVOPS_CARDS.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('greenlake')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    selectedCategory === 'greenlake'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  HPE GreenLake
                </button>
                <button
                  onClick={() => setSelectedCategory('cicd')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    selectedCategory === 'cicd'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  CI/CD (GitHub/Jenkins)
                </button>
                <button
                  onClick={() => setSelectedCategory('containers')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    selectedCategory === 'containers'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  Kubernetes & Docker
                </button>
                <button
                  onClick={() => setSelectedCategory('iac')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    selectedCategory === 'iac'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  Ansible & Terraform
                </button>
                <button
                  onClick={() => setSelectedCategory('processes')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    selectedCategory === 'processes'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  CALMS & GitOps
                </button>
                <button
                  onClick={() => setSelectedCategory('proprietary')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    selectedCategory === 'proprietary'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-950 text-purple-300 hover:text-white border border-purple-900/50'
                  }`}
                >
                  <span>NonStop & Híbrido</span>
                  <span className="text-[11px] font-bold text-amber-300">★ Diferencial</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar GreenLake, NonStop, Ansible..."
                  className="w-full bg-slate-950 border border-slate-700/90 rounded-lg pl-10 pr-8 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>Exibindo {filteredCards.length} tópicos estratégicos para a vaga HP / HPE</span>
              <span className="text-emerald-400 font-medium">Bílingue (Português + Áudio Coach em Inglês)</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-6">
            {filteredCards.map((card) => {
              const isExpanded = expandedCards[card.id] ?? false;

              return (
                <div
                  key={card.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg transition-all hover:border-slate-700 space-y-5"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                          {card.categoryLabel}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs sm:text-sm font-medium text-slate-300">
                          {card.subtitle}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-600/40 text-emerald-300 font-semibold">
                          {card.badge}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {card.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => toggleCard(card.id)}
                      className="self-start sm:self-center px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? 'Recolher detalhes' : 'Ver detalhes & Código'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    {card.summary}
                  </p>

                  {/* Key points */}
                  <div className="space-y-2 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800/80">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      Pontos Chave & Requisitos Técnicos:
                    </span>
                    <ul className="space-y-2.5">
                      {card.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-200 leading-relaxed">
                          <span className="text-emerald-400 mt-1 shrink-0 font-bold">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interview Tip Banner */}
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                        Como defender na Entrevista Técnica da HP:
                      </span>
                      <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
                        {card.interviewTip}
                      </p>
                    </div>
                  </div>

                  {/* English Audio Coach */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
                          Audio Coach (Inglês Técnico para Entrevista)
                        </span>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(card.id, card.englishInterviewPhrase.phrase)}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                          playingPhraseId === card.id
                            ? 'bg-red-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {playingPhraseId === card.id ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            <span>Parar Áudio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>Ouvir Pronúncia</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-sm sm:text-base font-medium text-white italic bg-slate-900/90 p-3.5 rounded-lg border border-slate-800">
                      "{card.englishInterviewPhrase.phrase}"
                    </p>

                    <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                      <p><strong className="text-slate-400">Tradução:</strong> {card.englishInterviewPhrase.translation}</p>
                      <p><strong className="text-slate-400">Quando usar:</strong> {card.englishInterviewPhrase.context}</p>
                    </div>
                  </div>

                  {/* Expandable Section: Code Snippet & Deep Dive */}
                  {isExpanded && (
                    <div className="space-y-5 pt-3 border-t border-slate-800">
                      {card.codeSnippet && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
                              <Terminal className="w-4 h-4 text-blue-400" />
                              {card.codeSnippet.caption}
                            </span>
                            <button
                              onClick={() => handleCopyCode(card.id, card.codeSnippet!.code)}
                              className="px-3 py-1 text-xs sm:text-sm font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                            >
                              {copiedSnippetId === card.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar Código</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
                            <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                              <code>{card.codeSnippet.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {card.sampleQuestions && card.sampleQuestions.length > 0 && (
                        <div className="space-y-3 bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800">
                          <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider block">
                            Pergunta Rápida & Resposta Modelo:
                          </span>
                          {card.sampleQuestions.map((sq, sIdx) => (
                            <div key={sIdx} className="space-y-2">
                              <p className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                <span className="text-emerald-400">P:</span> {sq.question}
                              </p>
                              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-5 border-l-2 border-emerald-500/50">
                                <span className="text-emerald-400 font-semibold">R:</span> {sq.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERVIEW SIMULATION QUESTIONS */}
      {activeSubTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Perguntas Frequentes & Respostas Prontas para HP / HPE
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Estas questões simulam perguntas reais feitas por gestores técnicos e arquitetos da HP.
              Pratique a resposta em Português e escute a versão em Inglês para brilhar na entrevista!
            </p>
          </div>

          <div className="space-y-5">
            {HP_INTERVIEW_QUESTIONS.map((q) => {
              const isExpanded = expandedQuestions[q.id] ?? true;

              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wide">
                        {q.category}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {q.question}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className="self-start sm:self-center px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? 'Ocultar' : 'Ver Resposta'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 italic">
                    <strong>Contexto da banca:</strong> {q.context}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">Conceitos-Chave:</span>
                    {q.keyConcepts.map((kc, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-200"
                      >
                        {kc}
                      </span>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      {/* Portuguese answer */}
                      <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800/90 space-y-2">
                        <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span>🇧🇷 Resposta Estruturada (Português)</span>
                        </span>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                          {q.suggestedAnswerPt}
                        </p>
                      </div>

                      {/* English answer with speech */}
                      <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-blue-900/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>🇺🇸 Resposta Modelo (Inglês para Entrevistas Globais)</span>
                          </span>

                          <button
                            onClick={() => handlePlayAudio(q.id, q.suggestedAnswerEn)}
                            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                              playingPhraseId === q.id
                                ? 'bg-red-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                          >
                            {playingPhraseId === q.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>Pausar</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Ouvir em Inglês</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                          "{q.suggestedAnswerEn}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: ARCHITECTURE MAP */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
                Visão Geral do Fluxo Híbrido
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Como a Arquitetura DevOps da HP se Conecta
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
                A HP opera uma topologia híbrida onde o <strong>HPE GreenLake</strong> atua como a ponte unificadora
                entre sistemas de missão crítica locais (HPE NonStop e frotas RHEL/SUSE) e nuvens públicas (AWS e Azure),
                tudo orquestrado via <strong>GitOps</strong> e <strong>CI/CD contínuo</strong>.
              </p>
            </div>

            {/* Visual Interactive Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {/* Layer 1: Datacenter & Missão Crítica */}
              <div className="bg-slate-950 border border-purple-500/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Camada 1: On-Premise</span>
                  <Server className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Missão Crítica & Hardware</h3>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span><strong>HPE NonStop:</strong> 100% Uptime, Process Pairs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span><strong>RHEL & SUSE SLES:</strong> Servidores Enterprise</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span><strong>Ansible Starter Kits:</strong> Automação idempotente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span><strong>HPE Storage:</strong> Primera, Alletra, Nimble (CSI)</span>
                  </li>
                </ul>
              </div>

              {/* Layer 2: HPE GreenLake Orchestrator */}
              <div className="bg-slate-950 border border-emerald-500/50 rounded-xl p-5 space-y-3 relative shadow-emerald-950/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Camada 2: Nuvem Híbrida</span>
                  <Cloud className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">HPE GreenLake (PCE)</h3>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Private Cloud Enterprise:</strong> Consumo sob demanda</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Kubernetes Orchestration:</strong> Clusters elásticos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>APIs REST & Terraform:</strong> Provedor oficial HPEGL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Consumo Medido (FinOps):</strong> Governança & Custos</span>
                  </li>
                </ul>
              </div>

              {/* Layer 3: Esteira CI/CD, GitOps & Multi-Cloud */}
              <div className="bg-slate-950 border border-blue-500/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Camada 3: Entrega & Nuvens</span>
                  <GitBranch className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">GitOps & Nuvem Pública</h3>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>GitHub Actions & Jenkins:</strong> Polyglot CI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>GitOps Repositories:</strong> Fonte única da verdade</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>Interconexão Dedicada:</strong> ExpressRoute / DirectConnect</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>AWS & Microsoft Azure:</strong> Arquitetura multi-cloud</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Architectural Summary Banner */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-start gap-3">
              <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              <div className="space-y-1">
                <strong className="text-sm sm:text-base text-white font-semibold">
                  A Linha de Raciocínio para a Entrevista:
                </strong>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  "Na HPE, a infraestrutura não é tratada como silos separados: o <strong>GreenLake</strong> abstrai a complexidade do hardware e entrega APIs para as esteiras de <strong>GitHub Actions</strong> e <strong>GitOps</strong>, enquanto o <strong>Ansible</strong> garante a configuração idempotente nos servidores de alta disponibilidade <strong>NonStop</strong> e frotas <strong>Linux</strong>, com links de baixa latência para <strong>Azure e AWS</strong>."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: GLOSSARY & CALMS */}
      {activeSubTab === 'glossary' && (
        <div className="space-y-6">
          {/* CALMS Deep-Dive */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
                Metodologia & Processos HP
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                O Framework CALMS no Dia a Dia da HP
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Os 5 pilares fundamentais de maturidade DevOps adotados para organizar equipes, esteiras e infraestrutura:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xl font-black text-blue-400">C</span>
                <h3 className="text-sm font-bold text-white">Culture (Cultura)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Colaboração aberta entre administradores de infraestrutura e desenvolvedores de pipelines, eliminando silos organizacionais.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xl font-black text-emerald-400">A</span>
                <h3 className="text-sm font-bold text-white">Automation (Automação)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automação de ponta a ponta com Ansible, Terraform, GitHub Actions e GitOps sem intervenções manuais em produção.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xl font-black text-amber-400">L</span>
                <h3 className="text-sm font-bold text-white">Lean (Enxugamento)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Redução de desperdícios (Toil), entregas em lotes pequenos e frequentes, e ciclos rápidos de feedback.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xl font-black text-purple-400">M</span>
                <h3 className="text-sm font-bold text-white">Measurement (Métricas)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Métricas DORA (Lead Time, MTTR, Deployment Frequency) somadas ao controle de consumo e custos no GreenLake.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xl font-black text-cyan-400">S</span>
                <h3 className="text-sm font-bold text-white">Sharing (Partilha)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Repositórios Git compartilhados, playbooks reutilizáveis e documentação viva transparente entre esquadras.
                </p>
              </div>
            </div>

            {/* Roles comparison */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Papel: Administradores de Infraestrutura
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Responsáveis pela sustentação e confiabilidade do hardware físico, switches de rede, arrays de storage (Alletra/Primera), servidores NonStop e provisionamento do plano de controle do HPE GreenLake.
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-base font-bold text-blue-400 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Papel: Desenvolvedores de Pipelines
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Focados na construção e otimização das esteiras de CI/CD (GitHub Actions, Jenkins), testes automatizados, conteinerização e deploy contínuo das aplicações de software nas plataformas provisionadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
