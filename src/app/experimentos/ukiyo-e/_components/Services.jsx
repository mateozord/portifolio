"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LayoutDashboard, MonitorSmartphone, Palette, Workflow } from "lucide-react";
import { KANJI } from "../_lib/copy";
import { useTilt } from "@/lib/use-tilt";
import { SectionTitle, SeigaihaBand } from "./ornaments";

// Mesma ordem de dictionary.services.items
const ICONS = [MonitorSmartphone, LayoutDashboard, Workflow, Palette];

export default function Services({ dictionary, copy }) {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-36">
      <SectionTitle
        kanji={KANJI.services}
        eyebrow={copy.services.eyebrow}
        title={copy.services.title}
        subtitle={dictionary.services.subtitle}
      />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {dictionary.services.items.map((item, i) => (
          <ServiceCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * Card de serviço: entra desenrolando como um pergaminho (de cima para baixo),
 * inclina em 3D seguindo o cursor com um reflexo de luz, e no hover a borda
 * ganha tinta girando e as ondas sobem pela base.
 */
function ServiceCard({ item, index }) {
  const Icon = ICONS[index];
  const tilt = useTilt(4);
  // O Chrome considera o clip-path ao observar a visibilidade: um card todo
  // recortado nunca "entra na tela". Por isso quem observa é o invólucro.
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.3 });
  return (
    <div ref={wrapRef}>
      <motion.article
        initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 30 }}
        animate={inView ? { clipPath: "inset(-12% -12% -20% -12%)", y: 0 } : undefined}
        transition={{ duration: 1.1, delay: (index % 2) * 0.12, ease: [0.65, 0, 0.35, 1] }}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.reset}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1100 }}
        className="u-print spin-border group overflow-hidden rounded-[6px] p-7 sm:p-9"
      >
        {tilt.enabled && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: tilt.glare }}
          />
        )}
        <div className="flex items-start justify-between gap-4">
          <span className="u-mincho text-6xl leading-none font-bold text-[var(--u-red)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
            {KANJI.numbers[index]}
          </span>
          <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--u-line-strong)] text-[var(--u-accent)] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:border-transparent group-hover:bg-[var(--u-accent)] group-hover:text-[var(--u-bg)]">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <h3 className="u-mincho mt-8 text-2xl font-bold">{item.title}</h3>
        <p className="mt-3 leading-relaxed text-pretty text-[var(--u-ink-soft)]">{item.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li key={tag} className="rounded-[3px] border border-[var(--u-line-strong)] px-2.5 py-1 font-mono text-[11px] tracking-wide text-[var(--u-muted)]">
              {tag}
            </li>
          ))}
        </ul>
        {/* Ondas surgem na base do cartão no hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0">
          <SeigaihaBand height={16} />
        </div>
      </motion.article>
    </div>
  );
}
