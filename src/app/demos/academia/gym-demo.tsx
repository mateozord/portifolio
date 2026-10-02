"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  Check,
  Clock,
  Dumbbell,
  Flame,
  HeartPulse,
  MapPin,
  Swords,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { WhatsappIcon } from "@/components/brand-icons";
import { useLocale } from "@/lib/locale-store";
import { DemoBar, demoWhatsapp } from "../_components/demo-bar";

/*
 * Demonstração: landing page de uma academia fictícia (Vértice), em pt e en.
 * Entrega o plano "Landing page" do portfólio: modalidades, horários, planos,
 * mapa e WhatsApp. Sem fotos: a identidade vem da tipografia condensada, do
 * preto com verde-limão e de uma "anilha" geométrica girando no hero.
 */

const LIME = "#c8ff2e";

// Ícones na mesma ordem de COPY[locale].modalities.items
const MODALITY_ICONS: LucideIcon[] = [Dumbbell, Zap, Bike, Swords, HeartPulse, Flame];
const PLAN_PRICES = [99.9, 149.9, 249.9];
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
      secondary: "Ver planos",
      stats: [
        ["5h–23h", "aberto"],
        ["6", "modalidades"],
        ["1ª aula", "grátis"],
      ],
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
    location: {
      kicker: "Localização",
      title: "Fácil de chegar",
      address: ["Rua Exemplo, 123 · Centro", "São Paulo · SP"],
      note: "Estacionamento conveniado e a 5 minutos do metrô.",
      cta: "Chamar no WhatsApp",
      map: "Mapa da localização",
    },
    footer: { hours: "Seg a sex 5h–23h · Sáb 8h–18h · Dom 8h–13h", credit: "Site demonstrativo por" },
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
      secondary: "See plans",
      stats: [
        ["5am–11pm", "open"],
        ["6", "class types"],
        ["1st class", "free"],
      ],
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
    location: {
      kicker: "Location",
      title: "Easy to get to",
      address: ["123 Example Street · Downtown", "São Paulo · SP"],
      note: "Partner parking and 5 minutes from the subway.",
      cta: "Message us on WhatsApp",
      map: "Location map",
    },
    footer: { hours: "Mon–Fri 5am–11pm · Sat 8am–6pm · Sun 8am–1pm", credit: "Demo website by" },
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
  const whatsapp = demoWhatsapp("academia", locale);
  const money = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-[#0b0b0c] font-sans text-white antialiased selection:bg-[#c8ff2e] selection:text-black">
      <DemoBar kind="academia" />
      <Header t={t} whatsapp={whatsapp} />
      <main>
        <Hero t={t} whatsapp={whatsapp} />
        <Ticker t={t} />
        <Modalities t={t} />
        <Schedule t={t} />
        <Plans t={t} whatsapp={whatsapp} money={money} />
        <Location t={t} whatsapp={whatsapp} />
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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0c]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />
        <nav className="hidden gap-7 text-sm text-white/70 md:flex">
          {t.nav.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-4 py-2 text-sm font-bold text-black"
          style={{ background: LIME }}
        >
          {t.freeClass}
        </a>
      </div>
    </header>
  );
}

function Hero({ t, whatsapp }: { t: Copy; whatsapp: string }) {
  const hero = t.hero;
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Nome gigante vazado ao fundo */}
      <Display className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 text-[28vw] leading-none whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.07)]">
        Vértice
      </Display>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-24 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:pt-24 md:pb-32">
        <div>
          <motion.p {...fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME }} />
            {hero.badge}
          </motion.p>
          <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-6 leading-[0.92]">
            <Display className="block text-[17vw] sm:text-7xl lg:text-[6.5rem]">{hero.line1}</Display>
            <Display className="block text-[17vw] sm:text-7xl lg:text-[6.5rem]">
              {hero.line2} <span style={{ color: LIME }}>{hero.accent}</span>
            </Display>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 max-w-md text-lg text-white/70">
            {hero.text}
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-9 flex flex-wrap gap-3">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black"
              style={{ background: LIME }}
            >
              <WhatsappIcon className="h-5 w-5" />
              {hero.primary}
            </a>
            <a href="#planos" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/5">
              {hero.secondary}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {hero.stats.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <Display className="block text-3xl">{value}</Display>
                  <span className="text-sm text-white/55">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <Plate />
      </div>
    </section>
  );
}

/** Anilha geométrica girando devagar: a "imagem" do hero, sem precisar de foto. */
function Plate() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[22rem] md:max-w-none">
      <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: "rgb(200 255 46 / 0.12)" }} />
      <motion.svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="100" r="96" fill="#151517" stroke="rgb(255 255 255 / 0.08)" />
        <circle cx="100" cy="100" r="80" fill="none" stroke={LIME} strokeWidth="10" strokeDasharray="22 10" />
        <circle cx="100" cy="100" r="62" fill="#1c1c1f" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="20" fill="#0b0b0c" stroke={LIME} strokeWidth="3" />
        <text x="100" y="58" textAnchor="middle" fill="rgb(255 255 255 / 0.55)" fontSize="9" letterSpacing="3" fontWeight="700">
          VÉRTICE
        </text>
        <text x="100" y="150" textAnchor="middle" fill={LIME} fontSize="13" letterSpacing="2" fontWeight="800">
          20 KG
        </text>
      </motion.svg>
    </div>
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
          const Icon = MODALITY_ICONS[i];
          return (
            <motion.article
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[#c8ff2e]/60"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 transition-colors group-hover:bg-[#c8ff2e] group-hover:text-black">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold">{name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-white/65">{text}</p>
              <p className="mt-4 text-sm font-semibold" style={{ color: LIME }}>
                {when}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Schedule({ t }: { t: Copy }) {
  const [day, setDay] = useState(0);
  const hours = t.hours;
  return (
    <section id="horarios" className="scroll-mt-20 border-y border-white/10 bg-white/[0.02]">
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
        </div>

        <motion.div {...fadeUp} className="rounded-2xl border border-white/10 bg-[#111113] p-5 sm:p-7">
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

function Plans({ t, whatsapp, money }: { t: Copy; whatsapp: string; money: Intl.NumberFormat }) {
  const [yearly, setYearly] = useState(false);
  const plans = t.plans;
  return (
    <section id="planos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
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
              {highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">{plans.popular}</span>
              )}
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

function Location({ t, whatsapp }: { t: Copy; whatsapp: string }) {
  const location = t.location;
  return (
    <section id="localizacao" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
      <div className="grid overflow-hidden rounded-2xl border border-white/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#111113] p-7 sm:p-10">
          <SectionTitle kicker={location.kicker} title={location.title} />
          <p className="mt-8 flex items-start gap-3 text-white/80">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: LIME }} />
            <span>
              {location.address[0]}
              <br />
              {location.address[1]}
            </span>
          </p>
          <p className="mt-4 text-sm text-white/55">{location.note}</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black"
            style={{ background: LIME }}
          >
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
          </Link>
        </p>
      </div>
    </footer>
  );
}
