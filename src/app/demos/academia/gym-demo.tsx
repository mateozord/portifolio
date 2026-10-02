"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bike,
  Check,
  ChevronDown,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  MapPin,
  RotateCcw,
  Star,
  Swords,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { WhatsappIcon } from "@/components/brand-icons";
import type { Locale } from "@/content/portfolio-content";
import { useLocale } from "@/lib/locale-store";
import { DemoBar, demoWhatsapp } from "../_components/demo-bar";
import { hm, OpenBadge, useNow, type WeekShifts } from "../_components/open-status";
import { WhatsappPreview } from "../_components/whatsapp-preview";

/*
 * Demonstração: site de uma academia fictícia (Vértice), em pt e en. Fotos
 * reais (Pexels, licença livre) em public/demos/academia. Identidade: preto
 * com verde-limão e tipografia condensada. Seções: hero com selo "Aberto
 * agora", modalidades com foto, estrutura, grade de aulas, quiz "qual plano é
 * pra mim?" (termina numa mensagem de WhatsApp, aqui só a prévia), planos,
 * avaliações ilustrativas, Instagram, perguntas frequentes e mapa.
 */

const LIME = "#c8ff2e";
const photo = (id: string) => `/demos/academia/${id}.webp`;

// Seg a sex 5h–23h, sáb 8h–18h, dom e feriados 8h–13h
const SHIFTS: WeekShifts = [
  [[hm(8), hm(13)]],
  [[hm(5), hm(23)]],
  [[hm(5), hm(23)]],
  [[hm(5), hm(23)]],
  [[hm(5), hm(23)]],
  [[hm(5), hm(23)]],
  [[hm(8), hm(18)]],
];

// Na mesma ordem de COPY[locale].modalities.items
const MODALITIES: { icon: LucideIcon; photo: string }[] = [
  { icon: Dumbbell, photo: "musculacao" },
  { icon: Zap, photo: "funcional" },
  { icon: Bike, photo: "spinning" },
  { icon: Swords, photo: "muaythai" },
  { icon: HeartPulse, photo: "pilates" },
  { icon: Flame, photo: "cross" },
];
const PLAN_PRICES = [99.9, 149.9, 249.9];
const INSTAGRAM = ["cross", "spinning", "muaythai", "musculacao", "pilates", "funcional"];
const COACHES = { F: "Rafa", S: "Lia", P: "Bia", C: "Caio", M: "Duda" } as const;
// Grade: horário + código da aula (F funcional, S spinning, P pilates, C cross, M muay thai)
const SCHEDULE: [string, keyof typeof COACHES][][] = [
  [["06:30", "F"], ["07:30", "S"], ["12:15", "P"], ["18:30", "C"], ["19:30", "F"]],
  [["06:30", "C"], ["12:15", "P"], ["19:00", "M"], ["20:00", "F"]],
  [["06:30", "F"], ["07:30", "S"], ["12:15", "P"], ["18:30", "C"], ["19:30", "S"]],
  [["06:30", "C"], ["12:15", "P"], ["19:00", "M"], ["20:00", "F"]],
  [["06:30", "F"], ["07:30", "S"], ["18:30", "C"]],
  [["09:00", "F"], ["10:00", "M"], ["11:00", "C"]],
];

const COPY = {
  pt: {
    nav: [
      ["Modalidades", "#modalidades"],
      ["Horários", "#horarios"],
      ["Planos", "#planos"],
      ["Localização", "#localizacao"],
    ],
    freeClass: "Aula grátis",
    hero: {
      badge: "Primeira aula grátis · sem taxa de matrícula",
      line1: "Treine no",
      line2: "seu",
      accent: "limite.",
      text: "Musculação, funcional, lutas e aulas coletivas no centro da cidade. Aberto das 5h às 23h para caber na sua rotina.",
      primary: "Agendar aula grátis",
      secondary: "Qual plano é pra mim?",
      rating: "no Google",
    },
    classes: { F: "Funcional", S: "Spinning", P: "Pilates", C: "Cross", M: "Muay Thai" },
    coach: "Prof.",
    modalities: {
      kicker: "Modalidades",
      title: "Escolha seu treino",
      text: "Todas incluídas no plano Completo. Professores no salão em todos os horários.",
      items: [
        ["Musculação", "Área completa com equipamentos novos e professores no salão o dia todo.", "Todos os dias"],
        ["Funcional", "Treinos em grupo de 45 minutos para condicionamento e força.", "Seg a sáb"],
        ["Spinning", "Aulas com música e luz baixa, para queimar calorias sem impacto.", "Seg, qua e sex"],
        ["Muay Thai", "Técnica, condicionamento e defesa pessoal, do iniciante ao avançado.", "Ter, qui e sáb"],
        ["Pilates", "Postura, mobilidade e fortalecimento em turmas pequenas.", "Seg a sex"],
        ["Cross", "Alta intensidade com levantamentos e circuitos cronometrados.", "Seg a sáb"],
      ],
    },
    structure: {
      kicker: "Estrutura",
      title: "Espaço para treinar de verdade",
      stats: [
        ["1.200 m²", "de área de treino"],
        ["80+", "aparelhos e estações"],
        ["24 °C", "climatização o ano todo"],
        ["2", "vestiários com armários"],
      ],
    },
    hours: {
      kicker: "Horários",
      title: "Aberto quando você pode",
      list: [
        ["Segunda a sexta", "5h às 23h"],
        ["Sábado", "8h às 18h"],
        ["Domingo e feriados", "8h às 13h"],
      ],
      grid: "Grade de aulas",
      dayLabel: "Dia da semana",
      days: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    },
    quiz: {
      kicker: "Em 3 perguntas",
      title: "Qual plano é pra mim?",
      step: (n: number, total: number) => `Pergunta ${n} de ${total}`,
      questions: [
        ["Qual é o seu objetivo principal?", ["Emagrecer", "Ganhar massa", "Condicionamento", "Bem-estar"]],
        ["Você quer fazer aulas coletivas?", ["Sim, quero variar", "Só musculação"]],
        ["Vai treinar com alguém?", ["Sozinho", "Com alguém"]],
      ] as [string, string[]][],
      result: "Seu plano ideal",
      why: [
        "Você só quer musculação: o Básico tem tudo o que precisa, com avaliação física e app de treinos.",
        "Você quer variar com aulas coletivas: o Completo inclui todas, além da musculação.",
        "Treinar acompanhado ajuda a manter a rotina: o Duo dá o Completo para duas pessoas.",
      ],
      tips: [
        "Dica: combine Spinning e Funcional 3x por semana.",
        "Dica: foque na musculação e inclua 1 aula de Cross por semana.",
        "Dica: Cross e Funcional são seus maiores aliados.",
        "Dica: comece com Pilates e Spinning, sem pressa.",
      ],
      cta: "Quero esse plano",
      restart: "Refazer",
      message: (plan: string, price: string, goal: string) =>
        `Olá, Vértice! Fiz o quiz no site e o plano indicado foi o ${plan} (${price}/mês). Meu objetivo é: ${goal.toLowerCase()}. Quero agendar minha aula experimental grátis.`,
    },
    plans: {
      kicker: "Planos",
      title: "Sem taxa de matrícula",
      text: "Cancele quando quiser no plano mensal. No anual, você economiza 20%.",
      monthly: "Mensal",
      yearly: "Anual −20%",
      perMonth: "/mês",
      perYear: "por ano",
      noLock: "Sem fidelidade",
      popular: "Mais escolhido",
      cta: "Quero esse plano",
      items: [
        ["Básico", ["Musculação livre", "Avaliação física", "App de treinos"]],
        ["Completo", ["Tudo do Básico", "Todas as aulas coletivas", "1 aula de Pilates por semana", "Leve um amigo 1x por mês"]],
        ["Duo", ["Plano Completo para 2 pessoas", "Mesma conta, dois acessos", "Ideal para casais e amigos"]],
      ] as [string, string[]][],
    },
    reviews: {
      kicker: "Avaliações",
      title: "Quem treina, recomenda",
      note: "Avaliações ilustrativas · negócio fictício",
      summary: "média no Google, com mais de 800 avaliações",
      items: [
        ["Camila R.", "Comecei pelo quiz do site, fiz a aula grátis e fechei o Completo. Os professores corrigem de verdade."],
        ["Diego F.", "Abre às 5h, então treino antes do trabalho. Aparelhos novos e nunca precisei esperar."],
        ["Marina L.", "O Pilates em turma pequena mudou minha postura. Ambiente limpo e todo mundo educado."],
      ],
    },
    instagram: { kicker: "Instagram", handle: "@verticeacademia", text: "Treinos, desafios do mês e a rotina da academia." },
    faq: {
      kicker: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        ["Preciso de exame médico?", "Pedimos um atestado de aptidão física na matrícula. Se ainda não tiver, você faz a aula grátis e entrega depois."],
        ["Tem idade mínima?", "A partir de 14 anos, com autorização dos responsáveis."],
        ["Posso congelar o plano?", "No plano anual, sim: até 30 dias por ano, por viagem ou saúde."],
        ["Posso trazer meu personal?", "Sim, personal trainers credenciados podem atender na academia."],
        ["Tem estacionamento?", "Temos convênio com o estacionamento ao lado, com 2 horas grátis para alunos."],
      ],
    },
    location: {
      kicker: "Localização",
      title: "Fácil de chegar",
      address: ["Rua Exemplo, 123 · Centro", "São Paulo · SP"],
      note: "Estacionamento conveniado e a 5 minutos do metrô.",
      cta: "Chamar no WhatsApp",
      map: "Mapa da localização",
    },
    footer: { hours: "Seg a sex 5h–23h · Sáb 8h–18h · Dom 8h–13h", credit: "Site demonstrativo por", photos: "Fotos: Pexels" },
    whatsapp: "Falar no WhatsApp",
  },
  en: {
    nav: [
      ["Classes", "#modalidades"],
      ["Hours", "#horarios"],
      ["Plans", "#planos"],
      ["Location", "#localizacao"],
    ],
    freeClass: "Free class",
    hero: {
      badge: "First class free · no sign-up fee",
      line1: "Train at",
      line2: "your",
      accent: "limit.",
      text: "Strength training, functional, martial arts and group classes downtown. Open 5am to 11pm to fit your routine.",
      primary: "Book a free class",
      secondary: "Which plan fits me?",
      rating: "on Google",
    },
    classes: { F: "Functional", S: "Spinning", P: "Pilates", C: "Cross", M: "Muay Thai" },
    coach: "Coach",
    modalities: {
      kicker: "Classes",
      title: "Pick your workout",
      text: "All included in the Complete plan. Coaches on the floor at all hours.",
      items: [
        ["Strength", "A full weights area with new equipment and coaches on the floor all day.", "Every day"],
        ["Functional", "45-minute group workouts for conditioning and strength.", "Mon to Sat"],
        ["Spinning", "Classes with music and low lights to burn calories without impact.", "Mon, Wed and Fri"],
        ["Muay Thai", "Technique, conditioning and self-defense, from beginner to advanced.", "Tue, Thu and Sat"],
        ["Pilates", "Posture, mobility and strength in small groups.", "Mon to Fri"],
        ["Cross", "High intensity with lifts and timed circuits.", "Mon to Sat"],
      ],
    },
    structure: {
      kicker: "Facilities",
      title: "Room to really train",
      stats: [
        ["1,200 m²", "of training space"],
        ["80+", "machines and stations"],
        ["24 °C", "air-conditioned all year"],
        ["2", "locker rooms"],
      ],
    },
    hours: {
      kicker: "Hours",
      title: "Open when you can",
      list: [
        ["Monday to Friday", "5am to 11pm"],
        ["Saturday", "8am to 6pm"],
        ["Sundays and holidays", "8am to 1pm"],
      ],
      grid: "Class schedule",
      dayLabel: "Day of the week",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    quiz: {
      kicker: "In 3 questions",
      title: "Which plan fits me?",
      step: (n: number, total: number) => `Question ${n} of ${total}`,
      questions: [
        ["What's your main goal?", ["Lose weight", "Build muscle", "Conditioning", "Well-being"]],
        ["Do you want group classes?", ["Yes, I like variety", "Just strength training"]],
        ["Will you train with someone?", ["On my own", "With someone"]],
      ] as [string, string[]][],
      result: "Your ideal plan",
      why: [
        "You only want strength training: Basic has everything you need, plus a fitness assessment and workout app.",
        "You want variety with group classes: Complete includes all of them, plus strength training.",
        "Training with someone helps you stay consistent: Duo gives Complete to two people.",
      ],
      tips: [
        "Tip: combine Spinning and Functional 3x a week.",
        "Tip: focus on strength and add 1 Cross class a week.",
        "Tip: Cross and Functional are your best friends.",
        "Tip: start with Pilates and Spinning, no rush.",
      ],
      cta: "I want this plan",
      restart: "Start over",
      message: (plan: string, price: string, goal: string) =>
        `Hi, Vértice! I took the quiz on your site and got the ${plan} plan (${price}/mo). My goal: ${goal.toLowerCase()}. I'd like to book my free trial class.`,
    },
    plans: {
      kicker: "Plans",
      title: "No sign-up fee",
      text: "Cancel anytime on the monthly plan. Save 20% with the yearly plan.",
      monthly: "Monthly",
      yearly: "Yearly −20%",
      perMonth: "/mo",
      perYear: "per year",
      noLock: "No commitment",
      popular: "Most popular",
      cta: "I want this plan",
      items: [
        ["Basic", ["Open strength training", "Fitness assessment", "Workout app"]],
        ["Complete", ["Everything in Basic", "All group classes", "1 Pilates class per week", "Bring a friend once a month"]],
        ["Duo", ["Complete plan for 2 people", "One account, two passes", "Great for couples and friends"]],
      ] as [string, string[]][],
    },
    reviews: {
      kicker: "Reviews",
      title: "Members recommend it",
      note: "Illustrative reviews · fictional business",
      summary: "average on Google, from over 800 reviews",
      items: [
        ["Camila R.", "I started with the quiz on the site, took the free class and signed up for Complete. The coaches really correct your form."],
        ["Diego F.", "It opens at 5am, so I train before work. New equipment and I never have to wait."],
        ["Marina L.", "Small-group Pilates fixed my posture. Clean place and friendly people."],
      ],
    },
    instagram: { kicker: "Instagram", handle: "@verticeacademia", text: "Workouts, monthly challenges and life at the gym." },
    faq: {
      kicker: "Questions",
      title: "Frequently asked",
      items: [
        ["Do I need a medical certificate?", "We ask for a fitness certificate at sign-up. If you don't have one yet, take the free class and bring it later."],
        ["Is there a minimum age?", "From 14 years old, with a guardian's consent."],
        ["Can I pause my plan?", "On the yearly plan, yes: up to 30 days a year, for travel or health."],
        ["Can I bring my personal trainer?", "Yes, accredited personal trainers can coach at the gym."],
        ["Is there parking?", "We partner with the lot next door: 2 free hours for members."],
      ],
    },
    location: {
      kicker: "Location",
      title: "Easy to get to",
      address: ["123 Example Street · Downtown", "São Paulo · SP"],
      note: "Partner parking and 5 minutes from the subway.",
      cta: "Message us on WhatsApp",
      map: "Location map",
    },
    footer: { hours: "Mon–Fri 5am–11pm · Sat 8am–6pm · Sun 8am–1pm", credit: "Demo website by", photos: "Photos: Pexels" },
    whatsapp: "Chat on WhatsApp",
  },
};
type Copy = (typeof COPY)["pt"];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

export function GymDemo() {
  const locale = useLocale();
  const t = COPY[locale];
  const now = useNow();
  const whatsapp = demoWhatsapp("academia", locale);
  const money = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-[#0b0b0c] font-sans text-white antialiased selection:bg-[#c8ff2e] selection:text-black">
      <DemoBar kind="academia" />
      <Header t={t} whatsapp={whatsapp} />
      <main>
        <Hero t={t} whatsapp={whatsapp} now={now} locale={locale} />
        <Ticker t={t} />
        <Modalities t={t} />
        <Structure t={t} />
        <Schedule t={t} />
        <Quiz t={t} money={money} locale={locale} />
        <Plans t={t} whatsapp={whatsapp} money={money} />
        <Reviews t={t} />
        <Instagram t={t} />
        <Faq t={t} />
        <Location t={t} whatsapp={whatsapp} now={now} locale={locale} />
      </main>
      <Footer t={t} />
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.whatsapp}
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid h-14 w-14 place-items-center rounded-full text-black shadow-[0_12px_30px_-8px_rgb(200_255_46/0.6)] transition-transform hover:scale-105"
        style={{ background: LIME }}
      >
        <WhatsappIcon className="h-7 w-7" />
      </a>
    </div>
  );
}

function Display({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-[family-name:var(--font-anton)] tracking-tight uppercase ${className}`}>{children}</span>;
}

function Logo() {
  return (
    <a href="#inicio" className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path d="M16 3 30 29H2Z" fill={LIME} />
        <path d="M16 13 23 26H9Z" fill="#0b0b0c" />
      </svg>
      <Display className="text-2xl">Vértice</Display>
    </a>
  );
}

function Header({ t, whatsapp }: { t: Copy; whatsapp: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0c]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />
        <nav className="hidden gap-7 text-sm text-white/70 md:flex">
          {t.nav.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 text-sm font-bold text-black" style={{ background: LIME }}>
          {t.freeClass}
        </a>
      </div>
    </header>
  );
}

function Hero({ t, whatsapp, now, locale }: { t: Copy; whatsapp: string; now: Date | null; locale: Locale }) {
  const hero = t.hero;
  return (
    <section id="inicio" className="relative flex min-h-[88svh] items-end overflow-hidden">
      <Image src={photo("hero-anilha")} alt="" fill preload sizes="100vw" className="object-cover object-[60%_35%] grayscale-[0.25]" />
      {/* Escurece à esquerda e embaixo para o texto; brilho verde no canto */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0b0c_0%,rgb(11_11_12/0.82)_40%,rgb(11_11_12/0.25)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#0b0b0c_4%,transparent_45%)]" />
      <div className="absolute -right-32 -bottom-32 h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ background: "rgb(200 255 46 / 0.14)" }} />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-20 pb-16 sm:px-6 md:pb-24">
        <motion.div {...fadeUp} className="flex flex-wrap items-center gap-2">
          <OpenBadge now={now} shifts={SHIFTS} locale={locale} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:text-sm">
            <Star className="h-3.5 w-3.5 fill-[#f5b301] text-[#f5b301]" />
            4,9 {hero.rating}
          </span>
        </motion.div>
        <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-6 leading-[0.92]">
          <Display className="block text-[17vw] sm:text-8xl lg:text-[7.5rem]">{hero.line1}</Display>
          <Display className="block text-[17vw] sm:text-8xl lg:text-[7.5rem]">
            {hero.line2} <span style={{ color: LIME }}>{hero.accent}</span>
          </Display>
        </motion.h1>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 max-w-md text-lg text-white/80">
          {hero.text}
        </motion.p>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-9 flex flex-wrap gap-3">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black" style={{ background: LIME }}>
            <WhatsappIcon className="h-5 w-5" />
            {hero.primary}
          </a>
          <a href="#quiz" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-6 py-3.5 font-semibold backdrop-blur hover:bg-white/10">
            {hero.secondary}
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="mt-8 inline-flex items-center gap-2 text-sm text-white/70">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME }} />
          {hero.badge}
        </motion.p>
      </div>
    </section>
  );
}

function Ticker({ t }: { t: Copy }) {
  const items = t.modalities.items.map(([name]) => name);
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-3 text-black" style={{ background: LIME }}>
      <div className="flex w-max animate-[gym-ticker_24s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
            {row.map((item, i) => (
              <Display key={i} className="px-6 text-2xl">
                {item} <span className="pl-6">✦</span>
              </Display>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes gym-ticker { to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <motion.div {...fadeUp} className="max-w-2xl">
      <p className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: LIME }}>
        {kicker}
      </p>
      <h2 className="mt-3">
        <Display className="text-5xl sm:text-6xl">{title}</Display>
      </h2>
      {text && <p className="mt-4 text-white/65">{text}</p>}
    </motion.div>
  );
}

function Modalities({ t }: { t: Copy }) {
  const section = t.modalities;
  return (
    <section id="modalidades" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionTitle kicker={section.kicker} title={section.title} text={section.text} />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map(([name, text, when], i) => {
          const { icon: Icon, photo: id } = MODALITIES[i];
          return (
            <motion.article
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-[#c8ff2e]/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={photo(id)} alt={name} fill sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" className="object-cover grayscale-[0.3] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0c] via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-xl text-black" style={{ background: LIME }}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="p-6 pt-4">
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/65">{text}</p>
                <p className="mt-4 text-sm font-semibold" style={{ color: LIME }}>
                  {when}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

/** Faixa da estrutura: foto em tela cheia andando mais devagar que a página. */
function Structure({ t }: { t: Copy }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const s = t.structure;
  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y }}>
        <Image src={photo("estrutura")} alt="" fill sizes="100vw" className="object-cover grayscale-[0.4]" />
      </motion.div>
      <div className="absolute inset-0 bg-[rgb(11_11_12/0.72)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6 md:py-36">
        <SectionTitle kicker={s.kicker} title={s.title} />
        <dl className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {s.stats.map(([value, label], i) => (
            <motion.div key={label} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="border-l-2 pl-4" style={{ borderColor: LIME }}>
              <dt className="sr-only">{label}</dt>
              <dd>
                <Display className="block text-4xl sm:text-5xl">{value}</Display>
                <span className="text-sm text-white/65">{label}</span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Schedule({ t }: { t: Copy }) {
  const [day, setDay] = useState(0);
  const hours = t.hours;
  return (
    <section id="horarios" className="scroll-mt-20 border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionTitle kicker={hours.kicker} title={hours.title} />
          <ul className="mt-10 space-y-3">
            {hours.list.map(([label, time]) => (
              <li key={label} className="flex items-center justify-between rounded-xl border border-white/10 px-5 py-4">
                <span className="flex items-center gap-3 text-white/80">
                  <Clock className="h-4 w-4" style={{ color: LIME }} />
                  {label}
                </span>
                <span className="font-bold">{time}</span>
              </li>
            ))}
          </ul>
          <motion.div {...fadeUp} className="relative mt-6 hidden aspect-[16/9] overflow-hidden rounded-2xl lg:block">
            <Image src={photo("esteiras")} alt="" fill sizes="28rem" className="object-cover grayscale-[0.3]" />
          </motion.div>
        </div>

        <motion.div {...fadeUp} className="self-start rounded-2xl border border-white/10 bg-[#111113] p-5 sm:p-7">
          <h3 className="text-lg font-bold">{hours.grid}</h3>
          <div role="tablist" aria-label={hours.dayLabel} className="mt-5 grid grid-cols-6 gap-1.5 rounded-xl bg-white/5 p-1.5">
            {hours.days.map((label, i) => (
              <button
                key={label}
                role="tab"
                aria-selected={day === i}
                onClick={() => setDay(i)}
                className={`rounded-lg py-2 text-sm font-semibold transition-colors ${day === i ? "text-black" : "text-white/60 hover:text-white"}`}
                style={day === i ? { background: LIME } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
          <ul key={day} className="mt-5 divide-y divide-white/10">
            {SCHEDULE[day].map(([time, code], i) => (
              <motion.li
                key={time + code}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 py-3.5"
              >
                <span className="w-14 font-[family-name:var(--font-anton)] text-xl">{time}</span>
                <span className="flex-1 font-semibold">{t.classes[code]}</span>
                <span className="text-sm text-white/55">
                  {t.coach} {COACHES[code]}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Quiz "qual plano é pra mim?": 3 perguntas, uma por vez, com barra de
 * progresso. O resultado explica a escolha e leva ao WhatsApp com a mensagem
 * pronta (aqui, a prévia).
 */
function Quiz({ t, money, locale }: { t: Copy; money: Intl.NumberFormat; locale: Locale }) {
  const q = t.quiz;
  const [answers, setAnswers] = useState<number[]>([]);
  const [preview, setPreview] = useState(false);
  const close = useCallback(() => setPreview(false), []);
  const step = answers.length;
  const done = step >= q.questions.length;

  // Com alguém → Duo; quer aulas → Completo; só musculação → Básico
  const plan = done ? (answers[2] === 1 ? 2 : answers[1] === 0 ? 1 : 0) : 0;
  const [planName] = t.plans.items[plan];
  const price = money.format(PLAN_PRICES[plan]);
  const goal = done ? q.questions[0][1][answers[0]] : "";

  return (
    <section id="quiz" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="grid overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-56 lg:min-h-full">
          <Image src={photo("funcional")} alt="" fill sizes="(min-width: 1024px) 28rem, 100vw" className="object-cover grayscale-[0.3]" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0c] via-[#0b0b0c]/40 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-[#111113]" />
        </div>
        <div className="bg-[#111113] p-7 sm:p-10">
          <SectionTitle kicker={q.kicker} title={q.title} />
          <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full" style={{ background: LIME }} animate={{ width: `${(step / q.questions.length) * 100}%` }} />
          </div>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="mt-7">
                <p className="text-sm text-white/50">{q.step(step + 1, q.questions.length)}</p>
                <h3 className="mt-2 text-2xl font-bold">{q.questions[step][0]}</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {q.questions[step][1].map((option, i) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswers((a) => [...a, i])}
                      className="rounded-xl border border-white/15 px-5 py-4 text-left font-semibold transition-colors hover:border-[#c8ff2e] hover:bg-[#c8ff2e]/10"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="mt-7">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: LIME }}>
                  {q.result}
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-4">
                  <Display className="text-6xl">{planName}</Display>
                  <span className="text-2xl font-black">
                    {price}
                    <span className="text-base font-normal text-white/55">{t.plans.perMonth}</span>
                  </span>
                </div>
                <p className="mt-4 text-white/75">{q.why[plan]}</p>
                <p className="mt-2 text-white/55">{q.tips[answers[0]]}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setPreview(true)} className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black" style={{ background: LIME }}>
                    <WhatsappIcon className="h-5 w-5" />
                    {q.cta}
                  </button>
                  <button type="button" onClick={() => setAnswers([])} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/5">
                    <RotateCcw className="h-4 w-4" />
                    {q.restart}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <WhatsappPreview open={preview} onClose={close} message={q.message(planName, price, goal)} kind="academia" locale={locale} />
    </section>
  );
}

function Plans({ t, whatsapp, money }: { t: Copy; whatsapp: string; money: Intl.NumberFormat }) {
  const [yearly, setYearly] = useState(false);
  const plans = t.plans;
  return (
    <section id="planos" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionTitle kicker={plans.kicker} title={plans.title} text={plans.text} />
        <div className="inline-flex self-start rounded-full border border-white/15 p-1 text-sm font-semibold md:self-auto">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              onClick={() => setYearly(value)}
              aria-pressed={yearly === value}
              className={`rounded-full px-4 py-2 transition-colors ${yearly === value ? "text-black" : "text-white/65"}`}
              style={yearly === value ? { background: LIME } : undefined}
            >
              {value ? plans.yearly : plans.monthly}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.items.map(([name, perks], i) => {
          const highlight = i === 1;
          const price = yearly ? PLAN_PRICES[i] * 0.8 : PLAN_PRICES[i];
          return (
            <motion.article
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-2xl border p-7 ${highlight ? "border-transparent text-black" : "border-white/10 bg-white/[0.03]"}`}
              style={highlight ? { background: LIME } : undefined}
            >
              {highlight && <span className="absolute -top-3 left-7 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">{plans.popular}</span>}
              <Display className="text-3xl">{name}</Display>
              <p className="mt-5">
                <span className="text-4xl font-black tracking-tight">{money.format(price)}</span>
                <span className={highlight ? "text-black/60" : "text-white/55"}>{plans.perMonth}</span>
              </p>
              <p className={`mt-1 text-sm ${highlight ? "text-black/60" : "text-white/45"}`}>
                {yearly ? `${money.format(price * 12)} ${plans.perYear}` : plans.noLock}
              </p>
              <ul className="mt-6 space-y-2.5">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={highlight ? undefined : { color: LIME }} />
                    {perk}
                  </li>
                ))}
              </ul>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full py-3 font-bold md:mt-auto ${highlight ? "bg-black text-white" : "border border-white/20 hover:bg-white/5"}`}
              >
                {plans.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#f5b301] text-[#f5b301]" />
      ))}
    </span>
  );
}

function Reviews({ t }: { t: Copy }) {
  const r = t.reviews;
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionTitle kicker={r.kicker} title={r.title} />
          <motion.div {...fadeUp} className="flex items-center gap-4">
            <Display className="text-7xl">
              <span style={{ color: LIME }}>4,9</span>
            </Display>
            <div>
              <Stars />
              <p className="mt-1 max-w-[14rem] text-sm text-white/60">{r.summary}</p>
            </div>
          </motion.div>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {r.items.map(([name, text], i) => (
            <motion.li key={name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="flex flex-col rounded-2xl border border-white/10 bg-[#111113] p-6">
              <Stars />
              <p className="mt-4 flex-1 leading-relaxed text-white/80">“{text}”</p>
              <p className="mt-5 flex items-center gap-3 text-sm font-semibold">
                <span className="grid h-9 w-9 place-items-center rounded-full font-black text-black" style={{ background: LIME }}>
                  {name[0]}
                </span>
                {name}
              </p>
            </motion.li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-white/40">{r.note}</p>
      </div>
    </section>
  );
}

function Instagram({ t }: { t: Copy }) {
  const ig = t.instagram;
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: LIME }}>
            {ig.kicker}
          </p>
          <Display className="mt-2 block text-4xl">{ig.handle}</Display>
        </div>
        <p className="text-white/60">{ig.text}</p>
      </motion.div>
      <ul className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {INSTAGRAM.map((id, i) => (
          <motion.li
            key={id}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image src={photo(id)} alt="" fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover grayscale-[0.4] transition duration-700 group-hover:scale-110 group-hover:grayscale-0" />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Faq({ t }: { t: Copy }) {
  const [open, setOpen] = useState<number | null>(0);
  const faq = t.faq;
  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <SectionTitle kicker={faq.kicker} title={faq.title} />
      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {faq.items.map(([question, answer], i) => {
          const isOpen = open === i;
          return (
            <li key={question}>
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold">
                {question}
                <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} style={{ color: LIME }} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 leading-relaxed text-white/65">{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Location({ t, whatsapp, now, locale }: { t: Copy; whatsapp: string; now: Date | null; locale: Locale }) {
  const location = t.location;
  return (
    <section id="localizacao" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
      <div className="grid overflow-hidden rounded-2xl border border-white/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#111113] p-7 sm:p-10">
          <SectionTitle kicker={location.kicker} title={location.title} />
          <div className="mt-6">
            <OpenBadge now={now} shifts={SHIFTS} locale={locale} className="bg-white/5" />
          </div>
          <p className="mt-6 flex items-start gap-3 text-white/80">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: LIME }} />
            <span>
              {location.address[0]}
              <br />
              {location.address[1]}
            </span>
          </p>
          <p className="mt-4 text-sm text-white/55">{location.note}</p>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black" style={{ background: LIME }}>
            <WhatsappIcon className="h-5 w-5" />
            {location.cta}
          </a>
        </div>
        <iframe
          title={location.map}
          src="https://www.google.com/maps?q=Pra%C3%A7a+da+S%C3%A9,+S%C3%A3o+Paulo&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border-0 grayscale-[0.6] invert-[0.92] hue-rotate-180 lg:h-full lg:min-h-96"
        />
      </div>
    </section>
  );
}

function Footer({ t }: { t: Copy }) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p>{t.footer.hours}</p>
        <p>
          {t.footer.credit}{" "}
          <Link href="/" className="font-semibold text-white hover:underline">
            Mateus Fantin
          </Link>{" "}
          · {t.footer.photos}
        </p>
      </div>
    </footer>
  );
}
