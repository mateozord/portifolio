"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { profile, type Locale } from "@/content/portfolio-content";
import { setLocale, useLocale } from "@/lib/locale-store";

/** Tipos de negócio das demonstrações, como aparecem na mensagem. */
const KINDS = {
  academia: { pt: "academia", en: "gym" },
  mercado: { pt: "mercado", en: "grocery store" },
  restaurante: { pt: "restaurante", en: "restaurant" },
} as const;
export type DemoKind = keyof typeof KINDS;

const BAR = {
  pt: {
    back: "Voltar ao portfólio",
    backShort: "Portfólio",
    notice: "Demonstração · negócio fictício criado por Mateus Fantin",
    cta: "Quero um site assim",
    message: (kind: string) => `Olá, Mateus! Vi a demonstração de site de ${kind} e quero um site assim para o meu negócio.`,
  },
  en: {
    back: "Back to portfolio",
    backShort: "Portfolio",
    notice: "Demo · fictional business created by Mateus Fantin",
    cta: "I want a site like this",
    message: (kind: string) => `Hi Mateus! I saw your ${kind} website demo and I want a site like this for my business.`,
  },
};

/** WhatsApp do Mateus com a mensagem de quem viu uma demonstração. */
export function demoWhatsapp(kind: DemoKind, locale: Locale) {
  const message = BAR[locale].message(KINDS[kind][locale]);
  return `${profile.whatsappLink}?text=${encodeURIComponent(message)}`;
}

/**
 * Faixa no topo de toda demonstração: deixa claro que o negócio é fictício,
 * volta ao portfólio, troca o idioma (o mesmo do portfólio) e leva direto ao
 * WhatsApp de quem quer um site igual.
 */
export function DemoBar({ kind }: { kind: DemoKind }) {
  const locale = useLocale();
  const t = BAR[locale];

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  return (
    <div className="relative z-50 bg-[#111] font-sans text-xs text-white/80 sm:text-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/#pricing" className="inline-flex shrink-0 items-center gap-1.5 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t.back}</span>
          <span className="sm:hidden">{t.backShort}</span>
        </Link>
        <p className="hidden truncate md:block">{t.notice}</p>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-full bg-white/10 p-0.5 font-mono text-[11px] font-semibold uppercase">
            {(["pt", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                lang={code === "pt" ? "pt-BR" : "en"}
                className={`rounded-full px-2 py-1 transition-colors ${locale === code ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                {code}
              </button>
            ))}
          </div>
          <a
            href={demoWhatsapp(kind, locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-3 py-1 font-semibold text-black hover:bg-white/90"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
