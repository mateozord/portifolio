"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

/** Aparece deslizando para cima quando entra na tela. */
export function Reveal({ children, className, delay = 0, y = 26 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Carimbo vermelho (hanko), como a assinatura das gravuras. */
export function Seal({ children, className = "", size = "md", stamp = false }) {
  const sizes = { sm: "h-7 min-w-7 text-sm", md: "h-10 min-w-10 text-lg", lg: "h-14 min-w-14 text-2xl" };
  const content = (
    <span
      className={`u-mincho inline-grid place-items-center rounded-[5px] border-2 border-[var(--u-red)] px-1 leading-none font-bold text-[var(--u-red)] ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
  if (!stamp) return content;
  return (
    <motion.span
      className="inline-flex"
      initial={{ scale: 1.8, opacity: 0, rotate: -14 }}
      whileInView={{ scale: 1, opacity: 1, rotate: -4 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 13 }}
    >
      {content}
    </motion.span>
  );
}

/**
 * Divide "texto *destaque*" em palavras. As destacadas recebem `brush`, a
 * ordem da pincelada (para desenhar uma depois da outra).
 */
function words(text) {
  const list = [];
  let brush = 0;
  text.split("*").forEach((part, index) => {
    const highlight = index % 2 === 1;
    for (const word of part.split(/\s+/).filter(Boolean)) {
      list.push({ word, highlight, brush: highlight ? brush++ : -1 });
    }
  });
  return list;
}

// Pinceladas levemente diferentes, para cada palavra parecer traçada à mão
const BRUSHES = [
  "M3 9 C 22 5, 48 11, 70 7 S 94 6, 97 8",
  "M2 7 C 25 10, 52 4, 74 8 S 95 9, 98 6",
  "M4 8 C 28 4, 50 10, 72 6 S 93 8, 96 7",
];

/**
 * Cabeçalho de seção: rótulo com carimbo, kanji discreto ao fundo e o título
 * surgindo palavra por palavra. As palavras em destaque ganham uma pincelada
 * de tinta vermelha que se desenha embaixo delas, uma depois da outra.
 */
export function SectionTitle({ kanji, eyebrow, title, subtitle, align = "left", className = "" }) {
  const centered = align === "center";
  const list = words(title);
  const lead = list.filter((w) => !w.highlight).length;

  return (
    <div className={`relative ${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 1.15 }}
        whileInView={{ opacity: 0.035, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: EASE }}
        className={`u-mincho pointer-events-none absolute -top-16 text-[9rem] leading-none font-bold text-[var(--u-ink)] select-none sm:text-[12rem] ${centered ? "left-1/2 -translate-x-1/2" : "-left-4"}`}
      >
        {kanji}
      </motion.span>
      <Reveal className={`relative flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span aria-hidden className="h-px w-8 bg-[var(--u-red)]" />
        <span className="font-mono text-xs tracking-[0.25em] text-[var(--u-muted)] uppercase">{eyebrow}</span>
      </Reveal>
      <motion.h2
        className="u-mincho relative mt-5 text-4xl leading-[1.14] font-bold tracking-tight text-balance sm:text-5xl md:text-[3.4rem]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {list.map(({ word, highlight, brush }, i) => (
          <span key={i}>
            <motion.span
              className={`relative inline-block ${highlight ? "text-[var(--u-red)]" : ""}`}
              variants={{
                hidden: { opacity: 0, y: "0.4em", filter: "blur(8px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
              }}
            >
              {word}
              {highlight && (
                <svg
                  aria-hidden
                  viewBox="0 0 100 14"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-[0.12em] left-[-2%] -z-10 h-[0.32em] w-[104%] overflow-visible"
                >
                  <motion.path
                    d={BRUSHES[brush % BRUSHES.length]}
                    fill="none"
                    stroke="var(--u-red)"
                    strokeOpacity="0.28"
                    strokeWidth="9"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: {
                        pathLength: 1,
                        transition: { duration: 0.55, delay: 0.25 + lead * 0.02 + brush * 0.22, ease: [0.65, 0, 0.35, 1] },
                      },
                    }}
                  />
                </svg>
              )}
            </motion.span>{" "}
          </span>
        ))}
      </motion.h2>
      {subtitle ? (
        <Reveal delay={0.15}>
          <p className="relative mt-5 text-lg leading-relaxed text-pretty text-[var(--u-muted)]">{subtitle}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * Link-botão de tinta: no hover, a cor se espalha em círculo a partir do
 * ponto onde o cursor entrou. `fill` é a cor da tinta.
 */
export function InkLink({ fill = "var(--u-ink)", className = "", children, ...props }) {
  const place = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--ink-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--ink-y", `${event.clientY - rect.top}px`);
  };
  return (
    <a {...props} onPointerEnter={place} onPointerLeave={place} style={{ "--ink-fill": fill }} className={`u-ink-btn ${className}`}>
      {children}
    </a>
  );
}

/** Faixa com o padrão seigaiha (ondas em escamas), que corre devagar. */
export function SeigaihaBand({ className = "", height = 28, opacity = 1 }) {
  const id = `sg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const arcs = [20, 15, 10, 5];
  return (
    <svg aria-hidden className={className} width="100%" height={height} style={{ opacity }}>
      <defs>
        <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
          {[
            [20, 10],
            [0, 20],
            [40, 20],
            [20, 30],
          ].map(([cx, cy]) =>
            arcs.map((r) => (
              <path
                key={`${cx}-${cy}-${r}`}
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill={r === 20 ? "var(--wv-mid)" : "none"}
                stroke="var(--wv-foam)"
                strokeWidth="1.1"
              />
            )),
          )}
          <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="40 0" dur="14s" repeatCount="indefinite" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Ensō (円相): o círculo zen feito em uma pincelada, desenhado ao entrar na tela. */
export function Enso({ className = "", children, delay = 0 }) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-[100deg]">
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--u-ink)"
          strokeWidth="7"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.9 }}
          whileInView={{ pathLength: 0.88 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** Nuvem kumo estilizada: faixa com bordas enroladas, como nas gravuras. */
export function Kumo({ className = "", style }) {
  return (
    <svg aria-hidden viewBox="0 0 320 70" className={className} style={style}>
      <path
        d="M20 58 H300 Q316 58 316 46 Q316 34 302 34 Q300 18 282 18 Q268 18 262 28 Q256 8 232 8 Q210 8 204 26 Q196 16 182 18 Q168 20 166 34 H140 Q138 22 124 22 Q108 22 106 36 Q96 30 86 34 Q72 40 76 48 H40 Q24 46 20 58 Z"
        fill="var(--u-cloud)"
        stroke="var(--u-cloud-line)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M246 34 q10 -10 20 0 M190 36 q8 -8 16 0 M112 44 q8 -7 14 0"
        fill="none"
        stroke="var(--u-cloud-line)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
