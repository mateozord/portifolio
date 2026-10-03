"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Info, Sparkles, X } from "lucide-react";
import type { PortfolioDictionary, Project } from "@/content/portfolio-content";
import { GithubIcon } from "@/components/brand-icons";
import { cn, EASE_OUT } from "@/lib/cn";

type Labels = PortfolioDictionary["projects"];

const noopSubscribe = () => () => {};

export function ProjectModal({
  project,
  labels,
  onClose,
  onSimilar,
}: {
  project: Project | null;
  labels: Labels;
  onClose: () => void;
  onSimilar: (project: Project) => void;
}) {
  // O portal só existe no navegador.
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <ModalContent key={project.slug} project={project} labels={labels} onClose={onClose} onSimilar={onSimilar} />
      )}
    </AnimatePresence>,
    document.body,
  );
}

const bodyVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const slideVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: `${direction * 8}%`, scale: 1.02 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({ opacity: 0, x: `${direction * -8}%`, scale: 0.98 }),
};

function ModalContent({
  project,
  labels,
  onClose,
  onSimilar,
}: {
  project: Project;
  labels: Labels;
  onClose: () => void;
  onSimilar: (project: Project) => void;
}) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const count = project.images.length;

  const go = useCallback(
    (step: number) => setSlide(([current]) => [(current + step + count) % count, step]),
    [count],
  );

  // Foco no diálogo, rolagem da página travada, e foco devolvido ao fechar.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (count > 1 && event.key === "ArrowRight") go(1);
      if (count > 1 && event.key === "ArrowLeft") go(-1);
      // Mantém o Tab dentro do diálogo.
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, go, count]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#0b0a10]/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 80, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.97, transition: { duration: 0.25 } }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
        className="border-line bg-surface-strong relative max-h-[94svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[2rem] border shadow-[var(--shadow-lift)] outline-none sm:rounded-[2rem]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="focus-ring absolute top-4 right-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:rotate-90 hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Galeria */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d12]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="absolute inset-0"
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
            >
              <Image
                src={project.images[index]}
                alt={project.captions[index] ?? project.title}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                draggable={false}
                className="object-contain select-none"
              />
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <>
              <GalleryButton side="left" label={labels.previous} onClick={() => go(-1)} />
              <GalleryButton side="right" label={labels.next} onClick={() => go(1)} />
            </>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/60 to-transparent p-4 pt-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-white/90"
              >
                {project.captions[index]}
              </motion.p>
            </AnimatePresence>
            {count > 1 && (
              <div className="flex shrink-0 items-center gap-1.5">
                {project.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSlide([i, i > index ? 1 : -1])}
                    aria-label={`${i + 1} / ${count}`}
                    aria-current={i === index}
                    className={cn(
                      "focus-ring h-1.5 rounded-full transition-all duration-300",
                      i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <motion.div
          variants={bodyVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.35fr_1fr]"
        >
          <div>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5">
              {project.featured && (
                <span className="bg-brand inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  {labels.featuredBadge}
                </span>
              )}
              {project.categories.map((category) => (
                <span key={category} className="chip py-1 text-[11px]">
                  {labels.filters[category]}
                </span>
              ))}
            </motion.div>
            <motion.h2
              id={titleId}
              variants={itemVariants}
              className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
            >
              {project.title}
            </motion.h2>
            <motion.p variants={itemVariants} className="font-serif-italic text-brand mt-2 inline-block text-2xl">
              {project.tagline}
            </motion.p>
            <motion.p variants={itemVariants} className="text-ink-soft mt-5 leading-relaxed text-pretty">
              {/* Com estudo de caso, o resumo curto basta: a descrição longa repetiria o problema */}
              {project.caseStudy ? project.summary : project.description}
            </motion.p>
            {project.note && (
              <motion.p
                variants={itemVariants}
                className="border-line text-muted mt-5 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                {project.note}
              </motion.p>
            )}
            {project.caseStudy && <CaseStudy study={project.caseStudy} labels={labels.caseLabels} />}
          </div>

          <div>
            <motion.h3 variants={itemVariants} className="eyebrow">
              {labels.highlightsTitle}
            </motion.h3>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((highlight) => (
                <motion.li key={highlight} variants={itemVariants} className="flex gap-3 text-[0.95rem] leading-snug">
                  <span className="bg-accent-soft text-accent mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {highlight}
                </motion.li>
              ))}
            </ul>

            <motion.h3 variants={itemVariants} className="eyebrow mt-8">
              {labels.stackTitle}
            </motion.h3>
            <motion.ul variants={itemVariants} className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onSimilar(project)}
                className="focus-ring bg-brand group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 font-semibold text-white shadow-[0_16px_36px_-16px_rgb(192_38_211/0.7)] transition-transform hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                {labels.similar}
              </button>
              <div className="flex gap-2.5">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring bg-ink text-bg inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-85"
                  >
                    {labels.live}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring border-line-strong hover:bg-ink/[0.04] inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-3 text-sm font-semibold transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    {labels.code}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function GalleryButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "focus-ring absolute top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-md",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}

/** Estudo de caso: o problema, as decisões numeradas, o resultado e um desafio real. */
function CaseStudy({ study, labels }: { study: NonNullable<Project["caseStudy"]>; labels: Labels["caseLabels"] }) {
  return (
    <div className="mt-8 space-y-7">
      <motion.div variants={itemVariants}>
        <h3 className="eyebrow">{labels.problem}</h3>
        <p className="text-ink-soft mt-2.5 leading-relaxed text-pretty">{study.problem}</p>
      </motion.div>
      <motion.div variants={itemVariants}>
        <h3 className="eyebrow">{labels.decisions}</h3>
        <ol className="mt-3 space-y-3">
          {study.decisions.map((decision, i) => (
            <li key={decision} className="flex gap-3 text-[0.95rem] leading-snug">
              <span className="text-accent w-5 shrink-0 pt-px font-mono text-xs font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-ink-soft">{decision}</span>
            </li>
          ))}
        </ol>
      </motion.div>
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        <div className="border-line rounded-2xl border p-4">
          <h3 className="eyebrow">{labels.result}</h3>
          <p className="text-ink-soft mt-2 text-[0.95rem] leading-relaxed">{study.result}</p>
        </div>
        <div className="border-line rounded-2xl border p-4">
          <h3 className="eyebrow">{labels.challenge}</h3>
          <p className="text-ink-soft mt-2 text-[0.95rem] leading-relaxed">{study.challenge}</p>
        </div>
      </motion.div>
    </div>
  );
}
