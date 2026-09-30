"use client";

import type { PointerEvent } from "react";
import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const TILT_SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

/**
 * Inclinação 3D que segue o cursor + reflexo de luz ("glare"), no estilo
 * dos cards do CozyLog. Só reage a mouse, e desliga com movimento reduzido.
 */
export function useTilt(maxTilt = 6) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [maxTilt, -maxTilt]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-maxTilt, maxTilt]), TILT_SPRING);
  const glareX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(440px circle at ${glareX} ${glareY}, var(--glare), transparent 50%)`;

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return { rotateX, rotateY, glare, onPointerMove, reset, enabled: !reduceMotion };
}
