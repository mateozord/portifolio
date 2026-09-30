"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/locale-store";
import { buildWaveLayer, FOAM, INK, LAYER_STYLES } from "./waves";
import "./intro.css";

const COPY = {
  pt: { hello: "Bem-vindo", sub: "ao portfólio de Mateus Fantin", skip: "Pular intro", label: "Boas-vindas" },
  en: { hello: "Welcome", sub: "to Mateus Fantin's portfolio", skip: "Skip intro", label: "Welcome" },
};

// Linha do tempo (segundos): boas-vindas → a onda sobe → cobre → sai revelando o site
const TIMING = { rise: 2.1, covered: 3.45, exit: 3.62, done: 5.0 };
const EASE_WAVE = [0.7, 0, 0.3, 1];
const EASE_OUT = [0.22, 1, 0.36, 1];

function subscribeSize(onChange) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
const getSize = () => `${window.innerWidth}x${window.innerHeight}`;

/**
 * Intro de entrada: "Bem-vindo", depois ondas japonesas sobem em camadas,
 * cobrem a tela e saem para cima revelando o site. O site só é montado quando
 * a tela está coberta, então as animações de entrada dele tocam na revelação.
 * Pular: botão, Esc, Enter ou espaço.
 */
export default function WelcomeIntro({ children }) {
  const locale = useLocale();
  const copy = COPY[locale];
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState("welcome");
  const timers = useRef([]);
  const sizeKey = useSyncExternalStore(subscribeSize, getSize, () => "");

  const layers = useMemo(() => {
    if (!sizeKey) return null;
    const [w, h] = sizeKey.split("x").map(Number);
    // A camada é um pouco mais larga que a tela para poder derivar de lado
    return { h, list: LAYER_STYLES.map((style) => buildWaveLayer({ width: w + 120, height: h, style })) };
  }, [sizeKey]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const skip = useCallback(() => {
    clearTimers();
    setPhase("skip");
    timers.current.push(setTimeout(() => setPhase("done"), 480));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (reduceMotion) {
      timers.current.push(setTimeout(() => setPhase("skip"), 1400));
      timers.current.push(setTimeout(() => setPhase("done"), 1900));
    } else {
      for (const [name, at] of [
        ["rise", TIMING.rise],
        ["covered", TIMING.covered],
        ["exit", TIMING.exit],
        ["done", TIMING.done],
      ]) {
        timers.current.push(setTimeout(() => setPhase(name), at * 1000));
      }
    }
    return clearTimers;
  }, [reduceMotion]);

  // Rolagem travada enquanto a intro está na tela; teclas para pular
  const active = phase !== "done";
  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event) => {
      if (["Escape", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, skip]);

  const showSite = phase !== "welcome" && phase !== "rise";
  const covered = showSite;

  return (
    <>
      {showSite && children}
      {active && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={copy.label}
          className="fixed inset-0 z-[300] overflow-hidden"
          initial={false}
          animate={{ opacity: phase === "skip" ? 0 : 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Tela de boas-vindas (some no instante em que a onda cobre tudo) */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,#1b3f9e_0%,#0b1f5c_48%,#040c2b_100%)]"
            style={{ visibility: covered && phase !== "skip" ? "hidden" : "visible" }}
          >
            <Seigaiha />
            <Welcome copy={copy} leaving={phase !== "welcome"} />
          </div>

          {layers &&
            !reduceMotion &&
            layers.list.map((layer, i) => (
              <WaveLayer
                key={`${sizeKey}-${i}`}
                layer={layer}
                style={LAYER_STYLES[i]}
                index={i}
                count={layers.list.length}
                viewportHeight={layers.h}
                phase={phase}
                front={i === layers.list.length - 1}
              />
            ))}

          <motion.button
            type="button"
            onClick={skip}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase === "welcome" ? 1 : 0, y: 0 }}
            transition={{ duration: 0.5, delay: phase === "welcome" ? 0.8 : 0 }}
            className="absolute right-5 bottom-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white sm:right-8 sm:bottom-8"
          >
            {copy.skip}
            <kbd className="rounded border border-white/25 px-1.5 py-0.5 font-mono text-[10px] text-white/60">Esc</kbd>
          </motion.button>
        </motion.div>
      )}
    </>
  );
}

function Welcome({ copy, leaving }) {
  const letters = [...copy.hello];
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#f5f0e6]"
      animate={leaving ? { opacity: 0, scale: 0.94, y: -40, filter: "blur(8px)" } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: leaving ? 0.3 : 0, ease: EASE_OUT }}
    >
      {/* Barra de cima: assinatura discreta */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5 text-[11px] tracking-[0.3em] text-white/50 uppercase sm:px-8 sm:pt-7">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
          Mateus Fantin
        </motion.span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
          São Paulo · {new Date().getFullYear()}
        </motion.span>
      </div>

      {/* Carimbo */}
      <motion.span
        initial={{ scale: 1.9, opacity: 0, rotate: -16 }}
        animate={{ scale: 1, opacity: 1, rotate: -4 }}
        transition={{ type: "spring", stiffness: 240, damping: 13, delay: 0.15 }}
        className="u-mincho-intro grid h-12 w-12 place-items-center rounded-[6px] border-[2.5px] border-[#e2553f] text-2xl font-bold text-[#e2553f]"
      >
        波
      </motion.span>

      {/* ようこそ: boas-vindas em japonês */}
      <motion.p
        className="u-mincho-intro mt-7 text-sm tracking-[0.8em] text-white/60 sm:text-base"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } } }}
        aria-hidden
      >
        {[..."ようこそ"].map((ch, i) => (
          <motion.span key={i} className="inline-block" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
            {ch}
          </motion.span>
        ))}
      </motion.p>

      {/* Bem-vindo: letras sobem de dentro de uma máscara */}
      <h1 aria-label={copy.hello} className="font-serif-italic mt-3 text-[clamp(4.2rem,15vw,11.5rem)] leading-[1.02]">
        {letters.map((ch, i) => (
          <span key={i} aria-hidden className="inline-block overflow-hidden pr-[0.04em] pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.45 + i * 0.055, ease: EASE_OUT }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease: EASE_OUT }}
        className="mt-4 text-xs tracking-[0.35em] text-white/70 uppercase sm:text-sm"
      >
        {copy.sub}
      </motion.p>

      {/* Linha de progresso até a onda chegar */}
      <div className="absolute bottom-24 left-1/2 h-px w-40 -translate-x-1/2 overflow-hidden bg-white/15 sm:bottom-12">
        <motion.span
          className="block h-full origin-left bg-[#e2553f]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: TIMING.rise, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

function WaveLayer({ layer, style, index, count, viewportHeight, phase, front }) {
  // Abaixo da tela, com folga para a espuma (que passa um pouco acima da crista)
  const below = viewportHeight + layer.crest + 60;
  const risen = -layer.crest;
  const exiting = phase === "exit" || phase === "done";
  // A maré sobe (de trás para a frente) e depois recua (da frente para trás),
  // mostrando de novo as cristas enquanto revela o site.
  const y = phase === "welcome" || exiting ? below : risen;
  const transition = exiting
    ? { duration: 1.1, delay: (count - 1 - index) * 0.07, ease: [0.55, 0, 0.3, 1] }
    : { duration: 1.1, delay: index * 0.09, ease: EASE_WAVE };
  const drift = index % 2 ? -46 : 46;

  return (
    <motion.div
      aria-hidden
      className="absolute top-0 left-0 will-change-transform"
      style={{ width: "100%", height: layer.length }}
      initial={{ y: below }}
      animate={{ y }}
      transition={transition}
    >
      <motion.svg
        width={layer.width}
        height={layer.length}
        className="absolute top-0 left-[-60px] overflow-visible"
        initial={{ x: 0 }}
        animate={{ x: phase === "welcome" ? 0 : drift }}
        transition={{ duration: 3.2, ease: "linear" }}
      >
        {/* Corpo da onda */}
        <rect x="0" y={layer.base - 1} width={layer.width} height={layer.length - layer.base + 1} fill={style.body} />
        {/* Textura seigaiha bem sutil no corpo */}
        <defs>
          <pattern id={`sg-${index}`} width="48" height="24" patternUnits="userSpaceOnUse">
            {[
              [24, 12],
              [0, 24],
              [48, 24],
              [24, 36],
            ].map(([cx, cy]) =>
              [24, 17, 10].map((r) => (
                <path
                  key={`${cx}-${cy}-${r}`}
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill={r === 24 ? style.body : "none"}
                  stroke={style.stripes[0]}
                  strokeOpacity="0.16"
                  strokeWidth="1.2"
                />
              )),
            )}
          </pattern>
        </defs>
        <rect x="0" y={layer.base + 20} width={layer.width} height={layer.length - layer.base} fill={`url(#sg-${index})`} />

        {/* Crista: arcos sobrepostos, da esquerda para a direita */}
        {layer.humps.map((hump, k) => (
          <g key={k}>
            <path d={hump.outer} fill={style.body} />
            {hump.stripes.map((stripe, j) => (
              <path key={j} d={stripe.d} fill="none" stroke={stripe.color} strokeWidth={stripe.width} strokeLinecap="round" />
            ))}
            <path d={hump.eye} fill={style.eye} />
            <path d={hump.outline} fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          </g>
        ))}

        {/* Espuma: contorno primeiro, depois o miolo por cima (vira uma nuvem só) */}
        {layer.humps.map(
          (hump, k) =>
            hump.foam && (
              <motion.g
                key={`f${k}`}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: hump.foam.delay }}
              >
                {hump.foam.puffs.map(([cx, cy, r], j) => (
                  <circle key={`o${j}`} cx={cx} cy={cy} r={r} fill={FOAM} stroke={INK} strokeWidth="3" />
                ))}
                {hump.foam.puffs.map(([cx, cy, r], j) => (
                  <circle key={`i${j}`} cx={cx} cy={cy} r={Math.max(0, r - 1.6)} fill={FOAM} />
                ))}
                <path d={hump.foam.curl} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                {hump.foam.drops.map(([cx, cy, r], j) => (
                  <circle key={`d${j}`} cx={cx} cy={cy} r={r} fill={FOAM} stroke={INK} strokeWidth="1.2" />
                ))}
              </motion.g>
            ),
        )}
      </motion.svg>

      {/* Na camada da frente, o carimbo aparece no centro da tela quando ela está coberta */}
      {front && (
        <motion.span
          className="u-mincho-intro absolute left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[8px] border-[3px] border-[#e2553f] text-3xl font-bold text-[#e2553f]"
          style={{ top: layer.crest + viewportHeight / 2 }}
          initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
          animate={phase === "covered" || phase === "exit" ? { opacity: 1, scale: 1, rotate: -4 } : { opacity: 0, scale: 1.6, rotate: -14 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          波
        </motion.span>
      )}
    </motion.div>
  );
}

/** Padrão seigaiha bem sutil na base da tela de boas-vindas. */
function Seigaiha() {
  const arcs = [20, 15, 10, 5];
  return (
    <svg aria-hidden className="absolute inset-x-0 bottom-0 h-[45%] w-full opacity-[0.12] [mask-image:linear-gradient(to_top,#000,transparent)]">
      <defs>
        <pattern id="intro-seigaiha" width="40" height="20" patternUnits="userSpaceOnUse">
          {[
            [20, 10],
            [0, 20],
            [40, 20],
            [20, 30],
          ].map(([cx, cy]) =>
            arcs.map((r) => (
              <path
                key={`${cx}-${cy}-${r}`}
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill={r === 20 ? "#0b1f5c" : "none"}
                stroke="#93c5fd"
                strokeWidth="0.9"
              />
            )),
          )}
          <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="40 0" dur="16s" repeatCount="indefinite" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#intro-seigaiha)" />
    </svg>
  );
}
