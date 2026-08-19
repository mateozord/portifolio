export type Locale = "pt" | "en";

export type ProjectCategory = "design" | "database" | "web" | "automation";

export type Project = {
  title: string;
  tagline: string;
  description: string;
  categories: ProjectCategory[];
  stack: string[];
  link?: string;
  image?: string;
};

export type SkillItem = {
  name: string;
  level: string;
};

export type PortfolioDictionary = {
  nav: {
    about: string;
    projects: string;
    skills: string;
    education: string;
    courses: string;
    contact: string;
  };
  hero: {
    greetingPrefix: string;
    role: string;
    summary: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
    code: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    stats: { label: string; value: string }[];
    statusLines: string[];
  };
  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    categoryLabels: Record<ProjectCategory, string>;
    items: Project[];
  };
  skills: {
    eyebrow: string;
    title: string;
    subtitle: string;
    groups: { label: string; items: SkillItem[] }[];
  };
  education: {
    eyebrow: string;
    title: string;
    degree: string;
    school: string;
    period: string;
    status: string;
  };
  courses: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    talkToMe: string;
    formTitle: string;
    methods: {
      emailLabel: string;
      whatsappLabel: string;
      linkedinLabel: string;
      ctaLabel: string;
    };
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
    };
  };
  footer: string;
};

export const portfolioContent: Record<Locale, PortfolioDictionary> = {
  pt: {
    nav: {
      about: "Resumo",
      projects: "Projetos",
      skills: "Stack",
      education: "Faculdade",
      courses: "Cursos",
      contact: "Contato",
    },
    hero: {
      greetingPrefix: "Olá, me chamo",
      role: "Design, Banco de Dados, Web & Automação",
      summary:
        "Curto transformar ideias em produtos completos: interfaces com identidade visual própria, estrutura de dados sólida por trás, sites que funcionam de verdade no ar, e automações que economizam tempo no dia a dia. Uso cada projeto como desculpa para unir essas quatro frentes.",
      ctaPrimary: "Sobre mim",
      ctaSecondary: "Ver LinkedIn",
      scrollHint: "Descer para ver mais",
      code: [
        'const mateus = {',
        '  foco: [',
        '    "design",',
        '    "banco de dados",',
        '    "web",',
        '    "automação",',
        '  ],',
        '  projetos: 4,',
        '  origem: "turismo",',
        '  status: "construindo",',
        '};',
      ],
    },
    about: {
      eyebrow: "Minha introdução",
      title: "Sobre mim",
      body: "Sou apaixonado por transformar ideias em produtos digitais completos: cuido da identidade visual de um projeto, estruturo o banco de dados que sustenta tudo por trás, construo o site ou sistema que coloca isso no ar, e automatizo tarefas repetitivas para que as coisas simplesmente funcionem. Venho do turismo, onde lidei com operações e prazos sob pressão — uma base que hoje aplico para entender problemas reais antes de sair codando. Atualmente me dedico a projetos de design, desenvolvimento web, modelagem de dados e automação, sempre buscando unir essas quatro frentes em cada entrega.",
      stats: [
        { label: "Projetos no ar", value: "4" },
        { label: "Foco", value: "Design + Dev + Dados" },
        { label: "Localização", value: "São Paulo, BR" },
      ],
      statusLines: [
        "mantendo Fog Roulette, Porão Gráfico, Vistamed e AeroPulse no ar",
        "formado em Análise e Desenvolvimento de Sistemas",
        "vindo do turismo, migrando de vez pra tecnologia",
        "aprofundando banco de dados e automação",
      ],
    },
    projects: {
      eyebrow: "Meu portfólio",
      title: "Projetos em destaque",
      subtitle: "Quatro projetos reais que mostram como uno design, dados, desenvolvimento web e automação em cada entrega.",
      ctaLabel: "Ver projeto",
      categoryLabels: {
        design: "Design",
        database: "Banco de Dados",
        web: "Web",
        automation: "Automação",
      },
      items: [
        {
          title: "Fog Roulette",
          tagline: "Deixe a névoa escolher.",
          description:
            "Um sorteador visual com conta de usuário: o resultado emerge de uma névoa animada que se dissipa aos poucos, criando suspense até revelar a escolha. Construído em Next.js, com Supabase cuidando da autenticação e do histórico de partidas privado de cada jogador. Pensado para quem trava na hora de decidir entre opções, unindo autenticação, persistência de dados e uma interface construída em torno do efeito de revelação.",
          categories: ["web", "database", "automation"],
          stack: ["Next.js", "React", "Supabase", "Autenticação"],
          link: "https://fogroulette.netlify.app",
          image: "/projects/fog-roulette.png",
        },
        {
          title: "Porão Gráfico",
          tagline: "Identidade visual sombria, sob encomenda.",
          description:
            "Plataforma de encomenda de serviços de design gráfico: pôsteres de shows, capas de single/álbum, pacotes promocionais e identidade visual com pegada dark. O cliente filtra por faixa de orçamento e prazo, e escolhe entre Pix, link de cartão ou pagamento na entrega — um fluxo direto para fechar negócio sem fricção.",
          categories: ["design", "web"],
          stack: ["React", "Vite", "Identidade Visual"],
          link: "https://porao-grafico.netlify.app",
          image: "/projects/porao-grafico.png",
        },
        {
          title: "Vistamed",
          tagline: "Proposta de redesign para uma clínica de olhos com 33 anos de história.",
          description:
            "Proposta de redesign conceitual para o Hospital de Olhos Vistamed, criada para uma apresentação interna (não é o site oficial em produção). Reorganiza mais de 30 procedimentos diagnósticos e cirúrgicos por categoria, propõe agendamento direto via WhatsApp sem intermediários burocráticos, e detalha os convênios aceitos nas duas unidades da Grande São Paulo. Design limpo, com listas expansíveis pensadas para leitura rápida em qualquer dispositivo.",
          categories: ["web", "automation"],
          stack: ["HTML", "CSS", "JavaScript", "Integração WhatsApp"],
          link: "https://vistamednovo.netlify.app",
          image: "/projects/vistamed.png",
        },
        {
          title: "AeroPulse",
          tagline: "Inteligência experimental em aviação.",
          description:
            "Plataforma experimental de inteligência em aviação que cruza dados meteorológicos, tráfego aéreo observado e histórico para gerar sinais de atenção e scores explicáveis por aeroporto. Construída em Next.js e TypeScript, com Supabase armazenando o histórico e MapLibre GL renderizando o monitoramento visual dos aeroportos brasileiros em tempo real.",
          categories: ["web", "database", "automation"],
          stack: ["Next.js", "TypeScript", "Supabase", "MapLibre GL"],
          link: "https://aeropulse-eight.vercel.app",
          image: "/projects/aeropulse.png",
        },
      ],
    },
    skills: {
      eyebrow: "Minhas habilidades",
      title: "Minha experiência",
      subtitle: "Quatro frentes que costumo unir em cada projeto: da interface ao banco de dados, passando pelo código e pela automação.",
      groups: [
        {
          label: "Design",
          items: [
            { name: "Identidade Visual", level: "Intermediário" },
            { name: "UI Design", level: "Intermediário" },
            { name: "Tipografia", level: "Básico" },
            { name: "Prototipação", level: "Básico" },
          ],
        },
        {
          label: "Banco de Dados",
          items: [
            { name: "SQL", level: "Intermediário" },
            { name: "Supabase", level: "Intermediário" },
            { name: "Modelagem de Dados", level: "Básico" },
          ],
        },
        {
          label: "Web",
          items: [
            { name: "HTML", level: "Avançado" },
            { name: "CSS", level: "Avançado" },
            { name: "JavaScript", level: "Intermediário" },
            { name: "React / Next.js", level: "Intermediário" },
          ],
        },
        {
          label: "Automação",
          items: [
            { name: "Automação de Processos", level: "Intermediário" },
            { name: "Integrações via WhatsApp", level: "Intermediário" },
            { name: "Scripts & Bots", level: "Básico" },
          ],
        },
      ],
    },
    education: {
      eyebrow: "Formação",
      title: "Formação acadêmica",
      degree: "Análise e Desenvolvimento de Sistemas",
      school: "Impacta Tecnologia",
      period: "fev/2024 - jun/2026",
      status: "Concluído",
    },
    courses: {
      eyebrow: "Certificados",
      title: "Cursos e certificações",
      subtitle: "Formações que sustentam minha base técnica em dados, sistemas e automação.",
      items: [
        "Excel: Domine o Editor de Planilhas - Alura (2024)",
        "Power BI Desktop: construindo meu primeiro dashboard - Alura (2024)",
        "SQLite online: conhecendo instruções SQL - Alura (2024)",
        "Análise e Desenvolvimento de Sistemas - Impacta Tecnologia (fev/2024 - jun/2026)",
      ],
    },
    contact: {
      eyebrow: "Entrar em contato",
      title: "Vamos conversar?",
      body: "Gostou do meu portfólio e quer algo parecido — um site, uma identidade visual ou uma automação — para você ou sua empresa? Entre em contato comigo para montarmos essa ideia juntos, do conceito à entrega.",
      talkToMe: "Fale comigo",
      formTitle: "Para mais informações",
      methods: {
        emailLabel: "Email",
        whatsappLabel: "WhatsApp",
        linkedinLabel: "LinkedIn",
        ctaLabel: "Contato ->",
      },
      form: {
        name: "Nome",
        namePlaceholder: "Insira seu nome",
        email: "Email",
        emailPlaceholder: "Insira seu email",
        subject: "Assunto",
        subjectPlaceholder: "Escreva seu assunto",
        message: "Mensagem",
        messagePlaceholder: "Escreva seu recado",
        submit: "Enviar",
      },
    },
    footer: "Feito por Mateus Fantin.",
  },
  en: {
    nav: {
      about: "Summary",
      projects: "Projects",
      skills: "Stack",
      education: "College",
      courses: "Courses",
      contact: "Contact",
    },
    hero: {
      greetingPrefix: "Hi, my name is",
      role: "Design, Databases, Web & Automation",
      summary:
        "I like turning ideas into complete products: interfaces with their own visual identity, a solid data structure behind them, sites that actually work in production, and automations that save time day to day. I use every project as an excuse to bring these four pieces together.",
      ctaPrimary: "About me",
      ctaSecondary: "View LinkedIn",
      scrollHint: "Scroll down",
      code: [
        'const mateus = {',
        '  focus: [',
        '    "design",',
        '    "database",',
        '    "web",',
        '    "automation",',
        '  ],',
        '  projects: 4,',
        '  background: "tourism",',
        '  status: "building",',
        '};',
      ],
    },
    about: {
      eyebrow: "My introduction",
      title: "About me",
      body: "I'm passionate about turning ideas into complete digital products: shaping a project's visual identity, structuring the database behind it, building the site or system that puts it live, and automating repetitive tasks so things just work. I come from a tourism background, handling operations and deadlines under pressure — a foundation I now apply to understand real problems before writing a line of code. Today I focus on design, web development, data modeling, and automation projects, always looking to bring these four pieces together in every delivery.",
      stats: [
        { label: "Live projects", value: "4" },
        { label: "Focus", value: "Design + Dev + Data" },
        { label: "Location", value: "São Paulo, BR" },
      ],
      statusLines: [
        "keeping Fog Roulette, Porão Gráfico, Vistamed, and AeroPulse live",
        "graduated in Systems Analysis and Development",
        "coming from tourism, moving fully into tech",
        "going deeper into databases and automation",
      ],
    },
    projects: {
      eyebrow: "My portfolio",
      title: "Featured projects",
      subtitle: "Four real projects showing how I bring design, data, web development, and automation together in every delivery.",
      ctaLabel: "View project",
      categoryLabels: {
        design: "Design",
        database: "Database",
        web: "Web",
        automation: "Automation",
      },
      items: [
        {
          title: "Fog Roulette",
          tagline: "Let the fog choose.",
          description:
            "A visual randomizer with user accounts: the result emerges from an animated fog that slowly clears, building suspense before revealing the pick. Built with Next.js, with Supabase handling authentication and each player's private match history. Built for anyone stuck choosing between options, combining authentication, data persistence, and an interface designed around the reveal effect itself.",
          categories: ["web", "database", "automation"],
          stack: ["Next.js", "React", "Supabase", "Authentication"],
          link: "https://fogroulette.netlify.app",
          image: "/projects/fog-roulette.png",
        },
        {
          title: "Porão Gráfico",
          tagline: "Dark visual identity, made to order.",
          description:
            "A graphic-design commission platform: show posters, single/album covers, promo packages, and dark-themed visual identity work. Clients filter by budget tier and timeline, then choose between Pix, a card link, or in-person payment — a direct flow to close a job with no friction.",
          categories: ["design", "web"],
          stack: ["React", "Vite", "Visual Identity"],
          link: "https://porao-grafico.netlify.app",
          image: "/projects/porao-grafico.png",
        },
        {
          title: "Vistamed",
          tagline: "A redesign proposal for an eye clinic with 33 years of history.",
          description:
            "A conceptual redesign proposal for Vistamed Eye Hospital, built for an internal pitch (not the official production site). It reorganizes 30+ diagnostic and surgical procedures by category, proposes direct WhatsApp scheduling with no bureaucratic middleman, and details the insurance plans accepted across its two São Paulo-metro locations. Clean design with expandable lists built for quick reading on any device.",
          categories: ["web", "automation"],
          stack: ["HTML", "CSS", "JavaScript", "WhatsApp Integration"],
          link: "https://vistamednovo.netlify.app",
          image: "/projects/vistamed.png",
        },
        {
          title: "AeroPulse",
          tagline: "Experimental intelligence for aviation.",
          description:
            "An experimental aviation-intelligence platform that cross-references weather data, observed air traffic, and historical records to generate attention signals and explainable scores for Brazilian airports. Built with Next.js and TypeScript, with Supabase storing the historical data and MapLibre GL powering the real-time visual monitoring.",
          categories: ["web", "database", "automation"],
          stack: ["Next.js", "TypeScript", "Supabase", "MapLibre GL"],
          link: "https://aeropulse-eight.vercel.app",
          image: "/projects/aeropulse.png",
        },
      ],
    },
    skills: {
      eyebrow: "My skills",
      title: "My experience",
      subtitle: "Four areas I usually combine on every project: from the interface to the database, through code and automation.",
      groups: [
        {
          label: "Design",
          items: [
            { name: "Visual Identity", level: "Intermediate" },
            { name: "UI Design", level: "Intermediate" },
            { name: "Typography", level: "Basic" },
            { name: "Prototyping", level: "Basic" },
          ],
        },
        {
          label: "Database",
          items: [
            { name: "SQL", level: "Intermediate" },
            { name: "Supabase", level: "Intermediate" },
            { name: "Data Modeling", level: "Basic" },
          ],
        },
        {
          label: "Web",
          items: [
            { name: "HTML", level: "Advanced" },
            { name: "CSS", level: "Advanced" },
            { name: "JavaScript", level: "Intermediate" },
            { name: "React / Next.js", level: "Intermediate" },
          ],
        },
        {
          label: "Automation",
          items: [
            { name: "Process Automation", level: "Intermediate" },
            { name: "WhatsApp Integrations", level: "Intermediate" },
            { name: "Scripts & Bots", level: "Basic" },
          ],
        },
      ],
    },
    education: {
      eyebrow: "Education",
      title: "Academic background",
      degree: "Systems Analysis and Development",
      school: "Impacta Tecnologia",
      period: "Feb/2024 - Jun/2026",
      status: "Completed",
    },
    courses: {
      eyebrow: "Certificates",
      title: "Courses and certifications",
      subtitle: "Learning that supports my technical foundation in data, systems, and automation.",
      items: [
        "Excel: Master the Spreadsheet Editor - Alura (2024)",
        "Power BI Desktop: building my first dashboard - Alura (2024)",
        "SQLite online: learning SQL statements - Alura (2024)",
        "Systems Analysis and Development - Impacta Tecnologia (Feb/2024 - Jun/2026)",
      ],
    },
    contact: {
      eyebrow: "Get in touch",
      title: "Let's connect",
      body: "Did you like my portfolio and want something similar — a site, a visual identity, or an automation — for you or your company? Reach out and we can build this idea together, from concept to delivery.",
      talkToMe: "Talk to me",
      formTitle: "For more information",
      methods: {
        emailLabel: "Email",
        whatsappLabel: "WhatsApp",
        linkedinLabel: "LinkedIn",
        ctaLabel: "Contact ->",
      },
      form: {
        name: "Name",
        namePlaceholder: "Enter your name",
        email: "Email",
        emailPlaceholder: "Enter your email",
        subject: "Subject",
        subjectPlaceholder: "Write your subject",
        message: "Message",
        messagePlaceholder: "Write your message",
        submit: "Send",
      },
    },
    footer: "Built by Mateus Fantin.",
  },
};
