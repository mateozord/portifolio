"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { createKoiPond } from "@/lib/koi-pond";

/**
 * Lago de koi nas cores da marca (motor em lib/koi-pond.js). Os peixes nadam
 * atrás do conteúdo, seguem o cursor e comem a ração de um clique na água.
 * Acompanha o tema claro/escuro e pausa fora da tela.
 */
export function KoiPond({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const root = document.documentElement;
    const pond = createKoiPond(canvas, { animated: !reduceMotion, night: root.classList.contains("dark") });
    const observer = new MutationObserver(() => pond.setNight(root.classList.contains("dark")));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      pond.destroy();
    };
  }, [reduceMotion]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
