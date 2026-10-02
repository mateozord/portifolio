"use client";

import { useCallback, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bike, Clock, CreditCard, MapPin, Minus, Plus, ShoppingBasket, Truck } from "lucide-react";
import { useLocale } from "@/lib/locale-store";
import { DemoBar } from "../_components/demo-bar";
import { WhatsappPreview } from "../_components/whatsapp-preview";

/*
 * Demonstração: site de um mercado de bairro fictício (Mercadinho Quintal),
 * em pt e en. Além do básico (horários, entrega, mapa), mostra o recurso que
 * mais vende para mercado: o cliente monta a lista com as ofertas da semana e
 * o pedido sai pronto pelo WhatsApp (aqui, só uma prévia da mensagem).
 */

const GREEN = "#1e4d2b";
const TOMATO = "#e4572e";
const YELLOW = "#ffd23f";
const CREAM = "#fbf6ec";
const FREE_DELIVERY = 120;
const DELIVERY_FEE = 7.9;

type Category = "hortifruti" | "padaria" | "acougue" | "frios" | "mercearia" | "bebidas";
const CATEGORY_TINT: Record<Category, string> = {
  hortifruti: "#e3f1d8",
  padaria: "#f8e7c9",
  acougue: "#f9dcd5",
  frios: "#fdf1c4",
  mercearia: "#ece3d6",
  bebidas: "#ffe3c2",
};

const PRODUCTS: { id: string; emoji: string; category: Category; was: number; price: number }[] = [
  { id: "tomate", emoji: "🍅", category: "hortifruti", was: 6.99, price: 4.99 },
  { id: "banana", emoji: "🍌", category: "hortifruti", was: 5.49, price: 3.99 },
  { id: "abacate", emoji: "🥑", category: "hortifruti", was: 3.5, price: 2.49 },
  { id: "alface", emoji: "🥬", category: "hortifruti", was: 3.29, price: 2.49 },
  { id: "pao", emoji: "🥖", category: "padaria", was: 16.9, price: 13.9 },
  { id: "bolo", emoji: "🍰", category: "padaria", was: 18, price: 14.9 },
  { id: "patinho", emoji: "🥩", category: "acougue", was: 44.9, price: 36.9 },
  { id: "frango", emoji: "🍗", category: "acougue", was: 14.9, price: 11.9 },
  { id: "queijo", emoji: "🧀", category: "frios", was: 54.9, price: 44.9 },
  { id: "cafe", emoji: "☕", category: "mercearia", was: 24.9, price: 19.9 },
  { id: "arroz", emoji: "🍚", category: "mercearia", was: 29.9, price: 24.9 },
  { id: "suco", emoji: "🧃", category: "bebidas", was: 12.9, price: 9.9 },
];

const COPY = {
  pt: {
    tagline: "mercadinho",
    nav: [
      ["Ofertas", "#ofertas"],
      ["Entrega", "#entrega"],
      ["Horários", "#horarios"],
    ],
    headerCta: "Montar pedido",
    hero: {
      badge: `Entrega grátis no bairro acima de R$ ${FREE_DELIVERY}`,
      title: ["Feira fresca", "todo dia,", "pertinho de você."],
      text: "Hortifrúti, padaria, açougue e mercearia. Monte sua lista aqui e receba em casa em até 2 horas.",
      primary: "Ver ofertas da semana",
      secondary: "Como funciona a entrega",
      flyer: "Ofertas da semana",
      flyerNote: "Válido até domingo",
    },
    offers: { kicker: "Ofertas da semana", title: "Monte sua lista", text: "Toque em + para adicionar. O pedido sai pronto pelo WhatsApp.", all: "Tudo", add: "Adicionar" },
    categories: { hortifruti: "Hortifrúti", padaria: "Padaria", acougue: "Açougue", frios: "Frios", mercearia: "Mercearia", bebidas: "Bebidas" },
    products: {
      tomate: ["Tomate italiano", "kg"],
      banana: ["Banana prata", "kg"],
      abacate: ["Abacate", "unidade"],
      alface: ["Alface crespa", "unidade"],
      pao: ["Pão francês", "kg"],
      bolo: ["Bolo de fubá caseiro", "unidade"],
      patinho: ["Patinho moído", "kg"],
      frango: ["Frango inteiro", "kg"],
      queijo: ["Queijo minas frescal", "kg"],
      cafe: ["Café torrado e moído", "500 g"],
      arroz: ["Arroz tipo 1", "5 kg"],
      suco: ["Suco de laranja integral", "1 litro"],
    } as Record<string, [string, string]>,
    cart: {
      items: (n: number) => (n === 1 ? "1 item" : `${n} itens`),
      send: "Enviar pedido",
      free: "Entrega grátis garantida!",
      missing: (value: string) => `Faltam ${value} para entrega grátis`,
      greeting: "Olá, Mercadinho Quintal! Quero fazer um pedido:",
      subtotal: "Subtotal",
      delivery: "Entrega",
      deliveryFree: "grátis",
      total: "Total estimado",
      address: "Endereço de entrega:",
      payment: "Pagamento: Pix, cartão ou dinheiro",
    },
    delivery: {
      kicker: "Entrega",
      title: "Do mercado para a sua porta",
      steps: [
        ["Monte sua lista", "Escolha as ofertas aqui no site ou mande sua lista do jeito que preferir."],
        ["Envie pelo WhatsApp", "O pedido chega pronto para a gente, com os itens e o total."],
        ["Receba em até 2h", "Separamos com cuidado e entregamos no seu endereço."],
      ],
      info: [
        ["Bairros atendidos", "Centro, Vila Exemplo e Jardim Fictício"],
        ["Pedido mínimo", "R$ 40 · entrega grátis acima de R$ 120"],
        ["Pagamento", "Pix, cartão na entrega ou dinheiro"],
      ],
    },
    hours: {
      kicker: "Horários",
      title: "Aberto todos os dias",
      list: [
        ["Segunda a sábado", "7h às 21h"],
        ["Domingo e feriados", "7h às 13h"],
      ],
      address: "Rua Exemplo, 456 · Vila Exemplo · São Paulo",
      map: "Mapa da localização",
    },
    footer: "Site demonstrativo por",
  },
  en: {
    tagline: "neighborhood market",
    nav: [
      ["Deals", "#ofertas"],
      ["Delivery", "#entrega"],
      ["Hours", "#horarios"],
    ],
    headerCta: "Start an order",
    hero: {
      badge: `Free delivery in the area over R$ ${FREE_DELIVERY}`,
      title: ["Fresh produce", "every day,", "right around the corner."],
      text: "Produce, bakery, butcher and pantry. Build your list here and get it delivered in up to 2 hours.",
      primary: "See this week's deals",
      secondary: "How delivery works",
      flyer: "This week's deals",
      flyerNote: "Valid until Sunday",
    },
    offers: { kicker: "This week's deals", title: "Build your list", text: "Tap + to add. Your order goes out ready via WhatsApp.", all: "All", add: "Add" },
    categories: { hortifruti: "Produce", padaria: "Bakery", acougue: "Butcher", frios: "Deli", mercearia: "Pantry", bebidas: "Drinks" },
    products: {
      tomate: ["Roma tomatoes", "kg"],
      banana: ["Bananas", "kg"],
      abacate: ["Avocado", "each"],
      alface: ["Leaf lettuce", "each"],
      pao: ["French rolls", "kg"],
      bolo: ["Homemade corn cake", "each"],
      patinho: ["Ground beef", "kg"],
      frango: ["Whole chicken", "kg"],
      queijo: ["Fresh Minas cheese", "kg"],
      cafe: ["Ground coffee", "500 g"],
      arroz: ["White rice", "5 kg"],
      suco: ["Fresh orange juice", "1 liter"],
    } as Record<string, [string, string]>,
    cart: {
      items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
      send: "Send order",
      free: "Free delivery unlocked!",
      missing: (value: string) => `${value} away from free delivery`,
      greeting: "Hi, Mercadinho Quintal! I'd like to place an order:",
      subtotal: "Subtotal",
      delivery: "Delivery",
      deliveryFree: "free",
      total: "Estimated total",
      address: "Delivery address:",
      payment: "Payment: Pix, card or cash",
    },
    delivery: {
      kicker: "Delivery",
      title: "From our shelves to your door",
      steps: [
        ["Build your list", "Pick the deals here on the site or send your list any way you like."],
        ["Send it on WhatsApp", "Your order reaches us ready, with the items and the total."],
        ["Get it in up to 2h", "We pick everything with care and deliver to your address."],
      ],
      info: [
        ["Areas served", "Downtown, Vila Exemplo and Jardim Fictício"],
        ["Minimum order", "R$ 40 · free delivery over R$ 120"],
        ["Payment", "Pix, card on delivery or cash"],
      ],
    },
    hours: {
      kicker: "Hours",
      title: "Open every day",
      list: [
        ["Monday to Saturday", "7am to 9pm"],
        ["Sundays and holidays", "7am to 1pm"],
      ],
      address: "456 Example Street · Vila Exemplo · São Paulo",
      map: "Location map",
    },
    footer: "Demo website by",
  },
};
type Copy = (typeof COPY)["pt"];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

export function MarketDemo() {
  const locale = useLocale();
  const t = COPY[locale];
  const money = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", { style: "currency", currency: "BRL" });
  const [cart, setCart] = useState<Record<string, number>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const closePreview = useCallback(() => setPreviewOpen(false), []);

  const change = (id: string, delta: number) =>
    setCart((current) => {
      const next = { ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) };
      if (!next[id]) delete next[id];
      return next;
    });

  const lines = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  const fee = subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;

  const message = [
    t.cart.greeting,
    "",
    ...lines.map((line) => `• ${line.qty}x ${t.products[line.id][0]} (${t.products[line.id][1]}) — ${money.format(line.qty * line.price)}`),
    "",
    `${t.cart.subtotal}: ${money.format(subtotal)}`,
    `${t.cart.delivery}: ${fee ? money.format(fee) : t.cart.deliveryFree}`,
    `${t.cart.total}: ${money.format(subtotal + fee)}`,
    "",
    t.cart.address,
    t.cart.payment,
  ].join("\n");

  return (
    <div className="min-h-screen font-sans text-[#1d2a20] antialiased" style={{ background: CREAM }}>
      <DemoBar kind="mercado" />
      <Header t={t} />
      <main>
        <Hero t={t} money={money} />
        <Offers t={t} money={money} cart={cart} change={change} />
        <Delivery t={t} />
        <Hours t={t} />
      </main>
      <Footer t={t} />

      {/* Barra do pedido: aparece com o primeiro item */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-xl rounded-2xl p-3 pl-4 text-white shadow-[0_20px_50px_-15px_rgb(30_77_43/0.7)]"
            style={{ background: GREEN }}
          >
            <div className="flex items-center gap-3">
              <ShoppingBasket className="h-6 w-6 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {t.cart.items(count)} · {money.format(subtotal)}
                </p>
                <p className="truncate text-xs text-white/75">
                  {fee ? t.cart.missing(money.format(FREE_DELIVERY - subtotal)) : t.cart.free}
                </p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: YELLOW }}
                    animate={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY) * 100)}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1d2a20]"
                style={{ background: YELLOW }}
              >
                {t.cart.send}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsappPreview open={previewOpen} onClose={closePreview} message={message} kind="mercado" locale={locale} />
    </div>
  );
}

function Serif({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-[family-name:var(--font-fraunces)] ${className}`}>{children}</span>;
}

function Logo({ t }: { t: Copy }) {
  return (
    <a href="#inicio" className="inline-flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: GREEN }}>
        <ShoppingBasket className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <Serif className="block text-2xl font-semibold">Quintal</Serif>
        <span className="text-[11px] tracking-[0.18em] uppercase opacity-70">{t.tagline}</span>
      </span>
    </a>
  );
}

function Header({ t }: { t: Copy }) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 backdrop-blur" style={{ background: "rgb(251 246 236 / 0.88)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo t={t} />
        <nav className="hidden gap-7 text-sm font-medium md:flex">
          {t.nav.map(([label, href]) => (
            <a key={href} href={href} className="opacity-75 hover:opacity-100">
              {label}
            </a>
          ))}
        </nav>
        <a href="#ofertas" className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: TOMATO }}>
          {t.headerCta}
        </a>
      </div>
    </header>
  );
}

function Hero({ t, money }: { t: Copy; money: Intl.NumberFormat }) {
  const hero = t.hero;
  const featured = PRODUCTS.filter((p) => ["tomate", "pao", "cafe", "frango"].includes(p.id));
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-12 pb-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:pt-20 md:pb-28">
        <div>
          <motion.p {...fadeUp} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "#e3f1d8", color: GREEN }}>
            <Truck className="h-3.5 w-3.5" />
            {hero.badge}
          </motion.p>
          <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-6 text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            <Serif>
              {hero.title[0]} <em style={{ color: TOMATO }}>{hero.title[1]}</em> {hero.title[2]}
            </Serif>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 max-w-md text-lg opacity-75">
            {hero.text}
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-9 flex flex-wrap gap-3">
            <a href="#ofertas" className="rounded-full px-6 py-3.5 font-semibold text-white" style={{ background: GREEN }}>
              {hero.primary}
            </a>
            <a href="#entrega" className="rounded-full border border-black/15 px-6 py-3.5 font-semibold hover:bg-black/5">
              {hero.secondary}
            </a>
          </motion.div>
        </div>

        {/* Encarte de ofertas: a "foto" do hero */}
        <motion.div
          initial={{ opacity: 0, rotate: 0, y: 30 }}
          animate={{ opacity: 1, rotate: 2.5, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_60px_-25px_rgb(30_77_43/0.45)]">
            <div className="px-6 py-5" style={{ background: YELLOW }}>
              <Serif className="block text-3xl leading-none font-black uppercase">{hero.flyer}</Serif>
              <p className="mt-1 text-xs font-semibold tracking-wide uppercase opacity-70">{hero.flyerNote}</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 p-4">
              {featured.map((p, i) => (
                <motion.li
                  key={p.id}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                  className="relative rounded-2xl p-3"
                  style={{ background: CATEGORY_TINT[p.category] }}
                >
                  <span className="block text-4xl">{p.emoji}</span>
                  <p className="mt-2 text-sm leading-tight font-semibold">{t.products[p.id][0]}</p>
                  <span
                    className="absolute -top-2 -right-2 rotate-6 rounded-lg px-2 py-1 text-sm font-black text-white shadow"
                    style={{ background: TOMATO }}
                  >
                    {money.format(p.price)}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Offers({
  t,
  money,
  cart,
  change,
}: {
  t: Copy;
  money: Intl.NumberFormat;
  cart: Record<string, number>;
  change: (id: string, delta: number) => void;
}) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const categories = Object.keys(CATEGORY_TINT) as Category[];
  const visible = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <section id="ofertas" className="scroll-mt-20 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle kicker={t.offers.kicker} title={t.offers.title} text={t.offers.text} />
        <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1">
          {(["all", ...categories] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${filter === value ? "border-transparent text-white" : "border-black/10 hover:bg-black/5"}`}
              style={filter === value ? { background: GREEN } : undefined}
            >
              {value === "all" ? t.offers.all : t.categories[value]}
            </button>
          ))}
        </div>

        <motion.ul layout className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => {
              const qty = cart[p.id] ?? 0;
              const [name, unit] = t.products[p.id];
              return (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="flex flex-col rounded-2xl border border-black/[0.06] p-3 sm:p-4"
                  style={{ background: CREAM }}
                >
                  <div className="relative grid aspect-[4/3] place-items-center rounded-xl text-5xl sm:text-6xl" style={{ background: CATEGORY_TINT[p.category] }}>
                    {p.emoji}
                    <span className="absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[11px] font-black text-white" style={{ background: TOMATO }}>
                      −{Math.round((1 - p.price / p.was) * 100)}%
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] font-semibold tracking-wide uppercase opacity-55">{t.categories[p.category]}</p>
                  <p className="mt-0.5 leading-tight font-semibold">{name}</p>
                  <p className="text-xs opacity-60">{unit}</p>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <p className="leading-tight">
                      <span className="block text-xs line-through opacity-45">{money.format(p.was)}</span>
                      <span className="text-lg font-black" style={{ color: TOMATO }}>
                        {money.format(p.price)}
                      </span>
                    </p>
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => change(p.id, 1)}
                        aria-label={`${t.offers.add}: ${name}`}
                        className="grid h-9 w-9 place-items-center rounded-full text-white transition-transform active:scale-90"
                        style={{ background: GREEN }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 rounded-full bg-white p-0.5 shadow-sm">
                        <button type="button" onClick={() => change(p.id, -1)} aria-label="−" className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => change(p.id, 1)}
                          aria-label="+"
                          className="grid h-8 w-8 place-items-center rounded-full text-white"
                          style={{ background: GREEN }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <motion.div {...fadeUp} className="max-w-2xl">
      <p className="text-sm font-bold tracking-[0.16em] uppercase" style={{ color: TOMATO }}>
        {kicker}
      </p>
      <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        <Serif>{title}</Serif>
      </h2>
      {text && <p className="mt-3 opacity-70">{text}</p>}
    </motion.div>
  );
}

const DELIVERY_ICONS = [MapPin, ShoppingBasket, CreditCard];

function Delivery({ t }: { t: Copy }) {
  const d = t.delivery;
  return (
    <section id="entrega" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-24">
      <SectionTitle kicker={d.kicker} title={d.title} />
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {d.steps.map(([title, text], i) => (
          <motion.li key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_-20px_rgb(30_77_43/0.4)]">
            <span className="grid h-10 w-10 place-items-center rounded-full font-black" style={{ background: YELLOW }}>
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-1.5 opacity-70">{text}</p>
          </motion.li>
        ))}
      </ol>
      <ul className="mt-4 grid gap-4 rounded-2xl p-6 text-white md:grid-cols-3" style={{ background: GREEN }}>
        {d.info.map(([label, value], i) => {
          const Icon = DELIVERY_ICONS[i];
          return (
            <li key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: YELLOW }} />
              <span>
                <span className="block text-sm text-white/70">{label}</span>
                <span className="font-semibold">{value}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Hours({ t }: { t: Copy }) {
  const h = t.hours;
  return (
    <section id="horarios" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 sm:px-6">
      <div className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_50px_-30px_rgb(30_77_43/0.45)] lg:grid-cols-2">
        <div className="p-7 sm:p-10">
          <SectionTitle kicker={h.kicker} title={h.title} />
          <ul className="mt-8 space-y-3">
            {h.list.map(([label, time]) => (
              <li key={label} className="flex items-center justify-between rounded-xl px-4 py-3.5" style={{ background: CREAM }}>
                <span className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4" style={{ color: GREEN }} />
                  {label}
                </span>
                <span className="font-bold">{time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-start gap-2.5 opacity-80">
            <Bike className="mt-0.5 h-5 w-5 shrink-0" style={{ color: TOMATO }} />
            {h.address}
          </p>
        </div>
        <iframe
          title={h.map}
          src="https://www.google.com/maps?q=Pra%C3%A7a+da+S%C3%A9,+S%C3%A3o+Paulo&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border-0 lg:h-full lg:min-h-96"
        />
      </div>
    </section>
  );
}

function Footer({ t }: { t: Copy }) {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
        <Logo t={t} />
        <p className="opacity-70">
          {t.footer}{" "}
          <Link href="/" className="font-semibold underline-offset-2 hover:underline">
            Mateus Fantin
          </Link>
        </p>
      </div>
    </footer>
  );
}
