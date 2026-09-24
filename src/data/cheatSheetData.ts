export interface CheatCard {
  id: string;
  category: 'terraform' | 'azure' | 'k8s' | 'github' | 'soft';
  categoryLabel: string;
  subCategory: string;
  title: string;
  isPrimary?: boolean;
  summary: string;
  bullets: string[];
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  interviewTip: string;
  englishPhrase?: {
    phrase: string;
    translation: string;
    context: string;
  };
  deepDive?: string[];
  commonQuestions?: string[];
}

export interface CliCommand {
  tool: 'Terraform' | 'Azure CLI' | 'kubectl' | 'Helm' | 'Git';
  command: string;
  description: string;
  useCase: string;
}

export interface StarScenario {
  id: string;
  title: string;
  category: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  keyMetrics: string;
  audioPhraseEn: string;
}

export const CHEAT_CARDS: CheatCard[] = [
  // ================= TERRAFORM (SKILL PRIMÁRIA) =================
  {
    id: 'tf-lifecycle',
    category: 'terraform',
    categoryLabel: 'Terraform',
    subCategory: 'Ciclo & Comandos',
    title: 'Comandos Essenciais & Ciclo de Vida',
    isPrimary: true,
    summary: 'O fluxo de trabalho declarativo do Terraform é baseado em estados declarados comparados com a infraestrutura real.',
    bullets: [
      'terraform init: Inicializa o diretório, baixa os providers (ex: azurerm) e configura o backend remoto.',
      'terraform plan: Dry-run detalhado que compara o código atual com o .tfstate e mostra o plano de execução (+criar, ~modificar, -destruir).',
      'terraform apply: Executa as alterações na nuvem Azure. Em CI/CD automatizado, costuma rodar com um arquivo de plano gerado previamente.',
      'terraform destroy: Remove todos os recursos gerenciados pelo state daquele workspace/diretório.',
      'terraform fmt -check & terraform validate: Validação sintática e de estilo para pipelines de CI.'
    ],
    codeSnippet: {
      language: 'bash',
      code: `# Validação em pipeline de CI
terraform fmt -check
terraform validate
terraform plan -out=tfplan.binary
# No stage de CD (após aprovação manual):
terraform apply tfplan.binary`,
      caption: 'Workflow seguro em pipeline corporativo'
    },
    interviewTip: '"Sempre enfatizo em entrevistas que nunca executo `terraform apply -auto-approve` diretamente sem antes gerar e persistir o artefato do `plan` em um stage de CI para revisão e aprovação formal."',
    englishPhrase: {
      phrase: 'In our automated pipeline, we strictly separate the plan and apply stages, persisting the execution plan as an artifact for peer review.',
      translation: 'No nosso pipeline automatizado, separamos estritamente os estágios de plan e apply, persistindo o plano de execução como um artefato para revisão por pares.',
      context: 'Explicando governança de IaC em CI/CD'
    },
    deepDive: [
      'terraform refresh: Atualiza o state local com a infraestrutura real na nuvem sem fazer alterações.',
      'terraform taint / terraform apply -replace: Marca um recurso específico para recriação forçada no próximo apply.',
      'terraform state list & terraform state show: Inspeciona itens no arquivo de estado sem precisar abrir o JSON diretamente.'
    ],
    commonQuestions: [
      'Qual a diferença entre terraform plan e terraform apply?',
      'Como você garante que o apply aplicará exatamente o que foi revisado no plan em um pipeline multi-stage?'
    ]
  },
  {
    id: 'tf-state-azure',
    category: 'terraform',
    categoryLabel: 'Terraform',
    subCategory: 'State & Backend',
    title: 'Gerenciamento de Estado & Remote State no Azure',
    isPrimary: true,
    summary: 'O .tfstate mapeia os IDs reais de recursos no Azure para o código HCL. Ele contém dados sensíveis e nunca deve ser versionado no Git.',
    bullets: [
      'Backend Remoto no Azure: Armazenado em um Azure Storage Account (Blob Container privado).',
      'State Locking Automático: O Azure Blob Storage suporta "Lease" nativo que bloqueia o arquivo .tfstate durante um apply, impedindo concorrência de múltiplos desenvolvedores ou pipelines.',
      'Criptografia e Segurança: Storage Account deve ter TLS 1.2+, HTTPS forçado, criptografia em repouso com CMK (Customer Managed Key) ou chave da Microsoft, e Private Endpoint.',
      'Isolamento de Credenciais: Autenticação do backend feita via Managed Identity ou Service Principal com RBAC de "Storage Blob Data Contributor".'
    ],
    codeSnippet: {
      language: 'hcl',
      code: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }
  backend "azurerm" {
    resource_group_name  = "rg-terraform-mgmt"
    storage_account_name = "sttfstateprod001"
    container_name       = "tfstate"
    key                  = "prod.aks.terraform.tfstate"
    use_azuread_auth     = true
  }
}`,
      caption: 'Configuração recomendada de backend remoto com autenticação Azure AD'
    },
    interviewTip: '"Para proteger o estado contra corrupção, ativamos Versionamento de Blobs e Soft Delete no Azure Storage Account, permitindo recuperar versões anteriores do tfstate se algo for corrompido."',
    englishPhrase: {
      phrase: 'We store our remote state in Azure Blob Storage with automated lease locking and Azure AD RBAC authentication instead of hardcoded access keys.',
      translation: 'Armazenamos nosso remote state no Azure Blob Storage com bloqueio automático por lease e autenticação RBAC via Azure AD em vez de chaves de acesso estáticas.',
      context: 'Falando sobre segurança e integridade do estado no Azure'
    },
    deepDive: [
      'use_azuread_auth = true: Evita o uso de chaves primárias do storage (Shared Keys), permitindo auditar cada acesso via logs do Entra ID.',
      'Lock timeout: Pode ser customizado com o parâmetro -lock-timeout=20m para pipelines de longa duração.'
    ],
    commonQuestions: [
      'O que acontece se dois desenvolvedores rodarem terraform apply ao mesmo tempo?',
      'Como recuperar um state corrompido ou desbloquear um state travado (force-unlock)?'
    ]
  },
  {
    id: 'tf-modules-workspaces',
    category: 'terraform',
    categoryLabel: 'Terraform',
    subCategory: 'Estrutura & DRY',
    title: 'Módulos Reutilizáveis & Estrutura de Ambientes',
    isPrimary: true,
    summary: 'Arquitetura modular é fundamental para grandes empresas como a Capgemini garantirem padronização, conformidade e governança.',
    bullets: [
      'Modules (IaC Reusável): Encapsula recursos padronizados (ex: módulo para criar AKS com Azure CNI, Log Analytics e RBAC corporativo). Segue o princípio DRY.',
      'Estrutura canônica de módulo: main.tf (recursos), variables.tf (entradas), outputs.tf (saídas para outros módulos), versions.tf (providers).',
      'Workspaces vs Pastas Separadas: Workspaces isolam estados com o mesmo código; no entanto, em arquitetura Enterprise do Azure, prefere-se pastas separadas por ambiente (dev/qa/prod) com arquivos .tfvars dedicados para isolar blast radius e permissões de RBAC.',
      'Semantic Versioning: Versionar módulos em repositórios Git corporativos usando Git tags (ex: ?ref=v1.2.0).'
    ],
    codeSnippet: {
      language: 'hcl',
      code: `module "aks_cluster" {
  source              = "git::https://dev.azure.com/org/project/_git/tf-modules-aks?ref=v2.1.0"
  cluster_name        = "aks-fintech-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  dns_prefix          = "aks-fintech"
  node_count          = 5
  vm_size             = "Standard_D4s_v5"
  enable_auto_scaling = true
}`,
      caption: 'Consumindo módulo versionado via Git no Azure DevOps'
    },
    interviewTip: '"Em ambientes enterprise, prefiro separar pastas por ambiente e subscription (ex: environments/prod) em vez de apenas workspaces simples, pois isso permite associar Service Connections com permissões de RBAC distintas."',
    englishPhrase: {
      phrase: 'We designed modular Terraform templates tagged with semantic versioning to ensure compliance across all enterprise client accounts.',
      translation: 'Projetamos templates modulares de Terraform com versionamento semântico para garantir conformidade em todas as contas de clientes enterprise.',
      context: 'Demonstrando liderança e maturidade técnica em IaC'
    },
    commonQuestions: [
      'Quando você usa Workspaces do Terraform e quando prefere repositórios/diretórios segregados?',
      'Como você testa e valida um módulo antes de promovê-lo para produção?'
    ]
  },
  {
    id: 'tf-variables-secrets',
    category: 'terraform',
    categoryLabel: 'Terraform',
    subCategory: 'Variáveis & Segurança',
    title: 'Variáveis, Locals & Integração com Azure Key Vault',
    isPrimary: true,
    summary: 'Gerenciar segredos sem expô-los em código aberto ou logs de pipeline é um critério de corte em entrevistas de DevOps Sênior.',
    bullets: [
      'Ordem de precedência: Variáveis de ambiente (TF_VAR_nome) > terraform.tfvars > *.auto.tfvars > flags CLI (-var).',
      'Atributo sensitive = true: Mascara valores no output do terminal e nos logs do pipeline de CI/CD.',
      'Data Sources de Segredos: Usar data "azurerm_key_vault_secret" para buscar senhas em runtime, ao invés de codificá-las em arquivos .tfvars.',
      'Locals para computação interna: Valores calculados e nomes padronizados (naming conventions da Azure) devem ficar em blocos locals {}.'
    ],
    codeSnippet: {
      language: 'hcl',
      code: `variable "db_password" {
  type        = string
  sensitive   = true
  description = "Senha do banco PostgreSQL no Azure"
}

locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = "Capgemini-Cloud"
  }
}`,
      caption: 'Declaração segura de variáveis e tags padronizadas'
    },
    interviewTip: '"Lembre que marcar uma variável como `sensitive = true` não esconde o valor dentro do arquivo .tfstate! Por isso o acesso ao Storage Account onde reside o state precisa ser rigorosamente restrito."',
    englishPhrase: {
      phrase: 'Even though sensitive flags mask values in CI console logs, raw values still exist in the state file, which is why state storage encryption and RBAC are crucial.',
      translation: 'Mesmo que flags sensitive mascarem valores nos logs do CI, os valores brutos ainda existem no arquivo de estado, razão pela qual a criptografia do storage e RBAC são cruciais.',
      context: 'Demonstrando profundidade em segurança de IaC'
    },
    commonQuestions: [
      'Como você injeta senhas de banco ou certificados no Terraform sem comitar no Git?',
      'Se uma variável é sensitive, ela fica segura no tfstate?'
    ]
  },
  {
    id: 'tf-drift-import',
    category: 'terraform',
    categoryLabel: 'Terraform',
    subCategory: 'Drift & Import',
    title: 'Drift Detection, terraform import & State Migration',
    isPrimary: true,
    summary: 'Lidar com alterações manuais feitas no Portal do Azure (ClickOps) e adotar recursos legados via Terraform.',
    bullets: [
      'Drift Detection: Quando alguém altera recursos manualmente no Portal da Azure, o terraform plan detecta a divergência entre a realidade e o state.',
      'Pipeline de Drift Agendado: Rodar terraform plan agendado (cron diário) com alerta em caso de mudanças para garantir governança.',
      'terraform import: Importa recursos existentes no Azure para o state (ex: terraform import azurerm_resource_group.rg /subscriptions/.../rg-name).',
      'Bloco import {} (Terraform 1.5+): Permite gerar automaticamente o código correspondente via terraform plan -generate-config-out=generated.tf.'
    ],
    codeSnippet: {
      language: 'bash',
      code: `# Importação via CLI tradicional:
terraform import azurerm_resource_group.rg /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-legacy-prod

# Ou em Terraform moderno (1.5+):
# import {
#   to = azurerm_resource_group.rg
#   id = "/subscriptions/.../rg-legacy-prod"
# }`,
      caption: 'Importando infraestrutura legada para o Terraform'
    },
    interviewTip: '"Para combater o Configuration Drift na Capgemini, implementamos políticas do Azure Policy para bloquear alterações manuais fora do Service Principal do Terraform, além de rodar um pipeline de verificação diário."',
    englishPhrase: {
      phrase: 'To mitigate configuration drift caused by manual changes, we restrict write access in production to our pipeline Service Principal and run daily drift detection scans.',
      translation: 'Para mitigar desvios de configuração causados por alterações manuais, restringimos o acesso de escrita em produção ao Service Principal do pipeline e rodamos varreduras diárias de detecção de drift.',
      context: 'Respondendo sobre governança e combate ao ClickOps'
    },
    commonQuestions: [
      'Como você lida quando um engenheiro faz uma mudança manual no Portal do Azure e quebra o pipeline de Terraform?',
      'Qual a diferença entre terraform import e a nova funcionalidade import block do Terraform 1.5+?'
    ]
  },

  // ================= AZURE & AZURE DEVOPS =================
  {
    id: 'az-devops-pipelines',
    category: 'azure',
    categoryLabel: 'Azure DevOps',
    subCategory: 'CI / CD YAML',
    title: 'Pipelines YAML: Stages, Environments & Approvals',
    summary: 'Os pipelines modernos do Azure DevOps são versionados em código (YAML) e estruturados hierarquicamente.',
    bullets: [
      'Hierarquia YAML: Pipeline → Stages (ex: Build, Test, Deploy Dev, Deploy Prod) → Jobs (agentes de execução) → Steps (Tasks / Scripts).',
      'Environments & Gates: No Azure DevOps, "Environments" permitem configurar Approvals manuais, verificações de SLA, checagens de Change Management (ServiceNow) e alertas de saúde do Azure Monitor.',
      'Variable Groups & Azure Key Vault: Armazenam variáveis de ambiente e podem ser linkados diretamente a um Azure Key Vault com permissões automáticas.',
      'Service Connections: Conexão segura entre o Azure DevOps e a Subscription Azure via Service Principal ou Workload Identity Federation (sem senhas expostas).'
    ],
    codeSnippet: {
      language: 'yaml',
      code: `trigger:
  branches:
    include:
      - main

stages:
- stage: CI_Validate
  jobs:
  - job: LintAndPlan
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: TerraformTaskV4@4
      inputs:
        provider: 'azurerm'
        command: 'init'
        backendServiceArm: 'sc-azure-prod'
    - task: TerraformTaskV4@4
      inputs:
        provider: 'azurerm'
        command: 'plan'

- stage: CD_Production
  dependsOn: CI_Validate
  condition: succeeded()
  jobs:
  - deployment: DeployProd
    environment: 'Production-Azure'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Executando Terraform Apply com aprovação"`,
      caption: 'Estrutura recomendada de pipeline multi-stage com environment gate'
    },
    interviewTip: '"Sempre destaco o uso de Workload Identity Federation em Service Connections do Azure DevOps, pois elimina a necessidade de gerenciar client secrets que expiram a cada 90 dias."',
    englishPhrase: {
      phrase: 'We structured multi-stage YAML pipelines enforcing manual approval gates on production environments before applying infrastructure changes.',
      translation: 'Estruturamos pipelines YAML multi-estágio impondo gates de aprovação manual em ambientes de produção antes de aplicar mudanças de infraestrutura.',
      context: 'Descrevendo arquitetura de entrega contínua corporativa'
    },
    commonQuestions: [
      'Qual a diferença entre um Job tradicional e um Deployment Job no Azure DevOps?',
      'Como você lida com aprovações manuais antes de um deploy para produção em pipelines YAML?'
    ]
  },
  {
    id: 'az-core-hierarchy',
    category: 'azure',
    categoryLabel: 'Azure Core',
    subCategory: 'Arquitetura & Governança',
    title: 'Hierarquia Azure: Management Groups, Subscriptions & Redes',
    summary: 'A estrutura de governança do Azure é a base da arquitetura Enterprise Cloud Adoption Framework (CAF) da Microsoft.',
    bullets: [
      'Hierarquia: Tenant (Entra ID) → Root Management Group → Management Groups (Landing Zones / Plataforma) → Subscriptions (Prod, Non-Prod) → Resource Groups.',
      'Resource Group (RG): Ciclo de vida compartilhado. Deletar um RG destrói todos os recursos contidos nele. Recursos podem interagir entre diferentes RGs.',
      'VNet & Subnets: Redes virtuais isoladas. Subnets dedicadas para AKS (pods & nodes), Application Gateway, Private Endpoints e Database Subnet Delegation.',
      'Network Security Groups (NSGs): Firewalls de camada 4 (IP/Porta) aplicados em subnets ou NICs com regras baseadas em prioridade (100 a 4096).'
    ],
    codeSnippet: {
      language: 'text',
      code: `Tenant (Microsoft Entra ID)
  └── Root Management Group
        ├── Platform Management Group (Hub / Shared / Monitoring)
        └── Landing Zones Management Group
              ├── Corporate Subscriptions (Prod & QA)
              └── Online Subscriptions (E-commerce / Public AKS)`,
      caption: 'Estrutura Enterprise Landing Zone (Cloud Adoption Framework)'
    },
    interviewTip: '"A Capgemini atende grandes clientes bancários e de telecom. Mencionar o Cloud Adoption Framework (CAF) e arquitetura Hub-Spoke com Azure Firewall e Peering demonstra senioridade."',
    englishPhrase: {
      phrase: 'We organized resources following Microsoft Cloud Adoption Framework guidelines, leveraging a Hub-and-Spoke network topology with central peering and firewall inspection.',
      translation: 'Organizamos recursos seguindo as diretrizes do Cloud Adoption Framework da Microsoft, alavancando uma topologia Hub-and-Spoke com peering central e inspeção por firewall.',
      context: 'Falando sobre design de redes e governança no Azure'
    },
    commonQuestions: [
      'O que é uma arquitetura Hub-and-Spoke no Azure e quais seus benefícios?',
      'Como você organiza subnets para um cluster AKS em ambiente corporativo?'
    ]
  },
  {
    id: 'az-security-identity',
    category: 'azure',
    categoryLabel: 'Azure Security',
    subCategory: 'Identidade & RBAC',
    title: 'Microsoft Entra ID, Managed Identities & RBAC',
    summary: 'Eliminar senhas em código e controlar permissões com privilégio mínimo (Least Privilege).',
    bullets: [
      'Service Principal (SP): Conta de serviço no Entra ID usada por pipelines para autenticar na API do Azure. Possui Client ID, Tenant ID e Secret/Certificado.',
      'Managed Identity (MSI): Identidade gerenciada pelo Azure para recursos de computação (VMs, AKS, Functions). Elimina armazenamento de credenciais.',
      'System-Assigned vs User-Assigned: System-Assigned é atrelada ao ciclo de vida do recurso específico (deletou o recurso, deletou a identidade); User-Assigned é um recurso independente que pode ser compartilhado.',
      'Azure RBAC vs Azure Policy: RBAC define QUEM pode fazer o que (ex: Contributor, Reader, AKS Cluster Admin). Azure Policy define O QUE pode ser criado (ex: proibir VMs sem tag ou fora da região Brazil South).'
    ],
    interviewTip: '"Para conectar o pipeline no Azure sem expor senhas que expiram, usamos OIDC / Federated Credentials. Assim, o Azure confia no token emitido pelo Azure DevOps ou GitHub Actions diretamente."',
    englishPhrase: {
      phrase: 'We migrated our workloads from static Service Principal secrets to User-Assigned Managed Identities, enforcing least-privilege RBAC roles.',
      translation: 'Migramos nossas cargas de trabalho de segredos estáticos de Service Principal para Managed Identities atribuídas pelo usuário, aplicando funções RBAC de menor privilégio.',
      context: 'Demonstrando excelência em segurança de nuvem'
    },
    commonQuestions: [
      'Qual a diferença prática entre Azure Policy e Azure RBAC?',
      'Por que Managed Identity é mais segura do que uma Service Principal tradicional?'
    ]
  },

  // ================= KUBERNETES & AKS =================
  {
    id: 'k8s-workloads',
    category: 'k8s',
    categoryLabel: 'Kubernetes',
    subCategory: 'AKS & Workloads',
    title: 'Workloads no K8s: Pods, Deployments & Rollouts',
    summary: 'Como as aplicações conteinerizadas são orquestradas e atualizadas sem downtime no Azure Kubernetes Service (AKS).',
    bullets: [
      'Pod: Menor unidade de execução no K8s. Pode ter um ou mais contêineres compartilhando rede (localhost) e volumes de armazenamento.',
      'Deployment: Controlador que gerencia réplicas e atualizações declarativas de Pods usando ReplicaSets.',
      'Estratégias de Deploy: RollingUpdate (padrão, substitui pods gradualmente com maxUnavailable e maxSurge) vs Recreate (downtime temporário).',
      'ConfigMaps & Secrets: Separação de configuração e dados sensíveis dos binários dos contêineres.',
      'Resource Requests & Limits: Requests garantem alocação na criação; Limits impedem que um pod consuma todos os recursos do nó (causando OOM ou Node starvation).'
    ],
    codeSnippet: {
      language: 'yaml',
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-api
  namespace: prod
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: api
        image: acrcapgemini.azurecr.io/payment:v1.4.2
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "500m"
            memory: "1Gi"`,
      caption: 'Deployment resiliente com zero downtime no AKS'
    },
    interviewTip: '"Sempre defina tanto requests quanto limits para CPU e Memória, senão o Horizontal Pod Autoscaler (HPA) não conseguirá calcular porcentagens de uso para escalar."',
    englishPhrase: {
      phrase: 'We fine-tuned CPU and memory resource requests and limits to enable predictable Horizontal Pod Autoscaling under heavy traffic spikes.',
      translation: 'Ajustamos com precisão os requests e limits de CPU e memória para habilitar o Horizontal Pod Autoscaler de forma previsível sob picos intensos de tráfego.',
      context: 'Discutindo resiliência e auto-scaling em Kubernetes'
    },
    commonQuestions: [
      'O que acontece se um contêiner ultrapassar o Limit de CPU? E o de Memória?',
      'Como funciona o algoritmo de RollingUpdate com maxSurge e maxUnavailable?'
    ]
  },
  {
    id: 'k8s-networking-ingress',
    category: 'k8s',
    categoryLabel: 'Kubernetes',
    subCategory: 'Redes & Ingress',
    title: 'Rede no AKS: Services, Ingress & Azure CNI',
    summary: 'Roteamento de tráfego interno e externo em clusters de alta disponibilidade.',
    bullets: [
      'ClusterIP: IP virtual interno para comunicação entre microsserviços dentro do cluster.',
      'LoadBalancer: Provisiona um Azure Public Load Balancer e associa um IP público diretamente ao serviço.',
      'Ingress Controller: Ponto único de entrada HTTP/S de Camada 7 com suporte a SSL termination, path-based routing e rewrite (ex: NGINX Ingress ou AGIC - Application Gateway Ingress Controller).',
      'Azure CNI vs Kubenet: Kubenet usa NAT e precisa de menos IPs na VNet; Azure CNI atribui um IP real da VNet para CADA pod, oferecendo melhor performance e conectividade direta com outros recursos da rede privada.'
    ],
    interviewTip: '"Para clientes que exigem WAF (Web Application Firewall) na camada 7, conectamos o AKS com o Azure Application Gateway via AGIC ou Azure Front Door com Private Link."',
    englishPhrase: {
      phrase: 'We deployed an NGINX Ingress Controller backed by an internal Azure Load Balancer to keep all production microservices within the private corporate network.',
      translation: 'Implantamos um Ingress Controller NGINX suportado por um Load Balancer interno do Azure para manter todos os microsserviços de produção dentro da rede corporativa privada.',
      context: 'Falando sobre segurança de borda e exposição de APIs no AKS'
    },
    commonQuestions: [
      'Qual a diferença entre Kubenet e Azure CNI no AKS?',
      'Por que usar um Ingress Controller em vez de criar múltiplos Services do tipo LoadBalancer?'
    ]
  },
  {
    id: 'k8s-troubleshooting',
    category: 'k8s',
    categoryLabel: 'Kubernetes',
    subCategory: 'Troubleshooting & Logs',
    title: 'Resolução de Problemas: CrashLoopBackOff & Debugging',
    summary: 'Como diagnosticar e resolver os erros mais comuns de Kubernetes rapidamente durante um plantão ou incidente.',
    bullets: [
      'CrashLoopBackOff: O contêiner inicia, falha e encerra repetidamente. Causas comuns: erro de código na inicialização, falta de variável de ambiente, porta já em uso, ou falha de conexão com o banco.',
      'Comandos essenciais de triagem: kubectl describe pod [nome] (mostra os Events no final da saída) e kubectl logs [nome] --previous (mostra logs do pod que crashou).',
      'OOMKilled (Exit Code 137): O processo do contêiner consumiu mais memória do que o Limit configurado e o kernel Linux o encerrou.',
      'ImagePullBackOff / ErrImagePull: Falha ao baixar a imagem. Causas: tag incorreta, imagem inexistente ou falta de permissão RBAC (AcrPull) no ACR.',
      'Probes de integridade: Liveness Probe (reinicia o pod se falhar) vs Readiness Probe (remove o pod do balanceamento de tráfego até que esteja pronto) vs Startup Probe (para apps lentas a subir).'
    ],
    codeSnippet: {
      language: 'bash',
      code: `# Passo 1: Verificar eventos e motivo da falha
kubectl describe pod payment-api-7b89f-2z9k1 -n prod

# Passo 2: Ler os logs do contêiner que acabou de morrer
kubectl logs payment-api-7b89f-2z9k1 -n prod --previous --tail=100

# Passo 3: Executar terminal interativo dentro do contêiner
kubectl exec -it payment-api-7b89f-2z9k1 -n prod -- sh`,
      caption: 'Fluxo metódico de troubleshooting de pods no AKS'
    },
    interviewTip: '"Se perguntarem como investigo um CrashLoopBackOff, minha resposta imediata é: `kubectl describe pod` para inspecionar os Events e Exit Code, seguido de `kubectl logs --previous` para ler a stack trace antes do crash."',
    englishPhrase: {
      phrase: 'Whenever a pod gets stuck in CrashLoopBackOff, my first diagnostic step is inspecting the lifecycle events using describe pod, followed by checking previous logs.',
      translation: 'Sempre que um pod fica preso em CrashLoopBackOff, meu primeiro passo de diagnóstico é inspecionar os eventos de ciclo de vida usando describe pod, seguido da checagem dos logs anteriores.',
      context: 'Demonstrando raciocínio analítico para resolução de incidentes'
    },
    commonQuestions: [
      'Qual a diferença entre Liveness Probe e Readiness Probe?',
      'O que significa o Exit Code 137 em um contêiner Docker/K8s?'
    ]
  },

  // ================= GITHUB ACTIONS =================
  {
    id: 'gha-workflows',
    category: 'github',
    categoryLabel: 'GitHub Actions',
    subCategory: 'Automação & CI/CD',
    title: 'Estrutura de Workflows, Actions & OIDC com Azure',
    summary: 'A automação nativa do GitHub integrada de forma moderna e segura à nuvem da Microsoft.',
    bullets: [
      'Estrutura YAML: Localizados em .github/workflows/*.yml. Triggers definidos com on: [push, pull_request, workflow_dispatch, schedule].',
      'Matrizes & Reusabilidade: Estratégias de matrix para testar múltiplas versões simultâneas e workflow_call para criar templates corporativos reutilizáveis.',
      'Autenticação OIDC com Azure: Utiliza OpenID Connect (action azure/login@v1 com federated credentials no Entra ID), eliminando a necessidade de armazenar credenciais estáticas (AZURE_CREDENTIALS secret).',
      'Environments & Proteções: Configuração de revisores manuais obrigatórios e branch protection rules antes do deploy em branches sensíveis.'
    ],
    codeSnippet: {
      language: 'yaml',
      code: `name: Deploy Infra to Azure
on:
  push:
    branches: [ main ]

permissions:
  id-token: write # Obrigatório para OIDC
  contents: read

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Azure Login via OIDC
      uses: azure/login@v2
      with:
        client-id: \${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: \${{ secrets.AZURE_TENANT_ID }}
        subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3`,
      caption: 'GitHub Actions autenticando no Azure via OIDC sem senhas'
    },
    interviewTip: '"Destaco o uso da permissão `id-token: write` para OIDC. Isso mostra que você conhece as práticas de segurança mais recentes recomendadas pela Microsoft e GitHub."',
    englishPhrase: {
      phrase: 'We configured passwordless Azure authentication in GitHub Actions using OpenID Connect and workload identity federation, significantly reducing credential leakage risks.',
      translation: 'Configuramos autenticação sem senha no Azure com GitHub Actions usando OpenID Connect e federação de identidade de carga de trabalho, reduzindo significativamente riscos de vazamento de credenciais.',
      context: 'Explicando governança em esteiras modernas do GitHub'
    },
    commonQuestions: [
      'Como funciona a autenticação OIDC entre GitHub Actions e o Azure?',
      'Como você cria um workflow reutilizável para compartilhar entre múltiplos times?'
    ]
  },
  {
    id: 'gha-runners-enterprise',
    category: 'github',
    categoryLabel: 'GitHub Actions',
    subCategory: 'Infraestrutura de CI',
    title: 'Runners Corporativos: GitHub-Hosted vs Self-Hosted',
    summary: 'Estratégias de agentes de execução em redes privadas e ambientes corporativos restritos.',
    bullets: [
      'GitHub-Hosted Runners: Máquinas virtuais gerenciadas pelo GitHub. São descartáveis e prontas para uso, mas possuem IPs dinâmicos na internet pública.',
      'Self-Hosted Runners em VMs ou AKS: Executados dentro da sua própria VNet no Azure (usando Virtual Machine Scale Sets ou Actions Runner Controller no Kubernetes).',
      'Por que usar Self-Hosted?: Acessar bancos de dados privados, clusters AKS internos e recursos protegidos por Private Endpoints sem expô-los à internet.',
      'Segurança em Runners: Nunca permitir Self-Hosted Runners em repositórios públicos (risco de execução de código arbitrário via Pull Requests de terceiros).'
    ],
    interviewTip: '"Para clientes com compliance bancário na Capgemini, utilizamos o ARC (Actions Runner Controller) para escalar runners efêmeros automaticamente dentro do AKS."',
    englishPhrase: {
      phrase: 'For enterprise customers requiring private network access, we deploy self-hosted runners within the Azure VNet using ephemeral containers to guarantee isolated builds.',
      translation: 'Para clientes enterprise que exigem acesso à rede privada, implantamos runners auto-hospedados dentro da VNet do Azure usando contêineres efêmeros para garantir builds isolados.',
      context: 'Discutindo arquitetura de agentes de CI/CD'
    },
    commonQuestions: [
      'Quando você recomenda Self-Hosted Runners em vez de GitHub-Hosted Runners?',
      'Quais são os principais riscos de segurança de Self-Hosted Runners e como mitigá-los?'
    ]
  },

  // ================= CAPGEMINI & SOFT SKILLS =================
  {
    id: 'cap-culture-values',
    category: 'soft',
    categoryLabel: 'Capgemini Fit',
    subCategory: 'Valores & Cultura',
    title: 'Sobre a Capgemini: 7 Valores Fundamentais & Perfil Buscado',
    summary: 'A Capgemini é líder global em consultoria, transformação digital e serviços de tecnologia.',
    bullets: [
      'Presença Global: Mais de 420 mil colaboradores em mais de 50 países. Projetos multiculturais e bilíngues.',
      'Os 7 Valores Fundamentais: Honestidade, Audácia, Confiança, Liberdade, Solidariedade, Simplicidade e Diversão (Fun). Conectar suas respostas a esses valores!',
      'Parceria Forte com Microsoft: A Capgemini é Microsoft Azure Partner do ano em múltiplos segmentos. Ter ou buscar certificações (AZ-900, AZ-104, AZ-400, HashiCorp Terraform Associate) é altamente valorizado.',
      'Postura de Consultoria: Capacidade de traduzir termos técnicos complexos para clientes de negócio, propor soluções escaláveis e trabalhar de forma colaborativa.'
    ],
    interviewTip: '"Diga com convicção: `Tenho muito interesse no plano de capacitação da Capgemini e já estou me preparando para as certificações AZ-104 / AZ-400 e HashiCorp Terraform Associate`."',
    englishPhrase: {
      phrase: 'I am excited about joining Capgemini because of its global collaborative environment and strong commitment to continuous learning and cloud certifications.',
      translation: 'Estou entusiasmado em fazer parte da Capgemini por conta de seu ambiente colaborativo global e forte compromisso com aprendizado contínuo e certificações em nuvem.',
      context: 'Expressando motivação para a vaga'
    },
    commonQuestions: [
      'Por que você quer trabalhar na Capgemini?',
      'Como você lida com projetos que exigem colaboração com times de fusos horários ou países diferentes?'
    ]
  },
  {
    id: 'cap-star-method',
    category: 'soft',
    categoryLabel: 'Soft Skills',
    subCategory: 'Método S.T.A.R.',
    title: 'Como Responder Perguntas Comportamentais (Método S.T.A.R.)',
    summary: 'A técnica mais respeitada para demonstrar experiência prática e impacto quantitativo em entrevistas técnicas.',
    bullets: [
      'S - Situation (Situação): Contextualize o problema em 1 ou 2 frases (ex: "No meu último projeto, o provisionamento levava 4 dias e era feito manualmente no portal").',
      'T - Task (Tarefa): Explique a sua responsabilidade específica (ex: "Minha tarefa foi desenhar a esteira de IaC com Terraform e Azure DevOps com foco em automação total").',
      'A - Action (Ação): Descreva o que VOCÊ fez com detalhes técnicos (ex: "Escrevi módulos de Terraform para AKS e Storage, configurei pipelines com gates de aprovação e criei documentação").',
      'R - Result (Resultado): Finalize SEMPRE com números e métricas reais (ex: "Reduzimos o tempo de provisionamento de 4 dias para 15 minutos e eliminamos 100% dos erros manuais").'
    ],
    interviewTip: '"Use sempre o pronome `Eu` na Ação (`Eu desenvolvi...`, `Eu investiguei...`), mesmo que tenha sido trabalho em equipe. Os entrevistadores querem saber exatamente qual foi a SUA contribuição."',
    englishPhrase: {
      phrase: 'As a result of introducing modular Terraform templates and automated pipelines, we cut deployment cycle time by seventy percent and eliminated manual configuration errors.',
      translation: 'Como resultado da introdução de templates modulares de Terraform e pipelines automatizados, reduzimos o tempo do ciclo de deploy em setenta por cento e eliminamos erros manuais de configuração.',
      context: 'Concluindo uma resposta com métricas de impacto no formato STAR'
    },
    commonQuestions: [
      'Conte sobre uma vez em que um deploy em produção falhou. O que você fez?',
      'Descreva um projeto desafiador de automação de infraestrutura que você liderou.'
    ]
  },
  {
    id: 'cap-english-prep',
    category: 'soft',
    categoryLabel: 'Entrevista em Inglês',
    subCategory: 'Vocabulário & Fluência',
    title: 'Inglês Técnico para Entrevista: Vocabulário e Frases Salva-Vidas',
    summary: 'Em entrevistas com clientes globais da Capgemini, demonstrar clareza, calma e vocabulário técnico preciso é decisivo.',
    bullets: [
      'Infrastructure as Code (IaC): "We treat infrastructure identical to application source code with linting, testing, and automated deployment."',
      'Troubleshooting sob pressão: "When incidents occur, my priority is stabilizing production via rollback or traffic rerouting, followed by blameless root-cause analysis."',
      'Conectivos profissionais: "Furthermore...", "From an architectural standpoint...", "To address this bottleneck...", "In terms of scalability..."',
      'Pedir esclarecimento educadamente: "Could you please elaborate on the specific requirement?" ou "Just to make sure I understand correctly, are you asking about..."'
    ],
    interviewTip: '"Se não entender uma pergunta em inglês, nunca responda no escuro ou fique em silêncio. Diga: `Could you please rephrase that question? I want to make sure I focus on the right architectural aspect.`"',
    englishPhrase: {
      phrase: 'From an architectural standpoint, our main priority was achieving zero-downtime deployments while ensuring strict security compliance.',
      translation: 'Do ponto de vista arquitetural, nossa prioridade principal era alcançar deploys com zero downtime garantindo estrita conformidade de segurança.',
      context: 'Frase de impacto para introduzir decisões arquiteturais'
    },
    commonQuestions: [
      'Can you walk me through your typical daily routine as a DevOps Engineer?',
      'How do you stay up-to-date with emerging cloud and container technologies?'
    ]
  }
];

export const CLI_COMMANDS: CliCommand[] = [
  // Terraform
  { tool: 'Terraform', command: 'terraform init -upgrade', description: 'Inicializa e atualiza providers para a versão permitida mais recente', useCase: 'Atualizar azurerm ou configurar novo backend remoto' },
  { tool: 'Terraform', command: 'terraform fmt -recursive', description: 'Formata recursivamente todos os arquivos .tf no padrão oficial', useCase: 'Antes de fazer commit ou abrir Pull Request' },
  { tool: 'Terraform', command: 'terraform validate', description: 'Valida a consistência de sintaxe e tipos do código HCL', useCase: 'Etapa rápida de validação estática no CI' },
  { tool: 'Terraform', command: 'terraform plan -out=tfplan.binary', description: 'Gera plano de execução binário determinístico', useCase: 'Garantir que o apply executará exatamente o planejado' },
  { tool: 'Terraform', command: 'terraform apply tfplan.binary', description: 'Aplica o plano previamente gerado sem prompt interativo', useCase: 'No estágio de CD pós-aprovação' },
  { tool: 'Terraform', command: 'terraform state list', description: 'Lista todos os recursos gerenciados no state atual', useCase: 'Mapear recursos sem abrir o arquivo JSON' },
  { tool: 'Terraform', command: 'terraform force-unlock <LOCK-ID>', description: 'Remove trava manual de lock no state caso o pipeline caia', useCase: 'Recuperação de deadlock no Azure Storage Account' },

  // Azure CLI
  { tool: 'Azure CLI', command: 'az login', description: 'Autentica no Azure interativamente via navegador', useCase: 'Desenvolvimento local e troubleshooting' },
  { tool: 'Azure CLI', command: 'az account show --output table', description: 'Exibe a Subscription e Tenant ativos no momento', useCase: 'Evitar aplicar mudanças na subscription errada' },
  { tool: 'Azure CLI', command: 'az aks get-credentials --resource-group <RG> --name <AKS>', description: 'Baixa o kubeconfig do AKS para o terminal local', useCase: 'Permitir que o kubectl acesse o cluster AKS' },
  { tool: 'Azure CLI', command: 'az acr login --name <ACR_NAME>', description: 'Autentica o daemon Docker no Azure Container Registry', useCase: 'Fazer push ou pull manual de imagens' },
  { tool: 'Azure CLI', command: 'az keyvault secret show --vault-name <KV> --name <SECRET>', description: 'Consulta valor de segredo no Key Vault', useCase: 'Validação de permissão de acesso a segredos' },

  // kubectl
  { tool: 'kubectl', command: 'kubectl get pods -A -o wide', description: 'Lista todos os pods de todos os namespaces com IP e Nó', useCase: 'Visão geral da saúde do cluster' },
  { tool: 'kubectl', command: 'kubectl describe pod <POD_NAME> -n <NAMESPACE>', description: 'Mostra detalhes completos e eventos recentes do Pod', useCase: 'Diagnosticar CrashLoopBackOff ou ImagePullBackOff' },
  { tool: 'kubectl', command: 'kubectl logs <POD_NAME> -n <NAMESPACE> --previous', description: 'Exibe logs do contêiner que acabou de falhar', useCase: 'Investigar causas de morte súbita de aplicação' },
  { tool: 'kubectl', command: 'kubectl top pods -n <NAMESPACE> --sort-by=cpu', description: 'Mostra o consumo real de CPU e memória dos pods', useCase: 'Ajuste de requests e limits de recursos' },
  { tool: 'kubectl', command: 'kubectl rollout restart deployment/<NAME> -n <NAMESPACE>', description: 'Força reinício gradual de todos os pods do deployment', useCase: 'Recarregar configs ou aplicar nova imagem sem downtime' },
  { tool: 'kubectl', command: 'kubectl rollout status deployment/<NAME> -n <NAMESPACE>', description: 'Acompanha o progresso da atualização do deployment', useCase: 'Script de validação no pipeline de entrega contínua' },

  // Helm
  { tool: 'Helm', command: 'helm repo add <REPO_NAME> <URL> && helm repo update', description: 'Adiciona e atualiza repositório de charts Helm', useCase: 'Instalação de ingress-nginx, cert-manager, etc.' },
  { tool: 'Helm', command: 'helm upgrade --install <RELEASE> <CHART> -f values.yaml -n <NS>', description: 'Instala ou atualiza uma release Helm de forma idempotente', useCase: 'Comando padrão em pipelines de CD' },
  { tool: 'Helm', command: 'helm history <RELEASE> -n <NAMESPACE>', description: 'Exibe o histórico de revisões de uma release', useCase: 'Auditoria de versão implantada' },
  { tool: 'Helm', command: 'helm rollback <RELEASE> <REVISION> -n <NAMESPACE>', description: 'Faz rollback instantâneo para uma revisão anterior', useCase: 'Mitigação imediata de incidentes em produção' },

  // Git
  { tool: 'Git', command: 'git checkout -b feature/terraform-aks-upgrade', description: 'Cria e muda para uma branch de feature', useCase: 'Início de trabalho isolado seguindo GitFlow' },
  { tool: 'Git', command: 'git commit -m "feat(tf): add Azure CNI and log analytics to AKS"', description: 'Commit semântico padronizado', useCase: 'Rastreabilidade de mudanças de infraestrutura' }
];

export const STAR_SCENARIOS: StarScenario[] = [
  {
    id: 'star-migration',
    title: 'Migração de Infraestrutura Legada para Azure com Terraform',
    category: 'Terraform & Azure',
    situation: 'The client was hosting mission-critical applications on legacy on-premises virtual machines with slow manual deployments taking over 3 days.',
    task: 'My goal was to design an automated Infrastructure as Code architecture on Azure, migrating core workloads to Azure Kubernetes Service with full automated provisioning.',
    action: 'I developed reusable, version-controlled Terraform modules for AKS, Azure Virtual Network, and Key Vault. I established an Azure DevOps multi-stage pipeline utilizing Workload Identity Federation, ensuring state files were secured in Azure Blob Storage with automated lease locking.',
    result: 'We successfully cut environment provisioning time from 3 days to under 15 minutes, reduced infrastructure cloud costs by 28% through autoscaling, and achieved 99.95% uptime.',
    keyMetrics: 'From 3 days to 15 mins (98% reduction) · 28% cost savings · 99.95% SLA',
    audioPhraseEn: 'We cut environment provisioning time from 3 days to under 15 minutes, reduced infrastructure cloud costs by 28% through autoscaling, and achieved 99.95% uptime.'
  },
  {
    id: 'star-pipeline-incident',
    title: 'Falha Crítica em Pipeline de Produção & Rollback Rápido',
    category: 'CI/CD & Troubleshooting',
    situation: 'During a high-traffic release window, a critical payment microservice failed immediately after deployment, generating 502 Bad Gateway errors for end users.',
    task: 'I had to quickly identify the root cause, restore service availability within our strict 15-minute recovery time objective (RTO), and prevent recurrence.',
    action: 'I initiated an immediate Helm rollback to the previous stable release, restoring 100% traffic in less than 3 minutes. Then, using kubectl describe and logs, I discovered a missing environment variable in the new deployment config. I fixed the pipeline template and added automated smoke tests and readiness probe checks.',
    result: 'Total service downtime was limited to only 3 minutes, within the RTO target, and the automated post-deployment health check prevented 100% of future similar configuration mismatches.',
    keyMetrics: '3 min recovery time (Target < 15 min) · 0 downtime rollbacks implemented',
    audioPhraseEn: 'Total service downtime was limited to only 3 minutes, within our recovery objective, and automated health checks eliminated configuration mismatches.'
  },
  {
    id: 'star-aks-security',
    title: 'Hardening de Segurança e Conformidade no AKS',
    category: 'Kubernetes & Security',
    situation: 'An internal security audit revealed that container pods were running with root privileges and developers were hardcoding database secrets into config files.',
    task: 'I was tasked with implementing zero-trust security policies and automating secret injection without disrupting ongoing agile sprint deliveries.',
    action: 'I integrated Azure Key Vault with AKS using the Secrets Store CSI Driver and Azure Workload Identity, eliminating static credentials. I also enforced Azure Policies on the cluster to block non-root containers and ensure all images come exclusively from our private Azure Container Registry with vulnerability scanning.',
    result: 'We achieved 100% compliance on the next security audit, prevented unauthorized container images, and completely eradicated static secrets across all 40+ microservices.',
    keyMetrics: '100% audit compliance · 0 static secrets across 40+ microservices',
    audioPhraseEn: 'We achieved 100% compliance on the security audit and completely eradicated static secrets across all 40 microservices using Azure Key Vault CSI Driver.'
  }
];

export const CAPGEMINI_TIPS = [
  {
    title: 'Postura Consultiva',
    text: 'A Capgemini busca engenheiros que não apenas rodam comandos, mas que entendem o impacto de negócio das decisões de nuvem (custo, resiliência, tempo de resposta).'
  },
  {
    title: 'Certificações Microsoft & HashiCorp',
    text: 'Mencione seu interesse e progresso em certificações como AZ-104 (Azure Administrator), AZ-400 (DevOps Engineer Expert) e Terraform Associate.'
  },
  {
    title: 'Comunicação Global e Inglês',
    text: 'Fale de forma clara e estruturada. Se precisar de alguns segundos para pensar, use frases como "That is a great question, let me structure my thought around the architecture".'
  },
  {
    title: 'Trabalho em Equipe & Postura Blameless',
    text: 'Quando falar de incidentes passados, nunca culpe desenvolvedores ou colegas. Foque em processos, automação de testes e cultura de melhoria contínua (Blameless Post-Mortem).'
  }
];
