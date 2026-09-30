"use client";

import Link from "next/link";
import { MotionConfig, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import WaveCanvas from "./WaveCanvas";
import RippleButton from "./RippleButton";
import SeigaihaPattern from "./SeigaihaPattern";

const EASE = [0.22, 1, 0.36, 1];

// Shippori Mincho vem do page.jsx (--font-mincho). Os kanji usam a fonte mincho do sistema.
const MINCHO = { fontFamily: "var(--font-mincho), 'Yu Mincho', 'Hiragino Mincho ProN', 'Noto Serif JP', serif" };

// Iluminação radial: índigo profundo, roxo místico e âmbar de café sobre o fundo #08070c.
const SKY = [
  "radial-gradient(60% 55% at 18% 12%, rgba(126, 34, 206, 0.38), transparent 70%)",
  "radial-gradient(42% 38% at 78% 44%, rgba(245, 158, 11, 0.2), transparent 70%)",
  "radial-gradient(90% 70% at 50% 105%, #0f172a, transparent 75%)",
  "radial-gradient(70% 60% at 50% 30%, rgba(15, 23, 42, 0.9), transparent 80%)",
  "#08070c",
].join(", ");

const SUBTITLE_LEAD = "Desenvolvedor Full-stack & UI Designer criando aplicações";
const SUBTITLE_HIGHLIGHT = "fluidas, elegantes e com identidade própria.";

export default function JapaneseWaveHero() {
  // Luz roxa suave que acompanha o cursor pelo céu.
  const lightX = useMotionValue(0.3);
  const lightY = useMotionValue(0.3);
  const smoothX = useSpring(lightX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(lightY, { stiffness: 50, damping: 20 });
  const lightLeft = useTransform(smoothX, (v) => `${v * 100}%`);
  const lightTop = useTransform(smoothY, (v) => `${v * 100}%`);
  const cursorLight = useMotionTemplate`radial-gradient(560px circle at ${lightLeft} ${lightTop}, rgba(168, 85, 247, 0.16), rgba(37, 99, 235, 0.06) 40%, transparent 65%)`;

  const onPointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    lightX.set((event.clientX - rect.left) / rect.width);
    lightY.set((event.clientY - rect.top) / rect.height);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        onPointerMove={onPointerMove}
        className="jp-waves relative isolate flex min-h-svh flex-col overflow-hidden bg-[#08070c] text-slate-100"
      >
        {/* Céu */}
        <div aria-hidden className="absolute inset-0 -z-30" style={{ background: SKY }} />
        <SeigaihaPattern className="pointer-events-none absolute inset-0 -z-20 opacity-[0.12] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_28%,#000_20%,transparent_75%)]" />
        <motion.div aria-hidden className="absolute inset-0 -z-20" style={{ background: cursorLight }} />
        <CoffeeSun />
        <Mist />

        {/* Mar */}
        <WaveCanvas className="absolute inset-0 -z-10 h-full w-full" />

        <TopBar />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-start px-5 pt-8 pb-[36vh] sm:px-8 lg:items-center lg:pt-0 lg:pb-[20vh]">
          <GlassCard />
        </div>

        <Cartouche />
        <WaterHint />
      </section>
    </MotionConfig>
  );
}

function TopBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 pt-5 sm:px-8 sm:pt-6"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 backdrop-blur-md transition-colors hover:border-amber-400/40 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Portfólio
      </Link>
      <span className="rounded-full border border-indigo-500/20 bg-slate-900/40 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-slate-300 uppercase backdrop-blur-md">
        <span style={MINCHO} className="mr-2 tracking-normal text-amber-300/90 normal-case">
          実験
        </span>
        Experimento
      </span>
    </motion.header>
  );
}

function GlassCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
      className="relative w-full max-w-2xl rounded-[2rem] border border-indigo-500/20 bg-slate-900/40 p-7 shadow-[0_40px_90px_-40px_rgba(8,7,12,0.95)] backdrop-blur-md sm:p-10"
    >
      {/* Fio de luz âmbar na borda de cima do vidro */}
      <span
        aria-hidden
        className="absolute inset-x-12 -top-px h-px bg-[linear-gradient(90deg,transparent,rgba(252,211,77,0.7),transparent)]"
      />

      <CoffeeBadge />

      <h1 style={MINCHO} className="mt-7 text-5xl leading-[1.02] font-bold tracking-tight sm:text-7xl">
        <Letters text="Mateus" delay={0.45} />{" "}
        <Letters text="Fantin" delay={0.75} gradient />
      </h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: 1.15 } } }}
        className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl"
      >
        {SUBTITLE_LEAD.split(" ").map((word, i) => (
          <SoftWord key={`lead-${i}`} word={word} />
        ))}
        {SUBTITLE_HIGHLIGHT.split(" ").map((word, i) => (
          <SoftWord key={`hl-${i}`} word={word} className="text-amber-200" />
        ))}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.7, ease: EASE }}
        className="mt-9 flex flex-wrap gap-3"
      >
        <RippleButton href="/#projects">
          Explorar Projetos
          <ArrowRight className="h-4 w-4" />
        </RippleButton>
        <RippleButton href="/#about" variant="glass">
          <Play className="h-3.5 w-3.5 fill-current" />
          Ver Apresentação
        </RippleButton>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="mt-8 font-mono text-xs text-slate-500"
      >
        <span className="text-violet-400">const</span> flow = <span className="text-amber-300">☕</span> +{" "}
        <span className="text-sky-400">{"</>"}</span>;
      </motion.p>
    </motion.div>
  );
}

/** Letras que sobem da água: saem do desfoque com um leve balanço. */
function Letters({ text, delay, gradient = false }) {
  const letters = [...text];
  return (
    <motion.span
      className="inline-block whitespace-nowrap"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      aria-label={text}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: "0.55em", rotate: 6, filter: "blur(12px)" },
            visible: {
              opacity: 1,
              y: 0,
              rotate: 0,
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 120, damping: 14 },
            },
          }}
          style={
            gradient
              ? {
                  // Um gradiente só, fatiado letra a letra: âmbar → roxo → azul contínuo.
                  backgroundImage: "linear-gradient(90deg, #fcd34d, #f59e0b 25%, #a855f7 65%, #2563eb)",
                  backgroundSize: `${letters.length * 100}% 100%`,
                  backgroundPosition: `${letters.length > 1 ? (i / (letters.length - 1)) * 100 : 0}% 0`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  paddingBottom: "0.08em",
                }
              : { color: "#f5ecd7" }
          }
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

function SoftWord({ word, className }) {
  return (
    <>
      <motion.span
        className={`inline-block ${className ?? ""}`}
        variants={{
          hidden: { opacity: 0, y: 8, filter: "blur(6px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
        }}
      >
        {word}
      </motion.span>{" "}
    </>
  );
}

function CoffeeBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-amber-100"
    >
      <span className="relative inline-flex">
        <Steam />
        <span aria-hidden>☕</span>
      </span>
      Flow, Magic &amp; Code
    </motion.span>
  );
}

/** Vapor subindo da xícara. */
function Steam() {
  return (
    <span aria-hidden className="pointer-events-none absolute bottom-[85%] left-1/2 flex -translate-x-1/2 gap-[2px]">
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          width="4"
          height="10"
          viewBox="0 0 4 10"
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: [0, 0.8, 0], y: [2, -7] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
        >
          <path d="M2 10 C 0 7, 4 5, 2 2" stroke="rgba(254,243,199,0.8)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </motion.svg>
      ))}
    </span>
  );
}

/** Sol âmbar "de café" nascendo atrás das ondas, como nas gravuras ukiyo-e. */
function CoffeeSun() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2.2, ease: EASE }}
      className="absolute top-[34%] -right-[12%] -z-20 size-[62vmin] sm:top-[30%] sm:right-[6%] sm:size-[40vmin]"
    >
      <motion.div
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full rounded-full shadow-[0_0_140px_40px_rgba(245,158,11,0.28)]"
        style={{ background: "radial-gradient(circle at 38% 32%, #fde68a, #f59e0b 42%, #b45309 78%, #78350f)" }}
      />
      {/* Anéis finos ao redor do sol */}
      {[1.18, 1.38].map((ring, i) => (
        <motion.span
          key={ring}
          className="absolute inset-0 rounded-full border border-amber-300/15"
          style={{ scale: ring }}
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 1.5, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}

/** Kasumi: faixas horizontais de névoa que cruzam o céu nas gravuras japonesas. */
function Mist() {
  const bands = [
    { top: "41%", left: "-12%", width: "48%", height: 30, drift: 50, duration: 22, opacity: 0.4 },
    { top: "47%", left: "52%", width: "46%", height: 18, drift: -40, duration: 18, opacity: 0.55 },
    { top: "53%", left: "20%", width: "34%", height: 14, drift: 30, duration: 26, opacity: 0.35 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 -z-20">
      {bands.map((band, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[5px]"
          style={{
            top: band.top,
            left: band.left,
            width: band.width,
            height: band.height,
            opacity: band.opacity,
            background: "linear-gradient(90deg, transparent, rgba(126,34,206,0.55) 20%, rgba(168,85,247,0.35) 70%, transparent)",
          }}
          animate={{ x: [0, band.drift, 0] }}
          transition={{ duration: band.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/** Cartela vertical com carimbo (hanko), como a assinatura das gravuras. */
function Cartouche() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2, ease: EASE }}
      style={MINCHO}
      className="absolute top-24 right-5 z-10 hidden flex-col items-center gap-3 md:flex lg:right-8"
    >
      <span className="rounded-[3px] border border-amber-100/20 bg-[#f5ecd7]/[0.06] px-1.5 py-3 text-base tracking-[0.35em] text-[#f5ecd7]/80 [writing-mode:vertical-rl]">
        波と珈琲とコード
      </span>
      <motion.span
        initial={{ scale: 1.6, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: -4 }}
        transition={{ type: "spring", stiffness: 220, damping: 12, delay: 1.8 }}
        className="grid h-9 w-9 place-items-center rounded-[5px] border-2 border-amber-500/80 text-lg text-amber-400"
      >
        流
      </motion.span>
    </motion.div>
  );
}

function WaterHint() {
  return (
    <motion.p
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.7, 0.7, 0] }}
      transition={{ duration: 6, delay: 2.6, times: [0, 0.15, 0.8, 1] }}
      className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[11px] tracking-[0.25em] text-[#f5ecd7]/70 uppercase md:block"
    >
      〜 passe o cursor sobre a água 〜
    </motion.p>
  );
}
