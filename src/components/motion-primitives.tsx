"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useSpring } from "framer-motion";
import { cn, EASE_OUT } from "@/lib/cn";

/** Aparece deslizando para cima quando entra na tela. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

// Estilo lusion.co: cada palavra sobe de baixo de uma "linha" invisível
// (máscara), com um leve giro que se endireita. É uma transição CSS (classe
// .heading-word em globals.css), que roda no compositor: nada de JS por quadro.
const WORD_STAGGER = 0.055;

/**
 * Divide "texto *destaque* texto" em palavras. As destacadas recebem a
 * posição entre os destaques (`order`), usada para defasar o brilho.
 */
function splitWords(text: string) {
  const words: { word: string; highlight: boolean; order: number }[] = [];
  let order = 0;
  text.split("*").forEach((part, index) => {
    const highlight = index % 2 === 1;
    for (const word of part.split(/\s+/).filter(Boolean)) {
      words.push({ word, highlight, order: highlight ? order++ : 0 });
    }
  });
  return words;
}

/**
 * Título que surge palavra por palavra, subindo de dentro de uma máscara. Trechos entre
 * *asteriscos* viram itálico serifado com o gradiente da marca.
 */
export function AnimatedHeading({
  text,
  as = "h2",
  className,
  delay = 0,
  onMount = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  /** true: anima ao carregar a página (hero); false: ao entrar na tela. */
  onMount?: boolean;
}) {
  const Tag = as;
  const words = splitWords(text);
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const shown = onMount || inView;

  return (
    <Tag ref={ref} className={className} data-shown={shown || undefined}>
      {words.map(({ word, highlight, order }, i) => (
        <span key={i}>
          {/* A máscara: folga embaixo e dos lados para descendentes e itálico */}
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] pr-[0.06em] -mr-[0.06em] align-bottom">
            <span
              className={cn("heading-word inline-block origin-bottom-left", highlight && "font-serif-italic text-brand")}
              style={{
                transitionDelay: `${delay + i * WORD_STAGGER}s`,
                // O brilho do gradiente "corre" de uma palavra para a outra.
                ...(highlight ? { animationDelay: `${-order * 0.7}s` } : null),
              }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  compact = false,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Título menor, para colunas estreitas. */
  compact?: boolean;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      <Reveal>
        <p className={cn("eyebrow flex items-center gap-3", centered && "justify-center")}>
          <span aria-hidden className="bg-brand h-px w-8" />
          {eyebrow}
        </p>
      </Reveal>
      <AnimatedHeading
        text={title}
        className={cn(
          "mt-5 leading-[1.05] font-semibold tracking-[-0.03em] text-balance",
          compact ? "text-4xl sm:text-5xl" : "text-4xl sm:text-5xl md:text-6xl",
        )}
      />
      {subtitle ? (
        <Reveal delay={0.15}>
          <p className="text-muted mt-5 text-lg leading-relaxed text-pretty">{subtitle}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Puxa o conteúdo levemente na direção do cursor (botões "magnéticos"). */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
