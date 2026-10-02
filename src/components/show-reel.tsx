"use client";

import { useRef, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import type { PortfolioDictionary, Project } from "@/content/portfolio-content";

const DESKTOP = "(min-width: 768px)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(DESKTOP);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// Medidas do filme de janelas (em vw): largura de cada janela e espaço entre elas
const FILM = { desktop: { item: 34, gap: 5 }, mobile: { item: 74, gap: 7 } };

/**
 * Showreel no estilo do "Play Reel" do lusion.co. A seção fica presa na tela:
 * 1. as duas palavras gigantes aparecem com um card pequeno e inclinado no vão;
 * 2. rolando, o card se endireita e cresce, empurrando as palavras para fora
 *    e cobrindo-as até tomar a tela;
 * 3. dentro dele, os projetos em janelas de navegador deslizam na horizontal.
 * A velocidade da rolagem entorta o card (efeito gelatina) e depois ele volta.
 */
export function ShowReel({ dictionary }: { dictionary: PortfolioDictionary }) {
  const { words, cta, caption } = dictionary.reel;
  const projects = dictionary.projects.items;
  const reduceMotion = useReducedMotion();
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP).matches, () => true);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  // Gelatina: a velocidade da rolagem entorta o card
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 180, damping: 22 });
  const bend = useTransform(velocity, [-3000, 0, 3000], [-1, 0, 1], { clamp: true });

  // 0 → 0.4: o card se abre até tomar a tela
  const open = useTransform(progress, [0, 0.4], [0, 1], { clamp: true });
  // Escala uniforme (não recorte): o card pequeno é uma miniatura do palco inteiro
  const scale = useTransform(open, [0, 1], [desktop ? 0.26 : 0.4, 1]);
  // O raio compensa a escala para parecer sempre ~28px na tela, sumindo no fim
  const borderRadius = useTransform([open, scale], ([o, sc]: number[]) => `${((1 - o) * 28) / sc}px`);
  const rotateX = useTransform([open, bend], ([o, b]: number[]) => (1 - o) * 18 + b * 9);
  const rotateY = useTransform(open, [0, 1], [desktop ? -14 : -8, 0]);
  const rotateZ = useTransform(open, [0, 1], [desktop ? -7 : -4, 0]);
  const skewY = useTransform(bend, [-1, 1], [3, -3]);

  // As palavras acompanham a borda do card (meia largura projetada, com folga
  // para a inclinação 3D): ele nunca encosta nelas, e elas saem pelas laterais
  const push = useTransform(scale, (sc) => Math.max(0, (desktop ? 64 : 58) * sc - (desktop ? 17 : 21)));
  const firstWord = useTransform(push, (p) => (desktop ? `translateX(${-p}vw)` : `translateY(${-p}svh)`));
  const secondWord = useTransform(push, (p) => (desktop ? `translateX(${p}vw)` : `translateY(${p}svh)`));

  // 0.15 → 1: o filme de janelas desliza da primeira à última, centradas
  const { item, gap } = desktop ? FILM.desktop : FILM.mobile;
  const start = 50 - item / 2;
  const end = start - (projects.length - 1) * (item + gap);
  const filmX = useTransform(progress, [0.15, 1], [`${start}vw`, `${end}vw`]);
  const captionOpacity = useTransform(open, [0.75, 1], [0, 1]);

  if (reduceMotion) {
    return (
      <section className="bg-brand py-16">
        <div className="no-scrollbar flex gap-6 overflow-x-auto px-5">
          {projects.map((project) => (
            <ReelWindow key={project.slug} project={project} className="w-[80vw] shrink-0 md:w-[34vw]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label={`${words[0]} ${words[1]}`} className="relative h-[200svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-clip [perspective:1600px]">
        {/* Palavras gigantes (atrás do card) */}
        <div
          aria-hidden
          className="pointer-events-none flex flex-col items-center gap-[46svh] text-[clamp(3.4rem,15vw,8rem)] leading-none font-semibold tracking-[-0.05em] md:grid md:w-full md:grid-cols-[1fr_34vw_1fr] md:gap-0 md:text-[clamp(3.4rem,8.6vw,9.5rem)]"
        >
          {/* Grade de 3 colunas no desktop: o vão do card fica sempre no centro exato */}
          <motion.span style={{ transform: firstWord }} className="md:col-start-1 md:justify-self-end">
            {words[0]}
          </motion.span>
          <motion.span
            style={{ transform: secondWord }}
            className="font-serif-italic text-brand md:col-start-3 md:justify-self-start"
          >
            {words[1]}
          </motion.span>
        </div>

        {/* O card: palco no degradê da marca com os projetos */}
        <motion.a
          href="#projects"
          aria-label={cta}
          className="focus-ring absolute inset-0 z-10 block overflow-clip will-change-transform"
          style={{ scale, borderRadius, rotateX, rotateY, rotateZ, skewY }}
        >
          <div className="bg-brand absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_30%,rgb(10_8_20/0.45))]" />
            <motion.div className="absolute inset-y-0 left-0 flex items-center" style={{ x: filmX, gap: `${gap}vw` }}>
              {projects.map((project, i) => (
                <ReelWindow
                  key={project.slug}
                  project={project}
                  index={i}
                  progress={progress}
                  style={{ width: `${item}vw` }}
                />
              ))}
            </motion.div>
          </div>
          <motion.div
            style={{ opacity: captionOpacity }}
            className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 p-6 pt-24 text-white sm:p-10 sm:pt-28"
          >
            <p className="max-w-xs text-sm font-medium text-white/85 sm:text-base">{caption}</p>
            <p className="font-mono text-xs tracking-[0.2em] text-white/80 uppercase">{cta} ↗</p>
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}

/** Uma janela de navegador com a capa do projeto, nome e chamada embaixo. */
function ReelWindow({
  project,
  index = 0,
  progress,
  className,
  style,
}: {
  project: Project;
  index?: number;
  progress?: MotionValue<number>;
  className?: string;
  style?: CSSProperties;
}) {
  // Cada janela flutua num ritmo próprio enquanto o filme passa
  const fallback = useSpring(0);
  const y = useTransform(progress ?? fallback, [0, 1], index % 2 ? ["4%", "-4%"] : ["-4%", "4%"]);
  const rotate = index % 2 ? 1.5 : -1.5;
  const host = project.link ? new URL(project.link).host : `${project.slug}.app`;

  return (
    <motion.div className={className} style={{ ...style, y, rotate }}>
      <div className="overflow-hidden rounded-xl bg-[#111018] shadow-[0_40px_80px_-30px_rgb(10_5_30/0.75)] ring-1 ring-white/15">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 truncate rounded-md bg-white/8 px-2 py-0.5 font-mono text-[10px] text-white/60">{host}</span>
        </div>
        <div className="relative aspect-[16/10]">
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 34vw, 74vw"
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4 text-white">
        <p className="text-lg font-semibold tracking-tight sm:text-2xl">{project.title}</p>
        <p className="truncate text-xs text-white/75 sm:text-sm">{project.tagline}</p>
      </div>
    </motion.div>
  );
}
