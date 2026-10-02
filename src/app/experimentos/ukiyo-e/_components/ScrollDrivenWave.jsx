"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { createWaveBreak } from "../_lib/wave-break";
import { useNight } from "../_lib/use-night";

/**
 * Canvas da onda que quebra com o scroll. Recebe o progresso do scroll do
 * hero (0 → 1, do useScroll do container) e o suaviza com uma mola, para a
 * água responder com inércia de líquido em vez de seguir a roda do mouse.
 */
export default function ScrollDrivenWave({ progress, className = "" }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const night = useNight();
  const reduceMotion = useReducedMotion();
  const fluid = useSpring(progress, { stiffness: 70, damping: 22, mass: 0.7, restDelta: 0.0005 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const paper = () => getComputedStyle(canvas.closest(".ukiyo") ?? document.body).getPropertyValue("--u-bg").trim() || "#f5f0e6";
    const scene = createWaveBreak(canvas, {
      night: document.documentElement.classList.contains("dark"),
      animated: !reduceMotion,
      background: paper(),
    });
    scene.setProgress(fluid.get());
    sceneRef.current = scene;
    return () => scene.destroy();
  }, [reduceMotion, fluid]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.setNight(night);
    // A cor do papel muda com o tema: lê de novo depois que a classe .dark aplicar
    requestAnimationFrame(() => {
      const value = getComputedStyle(canvasRef.current?.closest(".ukiyo") ?? document.body).getPropertyValue("--u-bg").trim();
      if (value) scene.setBackground(value);
    });
  }, [night]);

  useMotionValueEvent(fluid, "change", (value) => sceneRef.current?.setProgress(value));

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
