"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Clock, ListChecks, MapPin, Search, Smartphone, type LucideIcon } from "lucide-react";
import { portfolioContent, profile, type Locale } from "@/content/portfolio-content";
import { useLocale } from "@/lib/locale-store";
import { AmbientBackground } from "@/components/ambient";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal, SectionHeader } from "@/components/motion-primitives";
import { PricingSection } from "@/components/pricing-section";
import { ProcessSection } from "@/components/process-section";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { WhatsappIcon } from "@/components/brand-icons";
import { cn, EASE_OUT } from "@/lib/cn";

/*
 * Página para donos de negócios locais (academia, mercado, restaurante...),
 * separada do portfólio de desenvolvedor: linguagem simples, exemplos prontos,
 * preços e WhatsApp. É o link que o Mateus manda para comércios; o portfólio
 * principal (/) fica para recrutadores e empresas.
 */

const DEMOS = ["restaurante", "academia", "mercado"] as const;
const BENEFIT_ICONS: (LucideIcon | "whatsapp")[] = [Search, "whatsapp", Clock, ListChecks, MapPin, Smartphone];

const COPY = {
  pt: {
    nav: [
      ["Exemplos", "#exemplos"],
      ["Preços", "#pricing"],
      ["Como funciona", "#process"],
      ["Dúvidas", "#duvidas"],
    ],
    portfolio: "Portfólio",
    cta: "Falar no WhatsApp",
    message: "Olá, Mateus! Quero um site para o meu negócio.",
    hero: {
      kicker: "Sites para negócios locais",
      title: ["Seu negócio no", "Google", "e no", "WhatsApp."],
      text: "Sites rápidos e bonitos para academias, restaurantes, mercados e comércios do bairro. Seu cliente encontra você, vê horários e preços e chama no WhatsApp em um toque.",
      secondary: "Ver exemplos",
      note: "Orçamento gratuito e sem compromisso",
    },
    benefits: {
      eyebrow: "O que seu site faz",
      title: "Mais clientes, *menos ligação perdida*",
      items: [
        ["Aparece no Google", "Quem procura seu tipo de negócio na região encontra você, com endereço e horário."],
        ["Clientes no WhatsApp", "Botões que abrem a conversa com a mensagem pronta: pedido, reserva ou orçamento."],
        ["Aberto ou fechado na hora", "O site mostra se você está aberto agora, com base no seu horário."],
        ["Cardápio, planos ou ofertas", "Tudo o que o cliente quer saber antes de vir, fácil de achar."],
        ["Mapa e endereço", "Um toque e o cliente abre a rota no celular."],
        ["Feito para o celular", "Rápido mesmo no 4G, porque é pelo celular que seu cliente chega."],
      ],
    },
    examples: {
      eyebrow: "Exemplos prontos",
      title: "Veja como pode ficar *o seu*",
      subtitle: "Três sites de demonstração, com negócios fictícios, para você ver tudo funcionando: abra no celular e teste.",
      open: "Abrir demonstração",
      items: {
        restaurante: ["Restaurante", "Cardápio com foto de cada prato, prato do dia e reserva de mesa pelo WhatsApp.", ["Cardápio com fotos", "Reserva de mesa", "Prato do dia"]],
        academia: ["Academia", "Modalidades, grade de aulas e um quiz que indica o plano ideal para o aluno.", ["Grade de aulas", "Quiz de planos", "Aula grátis"]],
        mercado: ["Mercado", "Ofertas da semana com busca e uma lista de compras que vira pedido no WhatsApp.", ["Ofertas da semana", "Pedido pelo WhatsApp", "Entrega no bairro"]],
      } as Record<(typeof DEMOS)[number], [string, string, string[]]>,
    },
    faq: {
      eyebrow: "Dúvidas",
      title: "Perguntas *frequentes*",
      items: [
        ["Quanto tempo leva para ficar pronto?", "Depende do plano e de quando eu recebo textos e fotos. O prazo combinado vai escrito no orçamento, antes de começar."],
        ["O domínio e a hospedagem estão inclusos?", "O domínio (.com.br) fica registrado no nome do seu negócio. Os custos de domínio e hospedagem eu explico no orçamento, sem surpresa depois."],
        ["E se eu precisar mudar algo depois?", "Pequenos ajustes logo após a entrega estão inclusos. Para atualizar horários, preços e promoções todo mês, existe a manutenção mensal."],
        ["Não tenho fotos boas. E agora?", "Dá para começar com fotos profissionais de banco de imagens e trocar pelas suas depois. Também te oriento a fotografar bem com o celular."],
        ["Você atende fora de São Paulo?", "Sim. Tudo pode ser feito online, por WhatsApp e videochamada."],
      ],
    },
    final: {
      title: "Vamos colocar seu negócio *no ar*?",
      text: "Me conte o que você precisa. Respondo com um orçamento claro, sem compromisso.",
      email: "Prefere e-mail?",
    },
    footer: "Desenvolvido por Mateus Fantin",
  },
  en: {
    nav: [
      ["Examples", "#exemplos"],
      ["Pricing", "#pricing"],
      ["How it works", "#process"],
      ["FAQ", "#duvidas"],
    ],
    portfolio: "Portfolio",
    cta: "Chat on WhatsApp",
    message: "Hi Mateus! I'd like a website for my business.",
    hero: {
      kicker: "Websites for local businesses",
      title: ["Your business on", "Google", "and", "WhatsApp."],
      text: "Fast, good-looking websites for gyms, restaurants, grocery stores and neighborhood shops. Customers find you, see your hours and prices, and message you in one tap.",
      secondary: "See examples",
      note: "Free quote, no strings attached",
    },
    benefits: {
      eyebrow: "What your site does",
      title: "More customers, *fewer missed calls*",
      items: [
        ["Shows up on Google", "People searching for your kind of business nearby find you, with address and hours."],
        ["Customers on WhatsApp", "Buttons that open the chat with the message ready: order, booking or quote."],
        ["Open or closed, live", "The site shows whether you're open right now, based on your hours."],
        ["Menu, plans or deals", "Everything customers want to know before coming, easy to find."],
        ["Map and address", "One tap and customers get directions on their phone."],
        ["Built for phones", "Fast even on mobile data, because that's how customers arrive."],
      ],
    },
    examples: {
      eyebrow: "Live examples",
      title: "See what *yours* could look like",
      subtitle: "Three demo websites, with fictional businesses, so you can see everything working: open them on your phone and try.",
      open: "Open demo",
      items: {
        restaurante: ["Restaurant", "Menu with a photo of every dish, daily special and table booking via WhatsApp.", ["Menu with photos", "Table booking", "Daily special"]],
        academia: ["Gym", "Classes, schedule and a quiz that recommends the right plan for each member.", ["Class schedule", "Plan quiz", "Free trial class"]],
        mercado: ["Grocery store", "Weekly deals with search and a shopping list that becomes a WhatsApp order.", ["Weekly deals", "WhatsApp orders", "Local delivery"]],
      } as Record<(typeof DEMOS)[number], [string, string, string[]]>,
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently *asked*",
      items: [
        ["How long does it take?", "It depends on the plan and on when I get your texts and photos. The agreed deadline is written in the quote, before we start."],
        ["Are domain and hosting included?", "The domain (.com.br) is registered under your business name. I explain domain and hosting costs in the quote, with no surprises later."],
        ["What if I need changes later?", "Small tweaks right after delivery are included. To update hours, prices and promos every month, there's monthly maintenance."],
        ["I don't have good photos. Now what?", "We can start with professional stock photos and swap in yours later. I'll also help you take good photos with your phone."],
        ["Do you work outside São Paulo?", "Yes. Everything can be done online, over WhatsApp and video calls."],
      ],
    },
    final: {
      title: "Ready to put your business *online*?",
      text: "Tell me what you need. I'll reply with a clear quote, no strings attached.",
      email: "Prefer email?",
    },
    footer: "Built by Mateus Fantin",
  },
};
type Copy = (typeof COPY)["pt"];

export function BusinessPage() {
  const locale = useLocale();
  const dictionary = portfolioContent[locale];
  const t = COPY[locale];
  const whatsapp = `${profile.whatsappLink}?text=${encodeURIComponent(t.message)}`;

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  return (
    <MotionConfig reducedMotion="user">
      <AmbientBackground />
      <Header t={t} locale={locale} whatsapp={whatsapp} labels={dictionary.theme} />
      <main className="overflow-x-clip">
        <Hero t={t} whatsapp={whatsapp} />
        <Benefits t={t} />
        <Examples t={t} />
        <PricingSection dictionary={dictionary} locale={locale} />
        <ProcessSection dictionary={dictionary} />
        <Faq t={t} />
        <Final t={t} whatsapp={whatsapp} />
      </main>
      <footer className="border-line text-muted border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} · {t.footer}
          </p>
          <Link href="/" className="focus-ring hover:text-ink inline-flex items-center gap-1 rounded font-medium">
            {t.portfolio}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </footer>
      <WhatsappFab label={t.cta} />
    </MotionConfig>
  );
}

function Header({
  t,
  locale,
  whatsapp,
  labels,
}: {
  t: Copy;
  locale: Locale;
  whatsapp: string;
  labels: { toLight: string; toDark: string };
}) {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="card mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-3">
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-full">
          <span className="bg-ink text-bg grid h-9 w-9 place-items-center rounded-full font-serif-italic text-lg">MF</span>
          <span className="hidden font-semibold sm:inline">Mateus Fantin</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {t.nav.map(([label, href]) => (
            <a key={href} href={href} className="focus-ring text-ink-soft hover:text-ink rounded-full px-3 py-2 transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <LocaleToggle locale={locale} />
          <ThemeToggle labels={labels} />
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white sm:inline-flex"
          >
            <WhatsappIcon className="h-4 w-4" />
            {t.cta}
          </a>
        </div>
      </div>
    </header>
  );
}

/** Título com trechos destacados alternados: "Seu negócio no *Google* e no *WhatsApp*". */
function Hero({ t, whatsapp }: { t: Copy; whatsapp: string }) {
  const hero = t.hero;
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 sm:px-8 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
      <div>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }} className="eyebrow">
          {hero.kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE_OUT }}
          className="mt-5 text-[2.7rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-[4.2rem]"
        >
          {hero.title[0]} <span className="font-serif-italic text-brand">{hero.title[1]}</span> {hero.title[2]}{" "}
          <span className="font-serif-italic text-brand">{hero.title[3]}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
          className="text-muted mt-6 max-w-xl text-lg leading-relaxed"
        >
          {hero.text}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE_OUT }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-emerald-600 py-3.5 pr-6 pl-5 font-semibold text-white shadow-[0_18px_40px_-18px_rgb(5_150_105/0.8)] transition-transform hover:-translate-y-0.5"
          >
            <WhatsappIcon className="h-5 w-5" />
            {t.cta}
          </a>
          <a href="#exemplos" className="focus-ring border-line-strong bg-surface inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-semibold">
            {hero.secondary}
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
        <p className="text-muted mt-5 text-sm">{hero.note}</p>
      </div>

      {/* Três celulares em leque com as demos de verdade */}
      <div aria-hidden className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]">
        {DEMOS.map((demo, i) => {
          const offset = i - 1;
          return (
            // O div de fora posiciona o celular no leque; o de dentro anima a entrada
            <div
              key={demo}
              className="absolute top-1/2 left-1/2 w-[44%]"
              style={{ transform: `translate(calc(-50% + ${offset * 58}%), ${offset === 0 ? -52 : -46}%)`, zIndex: offset === 0 ? 2 : 1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: offset * 8 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE_OUT }}
                className="origin-bottom"
              >
                <Phone src={`/negocios/${demo}-mobile.webp`} />
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Phone({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn("rounded-[2rem] bg-[#111] p-1.5 shadow-[0_30px_60px_-25px_rgb(20_10_40/0.55)] ring-1 ring-white/10", className)}>
      <div className="relative aspect-[390/844] overflow-hidden rounded-[1.6rem] bg-black">
        <Image src={src} alt="" fill sizes="(min-width: 640px) 13rem, 40vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

function Benefits({ t }: { t: Copy }) {
  const b = t.benefits;
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeader eyebrow={b.eyebrow} title={b.title} />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {b.items.map(([title, text], i) => {
          const Icon = BENEFIT_ICONS[i];
          return (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE_OUT }}
              className="card rounded-[1.5rem] p-6"
            >
              <span className="bg-accent-soft text-accent grid h-11 w-11 place-items-center rounded-2xl">
                {Icon === "whatsapp" ? <WhatsappIcon className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="text-muted mt-1.5 leading-relaxed">{text}</p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

function Examples({ t }: { t: Copy }) {
  const e = t.examples;
  return (
    <section id="exemplos" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeader eyebrow={e.eyebrow} title={e.title} subtitle={e.subtitle} />
      <div className="mt-14 space-y-6">
        {DEMOS.map((demo, i) => {
          const [name, text, features] = e.items[demo];
          return (
            <motion.article
              key={demo}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className={cn("card grid items-center gap-8 overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:grid-cols-[1.25fr_1fr]", i % 2 === 1 && "lg:grid-cols-[1fr_1.25fr]")}
            >
              {/* Captura do computador com o celular por cima */}
              <Link href={`/demos/${demo}`} className={cn("group relative block pb-8 sm:pb-10", i % 2 === 1 && "lg:order-2")}>
                <div className="border-line overflow-hidden rounded-xl border bg-[#111] shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                    <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                    <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={`/negocios/${demo}-desktop.webp`}
                      alt={name}
                      fill
                      sizes="(min-width: 1024px) 36rem, 90vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
                <Phone src={`/negocios/${demo}-mobile.webp`} className="absolute -bottom-2 right-3 w-[24%] rotate-3 transition-transform duration-500 group-hover:-translate-y-2 sm:right-6" />
              </Link>
              <div>
                <h3 className="text-3xl font-semibold tracking-tight">{name}</h3>
                <p className="text-muted mt-3 text-lg leading-relaxed">{text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <li key={feature} className="chip">
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/demos/${demo}`}
                  className="focus-ring bg-ink text-bg group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold"
                >
                  {e.open}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Faq({ t }: { t: Copy }) {
  const [open, setOpen] = useState<number | null>(0);
  const faq = t.faq;
  return (
    <section id="duvidas" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeader eyebrow={faq.eyebrow} title={faq.title} align="center" />
      <ul className="border-line mt-12 divide-y divide-[var(--line)] border-y">
        {faq.items.map(([question, answer], i) => {
          const isOpen = open === i;
          return (
            <li key={question}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="focus-ring flex w-full items-center justify-between gap-4 rounded py-5 text-left text-lg font-semibold"
              >
                {question}
                <ChevronDown className={cn("text-accent h-5 w-5 shrink-0 transition-transform duration-300", isOpen && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted pb-5 leading-relaxed">{answer}</p>
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

function Final({ t, whatsapp }: { t: Copy; whatsapp: string }) {
  const f = t.final;
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <Reveal>
        <div className="card relative isolate overflow-hidden rounded-[2.25rem] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="bg-brand absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl" />
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
            {f.title.split("*").map((part, i) =>
              i % 2 ? (
                <span key={i} className="font-serif-italic text-brand">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </h2>
          <p className="text-muted mx-auto mt-4 max-w-lg text-lg">{f.text}</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-9 inline-flex items-center gap-2 rounded-full bg-emerald-600 py-4 pr-7 pl-6 text-lg font-semibold text-white shadow-[0_18px_40px_-18px_rgb(5_150_105/0.8)] transition-transform hover:-translate-y-0.5"
          >
            <WhatsappIcon className="h-5 w-5" />
            {t.cta}
          </a>
          <p className="text-muted mt-5 text-sm">
            {f.email}{" "}
            <a href={`mailto:${profile.email}`} className="text-ink font-semibold underline-offset-4 hover:underline">
              {profile.email}
            </a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
