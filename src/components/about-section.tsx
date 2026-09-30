"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Award, GraduationCap, MapPin } from "lucide-react";
import type { PortfolioDictionary } from "@/content/portfolio-content";
import { Reveal, SectionHeader } from "@/components/motion-primitives";
import { EASE_OUT } from "@/lib/cn";

export function AboutSection({ dictionary }: { dictionary: PortfolioDictionary }) {
  const about = dictionary.about;

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Portrait alt={about.photoAlt} location={about.location} />

        <div>
          <SectionHeader eyebrow={about.eyebrow} title={about.title} />
          <div className="text-ink-soft mt-8 space-y-5 text-lg leading-relaxed text-pretty">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <dl className="border-line mt-10 grid grid-cols-3 gap-4 border-t pt-8">
            {about.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-brand block text-4xl font-semibold tracking-tight sm:text-5xl"
                  />
                  <span className="text-muted mt-1 block text-sm leading-snug">{stat.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <Journey steps={about.journey} />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Reveal className="card rounded-[1.75rem] p-7 lg:col-span-2">
          <h3 className="eyebrow">{about.stackTitle}</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {about.stack.map((group) => (
              <div key={group.label}>
                <p className="font-semibold">{group.label}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.1} className="card rounded-[1.75rem] p-7">
            <h3 className="eyebrow flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {about.educationTitle}
            </h3>
            <p className="mt-4 text-lg leading-snug font-semibold">{about.degree}</p>
            <p className="text-muted mt-1 text-sm">
              {about.school} · {about.period}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {about.status}
            </span>
          </Reveal>
          <Reveal delay={0.18} className="card rounded-[1.75rem] p-7">
            <h3 className="eyebrow flex items-center gap-2">
              <Award className="h-4 w-4" />
              {about.coursesTitle}
            </h3>
            <ul className="text-ink-soft mt-4 space-y-2.5 text-sm leading-snug">
              {about.courses.map((course) => (
                <li key={course} className="flex gap-2.5">
                  <span aria-hidden className="bg-brand mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                  {course}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Portrait({ alt, location }: { alt: string; location: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -6 }}
      whileInView={{ opacity: 1, y: 0, rotate: -3 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="relative mx-auto w-full max-w-sm self-start lg:sticky lg:top-28"
    >
      <div aria-hidden className="bg-brand absolute -inset-3 -z-10 rounded-[2.4rem] opacity-25 blur-2xl" />
      <div className="spin-border is-on relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)]">
        <Image
          src="/profile-portrait.webp"
          alt={alt}
          fill
          sizes="(min-width: 1024px) 384px, 90vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-5 pt-16">
          <p className="text-lg font-semibold text-white">Mateus Fantin</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** Número que conta de 0 até o valor quando aparece na tela. */
function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduceMotion) {
      node.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, reduceMotion]);

  return (
    <span className={className}>
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span ref={ref} aria-hidden>{`0${suffix}`}</span>
    </span>
  );
}

/** Linha do tempo cuja linha se desenha ao entrar na tela. */
function Journey({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
      className="relative mt-10 space-y-6 pl-8"
    >
      <motion.span
        aria-hidden
        variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 1.2, ease: EASE_OUT } } }}
        className="bg-brand absolute top-2 bottom-2 left-[5px] w-px origin-top"
      />
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
          className="relative"
        >
          <motion.span
            aria-hidden
            variants={{
              hidden: { scale: 0 },
              visible: { scale: 1, transition: { type: "spring", stiffness: 400, damping: 14 } },
            }}
            className={
              i === steps.length - 1
                ? "bg-brand absolute top-1.5 -left-8 h-[11px] w-[11px] rounded-full ring-4 ring-[var(--accent-soft)]"
                : "border-line-strong bg-bg absolute top-1.5 -left-8 h-[11px] w-[11px] rounded-full border-2"
            }
          />
          <p className="font-semibold">{step.title}</p>
          <p className="text-muted text-sm">{step.detail}</p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
