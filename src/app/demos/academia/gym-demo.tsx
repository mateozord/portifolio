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
import { DemoBar, demoWhatsapp } from "../_components/demo-bar";

/*
 * Demonstração: landing page de uma academia fictícia (Vértice). Entrega o
 * plano "Landing page" do portfólio: modalidades, horários, planos, mapa e
 * WhatsApp. Sem fotos: a identidade vem da tipografia condensada, do preto
 * com verde-limão e de uma "anilha" geométrica girando no hero.
 */

const LIME = "#c8ff2e";
const WHATSAPP = demoWhatsapp("academia");

const MODALITIES: { icon: LucideIcon; name: string; text: string; when: string }[] = [
  { icon: Dumbbell, name: "Musculação", text: "Área completa com equipamentos novos e professores no salão o dia todo.", when: "Todos os dias" },
  { icon: Zap, name: "Funcional", text: "Treinos em grupo de 45 minutos para condicionamento e força.", when: "Seg a sáb" },
  { icon: Bike, name: "Spinning", text: "Aulas com música e luz baixa, para queimar calorias sem impacto.", when: "Seg, qua e sex" },
  { icon: Swords, name: "Muay Thai", text: "Técnica, condicionamento e defesa pessoal, do iniciante ao avançado.", when: "Ter, qui e sáb" },
  { icon: HeartPulse, name: "Pilates", text: "Postura, mobilidade e fortalecimento em turmas pequenas.", when: "Seg a sex" },
  { icon: Flame, name: "Cross", text: "Alta intensidade com levantamentos e circuitos cronometrados.", when: "Seg a sáb" },
];

const HOURS = [
  { day: "Segunda a sexta", time: "5h às 23h" },
  { day: "Sábado", time: "8h às 18h" },
  { day: "Domingo e feriados", time: "8h às 13h" },
];

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
const SCHEDULE: Record<(typeof DAYS)[number], { time: string; name: string; coach: string }[]> = {
  Seg: [
    { time: "06:30", name: "Funcional", coach: "Prof. Rafa" },
    { time: "07:30", name: "Spinning", coach: "Prof. Lia" },
    { time: "12:15", name: "Pilates", coach: "Prof. Bia" },
    { time: "18:30", name: "Cross", coach: "Prof. Caio" },
    { time: "19:30", name: "Funcional", coach: "Prof. Rafa" },
  ],
  Ter: [
    { time: "06:30", name: "Cross", coach: "Prof. Caio" },
    { time: "12:15", name: "Pilates", coach: "Prof. Bia" },
    { time: "19:00", name: "Muay Thai", coach: "Prof. Duda" },
    { time: "20:00", name: "Funcional", coach: "Prof. Rafa" },
  ],
  Qua: [
    { time: "06:30", name: "Funcional", coach: "Prof. Rafa" },
    { time: "07:30", name: "Spinning", coach: "Prof. Lia" },
    { time: "12:15", name: "Pilates", coach: "Prof. Bia" },
    { time: "18:30", name: "Cross", coach: "Prof. Caio" },
    { time: "19:30", name: "Spinning", coach: "Prof. Lia" },
  ],
  Qui: [
    { time: "06:30", name: "Cross", coach: "Prof. Caio" },
    { time: "12:15", name: "Pilates", coach: "Prof. Bia" },
    { time: "19:00", name: "Muay Thai", coach: "Prof. Duda" },
    { time: "20:00", name: "Funcional", coach: "Prof. Rafa" },
  ],
  Sex: [
    { time: "06:30", name: "Funcional", coach: "Prof. Rafa" },
    { time: "07:30", name: "Spinning", coach: "Prof. Lia" },
    { time: "18:30", name: "Cross", coach: "Prof. Caio" },
  ],
  Sáb: [
    { time: "09:00", name: "Funcional", coach: "Prof. Rafa" },
    { time: "10:00", name: "Muay Thai", coach: "Prof. Duda" },
    { time: "11:00", name: "Cross", coach: "Prof. Caio" },
  ],
};

const PLANS = [
  { name: "Básico", monthly: 99.9, perks: ["Musculação livre", "Avaliação física", "App de treinos"] },
  {
    name: "Completo",
    monthly: 149.9,
    perks: ["Tudo do Básico", "Todas as aulas coletivas", "1 aula de Pilates por semana", "Leve um amigo 1x por mês"],
    highlight: true,
  },
  { name: "Duo", monthly: 249.9, perks: ["Plano Completo para 2 pessoas", "Mesma conta, dois acessos", "Ideal para casais e amigos"] },
];

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

export function GymDemo() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] font-sans text-white antialiased selection:bg-[#c8ff2e] selection:text-black">
      <DemoBar kind="academia" />
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Modalities />
        <Schedule />
        <Plans />
        <Location />
      </main>
      <Footer />
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
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

function Header() {
  const links = [
    ["Modalidades", "#modalidades"],
    ["Horários", "#horarios"],
    ["Planos", "#planos"],
    ["Localização", "#localizacao"],
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0c]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />
        <nav className="hidden gap-7 text-sm text-white/70 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-4 py-2 text-sm font-bold text-black"
          style={{ background: LIME }}
        >
          Aula grátis
        </a>
      </div>
    </header>
  );
}

function Hero() {
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
            Primeira aula grátis · sem taxa de matrícula
          </motion.p>
          <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-6 leading-[0.92]">
            <Display className="block text-[17vw] sm:text-7xl lg:text-[6.5rem]">Treine no</Display>
            <Display className="block text-[17vw] sm:text-7xl lg:text-[6.5rem]">
              seu <span style={{ color: LIME }}>limite.</span>
            </Display>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 max-w-md text-lg text-white/70">
            Musculação, funcional, lutas e aulas coletivas no centro da cidade. Aberto das 5h às 23h para caber na sua rotina.
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-9 flex flex-wrap gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black"
              style={{ background: LIME }}
            >
              <WhatsappIcon className="h-5 w-5" />
              Agendar aula grátis
            </a>
            <a href="#planos" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/5">
              Ver planos
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[
              ["5h–23h", "aberto"],
              ["6", "modalidades"],
              ["1ª aula", "grátis"],
            ].map(([value, label]) => (
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

function Ticker() {
  const items = ["Musculação", "Funcional", "Spinning", "Muay Thai", "Pilates", "Cross"];
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

function Modalities() {
  return (
    <section id="modalidades" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionTitle kicker="Modalidades" title="Escolha seu treino" text="Todas incluídas no plano Completo. Professores no salão em todos os horários." />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODALITIES.map(({ icon: Icon, name, text, when }, i) => (
          <motion.article
            key={name}
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
        ))}
      </div>
    </section>
  );
}

function Schedule() {
  const [day, setDay] = useState<(typeof DAYS)[number]>("Seg");
  return (
    <section id="horarios" className="scroll-mt-20 border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionTitle kicker="Horários" title="Aberto quando você pode" />
          <ul className="mt-10 space-y-3">
            {HOURS.map(({ day: label, time }) => (
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
          <h3 className="text-lg font-bold">Grade de aulas</h3>
          <div role="tablist" aria-label="Dia da semana" className="mt-5 grid grid-cols-6 gap-1.5 rounded-xl bg-white/5 p-1.5">
            {DAYS.map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={day === d}
                onClick={() => setDay(d)}
                className={`rounded-lg py-2 text-sm font-semibold transition-colors ${day === d ? "text-black" : "text-white/60 hover:text-white"}`}
                style={day === d ? { background: LIME } : undefined}
              >
                {d}
              </button>
            ))}
          </div>
          <ul key={day} className="mt-5 divide-y divide-white/10">
            {SCHEDULE[day].map((item, i) => (
              <motion.li
                key={item.time + item.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 py-3.5"
              >
                <span className="w-14 font-[family-name:var(--font-anton)] text-xl">{item.time}</span>
                <span className="flex-1 font-semibold">{item.name}</span>
                <span className="text-sm text-white/55">{item.coach}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function Plans() {
  const [yearly, setYearly] = useState(false);
  return (
    <section id="planos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionTitle kicker="Planos" title="Sem taxa de matrícula" text="Cancele quando quiser no plano mensal. No anual, você economiza 20%." />
        <div className="inline-flex self-start rounded-full border border-white/15 p-1 text-sm font-semibold md:self-auto">
          {[
            [false, "Mensal"],
            [true, "Anual −20%"],
          ].map(([value, label]) => (
            <button
              key={String(value)}
              onClick={() => setYearly(value as boolean)}
              aria-pressed={yearly === value}
              className={`rounded-full px-4 py-2 transition-colors ${yearly === value ? "text-black" : "text-white/65"}`}
              style={yearly === value ? { background: LIME } : undefined}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLANS.map((plan, i) => {
          const price = yearly ? plan.monthly * 0.8 : plan.monthly;
          return (
            <motion.article
              key={plan.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-2xl border p-7 ${plan.highlight ? "border-transparent text-black" : "border-white/10 bg-white/[0.03]"}`}
              style={plan.highlight ? { background: LIME } : undefined}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">Mais escolhido</span>
              )}
              <Display className="text-3xl">{plan.name}</Display>
              <p className="mt-5">
                <span className="text-4xl font-black tracking-tight">{brl.format(price)}</span>
                <span className={plan.highlight ? "text-black/60" : "text-white/55"}>/mês</span>
              </p>
              <p className={`mt-1 text-sm ${plan.highlight ? "text-black/60" : "text-white/45"}`}>
                {yearly ? `${brl.format(price * 12)} por ano` : "Sem fidelidade"}
              </p>
              <ul className="mt-6 space-y-2.5">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={plan.highlight ? undefined : { color: LIME }} />
                    {perk}
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full py-3 font-bold md:mt-auto ${plan.highlight ? "bg-black text-white" : "border border-white/20 hover:bg-white/5"}`}
              >
                Quero esse plano
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="localizacao" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
      <div className="grid overflow-hidden rounded-2xl border border-white/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#111113] p-7 sm:p-10">
          <SectionTitle kicker="Localização" title="Fácil de chegar" />
          <p className="mt-8 flex items-start gap-3 text-white/80">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: LIME }} />
            Rua Exemplo, 123 · Centro
            <br />
            São Paulo · SP
          </p>
          <p className="mt-4 text-sm text-white/55">Estacionamento conveniado e a 5 minutos do metrô.</p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold text-black"
            style={{ background: LIME }}
          >
            <WhatsappIcon className="h-5 w-5" />
            Chamar no WhatsApp
          </a>
        </div>
        <iframe
          title="Mapa da localização"
          src="https://www.google.com/maps?q=Pra%C3%A7a+da+S%C3%A9,+S%C3%A3o+Paulo&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border-0 grayscale-[0.6] invert-[0.92] hue-rotate-180 lg:h-full lg:min-h-96"
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p>Seg a sex 5h–23h · Sáb 8h–18h · Dom 8h–13h</p>
        <p>
          Site demonstrativo por{" "}
          <Link href="/" className="font-semibold text-white hover:underline">
            Mateus Fantin
          </Link>
        </p>
      </div>
    </footer>
  );
}
