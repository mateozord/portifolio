"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { RainbowStars } from "@/components/rainbow-stars";

/**
 * A pilha de telas do hero clássico, trazida para cá: três projetos em
 * molduras de navegador, com profundidade, flutuação e parallax pelo cursor.
 * Entram em cascata quando a seção aparece na tela.
 */
export default function ScreenStack({ labels, className = "" }) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 70, damping: 20, mass: 0.8 });
  const y = useSpring(pointerY, { stiffness: 70, damping: 20, mass: 0.8 });
  const rotateY = useTransform(x, (v) => v * 10);
  const rotateX = useTransform(y, (v) => v * -8);

  const onPointerMove = (event) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className={className}
    >
      <motion.div
        aria-hidden
        style={{ rotateX, rotateY, transformPerspective: 1400 }}
        className="relative mx-auto aspect-[10/9] w-full max-w-[34rem]"
      >
        <Layer x={x} y={y} depth={-18} className="top-[4%] left-0 w-[70%]" rotate={-7} delay={0.1} float={8}>
          <BrowserFrame src="/projects/pulso/home.webp" url="PULSO" />
        </Layer>
        <Layer x={x} y={y} depth={14} className="top-0 right-0 w-[68%]" rotate={6} delay={0.25} float={9}>
          <BrowserFrame src="/projects/aeropulse/home.webp" url="aeropulse-eight.vercel.app" />
        </Layer>
        <Layer x={x} y={y} depth={34} className="bottom-[4%] left-[10%] w-[80%]" rotate={-1.5} delay={0.4} float={7}>
          <BrowserFrame src="/projects/cozylog/diary.webp" url="cozylog.vercel.app" highlight />
        </Layer>

        <Layer x={x} y={y} depth={56} className="top-[30%] -right-2 sm:right-[-4%]" delay={0.85} float={5}>
          <Chip>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {labels.floatingLive}
          </Chip>
        </Layer>
        <Layer x={x} y={y} depth={64} className="right-[6%] bottom-0" delay={1} float={6}>
          <Chip>
            <RainbowStars size={13} delay={1.2} />
            <span className="font-semibold">{labels.floatingMasterpiece}</span>
          </Chip>
        </Layer>
        <Layer x={x} y={y} depth={48} className="top-[46%] -left-3 hidden sm:block" delay={1.15} float={6.5}>
          <Chip>
            <span className="u-mincho text-[var(--u-red)]">数</span>
            {labels.floatingStack}
          </Chip>
        </Layer>
      </motion.div>
    </div>
  );
}

function Layer({ x, y, depth, rotate = 0, delay, float, className, children }) {
  // Camadas mais "perto" (depth maior) se movem mais: dá profundidade.
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div style={{ x: tx, y: ty }} className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
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

function BrowserFrame({ src, url, highlight = false }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--u-line-strong)] bg-[#101015] shadow-[0_30px_60px_-24px_rgb(16_31_85/0.55)] ${
        highlight ? "spin-border is-on" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#16161d] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-white/50">{url}</span>
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={src} alt="" fill sizes="(min-width: 1024px) 34vw, 80vw" className="object-cover object-top" />
        {highlight && <div className="shine" />}
      </div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--u-line-strong)] bg-[var(--u-card)] px-3.5 py-2 text-xs font-medium whitespace-nowrap text-[var(--u-ink)] shadow-[var(--u-shadow)]">
      {children}
    </div>
  );
}
