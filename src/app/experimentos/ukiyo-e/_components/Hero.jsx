"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "@/content/portfolio-content";
import { WhatsappIcon } from "@/components/brand-icons";
import { Magnetic } from "@/components/motion-primitives";
import HokusaiScrollDriven from "./HokusaiScrollDriven";
import InkTide from "./InkTide";
import { EASE, InkLink, Seal } from "./ornaments";

// Enquadramento da gravura: no desktop ela ocupa a tela, presa no topo, e o
// texto fica no céu à direita; no celular aproxima a crista, abaixo do texto.
const FRAMES = {
  desktop: { focus: [0.5, 0], css: "50% 0%" },
  mobile: { focus: [0.32, 0.3], zoom: 1.05, css: "32% 30%" },
};

export default function Hero({ dictionary, copy }) {
  const reduceMotion = useReducedMotion();
  const hero = dictionary.hero;

  // Scrollytelling: o hero é alto e a tela fica presa (sticky) enquanto o
  // scroll faz a onda quebrar. `fluid` é o progresso com mola: a água responde
  // com inércia, sem trancos (e o navegador não "acelera" a opacidade com o
  // scroll da página inteira, o que a desligaria do trecho do hero).
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const fluid = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.7, restDelta: 0.0005 });
  const still = reduceMotion ? 0 : 1;
  const textOpacity = useTransform(fluid, [0.6, 0.88], [1, reduceMotion ? 1 : 0]);
  const textY = useTransform(fluid, [0.6, 0.88], [0, -40 * still]);
  const hintOpacity = useTransform(fluid, [0, 0.06], [1, 0]);
  // No fim, a base da gravura se dissolve no papel e a maré da seção seguinte sobe
  const fuse = useTransform(fluid, [0.55, 0.95], [0, 1]);

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section id="top" ref={ref} className="relative h-[220svh] lg:h-[260svh]">
      <div className="sticky top-0 isolate flex h-[100svh] min-h-[620px] flex-col overflow-hidden lg:block">
        {/* A gravura, quebrando com o scroll */}
        <div className="relative order-2 flex-1 lg:absolute lg:inset-0">
          <HokusaiScrollDriven progress={fluid} desktop={FRAMES.desktop} mobile={FRAMES.mobile} className="absolute inset-0" />
          {/* Névoa de papel atrás do texto (desktop): leitura nítida sobre o céu da gravura */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              background:
                "radial-gradient(40% 54% at 76% 36%, color-mix(in srgb, var(--u-bg) 80%, transparent), color-mix(in srgb, var(--u-bg) 32%, transparent) 60%, transparent 82%)",
            }}
          />
          {/* Celular: a borda de cima da gravura se funde no papel */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[14%] bg-linear-to-b from-[var(--u-bg)] to-transparent lg:hidden" />
          {/* Fusão: a base se dissolve no papel e a maré a nanquim sobe */}
          <motion.div aria-hidden style={{ opacity: fuse }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-[color-mix(in_srgb,var(--u-bg)_70%,transparent)] to-[var(--u-bg)]" />
            <InkTide className="absolute inset-x-0 bottom-0 h-[62%]" />
          </motion.div>
        </div>

        {/* Texto: no céu da gravura, à direita (desktop); em cima (celular) */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 order-1 px-5 pt-24 pb-6 sm:px-8 sm:pt-28 lg:absolute lg:top-[13svh] lg:right-[7vw] lg:left-[58vw] lg:p-0"
        >
          <motion.div {...fadeUp(0.15)} className="flex flex-wrap items-center gap-3">
            <Seal size="sm">波</Seal>
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">
              {copy.hero.label} · São Paulo
            </span>
          </motion.div>

          <h1
            aria-label="Mateus Fantin"
            className="u-mincho mt-5 text-[3.1rem] leading-[0.98] font-extrabold tracking-tight sm:text-7xl lg:text-[clamp(3.2rem,5vw,6rem)]"
          >
            <RisingWord text="Mateus" delay={0.25} />
            <br />
            <RisingWord text="Fantin" delay={0.55} className="text-[var(--u-accent)]" />
          </h1>

          <motion.p {...fadeUp(0.9)} className="u-mincho mt-5 max-w-md text-xl leading-snug font-semibold text-balance sm:text-2xl lg:text-[1.55rem]">
            {copy.hero.lead}
          </motion.p>
          <motion.p {...fadeUp(1.05)} className="mt-3 hidden max-w-md leading-relaxed text-pretty text-[var(--u-ink-soft)] sm:block">
            {copy.hero.body}
          </motion.p>

          <motion.div {...fadeUp(1.2)} className="mt-6 flex flex-wrap gap-3 lg:mt-7">
            <Magnetic>
              <InkLink
                href="#projects"
                fill="var(--u-ink)"
                className="group inline-flex items-center gap-2 rounded-[10px] bg-[var(--u-red)] px-6 py-3.5 font-semibold text-[var(--u-red-ink)] shadow-[0_14px_30px_-14px_rgb(194_59_42/0.8)] hover:text-[var(--u-bg)]"
              >
                {hero.ctaPrimary}
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </InkLink>
            </Magnetic>
            <Magnetic strength={0.2}>
              <InkLink
                href={profile.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                fill="#047857"
                className="group inline-flex items-center gap-2 rounded-[10px] border border-[var(--u-line-strong)] bg-[color-mix(in_srgb,var(--u-card)_80%,transparent)] px-6 py-3.5 font-semibold backdrop-blur-sm hover:border-transparent hover:text-white"
              >
                <WhatsappIcon className="h-4 w-4 text-emerald-600 transition-colors group-hover:text-white" />
                {hero.ctaSecondary}
              </InkLink>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Convite para rolar */}
        <motion.p
          aria-hidden
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--u-line-strong)] bg-[color-mix(in_srgb,var(--u-card)_85%,transparent)] px-4 py-2 text-xs tracking-[0.2em] whitespace-nowrap text-[var(--u-ink-soft)] uppercase backdrop-blur-sm"
        >
          <span className="relative h-5 w-px overflow-hidden bg-[var(--u-line-strong)]">
            <span className="u-scroll-cue absolute inset-x-0 top-0 h-2 bg-[var(--u-red)]" />
          </span>
          {copy.hero.scroll}
        </motion.p>
      </div>
    </section>
  );
}

/** Letras que sobem de dentro de uma máscara, uma a uma (como no "Bem-vindo" da intro). */
function RisingWord({ text, delay, className = "" }) {
  return (
    <span aria-hidden className={`inline-block ${className}`}>
      {[...text].map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.95, delay: delay + i * 0.05, ease: EASE }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
