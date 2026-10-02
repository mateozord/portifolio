// Textos próprios da versão ukiyo-e. O resto (projetos, sobre, processo,
// formulário...) vem de src/content/portfolio-content.ts, o mesmo do site principal.

export const KANJI = {
  hero: "波", // nami: onda
  services: "技", // waza: técnica
  projects: "作品", // sakuhin: obras
  about: "人", // hito: pessoa
  process: "流れ", // nagare: fluxo
  contact: "便り", // tayori: carta, notícia
  tools: "道具", // dōgu: ferramentas
  numbers: ["一", "二", "三", "四", "五", "六", "七"],
  categories: { web: "網", database: "数", automation: "機", design: "画" },
};

export const ukiyoCopy = {
  pt: {
    theme: { day: "Dia", night: "Noite", toDay: "Mudar para o dia", toNight: "Mudar para a noite" },
    hero: {
      label: "Portfólio",
      lead: "Sites, sistemas e automações que fluem como a maré.",
      body: "Uno design, banco de dados, código e automação com a paciência de uma gravura japonesa: cada camada no lugar certo, do primeiro traço ao site no ar.",
      cartouche: "波と共に",
      scroll: "Role para a onda quebrar",
    },
    tools: "Ferramentas do dia a dia",
    services: {
      eyebrow: "Serviços",
      title: "Ofício feito à mão, *camada por camada*",
    },
    projects: {
      eyebrow: "Projetos",
      title: "Gravuras que *ganharam vida*",
      subtitle:
        "Cada projeto é uma prancha: um problema real, resolvido com design, dados e código. Clique em qualquer um para ver os detalhes.",
    },
    about: { eyebrow: "Sobre" },
    process: {
      eyebrow: "Processo",
      title: "Como a água: *sem pressa e sem parar*",
    },
    contact: {
      eyebrow: "Contato",
      title: "Jogue uma pedra no lago: *vamos conversar*",
      pondHint: "Os koi vêm ver quem chegou. Passe o cursor sobre o lago e clique para alimentá-los.",
    },
    footer: {
      tagline: "Feito com calma, ondas e código.",
      classic: "Ver a versão clássica",
      credits: "Gravura: A Grande Onda de Kanagawa, Katsushika Hokusai (c. 1831), domínio público.",
    },
  },
  en: {
    theme: { day: "Day", night: "Night", toDay: "Switch to day", toNight: "Switch to night" },
    hero: {
      label: "Portfolio",
      lead: "Websites, systems and automations that flow like the tide.",
      body: "I bring design, databases, code and automation together with the patience of a Japanese woodblock print: every layer in its place, from the first stroke to a live site.",
      cartouche: "波と共に",
      scroll: "Scroll to break the wave",
    },
    tools: "Tools I use every day",
    services: {
      eyebrow: "Services",
      title: "Handcrafted work, *layer by layer*",
    },
    projects: {
      eyebrow: "Projects",
      title: "Prints that *came to life*",
      subtitle:
        "Every project is a print: a real problem, solved with design, data and code. Click any of them to see the details.",
    },
    about: { eyebrow: "About" },
    process: {
      eyebrow: "Process",
      title: "Like water: *unhurried, unstopping*",
    },
    contact: {
      eyebrow: "Contact",
      title: "Toss a pebble in the pond: *let's talk*",
      pondHint: "The koi come to see who's there. Move your cursor over the pond and click to feed them.",
    },
    footer: {
      tagline: "Made with patience, waves and code.",
      classic: "See the classic version",
      credits: "Print: The Great Wave off Kanagawa, Katsushika Hokusai (c. 1831), public domain.",
    },
  },
};
