"use client";

import { useEffect } from "react";

// Animações infinitas que repintam a tela; fora da tela ficam pausadas (.anim-off em globals.css)
const SELECTOR = ".text-brand, .spin-border, .shine, .sparkle";

/**
 * Pausa as animações decorativas que não estão visíveis. Rodando todas ao
 * mesmo tempo, o navegador recalculava ~40 elementos a cada quadro e a rolagem
 * caía para ~40 fps no desktop.
 */
export function PauseOffscreen() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("anim-off", !e.isIntersecting)),
      { rootMargin: "120px" },
    );
    // shortcut: só observa o que existe ao montar; algo criado depois (ex.: o modal) anima sempre, o que é ok
    document.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
