"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Seigaiha (青海波, "ondas do mar azul"): o padrão tradicional japonês de
 * escamas em arcos concêntricos. Deriva devagar, bem sutil, atrás do céu.
 */
export default function SeigaihaPattern({ className }) {
  const id = `seigaiha-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reduceMotion = useReducedMotion();
  const arcs = [20, 15, 10, 5];

  return (
    <svg aria-hidden className={className} width="100%" height="100%">
      <defs>
        <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
          {/* Leques de cima para baixo: cada fileira cobre a de trás. O leque em
              (20, 30) repete o topo da fileira seguinte para o bloco emendar sem costura. */}
          {[
            [20, 10],
            [0, 20],
            [40, 20],
            [20, 30],
          ].map(([cx, cy]) =>
            arcs.map((r) => (
              <path
                key={`${cx}-${cy}-${r}`}
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill={r === 20 ? "#08070c" : "none"}
                stroke="rgba(165, 180, 252, 0.55)"
                strokeWidth="0.8"
              />
            )),
          )}
          {!reduceMotion && (
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to="40 0"
              dur="18s"
              repeatCount="indefinite"
            />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
