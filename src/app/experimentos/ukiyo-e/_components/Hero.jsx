"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "@/content/portfolio-content";
import { WhatsappIcon } from "@/components/brand-icons";
import { seededRandom } from "../_lib/random";
import AnimatedSea from "./AnimatedSea";
import { Magnetic } from "@/components/motion-primitives";
import { EASE, InkLink, Kumo, Seal } from "./ornaments";

// Estrelas em posições fixas (só aparecem à noite: a cor vem de --u-star)
const STARS = (() => {
  const rand = seededRandom(42);
  return Array.from({ length: 50 }, () => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 48).toFixed(2)}%`,
    size: 1 + Math.round(rand() * 2),
    delay: `${(-rand() * 3).toFixed(2)}s`,
  }));
})();

export default function Hero({ dictionary, copy }) {
  const reduceMotion = useReducedMotion();
  const hero = dictionary.hero;

  // Mizu: o céu quase não sai do lugar ao rolar (está longe), o mar tem
  // parallax por fileira (no AnimatedSea) e o texto sobe mais rápido e esmaece.
  const { scrollY } = useScroll();
  const depth = reduceMotion ? 0 : 1;
  const skyY = useTransform(scrollY, (s) => s * 0.45 * depth);
  const textY = useTransform(scrollY, (s) => s * -0.12 * depth);
  const textOpacity = useTransform(scrollY, [0, 520], [1, reduceMotion ? 1 : 0], { clamp: true });

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section id="top" className="relative isolate flex flex-col overflow-hidden lg:block lg:h-[100svh] lg:min-h-[660px]">
      {/* Céu: degradê, estrelas (noite), sol ou lua nascendo e nuvens kumo */}
      <motion.div aria-hidden style={{ y: skyY }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--u-sky-top),var(--u-sky-bottom))]" />
        {STARS.map((star, i) => (
          <span
            key={i}
            className="u-twinkle absolute rounded-full bg-[var(--u-star)]"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }}
          />
        ))}
        <motion.span
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: EASE }}
          className="absolute top-[13%] right-[6%] size-[24vmin] rounded-full bg-[var(--u-orb)] shadow-[0_0_120px_40px_var(--u-orb-glow)] sm:top-[16%] sm:right-[8%] lg:top-[14%] lg:right-[12%] lg:size-[24vmin]"
        />
        <div className="u-drift absolute top-[18%] right-[-6%] w-[40vmin] sm:top-[22%] sm:right-[2%] lg:top-[26%] lg:right-[6%] lg:w-[36vmin]" style={{ animationDuration: "16s" }}>
          <Kumo className="h-auto w-full" />
        </div>
        <div className="u-drift absolute top-[12%] left-[46%] hidden w-[24vmin] opacity-80 lg:block" style={{ animationDuration: "22s", animationDelay: "-6s" }}>
          <Kumo className="h-auto w-full" />
        </div>
        {/* Monte Fuji no horizonte, atrás das ondas */}
        <svg
          viewBox="0 0 300 120"
          className="absolute right-[20%] bottom-[31%] hidden w-[20vw] max-w-[320px] lg:block"
        >
          <path d="M0 120 Q90 70 132 18 Q150 4 168 18 Q210 70 300 120 Z" fill="var(--u-fuji)" stroke="var(--wv-outline)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M112 42 L132 18 Q150 4 168 18 L188 42 L176 38 L166 52 L156 38 L146 52 L136 38 L126 50 Z" fill="var(--u-fuji-snow)" stroke="var(--wv-outline)" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* O mar: fileiras de ondas vivas */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.1, ease: EASE }}
        className="relative order-2 h-[44svh] min-h-[320px] w-full lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[42%]"
      >
        <AnimatedSea className="absolute inset-0" />
      </motion.div>

      {/* Texto: no céu, à esquerda */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 order-1 mx-auto w-full max-w-6xl px-5 pt-28 pb-6 sm:px-8 lg:pt-[11svh]"
      >
        <motion.div {...fadeUp(0.15)} className="flex flex-wrap items-center gap-3">
          <Seal size="sm">波</Seal>
          <span className="font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">
            {copy.hero.label} · São Paulo
          </span>
        </motion.div>

        <h1
          aria-label="Mateus Fantin"
          className="u-mincho mt-5 text-[3.3rem] leading-[0.98] font-extrabold tracking-tight sm:text-7xl lg:text-[clamp(3.2rem,4.6vw,5.6rem)]"
        >
          <RisingWord text="Mateus" delay={0.25} />
          <br />
          <RisingWord text="Fantin" delay={0.55} className="text-[var(--u-accent)]" />
        </h1>

        <motion.p {...fadeUp(0.9)} className="u-mincho mt-5 max-w-md text-2xl leading-snug font-semibold text-balance lg:text-[1.6rem]">
          {copy.hero.lead}
        </motion.p>
        <motion.p {...fadeUp(1.05)} className="mt-3 max-w-md leading-relaxed text-pretty text-[var(--u-ink-soft)]">
          {copy.hero.body}
        </motion.p>

        <motion.div {...fadeUp(1.2)} className="mt-7 flex flex-wrap gap-3">
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

        <motion.p {...fadeUp(1.35)} className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--u-muted)] lg:hidden">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {hero.availability}
        </motion.p>
      </motion.div>

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
