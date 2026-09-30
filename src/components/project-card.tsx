"use client";

import { useState, type Ref } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { PortfolioDictionary, Project } from "@/content/portfolio-content";
import { SparkleField } from "@/components/sparkle-field";
import { useTilt } from "@/lib/use-tilt";
import { cn, EASE_OUT } from "@/lib/cn";

type ProjectCardProps = {
  /** Repassado ao <article> para o AnimatePresence (modo popLayout) medir o card. */
  ref?: Ref<HTMLElement>;
  project: Project;
  index: number;
  /** Ocupa a linha inteira no layout horizontal (usado quando o card ficaria sozinho). */
  wide?: boolean;
  labels: PortfolioDictionary["projects"];
  onOpen: () => void;
};

/**
 * Card de projeto: inclinação 3D + reflexo seguindo o cursor, borda em
 * gradiente girando no hover (sempre ligada no destaque) e partículas.
 */
export function ProjectCard({ ref, project, index, wide: wideProp = false, labels, onOpen }: ProjectCardProps) {
  const featured = Boolean(project.featured);
  const wide = featured || wideProp;
  const tilt = useTilt(featured ? 3 : 5);
  const [hovering, setHovering] = useState(false);
  const visibleStack = project.stack.slice(0, wide ? 7 : 4);
  const hiddenCount = project.stack.length - visibleStack.length;

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
      transition={{
        layout: { type: "spring", stiffness: 260, damping: 30 },
        default: { duration: 0.75, delay: (index % 2) * 0.1, ease: EASE_OUT },
      }}
      whileHover={tilt.enabled ? { y: -6 } : undefined}
      onPointerEnter={() => setHovering(true)}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={() => {
        setHovering(false);
        tilt.reset();
      }}
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1200 }}
      className={cn(
        "card spin-border group flex flex-col overflow-hidden rounded-[1.75rem] p-2.5 will-change-transform",
        featured && "is-on",
        wide && "md:col-span-2 lg:flex-row",
      )}
    >
      {tilt.enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: tilt.glare }}
        />
      )}
      {featured && <SparkleField intense={hovering} />}

      <div
        className={cn(
          "relative aspect-[16/10] shrink-0 overflow-hidden rounded-[1.3rem] bg-[#101015]",
          wide && "lg:aspect-auto lg:min-h-[27rem] lg:w-[58%]",
        )}
      >
        <Image
          src={project.images[0]}
          alt={project.captions[0] ?? project.title}
          fill
          sizes={wide ? "(min-width: 1024px) 640px, (min-width: 768px) 90vw, 100vw" : "(min-width: 768px) 560px, 100vw"}
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
        {featured && <div className="shine" />}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />

        <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {featured && (
              <span className="bg-brand inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg">
                <Sparkles className="h-3 w-3" />
                {labels.featuredBadge}
              </span>
            )}
            {project.categories.map((category) => (
              <span
                key={category}
                className="hidden rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/15 backdrop-blur-md sm:inline-flex"
              >
                {labels.filters[category]}
              </span>
            ))}
          </div>
          {project.link && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/15 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {labels.liveBadge}
            </span>
          )}
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-4 sm:p-5", wide && "lg:p-8")}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className={cn("font-semibold tracking-tight", featured ? "text-3xl lg:text-4xl" : "text-2xl")}>
              {/* O ::after estica o botão por todo o card: o card inteiro abre os detalhes. */}
              <button
                type="button"
                onClick={onOpen}
                className="focus-ring rounded-md text-left after:absolute after:inset-0 after:z-10 after:rounded-[1.75rem]"
              >
                {project.title}
              </button>
            </h3>
            <p className={cn("font-serif-italic text-muted mt-1", featured ? "text-xl" : "text-lg")}>
              {project.tagline}
            </p>
          </div>
          <span
            aria-hidden
            className="border-line grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-ink group-hover:text-bg"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="text-ink-soft mt-4 text-[0.95rem] leading-relaxed text-pretty">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {visibleStack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
          {hiddenCount > 0 && <li className="chip text-muted">+{hiddenCount}</li>}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 text-sm font-semibold">
          <span className="text-accent inline-flex items-center gap-1.5">
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
              className="focus-ring text-muted hover:text-ink relative z-30 inline-flex items-center gap-1 rounded-md transition-colors"
            >
              {labels.live}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
