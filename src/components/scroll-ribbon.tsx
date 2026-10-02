"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";

type Point = [number, number];
type Box = { x: number; y: number; w: number; h: number };

// Blocos de texto sob os quais a fita "mergulha" (fica quase transparente)
const TEXT_SELECTOR = "p, h1, h2, h3, li, dt, dd, blockquote, label";
const TEXT_PAD = 12;

/** Caixas dos textos, em coordenadas do <main>, já com folga em volta. */
function measureText(host: HTMLElement): Box[] {
  const origin = host.getBoundingClientRect();
  const boxes: Box[] = [];
  for (const el of host.querySelectorAll<HTMLElement>(TEXT_SELECTOR)) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    boxes.push({
      x: r.left - origin.left - TEXT_PAD,
      y: r.top - origin.top - TEXT_PAD,
      w: r.width + TEXT_PAD * 2,
      h: r.height + TEXT_PAD * 2,
    });
  }
  return boxes;
}

/**
 * Traçado da fita: ziguezague de uma borda à outra, com um laço em cada
 * borda (às vezes saindo da tela), como a linha azul do lusion.co. Os pontos
 * passam por uma Catmull-Rom para virar curvas suaves.
 */
function buildPath(width: number, height: number, vh: number) {
  const points: Point[] = [[width * 1.08, vh * 0.75]];
  let y = vh * 1.05;
  let side = -1;
  while (y < height - vh * 0.4) {
    const edge = side < 0 ? width * 0.1 : width * 0.9;
    points.push([width * (side < 0 ? 0.36 : 0.64), y]);
    points.push([edge, y + vh * 0.42]);
    // O laço: passa da borda, volta subindo e segue descendo
    points.push([edge + side * width * 0.09, y + vh * 0.24]);
    points.push([edge - side * width * 0.03, y + vh * 0.16]);
    points.push([edge - side * width * 0.08, y + vh * 0.48]);
    y += vh * 1.15;
    side = -side;
  }
  points.push([width * 0.5, height - vh * 0.1]);

  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * Fita nas cores da marca que se desenha pela página conforme a rolagem,
 * sempre com a "ponta" um pouco abaixo do meio da tela. Fica atrás das seções.
 */
export function ScrollRibbon() {
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0, vh: 0 });
  const [textBoxes, setTextBoxes] = useState<Box[]>([]);
  // Tabela altura → comprimento do traçado, para achar a ponta pela rolagem
  const lookup = useRef<{ total: number; ys: number[]; lengths: number[] }>({ total: 0, ys: [], lengths: [] });

  const drawn = useMotionValue(0);
  const smooth = useSpring(drawn, { stiffness: 70, damping: 22, mass: 0.6 });
  const { scrollY } = useScroll();

  useEffect(() => {
    const host = svgRef.current?.parentElement;
    if (!host) return undefined;
    const observer = new ResizeObserver(() => {
      setSize((prev) => {
        const next = { width: host.clientWidth, height: host.scrollHeight, vh: window.innerHeight };
        return Math.abs(prev.width - next.width) < 2 && Math.abs(prev.height - next.height) < 40 && prev.vh === next.vh
          ? prev
          : next;
      });
    });
    observer.observe(host);

    // Remede os textos quando a página assenta: no fim de cada rolagem (as
    // entradas animadas já terminaram) e ao mudar de tamanho ou de idioma
    let timer = 0;
    const remeasure = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setTextBoxes(measureText(host)), 250);
    };
    remeasure();
    const textObserver = new ResizeObserver(remeasure);
    textObserver.observe(host);
    window.addEventListener("scrollend", remeasure);
    const langObserver = new MutationObserver(remeasure);
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      textObserver.disconnect();
      langObserver.disconnect();
      window.removeEventListener("scrollend", remeasure);
    };
  }, []);

  const update = (y: number) => {
    const { total, ys, lengths } = lookup.current;
    if (!total) return;
    // A ponta fica a 62% da altura da tela; acha o comprimento mais distante já "alcançado"
    const tipY = y + size.vh * 0.62;
    let length = 0;
    for (let i = 0; i < ys.length; i++) if (ys[i] <= tipY) length = lengths[i];
    drawn.set(total - length);
  };

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !size.width) return;
    const total = path.getTotalLength();
    const ys: number[] = [];
    const lengths: number[] = [];
    const steps = Math.ceil(total / 24);
    for (let i = 0; i <= steps; i++) {
      const length = (i / steps) * total;
      ys.push(path.getPointAtLength(length).y);
      lengths.push(length);
    }
    lookup.current = { total, ys, lengths };
    path.style.strokeDasharray = `${total}`;
    drawn.jump(total);
    smooth.jump(total);
    update(window.scrollY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  useMotionValueEvent(scrollY, "change", update);

  if (reduceMotion) return null;

  const d = size.width ? buildPath(size.width, size.height, size.vh) : "";
  const stroke = Math.round(Math.min(26, Math.max(9, size.width * 0.016)));

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-visible"
      width={size.width}
      height={size.height}
    >
      <defs>
        <linearGradient id="ribbon-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={size.height}>
          <stop offset="0%" stopColor="var(--brand-1)" />
          <stop offset="35%" stopColor="var(--brand-2)" />
          <stop offset="65%" stopColor="var(--brand-3)" />
          <stop offset="85%" stopColor="var(--brand-4)" />
          <stop offset="100%" stopColor="var(--brand-1)" />
        </linearGradient>
        {/* Branco = fita visível; caixas escuras = fita quase apagada sob o texto */}
        <mask id="ribbon-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={size.width} height={size.height}>
          <rect x="0" y="0" width={size.width} height={size.height} fill="#fff" />
          {textBoxes.map((box, i) => (
            <rect key={i} x={box.x} y={box.y} width={box.w} height={box.h} rx="14" fill="#1f1f1f" />
          ))}
        </mask>
      </defs>
      <motion.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="url(#ribbon-gradient)"
        mask="url(#ribbon-mask)"
        strokeWidth={stroke}
        strokeLinecap="round"
        style={{ strokeDashoffset: smooth }}
        opacity={0.85}
      />
    </svg>
  );
}
