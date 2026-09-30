"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/content/portfolio-content";
import { setLocale } from "@/lib/locale-store";
import { cn } from "@/lib/cn";

const LOCALES: Locale[] = ["pt", "en"];

export function LocaleToggle({ locale }: { locale: Locale }) {
  return (
    <div className="border-line bg-surface flex rounded-full border p-0.5 font-mono text-[11px] font-semibold uppercase">
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            lang={code === "pt" ? "pt-BR" : "en"}
            className="focus-ring relative rounded-full px-2.5 py-1.5"
          >
            {active && (
              <motion.span
                layoutId="locale-pill"
                className="bg-ink absolute inset-0 rounded-full"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className={cn("relative z-10 transition-colors", active ? "text-bg" : "text-muted hover:text-ink")}>
              {code}
            </span>
          </button>
        );
      })}
    </div>
  );
}
