import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Save, 
  Plus, 
  Trash2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { STAR_SCENARIOS, StarScenario } from '../data/cheatSheetData';
import { speakEnglish, stopSpeech } from '../utils/speech';

interface StarBuilderProps {
  showToast: (msg: string) => void;
}

export const StarBuilder: React.FC<StarBuilderProps> = ({ showToast }) => {
  const [scenarios, setScenarios] = useState<StarScenario[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('capgemini_devops_star_scenarios');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return STAR_SCENARIOS;
  });

  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || 'star-migration');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const [formData, setFormData] = useState<StarScenario>({ ...activeScenario });

  useEffect(() => {
    if (activeScenario) {
      setFormData({ ...activeScenario });
    }
  }, [activeScenarioId]);

  const handleFieldChange = (field: keyof StarScenario, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCurrent = () => {
    const updated = scenarios.map((s) => (s.id === formData.id ? { ...formData } : s));
    setScenarios(updated);
    localStorage.setItem('capgemini_devops_star_scenarios', JSON.stringify(updated));
    showToast('História S.T.A.R. salva com sucesso!');
  };

  const handleAddNew = () => {
    const newId = `custom-star-${Date.now()}`;
    const newScenario: StarScenario = {
      id: newId,
      title: 'Minha História Customizada de Projeto',
      category: 'Experiência Pessoal',
      situation: 'In my last role, we were dealing with...',
      task: 'My objective was to automate...',
      action: 'I developed and deployed...',
      result: 'As a result, we improved delivery speed by...',
      keyMetrics: 'Redução de X% no tempo · Zero downtime',
      audioPhraseEn: 'As a result of our automated architecture, we reduced deployment time significantly.'
    };

    const updated = [newScenario, ...scenarios];
    setScenarios(updated);
    setActiveScenarioId(newId);
    setFormData(newScenario);
    localStorage.setItem('capgemini_devops_star_scenarios', JSON.stringify(updated));
    showToast('Novo modelo S.T.A.R. criado!');
  };

  const handleDeleteCurrent = () => {
    if (scenarios.length <= 1) {
      showToast('Você deve manter pelo menos uma história.');
      return;
    }
    const updated = scenarios.filter((s) => s.id !== formData.id);
    setScenarios(updated);
    setActiveScenarioId(updated[0].id);
    localStorage.setItem('capgemini_devops_star_scenarios', JSON.stringify(updated));
    showToast('História removida.');
  };

  const compiledEnglishAnswer = `Situation: ${formData.situation}

Task: ${formData.task}

Action: ${formData.action}

Result: ${formData.result}`;

  const handleCopyFull = () => {
    navigator.clipboard.writeText(compiledEnglishAnswer);
    setCopied(true);
    showToast('História S.T.A.R. em inglês copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    // Read the combined Action and Result
    const textToRead = `${formData.action} ${formData.result}`;
    speakEnglish(
      textToRead,
      0.95,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Construtor de Respostas S.T.A.R. (Inglês & Técnico)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            A metodologia S.T.A.R. (Situation, Task, Action, Result) é a estrutura padrão avaliada nas entrevistas da Capgemini para comprovar impacto técnico real e métricas de sucesso.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Criar Nova História</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Scenarios */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Cenários de Entrevista:
          </span>

          <div className="space-y-2">
            {scenarios.map((scenario) => {
              const isActive = scenario.id === activeScenarioId;
              return (
                <button
                  key={scenario.id}
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-slate-900 border-blue-500 shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="text-blue-400 font-semibold">{scenario.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">
                    {scenario.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                    {scenario.keyMetrics}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick Tip Box */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-2 text-xs text-slate-400">
            <span className="font-bold text-amber-400 flex items-center gap-1 text-[11px] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Regra de Ouro do S.T.A.R.:
            </span>
            <p className="text-[11px] leading-relaxed">
              Dedique <strong className="text-slate-200">15%</strong> do tempo na Situação/Tarefa, <strong className="text-slate-200">50%</strong> na sua Ação técnica direta ("I designed...", "I automated..."), e <strong className="text-slate-200">35%</strong> no Resultado mensurável (números, horas economizadas, uptime).
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Interactive Editor & Speech */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 sm:p-6 space-y-5">
            {/* Title & Category Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Título do Cenário (ex: Migração AKS)"
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-md px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                placeholder="Categoria (ex: Terraform / Azure)"
                className="w-full sm:w-44 bg-slate-950 border border-slate-700/80 rounded-md px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* S - Situation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center text-[10px] font-mono font-bold">
                  S
                </span>
                <span>Situation (Situação & Contexto):</span>
              </label>
              <textarea
                rows={2}
                value={formData.situation}
                onChange={(e) => handleFieldChange('situation', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* T - Task */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-purple-900/60 text-purple-300 flex items-center justify-center text-[10px] font-mono font-bold">
                  T
                </span>
                <span>Task (Tarefa & Desafio Principal):</span>
              </label>
              <textarea
                rows={2}
                value={formData.task}
                onChange={(e) => handleFieldChange('task', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* A - Action */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-emerald-900/60 text-emerald-300 flex items-center justify-center text-[10px] font-mono font-bold">
                  A
                </span>
                <span>Action (Ação Técnica Realizada por Você):</span>
              </label>
              <textarea
                rows={3}
                value={formData.action}
                onChange={(e) => handleFieldChange('action', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* R - Result */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-amber-900/60 text-amber-300 flex items-center justify-center text-[10px] font-mono font-bold">
                  R
                </span>
                <span>Result (Resultado Quantificado & Métricas):</span>
              </label>
              <textarea
                rows={2}
                value={formData.result}
                onChange={(e) => handleFieldChange('result', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* Key Metrics Highlight */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">
                Resumo de Métricas para Falar Rápido:
              </label>
              <input
                type="text"
                value={formData.keyMetrics}
                onChange={(e) => handleFieldChange('keyMetrics', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayAudio}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isPlayingAudio
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/40 border border-blue-800/60'
                  }`}
                  title="Ouvir a fala completa em inglês"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Parar Áudio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir em Inglês</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyFull}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Resposta</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {scenarios.length > 1 && (
                  <button
                    onClick={handleDeleteCurrent}
                    className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40 transition-colors"
                    title="Excluir história"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleSaveCurrent}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
