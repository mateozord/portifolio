"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Hammer, MessagesSquare, FileText, Rocket, type LucideIcon } from "lucide-react";
import type { PortfolioDictionary } from "@/content/portfolio-content";
import { SectionHeader } from "@/components/motion-primitives";
import { EASE_OUT } from "@/lib/cn";

// Mesma ordem de dictionary.process.steps.
const ICONS: LucideIcon[] = [MessagesSquare, FileText, Hammer, Rocket];

export function ProcessSection({ dictionary }: { dictionary: PortfolioDictionary }) {
  const process = dictionary.process;
  const stepsRef = useRef<HTMLOListElement>(null);

  // A linha que liga as etapas se preenche conforme a seção passa pela tela.
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader eyebrow={process.eyebrow} title={process.title} subtitle={process.subtitle} />

      <ol ref={stepsRef} className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
        {/* Trilho + preenchimento: horizontal no desktop, vertical no celular. */}
        <span aria-hidden className="bg-line absolute top-7 right-[12%] left-[12%] hidden h-px md:block" />
        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className="bg-brand absolute top-[27px] right-[12%] left-[12%] hidden h-0.5 origin-left rounded-full md:block"
        />
        <span aria-hidden className="bg-line absolute top-7 bottom-7 left-7 w-px md:hidden" />
        <motion.span
          aria-hidden
          style={{ scaleY: progress }}
          className="bg-brand absolute top-7 bottom-7 left-[27px] w-0.5 origin-top rounded-full md:hidden"
        />

        {process.steps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT }}
              className="relative flex gap-5 md:flex-col md:items-center md:text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="border-line bg-surface-strong relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border shadow-[var(--shadow-card)]"
              >
                <Icon className="text-accent h-6 w-6" />
                <span className="bg-ink text-bg absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full font-mono text-[10px] font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
              <div className="md:mt-6">
                <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="text-muted mt-2 leading-relaxed text-pretty">{step.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
