"use client";

import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <motion.article
      className="surface-card rounded-2xl p-5 text-center"
      whileHover={{ y: -4, boxShadow: "var(--glow-violet)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-100">{value}</p>
    </motion.article>
  );
}
