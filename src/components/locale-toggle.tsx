"use client";

import type { Locale } from "@/content/portfolio-content";

type LocaleToggleProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

export function LocaleToggle({ locale, onChange }: LocaleToggleProps) {
  return (
    <div className="ml-auto flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => onChange("pt")}
        className={`rounded-full px-3 py-1 transition ${
          locale === "pt"
            ? "bg-violet-400 text-[#0b1126]"
            : "border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10"
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`rounded-full px-3 py-1 transition ${
          locale === "en"
            ? "bg-violet-400 text-[#0b1126]"
            : "border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10"
        }`}
      >
        EN
      </button>
    </div>
  );
}
