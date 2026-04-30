export type Locale = "pt" | "en";

export type Project = {
  title: string;
  description: string;
  stack: string[];
  link?: string;
  image?: string;
};

export type PortfolioDictionary = {
  nav: {
    about: string;
    projects: string;
    skills: string;
    education: string;
    courses: string;
    goals: string;
    contact: string;
  };
  hero: {
    greeting: string;
    role: string;
    summary: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    title: string;
    body: string;
  };
  projects: {
    title: string;
    subtitle: string;
    items: Project[];
  };
  skills: {
    title: string;
    subtitle: string;
    groups: { label: string; items: string[] }[];
  };
  education: {
    title: string;
    degree: string;
    school: string;
    period: string;
    status: string;
  };
  courses: {
    title: string;
    subtitle: string;
    items: string[];
  };
  goals: {
    title: string;
    body: string;
  };
  contact: {
    title: string;
    body: string;
    emailLabel: string;
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
      goals: "Objetivo",
      contact: "Contato",
    },
    hero: {
      greeting: "Oi, eu sou Mateus Fantin",
      role: "Analista de Negociação Produto Jr. | CVC Corp",
      summary:
        "Atuo com negociação e gestão de produtos aéreos para grupos, com foco em cotações, prazos, disponibilidade e suporte às filiais para garantir operações mais fluidas. Meu próximo passo de carreira está direcionado para análise de dados aplicada ao negócio.",
      ctaPrimary: "Falar comigo",
      ctaSecondary: "Ver LinkedIn",
    },
    about: {
      title: "Resumo profissional",
      body: "Atuo no turismo com foco em operações aéreas e negociação de produtos para grupos, com experiência em atendimento, pós-venda, back office e fretamento. Hoje trabalho com cotação de tarifas, controle de prazos e disponibilidade de lugares, além de suporte às filiais em todo o Brasil. Tenho vivência em processos críticos, como alterações de voos, termos de aceite e ajustes de reservas, sempre com foco em clareza, agilidade e eficiência operacional. Ao longo da minha trajetória, desenvolvi comunicação, organização e tomada de decisão sob pressão, com domínio de sistemas GDS como Sabre, Amadeus, Latam e Gol. Em paralelo, venho fortalecendo meu foco em análise de dados para transformar indicadores operacionais em decisões mais estratégicas.",
    },
    projects: {
      title: "Projetos em destaque",
      subtitle: "Projetos que mostram minha visão entre operação, análise de dados e tecnologia.",
      items: [
        {
          title: "Dashboard de Performance Operacional",
          description:
            "Dashboard com dados reais do meu setor anterior para monitorar produtividade, metas e distribuição por tipo de protocolo. Apenas dois meses não possuem dados por indisponibilidade da base.",
          stack: ["HTML", "CSS", "JavaScript", "Análise de Processos"],
          link: "https://dashboardmateus.netlify.app",
          image: "/projects/dashboard-operacional.svg",
        },
      ],
    },
    skills: {
      title: "Sistemas e tecnologias",
      subtitle: "Competências do meu dia a dia em operação e ferramentas que estou desenvolvendo com foco em análise de dados.",
      groups: [
        {
          label: "Sistemas e experiências",
          items: [
            "Sabre - Básico",
            "Amadeus - Básico",
            "Latam - Intermediário",
            "Gol - Intermediário",
            "HTML - Intermediário",
            "CSS - Intermediário",
            "JavaScript - Básico",
          ],
        },
        { label: "Ferramentas (em desenvolvimento)", items: ["Excel - Intermediário", "Power BI - Básico", "SQL - Básico"] },
        { label: "Processos", items: ["Negociação", "Gestão de prazos", "Pós-venda", "Atendimento estratégico"] },
      ],
    },
    education: {
      title: "Formação acadêmica",
      degree: "Análise e Desenvolvimento de Sistemas",
      school: "Impacta Tecnologia",
      period: "fev/2024 - jun/2026",
      status: "Cursando",
    },
    courses: {
      title: "Cursos e certificações",
      subtitle: "Formações relevantes para análise de dados e melhoria operacional.",
      items: [
        "Excel: Domine o Editor de Planilhas - Alura (2024)",
        "Power BI Desktop: construindo meu primeiro dashboard - Alura (2024)",
        "SQLite online: conhecendo instruções SQL - Alura (2024)",
        "Análise e Desenvolvimento de Sistemas - Impacta Tecnologia (fev/2024 - jun/2026)",
      ],
    },
    goals: {
      title: "Objetivo profissional",
      body: "Crescer na area de negociacao e operacoes no turismo, contribuindo para processos mais eficientes, melhor atendimento e melhores resultados para o negocio.",
    },
    contact: {
      title: "Vamos conversar?",
      body: "Gostou do meu portfólio e quer algo parecido para você ou para sua empresa? Entre em contato comigo para montarmos essa ideia juntos, do visual ao conteúdo.",
      emailLabel: "Enviar email",
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
      goals: "Goals",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I am Mateus Fantin",
      role: "Junior Product Negotiation Analyst | CVC Corp",
      summary:
        "I work with airline product negotiation and group operations, focused on quotations, deadlines, seat availability, and branch support to keep operations running smoothly. My next career step is strongly focused on business-oriented data analysis.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "View LinkedIn",
    },
    about: {
      title: "Professional summary",
      body: "I work in tourism with a focus on air operations and product management, with experience across customer service, post-sales, back office, and group charter operations. I currently manage fare quotes, deadlines, and seat availability while supporting branches across Brazil. I also handle critical workflows such as flight changes, agreement terms, and reservation adjustments, always prioritizing clarity, speed, and operational efficiency. Along this path, I have built strong communication, organization, and decision-making skills under pressure, with hands-on experience in GDS systems such as Sabre, Amadeus, Latam, and Gol. In parallel, I am strengthening my focus on data analysis to turn operational indicators into more strategic decisions.",
    },
    projects: {
      title: "Featured projects",
      subtitle: "Projects that reflect my approach to operations, data analysis, and technology.",
      items: [
        {
          title: "Operational Performance Dashboard",
          description:
            "Dashboard built with real data from my previous sector to monitor productivity, targets, and protocol distribution. Two months are missing due to source data unavailability.",
          stack: ["HTML", "CSS", "JavaScript", "Process Analysis"],
          link: "https://dashboardmateus.netlify.app",
          image: "/projects/dashboard-operacional.svg",
        },
      ],
    },
    skills: {
      title: "Systems and technologies",
      subtitle: "Operational strengths and tools I am currently developing with a data-analysis focus.",
      groups: [
        {
          label: "Systems and experience",
          items: [
            "Sabre - Basic",
            "Amadeus - Basic",
            "Latam - Intermediate",
            "Gol - Intermediate",
            "HTML - Intermediate",
            "CSS - Intermediate",
            "JavaScript - Basic",
          ],
        },
        { label: "Tools (learning path)", items: ["Excel - Intermediate", "Power BI - Basic", "SQL - Basic"] },
        { label: "Processes", items: ["Negotiation", "Deadline management", "Post-sales", "Strategic support"] },
      ],
    },
    education: {
      title: "Academic background",
      degree: "Systems Analysis and Development",
      school: "Impacta Tecnologia",
      period: "Feb/2024 - Jun/2026",
      status: "In progress",
    },
    courses: {
      title: "Courses and certifications",
      subtitle: "Key learning focused on data analysis and operational improvement.",
      items: [
        "Excel: Master the Spreadsheet Editor - Alura (2024)",
        "Power BI Desktop: building my first dashboard - Alura (2024)",
        "SQLite online: learning SQL statements - Alura (2024)",
        "Systems Analysis and Development - Impacta Tecnologia (Feb/2024 - Jun/2026)",
      ],
    },
    goals: {
      title: "Professional goal",
      body: "To grow in negotiation and tourism operations, helping deliver more efficient processes, better customer service, and stronger business outcomes.",
    },
    contact: {
      title: "Let's connect",
      body: "Did you like my portfolio and want something similar for you or your company? Reach out and we can build this idea together, from visual direction to content.",
      emailLabel: "Send email",
    },
    footer: "Built by Mateus Fantin.",
  },
};
