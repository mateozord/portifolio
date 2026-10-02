"use client";

import type { PointerEvent, ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, Database } from "lucide-react";
import { profile, type PortfolioDictionary } from "@/content/portfolio-content";
import { AnimatedHeading, Magnetic } from "@/components/motion-primitives";
import { RainbowStars } from "@/components/rainbow-stars";
import { WhatsappIcon } from "@/components/brand-icons";
import { cn, EASE_OUT } from "@/lib/cn";
import { LiquidBlob } from "@/components/liquid-blob";

const PARALLAX_SPRING = { stiffness: 70, damping: 20, mass: 0.8 };

export function Hero({ dictionary }: { dictionary: PortfolioDictionary }) {
  const hero = dictionary.hero;
  const reduceMotion = useReducedMotion();

  // Posição do cursor no hero, de -0.5 a 0.5 em cada eixo.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, PARALLAX_SPRING);
  const smoothY = useSpring(pointerY, PARALLAX_SPRING);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT },
  });

  return (
    <section
      id="top"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-36 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-28 lg:pb-24"
    >
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      {/* Líquido 3D (WebGL) atrás da pilha de telas, puxado pelo cursor */}
      <LiquidBlob className="pointer-events-none absolute top-0 right-[-12%] -z-10 h-full w-[85%] opacity-90 [mask-image:linear-gradient(to_right,transparent,#000_22%)] lg:right-[-6%] lg:w-[64%]" />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <motion.p {...fadeUp(0.1)} className="chip px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {hero.availability}
          </motion.p>

          <AnimatedHeading
            as="h1"
            onMount
            delay={0.2}
            text={hero.title}
            className="mt-7 text-[2.65rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-[4.4rem]"
          />

          <motion.p
            {...fadeUp(0.75)}
            className="text-muted mt-7 max-w-xl text-lg leading-relaxed text-pretty sm:text-xl"
          >
            {hero.intro}
          </motion.p>

          <motion.div {...fadeUp(0.9)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                className="focus-ring bg-ink text-bg group relative inline-flex items-center gap-2 overflow-hidden rounded-full py-3.5 pr-5 pl-6 font-semibold shadow-[0_18px_40px_-18px_rgb(91_61_245/0.7)] transition-shadow hover:shadow-[0_22px_50px_-16px_rgb(192_38_211/0.65)]"
              >
                <span aria-hidden className="bg-brand absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative">{hero.ctaPrimary}</span>
                <ArrowDown className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href={profile.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring border-line-strong bg-surface hover:border-ink/40 inline-flex items-center gap-2 rounded-full border py-3.5 pr-6 pl-5 font-semibold backdrop-blur transition-colors"
              >
                <WhatsappIcon className="h-4 w-4 text-emerald-500" />
                {hero.ctaSecondary}
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul {...fadeUp(1.05)} className="text-muted mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {hero.proof.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="bg-brand h-1.5 w-1.5 rounded-full" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <ScreenStack x={smoothX} y={smoothY} dictionary={dictionary} />
      </div>
    </section>
  );
}

/** Pilha de telas dos projetos, com profundidade e parallax pelo cursor. */
function ScreenStack({
  x,
  y,
  dictionary,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  dictionary: PortfolioDictionary;
}) {
  const hero = dictionary.hero;
  const rotateY = useTransform(x, (v) => v * 10);
  const rotateX = useTransform(y, (v) => v * -8);

  return (
    <motion.div
      aria-hidden
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      className="relative mx-auto aspect-[10/9] w-full max-w-[34rem] lg:max-w-none"
    >
      <Layer x={x} y={y} depth={-18} className="top-[4%] left-0 w-[70%]" rotate={-7} delay={0.35} float={8}>
        <BrowserFrame src="/projects/pulso/home.webp" url="PULSO" />
      </Layer>
      <Layer x={x} y={y} depth={14} className="top-0 right-0 w-[68%]" rotate={6} delay={0.5} float={9}>
        <BrowserFrame src="/projects/aeropulse/home.webp" url="aeropulse-eight.vercel.app" />
      </Layer>
      <Layer x={x} y={y} depth={34} className="bottom-[4%] left-[10%] w-[80%]" rotate={-1.5} delay={0.65} float={7}>
        <BrowserFrame src="/projects/cozylog/diary.webp" url="cozylog.vercel.app" highlight />
      </Layer>

      <Layer x={x} y={y} depth={56} className="top-[30%] -right-2 sm:right-[-4%]" delay={1.1} float={5}>
        <FloatingChip>
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {hero.floatingLive}
        </FloatingChip>
      </Layer>
      <Layer x={x} y={y} depth={64} className="bottom-0 right-[6%]" delay={1.25} float={6}>
        <FloatingChip>
          <RainbowStars size={13} delay={1.4} />
          <span className="font-semibold">{hero.floatingMasterpiece}</span>
        </FloatingChip>
      </Layer>
      <Layer x={x} y={y} depth={48} className="top-[46%] -left-3 hidden sm:block" delay={1.4} float={6.5}>
        <FloatingChip>
          <Database className="text-accent h-3.5 w-3.5" />
          {hero.floatingStack}
        </FloatingChip>
      </Layer>
    </motion.div>
  );
}

function Layer({
  x,
  y,
  depth,
  rotate = 0,
  delay,
  float,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  rotate?: number;
  delay: number;
  float: number;
  className?: string;
  children: ReactNode;
}) {
  // Camadas "mais perto" (depth maior) se movem mais: dá a sensação de profundidade.
  const translateX = useTransform(x, (v) => v * depth);
  const translateY = useTransform(y, (v) => v * depth);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div style={{ x: translateX, y: translateY }} className={cn("absolute", className)}>
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: 0, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 16, delay }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: float, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BrowserFrame({ src, url, highlight = false }: { src: string; url: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#101015] shadow-[var(--shadow-lift)]",
        highlight && "spin-border is-on",
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#16161d] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-white/50">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={src}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1024px) 34vw, 80vw"
          className="object-cover object-top"
        />
        {highlight && <div className="shine" />}
      </div>
    </div>
  );
}

function FloatingChip({ children }: { children: ReactNode }) {
  return (
    <div className="card text-ink flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap">
      {children}
    </div>
  );
}
