export interface HpDevOpsCard {
  id: string;
  category: 'greenlake' | 'cicd' | 'containers' | 'iac' | 'processes' | 'proprietary';
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  keyPoints: string[];
  codeSnippet?: {
    language: string;
    code: string;
    caption: string;
  };
  interviewTip: string;
  englishInterviewPhrase: {
    phrase: string;
    translation: string;
    context: string;
  };
  deepDiveTopics?: string[];
  sampleQuestions?: {
    question: string;
    answer: string;
  }[];
}

export const HP_DEVOPS_CARDS: HpDevOpsCard[] = [
  // ================= 1. FERRAMENTAS PRINCIPAIS =================
  {
    id: 'hp-greenlake',
    category: 'greenlake',
    categoryLabel: 'Nuvem Corporativa',
    title: 'HPE GreenLake & Private Cloud Enterprise',
    subtitle: 'O Núcleo da Nuvem Híbrida da HPE',
    badge: 'Core HP Ecosystem',
    summary: 'O HPE GreenLake é a plataforma central como serviço (as-a-service) que entrega a experiência da nuvem pública (elasticidade, self-service, consumo pay-per-use) diretamente em datacenters locais (on-premises), colocation e na borda (edge).',
    keyPoints: [
      'Núcleo da Nuvem Híbrida: Unifica a gestão de instâncias bare-metal, máquinas virtuais e containers em infraestrutura privada com modelo de pagamento por consumo medido.',
      'HPE GreenLake for Private Cloud Enterprise (PCE): Fornece APIs modernas e declarativas para que equipes DevOps provisionem ambientes inteiros de forma automatizada sem tickets manuais.',
      'Integração em Pipelines CI/CD: Suporta automação via REST APIs, Terraform Provider e CLI oficial para orquestrar recursos como parte de esteiras de entrega contínua.',
      'Console Centralizado (HPE GreenLake Cloud Platform): Painel de controle único para governança, controle de custos (cost analytics), conformidade e provisionamento multi-tenant.'
    ],
    codeSnippet: {
      language: 'hcl',
      caption: 'Exemplo de Manifesto Terraform integrando com HPE GreenLake',
      code: `# Terraform Provider para provisionamento automatizado no HPE GreenLake
terraform {
  required_providers {
    hpegl = {
      source  = "HPE/hpegl"
      version = "~> 0.4.0"
    }
  }
}

provider "hpegl" {
  # Autenticação declarativa via Service Principal e Token seguro
  tenant_id     = var.hpe_tenant_id
  client_id     = var.hpe_client_id
  client_secret = var.hpe_client_secret
}

# Provisionamento de instância privada elástica no GreenLake PCE
resource "hpegl_vmaas_instance" "app_cluster_node" {
  name             = "hpe-prod-node-01"
  cloud_id         = data.hpegl_vmaas_cloud.hybrid_datacenter.id
  group_id         = data.hpegl_vmaas_group.production.id
  layout_id        = data.hpegl_vmaas_layout.rhel9_standard.id
  plan_id          = data.hpegl_vmaas_plan.compute_optimized.id
  network_ids      = [data.hpegl_vmaas_network.internal_vlan.id]
  environment_code = "production"
  
  tags = {
    CostCenter  = "DevOps-Core"
    Environment = "Hybrid-Enterprise"
    ManagedBy   = "Terraform-GitOps"
  }
}`
    },
    interviewTip: 'Na entrevista, enfatize que você compreende o HPE GreenLake não apenas como hardware on-premise, mas como uma plataforma moderna de consumo como serviço que combina a segurança e conformidade de datacenters privados com a agilidade de automação da nuvem pública via APIs e GitOps.',
    englishInterviewPhrase: {
      phrase: 'HPE GreenLake delivers an agile cloud operational experience on-premises, enabling automated provisioning through REST APIs and declarative GitOps pipelines with enterprise governance.',
      translation: 'O HPE GreenLake entrega uma experiência operacional de nuvem ágil no local (on-premise), permitindo provisionamento automatizado através de APIs REST e pipelines GitOps declarativas com governança corporativa.',
      context: 'Use ao ser perguntado sobre sua visão sobre a estratégia de nuvem híbrida da HPE.'
    },
    deepDiveTopics: [
      'Modelo de consumo medido (Consumption Analytics & FinOps no GreenLake)',
      'GreenLake Central: Controle de conformidade, segurança e controle de custos híbridos',
      'Federação de identidades corporativas via SAML/OAuth2 no console GreenLake'
    ],
    sampleQuestions: [
      {
        question: 'O que diferencia o HPE GreenLake das nuvens públicas tradicionais como AWS e Azure?',
        answer: 'O HPE GreenLake traz o modelo de nuvem (autoatendimento, elasticidade, pagamento por uso) para onde os dados precisam estar fisicamente — por conformidade regulatória, baixa latência ou soberania de dados —, mantendo integração híbrida direta com AWS e Azure através de consoles e pipelines unificados.'
      }
    ]
  },
  {
    id: 'hp-cicd',
    category: 'cicd',
    categoryLabel: 'Controle de Versão & CI/CD',
    title: 'GitHub, GitHub Actions, Jenkins & GitLab',
    subtitle: 'Esteiras Nativas e Automação Multiplataforma',
    badge: 'Automação Central',
    summary: 'A HP adota GitHub e GitHub Actions como ferramentas nativas padrão para repositórios de código e esteiras automatizadas, convivendo com Jenkins e GitLab em projetos corporativos legados, testes de carga e compilações de grande escala.',
    keyPoints: [
      'GitHub & GitHub Actions: Padrão moderno e integrado para esteiras de build, testes, scanning de segurança (CodeQL/Dependabot) e entrega contínua com runners corporativos (self-hosted runners).',
      'Jenkins: Amplamente utilizado em projetos internos legados da HP para testes massivos de regressão, compilação de linguagens tradicionais e automação em servidores bare-metal e ambientes heterogêneos.',
      'GitLab / GitLab CI: Utilizado em esquadras internas para ciclo de vida de desenvolvimento completo, segurança de pipelines (SAST/DAST) e automação de deploys multi-repo.',
      'Automação Segura: Uso de OIDC (OpenID Connect) e tokens de curta duração para comunicação segura entre GitHub Actions e o ecossistema GreenLake / Azure / AWS, sem armazenar credenciais estáticas.'
    ],
    codeSnippet: {
      language: 'yaml',
      caption: 'Pipeline GitHub Actions integrado com GreenLake e Self-Hosted Runners',
      code: `name: HP Enterprise CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    name: Build & Security Validation
    # Utiliza runners corporativos integrados à rede privada
    runs-on: [self-hosted, linux, enterprise-network]
    steps:
      - name: Checkout Código Fonte
        uses: actions/checkout@v4

      - name: Setup Java & Maven (Polyglot CI)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Executar Testes Unitários e SAST
        run: |
          mvn clean test
          mvn spotbugs:check

      - name: Containerizar com Docker
        run: |
          docker build -t internal-registry.hpe.corp/app/core-service:\${{ github.sha }} .
          docker tag internal-registry.hpe.corp/app/core-service:\${{ github.sha }} internal-registry.hpe.corp/app/core-service:latest

  deploy-greenlake:
    name: Deploy to HPE GreenLake Kubernetes Cluster
    needs: build-and-test
    runs-on: [self-hosted, enterprise-network]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Autenticar via API Token do GreenLake
        env:
          GL_API_TOKEN: \${{ secrets.HPE_GREENLAKE_SERVICE_TOKEN }}
        run: |
          # Autenticação declarativa sem credenciais estáticas
          echo "Autenticado no plano de controle HPE GreenLake"

      - name: Sincronizar Manifesto GitOps
        run: |
          kubectl apply -f k8s/production/deployment.yaml`
    },
    interviewTip: 'Destaque como você estrutura pipelines que integram com ferramentas de segurança corporativa, usam runners auto-hospedados (self-hosted) dentro da rede privada da empresa e utilizam segredos gerenciados para deploy seguro.',
    englishInterviewPhrase: {
      phrase: 'We leverage GitHub Actions alongside self-hosted runners within the corporate network to streamline our polyglot CI/CD pipelines and automate deployments into HPE GreenLake.',
      translation: 'Utilizamos GitHub Actions juntamente com runners auto-hospedados dentro da rede corporativa para otimizar nossas esteiras CI/CD poliglotas e automatizar deploys no HPE GreenLake.',
      context: 'Demonstra fluência em arquitetura de CI/CD para grandes corporações.'
    },
    deepDiveTopics: [
      'Self-Hosted Runners em ambientes de rede restrita e proxies corporativos',
      'Migração e convivência harmônica entre Jenkins clássico e GitHub Actions moderno',
      'Quality Gates, SonarQube e esteiras de aprovação para ambientes de produção'
    ],
    sampleQuestions: [
      {
        question: 'Como você lidaria com a coexistência de Jenkins e GitHub Actions em uma grande empresa como a HP?',
        answer: 'Tratando cada um segundo sua melhor vocação: GitHub Actions como padrão moderno para novas aplicações, microsserviços e GitOps nativo com repositórios; e Jenkins para orquestração de testes pesados de hardware, pipelines legadas complexas e automação de plataformas proprietárias, interligando os status via webhooks e APIs.'
      }
    ]
  },
  {
    id: 'hp-containers',
    category: 'containers',
    categoryLabel: 'Conteinerização & Orquestração',
    title: 'Docker & Kubernetes no Ecossistema GreenLake',
    subtitle: 'Microsserviços em Larga Escala e Nuvem Privada',
    badge: 'Escalabilidade',
    summary: 'Docker é utilizado para o empacotamento consistente de microsserviços, enquanto o Kubernetes é a espinha dorsal para orquestração em escala. O HPE GreenLake interage diretamente com clusters K8s para gerenciar ambientes de implantação físicos e virtualizados.',
    keyPoints: [
      'Docker para Microsserviços: Padronização de ambientes de desenvolvimento até produção, garantindo paridade e mitigando inconsistências entre sistemas operacionais.',
      'HPE GreenLake Kubernetes Integration: O GreenLake orquestra clusters Kubernetes nativos sobre bare-metal ou VMs, com automação de storage (HPE CSI Driver) e rede corporativa.',
      'HPE CSI Driver for Kubernetes: Driver de interface de armazenamento que conecta volumes persistentes diretamente a arrays corporativos (HPE Primera, Alletra, Nimble Storage).',
      'Alta Disponibilidade & Rolling Updates: Configuração de probes (liveness/readiness), Horizontal Pod Autoscalers (HPA) e políticas de tolerância a falhas para sustentar tráfego contínuo.'
    ],
    codeSnippet: {
      language: 'yaml',
      caption: 'Kubernetes PersistentVolumeClaim usando HPE CSI StorageClass',
      code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: hpe-critical-storage-pvc
  namespace: production
spec:
  accessModes:
    - ReadWriteOnce
  # StorageClass gerenciada pelo driver oficial HPE CSI
  storageClassName: hpe-alletra-high-performance
  resources:
    requests:
      storage: 500Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: core-processing-service
  namespace: production
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: service
          image: internal-registry.hpe.corp/core-service:v2.4.0
          resources:
            requests:
              memory: "2Gi"
              cpu: "1000m"
            limits:
              memory: "4Gi"
              cpu: "2000m"
          volumeMounts:
            - mountPath: "/data/persistent"
              name: hpe-storage
      volumes:
        - name: hpe-storage
          persistentVolumeClaim:
            claimName: hpe-critical-storage-pvc`
    },
    interviewTip: 'Comente sobre o HPE CSI Driver para Kubernetes! Esse é um conhecimento avançado que mostra que você entende como containers corporativos se comunicam com o armazenamento físico e arrays de discos corporativos da HPE.',
    englishInterviewPhrase: {
      phrase: 'Kubernetes clusters orchestrated through HPE GreenLake utilize the HPE CSI Driver to seamlessly bind mission-critical persistent volumes to high-performance enterprise storage arrays.',
      translation: 'Clusters Kubernetes orquestrados através do HPE GreenLake utilizam o Driver HPE CSI para vincular volumes persistentes de missão crítica diretamente a arrays de armazenamento corporativo de alta performance.',
      context: 'Excelente para perguntas técnicas sobre orquestração de containers corporativos.'
    },
    deepDiveTopics: [
      'HPE CSI Driver para Kubernetes e integração de Storage Classes',
      'Ingress Controllers corporativos, Service Mesh (Istio) e mTLS',
      'Políticas de Resource Quotas e isolamento multi-tenant'
    ],
    sampleQuestions: [
      {
        question: 'Como garantir zero downtime ao atualizar aplicações conteinerizadas no Kubernetes?',
        answer: 'Configurando uma estratégia de RollingUpdate com maxUnavailable: 0 e maxSurge: 1, associada a readinessProbes bem calibradas para garantir que novos pods só recebam tráfego quando estiverem totalmente saudáveis, e preStop hooks com terminação graciosa.'
      }
    ]
  },
  {
    id: 'hp-iac-ansible',
    category: 'iac',
    categoryLabel: 'IaC & Automação de Sistemas',
    title: 'Ansible & Terraform: Infraestrutura como Código',
    subtitle: 'Automação Híbrida e Ambientes de Missão Crítica',
    badge: 'IaC Essencial',
    summary: 'Ansible e Terraform formam a dupla de ouro da IaC na HP. O Terraform orquestra a infraestrutura declarativa híbrida, enquanto o Ansible brilha na configuração contínua e gerenciamento de servidores de missão crítica (como a linha HPE NonStop e frotas RHEL/SUSE).',
    keyPoints: [
      'Divisão Clara de Responsabilidades: Terraform provisiona os recursos (máquinas, redes, clusters, armazenamento), enquanto Ansible gerencia a configuração interna, softwares, usuários e patches com idempotência.',
      'Ansible para Ambientes HPE NonStop: A HPE desenvolveu módulos e playbooks dedicados no "DevOps Starter Kit" para gerenciar e fazer deploys automatizados em servidores NonStop.',
      'Playbooks Idempotentes: Garantia de que a execução repetida de um playbook atinja o estado desejado sem efeitos colaterais indesejados em produção.',
      'Terraform Híbrido: Gerenciamento unificado de recursos on-premise no GreenLake e recursos em nuvens públicas (AWS/Azure) através de workspaces e state seguro com locking.'
    ],
    codeSnippet: {
      language: 'yaml',
      caption: 'Playbook Ansible para Configuração de Servidor de Missão Crítica / NonStop Kit',
      code: `- name: Configurar e Atualizar Ambiente Corporativo HPE
  hosts: enterprise_servers
  become: yes
  vars:
    app_version: "3.5.1"
    enterprise_packages:
      - curl
      - git
      - openssl
      - hpe-tools-agent

  tasks:
    - name: Garantir pacotes base do sistema instalados (Idempotência)
      package:
        name: "{{ enterprise_packages }}"
        state: present

    - name: Aplicar configurações seguras de kernel e sysctl
      sysctl:
        name: net.ipv4.tcp_max_syn_backlog
        value: '4096'
        state: present
        reload: yes

    - name: Executar deploy de binário otimizado de baixa latência
      copy:
        src: "dist/core-binary-{{ app_version }}"
        dest: "/opt/hpe/services/core-binary"
        owner: apprunner
        group: enterprise
        mode: '0750'
      notify: Reiniciar Servico de Baixa Latencia

  handlers:
    - name: Reiniciar Servico de Baixa Latencia
      service:
        name: core-service
        state: restarted`
    },
    interviewTip: 'Ao falar de Ansible, cite a idempotência e os papéis (roles), além de enfatizar que na HPE o Ansible é um facilitador essencial para modernizar sistemas legados e servidores de missão crítica sem necessitar de agentes complexos instalados.',
    englishInterviewPhrase: {
      phrase: 'We use Terraform for declarative infrastructure provisioning and Ansible for idempotent configuration management, particularly across HPE NonStop kits and enterprise Linux fleets.',
      translation: 'Usamos Terraform para provisionamento declarativo de infraestrutura e Ansible para gerenciamento de configuração idempotente, especialmente em kits HPE NonStop e frotas Linux corporativas.',
      context: 'Use para justificar a escolha de ferramentas de IaC na entrevista técnica.'
    },
    deepDiveTopics: [
      'Ansible Collections e Galaxy para módulos corporativos HPE',
      'Gerenciamento de segredos em Ansible com Ansible Vault',
      'Estratégias de rollbacks automáticos com Terraform e Ansible'
    ],
    sampleQuestions: [
      {
        question: 'Por que utilizar tanto Terraform quanto Ansible em vez de apenas um deles?',
        answer: 'Terraform é imbatível em provisionamento declarativo e ciclo de vida de infraestrutura com gerenciamento de estado. O Ansible é agentless e excelente em orquestração de tarefas procedurais, configuração de sistemas operacionais existentes e automação de plataformas proprietárias como o HPE NonStop.'
      }
    ]
  },

  // ================= 2. PROCESSOS E METODOLOGIAS =================
  {
    id: 'hp-processes-polyglot',
    category: 'processes',
    categoryLabel: 'Processos & Metodologias',
    title: 'Automação CI/CD Polyglot & Multiplataforma',
    subtitle: 'Da Nuvem Moderna ao Código Legado de Baixa Latência',
    badge: 'Arquitetura Complexa',
    summary: 'Na HP, a esteira de CI/CD precisa lidar tanto com stacks modernas de alta produtividade (Java, Python, Go, Node.js) quanto com código corporativo de baixíssima latência e missão crítica (C, C++, COBOL, TAL) executando em servidores de alta capacidade.',
    keyPoints: [
      'Ambientes Heterogêneos: O pipeline precisa orquestrar builds para arquiteturas de hardware diferentes (x86_64, ARM, servidores de transação de alta densidade).',
      'Testes de Regressão e Validação Rigorosa: Para código de baixa latência em serviços financeiros, o pipeline integra testes de estresse e validações que rodam antes do merge em branch protegida.',
      'Padronização de Artefatos: Criação de pacotes versionados (RPMs, tarballs assinados, imagens Docker) indexados em repositórios corporativos de artefatos (Nexus, Artifactory).',
      'Continuous Delivery com Gates de Aprovação: Deploy automático em ambientes de desenvolvimento e homologação, com gates de aprovação manual e métricas de desempenho para promoção em produção.'
    ],
    codeSnippet: {
      language: 'yaml',
      caption: 'Pipeline Polyglot com compilação de código de baixa latência + microsserviço',
      code: `name: Polyglot Multi-Architecture CI

on: [push]

jobs:
  # Job 1: Código de Baixa Latência em C/C++ para servidores de alta capacidade
  build-native-core:
    runs-on: [self-hosted, enterprise-linux]
    steps:
      - uses: actions/checkout@v4
      - name: Compilar Módulo C de Baixa Latência
        run: |
          make clean
          make release CC=gcc CFLAGS="-O3 -Wall -pthread"
          ./tests/run_latency_benchmarks.sh

  # Job 2: Microsserviço de API em Python / Java
  build-api-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: |
          pip install -r requirements.txt
          pytest tests/`
    },
    interviewTip: 'Demonstre maturidade explicando que um engenheiro DevOps na HP precisa ter a mente aberta para entender as restrições de código nativo e legado, sabendo desenhar pipelines seguras sem tentar forçar padrões de microsserviço onde a arquitetura exige baixa latência extrema.',
    englishInterviewPhrase: {
      phrase: 'Our CI/CD pipelines are architected to support polyglot environments, seamlessly validating modern microservices alongside low-latency mission-critical enterprise workloads.',
      translation: 'Nossas esteiras de CI/CD são arquitetadas para suportar ambientes poliglotas, validando de forma transparente microsserviços modernos juntamente com cargas corporativas de missão crítica e baixa latência.',
      context: 'Resposta de alto nível para desafios de engenharia em ambientes legados + cloud.'
    },
    deepDiveTopics: [
      'Estratégias de compilação cruzada (cross-compilation) e hardware targets',
      'Matrizes de compatibilidade entre sistemas legados e APIs de nuvem',
      'Automação de testes de estresse de rede e medição de latência sub-milissegundo'
    ],
    sampleQuestions: [
      {
        question: 'Como garantir a qualidade em uma esteira que compila tanto código moderno quanto legado de missão crítica?',
        answer: 'Segmentando os jobs em etapas especializadas com runners dedicados, aplicando linters e testes unitários rápidos nas primeiras etapas e acionando ambientes de teste integrados e de benchmarking de latência antes da homologação final.'
      }
    ]
  },
  {
    id: 'hp-gitops-calms',
    category: 'processes',
    categoryLabel: 'GitOps & Cultura',
    title: 'GitOps no GreenLake & A Cultura CALMS na HP',
    subtitle: 'Repositórios como Fonte da Verdade e Pilares Organizacionais',
    badge: 'Metodologia & Cultura',
    summary: 'A gestão da infraestrutura no GreenLake é realizada via GitOps com repositórios Git declarativos e tokens seguros. A cultura corporativa é fundamentada no framework CALMS com divisão transparente entre Administradores de Infraestrutura e Desenvolvedores de Pipelines.',
    keyPoints: [
      'GitOps para Infraestrutura GreenLake: Toda configuração de rede, cotas, clusters e máquinas é gerenciada através de repositórios Git públicos ou privados corporativos.',
      'Automação via Tokens de Acesso: Sincronização segura através de service accounts com mínimo privilégio (Least Privilege) e tokens rotativos.',
      'Cultura CALMS:',
      '  • Culture (Cultura): Foco em colaboração e compartilhamento de responsabilidade entre times de produto e infraestrutura.',
      '  • Automation (Automação): Eliminação sistemática de trabalho manual e repetitivo (Toil reduction).',
      '  • Lean (Enxugamento): Lotes pequenos de entrega, menor tempo de espera e foco em valor contínuo para o cliente.',
      '  • Measurement (Mensuração): Métricas de entrega contínua (DORA metrics), custo de consumo de recursos e monitoramento de saúde.',
      '  • Sharing (Compartilhamento): Disseminação de conhecimento interno, playbooks compartilhados e documentação viva.',
      'Divisão de Papéis: Administradores de Infraestrutura cuidam do hardware base, clusters GreenLake e conectividade; Desenvolvedores de Pipelines focam na esteira de software e deploy das aplicações.'
    ],
    codeSnippet: {
      language: 'markdown',
      caption: 'Estrutura GitOps de Repositório de Infraestrutura HPE GreenLake',
      code: `infra-greenlake-gitops/
├── README.md
├── environments/
│   ├── production/
│   │   ├── greenlake-compute.tf
│   │   ├── k8s-cluster-specs.yaml
│   │   └── network-routing.tf
│   └── staging/
│       ├── greenlake-compute.tf
│       └── k8s-cluster-specs.yaml
├── modules/
│   ├── greenlake-tenant/
│   └── hybrid-connect/
└── .github/
    └── workflows/
        └── gitops-sync.yml   # Aplica alterações automaticamente após PR aprovado`
    },
    interviewTip: 'Ao ser questionado sobre cultura DevOps na HP, mencione espontaneamente os 5 pilares do CALMS e cite como você colabora harmoniosamente respeitando a divisão de papéis entre times de infraestrutura física/plataforma e times de desenvolvimento de software.',
    englishInterviewPhrase: {
      phrase: 'Under the CALMS framework, we establish a single source of truth using GitOps, creating a clear division between base infrastructure administration and application pipeline development.',
      translation: 'Sob o framework CALMS, estabelecemos uma única fonte da verdade utilizando GitOps, criando uma clara divisão entre a administração da infraestrutura base e o desenvolvimento de pipelines de aplicação.',
      context: 'Frase de impacto para perguntas comportamentais ou sobre processos DevOps na HP.'
    },
    deepDiveTopics: [
      'Métricas DORA (Deployment Frequency, Lead Time, MTTR, Change Failure Rate) no contexto corporativo',
      'Fluxo de pull requests com revisão obrigatória de pares e testes de conformidade automáticos',
      'FinOps e controle de custos integrado ao pilar Measurement do CALMS'
    ],
    sampleQuestions: [
      {
        question: 'Como a divisão entre administradores de infraestrutura e desenvolvedores de pipeline beneficia uma organização do tamanho da HP?',
        answer: 'Permite especialização profunda: os administradores garantem a alta disponibilidade, conformidade, segurança do hardware físico e do plano de controle do GreenLake, enquanto os engenheiros de pipeline capacitam os desenvolvedores com esteiras rápidas, padronizadas e seguras para entregar valor de software continuamente.'
      }
    ]
  },

  // ================= 3. ECOSSISTEMAS PROPRIETÁRIOS =================
  {
    id: 'hp-nonstop',
    category: 'proprietary',
    categoryLabel: 'Ecossistema Proprietário',
    title: 'HPE NonStop & DevOps Starter Kits',
    subtitle: 'Tolerância Extrema a Falhas e Disponibilidade 100% Contínua',
    badge: 'Diferencial Competitivo HP',
    summary: 'Os servidores HPE NonStop são projetados para missão crítica com tolerância absoluta a falhas de hardware e software, suportando bancos globais, operadoras de cartão e telecom. A HP disponibiliza o "DevOps Starter Kit" com playbooks prontos de Ansible para integrar esses servidores ao ciclo DevOps moderno.',
    keyPoints: [
      'Disponibilidade 100% Contínua (Zero Downtime): Arquitetura massivamente paralela onde qualquer componente (CPU, memória, disco, link) pode falhar sem interromper as transações financeiras.',
      'HPE NonStop DevOps Starter Kit: Pacote oficial que inclui playbooks Ansible, módulos de automação e padrões de integração com Git, trazendo práticas ágeis para a plataforma.',
      'Automação sem Risco: Aplicação de atualizações com estratégias de rolling update no nível de processo (process pairs), garantindo que serviços bancários continuem processando pagamentos em tempo real.',
      'Diferencial Raro em Entrevistas: Candidatos que conhecem a existência do HPE NonStop e seu Starter Kit com Ansible se destacam imediatamente frente a perfis genéricos de nuvem.'
    ],
    codeSnippet: {
      language: 'yaml',
      caption: 'Playbook Ansible adaptado do DevOps Starter Kit para HPE NonStop',
      code: `- name: HPE NonStop Continuous Automation Playbook
  hosts: nonstop_nodes
  gather_facts: no
  tasks:
    - name: Verificar integridade do cluster e disponibilidade dos pares de processos
      hpe.nonstop.cluster_status:
        state: healthy
      register: cluster_check

    - name: Fazer staging seguro do novo pacote de aplicação financeira
      hpe.nonstop.package_deploy:
        package_source: "/releases/banking-service-v4.1.tar"
        target_subvolume: "$DATA.APPLIB"
        validate_checksum: yes

    - name: Executar switchover suave sem interrupção de transações
      hpe.nonstop.process_switchover:
        process_name: "$BKP"
        primary_process: "$PRM"
        graceful_timeout_seconds: 30`
    },
    interviewTip: 'Citar o HPE NonStop e explicar que ele sustenta sistemas de pagamentos e transações de missão crítica, e que hoje a HPE modernizou essa operação com o DevOps Starter Kit baseado em Ansible, é o maior diferencial competitivo que você pode apresentar para a vaga!',
    englishInterviewPhrase: {
      phrase: 'HPE NonStop servers provide mission-critical fault tolerance with zero downtime. Leveraging the HPE NonStop DevOps Starter Kit with Ansible allows us to modernize and automate deployments in high-availability environments.',
      translation: 'Os servidores HPE NonStop fornecem tolerância a falhas de missão crítica com zero tempo de inatividade. O uso do DevOps Starter Kit para HPE NonStop com Ansible nos permite modernizar e automatizar implantações em ambientes de alta disponibilidade.',
      context: 'Principal diferencial técnico para citar quando perguntado sobre o portfólio da HPE.'
    },
    deepDiveTopics: [
      'Arquitetura de Process Pairs no HPE NonStop OS',
      'Integração de monitoramento de transações com Prometheus e Grafana',
      'Procedimentos de auditoria regulatória (PCI-DSS, SOX) no ecossistema NonStop'
    ],
    sampleQuestions: [
      {
        question: 'O que é o HPE NonStop e qual seu papel em ambientes bancários?',
        answer: 'É uma arquitetura de servidores e sistema operacional com tolerância extrema a falhas (sem nenhum ponto único de falha), projetada para disponibilidade ininterrupta 24/7/365, onde transações bancárias e de cartões de crédito continuam processando mesmo se um hardware falhar fisicamente.'
      }
    ]
  },
  {
    id: 'hp-linux-hybrid',
    category: 'proprietary',
    categoryLabel: 'Sistemas & Multi-Cloud',
    title: 'Linux Corporativo (RHEL/SUSE) & Conectividade Híbrida',
    subtitle: 'Interconexão Segura entre Datacenter e Nuvens Públicas',
    badge: 'Infraestrutura Híbrida',
    summary: 'A infraestrutura corporativa da HP é sustentada por distribuições robustas de Linux como Red Hat Enterprise Linux (RHEL) e SUSE Linux Enterprise Server (SLES), integradas através de links dedicados e seguros a nuvens públicas como AWS e Azure.',
    keyPoints: [
      'Distribuições Linux Enterprise: Sólido conhecimento de RHEL e SUSE (SLES) para configuração de redes, SELinux/AppArmor, tuning de performance de kernel e segurança de servidores.',
      'Conectividade Híbrida Dedicada: Interconexão entre o HPE GreenLake on-premises e nuvens públicas via AWS Direct Connect, Azure ExpressRoute e túneis IPsec redundantes com BGP.',
      'Gerenciamento Unificado de Identidade e Acesso: Integração de servidores Linux corporativos com Active Directory / Azure AD via Kerberos e SSSD para autenticação centralizada.',
      'Observabilidade Unificada: Coleta de métricas e logs através de agentes em RHEL/SUSE encaminhados para dashboards centralizados com alertas proativos.'
    ],
    codeSnippet: {
      language: 'bash',
      caption: 'Comandos essenciais de validação e conectividade em RHEL/SUSE corporativo',
      code: `# Verificar status de segurança do SELinux em RHEL corporativo
sestatus

# Verificar interfaces de rede e rotas dedicadas para nuvem híbrida (AWS/Azure)
ip route show
ip link show dev bond0

# Testar resolução de nomes e latência de link dedicado
mtr --report -c 10 hybrid-gateway.corp.internal

# Validação do daemon de segurança e identidade corporativa (SSSD)
systemctl status sssd
realm list

# Monitoramento de desempenho de I/O em discos corporativos
iostat -xz 1 5`
    },
    interviewTip: 'Mencione sua experiência ou entendimento de Linux corporativo (RHEL e SUSE), enfatizando boas práticas de segurança (como SELinux, hardening com CIS Benchmarks) e roteamento de rede híbrida com nuvens públicas.',
    englishInterviewPhrase: {
      phrase: 'We manage enterprise Linux environments across RHEL and SUSE, maintaining resilient hybrid connectivity to AWS and Azure via dedicated ExpressRoute and Direct Connect links.',
      translation: 'Gerenciamos ambientes Linux corporativos em RHEL e SUSE, mantendo conectividade híbrida resiliente com AWS e Azure através de links dedicados ExpressRoute e Direct Connect.',
      context: 'Demonstra capacidade de operar ambientes híbridos complexos.'
    },
    deepDiveTopics: [
      'Hardening com CIS Benchmarks e conformidade em RHEL e SUSE',
      'Configuração de interfaces agrupadas (bonding/LACP) para alta disponibilidade de rede',
      'Estratégias de roteamento dinâmico via BGP em ambientes híbridos'
    ],
    sampleQuestions: [
      {
        question: 'Quais os principais cuidados ao projetar uma arquitetura híbrida entre datacenter on-premise e nuvens públicas como AWS ou Azure?',
        answer: 'Garantir redundância física nos links (duplo Direct Connect ou ExpressRoute com fallback VPN), desenhar segmentação de IP sem sobreposição de CIDR, implementar criptografia ponta a ponta e estabelecer observabilidade e políticas de segurança unificadas.'
      }
    ]
  }
];

export interface HpInterviewSimulationQuestion {
  id: string;
  category: string;
  question: string;
  context: string;
  keyConcepts: string[];
  suggestedAnswerPt: string;
  suggestedAnswerEn: string;
}

export const HP_INTERVIEW_QUESTIONS: HpInterviewSimulationQuestion[] = [
  {
    id: 'hp-q1',
    category: 'HPE GreenLake & Híbrido',
    question: 'Como você explicaria a proposta de valor do HPE GreenLake e como ele se integra a uma esteira moderna de CI/CD?',
    context: 'Pergunta frequente para avaliar se o candidato entende a transformação da HPE em uma empresa de serviços de nuvem híbrida.',
    keyConcepts: ['Nuvem Híbrida On-Premises', 'Consumo Pay-per-Use', 'APIs REST / Terraform Provider', 'GitOps'],
    suggestedAnswerPt: 'O HPE GreenLake entrega a experiência e agilidade da nuvem pública dentro do datacenter do cliente, fornecendo automação elástica para servidores bare-metal, máquinas virtuais e clusters Kubernetes com faturamento sob demanda. Em uma esteira de CI/CD, integramos o GreenLake através de suas APIs REST e do provedor Terraform oficial, permitindo que pipelines de GitHub Actions provisionem ou escalem ambientes de forma declarativa e segura através de tokens e GitOps.',
    suggestedAnswerEn: 'HPE GreenLake brings the public cloud operating model on-premises, offering automated elasticity for bare-metal, VMs, and Kubernetes with pay-per-use consumption. In a modern CI/CD pipeline, we integrate GreenLake using its REST APIs and official Terraform provider, enabling GitHub Actions to declaratively provision and scale environments via secure GitOps workflows.'
  },
  {
    id: 'hp-q2',
    category: 'Missão Crítica & HPE NonStop',
    question: 'Em um cenário bancário com servidores HPE NonStop, como aplicar automação DevOps sem arriscar downtime ou violação de conformidade?',
    context: 'Testa conhecimento no diferencial proprietário da HPE e maturidade em sistemas onde qualquer falha de segundos custa milhões.',
    keyConcepts: ['Zero Downtime', 'DevOps Starter Kit', 'Ansible Idempotente', 'Process Pairs'],
    suggestedAnswerPt: 'Utilizamos o HPE NonStop DevOps Starter Kit integrado com playbooks de Ansible idempotentes. A arquitetura de process pairs do NonStop permite atualizar processos secundários em background e executar um switchover suave em milissegundos sem interromper as transações ativas. Além disso, aplicamos testes automatizados rigorosos em homologação, validação de integridade por checksum e gates de aprovação antes de qualquer alteração.',
    suggestedAnswerEn: 'We leverage the HPE NonStop DevOps Starter Kit with idempotent Ansible playbooks. NonStop\'s process pair architecture allows us to stage updates on backup processes and execute seamless switchovers in milliseconds without dropping active financial transactions, backed by strict automated testing and approval gates.'
  },
  {
    id: 'hp-q3',
    category: 'Processos & Cultura CALMS',
    question: 'Como a cultura CALMS orienta a colaboração entre administradores de infraestrutura e desenvolvedores de pipelines na HP?',
    context: 'Avalia a compreensão de processos e metodologias corporativas além do ferramental técnico.',
    keyConcepts: ['Culture', 'Automation', 'Lean', 'Measurement', 'Sharing', 'Divisão de Papéis'],
    suggestedAnswerPt: 'O framework CALMS orienta essa relação estruturando a infraestrutura como plataforma de autoatendimento. Os administradores de infraestrutura concentram-se na sustentação, conformidade e resiliência da base de hardware, armazenamento e plano de controle do GreenLake. Os desenvolvedores de pipelines constroem esteiras automatizadas sobre essa base. Juntos, compartilham métricas de entrega (Measurement), reduzem desperdícios (Lean) e unificam padrões em repositórios Git compartilhados (Sharing).',
    suggestedAnswerEn: 'Under CALMS, infrastructure is operated as an internal self-service platform. Infrastructure administrators manage the physical resilience, compliance, and GreenLake control plane, while pipeline developers build automated workflows on top. Both collaborate through shared Git repositories (Sharing) and continuous metrics (Measurement) to eliminate delivery waste (Lean).'
  },
  {
    id: 'hp-q4',
    category: 'Linux Corporativo & Multi-Cloud',
    question: 'Como desenhar uma arquitetura segura conectando servidores Linux corporativos (RHEL/SUSE) on-premise com nuvens públicas (AWS/Azure)?',
    context: 'Verifica habilidades práticas em redes híbridas corporativas, segurança e interconexão multi-cloud.',
    keyConcepts: ['RHEL/SUSE', 'ExpressRoute / Direct Connect', 'BGP & Roteamento', 'SSSD / Identidade Unificada'],
    suggestedAnswerPt: 'A arquitetura deve utilizar conectividade física dedicada redundante (Azure ExpressRoute ou AWS Direct Connect) com redundância via túneis IPsec criptografados e protocolo de roteamento dinâmico BGP. Nos servidores RHEL e SUSE, mantemos SELinux ativo em modo enforcing, hardening de rede e integração de identidade via SSSD com o diretório corporativo. Toda a infraestrutura híbrida de conectividade é provisionada via código com Terraform.',
    suggestedAnswerEn: 'We design the architecture around redundant dedicated physical links (Azure ExpressRoute or AWS Direct Connect) backed up by IPsec VPN tunnels using dynamic BGP routing. On RHEL and SUSE servers, we enforce SELinux, CIS hardening, and centralized identity management via SSSD, orchestrating the entire topology with Terraform.'
  }
];
