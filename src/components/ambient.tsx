"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Manchas de luz desfocadas que flutuam devagar atrás de toda a página. */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob -top-48 -left-40 h-[36rem] w-[36rem]" style={{ background: "var(--blob-1)" }} />
      <div
        className="blob top-1/4 -right-48 h-[40rem] w-[40rem]"
        style={{ background: "var(--blob-2)", animationDelay: "-7s" }}
      />
      <div
        className="blob -bottom-56 left-1/4 h-[32rem] w-[32rem]"
        style={{ background: "var(--blob-3)", animationDelay: "-14s" }}
      />
    </div>
  );
}

/** Barra fina no topo que acompanha a rolagem da página. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="bg-brand fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
      style={{ scaleX }}
    />
  );
}
