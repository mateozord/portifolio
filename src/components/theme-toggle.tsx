"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

// O tema vive na classe .dark do <html> (aplicada antes da pintura pelo script do layout).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduceMotion = useReducedMotion();

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = !isDark;
    const apply = () => {
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        // Sem armazenamento: o tema vale só nesta visita.
      }
    };

    if (reduceMotion || typeof document.startViewTransition !== "function") {
      apply();
      return;
    }

    // O novo tema se espalha num círculo que nasce no próprio botão.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    document
      .startViewTransition(apply)
      .ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      aria-label={isDark ? labels.toLight : labels.toDark}
      title={isDark ? labels.toLight : labels.toDark}
      className="focus-ring border-line bg-surface text-ink-soft hover:text-ink grid h-9 w-9 place-items-center overflow-hidden rounded-full border transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="grid place-items-center"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
