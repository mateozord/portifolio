"use client";

import { useCallback, useState } from "react";
import type { PortfolioDictionary, Project } from "@/content/portfolio-content";
import { Reveal, SectionHeader } from "@/components/motion-primitives";
import { ProjectCard } from "@/components/project-card";
import { ProjectModal } from "@/components/project-modal";

/**
 * Projetos em duas camadas: os estudos de caso em destaque (cards largos, um
 * por linha, que contam uma história só: dado complicado virando interface
 * clara) e, abaixo, "Outros trabalhos" em cards menores. Cada card abre a
 * ficha com o problema, as decisões, o resultado e um desafio real.
 */
export function ProjectsSection({
  dictionary,
  onSimilar,
}: {
  dictionary: PortfolioDictionary;
  onSimilar: (project: Project) => void;
}) {
  const labels = dictionary.projects;
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const cases = labels.items.filter((p) => p.group === "case");
  const others = labels.items.filter((p) => p.group === "other");
  const openProject = labels.items.find((p) => p.slug === openSlug) ?? null;

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

      <div className="mt-12 grid grid-cols-1 gap-6">
        {cases.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            wide
            labels={labels}
            onOpen={() => setOpenSlug(project.slug)}
          />
        ))}
      </div>

      {others.length > 0 && (
        <>
          <Reveal className="mt-20 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">{labels.otherTitle}</h3>
            <p className="text-muted">{labels.otherSubtitle}</p>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {others.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                labels={labels}
                onOpen={() => setOpenSlug(project.slug)}
              />
            ))}
          </div>
        </>
      )}

      <ProjectModal project={openProject} labels={labels} onClose={close} onSimilar={handleSimilar} />
    </section>
  );
}
