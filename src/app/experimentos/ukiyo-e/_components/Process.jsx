"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { KANJI } from "../_lib/copy";
import { EASE, Enso, SectionTitle } from "./ornaments";

export default function Process({ dictionary, copy }) {
  const process = dictionary.process;
  const stepsRef = useRef(null);
  // A onda que liga as etapas se desenha conforme a seção passa pela tela.
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });

  return (
    <section id="process" className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-36">
      <SectionTitle kanji={KANJI.process} eyebrow={copy.process.eyebrow} title={copy.process.title} subtitle={process.subtitle} />

      <ol ref={stepsRef} className="relative mt-20 grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6">
        {/* Onda horizontal (desktop) e vertical (celular) ligando os ensōs */}
        <svg aria-hidden viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute top-8 left-[12%] hidden h-10 w-[76%] md:block">
          <path d="M0 20 Q 62 0 125 20 T 250 20 T 375 20 T 500 20 T 625 20 T 750 20 T 875 20 T 1000 20" fill="none" stroke="var(--u-line-strong)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 6" />
          <motion.path
            d="M0 20 Q 62 0 125 20 T 250 20 T 375 20 T 500 20 T 625 20 T 750 20 T 875 20 T 1000 20"
            fill="none"
            stroke="var(--u-red)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: progress }}
          />
        </svg>
        <svg aria-hidden viewBox="0 0 40 1000" preserveAspectRatio="none" className="absolute top-10 left-[2.4rem] h-[calc(100%-5rem)] w-6 md:hidden">
          <motion.path
            d="M20 0 Q 0 62 20 125 T 20 250 T 20 375 T 20 500 T 20 625 T 20 750 T 20 875 T 20 1000"
            fill="none"
            stroke="var(--u-red)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: progress }}
          />
        </svg>

        {process.steps.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
            className="relative flex gap-5 md:flex-col md:items-center md:text-center"
          >
            <Enso delay={0.2 + i * 0.25} className="h-[5.5rem] w-[5.5rem] shrink-0 rounded-full bg-[var(--u-bg)]">
              <span className="u-mincho text-3xl font-bold text-[var(--u-red)]">{KANJI.numbers[i]}</span>
            </Enso>
            <div className="md:mt-5">
              <h3 className="u-mincho text-2xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-pretty text-[var(--u-muted)]">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
