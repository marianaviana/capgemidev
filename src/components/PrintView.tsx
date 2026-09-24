import React from 'react';
import { CheatCard, CLI_COMMANDS } from '../data/cheatSheetData';
import { ArrowLeft, Printer } from 'lucide-react';

interface PrintViewProps {
  cards: CheatCard[];
  onClose: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({ cards, onClose }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Control bar (hidden during actual window.print) */}
      <div className="no-print flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-lg sticky top-4 z-40 shadow-lg">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Dica: No diálogo de impressão, escolha "Salvar como PDF"
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-slate-800 pb-4 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Capgemini DevOps Azure — Resumo Estratégico de Entrevista
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Guia de consulta rápida · Terraform, Azure DevOps, Kubernetes (AKS), GitHub Actions & Método S.T.A.R.
        </p>
      </div>

      {/* Cards List formatted for printing */}
      <div className="space-y-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-item bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-blue-400">
                {card.categoryLabel} · {card.subCategory}
              </span>
              {card.isPrimary && (
                <span className="text-red-400 font-bold text-[11px]">
                  ★ Skill Primária
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white">{card.title}</h3>
            <p className="text-xs text-slate-300">{card.summary}</p>

            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              {card.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            {card.codeSnippet && (
              <pre className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto">
                <code>{card.codeSnippet.code}</code>
              </pre>
            )}

            <div className="p-3 bg-slate-950/80 rounded border border-slate-800 text-xs">
              <strong className="text-amber-400 block mb-1">Dica de Ouro (Entrevista):</strong>
              <p className="text-slate-200 italic">{card.interviewTip}</p>
            </div>

            {card.englishPhrase && (
              <div className="p-2.5 bg-blue-950/30 rounded border border-blue-900/40 text-xs">
                <strong className="text-blue-300 block mb-0.5">Resposta em Inglês:</strong>
                <p className="text-slate-100 font-medium">"{card.englishPhrase.phrase}"</p>
                <p className="text-[11px] text-slate-400 italic">PT: {card.englishPhrase.translation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Commands Summary */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Comandos CLI Essenciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {CLI_COMMANDS.slice(0, 10).map((cmd, idx) => (
            <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1">
              <span className="font-mono font-bold text-blue-400 text-[11px]">{cmd.tool}</span>
              <code className="block bg-slate-950 p-1.5 rounded font-mono text-cyan-300 text-[11px] overflow-x-auto">
                {cmd.command}
              </code>
              <p className="text-slate-400 text-[11px]">{cmd.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
