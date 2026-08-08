"use client";

import { motion } from "framer-motion";

type SectionBlockProps = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function SectionBlock({ id, eyebrow, title, subtitle, children }: SectionBlockProps) {
  return (
    <motion.section
      id={id}
      className="section-shell"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <header className="mb-10 text-center">
        {eyebrow ? <p className="text-slate-300">{eyebrow}</p> : null}
        <h2 className="font-display mt-1 text-3xl font-bold text-violet-200 md:text-4xl">
          <span className="glow-text">{title}</span>
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </motion.section>
  );
}
