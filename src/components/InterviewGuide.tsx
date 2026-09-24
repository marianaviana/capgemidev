import React, { useState } from 'react';
import { 
  Building2, 
  Volume2, 
  VolumeX, 
  Globe2, 
  CheckCircle2, 
  Sparkles, 
  Headphones, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { speakEnglish, stopSpeech } from '../utils/speech';
import { CAPGEMINI_TIPS } from '../data/cheatSheetData';

interface AudioPhrase {
  category: string;
  phrase: string;
  phoneticHint: string;
  translation: string;
  whenToUse: string;
}

const ENGLISH_PHRASES: AudioPhrase[] = [
  {
    category: 'Abertura & Apresentação',
    phrase: "I've been working as a DevOps and Cloud Engineer, specializing in Azure infrastructure and automated Terraform pipelines.",
    phoneticHint: 'aiv bin uôr-king és a dév-óps end claud en-dji-nir...',
    translation: 'Venho trabalhando como Engenheiro DevOps e Cloud, especializando-me em infraestrutura Azure e pipelines automatizados de Terraform.',
    whenToUse: 'Na pergunta inicial clássica: "Tell me about yourself / Can you introduce yourself?"'
  },
  {
    category: 'Arquitetura & Decisão Técnica',
    phrase: "From an architectural standpoint, our primary goal was to restrict the blast radius and ensure zero-downtime rolling updates.",
    phoneticHint: 'frôm en ar-ki-téc-tchur-al stênd-point...',
    translation: 'Do ponto de vista arquitetural, nosso objetivo principal era restringir o raio de impacto e garantir atualizações graduais sem downtime.',
    whenToUse: 'Ao justificar escolhas de design de módulos de Terraform ou arquitetura de AKS.'
  },
  {
    category: 'Resolução de Incidentes',
    phrase: "When production alerts fired, my first action was initiating an automated rollback to stabilize user traffic, followed by an in-depth root-cause analysis.",
    phoneticHint: 'uên pro-dâc-tion a-lêrts faird, mai fêrst éc-tion...',
    translation: 'Quando alertas de produção dispararam, minha primeira ação foi iniciar um rollback automatizado para estabilizar o tráfego de usuários, seguido de uma análise aprofundada de causa-raiz.',
    whenToUse: 'Ao responder perguntas sobre como você reage sob pressão e incidentes reais.'
  },
  {
    category: 'Segurança & Identidade',
    phrase: "We enforced zero-trust principles by adopting workload identity federation and removing static, long-lived credentials.",
    phoneticHint: 'ui en-fôrst zi-ro trâst prín-ci-pols...',
    translation: 'Aplicamos princípios de confiança zero adotando federação de identidade de carga de trabalho e removendo credenciais estáticas de longa duração.',
    whenToUse: 'Falando sobre segurança em CI/CD com Azure DevOps ou GitHub Actions.'
  },
  {
    category: 'Pedir Esclarecimento com Elegância',
    phrase: "Could you please elaborate on that requirement? I want to make sure I tailor my answer to your specific architectural setup.",
    phoneticHint: 'cud iú pliz i-lá-bo-reit on dét ri-cuair-mênt...',
    translation: 'Você poderia por favor detalhar esse requisito? Quero garantir que minha resposta se adeque ao seu cenário arquitetural específico.',
    whenToUse: 'Quando a pergunta do entrevistador não estiver clara ou o sotaque for desafiador.'
  },
  {
    category: 'Cultura & Colaboração',
    phrase: "I thrive in collaborative, multicultural teams and I'm really looking forward to achieving my next Azure expert certifications.",
    phoneticHint: 'ai thraiv in co-lá-bo-reit-iv, mul-ti-cûl-tchur-al tims...',
    translation: 'Eu prospero em equipes colaborativas e multiculturais, e estou muito ansioso para conquistar minhas próximas certificações de especialista em Azure.',
    whenToUse: 'No encerramento da entrevista ou perguntas sobre fit cultural com a Capgemini.'
  }
];

const VOCABULARY_TERMS = [
  { term: 'Infrastructure as Code (IaC)', definition: 'Infraestrutura como Código (Terraform/Bicep)' },
  { term: 'Blast Radius', definition: 'Raio de impacto de uma falha potencial' },
  { term: 'Zero-Downtime Deployment', definition: 'Implantação sem indisponibilidade (RollingUpdate)' },
  { term: 'Troubleshooting', definition: 'Diagnóstico e resolução metódica de problemas' },
  { term: 'Blameless Post-Mortem', definition: 'Análise retrospectiva sem culpabilização individual' },
  { term: 'Least Privilege RBAC', definition: 'Controle de acesso por função com menor privilégio' },
  { term: 'Drift Detection', definition: 'Identificação de alterações manuais fora do código' },
  { term: 'Idempotency', definition: 'Executar a mesma operação gerando o mesmo resultado final' },
  { term: 'Scalability & Elasticity', definition: 'Capacidade de crescer e encolher conforme demanda' },
  { term: 'Workload Identity', definition: 'Autenticação sem senhas entre pods/pipelines e a nuvem' }
];

export const InterviewGuide: React.FC = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  const handlePlayAudio = (phrase: string, index: number) => {
    if (playingIndex === index) {
      stopSpeech();
      setPlayingIndex(null);
      return;
    }

    setPlayingIndex(index);
    speakEnglish(
      phrase,
      speechRate,
      () => setPlayingIndex(null),
      () => setPlayingIndex(null)
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Capgemini Overview Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-900/40 border border-blue-700/60 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Sobre a Capgemini: Números, Valores & O que Buscam
            </h2>
            <p className="text-xs text-slate-400">
              Líder global com mais de 420 mil colaboradores em 50+ países, parceira estratégica Microsoft Tier 1.
            </p>
          </div>
        </div>

        {/* 7 Values Grid */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            Os 7 Valores Fundamentais da Capgemini (Conecte suas histórias a eles!):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { val: 'Honestidade', desc: 'Comunicação transparente' },
              { val: 'Audácia', desc: 'Inovação e riscos calculados' },
              { val: 'Confiança', desc: 'Autonomia com responsabilidade' },
              { val: 'Liberdade', desc: 'Criatividade e iniciativa' },
              { val: 'Solidariedade', desc: 'Trabalho em equipe e apoio' },
              { val: 'Simplicidade', desc: 'Soluções diretas e claras' },
              { val: 'Fun (Diversão)', desc: 'Clima leve e colaborativo' }
            ].map((v, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-2.5 rounded border border-slate-800/80 text-center space-y-1"
              >
                <div className="text-xs font-bold text-blue-300">{v.val}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips from Recruiters & Tech Leads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
          {CAPGEMINI_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-3.5 rounded border border-slate-800/80 space-y-1"
            >
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{tip.title}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pl-5">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* English Practice & Audio Pronunciation Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/40 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Treinador de Inglês Técnico com Áudio Nativo
              </h3>
              <p className="text-xs text-slate-400">
                Ouça e repita em voz alta para treinar ritmo, cadência e pronúncia profissional.
              </p>
            </div>
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] px-1">Velocidade:</span>
            {[
              { label: '0.8x', val: 0.8 },
              { label: '1.0x', val: 0.95 },
              { label: '1.2x', val: 1.2 }
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setSpeechRate(s.val)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  speechRate === s.val
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phrases List */}
        <div className="space-y-3 pt-2">
          {ENGLISH_PHRASES.map((item, idx) => {
            const isPlaying = playingIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800/80 hover:border-slate-700/90 rounded-lg p-4 space-y-2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(item.phrase, idx)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      isPlaying
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/40'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Parar</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir Pronúncia</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  "{item.phrase}"
                </p>

                <p className="text-xs text-slate-400 italic">
                  PT: {item.translation}
                </p>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900 flex items-center gap-2">
                  <strong className="text-slate-400">Quando usar:</strong>
                  <span>{item.whenToUse}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vocabulary Rescue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Vocabulário Salva-Vidas (DevOps & Cloud)
        </h3>
        <p className="text-xs text-slate-400">
          Termos indispensáveis para inserir naturalmente durante as respostas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {VOCABULARY_TERMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950 p-3 rounded border border-slate-800/80 flex items-start gap-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-200 font-mono">
                  {item.term}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {item.definition}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day-of-Interview Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Checklist para o Dia da Entrevista (15 minutos antes)</span>
        </h3>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li>Tenha esta aba aberta em uma tela secundária para consultas rápidas em caso de bloqueio mental.</li>
          <li>Lembre-se da regra: Situação (rápida) → Ação (eu fiz X com Terraform/K8s) → Resultado (métricas e % de melhoria).</li>
          <li>Em caso de dúvida no inglês: respire, faça uma pausa de 2 segundos e use a frase de esclarecimento.</li>
          <li>Demonstre entusiasmo pelas certificações Azure e vontade de aprender com a equipe global.</li>
        </ul>
      </div>
    </div>
  );
};
