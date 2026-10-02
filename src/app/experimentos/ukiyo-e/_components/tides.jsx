"use client";

import { useId, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import InkTide from "./InkTide";
import { Seal } from "./ornaments";

/**
 * Onda senoidal para usar dentro de um <pattern>. Desenha três períodos
 * (de -P a 2P) para o traço não ser cortado na emenda dos ladrilhos.
 */
function waveLine(period, y, amp) {
  const q = period / 4;
  let d = `M${-period} ${y}`;
  for (let k = -1; k < 2; k++) {
    const x = k * period;
    d += ` Q${x + q} ${y - amp} ${x + 2 * q} ${y} Q${x + 3 * q} ${y + amp} ${x + period} ${y}`;
  }
  return d;
}

/**
 * Divisória entre seções: uma linha d'água fina que ondula devagar e desliza
 * com a rolagem, com um carimbo no meio.
 */
export function TideDivider({ kanji = "波" }) {
  const ref = useRef(null);
  const id = `tide-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-60, 60]);

  return (
    <div ref={ref} aria-hidden className="relative mx-auto -my-4 flex h-10 max-w-6xl items-center gap-4 px-5 sm:px-8 md:-my-8">
      <div className="relative h-full flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_30%)]">
        <WaveStroke id={`${id}-l`} x={x} />
      </div>
      <Seal size="sm">{kanji}</Seal>
      <div className="relative h-full flex-1 overflow-hidden [mask-image:linear-gradient(to_left,transparent,#000_30%)]">
        <WaveStroke id={`${id}-r`} x={x} reverse />
      </div>
    </div>
  );
}

function WaveStroke({ id, x, reverse = false }) {
  return (
    <motion.div style={{ x }} className="absolute top-0 left-[-200px] h-full w-[calc(100%+400px)]">
    <svg
      className="u-slide block h-full"
      width="calc(100% + 120px)"
      style={{ "--slide": reverse ? "-120px" : "120px", marginLeft: reverse ? 0 : -120, animationDuration: "9s" }}
    >
      <defs>
        <pattern id={id} width="120" height="40" patternUnits="userSpaceOnUse">
          <path d={waveLine(120, 20, 6)} fill="none" stroke="var(--wv-mid)" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
    </motion.div>
  );
}

/**
 * Antes do rodapé, a mesma maré a nanquim do hero, fundindo na cor do rodapé.
 */
export function FooterTides() {
  return (
    <div aria-hidden className="relative h-[170px] sm:h-[210px]">
      <InkTide className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[var(--u-footer)] to-transparent" />
    </div>
  );
}

/**
 * Fundo "Mizu": linhas de água bem sutis (padrão kanze-mizu) presas à tela.
 * É estático de propósito: um fundo de tela cheia animado (ou com filtro)
 * obriga o navegador a redesenhar a página inteira a cada quadro de rolagem.
 */
export function MizuBackground() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full">
      <defs>
        <pattern id={`kanze-${id}`} width="160" height="48" patternUnits="userSpaceOnUse">
          <path d={waveLine(160, 16, 5)} fill="none" stroke="var(--u-mizu-line)" strokeWidth="1.4" />
          <path d={waveLine(160, 40, 4)} fill="none" stroke="var(--u-mizu-line)" strokeWidth="1" transform="translate(80 0)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#kanze-${id})`} />
    </svg>
  );
}
