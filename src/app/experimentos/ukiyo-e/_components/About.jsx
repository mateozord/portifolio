"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { KANJI } from "../_lib/copy";
import { EASE, Reveal, SectionTitle, Seal } from "./ornaments";

export default function About({ dictionary, copy }) {
  const about = dictionary.about;

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-36">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <HangingScroll alt={about.photoAlt} location={about.location} />

        <div className="min-w-0">
          <SectionTitle kanji={KANJI.about} eyebrow={copy.about.eyebrow} title={about.title} />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-pretty text-[var(--u-ink-soft)]">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--u-line-strong)] pt-8">
            {about.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="u-mincho block text-sm text-[var(--u-red)]">{KANJI.numbers[i]}</span>
                  <Counter value={stat.value} suffix={stat.suffix} className="u-mincho block text-4xl font-bold sm:text-5xl" />
                  <span className="mt-1 block text-sm leading-snug text-[var(--u-muted)]">{stat.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <River steps={about.journey} />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="u-print rounded-[6px] p-7 lg:col-span-2">
          <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">
            <Seal size="sm">{KANJI.tools}</Seal>
            {about.stackTitle}
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {about.stack.map((group) => (
              <div key={group.label}>
                <p className="u-mincho text-lg font-bold">{group.label}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-[3px] border border-[var(--u-line)] px-2 py-0.5 text-sm text-[var(--u-ink-soft)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6">
          <Reveal delay={0.1} className="u-print rounded-[6px] p-7">
            <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">
              <Seal size="sm">学</Seal>
              {about.educationTitle}
            </h3>
            <p className="u-mincho mt-4 text-xl leading-snug font-bold">{about.degree}</p>
            <p className="mt-1 text-sm text-[var(--u-muted)]">
              {about.school} · {about.period}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-[3px] border border-emerald-600/30 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              ✓ {about.status}
            </span>
          </Reveal>
          <Reveal delay={0.18} className="u-print rounded-[6px] p-7">
            <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">
              <Seal size="sm">書</Seal>
              {about.coursesTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-snug text-[var(--u-ink-soft)]">
              {about.courses.map((course) => (
                <li key={course} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--u-red)]" />
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

/** Retrato num kakejiku (rolo pendurado) que se desenrola ao aparecer. */
function HangingScroll({ alt, location }) {
  const rod = "h-4 rounded-full bg-[linear-gradient(to_bottom,#8a6239,#4a2f18)] shadow-md";
  return (
    <div className="relative mx-auto w-full max-w-[22rem] self-start lg:sticky lg:top-28">
      {/* cordão */}
      <svg aria-hidden viewBox="0 0 100 30" className="mx-auto h-8 w-24 overflow-visible">
        <path d="M10 30 L50 2 L90 30" fill="none" stroke="var(--u-ink-soft)" strokeWidth="1.5" />
        <circle cx="50" cy="2" r="3" fill="var(--u-gold)" />
      </svg>
      <div className={`relative z-10 -mx-3 ${rod}`}>
        <span className="absolute -left-2 top-1/2 h-5 w-3 -translate-y-1/2 rounded-full bg-[#3a2412]" />
        <span className="absolute -right-2 top-1/2 h-5 w-3 -translate-y-1/2 rounded-full bg-[#3a2412]" />
      </div>
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: "auto" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
        className="overflow-hidden"
      >
        {/* Moldura de brocado (índigo com seigaiha) e papel */}
        <div className="bg-[var(--u-indigo)] bg-[radial-gradient(circle_at_50%_100%,transparent_9px,rgb(255_255_255/0.08)_10px,transparent_11px)] bg-[length:20px_12px] px-5 pt-6 pb-10 dark:bg-[#1b2c55]">
          <div className="bg-[var(--u-card)] p-3 shadow-inner">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/profile-portrait.webp" alt={alt} fill sizes="(min-width: 1024px) 320px, 80vw" className="object-cover sepia-[0.15]" />
            </div>
            <div className="flex items-end justify-between gap-3 px-1 pt-3 pb-1">
              <div>
                <p className="u-mincho text-lg font-bold">Mateus Fantin</p>
                <p className="flex items-center gap-1 text-xs text-[var(--u-muted)]">
                  <MapPin className="h-3 w-3" />
                  {location}
                </p>
              </div>
              <Seal size="md" stamp>
                人
              </Seal>
            </div>
          </div>
        </div>
      </motion.div>
      <div className={`relative z-10 -mx-3 ${rod}`}>
        <span className="absolute -left-2 top-1/2 h-5 w-3 -translate-y-1/2 rounded-full bg-[#3a2412]" />
        <span className="absolute -right-2 top-1/2 h-5 w-3 -translate-y-1/2 rounded-full bg-[#3a2412]" />
      </div>
    </div>
  );
}

/** Número que conta de 0 até o valor quando aparece na tela. */
function Counter({ value, suffix = "", className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return undefined;
    if (reduceMotion) {
      node.textContent = `${value}${suffix}`;
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
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

/** Trajetória como um rio: a linha ondulada se desenha e as pedras aparecem. */
function River({ steps }) {
  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={{ visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } } }}
      className="relative mt-12 space-y-7 pl-12"
    >
      <svg aria-hidden viewBox="0 0 24 400" preserveAspectRatio="none" className="absolute top-1 bottom-1 left-2 h-[calc(100%-0.5rem)] w-6">
        <motion.path
          d="M12 0 C 22 40, 2 80, 12 120 S 22 200, 12 240 S 2 320, 12 400"
          fill="none"
          stroke="var(--wv-mid)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 1.6, ease: EASE } } }}
        />
      </svg>
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          variants={{ hidden: { opacity: 0, x: -14 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}
          className="relative"
        >
          <span
            aria-hidden
            className={`absolute top-0.5 -left-[2.65rem] grid h-7 w-7 place-items-center rounded-full border-2 text-xs font-bold ${
              i === steps.length - 1
                ? "u-mincho border-[var(--u-red)] bg-[var(--u-red)] text-[var(--u-red-ink)]"
                : "u-mincho border-[var(--u-line-strong)] bg-[var(--u-card)] text-[var(--u-ink-soft)]"
            }`}
          >
            {KANJI.numbers[i]}
          </span>
          <p className="u-mincho text-lg font-bold">{step.title}</p>
          <p className="text-sm text-[var(--u-muted)]">{step.detail}</p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
