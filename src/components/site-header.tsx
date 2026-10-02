"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { Locale, PortfolioDictionary } from "@/content/portfolio-content";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn, EASE_OUT } from "@/lib/cn";

const SECTIONS = ["services", "projects", "pricing", "about", "process", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

export function SiteHeader({ dictionary, locale }: { dictionary: PortfolioDictionary; locale: Locale }) {
  const [active, setActive] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Scroll spy: a seção que cruza o meio da tela fica marcada no menu.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActive((SECTIONS as readonly string[]).includes(id) ? (id as SectionId) : null);
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

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const links = SECTIONS.map((id) => ({ id, label: dictionary.nav[id] }));

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center gap-2 rounded-full border py-2 pr-2 pl-2 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-3",
          scrolled || menuOpen
            ? "border-line bg-surface shadow-[var(--shadow-card)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" className="focus-ring group flex shrink-0 items-center gap-2.5 rounded-full">
          <motion.span
            initial={{ rotate: -12, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="bg-ink text-bg grid h-9 w-9 place-items-center rounded-full"
          >
            <span className="font-serif-italic text-[1.05rem] leading-none">MF</span>
          </motion.span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">Mateus Fantin</span>
        </a>

        <nav aria-label={locale === "pt" ? "Principal" : "Main"} className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-1">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={cn(
                    "focus-ring relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active === id ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {active === id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="bg-ink/[0.06] dark:bg-white/[0.08] absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LocaleToggle locale={locale} />
          <ThemeToggle labels={dictionary.theme} />
          <a
            href="#contact"
            className="focus-ring bg-ink text-bg group hidden items-center gap-1.5 rounded-full py-2 pr-3 pl-4 text-sm font-semibold transition-transform hover:scale-[1.03] lg:inline-flex"
          >
            {dictionary.nav.cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            className="focus-ring border-line bg-surface grid h-9 w-9 place-items-center rounded-full border md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label={locale === "pt" ? "Principal" : "Main"}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="card mx-auto mt-2 max-w-6xl origin-top rounded-3xl p-2 md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {links.map(({ id, label }) => (
                <motion.li
                  key={id}
                  variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                >
                  <a
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "focus-ring flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium",
                      active === id ? "bg-ink/[0.06] dark:bg-white/[0.08]" : "hover:bg-ink/[0.04]",
                    )}
                  >
                    {label}
                    <ArrowUpRight className="text-muted h-4 w-4" />
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
