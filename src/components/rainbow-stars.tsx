"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

const RAINBOW = ["#f472b6", "#fb923c", "#fbbf24", "#34d399", "#38bdf8", "#a78bfa", "#f472b6"];
const STAR_COUNT = 5;

/** Pontos de uma estrela de 5 pontas centrada em (cx, cy). */
function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return points.join(" ");
}

/**
 * Cinco estrelas com preenchimento rainbow animado, como no selo
 * Rainbow Masterpiece do CozyLog. Todas compartilham um único gradiente
 * em userSpaceOnUse, então o arco-íris flui de uma estrela para a outra.
 */
export function RainbowStars({ size = 16, gap = 3, delay = 0 }: { size?: number; gap?: number; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const gradientId = `rainbow-stars-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const width = size * STAR_COUNT + gap * (STAR_COUNT - 1);
  const outer = size / 2 - 1;
  const inner = outer * 0.5;

  return (
    <svg
      aria-hidden
      width={width}
      height={size}
      viewBox={`0 0 ${width} ${size}`}
      className="shrink-0 overflow-visible drop-shadow-[0_0_6px_rgba(244,114,182,0.45)]"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={width}
          y2="0"
          spreadMethod="repeat"
        >
          {RAINBOW.map((color, i) => (
            <stop key={i} offset={i / (RAINBOW.length - 1)} stopColor={color} />
          ))}
          {!reduceMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="0 0"
              to={`${width} 0`}
              dur="2.4s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>

      {Array.from({ length: STAR_COUNT }, (_, i) => {
        const cx = i * (size + gap) + size / 2;
        return (
          <motion.polygon
            key={i}
            points={starPoints(cx, size / 2 + 0.5, outer, inner)}
            fill={`url(#${gradientId})`}
            stroke={`url(#${gradientId})`}
            strokeWidth={1.4}
            strokeLinejoin="round"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 0, rotate: -40, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 16, delay: delay + i * 0.07 }}
          />
        );
      })}
    </svg>
  );
}
