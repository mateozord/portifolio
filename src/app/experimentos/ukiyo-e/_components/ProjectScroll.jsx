"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { KANJI } from "../_lib/copy";
import { EASE, Seal } from "./ornaments";

const noopSubscribe = () => () => {};

/** Detalhes do projeto, abrindo como um rolo de papel. */
export default function ProjectScroll({ project, labels, onClose, onSimilar }) {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!isClient) return null;

  // O portal vai para dentro de .ukiyo, para herdar as cores do tema.
  const host = document.querySelector(".ukiyo") ?? document.body;
  return createPortal(
    <AnimatePresence>
      {project && <Scroll key={project.slug} project={project} labels={labels} onClose={onClose} onSimilar={onSimilar} />}
    </AnimatePresence>,
    host,
  );
}

function Scroll({ project, labels, onClose, onSimilar }) {
  const [[index, direction], setSlide] = useState([0, 0]);
  const dialogRef = useRef(null);
  const titleId = useId();
  const count = project.images.length;
  const go = useCallback((step) => setSlide(([current]) => [(current + step + count) % count, step]), [count]);

  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (count > 1 && event.key === "ArrowRight") go(1);
      if (count > 1 && event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, go, count]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#0b1226]/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 80, scaleY: 0.9 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: 50, transition: { duration: 0.25 } }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="relative max-h-[94svh] w-full max-w-5xl origin-top overflow-y-auto overscroll-contain rounded-t-[10px] border border-[var(--u-line-strong)] bg-[var(--u-card)] shadow-[var(--u-shadow)] outline-none sm:rounded-[10px]"
      >
        {/* Bastão de madeira do rolo, no topo */}
        <div aria-hidden className="sticky top-0 z-30 h-3 bg-[linear-gradient(to_bottom,#6b4a2b,#3d2816)] shadow-md" />

        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="absolute top-6 right-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-[#1b2233]/70 text-white backdrop-blur-sm transition hover:rotate-90"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-[3px] border border-[var(--u-line-strong)] bg-[#0d1224]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={{
                enter: (d) => ({ opacity: 0, x: `${d * 8}%` }),
                center: { opacity: 1, x: 0 },
                exit: (d) => ({ opacity: 0, x: `${d * -8}%` }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE }}
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
                sizes="(min-width: 1024px) 1000px, 100vw"
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
            <p className="text-sm font-medium text-white/90">{project.captions[index]}</p>
            {count > 1 && (
              <div className="flex shrink-0 gap-1.5">
                {project.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSlide([i, i > index ? 1 : -1])}
                    aria-label={`${i + 1} / ${count}`}
                    aria-current={i === index}
                    className={`h-2 w-2 rotate-45 transition-colors ${i === index ? "bg-[#cf412d]" : "bg-white/45 hover:bg-white/80"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
          className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.35fr_1fr]"
        >
          <div>
            <Item className="flex flex-wrap items-center gap-1.5">
              {project.categories.map((category) => (
                <Seal key={category} size="sm" className="text-xs">
                  {KANJI.categories[category]}
                </Seal>
              ))}
              <span className="ml-1 text-xs text-[var(--u-muted)]">{project.categories.map((c) => labels.filters[c]).join(" · ")}</span>
            </Item>
            <Item>
              <h2 id={titleId} className="u-mincho mt-4 text-4xl font-bold sm:text-5xl">
                {project.title}
              </h2>
            </Item>
            <Item>
              <p className="u-mincho mt-2 text-xl text-[var(--u-red)]">{project.tagline}</p>
            </Item>
            <Item>
              <p className="mt-5 leading-relaxed text-pretty text-[var(--u-ink-soft)]">{project.description}</p>
            </Item>
            {project.note && (
              <Item>
                <p className="mt-5 flex items-start gap-2 rounded-[4px] border border-[var(--u-line-strong)] px-4 py-3 text-sm text-[var(--u-muted)]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  {project.note}
                </p>
              </Item>
            )}
          </div>

          <div>
            <Item>
              <h3 className="font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">{labels.highlightsTitle}</h3>
            </Item>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((highlight, i) => (
                <Item key={highlight} as="li" className="flex gap-3 text-[0.95rem] leading-snug">
                  <span className="u-mincho mt-0.5 w-5 shrink-0 text-[var(--u-red)]">{KANJI.numbers[i] ?? "・"}</span>
                  {highlight}
                </Item>
              ))}
            </ul>
            <Item>
              <h3 className="mt-8 font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">{labels.stackTitle}</h3>
            </Item>
            <Item as="ul" className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li key={tech} className="rounded-[3px] border border-[var(--u-line)] px-2 py-0.5 font-mono text-[11px] text-[var(--u-muted)]">
                  {tech}
                </li>
              ))}
            </Item>
            <Item className="mt-8 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onSimilar(project)}
                style={{ "--ink-fill": "var(--u-ink)" }}
                className="u-ink-btn inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--u-red)] px-5 py-3.5 font-semibold text-[var(--u-red-ink)] transition-transform hover:scale-[1.02] hover:text-[var(--u-bg)]"
              >
                <span className="u-mincho">願</span>
                {labels.similar}
              </button>
              <div className="flex gap-2.5">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[var(--u-ink)] px-4 py-3 text-sm font-semibold text-[var(--u-bg)]"
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
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-[var(--u-line-strong)] px-4 py-3 text-sm font-semibold"
                  >
                    <GithubIcon className="h-4 w-4" />
                    {labels.code}
                  </a>
                )}
              </div>
            </Item>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Item({ as = "div", className, children }) {
  const Tag = as === "li" ? motion.li : as === "ul" ? motion.ul : motion.div;
  return (
    <Tag
      className={className}
      variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
    >
      {children}
    </Tag>
  );
}

function GalleryButton({ side, label, onClick }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:scale-110 ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
