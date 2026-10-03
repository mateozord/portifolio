export type Locale = "pt" | "en";

export type ProjectCategory = "web" | "database" | "automation" | "design";

/** Dados de um projeto que não mudam com o idioma. */
type ProjectBase = {
  slug: string;
  title: string;
  categories: ProjectCategory[];
  stack: string[];
  /** A primeira imagem é a capa do card. */
  images: string[];
  link?: string;
  repo?: string;
  featured?: boolean;
  /**
   * "case": estudo de caso em destaque; "other": faixa "Outros trabalhos";
   * "business": só na página /negocios (fora do portfólio de desenvolvedor).
   */
  group: "case" | "other" | "business";
};

/** Textos de um projeto, por idioma. `captions` segue a ordem de `images`. */
type ProjectCopy = {
  tagline: string;
  summary: string;
  description: string;
  highlights: string[];
  captions: string[];
  note?: string;
  /** Estudo de caso: o problema, as decisões, o resultado e um desafio real. */
  caseStudy?: { problem: string; decisions: string[]; result: string; challenge: string };
};

export type Project = ProjectBase & ProjectCopy;

export type PortfolioDictionary = {
  nav: {
    services: string;
    projects: string;
    about: string;
    process: string;
    contact: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
  };
  theme: { toLight: string; toDark: string };
  hero: {
    availability: string;
    /** Trechos entre *asteriscos* ganham destaque. */
    title: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
    proof: string[];
    floatingLive: string;
    floatingMasterpiece: string;
    floatingStack: string;
  };
  marqueeLabel: string;
  /** Showreel entre o hero e os serviços: duas palavras que se afastam. */
  reel: { words: [string, string]; cta: string; caption: string };
  /** Preços de referência ("a partir de") para negócios locais. */
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    from: string;
    perMonth: string;
    popular: string;
    /** Prazo médio de produção, mostrado abaixo do título. */
    deadline: string;
    cta: string;
    /** Mensagem pronta do WhatsApp; {plan} vira o nome do plano. */
    whatsappMessage: string;
    plans: { name: string; price: number; description: string; features: string[]; popular?: boolean }[];
    maintenance: { name: string; price: number; description: string; features: string[] };
    note: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; description: string; tags: string[] }[];
  };
  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filters: Record<"all" | ProjectCategory, string>;
    otherTitle: string;
    otherSubtitle: string;
    caseLabels: { problem: string; decisions: string; result: string; challenge: string };
    featuredBadge: string;
    liveBadge: string;
    openCase: string;
    live: string;
    code: string;
    similar: string;
    highlightsTitle: string;
    stackTitle: string;
    close: string;
    previous: string;
    next: string;
    items: Project[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    photoAlt: string;
    location: string;
    stats: { value: number; suffix?: string; label: string }[];
    journey: { title: string; detail: string }[];
    stackTitle: string;
    stack: { label: string; items: string[] }[];
    educationTitle: string;
    degree: string;
    school: string;
    period: string;
    status: string;
    coursesTitle: string;
    courses: string[];
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };
  contact: {
    /** Dica do lago de koi no fundo do card. */
    pondHint: string;
    eyebrow: string;
    title: string;
    body: string;
    whatsappLabel: string;
    whatsappHint: string;
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    copy: string;
    copied: string;
    /** `{project}` é trocado pelo nome do projeto. */
    similarSubject: string;
    form: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submitEmail: string;
      submitWhatsapp: string;
      hint: string;
    };
  };
  /** business: link discreto para a página de sites para negócios locais (/negocios). */
  footer: { tagline: string; builtWith: string; backToTop: string; business: string };
};

export const profile = {
  name: "Mateus Fantin",
  email: "matfp3@hotmail.com",
  whatsappDisplay: "11 98015-7119",
  whatsappLink: "https://wa.me/5511980157119",
  linkedin: "https://www.linkedin.com/in/mateus-fantin/",
  github: "https://github.com/mateozord",
};

export const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Framer Motion",
  "Vite",
  "Supabase",
  "PostgreSQL",
  "SQL",
  "Python",
  "FastAPI",
  "Recharts",
  "MapLibre GL",
  "Power BI",
  "Excel",
  "Git",
  "Vercel",
  "Netlify",
];

const projectBase: ProjectBase[] = [
  {
    slug: "cozylog",
    group: "case",
    title: "CozyLog",
    categories: ["web", "database", "design"],
    stack: ["React", "Vite", "Tailwind CSS v4", "Framer Motion", "Supabase", "RAWG API", "Steam Web API"],
    images: [
      "/projects/cozylog/cover.webp",
      "/projects/cozylog/diary.webp",
      "/projects/cozylog/rainbow-cards.webp",
      "/projects/cozylog/game-page.webp",
      "/projects/cozylog/community-feed.webp",
      "/projects/cozylog/responsive.webp",
    ],
    link: "https://cozylog.vercel.app",
    repo: "https://github.com/mateozord/cozylog",
    featured: true,
  },
  {
    slug: "aeropulse",
    group: "case",
    title: "AeroPulse",
    categories: ["web", "database", "automation"],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "MapLibre GL", "Recharts", "Supabase", "GitHub Actions"],
    images: [
      "/projects/aeropulse/home.webp",
      "/projects/aeropulse/war-room.webp",
      "/projects/aeropulse/airport-detail.webp",
      "/projects/aeropulse/airports.webp",
    ],
    link: "https://aeropulse-eight.vercel.app",
    repo: "https://github.com/mateozord/aeropulse",
  },
  {
    slug: "pulso",
    group: "case",
    title: "PULSO",
    categories: ["web", "database", "design"],
    stack: ["React", "Vite", "React Router", "Supabase", "Ticketmaster API", "Netlify Functions"],
    images: ["/projects/pulso/home.webp", "/projects/pulso/explore.webp", "/projects/pulso/event.webp"],
    repo: "https://github.com/mateozord/pulso",
  },
  {
    slug: "porao-grafico",
    group: "other",
    title: "Porão Gráfico",
    categories: ["design", "web"],
    stack: ["React", "Vite", "Tailwind CSS", "Context API", "Netlify Forms"],
    images: [
      "/projects/porao-grafico/cover.webp",
      "/projects/porao-grafico/lightbox.webp",
      "/projects/porao-grafico/checkout.webp",
      "/projects/porao-grafico/mobile.webp",
      "/projects/porao-grafico/bilingual.webp",
      "/projects/porao-grafico/landing.webp",
      "/projects/porao-grafico/poster-shinnoi.webp",
      "/projects/porao-grafico/poster-wolf-altar.webp",
      "/projects/porao-grafico/poster-furia-ancestral.webp",
      "/projects/porao-grafico/poster-grave-riot.webp",
      "/projects/porao-grafico/poster-black-claw-ritual.webp",
    ],
    link: "https://porao-grafico.netlify.app",
    repo: "https://github.com/mateozord/porao-grafico",
  },
  {
    slug: "vistamed",
    group: "business",
    title: "Vistamed",
    categories: ["web", "design"],
    stack: ["HTML", "CSS", "JavaScript", "WhatsApp"],
    images: ["/projects/vistamed/home.webp"],
    link: "https://vistamednovo.netlify.app",
    repo: "https://github.com/mateozord/vistamed",
  },
];

const projectCopy: Record<Locale, Record<string, ProjectCopy>> = {
  pt: {
    cozylog: {
      tagline: "Um diário de jogos aconchegante — e social.",
      summary:
        "Rede social para registrar, avaliar e compartilhar jogos, com perfis, conquistas, feed da comunidade e cards de review prontos para postar.",
      description:
        "O CozyLog nasceu como um diário pessoal de jogos e virou uma rede social completa: perfis públicos com conquistas automáticas, feed da comunidade com curtidas, reações e comentários, listas temáticas, página de cada jogo com estatísticas da comunidade e busca em todo o catálogo da RAWG. Tudo embrulhado numa interface quente e cheia de microinterações, em que cada clique tem resposta.",
      highlights: [
        "Cards com inclinação 3D que segue o cursor, borda em gradiente girando e partículas: o selo Rainbow Masterpiece",
        "Supabase com Postgres, login e RLS por usuário, triggers e uma Edge Function que protege a chave da Steam",
        "Status “Jogando agora” ao vivo, direto da Steam Web API",
        "Cards de review em 1080×1350 gerados no navegador, prontos para compartilhar",
        "Bilíngue (PT/EN), tema claro e escuro e termos de uso e privacidade alinhados à LGPD",
      ],
      captions: [
        "Visão geral do CozyLog",
        "Diário com o que está sendo jogado agora",
        "Cards Rainbow Masterpiece animados",
        "Página do jogo com estatísticas da comunidade",
        "Feed da comunidade",
        "Versão mobile, clara e escura",
      ],
      caseStudy: {
        problem: "Apps de jogos ou são catálogos frios ou planilhas pessoais. Eu queria um diário com cara de casa que também fosse social, sem virar mais uma rede barulhenta.",
        decisions: [
          "Supabase com Row Level Security: quem pode editar um jogo ou comentar é regra do banco, não só do front-end.",
          "A chave da Steam não pode ir para o navegador: uma Edge Function faz de proxy seguro e o app recebe só o status já tratado.",
          "Curtidas e reações otimistas: a interface responde na hora e volta atrás se o servidor recusar.",
          "Tradução no estilo gettext, com o texto em português como chave e aviso no console para frases sem tradução.",
        ],
        result: "Produto no ar com perfis públicos, feed, listas, página de cada jogo, conquistas automáticas, termos e privacidade (LGPD) e versão em inglês.",
        challenge: "Virar social sem perder o que já existia: os jogos criados antes do login ficaram sem dono, e a migração do banco atribui cada um à conta certa.",
      },
    },
    aeropulse: {
      tagline: "Inteligência experimental em aviação.",
      summary:
        "Cruza clima, tráfego aéreo e histórico para gerar um score explicável de 0 a 100 para 10 grandes aeroportos brasileiros.",
      description:
        "Painéis de aviação costumam mostrar um mar de números que ninguém fora do setor entende, ou previsões confiantes sem raciocínio visível. O AeroPulse cruza fontes reais e independentes (clima, tráfego aéreo observado e tendência histórica) em um score de 0 a 100 por aeroporto e sempre mostra o porquê do número. Ele deixa claro o que é ao vivo, o que é um retrato de 30 minutos e o que não está disponível: uma leitura indisponível nunca aparece como zero.",
      highlights: [
        "Mapa ao vivo com MapLibre GL e sala de operações com os aeroportos que pedem atenção",
        "Score explicável: cada número vem com os fatores que o formaram",
        "Histórico guardado no Supabase e atualizado automaticamente com GitHub Actions",
        "Explicação em linguagem natural gerada por IA (experimental)",
        "Honesto por design: não prevê atrasos nem cancelamentos, e diz isso com todas as letras",
      ],
      captions: [
        "Visão geral com o mapa do Brasil",
        "Sala de operações",
        "Detalhe de um aeroporto com score e tendência",
        "Lista de aeroportos monitorados",
      ],
      caseStudy: {
        problem: "Painéis de aviação mostram números que ninguém entende ou previsões confiantes sem raciocínio visível. Os dois quebram a confiança.",
        decisions: [
          "Um score de 0 a 100 que sempre mostra os fatores que o formaram, com peso limitado para nenhum fator dominar.",
          "O tráfego aéreo fica fora do score de propósito: sem histórico de base por aeroporto, contar aviões não significa nada.",
          "A OpenSky bloqueia o navegador e trava em funções serverless: uma rotina no GitHub Actions captura os dados a cada 30 minutos e o site lê esse retrato.",
          "A IA (Gemini) só explica números já calculados e é instruída a nunca inventar causa nem prever voos.",
        ],
        result: "10 aeroportos monitorados, histórico real crescendo a cada 30 minutos, página de metodologia e uma sala de operações em tela cheia, tudo em planos gratuitos.",
        challenge: "Ser honesto com o dado: uma leitura indisponível aparece como “N/D”, nunca como zero, e o site diz o que é ao vivo e o que é um retrato de 30 minutos.",
      },
    },
    pulso: {
      tagline: "A cidade toca aqui.",
      summary:
        "Descoberta de shows, artistas e casas de show com dados reais da Ticketmaster, filtros compartilháveis e favoritos por usuário.",
      description:
        "“O que está tocando na minha cidade essa semana?” é uma pergunta surpreendentemente difícil de responder. Sites de ingresso são feitos para vender, redes sociais são ruído. O PULSO fica no meio do caminho: uma curadoria de shows reais organizada por cidade, período, gênero e artista, com identidade visual urbana e editorial, e nenhum dado inventado.",
      highlights: [
        "Eventos reais em tempo real pela Ticketmaster Discovery API",
        "Proxy serverless que mantém a chave da API fora do navegador",
        "Busca geográfica para contornar cidades vazias nos dados brasileiros da API",
        "Filtros guardados na URL: qualquer busca vira um link compartilhável",
        "Favoritos por usuário com Supabase Auth e Row Level Security",
      ],
      captions: ["Página inicial", "Explorar com filtros", "Página de um evento"],
      caseStudy: {
        problem: "“O que toca na minha cidade essa semana?” é difícil de responder: sites de ingresso são feitos para vender e redes sociais são ruído.",
        decisions: [
          "Dados reais da Ticketmaster, sem nada inventado, com um proxy no servidor que guarda a chave e resolve o bloqueio de CORS.",
          "Filtros na URL: qualquer busca vira um link compartilhável.",
          "Sem bibliotecas de UI, estado ou animação: um dropdown próprio (o select nativo não deixa estilizar o menu) e animações em CSS que respeitam “reduzir movimento”.",
          "Favoritos por usuário com Row Level Security: a regra de quem vê o quê fica no banco.",
        ],
        result: "Home, explorar, evento, artista, login e favoritos, com estados de carregando, erro, vazio e imagem quebrada tratados em todas as telas.",
        challenge: "A API devolve a cidade vazia para a maioria dos locais brasileiros, então o filtro por cidade não achava nada. Só apareceu testando com dados reais; a solução foi buscar por coordenadas e raio.",
      },
    },
    "porao-grafico": {
      tagline: "Arte para banda, evento ou lançamento.",
      summary:
        "Loja de serviços de design gráfico, com pôsteres, capas e identidade visual, do catálogo ao checkout, sem negociação manual no WhatsApp.",
      description:
        "Loja e portfólio bilíngue para um artista underground: pôsteres de show, capas de single e álbum, pacotes de divulgação e identidade visual com cara de xerox colada na parede. O cliente navega pelo catálogo, abre cada arte em tela cheia, monta o carrinho e fecha o pedido escolhendo Pix, link de cartão ou pagamento na entrega. Para trabalhos sob medida, um formulário de orçamento já pergunta tipo de arte, prazo e investimento.",
      highlights: [
        "Catálogo com lightbox em tela cheia, navegável pelas setas do teclado",
        "Carrinho com Context API que sobrevive ao recarregar a página, com limite por item e subtotal ao vivo",
        "Pedidos e orçamentos chegam pelo Netlify Forms, sem precisar de servidor",
        "Bilíngue (PT/EN), com idioma detectado pelo navegador e compartilhável por link",
        "Identidade visual própria: textura de papel, rachaduras e molduras feitas só com CSS",
      ],
      captions: [
        "Visão geral do Porão Gráfico",
        "Catálogo com lightbox em tela cheia",
        "Carrinho e checkout",
        "Versão mobile",
        "Bilíngue: português e inglês",
        "Landing page completa, do hero ao orçamento",
        "Pôster SHINNOI, do catálogo",
        "Pôster WOLF ALTAR, do catálogo",
        "Pôster FÚRIA ANCESTRAL, do catálogo",
        "Pôster GRAVE RIOT, do catálogo",
        "Pôster BLACK CLAW RITUAL, do catálogo",
      ],
    },
    vistamed: {
      tagline: "Redesign para um hospital de olhos com 33 anos de história.",
      summary:
        "Proposta de redesign que reorganiza mais de 30 procedimentos e leva o agendamento direto para o WhatsApp.",
      description:
        "Proposta de redesign para o Hospital de Olhos Vistamed. Reorganiza mais de 30 procedimentos de diagnóstico e cirurgia por categoria, propõe agendamento direto pelo WhatsApp, sem intermediários, e detalha os convênios aceitos nas duas unidades da Grande São Paulo. Design limpo, com listas expansíveis pensadas para leitura rápida em qualquer aparelho.",
      highlights: [
        "Mais de 30 procedimentos organizados em listas expansíveis",
        "Agendamento direto pelo WhatsApp",
        "Convênios e unidades detalhados, com leitura rápida no celular",
        "Tema claro e escuro",
      ],
      captions: ["Página inicial"],
      note: "Proposta conceitual criada para uma apresentação interna, não é o site oficial.",
    },
  },
  en: {
    cozylog: {
      tagline: "A cozy game diary, and a social one.",
      summary:
        "A social network to log, rate and share games, with profiles, achievements, a community feed and review cards ready to post.",
      description:
        "CozyLog started as a personal game diary and grew into a full social network: public profiles with automatic achievements, a community feed with likes, reactions and comments, themed lists, a page for every game with community stats, and search across the whole RAWG catalog. It's all wrapped in a warm interface full of micro-interactions, where every click gets a response.",
      highlights: [
        "Cards with a 3D tilt that follows the cursor, a rotating gradient border and sparkles: the Rainbow Masterpiece badge",
        "Supabase with Postgres, auth and per-user RLS, triggers, and an Edge Function that keeps the Steam key safe",
        "Live “Now playing” status straight from the Steam Web API",
        "1080×1350 review cards generated in the browser, ready to share",
        "Bilingual (PT/EN), light and dark themes, and LGPD-aligned terms and privacy pages",
      ],
      captions: [
        "CozyLog overview",
        "Diary with what's being played right now",
        "Animated Rainbow Masterpiece cards",
        "Game page with community stats",
        "Community feed",
        "Mobile version, light and dark",
      ],
      caseStudy: {
        problem: "Game apps are either cold catalogs or personal spreadsheets. I wanted a diary that feels like home and is also social, without becoming another noisy network.",
        decisions: [
          "Supabase with Row Level Security: who can edit a game or comment is a database rule, not just a front-end check.",
          "The Steam key can't reach the browser: an Edge Function acts as a secure proxy and the app only gets the processed status.",
          "Optimistic likes and reactions: the UI responds instantly and rolls back if the server refuses.",
          "Gettext-style translation, with the Portuguese text as the key and a console warning for missing translations.",
        ],
        result: "A live product with public profiles, feed, lists, a page for every game, automatic achievements, terms and privacy (LGPD) and an English version.",
        challenge: "Going social without losing what existed: games created before login had no owner, and the database migration assigns each one to the right account.",
      },
    },
    aeropulse: {
      tagline: "Experimental intelligence for aviation.",
      summary:
        "Cross-references weather, air traffic and history into an explainable 0–100 score for 10 major Brazilian airports.",
      description:
        "Aviation dashboards usually show a wall of numbers nobody outside the industry can read, or confident predictions with no visible reasoning. AeroPulse cross-references real, independent sources (weather, observed air traffic and historical trend) into a 0–100 score per airport, and always shows why the number is what it is. It's explicit about what's live, what's a 30-minute snapshot and what's unavailable: a missing reading is never shown as zero.",
      highlights: [
        "Live map built with MapLibre GL and an operations room for airports that need attention",
        "Explainable score: every number comes with the factors behind it",
        "History stored in Supabase and refreshed automatically with GitHub Actions",
        "Plain-language explanation generated by AI (experimental)",
        "Honest by design: it doesn't predict delays or cancellations, and says so",
      ],
      captions: [
        "Overview with the map of Brazil",
        "Operations room",
        "Airport detail with score and trend",
        "Monitored airports",
      ],
      caseStudy: {
        problem: "Aviation dashboards show numbers nobody understands, or confident predictions with no visible reasoning. Both break trust.",
        decisions: [
          "A 0–100 score that always shows the factors behind it, with capped weights so no single factor dominates.",
          "Air traffic is left out of the score on purpose: without a per-airport baseline, counting planes means nothing.",
          "OpenSky blocks browsers and stalls in serverless functions: a GitHub Actions job captures data every 30 minutes and the site reads that snapshot.",
          "The AI (Gemini) only explains numbers already computed and is told never to invent causes or predict flights.",
        ],
        result: "10 monitored airports, real history growing every 30 minutes, a methodology page and a fullscreen war room, all on free tiers.",
        challenge: "Being honest about data: a missing reading shows as “N/A”, never as zero, and the site says what is live and what is a 30-minute snapshot.",
      },
    },
    pulso: {
      tagline: "The city plays here.",
      summary:
        "Discover shows, artists and venues with real Ticketmaster data, shareable filters and per-user favorites.",
      description:
        "“What's playing in my city this week?” is a surprisingly hard question to answer well. Ticketing sites are built to sell, social media is noise. PULSO sits in between: a curated view of real shows organized by city, date, genre and artist, with an urban, editorial visual identity and zero made-up data.",
      highlights: [
        "Real events in real time from the Ticketmaster Discovery API",
        "Serverless proxy that keeps the API key out of the browser",
        "Geographic search to work around empty city fields in Brazilian API data",
        "Filters live in the URL, so every search is a shareable link",
        "Per-user favorites with Supabase Auth and Row Level Security",
      ],
      captions: ["Home page", "Explore with filters", "Event page"],
      caseStudy: {
        problem: "“What's playing in my city this week?” is hard to answer: ticket sites are built to sell, social media is noise.",
        decisions: [
          "Real Ticketmaster data, nothing made up, with a server-side proxy that keeps the key and solves the CORS block.",
          "Filters live in the URL: any search becomes a shareable link.",
          "No UI, state or animation libraries: a custom dropdown (native selects can't style the open menu) and CSS animations that respect reduced motion.",
          "Per-user favorites with Row Level Security: who sees what is enforced in the database.",
        ],
        result: "Home, explore, event, artist, login and favorites, with loading, error, empty and broken-image states handled on every screen.",
        challenge: "The API returns an empty city for most Brazilian venues, so the city filter found nothing. It only showed up with real data; the fix was searching by coordinates and radius.",
      },
    },
    "porao-grafico": {
      tagline: "Art for bands, events and releases.",
      summary:
        "A graphic design store for posters, covers and visual identity, from catalog to checkout, with no back-and-forth over WhatsApp.",
      description:
        "A bilingual shop and portfolio for an underground artist: gig posters, single and album covers, promo packs and visual identity that looks like a photocopy glued to a wall. Clients browse the catalog, open each piece full screen, fill a cart and check out with Pix, a card payment link or pay on delivery. For custom work, a quote form already asks for the type of art, deadline and budget.",
      highlights: [
        "Catalog with a full-screen lightbox you can browse with the arrow keys",
        "Cart built on the Context API that survives page reloads, with per-item limits and a live subtotal",
        "Orders and quotes delivered through Netlify Forms, no server needed",
        "Bilingual (PT/EN), with browser language detection and shareable language links",
        "Original visual identity: paper texture, wall cracks and poster frames made purely in CSS",
      ],
      captions: [
        "Porão Gráfico overview",
        "Catalog with a full-screen lightbox",
        "Cart and checkout",
        "Mobile version",
        "Bilingual: Portuguese and English",
        "Full landing page, from hero to quote form",
        "SHINNOI poster, from the catalog",
        "WOLF ALTAR poster, from the catalog",
        "FÚRIA ANCESTRAL poster, from the catalog",
        "GRAVE RIOT poster, from the catalog",
        "BLACK CLAW RITUAL poster, from the catalog",
      ],
    },
    vistamed: {
      tagline: "A redesign for an eye hospital with 33 years of history.",
      summary:
        "A redesign proposal that reorganizes 30+ procedures and moves scheduling straight to WhatsApp.",
      description:
        "A redesign proposal for Vistamed Eye Hospital. It reorganizes 30+ diagnostic and surgical procedures by category, proposes direct WhatsApp scheduling with no middleman, and details the insurance plans accepted at both São Paulo-area locations. A clean design with expandable lists built for quick reading on any device.",
      highlights: [
        "30+ procedures organized in expandable lists",
        "Direct scheduling through WhatsApp",
        "Insurance plans and locations laid out for quick mobile reading",
        "Light and dark themes",
      ],
      captions: ["Home page"],
      note: "A concept proposal made for an internal pitch, not the official website.",
    },
  },
};

function buildProjects(locale: Locale): Project[] {
  return projectBase.map((base) => ({ ...base, ...projectCopy[locale][base.slug] }));
}

export const portfolioContent: Record<Locale, PortfolioDictionary> = {
  pt: {
    nav: {
      services: "Serviços",
      projects: "Projetos",
      about: "Sobre",
      process: "Processo",
      contact: "Contato",
      cta: "Vamos conversar",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    theme: { toLight: "Mudar para o tema claro", toDark: "Mudar para o tema escuro" },
    hero: {
      availability: "Disponível para novos projetos",
      title: "Sites, sistemas e automações que *fazem seu negócio andar.*",
      intro:
        "Sou Mateus Fantin, desenvolvedor em São Paulo. Uno design, banco de dados, código e automação para entregar produtos completos: do primeiro rascunho ao site no ar.",
      ctaPrimary: "Ver projetos",
      ctaSecondary: "Falar no WhatsApp",
      proof: ["4 projetos construídos", "Design + código + dados", "São Paulo, BR"],
      floatingLive: "Dados ao vivo",
      floatingMasterpiece: "Rainbow Masterpiece",
      floatingStack: "Supabase · RLS",
    },
    marqueeLabel: "Ferramentas que uso no dia a dia",
    pricing: {
      eyebrow: "Investimento",
      title: "Quanto custa um *site para o seu negócio*",
      subtitle:
        "Valores de referência para negócios locais como academias, restaurantes, mercados e clínicas. O orçamento é gratuito e sem compromisso: o preço final depende do que o seu negócio precisa.",
      from: "a partir de",
      perMonth: "/mês",
      popular: "Mais procurado",
      deadline: "Prazo médio de produção: 3 semanas",
      cta: "Pedir orçamento",
      whatsappMessage: "Olá, Mateus! Vi seu portfólio e tenho interesse no plano {plan}.",
      plans: [
        {
          name: "Landing page",
          price: 1200,
          description: "Uma página completa para o seu negócio ser encontrado e receber clientes direto no WhatsApp.",
          features: [
            "Horários, serviços e preços",
            "Localização com Google Maps",
            "Botão direto para o WhatsApp",
            "Feita para funcionar bem no celular",
          ],
        },
        {
          name: "Site institucional",
          price: 2500,
          description: "Várias páginas para apresentar sua empresa por completo e aparecer no Google da sua região.",
          features: [
            "Tudo da landing page",
            "Páginas de sobre, serviços, equipe e contato",
            "Mural de novidades ou blog",
            "SEO local para aparecer nas buscas da região",
          ],
          popular: true,
        },
        {
          name: "Site com sistema",
          price: 5000,
          description: "Para quem quer automatizar o atendimento: cadastro, agendamento e integrações.",
          features: [
            "Tudo do site institucional",
            "Pré-cadastro ou matrícula online",
            "Agendamento de horários ou aulas",
            "Integração com o sistema de gestão",
          ],
        },
      ],
      maintenance: {
        name: "Manutenção mensal",
        price: 150,
        description: "Seu site sempre atualizado, rápido e seguro, sem você precisar se preocupar.",
        features: ["Atualização de horários, preços e avisos", "Backups", "Velocidade e segurança em dia"],
      },
      note: "Valores de referência. Cada negócio é diferente: me conte o que você precisa e eu te passo um orçamento fechado.",
    },
    reel: { words: ["Projetos", "reais"], cta: "Ver projetos", caption: "Sites e sistemas no ar, feitos do zero" },
    services: {
      eyebrow: "Serviços",
      title: "O que posso *fazer por você*",
      subtitle:
        "Da página que apresenta sua marca ao sistema que organiza sua operação. Você fala com uma pessoa só, do começo ao fim.",
      items: [
        {
          title: "Sites e landing pages",
          description:
            "Sites institucionais, portfólios e páginas de venda rápidos, responsivos e com identidade própria, feitos para transformar visitantes em clientes.",
          tags: ["Next.js", "React", "SEO"],
        },
        {
          title: "Sistemas e painéis",
          description:
            "Aplicações web com login, banco de dados e dashboards que transformam planilhas e dados soltos em decisões claras.",
          tags: ["Supabase", "PostgreSQL", "Dashboards"],
        },
        {
          title: "Automação de processos",
          description:
            "Robôs e integrações que tiram tarefas repetitivas do seu caminho: relatórios, planilhas, prazos, WhatsApp e rotinas do dia a dia.",
          tags: ["Python", "FastAPI", "Integrações"],
        },
        {
          title: "Design e identidade",
          description:
            "Interfaces bonitas e fáceis de usar, identidade visual e animações que fazem sua marca parecer tão boa quanto ela é.",
          tags: ["UI", "Identidade visual", "Motion"],
        },
      ],
    },
    projects: {
      eyebrow: "Portfólio",
      title: "Interfaces que deixam *o complexo simples*",
      subtitle:
        "Três produtos completos, do problema ao código no ar: dados confusos viram uma experiência clara. Abra cada um para ver as decisões por trás.",
      filters: {
        all: "Todos",
        web: "Web",
        database: "Dados",
        automation: "Automação",
        design: "Design",
      },
      otherTitle: "Outros trabalhos",
      otherSubtitle: "Site e loja para quem vive de arte.",
      caseLabels: { problem: "O problema", decisions: "Minhas decisões", result: "O resultado", challenge: "Um desafio real" },
      featuredBadge: "Mais recente",
      liveBadge: "No ar",
      openCase: "Ver detalhes",
      live: "Ver ao vivo",
      code: "Código",
      similar: "Quero um projeto assim",
      highlightsTitle: "Destaques",
      stackTitle: "Tecnologias",
      close: "Fechar",
      previous: "Imagem anterior",
      next: "Próxima imagem",
      items: buildProjects("pt"),
    },
    about: {
      eyebrow: "Sobre mim",
      title: "Das operações do turismo *ao código*",
      paragraphs: [
        "Comecei em operações na CVC Corp e hoje trabalho com grupos específicos, resolvendo problemas de clientes com prazo apertado. Foi no dia a dia do turismo que aprendi a lidar com sistemas, processos e pressão real de negócio, bem antes de escrever a primeira linha de código.",
        "Hoje sou formado em Análise e Desenvolvimento de Sistemas e uno quatro frentes em cada entrega: design, banco de dados, desenvolvimento web e automação. Por isso entendo o problema do seu negócio antes de propor a solução, e entrego o produto inteiro, não só uma parte dele.",
      ],
      photoAlt: "Foto de Mateus Fantin",
      location: "São Paulo, BR",
      stats: [
        { value: 4, label: "projetos construídos" },
        { value: 4, label: "frentes em cada entrega" },
        { value: 15, suffix: "+", label: "tecnologias no dia a dia" },
      ],
      journey: [
        { title: "Operações no turismo", detail: "CVC Corp · operações e grupos" },
        { title: "Análise e Desenvolvimento de Sistemas", detail: "Impacta · 2024–2026" },
        { title: "Desenvolvimento web", detail: "Sites, sistemas e dashboards" },
        { title: "Automação e dados", detail: "Hoje" },
      ],
      stackTitle: "Stack",
      stack: [
        { label: "Front-end", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
        { label: "Dados", items: ["SQL", "Supabase", "PostgreSQL", "Power BI", "Excel"] },
        { label: "Automação", items: ["Python", "FastAPI", "Integrações com WhatsApp", "Scripts e bots"] },
        { label: "Design", items: ["UI Design", "Identidade visual", "Prototipação", "Motion"] },
      ],
      educationTitle: "Formação",
      degree: "Análise e Desenvolvimento de Sistemas",
      school: "Impacta Tecnologia",
      period: "fev/2024 – jun/2026",
      status: "Concluído",
      coursesTitle: "Cursos",
      courses: [
        "Excel: Domine o Editor de Planilhas · Alura (2024)",
        "Power BI Desktop: construindo meu primeiro dashboard · Alura (2024)",
        "SQLite online: conhecendo instruções SQL · Alura (2024)",
      ],
    },
    process: {
      eyebrow: "Como trabalho",
      title: "Um processo *simples e transparente*",
      subtitle: "Você sabe o que está acontecendo em cada etapa, sem surpresas no meio do caminho.",
      steps: [
        {
          title: "Conversa",
          description: "Entendo seu negócio, seu público e o problema real, antes de escrever uma linha de código.",
        },
        {
          title: "Proposta",
          description: "Escopo, prazo e investimento definidos com clareza, sem letras miúdas.",
        },
        {
          title: "Construção",
          description: "Design e desenvolvimento com prévias frequentes, para você acompanhar tudo de perto.",
        },
        {
          title: "Entrega",
          description: "Projeto no ar, testado no celular e no computador, e eu continuo por perto para ajustes.",
        },
      ],
    },
    contact: {
      pondHint: "Clique na água para alimentar os peixes",
      eyebrow: "Contato",
      title: "Tem um projeto em mente? *Vamos tirar do papel.*",
      body: "Me conte sua ideia: um site, um sistema, uma automação ou uma identidade visual. Eu respondo com um caminho claro, sem compromisso.",
      whatsappLabel: "WhatsApp",
      whatsappHint: "O jeito mais rápido de falar comigo",
      emailLabel: "E-mail",
      linkedinLabel: "LinkedIn",
      githubLabel: "GitHub",
      copy: "Copiar e-mail",
      copied: "Copiado!",
      similarSubject: "Quero um projeto parecido com o {project}",
      form: {
        title: "Ou me mande uma mensagem",
        name: "Nome",
        namePlaceholder: "Como posso te chamar?",
        email: "E-mail",
        emailPlaceholder: "voce@empresa.com",
        subject: "Assunto",
        subjectPlaceholder: "Ex.: site para minha clínica",
        message: "Mensagem",
        messagePlaceholder: "Conte um pouco sobre a ideia, o prazo e o que você espera do projeto.",
        submitEmail: "Enviar por e-mail",
        submitWhatsapp: "Enviar pelo WhatsApp",
        hint: "Os botões abrem seu e-mail ou WhatsApp com a mensagem pronta.",
      },
    },
    footer: {
      tagline: "Sites, sistemas e automações com design próprio.",
      builtWith: "Feito com Next.js, Tailwind CSS e Framer Motion.",
      backToTop: "Voltar ao topo",
      business: "Sites para negócios locais",
    },
  },
  en: {
    nav: {
      services: "Services",
      projects: "Projects",
      about: "About",
      process: "Process",
      contact: "Contact",
      cta: "Let's talk",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    theme: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
    hero: {
      availability: "Available for new projects",
      title: "Websites, systems and automations that *move your business forward.*",
      intro:
        "I'm Mateus Fantin, a developer based in São Paulo. I bring design, databases, code and automation together to ship complete products: from the first sketch to a live site.",
      ctaPrimary: "See projects",
      ctaSecondary: "Message me on WhatsApp",
      proof: ["4 projects built", "Design + code + data", "São Paulo, Brazil"],
      floatingLive: "Live data",
      floatingMasterpiece: "Rainbow Masterpiece",
      floatingStack: "Supabase · RLS",
    },
    marqueeLabel: "Tools I use every day",
    pricing: {
      eyebrow: "Pricing",
      title: "What a *website for your business* costs",
      subtitle:
        "Reference prices for local businesses like gyms, restaurants, markets and clinics. Quotes are free with no strings attached: the final price depends on what your business needs.",
      from: "from",
      perMonth: "/mo",
      popular: "Most popular",
      deadline: "Average production time: 3 weeks",
      cta: "Get a quote",
      whatsappMessage: "Hi Mateus! I saw your portfolio and I'm interested in the {plan} plan.",
      plans: [
        {
          name: "Landing page",
          price: 1200,
          description: "One complete page so your business gets found and customers reach you on WhatsApp.",
          features: ["Opening hours, services and prices", "Location with Google Maps", "Direct WhatsApp button", "Built to work great on phones"],
        },
        {
          name: "Business website",
          price: 2500,
          description: "Multiple pages to fully present your business and show up on Google in your area.",
          features: [
            "Everything in the landing page",
            "About, services, team and contact pages",
            "News board or blog",
            "Local SEO to show up in nearby searches",
          ],
          popular: true,
        },
        {
          name: "Website + system",
          price: 5000,
          description: "For businesses that want to automate: sign-ups, bookings and integrations.",
          features: [
            "Everything in the business website",
            "Online pre-registration or enrollment",
            "Booking for appointments or classes",
            "Integration with your management system",
          ],
        },
      ],
      maintenance: {
        name: "Monthly maintenance",
        price: 150,
        description: "Your site always up to date, fast and secure, without you having to worry.",
        features: ["Updates to hours, prices and notices", "Backups", "Speed and security kept in check"],
      },
      note: "Reference prices. Every business is different: tell me what you need and I'll send you a fixed quote.",
    },
    reel: { words: ["Real", "work"], cta: "See projects", caption: "Live sites and systems, built from scratch" },
    services: {
      eyebrow: "Services",
      title: "What I can *do for you*",
      subtitle:
        "From the page that introduces your brand to the system that runs your operation. You deal with one person, from start to finish.",
      items: [
        {
          title: "Websites and landing pages",
          description:
            "Company sites, portfolios and sales pages that are fast, responsive and truly yours, built to turn visitors into clients.",
          tags: ["Next.js", "React", "SEO"],
        },
        {
          title: "Systems and dashboards",
          description:
            "Web apps with login, a database and dashboards that turn spreadsheets and scattered data into clear decisions.",
          tags: ["Supabase", "PostgreSQL", "Dashboards"],
        },
        {
          title: "Process automation",
          description:
            "Bots and integrations that take repetitive work off your plate: reports, spreadsheets, deadlines, WhatsApp and daily routines.",
          tags: ["Python", "FastAPI", "Integrations"],
        },
        {
          title: "Design and identity",
          description:
            "Beautiful, easy-to-use interfaces, visual identity and motion that make your brand look as good as it is.",
          tags: ["UI", "Visual identity", "Motion"],
        },
      ],
    },
    projects: {
      eyebrow: "Portfolio",
      title: "Interfaces that make *the complex simple*",
      subtitle:
        "Three complete products, from problem to shipped code: messy data becomes a clear experience. Open each one to see the decisions behind it.",
      filters: {
        all: "All",
        web: "Web",
        database: "Data",
        automation: "Automation",
        design: "Design",
      },
      otherTitle: "Other work",
      otherSubtitle: "A website and store for people who make art.",
      caseLabels: { problem: "The problem", decisions: "My decisions", result: "The result", challenge: "A real challenge" },
      featuredBadge: "Latest",
      liveBadge: "Live",
      openCase: "See details",
      live: "View live",
      code: "Code",
      similar: "I want a project like this",
      highlightsTitle: "Highlights",
      stackTitle: "Tech stack",
      close: "Close",
      previous: "Previous image",
      next: "Next image",
      items: buildProjects("en"),
    },
    about: {
      eyebrow: "About me",
      title: "From travel operations *to code*",
      paragraphs: [
        "I started in operations at CVC Corp, and today I work with specific groups, solving customer problems on tight deadlines. The day-to-day of the travel business taught me to deal with systems, processes and real business pressure, long before I wrote my first line of code.",
        "Today I hold a degree in Systems Analysis and Development and bring four areas together in every delivery: design, databases, web development and automation. That's why I understand your business problem before proposing a solution, and deliver the whole product, not just a piece of it.",
      ],
      photoAlt: "Photo of Mateus Fantin",
      location: "São Paulo, Brazil",
      stats: [
        { value: 4, label: "projects built" },
        { value: 4, label: "areas in every delivery" },
        { value: 15, suffix: "+", label: "tools used daily" },
      ],
      journey: [
        { title: "Travel operations", detail: "CVC Corp · operations and groups" },
        { title: "Systems Analysis and Development", detail: "Impacta · 2024–2026" },
        { title: "Web development", detail: "Sites, systems and dashboards" },
        { title: "Automation and data", detail: "Today" },
      ],
      stackTitle: "Stack",
      stack: [
        { label: "Front-end", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
        { label: "Data", items: ["SQL", "Supabase", "PostgreSQL", "Power BI", "Excel"] },
        { label: "Automation", items: ["Python", "FastAPI", "WhatsApp integrations", "Scripts and bots"] },
        { label: "Design", items: ["UI design", "Visual identity", "Prototyping", "Motion"] },
      ],
      educationTitle: "Education",
      degree: "Systems Analysis and Development",
      school: "Impacta Tecnologia",
      period: "Feb 2024 – Jun 2026",
      status: "Completed",
      coursesTitle: "Courses",
      courses: [
        "Excel: Master the Spreadsheet Editor · Alura (2024)",
        "Power BI Desktop: building my first dashboard · Alura (2024)",
        "SQLite online: learning SQL statements · Alura (2024)",
      ],
    },
    process: {
      eyebrow: "How I work",
      title: "A *simple, transparent* process",
      subtitle: "You know what's happening at every step, with no surprises along the way.",
      steps: [
        {
          title: "Conversation",
          description: "I learn about your business, your audience and the real problem before writing a line of code.",
        },
        {
          title: "Proposal",
          description: "Scope, timeline and budget laid out clearly, with no fine print.",
        },
        {
          title: "Build",
          description: "Design and development with frequent previews, so you can follow along closely.",
        },
        {
          title: "Launch",
          description: "Your project goes live, tested on phone and desktop, and I stay around for adjustments.",
        },
      ],
    },
    contact: {
      pondHint: "Click the water to feed the fish",
      eyebrow: "Contact",
      title: "Have a project in mind? *Let's make it real.*",
      body: "Tell me your idea: a website, a system, an automation or a visual identity. I'll reply with a clear path forward, no strings attached.",
      whatsappLabel: "WhatsApp",
      whatsappHint: "The fastest way to reach me",
      emailLabel: "Email",
      linkedinLabel: "LinkedIn",
      githubLabel: "GitHub",
      copy: "Copy email",
      copied: "Copied!",
      similarSubject: "I want a project like {project}",
      form: {
        title: "Or send me a message",
        name: "Name",
        namePlaceholder: "What should I call you?",
        email: "Email",
        emailPlaceholder: "you@company.com",
        subject: "Subject",
        subjectPlaceholder: "e.g. a website for my clinic",
        message: "Message",
        messagePlaceholder: "Tell me a bit about the idea, the timeline and what you expect from the project.",
        submitEmail: "Send by email",
        submitWhatsapp: "Send on WhatsApp",
        hint: "Both buttons open your email or WhatsApp with the message ready to go.",
      },
    },
    footer: {
      tagline: "Websites, systems and automations with original design.",
      builtWith: "Built with Next.js, Tailwind CSS and Framer Motion.",
      backToTop: "Back to top",
      business: "Websites for local businesses",
    },
  },
};
