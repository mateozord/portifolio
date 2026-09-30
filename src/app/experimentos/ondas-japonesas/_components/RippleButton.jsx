"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const VARIANTS = {
  primary:
    "text-white bg-[linear-gradient(110deg,#2563eb,#7c3aed_55%,#a855f7)] shadow-[0_14px_40px_-14px_rgba(124,58,237,0.8)] ring-1 ring-white/15",
  glass:
    "text-slate-100 bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 hover:border-amber-400/50",
};

/**
 * Link-botão com efeito "ripple": uma ondulação nasce exatamente onde o
 * clique aconteceu. A navegação espera a ondulação aparecer antes de sair.
 */
export default function RippleButton({ href, variant = "primary", children }) {
  const router = useRouter();
  const [ripples, setRipples] = useState([]);

  const addRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const ripple = { id: `${event.timeStamp}-${event.clientX}`, x: event.clientX - rect.left, y: event.clientY - rect.top, size };
    setRipples((current) => [...current, ripple]);
  };

  const handleClick = (event) => {
    // Ctrl/Cmd/Shift/botão do meio continuam abrindo em nova aba normalmente.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    window.setTimeout(() => router.push(href), 320);
  };

  return (
    <motion.a
      href={href}
      onPointerDown={addRipple}
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative isolate inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${VARIANTS[variant]}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-white/40"
            style={{ left: ripple.x - ripple.size / 2, top: ripple.y - ripple.size / 2, width: ripple.size, height: ripple.size }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => setRipples((current) => current.filter((item) => item.id !== ripple.id))}
          />
        ))}
      </AnimatePresence>
    </motion.a>
  );
}
