"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Project, ProjectCategory } from "@/content/portfolio-content";

type ProjectCardProps = {
  project: Project;
  ctaLabel: string;
  categoryLabels: Record<ProjectCategory, string>;
};

export function ProjectCard({ project, ctaLabel, categoryLabels }: ProjectCardProps) {
  return (
    <motion.article
      className="surface-card w-full max-w-md rounded-2xl p-5"
      whileHover={{ y: -6, boxShadow: "var(--glow-violet)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {project.image ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
          <Image
            src={project.image}
            alt={project.title}
            width={520}
            height={280}
            className="h-44 w-full object-cover transition duration-300 hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="mb-2 flex flex-wrap gap-2">
        {project.categories.map((category) => (
          <span
            key={category}
            className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-gold-soft"
          >
            {categoryLabels[category]}
          </span>
        ))}
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-100">{project.title}</h3>
      <p className="mt-1 text-sm italic text-arcane-300">{project.tagline}</p>
      <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 font-mono text-xs text-violet-100"
          >
            {tech}
          </li>
        ))}
      </ul>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-xl border border-violet-300 px-4 py-2 text-sm text-violet-200 transition hover:bg-violet-300 hover:text-[#0b1126]"
        >
          {ctaLabel}
        </a>
      ) : null}
    </motion.article>
  );
}
