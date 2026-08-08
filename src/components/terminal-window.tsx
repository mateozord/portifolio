"use client";

import { Fragment, type ReactNode } from "react";
import { motion } from "framer-motion";

const KEYWORDS = new Set(["const", "let", "true", "false", "async", "await", "return"]);

function highlightToken(token: string, key: string): ReactNode {
  const parts = token.split(/(\bconst\b|\blet\b|\btrue\b|\bfalse\b|\basync\b|\bawait\b|\breturn\b)/g);
  return parts.map((part, j) =>
    KEYWORDS.has(part) ? (
      <span key={`${key}-${j}`} className="font-semibold text-arcane-300">
        {part}
      </span>
    ) : (
      <Fragment key={`${key}-${j}`}>{part}</Fragment>
    ),
  );
}

function highlightLine(line: string): ReactNode {
  const segments = line.split(/("(?:[^"\\]|\\.)*"|\b\d+\b)/g);
  return segments.map((segment, i) => {
    if (/^".*"$/.test(segment)) {
      return (
        <span key={i} className="text-gold-soft">
          {segment}
        </span>
      );
    }
    if (/^\d+$/.test(segment)) {
      return (
        <span key={i} className="text-cyan-glow">
          {segment}
        </span>
      );
    }
    return <Fragment key={i}>{highlightToken(segment, String(i))}</Fragment>;
  });
}

type TerminalWindowProps = {
  title: string;
  lines: string[];
  variant?: "code" | "status";
  className?: string;
};

export function TerminalWindow({ title, lines, variant = "code", className = "" }: TerminalWindowProps) {
  return (
    <div className={`rune-border arcane-glow overflow-hidden rounded-2xl text-left ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-arcane-900/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-glow/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-arcane-500/70" />
        <span className="ml-2 font-mono text-xs text-slate-400">{title}</span>
      </div>
      <div className="overflow-x-auto bg-arcane-950/90 px-5 py-6 font-mono text-sm leading-7 text-slate-200 sm:text-[0.95rem]">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            className={variant === "code" ? "whitespace-pre" : "whitespace-pre-wrap"}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.16 + 0.15, duration: 0.4 }}
          >
            {variant === "status" ? (
              <>
                <span className="mr-2 text-gold">{">"}</span>
                {line}
              </>
            ) : (
              highlightLine(line)
            )}
            {i === lines.length - 1 ? (
              <span className="cursor-blink ml-0.5 inline-block w-2 bg-cyan-glow/80 align-middle">
                &nbsp;
              </span>
            ) : null}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
