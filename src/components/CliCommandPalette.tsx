import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, Terminal, X, Filter } from 'lucide-react';
import { CLI_COMMANDS, CliCommand } from '../data/cheatSheetData';

interface CliCommandPaletteProps {
  showToast: (msg: string) => void;
}

export const CliCommandPalette: React.FC<CliCommandPaletteProps> = ({ showToast }) => {
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredCommands = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CLI_COMMANDS.filter((cmd) => {
      if (selectedTool !== 'all' && cmd.tool !== selectedTool) {
        return false;
      }
      if (!q) return true;
      return (
        cmd.command.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.useCase.toLowerCase().includes(q)
      );
    });
  }, [selectedTool, search]);

  const handleCopy = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    showToast('Comando copiado para a área de transferência!');
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tool Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedTool('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTool === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({CLI_COMMANDS.length})
            </button>
            <button
              onClick={() => setSelectedTool('Terraform')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTool === 'Terraform'
                  ? 'bg-purple-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terraform
            </button>
            <button
              onClick={() => setSelectedTool('Azure CLI')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTool === 'Azure CLI'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Azure CLI
            </button>
            <button
              onClick={() => setSelectedTool('kubectl')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTool === 'kubectl'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              kubectl
            </button>
            <button
              onClick={() => setSelectedTool('Helm')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTool === 'Helm'
                  ? 'bg-indigo-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Helm
            </button>
            <button
              onClick={() => setSelectedTool('Git')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedTool === 'Git'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Git
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar comando ou caso de uso..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
          <span>{filteredCommands.length} comandos listados</span>
          <span className="text-[11px] text-slate-500">
            Clique no ícone de cópia para colar diretamente no seu terminal ou pipeline
          </span>
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-3">
        {filteredCommands.map((cmd, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-4 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              {/* Tool badge and use case info */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-blue-400 font-mono">{cmd.tool}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{cmd.description}</span>
              </div>

              {/* Code command */}
              <div className="bg-slate-950 rounded border border-slate-800/90 px-3 py-2 flex items-center justify-between gap-3 overflow-x-auto">
                <code className="text-xs font-mono text-cyan-300 whitespace-nowrap">
                  {cmd.command}
                </code>
              </div>

              {/* In interview context */}
              <p className="text-[11px] text-slate-400">
                <strong className="text-slate-300">Quando citar em entrevista:</strong> {cmd.useCase}
              </p>
            </div>

            {/* Copy button */}
            <button
              onClick={() => handleCopy(cmd.command, idx)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap self-stretch md:self-center justify-center"
              title="Copiar comando"
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
