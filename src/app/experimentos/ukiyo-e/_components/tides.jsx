"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, useVelocity } from "framer-motion";
import AnimatedSea from "./AnimatedSea";
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
  const reduceMotion = useReducedMotion();
  return (
    <motion.svg style={{ x }} className="absolute top-0 left-[-80px] h-full w-[calc(100%+160px)]">
      <defs>
        <pattern id={id} width="120" height="40" patternUnits="userSpaceOnUse">
          <path d={waveLine(120, 20, 6)} fill="none" stroke="var(--wv-mid)" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
          {!reduceMotion && (
            <animateTransform attributeName="patternTransform" type="translate" from="0 0" to={`${reverse ? -120 : 120} 0`} dur="9s" repeatCount="indefinite" />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </motion.svg>
  );
}

/**
 * Antes do rodapé, a maré sobe: três fileiras do mesmo mar vivo do hero,
 * esfumadas no papel em cima e fundindo na cor do rodapé embaixo.
 */
export function FooterTides() {
  return (
    <div aria-hidden className="relative h-[220px] sm:h-[260px]">
      <AnimatedSea rows={[2, 3, 4]} waters={[0.42, 0.68, 0.98]} scale={0.8} parallax={false} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-[var(--u-footer)] to-transparent" />
    </div>
  );
}

/**
 * Fundo "Mizu": linhas de água bem sutis (padrão kanze-mizu) presas à tela,
 * andando mais devagar que a página. Enquanto a página rola, um filtro de
 * turbulência distorce as linhas como água; parado, o filtro sai (sem custo).
 */
export function MizuBackground() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduceMotion = useReducedMotion();
  const rectRef = useRef(null);
  const patternRef = useRef(null);
  const displaceRef = useRef(null);
  const turbulenceRef = useRef(null);
  const target = useRef(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  // O fundo anda a 15% da velocidade da página (parallax)
  useMotionValueEvent(scrollY, "change", (y) => {
    patternRef.current?.setAttribute("patternTransform", `translate(0 ${-(y * 0.15) % 48})`);
  });

  useMotionValueEvent(velocity, "change", (v) => {
    target.current = Math.min(34, Math.abs(v) / 55);
  });

  useEffect(() => {
    if (reduceMotion) return undefined;
    let frame = 0;
    let current = 0;
    let time = 0;
    let last = performance.now();
    let filtered = false;
    const loop = (now) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      // Sobe rápido quando rola, acalma devagar quando para
      const rate = target.current > current ? 8 : 2.2;
      current += (target.current - current) * Math.min(1, dt * rate);
      target.current *= Math.pow(0.1, dt);
      const active = current > 0.4;
      if (active !== filtered) {
        filtered = active;
        if (active) rectRef.current?.setAttribute("filter", `url(#mizu-${id})`);
        else rectRef.current?.removeAttribute("filter");
      }
      if (active) {
        displaceRef.current?.setAttribute("scale", current.toFixed(2));
        turbulenceRef.current?.setAttribute(
          "baseFrequency",
          `${(0.005 + 0.0015 * Math.sin(time * 0.9)).toFixed(4)} ${(0.018 + 0.004 * Math.cos(time * 0.7)).toFixed(4)}`,
        );
      }
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [id, reduceMotion]);

  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full">
      <defs>
        <pattern ref={patternRef} id={`kanze-${id}`} width="160" height="48" patternUnits="userSpaceOnUse">
          {/* Linhas de água em duas alturas, defasadas (kanze-mizu simplificado) */}
          <path d={waveLine(160, 16, 5)} fill="none" stroke="var(--u-mizu-line)" strokeWidth="1.4" />
          <path d={waveLine(160, 40, 4)} fill="none" stroke="var(--u-mizu-line)" strokeWidth="1" transform="translate(80 0)" />
        </pattern>
        <filter id={`mizu-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence ref={turbulenceRef} type="turbulence" baseFrequency="0.005 0.018" numOctaves="1" seed="4" />
          <feDisplacementMap ref={displaceRef} in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect ref={rectRef} width="100%" height="100%" fill={`url(#kanze-${id})`} />
    </svg>
  );
}
