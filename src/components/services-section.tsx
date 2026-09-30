"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, MonitorSmartphone, Palette, Workflow, type LucideIcon } from "lucide-react";
import type { PortfolioDictionary } from "@/content/portfolio-content";
import { SectionHeader } from "@/components/motion-primitives";
import { useTilt } from "@/lib/use-tilt";
import { EASE_OUT } from "@/lib/cn";

// Mesma ordem de dictionary.services.items.
const ICONS: LucideIcon[] = [MonitorSmartphone, LayoutDashboard, Workflow, Palette];

export function ServicesSection({ dictionary }: { dictionary: PortfolioDictionary }) {
  const services = dictionary.services;

  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
        {services.items.map((item, i) => (
          <ServiceCard key={item.title} index={i} icon={ICONS[i]} {...item} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  index,
  icon: Icon,
  title,
  description,
  tags,
}: {
  index: number;
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
}) {
  const tilt = useTilt(4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.12, ease: EASE_OUT }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.reset}
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1100 }}
      className="card group relative overflow-hidden rounded-[1.75rem] p-7 sm:p-8"
    >
      {tilt.enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: tilt.glare }}
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <motion.div
          whileHover={{ rotate: -8, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
          className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-line bg-surface-strong"
        >
          <span
            aria-hidden
            className="bg-brand absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <Icon className="text-ink relative h-6 w-6 transition-colors duration-500 group-hover:text-white" />
        </motion.div>
        <span className="text-muted/70 font-mono text-sm">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="relative mt-8 text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted relative mt-3 leading-relaxed text-pretty">{description}</p>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag} className="chip">
            {tag}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
