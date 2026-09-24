import React, { useState, useMemo } from 'react';
import { 
  RotateCw, 
  CheckCircle, 
  HelpCircle, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Award
} from 'lucide-react';
import { speakEnglish, stopSpeech } from '../utils/speech';

interface Flashcard {
  id: string;
  category: string;
  question: string;
  questionEn: string;
  keyConcepts: string[];
  idealAnswerPt: string[];
  idealAnswerEn: string;
  goldenTip: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    category: 'Terraform',
    question: 'Como o Terraform no Azure gerencia concorrência de múltiplos desenvolvedores aplicando mudanças simultâneas?',
    questionEn: 'How does Terraform in Azure prevent concurrent state modifications by multiple developers?',
    keyConcepts: ['Remote State', 'Azure Blob Storage', 'Blob Lease (State Locking)', 'Storage Blob Data Contributor'],
    idealAnswerPt: [
      'O estado (.tfstate) é configurado em um backend remoto no Azure Blob Storage.',
      'O Azure Blob Storage possui suporte nativo a Blob Lease, que cria um bloqueio exclusivo (State Lock) no arquivo de estado assim que o comando terraform plan ou apply inicia.',
      'Se outro pipeline ou desenvolvedor tentar rodar apply ao mesmo tempo, receberá um erro de lock ativo, prevenindo corrupção de estado.'
    ],
    idealAnswerEn: 'We configure remote state in Azure Blob Storage, which automatically enforces state locking via native Blob Leases. This prevents concurrent apply runs from corrupting the state file.',
    goldenTip: 'Mencione que autentica o backend com `use_azuread_auth = true` via RBAC do Entra ID, sem usar access keys fixas do storage.'
  },
  {
    id: 'fc-2',
    category: 'Kubernetes',
    question: 'Um pod entrou em CrashLoopBackOff no AKS em produção. Qual é o seu passo a passo metódico de investigação?',
    questionEn: 'A pod is in CrashLoopBackOff in AKS production. What is your methodical troubleshooting workflow?',
    keyConcepts: ['kubectl describe pod', 'Lifecycle Events', 'Exit Codes (137 OOMKilled)', 'kubectl logs --previous', 'Liveness/Readiness Probes'],
    idealAnswerPt: [
      'Passo 1: Executo `kubectl describe pod [nome] -n [namespace]` para inspecionar os eventos finais (Events), status das probes e Exit Code do contêiner.',
      'Passo 2: Se o Exit Code for 137, foi OOMKilled (estourou memory limit). Se for 1, houve erro de aplicação ou exceção não tratada.',
      'Passo 3: Executo `kubectl logs [nome] -n [namespace] --previous` para ler a saída do console e stack trace do processo que acabou de encerrar.',
      'Passo 4: Verifico se variáveis de ambiente obrigatórias ou segredos do Key Vault CSI driver falharam em ser montados.'
    ],
    idealAnswerEn: 'My first diagnostic step is running kubectl describe pod to inspect lifecycle events and container exit codes, followed by kubectl logs with the previous flag to capture the application error before the crash.',
    goldenTip: 'Ressalte a diferença entre Liveness Probe (reinicia o pod) e Readiness Probe (apenas remove o tráfego do pod). Se a readiness falhar, o pod NÃO entra em CrashLoopBackOff, ele apenas fica 0/1 READY.'
  },
  {
    id: 'fc-3',
    category: 'Azure DevOps & Security',
    question: 'Por que utilizar Workload Identity Federation (OIDC) em vez de Service Principals tradicionais com Client Secrets?',
    questionEn: 'Why choose Workload Identity Federation (OIDC) over traditional Service Principals with client secrets in CI/CD pipelines?',
    keyConcepts: ['Zero Trust', 'Passwordless Authentication', 'Short-lived tokens', 'Expired secrets elimination', 'Auditoria Entra ID'],
    idealAnswerPt: [
      'Client Secrets em Service Principals expiram (geralmente em 90 ou 180 dias), gerando interrupções inesperadas de pipeline se a rotação falhar.',
      'Segredos estáticos correm o risco de vazamento em logs ou repositórios.',
      'Com Workload Identity Federation (OIDC), o Azure DevOps ou GitHub gera um token JWT efêmero e assinado que o Microsoft Entra ID valida diretamente.',
      'Nenhum segredo estático precisa ser criado, rotacionado ou armazenado na ferramenta de CI/CD.'
    ],
    idealAnswerEn: 'Workload Identity Federation enables passwordless authentication using short-lived OIDC tokens. It completely eliminates expiring client secrets and prevents credential leaks in CI/CD pipelines.',
    goldenTip: 'Termos que impressionam: "Ephemeral tokens", "Zero-Trust credential management", "No expiring client secrets".'
  },
  {
    id: 'fc-4',
    category: 'Kubernetes',
    question: 'Qual a diferença entre o modelo de rede Kubenet e o Azure CNI no Azure Kubernetes Service (AKS)?',
    questionEn: 'What is the architectural difference between Kubenet and Azure CNI in AKS?',
    keyConcepts: ['VNet IP exhaustion', 'IP allocation per Pod', 'NAT (Network Address Translation)', 'Subnet sizing', 'Microservice latency'],
    idealAnswerPt: [
      'Kubenet: Os pods recebem IPs de um espaço de endereçamento interno e privado do Kubernetes. O nó faz NAT para que o pod acerte a VNet do Azure. Vantagem: economiza IPs da VNet.',
      'Azure CNI: Cada pod recebe um IP real e roteável diretamente da subnet da VNet do Azure.',
      'Vantagem do Azure CNI: Menor latência, comunicação direta com outros recursos privados na Azure (VMs, bancos), suporte nativo a Network Policies avançadas.',
      'Desafio do Azure CNI: Exige um planejamento cuidadoso de subnet para evitar esgotamento de endereços IP.'
    ],
    idealAnswerEn: 'Kubenet uses internal pod CIDR with NAT, conserving VNet IPs. Azure CNI assigns real VNet IP addresses to every pod, offering lower latency and direct network connectivity at the cost of requiring larger subnets.',
    goldenTip: 'Se perguntarem qual você usaria em um cliente de missão crítica da Capgemini: "Azure CNI (ou Azure CNI Overlay) para melhor conectividade e conformidade de segurança corporativa".'
  },
  {
    id: 'fc-5',
    category: 'Terraform',
    question: 'Como você estrutura repositórios e módulos de Terraform para evitar repetição de código e blast radius desnecessário?',
    questionEn: 'How do you structure Terraform code and modules to avoid duplication and minimize blast radius?',
    keyConcepts: ['DRY Principle', 'Child Modules', 'Semantic Versioning in Git tags', 'Environment isolation (dev/qa/prod)', 'State segregation'],
    idealAnswerPt: [
      'Crio repositórios dedicados para módulos reutilizáveis (ex: tf-module-aks, tf-module-networking) versionados via Git tags (v1.0.0).',
      'Nos repositórios de implantação, separo pastas por ambiente (environments/dev, environments/prod) com arquivos de estado independentes.',
      'Isso isola o "blast radius": um erro em desenvolvimento ou teste jamais afetará o state de produção.',
      'Utilizo arquivos .tfvars e Azure Key Vault para injetar parâmetros específicos de cada ambiente.'
    ],
    idealAnswerEn: 'We separate reusable modules into version-tagged Git repositories and isolate deployment environments into distinct directory structures with dedicated state files to restrict the blast radius.',
    goldenTip: 'Use a palavra "Blast Radius" (raio de explosão/impacto). Os entrevistadores avaliam se você se preocupa com a segurança de não derrubar prod enquanto atualiza dev.'
  },
  {
    id: 'fc-6',
    category: 'Soft Skills & Incidentes',
    question: 'Conte sobre uma situação em que você detectou um erro crítico após um deploy. Como conduziu a solução?',
    questionEn: 'Tell me about a time when a critical issue occurred post-deployment. How did you handle the situation?',
    keyConcepts: ['S.T.A.R. Methodology', 'Blameless Post-Mortem', 'Mean Time to Recovery (MTTR)', 'Rollback strategy', 'Process automation'],
    idealAnswerPt: [
      'Situação: Após um deploy agendado de microsserviço, a taxa de erros HTTP 500 subiu para 15% na API de checkout.',
      'Tarefa: Minha prioridade era restaurar o serviço aos usuários em menos de 5 minutos antes de qualquer investigação profunda.',
      'Ação: Acionei o rollback imediato via pipeline automatizado (Helm rollback), normalizando o tráfego em 2 minutos. Em seguida, analisei as métricas no Application Insights e descobri uma incompatibilidade de schema no banco.',
      'Resultado: Restabelecemos 100% da disponibilidade rapidamente e criamos um teste automatizado de compatibilidade de schema na esteira de CI/CD para impedir que o erro ocorresse novamente.'
    ],
    idealAnswerEn: 'When an error spike occurred after a release, my immediate priority was restoring availability via automated Helm rollback within 2 minutes. Afterward, I led a blameless post-mortem and implemented automated pre-flight checks.',
    goldenTip: 'Destaque que sua primeira atitude é sempre RESTAURAR O SERVIÇO (Rollback rápido), e apenas após estabilizar o ambiente é que você faz a investigação de causa-raiz.'
  }
];

export const FlashcardsMode: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reviewedCards, setReviewedCards] = useState<Record<string, 'correct' | 'review'>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return FLASHCARDS;
    return FLASHCARDS.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setIsRevealed(false);
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentIndex(randomIndex);
  };

  const handleMark = (status: 'correct' | 'review') => {
    setReviewedCards((prev) => ({
      ...prev,
      [currentCard.id]: status
    }));
    handleNext();
  };

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    speakEnglish(
      currentCard.idealAnswerEn,
      0.95,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const correctCount = Object.values(reviewedCards).filter((s) => s === 'correct').length;
  const reviewCount = Object.values(reviewedCards).filter((s) => s === 'review').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls & Category Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentIndex(0);
              setIsRevealed(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => {
              setSelectedCategory('Terraform');
              setCurrentIndex(0);
              setIsRevealed(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'Terraform'
                ? 'bg-purple-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terraform
          </button>
          <button
            onClick={() => {
              setSelectedCategory('Kubernetes');
              setCurrentIndex(0);
              setIsRevealed(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'Kubernetes'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kubernetes
          </button>
          <button
            onClick={() => {
              setSelectedCategory('Azure DevOps & Security');
              setCurrentIndex(0);
              setIsRevealed(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'Azure DevOps & Security'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Azure & DevOps
          </button>
          <button
            onClick={() => {
              setSelectedCategory('Soft Skills & Incidentes');
              setCurrentIndex(0);
              setIsRevealed(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedCategory === 'Soft Skills & Incidentes'
                ? 'bg-cyan-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Soft Skills / STAR
          </button>
        </div>

        {/* Shuffle and Progress Tracker */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            title="Sortear pergunta aleatória"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Aleatório</span>
          </button>

          <div className="text-xs font-mono text-slate-400 tabular-nums">
            Card <strong className="text-white">{currentIndex + 1}</strong> de {filteredCards.length}
          </div>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-lg min-h-[420px] flex flex-col justify-between space-y-6">
        {/* Card Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-400">{currentCard.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Pergunta de Entrevista Real</span>
            </div>

            {reviewedCards[currentCard.id] && (
              <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                reviewedCards[currentCard.id] === 'correct' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {reviewedCards[currentCard.id] === 'correct' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Marcado como Dominado
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-3.5 h-3.5" />
                    Marcado para Revisar
                  </>
                )}
              </span>
            )}
          </div>

          {/* Question in Portuguese */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            "{currentCard.question}"
          </h2>

          {/* Question in English */}
          <p className="text-xs sm:text-sm text-slate-400 italic">
            EN: "{currentCard.questionEn}"
          </p>
        </div>

        {/* Revealed Content vs Hidden Call to Action */}
        {!isRevealed ? (
          <div className="py-12 text-center space-y-4 bg-slate-950/60 rounded-lg border border-slate-800/80 p-6">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">
                Como você responderia a essa pergunta técnica?
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Pense por 10 a 20 segundos ou tente formular sua resposta em voz alta antes de conferir os pontos-chave.
              </p>
            </div>
            <button
              onClick={() => setIsRevealed(true)}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors shadow-md"
            >
              Revelar Resposta Ideal & Dica de Ouro
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Key Technical Keywords */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Palavras-chave que o entrevistador busca ouvir:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {currentCard.keyConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="text-cyan-300 font-mono text-[11px] bg-cyan-950/40 border border-cyan-900/60 px-2.5 py-1 rounded"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Structured Points in Portuguese */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pontos de Resposta Recomendados:
              </span>
              <ul className="text-xs text-slate-200 space-y-1.5 list-disc list-inside">
                {currentCard.idealAnswerPt.map((pt, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ideal English Speech with Audio */}
            <div className="bg-blue-950/30 border border-blue-900/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Como falar em Inglês na entrevista:
                </span>
                <button
                  onClick={handlePlayAudio}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    isPlayingAudio
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-blue-900/50 text-blue-200 hover:bg-blue-800'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Parar Áudio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir Pronúncia</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                "{currentCard.idealAnswerEn}"
              </p>
            </div>

            {/* Dica de Ouro */}
            <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                ★ Dica de Ouro Capgemini:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                {currentCard.goldenTip}
              </p>
            </div>
          </div>
        )}

        {/* Card Navigation & Grading Controls */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
            >
              <span>Próximo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Self-Rating Buttons (only if revealed) */}
          {isRevealed && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleMark('review')}
                className="flex-1 sm:flex-initial px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-md hover:bg-amber-900/40 transition-colors"
              >
                Preciso Revisar
              </button>
              <button
                onClick={() => handleMark('correct')}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-md hover:bg-emerald-900/40 transition-colors"
              >
                Acertei com Confiança
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Score Summary Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <CheckCircle className="w-3.5 h-3.5" />
            <strong>{correctCount}</strong> dominados
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <strong>{reviewCount}</strong> para revisar
          </span>
        </div>

        <button
          onClick={() => setReviewedCards({})}
          className="text-slate-500 hover:text-slate-300 text-[11px]"
        >
          Zerar progresso
        </button>
      </div>
    </div>
  );
};
