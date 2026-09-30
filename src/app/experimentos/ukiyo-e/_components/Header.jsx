"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { setLocale } from "@/lib/locale-store";
import { KANJI } from "../_lib/copy";
import { setNight, useNight } from "../_lib/use-night";
import { EASE } from "./ornaments";

const SECTIONS = ["services", "projects", "about", "process", "contact"];

export default function Header({ locale, nav, themeCopy }) {
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 30));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(SECTIONS.includes(entry.target.id) ? entry.target.id : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["top", ...SECTIONS]) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center gap-3 rounded-[14px] border px-3 py-2 transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled || menuOpen
            ? "border-[var(--u-line-strong)] bg-[color-mix(in_srgb,var(--u-card)_90%,transparent)] shadow-[var(--u-shadow)] backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="group flex shrink-0 items-center gap-2.5">
          <motion.span whileHover={{ rotate: -8, scale: 1.08 }} transition={{ type: "spring", stiffness: 300, damping: 12 }}>
            <span className="u-mincho grid h-10 w-10 place-items-center rounded-[6px] bg-[var(--u-red)] text-[15px] font-bold tracking-tight text-[var(--u-red-ink)] shadow-sm">
              MF
            </span>
          </motion.span>
          <span className="hidden leading-tight sm:block">
            <span className="u-mincho block text-[15px] font-bold">Mateus Fantin</span>
            <span className="u-mincho block text-[11px] tracking-[0.3em] text-[var(--u-muted)]">波 · 作品集</span>
          </span>
        </a>

        <nav aria-label={locale === "pt" ? "Principal" : "Main"} className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-1">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`relative flex flex-col items-center rounded-[10px] px-3 py-1 transition-colors ${
                    active === id ? "text-[var(--u-ink)]" : "text-[var(--u-muted)] hover:text-[var(--u-ink)]"
                  }`}
                >
                  {active === id && (
                    <motion.span
                      layoutId="ukiyo-nav"
                      className="absolute inset-0 rounded-[10px] bg-[color-mix(in_srgb,var(--u-ink)_7%,transparent)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`u-mincho relative text-[10px] leading-none ${active === id ? "text-[var(--u-red)]" : ""}`}>
                    {KANJI[id]}
                  </span>
                  <span className="relative text-sm font-medium">{nav[id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitch locale={locale} />
          <DayNightSwitch copy={themeCopy} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
            className="grid h-9 w-9 place-items-center rounded-[10px] border border-[var(--u-line-strong)] md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="u-print mx-auto mt-2 max-w-6xl rounded-[14px] p-2 md:hidden"
          >
            {SECTIONS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="relative z-10 flex items-center gap-3 rounded-[10px] px-4 py-3 text-base font-medium hover:bg-[color-mix(in_srgb,var(--u-ink)_5%,transparent)]"
              >
                <span className="u-mincho w-8 text-[var(--u-red)]">{KANJI[id]}</span>
                {nav[id]}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function LocaleSwitch({ locale }) {
  return (
    <div className="flex rounded-[10px] border border-[var(--u-line-strong)] p-0.5 font-mono text-[11px] font-semibold uppercase">
      {["pt", "en"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className="relative rounded-[8px] px-2.5 py-1.5"
        >
          {locale === code && (
            <motion.span layoutId="ukiyo-locale" className="absolute inset-0 rounded-[8px] bg-[var(--u-ink)]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
          )}
          <span className={`relative ${locale === code ? "text-[var(--u-bg)]" : "text-[var(--u-muted)]"}`}>{code}</span>
        </button>
      ))}
    </div>
  );
}

/** Sol vermelho de dia, lua à noite. A troca se espalha em círculo a partir do botão. */
function DayNightSwitch({ copy }) {
  const night = useNight();
  const toggle = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setNight(!night, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={night ? copy.toDay : copy.toNight}
      title={night ? copy.toDay : copy.toNight}
      className="flex h-9 items-center gap-2 rounded-[10px] border border-[var(--u-line-strong)] pr-3 pl-1.5"
    >
      <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={night ? "moon" : "sun"}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0 grid place-items-center"
          >
            {night ? (
              <span className="h-4 w-4 rounded-full bg-[#f2e3b8] shadow-[inset_-4px_-2px_0_0_#c9b886]" />
            ) : (
              <span className="h-4 w-4 rounded-full bg-[#cf412d] shadow-[0_0_10px_rgba(207,65,45,0.6)]" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="u-mincho text-sm">{night ? "夜" : "昼"}</span>
      <span className="hidden text-xs text-[var(--u-muted)] sm:inline">{night ? copy.night : copy.day}</span>
    </button>
  );
}
