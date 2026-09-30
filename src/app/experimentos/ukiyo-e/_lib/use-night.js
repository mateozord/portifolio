"use client";

import { useSyncExternalStore } from "react";

// Dia/noite usa a mesma classe .dark e a mesma chave "theme" do site principal,
// aplicadas antes da primeira pintura pelo script do layout raiz.
function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function useNight() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Troca dia/noite com um círculo que se espalha a partir de (x, y). */
export function setNight(night, origin) {
  const apply = () => {
    document.documentElement.classList.toggle("dark", night);
    try {
      localStorage.setItem("theme", night ? "dark" : "light");
    } catch {
      // Sem armazenamento: vale só nesta visita.
    }
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof document.startViewTransition !== "function" || !origin) {
    apply();
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  document
    .startViewTransition(apply)
    .ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}
