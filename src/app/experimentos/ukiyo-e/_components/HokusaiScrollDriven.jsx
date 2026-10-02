"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMotionValueEvent, useReducedMotion } from "framer-motion";
import { createHokusaiBreak } from "../_lib/hokusai-break";
import { useNight } from "../_lib/use-night";

export const PRINT = {
  image: "/ukiyo/great-wave-2400.webp",
  imageSmall: "/ukiyo/great-wave-1400.webp",
  mask: "/ukiyo/great-wave-mask.png",
  aspect: 2400 / 1613,
  alt: "A Grande Onda de Kanagawa, gravura de Katsushika Hokusai (c. 1831)",
};

/**
 * A Grande Onda real quebrando com o scroll.
 *
 * `progress`: MotionValue 0..1 (o scroll do hero, já suavizado por mola).
 * `desktop` / `mobile`: enquadramento { focus: [x, y], zoom, css } — `css`
 * é o object-position equivalente para a <img> de reserva.
 *
 * Camadas: <img> estática (aparece na hora e é a reserva sem WebGL) →
 * canvas WebGL com a gravura deformada → canvas 2D com as gotas.
 */
export default function HokusaiScrollDriven({ progress, desktop, mobile = desktop, className = "" }) {
  const glRef = useRef(null);
  const fxRef = useRef(null);
  const sceneRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const night = useNight();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!glRef.current || !fxRef.current) return undefined;
    const media = window.matchMedia("(min-width: 1024px)");
    const frame = () => (media.matches ? desktop : mobile);
    let cancelled = false;

    createHokusaiBreak({
      gl: glRef.current,
      fx: fxRef.current,
      image: media.matches ? PRINT.image : PRINT.imageSmall,
      mask: PRINT.mask,
      aspect: PRINT.aspect,
      focus: frame().focus,
      zoom: frame().zoom ?? 1,
      night: document.documentElement.classList.contains("dark"),
      animated: !reduceMotion,
      onReady: () => !cancelled && setReady(true),
      isCancelled: () => cancelled,
    })
      .then((scene) => {
        if (!scene) return;
        if (cancelled) return scene.destroy();
        scene.setProgress(progress.get());
        sceneRef.current = scene;
      })
      .catch(() => !cancelled && setFailed(true));

    const onChange = () => sceneRef.current?.setFrame(frame().focus, frame().zoom ?? 1);
    media.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      media.removeEventListener("change", onChange);
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
    // Enquadramento fixo por uso; a cena só é recriada se o movimento reduzido mudar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  useEffect(() => {
    sceneRef.current?.setNight(night);
  }, [night]);

  useMotionValueEvent(progress, "change", (value) => sceneRef.current?.setProgress(value));

  return (
    <div className={`overflow-hidden bg-[#e9dcc0] dark:bg-[#0c1328] ${className}`}>
      <Image
        src={PRINT.image}
        alt={PRINT.alt}
        fill
        unoptimized
        preload
        sizes="100vw"
        style={{ "--pos-m": mobile.css, "--pos-d": desktop.css }}
        className={`object-cover [object-position:var(--pos-m)] lg:[object-position:var(--pos-d)] ${failed ? "dark:brightness-[0.45]" : ""}`}
      />
      <canvas
        ref={glRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready && !failed ? "opacity-100" : "opacity-0"}`}
      />
      <canvas ref={fxRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
