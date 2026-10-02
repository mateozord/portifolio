"use client";

import { useCallback, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, Leaf, MapPin, Minus, Plus, Flame, Users } from "lucide-react";
import { useLocale } from "@/lib/locale-store";
import { DemoBar } from "../_components/demo-bar";
import { WhatsappPreview } from "../_components/whatsapp-preview";

/*
 * Demonstração: site de um restaurante fictício (Brasa & Alecrim), em pt e
 * en. Cardápio por categoria, prato do dia (muda com o dia da semana),
 * reserva de mesa que vira mensagem de WhatsApp (aqui, só a prévia), horários
 * e mapa. Sem fotos: um "prato" com brasas subindo e anel de texto girando.
 */

const BG = "#17110d";
const CREAM = "#f4e9dc";
const TERRACOTTA = "#d9622b";
const OLIVE = "#9aa86b";

type Tag = "veg" | "spicy";
type Dish = { name: string; text: string; price: number; tags?: Tag[] };

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
      ring: "BRASA & ALECRIM · COZINHA DE FOGO · ",
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
        ["Risoto de abóbora com sálvia", 54],
        ["Bife ancho com farofa de alho", 72],
        ["Lasanha da casa à bolonhesa", 58],
        ["Peixe do dia com legumes na brasa", 66],
        ["Feijoada da Brasa (só no almoço)", 62],
      ] as [string, number][],
    },
    menu: {
      kicker: "Cardápio",
      title: "Do fogo para a mesa",
      tags: { veg: "Vegetariano", spicy: "Picante" },
      categories: [
        {
          name: "Entradas",
          dishes: [
            { name: "Pão de fermentação natural", text: "Com manteiga de ervas e flor de sal.", price: 18, tags: ["veg"] },
            { name: "Provoleta na brasa", text: "Orégano fresco, mel e pimenta calabresa.", price: 36, tags: ["veg", "spicy"] },
            { name: "Linguiça artesanal", text: "Defumada na casa, com vinagrete de cebola roxa.", price: 32 },
          ],
        },
        {
          name: "Da brasa",
          dishes: [
            { name: "Picanha (400 g)", text: "Farofa de alho, vinagrete e mandioca crocante.", price: 98 },
            { name: "Frango marinado", text: "Limão-siciliano, alecrim e batatas ao murro.", price: 58 },
            { name: "Legumes da estação", text: "Na brasa, com molho chimichurri.", price: 44, tags: ["veg"] },
          ],
        },
        {
          name: "Massas",
          dishes: [
            { name: "Tagliatelle ao ragu", text: "Ragu de costela cozido por 8 horas.", price: 62 },
            { name: "Nhoque de batata-doce", text: "Manteiga de sálvia e parmesão.", price: 54, tags: ["veg"] },
            { name: "Espaguete arrabbiata", text: "Tomate italiano, alho e pimenta.", price: 48, tags: ["veg", "spicy"] },
          ],
        },
        {
          name: "Sobremesas",
          dishes: [
            { name: "Pudim de doce de leite", text: "Receita da família, com calda de caramelo.", price: 22, tags: ["veg"] },
            { name: "Abacaxi na brasa", text: "Com sorvete de baunilha e canela.", price: 26, tags: ["veg"] },
          ],
        },
        {
          name: "Bebidas",
          dishes: [
            { name: "Limonada de alecrim", text: "Feita na hora.", price: 14, tags: ["veg"] },
            { name: "Taça de vinho da casa", text: "Tinto ou branco, sugestão do dia.", price: 29 },
            { name: "Chope artesanal", text: "Pilsen da cervejaria do bairro.", price: 16 },
          ],
        },
      ] as { name: string; dishes: Dish[] }[],
    },
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
      ring: "BRASA & ALECRIM · LIVE-FIRE KITCHEN · ",
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
        ["Pumpkin risotto with sage", 54],
        ["Rib-eye with garlic farofa", 72],
        ["House bolognese lasagna", 58],
        ["Catch of the day with grilled vegetables", 66],
        ["Brasa feijoada (lunch only)", 62],
      ] as [string, number][],
    },
    menu: {
      kicker: "Menu",
      title: "From the fire to your table",
      tags: { veg: "Vegetarian", spicy: "Spicy" },
      categories: [
        {
          name: "Starters",
          dishes: [
            { name: "Sourdough bread", text: "With herb butter and sea salt flakes.", price: 18, tags: ["veg"] },
            { name: "Grilled provolone", text: "Fresh oregano, honey and chili flakes.", price: 36, tags: ["veg", "spicy"] },
            { name: "Artisan sausage", text: "Smoked in-house, with red onion relish.", price: 32 },
          ],
        },
        {
          name: "From the grill",
          dishes: [
            { name: "Picanha (400 g)", text: "Garlic farofa, vinaigrette and crispy cassava.", price: 98 },
            { name: "Marinated chicken", text: "Lemon, rosemary and smashed potatoes.", price: 58 },
            { name: "Seasonal vegetables", text: "Fire-grilled, with chimichurri.", price: 44, tags: ["veg"] },
          ],
        },
        {
          name: "Pasta",
          dishes: [
            { name: "Tagliatelle ragù", text: "Short-rib ragù slow-cooked for 8 hours.", price: 62 },
            { name: "Sweet potato gnocchi", text: "Sage butter and parmesan.", price: 54, tags: ["veg"] },
            { name: "Spaghetti arrabbiata", text: "Roma tomatoes, garlic and chili.", price: 48, tags: ["veg", "spicy"] },
          ],
        },
        {
          name: "Desserts",
          dishes: [
            { name: "Dulce de leche flan", text: "Family recipe with caramel sauce.", price: 22, tags: ["veg"] },
            { name: "Grilled pineapple", text: "With vanilla ice cream and cinnamon.", price: 26, tags: ["veg"] },
          ],
        },
        {
          name: "Drinks",
          dishes: [
            { name: "Rosemary lemonade", text: "Made to order.", price: 14, tags: ["veg"] },
            { name: "House wine (glass)", text: "Red or white, today's pick.", price: 29 },
            { name: "Craft draft beer", text: "Pilsner from the local brewery.", price: 16 },
          ],
        },
      ] as { name: string; dishes: Dish[] }[],
    },
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

// Dia da semana do visitante (no servidor, terça-feira até a hidratação)
const noop = () => () => {};
function useWeekday() {
  return useSyncExternalStore(noop, () => new Date().getDay(), () => 2);
}

export function RestaurantDemo() {
  const locale = useLocale();
  const t = COPY[locale];
  const money = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-[#d9622b] selection:text-white" style={{ background: BG, color: CREAM }}>
      <DemoBar kind="restaurante" />
      <Header t={t} />
      <main>
        <Hero t={t} />
        <Daily t={t} money={money} />
        <Menu t={t} money={money} />
        <Booking t={t} locale={locale} />
        <Hours t={t} />
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
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur" style={{ background: "rgb(23 17 13 / 0.85)" }}>
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

function Hero({ t }: { t: Copy }) {
  const hero = t.hero;
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-24 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:pt-24 md:pb-32">
        <div>
          <motion.p {...fadeUp} className="text-sm tracking-[0.2em] uppercase" style={{ color: OLIVE }}>
            {hero.kicker}
          </motion.p>
          <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="mt-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            <Serif className="block">{hero.title[0]}</Serif>
            <Serif className="block italic">
              <span style={{ color: TERRACOTTA }}>{hero.title[1]}</span>
            </Serif>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 max-w-md text-lg opacity-75">
            {hero.text}
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-9 flex flex-wrap gap-3">
            <a href="#reservas" className="rounded-full px-6 py-3.5 font-semibold text-white" style={{ background: TERRACOTTA }}>
              {t.reserve}
            </a>
            <a href="#cardapio" className="rounded-full border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/5">
              {hero.secondary}
            </a>
          </motion.div>
        </div>
        <Ember ring={hero.ring} />
      </div>
    </section>
  );
}

// Brasas: posições fixas para não mudarem a cada render
const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: 18 + ((i * 37) % 64),
  delay: (i * 0.53) % 4,
  duration: 3.2 + ((i * 7) % 5) * 0.4,
  size: 3 + (i % 3) * 2,
}));

/** Prato com brilho de brasa, faíscas subindo e o nome girando em volta. */
function Ember({ ring }: { ring: string }) {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[22rem] md:max-w-none">
      <div className="absolute inset-[12%] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgb(217 98 43 / 0.55), transparent 70%)" }} />
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
        <defs>
          <path id="ember-ring" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
        </defs>
        {/* A frase ocupa exatamente uma volta (2π × 86 ≈ 540): sem emenda no meio de palavra */}
        <text fill={CREAM} fillOpacity="0.55" fontSize="10.5">
          <textPath href="#ember-ring" textLength="536" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-[22%] rounded-full border border-white/10" style={{ background: "radial-gradient(circle at 50% 40%, #2a1d15, #120c09 70%)" }}>
        <div className="absolute inset-[18%] rounded-full" style={{ background: "radial-gradient(circle, rgb(255 140 60 / 0.9), rgb(217 98 43 / 0.5) 40%, transparent 72%)" }} />
        <Flame className="absolute top-1/2 left-1/2 h-1/4 w-1/4 -translate-x-1/2 -translate-y-1/2 text-[#ffd8a8]" />
      </div>
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-[30%] rounded-full motion-safe:animate-[ember-rise_var(--d)_ease-in_infinite]"
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
      <style>{`@keyframes ember-rise { 0% { transform: translateY(0) scale(1); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(-180px) scale(0.3); opacity: 0; } }`}</style>
    </div>
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

function Daily({ t, money }: { t: Copy; money: Intl.NumberFormat }) {
  const today = useWeekday();
  const [day, setDay] = useState<number | null>(null);
  const selected = day ?? today;
  const [dish, price] = t.daily.dishes[selected];

  return (
    <section id="prato-do-dia" className="scroll-mt-20 border-y border-white/10" style={{ background: "#1e1611" }}>
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 p-8 text-center"
          >
            {selected === today && (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: TERRACOTTA }}>
                {t.daily.today}
              </p>
            )}
            {dish ? (
              <>
                <Serif className="mt-2 block text-3xl sm:text-4xl">{dish}</Serif>
                <p className="mt-3 text-2xl font-semibold" style={{ color: TERRACOTTA }}>
                  {money.format(price)}
                </p>
              </>
            ) : (
              <Serif className="mt-2 block text-3xl opacity-60">{t.daily.closed}</Serif>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Menu({ t, money }: { t: Copy; money: Intl.NumberFormat }) {
  const [tab, setTab] = useState(0);
  const menu = t.menu;
  const category = menu.categories[tab];
  return (
    <section id="cardapio" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
      <SectionTitle kicker={menu.kicker} title={menu.title} center />
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
          className="mt-10 space-y-7"
        >
          {category.dishes.map((d) => (
            <li key={d.name}>
              <div className="flex items-baseline gap-3">
                <Serif className="text-xl sm:text-2xl">{d.name}</Serif>
                {/* Linha pontilhada entre o prato e o preço, como num cardápio impresso */}
                <span aria-hidden className="mb-1.5 min-w-6 flex-1 border-b border-dotted border-white/25" />
                <span className="font-semibold" style={{ color: TERRACOTTA }}>
                  {money.format(d.price)}
                </span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] opacity-65">
                {d.text}
                {d.tags?.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold opacity-100" style={{ color: tag === "veg" ? OLIVE : TERRACOTTA }}>
                    {tag === "veg" ? <Leaf className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
                    {menu.tags[tag]}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </section>
  );
}

function Booking({ t, locale }: { t: Copy; locale: "pt" | "en" }) {
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
    <section id="reservas" className="scroll-mt-20" style={{ background: "#1e1611" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle kicker={b.kicker} title={b.title} text={b.text} />
        <motion.form {...fadeUp} onSubmit={submit} className="grid gap-4 rounded-3xl border border-white/10 p-6 sm:grid-cols-2 sm:p-8" style={{ background: BG }}>
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

function Hours({ t }: { t: Copy }) {
  const h = t.hours;
  return (
    <section id="onde" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-24">
      <div className="grid overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-2">
        <div className="p-7 sm:p-10">
          <SectionTitle kicker={h.kicker} title={h.title} />
          <ul className="mt-8 divide-y divide-white/10">
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
          </Link>
        </p>
      </div>
    </footer>
  );
}
