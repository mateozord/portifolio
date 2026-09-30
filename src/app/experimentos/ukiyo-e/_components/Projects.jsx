"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { KANJI } from "../_lib/copy";
import { useTilt } from "@/lib/use-tilt";
import ProjectScroll from "./ProjectScroll";
import ScreenStack from "./ScreenStack";
import { Reveal, SectionTitle, Seal, SeigaihaBand } from "./ornaments";

const FILTERS = ["all", "web", "database", "automation", "design"];
const FILTER_KANJI = { all: "全", ...KANJI.categories };

export default function Projects({ dictionary, copy, onSimilar }) {
  const labels = dictionary.projects;
  const [filter, setFilter] = useState("all");
  const [openSlug, setOpenSlug] = useState(null);

  const visible = filter === "all" ? labels.items : labels.items.filter((p) => p.categories.includes(filter));
  const openProject = labels.items.find((p) => p.slug === openSlug) ?? null;
  const count = (value) =>
    value === "all" ? labels.items.length : labels.items.filter((p) => p.categories.includes(value)).length;

  // Um card que sobraria sozinho na última linha ocupa a largura toda.
  let column = 0;
  let loneSlug = null;
  for (const [i, project] of visible.entries()) {
    if (project.featured) {
      column = 0;
      continue;
    }
    if (i === visible.length - 1 && column === 0) loneSlug = project.slug;
    column = 1 - column;
  }

  const close = useCallback(() => setOpenSlug(null), []);
  const similar = useCallback(
    (project) => {
      setOpenSlug(null);
      onSimilar(project);
    },
    [onSimilar],
  );

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-36">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
        <SectionTitle kanji={KANJI.projects} eyebrow={copy.projects.eyebrow} title={copy.projects.title} subtitle={copy.projects.subtitle} />
        <ScreenStack labels={dictionary.hero} className="px-2 sm:px-8 lg:px-0" />
      </div>

      <Reveal delay={0.1} className="mt-10">
        <div role="toolbar" aria-label={copy.projects.eyebrow} className="flex flex-wrap gap-2">
          {FILTERS.map((value) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={`relative flex items-center gap-2 rounded-[8px] border px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "border-transparent text-[var(--u-bg)]" : "border-[var(--u-line-strong)] text-[var(--u-ink-soft)] hover:text-[var(--u-ink)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="ukiyo-filter"
                    className="absolute inset-0 rounded-[8px] bg-[var(--u-ink)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`u-mincho relative ${active ? "" : "text-[var(--u-red)]"}`}>{FILTER_KANJI[value]}</span>
                <span className="relative">{labels.filters[value]}</span>
                <span className="relative font-mono text-[11px] opacity-60">{count(value)}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <LayoutGroup>
        <motion.div layout className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectPrint
                key={project.slug}
                project={project}
                index={i}
                wide={Boolean(project.featured) || project.slug === loneSlug}
                labels={labels}
                onOpen={() => setOpenSlug(project.slug)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <ProjectScroll project={openProject} labels={labels} onClose={close} onSimilar={similar} />
    </section>
  );
}

function ProjectPrint({ ref, project, index, wide, labels, onOpen }) {
  const featured = Boolean(project.featured);
  const tilt = useTilt(wide ? 3 : 5);
  // Quem observa a visibilidade é o invólucro (o card começa todo recortado)
  const viewRef = useRef(null);
  const inView = useInView(viewRef, { once: true, amount: 0.12 });

  return (
    <motion.div
      ref={ref}
      layout
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
      transition={{ layout: { type: "spring", stiffness: 260, damping: 30 } }}
      className={wide ? "md:col-span-2" : ""}
    >
      <div ref={viewRef} className="h-full">
        <motion.article
          // Entra desenrolando como pergaminho; depois inclina em 3D seguindo o cursor
          initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 40 }}
          animate={inView ? { clipPath: "inset(-10% -10% -14% -10%)", y: 0 } : undefined}
          whileHover={{ y: -8 }}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.reset}
          style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1200 }}
          transition={{ duration: 1.1, delay: (index % 2) * 0.12, ease: [0.65, 0, 0.35, 1] }}
          className={`u-print spin-border group flex h-full flex-col rounded-[6px] p-3 ${featured ? "is-on" : ""} ${wide ? "lg:flex-row" : ""}`}
        >
          {tilt.enabled && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 rounded-[6px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: tilt.glare }}
            />
          )}
          <div
            className={`relative aspect-[16/10] shrink-0 overflow-hidden rounded-[3px] border border-[var(--u-line-strong)] bg-[var(--u-bg-2)] ${
              wide ? "lg:aspect-auto lg:min-h-[25rem] lg:w-[58%]" : ""
            }`}
          >
            <Image
              src={project.images[0]}
              alt={project.captions[0] ?? project.title}
              fill
              sizes={wide ? "(min-width: 1024px) 640px, (min-width: 768px) 90vw, 100vw" : "(min-width: 768px) 560px, 100vw"}
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            {featured && <div className="shine" />}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0">
              <SeigaihaBand height={18} />
            </div>
            {project.link && (
              <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-[4px] bg-[#fbf8f0]/90 px-2 py-1 text-[11px] font-semibold text-[#1b2233] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {labels.liveBadge}
              </span>
            )}
            {featured && (
              <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-[4px] bg-[var(--u-red)] px-2 py-1 text-[11px] font-semibold text-[var(--u-red-ink)]">
                <span className="u-mincho text-sm leading-none">新</span>
                {labels.featuredBadge}
              </span>
            )}
          </div>

          <div className={`flex flex-1 flex-col p-4 sm:p-5 ${wide ? "lg:p-8" : ""}`}>
            <div className="flex items-center gap-1.5">
              {project.categories.map((category) => (
                <Seal key={category} size="sm" className="text-xs">
                  {KANJI.categories[category]}
                </Seal>
              ))}
              <span className="ml-1 text-xs text-[var(--u-muted)]">{project.categories.map((c) => labels.filters[c]).join(" · ")}</span>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className={`u-mincho font-bold ${featured ? "text-3xl lg:text-4xl" : "text-2xl"}`}>
                  {/* O ::after estica o botão pelo cartão inteiro */}
                  <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:z-10">
                    {project.title}
                  </button>
                </h3>
                <p className="u-mincho mt-1 text-[var(--u-muted)]">{project.tagline}</p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--u-line-strong)] transition-all duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-[var(--u-red)] group-hover:text-[var(--u-red-ink)]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            <p className="mt-4 text-[0.95rem] leading-relaxed text-pretty text-[var(--u-ink-soft)]">{project.summary}</p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.slice(0, wide ? 7 : 4).map((tech) => (
                <li key={tech} className="rounded-[3px] border border-[var(--u-line)] px-2 py-0.5 font-mono text-[11px] text-[var(--u-muted)]">
                  {tech}
                </li>
              ))}
              {project.stack.length > (wide ? 7 : 4) && (
                <li className="px-1 font-mono text-[11px] text-[var(--u-muted)]">+{project.stack.length - (wide ? 7 : 4)}</li>
              )}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 text-[var(--u-red)]">
                {labels.openCase}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-20 inline-flex items-center gap-1 text-[var(--u-muted)] transition-colors hover:text-[var(--u-ink)]"
                >
                  {labels.live}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
}
