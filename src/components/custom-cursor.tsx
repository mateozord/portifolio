"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = "a, button, [role='button'], [data-cursor], label, summary";

// Só com mouse e sem "reduzir movimento"
const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Cursor próprio no estilo lusion.co: um ponto preciso e um anel que segue
 * com mola. Sobre algo clicável o anel cresce; com `data-cursor="Texto"` ele
 * vira uma bolha com o rótulo (ex.: "Abrir" nos projetos). Só em mouse.
 */
export function CustomCursor() {
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add("has-cursor");

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      setHover(Boolean(target));
      setLabel(target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor || null);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 104 : hover ? 56 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[400]" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}>
      {/* Anel (ou bolha com rótulo) */}
      <motion.div className="absolute top-0 left-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
          animate={{
            width: size,
            height: size,
            scale: pressed ? 0.85 : 1,
            backgroundColor: label ? "var(--accent)" : "rgba(0,0,0,0)",
            borderColor: label ? "rgba(0,0,0,0)" : "var(--ink)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{ borderWidth: 1.5, borderStyle: "solid", opacity: label ? 0.95 : 0.55 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="text-bg px-2 text-center text-[11px] leading-tight font-semibold tracking-wide uppercase"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {/* Ponto preciso */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.div
          className="bg-ink -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ width: hover ? 0 : 6, height: hover ? 0 : 6 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
}
