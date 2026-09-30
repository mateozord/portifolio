"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { PortfolioDictionary, Project, ProjectCategory } from "@/content/portfolio-content";
import { Reveal, SectionHeader } from "@/components/motion-primitives";
import { ProjectCard } from "@/components/project-card";
import { ProjectModal } from "@/components/project-modal";
import { cn } from "@/lib/cn";

type Filter = "all" | ProjectCategory;
const FILTERS: Filter[] = ["all", "web", "database", "automation", "design"];

export function ProjectsSection({
  dictionary,
  onSimilar,
}: {
  dictionary: PortfolioDictionary;
  onSimilar: (project: Project) => void;
}) {
  const labels = dictionary.projects;
  const [filter, setFilter] = useState<Filter>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const countFor = (value: Filter) =>
    value === "all" ? labels.items.length : labels.items.filter((p) => p.categories.includes(value)).length;
  const visible = filter === "all" ? labels.items : labels.items.filter((p) => p.categories.includes(filter));
  const openProject = labels.items.find((p) => p.slug === openSlug) ?? null;

  // Um card que sobraria sozinho na última linha do grid ocupa a largura toda.
  let column = 0;
  let loneSlug: string | null = null;
  for (const [i, project] of visible.entries()) {
    if (project.featured) {
      column = 0;
      continue;
    }
    if (i === visible.length - 1 && column === 0) loneSlug = project.slug;
    column = 1 - column;
  }

  const close = useCallback(() => setOpenSlug(null), []);
  const handleSimilar = useCallback(
    (project: Project) => {
      setOpenSlug(null);
      onSimilar(project);
    },
    [onSimilar],
  );

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader eyebrow={labels.eyebrow} title={labels.title} subtitle={labels.subtitle} />

      <Reveal delay={0.1} className="mt-10">
        <div
          role="toolbar"
          aria-label={labels.eyebrow}
          className="no-scrollbar border-line bg-surface -mx-1 inline-flex max-w-full gap-1 overflow-x-auto rounded-full border p-1 backdrop-blur"
        >
          {FILTERS.map((value) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={cn(
                  "focus-ring relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-bg" : "text-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="bg-ink absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {labels.filters[value]}
                  <span className={cn("font-mono text-[11px]", active ? "text-bg/60" : "text-muted/70")}>
                    {countFor(value)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <LayoutGroup>
        <motion.div layout className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                wide={project.slug === loneSlug}
                labels={labels}
                onOpen={() => setOpenSlug(project.slug)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <ProjectModal project={openProject} labels={labels} onClose={close} onSimilar={handleSimilar} />
    </section>
  );
}
