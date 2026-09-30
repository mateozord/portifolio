"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { createWaveScene } from "./wave-engine";

/** Canvas com as ondas animadas. Com movimento reduzido, fica um quadro estático. */
export default function WaveCanvas({ className }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const scene = createWaveScene(canvasRef.current, { animated: !reduceMotion });
    return () => scene.destroy();
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
