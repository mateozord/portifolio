"use client";

import { motion, useReducedMotion } from "framer-motion";

// Posições fixas (não aleatórias) para as partículas não "pularem" a cada render.
const SPARKLES = [
  { top: "8%", left: "10%", size: 11, delay: 0, color: "#fff" },
  { top: "16%", left: "82%", size: 14, delay: 0.7, color: "#fde68a" },
  { top: "44%", left: "92%", size: 9, delay: 1.6, color: "#fff" },
  { top: "38%", left: "4%", size: 8, delay: 2.2, color: "#fbcfe8" },
  { top: "62%", left: "48%", size: 10, delay: 1.1, color: "#ddd6fe" },
  { top: "78%", left: "88%", size: 9, delay: 2.8, color: "#fed7aa" },
  { top: "88%", left: "20%", size: 8, delay: 3.3, color: "#e9d5ff" },
];

const SPARKLE_PATH =
  "M12 0C12.6 6.5 17.5 11.4 24 12C17.5 12.6 12.6 17.5 12 24C11.4 17.5 6.5 12.6 0 12C6.5 11.4 11.4 6.5 12 0Z";

/** Partículas brilhantes discretas; mais intensas quando `intense` (ex.: hover). */
export function SparkleField({ intense = false }: { intense?: boolean }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
      {SPARKLES.map((sparkle, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={sparkle.size}
          height={sparkle.size}
          className="absolute drop-shadow-[0_0_4px_rgba(255,255,255,0.9)]"
          style={{ top: sparkle.top, left: sparkle.left, color: sparkle.color }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: [0, intense ? 1 : 0.75, 0],
            scale: [0.3, intense ? 1.25 : 1, 0.3],
            rotate: [0, 90],
          }}
          transition={{
            duration: intense ? 1.6 : 2.6,
            repeat: Infinity,
            repeatDelay: intense ? 0.2 : 1.4,
            delay: sparkle.delay * (intense ? 0.4 : 1),
            ease: "easeInOut",
          }}
        >
          <path d={SPARKLE_PATH} fill="currentColor" />
        </motion.svg>
      ))}
    </div>
  );
}
