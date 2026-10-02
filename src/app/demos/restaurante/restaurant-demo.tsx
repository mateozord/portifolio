"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, ChevronDown, Clock, Flame, Leaf, MapPin, Minus, Plus, Star, Users, X } from "lucide-react";
import type { Locale } from "@/content/portfolio-content";
import { useLocale } from "@/lib/locale-store";
import { DemoBar } from "../_components/demo-bar";
import { WhatsappPreview } from "../_components/whatsapp-preview";

/*
 * Demonstração: site de um restaurante fictício (Brasa & Alecrim), em pt e
 * en. Fotos reais (Pexels, licença livre) em public/demos/restaurante.
 * Seções: hero em tela cheia com selo "Aberto agora" (calculado pelo horário),
 * nossa casa, prato do dia, cardápio com ficha de cada prato, faixa do salão,
 * avaliações (ilustrativas), Instagram, reserva que vira mensagem de WhatsApp
 * (aqui só a prévia), perguntas frequentes, horários e mapa.
 */

const BG = "#17110d";
const PANEL = "#1e1611";
const CREAM = "#f4e9dc";
const TERRACOTTA = "#d9622b";
const OLIVE = "#9aa86b";

const photo = (id: string) => `/demos/restaurante/${id}.webp`;

type Tag = "veg" | "spicy";
type Dish = { id: string; name: string; text: string; price: number; tags?: Tag[] };

// Turnos por dia da semana (0 = domingo), em minutos desde a meia-noite
const LUNCH: [number, number] = [11 * 60 + 30, 15 * 60];
const DINNER: [number, number] = [19 * 60, 23 * 60];
const SHIFTS: [number, number][][] = [[LUNCH], [], [LUNCH, DINNER], [LUNCH, DINNER], [LUNCH, DINNER], [LUNCH, DINNER], [LUNCH, DINNER]];

// Foto do prato do dia, na mesma ordem dos dias (segunda fechado)
const DAILY_PHOTOS = ["costela", null, "risoto", "picanha", "lasanha", "peixe", "feijoada"];
const INSTAGRAM = ["picanha", "ragu", "pudim", "vinho", "provoleta", "costela"];

const COPY = {
  pt: {
    nav: [
      ["Cardápio", "#cardapio"],
      ["Prato do dia", "#prato-do-dia"],
      ["Reservas", "#reservas"],
      ["Onde estamos", "#onde"],
    ],
    reserve: "Reservar mesa",
    hero: {
      kicker: "Cozinha de fogo · massas frescas",
      title: ["Comida de brasa,", "feita sem pressa."],
      text: "Carnes na brasa, massas feitas na casa e uma carta de vinhos curta e honesta. Almoço e jantar no coração do bairro.",
      secondary: "Ver cardápio",
      rating: "no Google",
    },
    status: {
      open: (at: string) => `Aberto agora · fecha às ${at}`,
      today: (at: string) => `Fechado · abre hoje às ${at}`,
      tomorrow: (at: string) => `Fechado · abre amanhã às ${at}`,
      later: (day: string, at: string) => `Fechado · abre ${day} às ${at}`,
      time: (min: number) => `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, "0") : ""}`,
      weekdays: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
    },
    intro: {
      kicker: "Nossa casa",
      title: "Fogo baixo, tempo certo",
      text: "A Brasa & Alecrim nasceu de um almoço de domingo em família: carne na brasa, massa feita na hora e conversa sem relógio. Hoje é a mesma coisa, só que para o bairro inteiro.",
      stats: [
        ["2012", "na mesma esquina"],
        ["8h", "de cozimento no ragu"],
        ["100%", "massas feitas na casa"],
      ],
    },
    daily: {
      kicker: "Prato do dia",
      title: "Toda semana, um sabor por dia",
      today: "Hoje",
      closed: "Fechado às segundas",
      days: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dishes: [
        ["Costela na brasa com mandioca", 69],
        ["", 0],
        ["Risoto de cogumelos com parmesão", 54],
        ["Bife ancho com farofa de alho", 72],
        ["Lasanha da casa à bolonhesa", 58],
        ["Peixe do dia na brasa com ervas", 66],
        ["Feijoada da Brasa (só no almoço)", 62],
      ] as [string, number][],
    },
    menu: {
      kicker: "Cardápio",
      title: "Do fogo para a mesa",
      hint: "Toque em um prato para ver os detalhes",
      tags: { veg: "Vegetariano", spicy: "Picante" },
      close: "Fechar",
      categories: [
        {
          name: "Entradas",
          dishes: [
            { id: "pao", name: "Pão de fermentação natural", text: "Com manteiga de ervas e flor de sal.", price: 18, tags: ["veg"] },
            { id: "provoleta", name: "Provoleta na brasa", text: "Orégano fresco, mel e pimenta calabresa.", price: 36, tags: ["veg", "spicy"] },
            { id: "linguica", name: "Linguiça artesanal", text: "Defumada na casa, com vinagrete de cebola roxa.", price: 32 },
          ],
        },
        {
          name: "Da brasa",
          dishes: [
            { id: "picanha", name: "Picanha (400 g)", text: "Farofa de alho, vinagrete e mandioca crocante.", price: 98 },
            { id: "frango", name: "Frango marinado", text: "Limão-siciliano, alecrim e batatas ao murro.", price: 58 },
            { id: "legumes", name: "Legumes da estação", text: "Na brasa, com molho chimichurri.", price: 44, tags: ["veg"] },
          ],
        },
        {
          name: "Massas",
          dishes: [
            { id: "ragu", name: "Tagliatelle ao ragu", text: "Ragu de costela cozido por 8 horas.", price: 62 },
            { id: "nhoque", name: "Nhoque de batata", text: "Manteiga de sálvia e parmesão ralado na hora.", price: 54, tags: ["veg"] },
            { id: "espaguete", name: "Espaguete arrabbiata", text: "Tomate italiano, alho e pimenta.", price: 48, tags: ["veg", "spicy"] },
          ],
        },
        {
          name: "Sobremesas",
          dishes: [
            { id: "pudim", name: "Pudim de leite", text: "Receita da família, com calda de caramelo.", price: 22, tags: ["veg"] },
            { id: "abacaxi", name: "Abacaxi na brasa", text: "Com sorvete de baunilha e canela.", price: 26, tags: ["veg"] },
          ],
        },
        {
          name: "Bebidas",
          dishes: [
            { id: "limonada", name: "Limonada de alecrim", text: "Feita na hora.", price: 14, tags: ["veg"] },
            { id: "vinho", name: "Taça de vinho da casa", text: "Tinto ou branco, sugestão do dia.", price: 29 },
            { id: "chope", name: "Chope artesanal", text: "Pilsen da cervejaria do bairro.", price: 16 },
          ],
        },
      ] as { name: string; dishes: Dish[] }[],
    },
    band: {
      quote: "O melhor jeito de comer é sem pressa.",
      text: "Reservamos o salão para aniversários, confraternizações e eventos de até 60 pessoas.",
      cta: "Falar sobre eventos",
    },
    reviews: {
      kicker: "Avaliações",
      title: "Quem vem, volta",
      note: "Avaliações ilustrativas · negócio fictício",
      summary: "média no Google, com mais de mil avaliações",
      items: [
        ["Ana P.", "A picanha chega no ponto certinho e o pudim é igual ao da minha avó. Virou nosso almoço de domingo."],
        ["Rodrigo M.", "Fiz a reserva pelo WhatsApp em um minuto. Mesa pronta, atendimento atencioso e o ragu é absurdo."],
        ["Juliana S.", "Ambiente aconchegante, opções vegetarianas de verdade e carta de vinhos com preço justo."],
      ],
    },
    instagram: { kicker: "Instagram", handle: "@brasaealecrim", text: "Bastidores da cozinha e o prato do dia, todo dia." },
    booking: {
      kicker: "Reservas",
      title: "Garanta sua mesa",
      text: "Preencha em 20 segundos e a reserva chega pronta no nosso WhatsApp. Confirmamos em seguida.",
      name: "Nome",
      namePlaceholder: "Como podemos te chamar?",
      date: "Data",
      time: "Horário",
      people: "Pessoas",
      notes: "Observações",
      notesPlaceholder: "Aniversário, cadeirão, restrição alimentar...",
      submit: "Enviar reserva pelo WhatsApp",
      message: (v: { name: string; date: string; time: string; people: number; notes: string }) =>
        [
          "Olá, Brasa & Alecrim! Gostaria de reservar uma mesa:",
          "",
          `Nome: ${v.name || "—"}`,
          `Data: ${v.date || "—"}`,
          `Horário: ${v.time}`,
          `Pessoas: ${v.people}`,
          v.notes ? `Observações: ${v.notes}` : "",
        ]
          .filter((line, i) => line || i === 1)
          .join("\n"),
    },
    faq: {
      kicker: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        ["Preciso reservar?", "Não é obrigatório, mas no jantar de sexta e sábado recomendamos reservar para não esperar."],
        ["Tem opções vegetarianas?", "Sim. Os pratos com a folha no cardápio são vegetarianos, e a cozinha adapta outros quando possível."],
        ["Quais formas de pagamento vocês aceitam?", "Pix, cartões de débito e crédito e vale-refeição."],
        ["Tem estacionamento?", "Temos convênio com o estacionamento ao lado, com desconto para clientes."],
        ["Vocês fazem eventos?", "Sim, para grupos de até 60 pessoas, com cardápio fechado. Fale com a gente pelo WhatsApp."],
      ],
    },
    hours: {
      kicker: "Onde estamos",
      title: "Vem com fome",
      list: [
        ["Almoço · terça a domingo", "11h30 às 15h"],
        ["Jantar · terça a sábado", "19h às 23h"],
        ["Segunda", "Fechado"],
      ],
      address: "Rua Exemplo, 789 · Centro · São Paulo",
      map: "Mapa da localização",
    },
    footer: "Site demonstrativo por",
    photos: "Fotos: Pexels",
  },
  en: {
    nav: [
      ["Menu", "#cardapio"],
      ["Daily special", "#prato-do-dia"],
      ["Bookings", "#reservas"],
      ["Find us", "#onde"],
    ],
    reserve: "Book a table",
    hero: {
      kicker: "Live-fire cooking · fresh pasta",
      title: ["Food from the fire,", "made without rush."],
      text: "Grilled meats, house-made pasta and a short, honest wine list. Lunch and dinner in the heart of the neighborhood.",
      secondary: "See the menu",
      rating: "on Google",
    },
    status: {
      open: (at: string) => `Open now · closes at ${at}`,
      today: (at: string) => `Closed · opens today at ${at}`,
      tomorrow: (at: string) => `Closed · opens tomorrow at ${at}`,
      later: (day: string, at: string) => `Closed · opens ${day} at ${at}`,
      time: (min: number) => {
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
      },
      weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    intro: {
      kicker: "Our place",
      title: "Low fire, the right time",
      text: "Brasa & Alecrim was born from a family Sunday lunch: meat on the grill, fresh pasta and conversation without a clock. Today it's the same, just for the whole neighborhood.",
      stats: [
        ["2012", "on the same corner"],
        ["8h", "of slow-cooked ragù"],
        ["100%", "house-made pasta"],
      ],
    },
    daily: {
      kicker: "Daily special",
      title: "One flavor for every day",
      today: "Today",
      closed: "Closed on Mondays",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dishes: [
        ["Fire-grilled ribs with cassava", 69],
        ["", 0],
        ["Mushroom risotto with parmesan", 54],
        ["Rib-eye with garlic farofa", 72],
        ["House bolognese lasagna", 58],
        ["Catch of the day, fire-grilled with herbs", 66],
        ["Brasa feijoada (lunch only)", 62],
      ] as [string, number][],
    },
    menu: {
      kicker: "Menu",
      title: "From the fire to your table",
      hint: "Tap a dish to see the details",
      tags: { veg: "Vegetarian", spicy: "Spicy" },
      close: "Close",
      categories: [
        {
          name: "Starters",
          dishes: [
            { id: "pao", name: "Sourdough bread", text: "With herb butter and sea salt flakes.", price: 18, tags: ["veg"] },
            { id: "provoleta", name: "Grilled provolone", text: "Fresh oregano, honey and chili flakes.", price: 36, tags: ["veg", "spicy"] },
            { id: "linguica", name: "Artisan sausage", text: "Smoked in-house, with red onion relish.", price: 32 },
          ],
        },
        {
          name: "From the grill",
          dishes: [
            { id: "picanha", name: "Picanha (400 g)", text: "Garlic farofa, vinaigrette and crispy cassava.", price: 98 },
            { id: "frango", name: "Marinated chicken", text: "Lemon, rosemary and smashed potatoes.", price: 58 },
            { id: "legumes", name: "Seasonal vegetables", text: "Fire-grilled, with chimichurri.", price: 44, tags: ["veg"] },
          ],
        },
        {
          name: "Pasta",
          dishes: [
            { id: "ragu", name: "Tagliatelle ragù", text: "Short-rib ragù slow-cooked for 8 hours.", price: 62 },
            { id: "nhoque", name: "Potato gnocchi", text: "Sage butter and freshly grated parmesan.", price: 54, tags: ["veg"] },
            { id: "espaguete", name: "Spaghetti arrabbiata", text: "Roma tomatoes, garlic and chili.", price: 48, tags: ["veg", "spicy"] },
          ],
        },
        {
          name: "Desserts",
          dishes: [
            { id: "pudim", name: "Brazilian flan", text: "Family recipe with caramel sauce.", price: 22, tags: ["veg"] },
            { id: "abacaxi", name: "Grilled pineapple", text: "With vanilla ice cream and cinnamon.", price: 26, tags: ["veg"] },
          ],
        },
        {
          name: "Drinks",
          dishes: [
            { id: "limonada", name: "Rosemary lemonade", text: "Made to order.", price: 14, tags: ["veg"] },
            { id: "vinho", name: "House wine (glass)", text: "Red or white, today's pick.", price: 29 },
            { id: "chope", name: "Craft draft beer", text: "Pilsner from the local brewery.", price: 16 },
          ],
        },
      ] as { name: string; dishes: Dish[] }[],
    },
    band: {
      quote: "The best way to eat is without rush.",
      text: "We host birthdays, team dinners and private events for up to 60 guests.",
      cta: "Ask about events",
    },
    reviews: {
      kicker: "Reviews",
      title: "Once you come, you come back",
      note: "Illustrative reviews · fictional business",
      summary: "average on Google, from over a thousand reviews",
      items: [
        ["Ana P.", "The picanha comes out just right and the flan tastes like my grandma's. It's our Sunday lunch now."],
        ["Rodrigo M.", "Booked on WhatsApp in a minute. Table ready, attentive service, and the ragù is unreal."],
        ["Juliana S.", "Cozy room, real vegetarian options and a wine list with fair prices."],
      ],
    },
    instagram: { kicker: "Instagram", handle: "@brasaealecrim", text: "Behind the kitchen and the daily special, every day." },
    booking: {
      kicker: "Bookings",
      title: "Save your table",
      text: "Fill it in 20 seconds and the booking reaches our WhatsApp ready to go. We'll confirm right after.",
      name: "Name",
      namePlaceholder: "What should we call you?",
      date: "Date",
      time: "Time",
      people: "Guests",
      notes: "Notes",
      notesPlaceholder: "Birthday, high chair, dietary needs...",
      submit: "Send booking via WhatsApp",
      message: (v: { name: string; date: string; time: string; people: number; notes: string }) =>
        [
          "Hi, Brasa & Alecrim! I'd like to book a table:",
          "",
          `Name: ${v.name || "—"}`,
          `Date: ${v.date || "—"}`,
          `Time: ${v.time}`,
          `Guests: ${v.people}`,
          v.notes ? `Notes: ${v.notes}` : "",
        ]
          .filter((line, i) => line || i === 1)
          .join("\n"),
    },
    faq: {
      kicker: "Questions",
      title: "Frequently asked",
      items: [
        ["Do I need a booking?", "It's not required, but for Friday and Saturday dinner we recommend booking to skip the wait."],
        ["Do you have vegetarian options?", "Yes. Dishes with the leaf on the menu are vegetarian, and the kitchen adapts others when possible."],
        ["Which payment methods do you accept?", "Pix, debit and credit cards, and meal vouchers."],
        ["Is there parking?", "We partner with the parking lot next door, with a discount for guests."],
        ["Do you host events?", "Yes, for groups of up to 60 people, with a set menu. Message us on WhatsApp."],
      ],
    },
    hours: {
      kicker: "Find us",
      title: "Come hungry",
      list: [
        ["Lunch · Tuesday to Sunday", "11:30am to 3pm"],
        ["Dinner · Tuesday to Saturday", "7pm to 11pm"],
        ["Monday", "Closed"],
      ],
      address: "789 Example Street · Downtown · São Paulo",
      map: "Location map",
    },
    footer: "Demo website by",
    photos: "Photos: Pexels",
  },
};
type Copy = (typeof COPY)["pt"];

const TIMES = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

// Relógio do visitante, atualizado a cada 30 s. No servidor é null (o selo
// de aberto/fechado e o "hoje" só aparecem depois da hidratação).
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}
const minuteNow = () => Math.floor(Date.now() / 60_000);
function useNow() {
  const minute = useSyncExternalStore(subscribeClock, minuteNow, () => null);
  return minute === null ? null : new Date(minute * 60_000);
}

/** Aberto agora? Se não, quando abre (hoje, amanhã ou outro dia). */
function openStatus(now: Date, s: Copy["status"]) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const [opens, closes] of SHIFTS[day]) {
    if (minutes >= opens && minutes < closes) return { open: true, label: s.open(s.time(closes)) };
  }
  for (let ahead = 0; ahead < 8; ahead++) {
    const d = (day + ahead) % 7;
    const next = SHIFTS[d].find(([opens]) => ahead > 0 || opens > minutes);
    if (!next) continue;
    const at = s.time(next[0]);
    const label = ahead === 0 ? s.today(at) : ahead === 1 ? s.tomorrow(at) : s.later(s.weekdays[d], at);
    return { open: false, label };
  }
  return { open: false, label: "" };
}

export function RestaurantDemo() {
  const locale = useLocale();
  const t = COPY[locale];
  const now = useNow();
  const money = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-[#d9622b] selection:text-white" style={{ background: BG, color: CREAM }}>
      <DemoBar kind="restaurante" />
      <Header t={t} />
      <main>
        <Hero t={t} now={now} />
        <Intro t={t} />
        <Daily t={t} money={money} today={now?.getDay() ?? null} />
        <Menu t={t} money={money} />
        <Band t={t} />
        <Reviews t={t} />
        <Instagram t={t} />
        <Booking t={t} locale={locale} />
        <Faq t={t} />
        <Hours t={t} now={now} />
      </main>
      <Footer t={t} />
    </div>
  );
}

function Serif({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-[family-name:var(--font-dm-serif)] font-normal ${className}`}>{children}</span>;
}

function Logo() {
  return (
    <a href="#inicio" className="inline-flex items-center gap-2">
      <Flame className="h-6 w-6" style={{ color: TERRACOTTA }} />
      <Serif className="text-2xl">Brasa &amp; Alecrim</Serif>
    </a>
  );
}

function Header({ t }: { t: Copy }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-md" style={{ background: "rgb(23 17 13 / 0.72)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />
        <nav className="hidden gap-7 text-sm opacity-80 lg:flex">
          {t.nav.map(([label, href]) => (
            <a key={href} href={href} className="hover:opacity-100">
              {label}
            </a>
          ))}
        </nav>
        <a href="#reservas" className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: TERRACOTTA }}>
          {t.reserve}
        </a>
      </div>
    </header>
  );
}

/** Selo "Aberto agora" / "Fechado · abre às...", com ponto pulsando quando aberto. */
function StatusBadge({ t, now }: { t: Copy; now: Date | null }) {
  if (!now) return <span className="inline-block h-8" />;
  const status = openStatus(now, t.status);
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:text-sm">
      <span className="relative flex h-2 w-2">
        {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />}
        <span className={`relative h-2 w-2 rounded-full ${status.open ? "bg-emerald-400" : "bg-white/50"}`} />
      </span>
      {status.label}
    </span>
  );
}

// Faíscas: posições fixas para não mudarem a cada render
const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: 8 + ((i * 37) % 84),
  delay: (i * 0.53) % 4,
  duration: 3.4 + ((i * 7) % 5) * 0.45,
  size: 2 + (i % 3) * 2,
}));

function Hero({ t, now }: { t: Copy; now: Date | null }) {
  const hero = t.hero;
  return (
    <section id="inicio" className="relative flex min-h-[88svh] items-end overflow-hidden">
      {/* Foto em tela cheia com zoom lento (Ken Burns) */}
      <Image
        src={photo("hero")}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover motion-safe:animate-[rest-kenburns_22s_ease-in-out_infinite_alternate]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#17110d_8%,rgb(23_17_13/0.75)_38%,rgb(23_17_13/0.25)_70%,rgb(23_17_13/0.55))]" />
      {/* Faíscas subindo da brasa */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full motion-safe:animate-[ember-rise_var(--d)_ease-in_infinite] motion-reduce:hidden"
            style={
              {
                left: `${e.left}%`,
                width: e.size,
                height: e.size,
                background: "#ffb36b",
                boxShadow: "0 0 8px #ff8a3d",
                animationDelay: `${e.delay}s`,
                "--d": `${e.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <style>{`
        @keyframes ember-rise { 0% { transform: translateY(0) scale(1); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(-320px) scale(0.3); opacity: 0; } }
        @keyframes rest-kenburns { from { transform: scale(1.04); } to { transform: scale(1.14) translateY(-1.5%); } }
      `}</style>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
        <motion.div {...fadeUp} className="flex flex-wrap items-center gap-2">
          <StatusBadge t={t} now={now} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:text-sm">
            <Star className="h-3.5 w-3.5 fill-[#f5b301] text-[#f5b301]" />
            4,8 {hero.rating}
          </span>
        </motion.div>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-6 text-sm tracking-[0.2em] uppercase" style={{ color: OLIVE }}>
          {hero.kicker}
        </motion.p>
        <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
          <Serif className="block">{hero.title[0]}</Serif>
          <Serif className="block italic">
            <span style={{ color: TERRACOTTA }}>{hero.title[1]}</span>
          </Serif>
        </motion.h1>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-6 max-w-xl text-lg opacity-85">
          {hero.text}
        </motion.p>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="mt-9 flex flex-wrap gap-3">
          <a href="#reservas" className="rounded-full px-6 py-3.5 font-semibold text-white shadow-[0_14px_30px_-10px_rgb(217_98_43/0.7)]" style={{ background: TERRACOTTA }}>
            {t.reserve}
          </a>
          <a href="#cardapio" className="rounded-full border border-white/25 bg-black/20 px-6 py-3.5 font-semibold backdrop-blur hover:bg-white/10">
            {hero.secondary}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function SectionTitle({ kicker, title, text, center = false }: { kicker: string; title: string; text?: string; center?: boolean }) {
  return (
    <motion.div {...fadeUp} className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm tracking-[0.2em] uppercase" style={{ color: OLIVE }}>
        {kicker}
      </p>
      <h2 className="mt-3 text-4xl sm:text-5xl">
        <Serif>{title}</Serif>
      </h2>
      {text && <p className="mt-4 opacity-70">{text}</p>}
    </motion.div>
  );
}

function Intro({ t }: { t: Copy }) {
  const intro = t.intro;
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
      <div>
        <SectionTitle kicker={intro.kicker} title={intro.title} text={intro.text} />
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          {intro.stats.map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd>
                <Serif className="block text-3xl sm:text-4xl">
                  <span style={{ color: TERRACOTTA }}>{value}</span>
                </Serif>
                <span className="text-sm opacity-65">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {/* Duas fotos sobrepostas, levemente inclinadas */}
      <motion.div {...fadeUp} className="relative mx-auto aspect-[4/5] w-full max-w-md">
        <div className="absolute inset-y-0 left-0 w-[72%] -rotate-3 overflow-hidden rounded-3xl shadow-2xl">
          <Image src={photo("picanha")} alt="" fill sizes="(min-width: 768px) 30vw, 70vw" className="object-cover" />
        </div>
        <div className="absolute right-0 bottom-[8%] w-[52%] rotate-3 overflow-hidden rounded-3xl border-4 shadow-2xl" style={{ borderColor: BG }}>
          <div className="relative aspect-[3/4]">
            <Image src={photo("ragu")} alt="" fill sizes="(min-width: 768px) 22vw, 50vw" className="object-cover" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Daily({ t, money, today }: { t: Copy; money: Intl.NumberFormat; today: number | null }) {
  const [day, setDay] = useState<number | null>(null);
  // Antes de saber o dia do visitante, mostra terça
  const selected = day ?? today ?? 2;
  const [dish, price] = t.daily.dishes[selected];
  const dishPhoto = DAILY_PHOTOS[selected];

  return (
    <section id="prato-do-dia" className="scroll-mt-20 border-y border-white/10" style={{ background: PANEL }}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <SectionTitle kicker={t.daily.kicker} title={t.daily.title} center />
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-7 gap-1.5">
          {t.daily.days.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setDay(i)}
              aria-pressed={selected === i}
              className={`relative rounded-xl py-2.5 text-sm font-semibold transition-colors ${selected === i ? "text-white" : "opacity-60 hover:opacity-100"}`}
              style={selected === i ? { background: TERRACOTTA } : undefined}
            >
              {label}
              {i === today && <span className="absolute -top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full" style={{ background: OLIVE }} />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selected}-${t.daily.days[0]}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="mx-auto mt-8 grid max-w-3xl overflow-hidden rounded-3xl border border-white/10 sm:grid-cols-[1.1fr_1fr]"
            style={{ background: BG }}
          >
            <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-72">
              {dishPhoto ? (
                <Image src={photo(dishPhoto)} alt={dish} fill sizes="(min-width: 640px) 26rem, 100vw" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center opacity-40">
                  <Flame className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-9">
              {selected === today && (
                <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: TERRACOTTA }}>
                  {t.daily.today}
                </p>
              )}
              {dish ? (
                <>
                  <Serif className="mt-2 block text-3xl leading-tight sm:text-4xl">{dish}</Serif>
                  <p className="mt-4 text-2xl font-semibold" style={{ color: TERRACOTTA }}>
                    {money.format(price)}
                  </p>
                </>
              ) : (
                <Serif className="mt-2 block text-3xl opacity-60">{t.daily.closed}</Serif>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Menu({ t, money }: { t: Copy; money: Intl.NumberFormat }) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<Dish | null>(null);
  const menu = t.menu;
  const category = menu.categories[tab];
  const close = useCallback(() => setOpen(null), []);

  // Ficha aberta: trava a rolagem do fundo e fecha com Esc
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <section id="cardapio" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
      <SectionTitle kicker={menu.kicker} title={menu.title} text={menu.hint} center />
      <div role="tablist" className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:justify-center">
        {menu.categories.map((c, i) => (
          <button
            key={c.name}
            role="tab"
            type="button"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${tab === i ? "border-transparent text-white" : "border-white/15 opacity-70 hover:opacity-100"}`}
            style={tab === i ? { background: TERRACOTTA } : undefined}
          >
            {c.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.ul
          key={`${tab}-${category.name}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3 }}
          className="mt-10 space-y-3"
        >
          {category.dishes.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setOpen(d)}
                className="group flex w-full items-center gap-4 rounded-2xl p-2 text-left transition-colors hover:bg-white/[0.04] sm:gap-5"
              >
                <motion.div layoutId={`dish-${d.id}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                  <Image src={photo(d.id)} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <Serif className="text-xl sm:text-2xl">{d.name}</Serif>
                    {/* Linha pontilhada entre o prato e o preço, como num cardápio impresso */}
                    <span aria-hidden className="mb-1.5 hidden min-w-6 flex-1 border-b border-dotted border-white/25 sm:block" />
                    <span className="ml-auto font-semibold sm:ml-0" style={{ color: TERRACOTTA }}>
                      {money.format(d.price)}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] opacity-65">
                    {d.text}
                    <DishTags tags={d.tags} labels={menu.tags} />
                  </p>
                </div>
              </button>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>

      {/* Ficha do prato: a foto "cresce" da miniatura (layoutId) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-end bg-black/70 p-3 backdrop-blur-sm sm:place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={open.name}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10"
              style={{ background: PANEL }}
            >
              <motion.div layoutId={`dish-${open.id}`} className="relative aspect-[4/3] w-full overflow-hidden">
                <Image src={photo(open.id)} alt={open.name} fill sizes="(min-width: 640px) 32rem, 100vw" className="object-cover" />
                <button
                  type="button"
                  onClick={close}
                  aria-label={menu.close}
                  className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-black/55 backdrop-blur hover:bg-black/70"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <Serif className="text-3xl leading-tight">{open.name}</Serif>
                  <span className="pt-1 text-xl font-semibold" style={{ color: TERRACOTTA }}>
                    {money.format(open.price)}
                  </span>
                </div>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 opacity-75">
                  {open.text}
                  <DishTags tags={open.tags} labels={menu.tags} />
                </p>
                <a
                  href="#reservas"
                  onClick={close}
                  className="mt-6 block rounded-full py-3.5 text-center font-semibold text-white"
                  style={{ background: TERRACOTTA }}
                >
                  {t.reserve}
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function DishTags({ tags, labels }: { tags?: Tag[]; labels: Copy["menu"]["tags"] }) {
  return tags?.map((tag) => (
    <span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: tag === "veg" ? OLIVE : TERRACOTTA }}>
      {tag === "veg" ? <Leaf className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
      {labels[tag]}
    </span>
  ));
}

/** Faixa do salão em tela cheia: a foto anda mais devagar que a página. */
function Band({ t }: { t: Copy }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} className="relative flex min-h-[70svh] items-center overflow-hidden">
      <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y }}>
        <Image src={photo("salao")} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-[rgb(23_17_13/0.62)]" />
      <motion.div {...fadeUp} className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <Serif className="block text-4xl leading-tight italic sm:text-6xl">“{t.band.quote}”</Serif>
        <p className="mx-auto mt-6 max-w-lg text-lg opacity-85">{t.band.text}</p>
        <a href="#reservas" className="mt-8 inline-block rounded-full border border-white/30 bg-black/25 px-6 py-3.5 font-semibold backdrop-blur hover:bg-white/10">
          {t.band.cta}
        </a>
      </motion.div>
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
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionTitle kicker={r.kicker} title={r.title} />
        <motion.div {...fadeUp} className="flex items-center gap-4">
          <Serif className="text-6xl">
            <span style={{ color: TERRACOTTA }}>4,8</span>
          </Serif>
          <div>
            <Stars />
            <p className="mt-1 max-w-[14rem] text-sm opacity-65">{r.summary}</p>
          </div>
        </motion.div>
      </div>
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {r.items.map(([name, text], i) => (
          <motion.li
            key={name}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className="flex flex-col rounded-3xl border border-white/10 p-6"
            style={{ background: PANEL }}
          >
            <Stars />
            <p className="mt-4 flex-1 leading-relaxed opacity-85">“{text}”</p>
            <p className="mt-5 flex items-center gap-3 text-sm font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: TERRACOTTA }}>
                {name[0]}
              </span>
              {name}
            </p>
          </motion.li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs opacity-45">{r.note}</p>
    </section>
  );
}

function Instagram({ t }: { t: Copy }) {
  const ig = t.instagram;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
      <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm tracking-[0.2em] uppercase" style={{ color: OLIVE }}>
            {ig.kicker}
          </p>
          <Serif className="mt-2 block text-3xl sm:text-4xl">{ig.handle}</Serif>
        </div>
        <p className="opacity-65">{ig.text}</p>
      </motion.div>
      <ul className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {INSTAGRAM.map((id, i) => (
          <motion.li
            key={id}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <Image src={photo(id)} alt="" fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Booking({ t, locale }: { t: Copy; locale: Locale }) {
  const b = t.booking;
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState(false);
  const close = useCallback(() => setPreview(false), []);

  const formattedDate = date ? new Date(`${date}T12:00:00`).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US") : "";
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setPreview(true);
  };
  const field = "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 outline-none placeholder:text-white/35 focus:border-[#d9622b]";

  return (
    <section id="reservas" className="relative scroll-mt-20 overflow-hidden" style={{ background: PANEL }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionTitle kicker={b.kicker} title={b.title} text={b.text} />
          <motion.div {...fadeUp} className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
            <Image src={photo("vinho")} alt="" fill sizes="30vw" className="object-cover" />
          </motion.div>
        </div>
        <motion.form {...fadeUp} onSubmit={submit} className="grid gap-4 self-start rounded-3xl border border-white/10 p-6 sm:grid-cols-2 sm:p-8" style={{ background: BG }}>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm opacity-75">{b.name}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={b.namePlaceholder} className={field} />
          </label>
          <label>
            <span className="mb-1.5 flex items-center gap-1.5 text-sm opacity-75">
              <CalendarDays className="h-3.5 w-3.5" /> {b.date}
            </span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} [color-scheme:dark]`} />
          </label>
          <label>
            <span className="mb-1.5 flex items-center gap-1.5 text-sm opacity-75">
              <Clock className="h-3.5 w-3.5" /> {b.time}
            </span>
            <select value={time} onChange={(e) => setTime(e.target.value)} className={`${field} [color-scheme:dark]`}>
              {TIMES.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm opacity-75">
              <Users className="h-3.5 w-3.5" /> {b.people}
            </span>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="−" onClick={() => setPeople((p) => Math.max(1, p - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:bg-white/5">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-xl font-semibold">{people}</span>
              <button type="button" aria-label="+" onClick={() => setPeople((p) => Math.min(20, p + 1))} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:bg-white/5">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm opacity-75">{b.notes}</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={b.notesPlaceholder} rows={3} className={`${field} resize-none`} />
          </label>
          <button type="submit" className="rounded-full py-3.5 font-semibold text-white sm:col-span-2" style={{ background: TERRACOTTA }}>
            {b.submit}
          </button>
        </motion.form>
      </div>
      <WhatsappPreview
        open={preview}
        onClose={close}
        message={b.message({ name, date: formattedDate, time, people, notes })}
        kind="restaurante"
        locale={locale}
      />
    </section>
  );
}

function Faq({ t }: { t: Copy }) {
  const [open, setOpen] = useState<number | null>(0);
  const faq = t.faq;
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
      <SectionTitle kicker={faq.kicker} title={faq.title} center />
      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {faq.items.map(([question, answer], i) => {
          const isOpen = open === i;
          return (
            <li key={question}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold"
              >
                {question}
                <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} style={{ color: TERRACOTTA }} />
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
                    <p className="pb-5 leading-relaxed opacity-70">{answer}</p>
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

function Hours({ t, now }: { t: Copy; now: Date | null }) {
  const h = t.hours;
  return (
    <section id="onde" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 md:pb-28">
      <div className="grid overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-2">
        <div className="p-7 sm:p-10">
          <SectionTitle kicker={h.kicker} title={h.title} />
          <div className="mt-6">
            <StatusBadge t={t} now={now} />
          </div>
          <ul className="mt-6 divide-y divide-white/10">
            {h.list.map(([label, time]) => (
              <li key={label} className="flex items-center justify-between gap-4 py-3.5">
                <span className="opacity-80">{label}</span>
                <span className="font-semibold">{time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-start gap-2.5 opacity-80">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: TERRACOTTA }} />
            {h.address}
          </p>
        </div>
        <iframe
          title={h.map}
          src="https://www.google.com/maps?q=Pra%C3%A7a+da+S%C3%A9,+S%C3%A3o+Paulo&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border-0 sepia-[0.35] invert-[0.88] hue-rotate-180 lg:h-full lg:min-h-96"
        />
      </div>
    </section>
  );
}

function Footer({ t }: { t: Copy }) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p className="opacity-65">
          {t.footer}{" "}
          <Link href="/" className="font-semibold hover:underline" style={{ color: CREAM }}>
            Mateus Fantin
          </Link>{" "}
          · {t.photos}
        </p>
      </div>
    </footer>
  );
}
