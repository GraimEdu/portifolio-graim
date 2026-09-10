/**
 * Fonte da verdade do conteúdo do site.
 *
 * Transcrito de `Curriculo_Eduardo_Graim.docx` (09/09/2026). Nada aqui é
 * inventado: se um dado não está no currículo, ele não está neste arquivo.
 * Atualizar o currículo = atualizar só este arquivo.
 */

export type Identity = {
  fullName: string;
  shortName: string;
  initials: string;
  role: string;
  roleShort: string;
  location: string;
  city: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
  objective: string;
  summary: string[];
};

export const identity: Identity = {
  fullName: "Eduardo Melo Graim de Matos",
  shortName: "Eduardo Graim",
  initials: "EG",
  role: "Suporte Técnico N2 · Infraestrutura & Segurança da Informação",
  roleShort: "Suporte N2 · Infra & Segurança",
  location: "Jurunas — Belém/PA",
  city: "Belém, Pará",
  email: "egraim18@gmail.com",
  linkedin: "linkedin.com/in/eduardo-graim",
  linkedinUrl: "https://www.linkedin.com/in/eduardo-graim",
  github: "github.com/GraimEdu",
  githubUrl: "https://github.com/GraimEdu",
  objective:
    "Atuar em Suporte Técnico, Infraestrutura e Segurança da Informação.",
  summary: [
    "Sou estagiário de TI no Banpará, onde atuo em Suporte Técnico N2 e Helpdesk dentro de um ambiente bancário — o tipo de lugar onde uma estação fora do ar tem custo imediato.",
    "Meu dia envolve Active Directory e GPO, Microsoft 365, certificados digitais ICP-Brasil e ferramentas de segurança de endpoint: CyberArk EPM, Safetica DLP e Microsoft Defender ATP.",
    "O que eu mais gosto é a parte de diagnóstico: entender por que quebrou antes de consertar, e depois registrar isso em laudo técnico para que a próxima pessoa não precise redescobrir.",
  ],
};

/* ═══════════════════════════════════════════════════════════════
   Crachá — credencial pessoal de portfólio.
   Deliberadamente SEM marca/logo do Banpará: é a identidade do
   Eduardo, não uma réplica de credencial corporativa.
   ═══════════════════════════════════════════════════════════════ */
export const badge = {
  mark: identity.initials,
  holder: identity.shortName,
  role: "SUPORTE N2",
  specialty: "INFRA & SEGURANÇA",
  location: "BELÉM · PA",
  serial: "EG-2026",
  /** Texto repetido ao longo do cordão */
  strapText: "EDUARDO GRAIM · SUPORTE N2 · INFRA & SEGURANÇA ·",
  /** Retrato usado na frente do crachá. null => placeholder tipográfico.
      PNG com transparência: o fundo foi removido (birefnet-portrait) e quem
      desenha o fundo da janela é o próprio crachá, em badgeFace.ts. */
  photo: "/images/eduardo-cracha.png" as string | null,
};

/**
 * Fotos do trabalho.
 *
 * REGRA: nada aqui pode conter dado de cliente, tela de chamado legível,
 * login de colega ou número de série. Fotos com tela ligada passam por
 * desfoque antes de virar asset — ver o script em scratchpad/assets.py.
 */
export type Photo = {
  src: string;
  alt: string;
  caption: string;
  /** Proporção usada no grid. */
  ratio: "wide" | "tall";
};

export const photos: Record<string, Photo> = {
  retrato: {
    src: "/images/eduardo-banpara.jpg",
    alt: "Eduardo Graim com o crachá de estagiário do Banpará",
    caption: "No banco, com o crachá.",
    ratio: "tall",
  },
  feira: {
    src: "/images/banpara-feira.jpg",
    alt: "Estande do Banpará na 29ª Feira Pan-Amazônica do Livro e das Multivozes",
    caption:
      "Suporte de TI ao estande do Banpará na 29ª Feira Pan-Amazônica do Livro e das Multivozes.",
    ratio: "wide",
  },
  feiraPiso: {
    src: "/images/feira-piso.jpg",
    alt: "Vista do piso da feira, com os estandes e o público",
    caption: "O piso da feira — a escala do evento que precisava ficar de pé.",
    ratio: "wide",
  },
  feiraApoio: {
    src: "/images/feira-apoio.jpg",
    alt: "Sala de apoio do evento, com bancadas de notebooks",
    caption: "A sala de apoio: bancadas de notebooks atrás do estande.",
    ratio: "wide",
  },
  salaTrabalho: {
    src: "/images/posto-evento.jpg",
    alt: "Sala de trabalho de Eduardo, com dois monitores e telefone no posto de atendimento",
    caption:
      "A sala onde eu trabalho. A tela está desfocada: era um chamado real.",
    ratio: "wide",
  },
  postoBanpara: {
    src: "/images/posto-banpara.jpg",
    alt: "Estação de trabalho na sede do Banpará",
    caption: "Estação de trabalho na sede — de onde saem os chamados N2.",
    ratio: "wide",
  },
  placa: {
    src: "/images/hardware-placa.jpg",
    alt: "Placa-mãe de um Dell OptiPlex micro aberta para manutenção",
    caption: "OptiPlex micro aberto: manutenção não é só software.",
    ratio: "tall",
  },
  wifi: {
    src: "/images/hardware-wifi.jpg",
    alt: "Detalhe da placa Wi-Fi Intel AX200 na placa-mãe",
    caption: "Detalhe da Intel AX200 — o tipo de peça que vira laudo depois.",
    ratio: "tall",
  },
};

/* ═══════════════════════════════════════════════════════════════
   Experiência
   ═══════════════════════════════════════════════════════════════ */
export type Job = {
  company: string;
  companyShort: string;
  role: string;
  team: string;
  period: string;
  current: boolean;
  fronts: { label: string; detail: string; tags: string[] }[];
};

export const experience: Job[] = [
  {
    company: "Banpará — Banco do Estado do Pará S.A.",
    companyShort: "Banpará",
    role: "Estagiário de TI — Suporte N2 e Helpdesk",
    team: "GESER / SUPRO",
    period: "junho de 2026 — atual",
    current: true,
    fronts: [
      {
        label: "Helpdesk e Suporte N2",
        detail:
          "Atendimento a usuários em ambiente bancário, com registro e tratativa de chamados.",
        tags: ["Helpdesk", "N2", "Chamados"],
      },
      {
        label: "Identidade e diretório",
        detail:
          "Administração de Active Directory e GPO; suporte a Microsoft 365 e autenticação M365/AAD (WAM).",
        tags: ["Active Directory", "GPO", "Microsoft 365", "AAD / WAM"],
      },
      {
        label: "Certificação digital",
        detail:
          "Gestão de certificados ICP-Brasil e tokens G+D StarSign, SafeNet eToken e Feitian ePass; assinatura digital em PJe / PJeOffice.",
        tags: ["ICP-Brasil", "Tokens", "PJe"],
      },
      {
        label: "Segurança de endpoint",
        detail:
          "Operação de CyberArk EPM, Safetica DLP e Microsoft Defender ATP; gestão de estações via LANDESK.",
        tags: ["CyberArk EPM", "Safetica DLP", "Defender ATP", "LANDESK"],
      },
      {
        label: "Diagnóstico de incidentes",
        detail:
          "Investigação e resolução de falhas de TPM, perfis de usuário, pacotes UWP/AppX, DCOM, Windows Search e corrupção de arquivos em RDS/Citrix.",
        tags: ["Troubleshooting", "Windows", "RDS / Citrix"],
      },
      {
        label: "Atualizações e implantação",
        detail:
          "Configuração de certificados WSUS / Updates Publisher, implantação do Teams 2 (MSIX) e suporte ao Oracle Smart View (Hyperion).",
        tags: ["WSUS", "MSIX", "Oracle Smart View"],
      },
      {
        label: "Documentação técnica",
        detail:
          "Elaboração de laudos técnicos em Word (padrão ABNT) para chamados de manutenção e justificativa de substituição de hardware.",
        tags: ["ABNT", "Laudos técnicos"],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   Incidentes — os casos nomeados no currículo.

   AUTORIA: cada card traz (a) o problema como está no currículo e
   (b) uma descrição técnica neutra da CLASSE do problema. O relato
   do que o Eduardo fez em cada caso é dele para escrever — o campo
   `note` existe para isso e está vazio de propósito. Não invente.
   ═══════════════════════════════════════════════════════════════ */
export type Incident = {
  id: string;
  code: string | null;
  title: string;
  area: string;
  /** Descrição neutra da classe do problema (conhecimento técnico geral). */
  nature: string;
  /** Relato pessoal do Eduardo. Vazio até ele preencher. */
  note: string;
};

export const incidents: Incident[] = [
  {
    id: "tpm",
    code: "NTE_BAD_KEYSET",
    title: "TPM falhando após troca de SSD",
    area: "Endpoint · Criptografia",
    nature:
      "Erro de keyset do TPM: a máquina deixa de conseguir usar chaves protegidas por hardware, o que derruba login, certificados e recursos que dependem do módulo.",
    note: "",
  },
  {
    id: "wam",
    code: null,
    title: "Autenticação M365 / AAD (WAM)",
    area: "Identidade · Microsoft 365",
    nature:
      "Falhas no Web Account Manager, o componente do Windows que guarda e renova os tokens de conta corporativa — quando ele trava, o Office e o M365 param de autenticar.",
    note: "",
  },
  {
    id: "perfil",
    code: null,
    title: "Perfis temporários de usuário",
    area: "Windows · Perfil",
    nature:
      "O Windows não consegue carregar o perfil do usuário e monta um perfil temporário no lugar: a sessão abre, mas documentos, configurações e mapeamentos desaparecem.",
    note: "",
  },
  {
    id: "appx",
    code: "UWP / AppX",
    title: "Pacotes UWP/AppX quebrados",
    area: "Windows · Pacotes",
    nature:
      "Aplicativos empacotados que falham em registrar ou abrir por dependência ausente, registro corrompido ou provisionamento incompleto por usuário.",
    note: "",
  },
  {
    id: "dcom",
    code: "DCOM",
    title: "Permissões e ativação DCOM",
    area: "Windows · COM",
    nature:
      "Componentes que não conseguem ativar objetos remotos por permissão de lançamento/ativação — sintoma comum depois de endurecimento de segurança da plataforma.",
    note: "",
  },
  {
    id: "search",
    code: null,
    title: "Indexação do Windows Search",
    area: "Windows · Índice",
    nature:
      "Índice corrompido ou parado: a busca do Windows e do Outlook passa a devolver resultados incompletos ou nenhum resultado.",
    note: "",
  },
  {
    id: "excel-rds",
    code: null,
    title: "Corrupção de Excel em RDS/Citrix",
    area: "Ambiente compartilhado",
    nature:
      "Arquivos que corrompem em sessões remotas compartilhadas, onde perfil, cache e acesso concorrente ao arquivo entram em conflito.",
    note: "",
  },
];

/* ═══════════════════════════════════════════════════════════════
   Arsenal técnico
   ═══════════════════════════════════════════════════════════════ */
export type Track = {
  id: string;
  label: string;
  kicker: string;
  items: string[];
};

export const arsenal: Track[] = [
  {
    id: "infra",
    label: "Infraestrutura",
    kicker: "O terreno onde tudo roda",
    items: [
      "Windows Server",
      "Active Directory",
      "GPO",
      "WSUS",
      "Microsoft 365",
      "RDS / Citrix",
      "LANDESK",
    ],
  },
  {
    id: "seg",
    label: "Segurança",
    kicker: "Credencial, endpoint e dado",
    items: [
      "ICP-Brasil (certificados e tokens)",
      "CyberArk EPM",
      "Safetica DLP",
      "Microsoft Defender ATP",
    ],
  },
  {
    id: "redes",
    label: "Redes",
    kicker: "Do pacote ao endereço",
    items: ["TCP/IP", "Sub-redes VLSM", "IPv6", "Wireshark", "Packet Tracer"],
  },
  {
    id: "dev",
    label: "Desenvolvimento",
    kicker: "Também construo o que resolve",
    items: [
      "Python (POO, Tkinter, SQLite)",
      "C",
      "SQL",
      "HTML",
      "CSS",
      "JavaScript",
    ],
  },
  {
    id: "outros",
    label: "Outros",
    kicker: "Ferramenta e registro",
    items: [
      "Oracle Smart View",
      "Documentação técnica (ABNT)",
      "Microsoft Office avançado",
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   Projetos
   ═══════════════════════════════════════════════════════════════ */
export type Project = {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  url: string | null;
};

export const projects: Project[] = [
  {
    id: "barbearia",
    index: "01",
    name: "SaaS para barbearias",
    subtitle: "Barbearia Kraken · Navalha & Co.",
    description:
      "Sistema web de agendamento para barbearias, com integração planejada à WhatsApp Cloud API.",
    tags: ["Web", "Agendamento", "SaaS"],
    url: null,
  },
  {
    id: "ifa",
    index: "02",
    name: "Instituto Francisco de Assis",
    subtitle: "Sistema web de agendamento",
    description:
      "Aplicação para gestão de horários e atendimentos do instituto.",
    tags: ["Web", "Gestão", "Deploy"],
    url: "https://instituto-francisco-de-assis.vercel.app/index.html",
  },
  {
    id: "frota",
    index: "03",
    name: "Otimizador de frota",
    subtitle: "Python · Tkinter",
    description:
      "Aplicação desktop para alocação de carga usando o algoritmo First Fit Decreasing.",
    tags: ["Python", "Tkinter", "Algoritmos"],
    url: null,
  },
];

/* ═══════════════════════════════════════════════════════════════
   Repositórios públicos.

   Descrições são as do próprio GitHub. `portifolio-graim` fica de fora
   de propósito: é a versão antiga deste site, e mandar um recrutador para
   ela a partir daqui só enfraquece o que ele acabou de ver.
   ═══════════════════════════════════════════════════════════════ */
export type Repo = { name: string; description: string; lang: string };

export const repos: Repo[] = [
  {
    name: "organization-helper-system",
    description:
      "Sistema web de gerenciamento de itens, com cadastro, busca e organização de dados.",
    lang: "PHP · SQL · JS",
  },
  {
    name: "projeto-wydencoin-card-eventos",
    description: "Interface web para exibição de eventos em formato de cards.",
    lang: "HTML · CSS · JS",
  },
  {
    name: "projeto-wydencoin-card-eventos-adm",
    description: "Página administrativa para gerenciamento de eventos.",
    lang: "JavaScript",
  },
  {
    name: "quiz",
    description:
      "Quiz interativo para prática de lógica e interatividade no navegador.",
    lang: "JavaScript",
  },
];

/* ═══════════════════════════════════════════════════════════════
   Formação
   ═══════════════════════════════════════════════════════════════ */
export const education = {
  degree: "Bacharelado em Ciência da Computação",
  institution: "FACI Wyden",
  place: "Belém/PA",
  status: "4º semestre em curso",
  expected: "Conclusão prevista: 2029",
  courses: [
    {
      name: "Redes de Computadores",
      detail: "VLSM, IPv6, Wireshark e Packet Tracer",
    },
    {
      name: "Estruturas de Dados em C",
      detail: "Ponteiros, ordenação, árvores e filas",
    },
    { name: "Lógica Matemática", detail: "Fundamentos formais" },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   Navegação
   ═══════════════════════════════════════════════════════════════ */
export const nav = [
  { href: "#sobre", label: "Sobre" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#incidentes", label: "Incidentes" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
];
