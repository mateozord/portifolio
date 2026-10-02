"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { seededRandom } from "../_lib/random";
import { useNight } from "../_lib/use-night";

/**
 * Maré a nanquim: três camadas de ondas em linha fina (estilo sumi-e) sobre o
 * papel, com profundidade por opacidade.
 *
 *  - Back  (30%): desliza de lado em loop, quase imperceptível.
 *  - Mid   (60%): respira em senoide (sobe 8px e volta, 6s).
 *  - Front (100%): segue o cursor com parallax (useSpring + useTransform).
 *
 * Desempenho: cada camada é um ladrilho SVG desenhado uma vez (data URI) e
 * repetido lado a lado; as animações só mexem em `transform`, então rodam na
 * placa de vídeo (Framer Motion usa Web Animations para `transform`).
 */

const LAYERS = [
  { name: "back", top: 0, period: 520, hump: 130, amp: 22, stroke: 1.2, lines: 2, opacity: 0.3, seed: 11 },
  { name: "mid", top: 0.2, period: 660, hump: 190, amp: 34, stroke: 1.6, lines: 3, opacity: 0.6, seed: 23 },
  { name: "front", top: 0.42, period: 800, hump: 250, amp: 48, stroke: 2.2, lines: 4, opacity: 1, seed: 37 },
];

const PALETTE = {
  day: { ink: "#1e3a8a", paper: "#f5f0e6" },
  night: { ink: "#a9c4e6", paper: "#0c1328" },
};

export default function InkTide({ className = "", layers = LAYERS }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);
  const night = useNight();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width / 40) * 40;
      const h = Math.round(entry.contentRect.height / 10) * 10;
      setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Cursor → parallax da camada da frente
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 18, mass: 0.6 });
  const frontX = useTransform(springX, (v) => v * 28);
  const frontY = useTransform(springY, (v) => v * 8);
  useEffect(() => {
    if (reduceMotion) return undefined;
    const onMove = (event) => {
      if (event.pointerType !== "mouse") return;
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY, reduceMotion]);

  const tiles = useMemo(() => {
    if (!size) return null;
    const unit = Math.min(1.1, Math.max(0.6, size.w / 1440));
    const colors = night ? PALETTE.night : PALETTE.day;
    return layers.map((layer) => {
      const period = Math.round(layer.period * unit);
      const top = Math.round(size.h * layer.top);
      const height = size.h - top;
      return { layer, period, top, height, image: inkTile({ ...layer, period, height, unit }, colors) };
    });
  }, [size, night, layers]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{
        // As ondas nascem do papel: o topo do conjunto se dissolve no fundo
        maskImage: "linear-gradient(to bottom, transparent, #000 22%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 22%)",
      }}
    >
      {tiles?.map(({ layer, period, top, height, image }) => {
        const strip = (
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `calc(100% + ${period * 2}px)`,
              marginLeft: -period,
              backgroundImage: `url("${image}")`,
              backgroundSize: `${period}px ${height}px`,
              backgroundRepeat: "repeat-x",
            }}
          />
        );
        return (
          <div key={layer.name} className="absolute inset-x-0" style={{ top, height, opacity: layer.opacity }}>
            {layer.name === "back" && (
              <motion.div
                className="absolute inset-0"
                animate={reduceMotion ? undefined : { transform: ["translateX(0px)", `translateX(${-period}px)`] }}
                transition={{ duration: 90, ease: "linear", repeat: Infinity }}
              >
                {strip}
              </motion.div>
            )}
            {layer.name === "mid" && (
              <motion.div
                className="absolute inset-0"
                animate={reduceMotion ? undefined : { transform: ["translateY(0px)", "translateY(-8px)", "translateY(0px)"] }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              >
                {strip}
              </motion.div>
            )}
            {layer.name === "front" && (
              <motion.div className="absolute inset-0" style={{ x: frontX, y: frontY }}>
                {strip}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Desenha um ladrilho a nanquim: linha da crista orgânica (periódica, emenda
 * sem costura), hachuras paralelas abaixo dela como numa xilogravura, cachos
 * enrolados nas cristas e pingos de tinta. O corpo é pintado da cor do papel,
 * para cada camada cobrir a de trás.
 */
function inkTile({ period, height, hump, amp: ampBase, stroke, lines, seed, unit }, { ink, paper }) {
  const rand = seededRandom(seed);
  const amp = ampBase * unit;
  const w0 = hump * unit;

  // Cristas espaçadas ao longo do ladrilho
  const crests = [];
  let x = rand() * w0 * 0.3;
  while (x < period - w0 * 0.35) {
    crests.push({ c: x, w: w0 * (0.75 + rand() * 0.5), h: amp * (0.65 + rand() * 0.55) });
    x += w0 * (0.85 + rand() * 0.45);
  }

  const base = amp * 1.9;
  // Onda assimétrica: frente íngreme (esquerda, sentido da quebra), costas longas
  const yAt = (px) => {
    let y = base;
    for (const { c, w, h } of crests) {
      for (const k of [-1, 0, 1]) {
        const u = (px - c - k * period) / w;
        y -= h * Math.exp(-((u < 0 ? u / 0.42 : u / 1.05) ** 2));
      }
    }
    return y;
  };

  const f = (n) => Math.round(n * 10) / 10;
  const step = 4;
  const curve = (dy) => {
    let d = `M0 ${f(yAt(0) + dy)}`;
    for (let px = step; px <= period; px += step) d += `L${px} ${f(yAt(px) + dy)}`;
    return d;
  };

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${period}" height="${height}" viewBox="0 0 ${period} ${height}">`;
  // Corpo (papel) e linha da crista
  svg += `<path d="${curve(0)}L${period} ${height}L0 ${height}Z" fill="${paper}"/>`;
  // Hachuras: linhas paralelas cada vez mais finas e claras
  const gap = 6 * unit + 2;
  for (let i = 1; i <= lines; i++) {
    svg += `<path d="${curve(i * gap)}" fill="none" stroke="${ink}" stroke-width="${f(stroke * (1 - i * 0.16))}" stroke-opacity="${f(0.75 - i * 0.12)}" stroke-linecap="round" stroke-dasharray="${f(40 + rand() * 60)} ${f(6 + rand() * 10)}"/>`;
  }
  svg += `<path d="${curve(0)}" fill="none" stroke="${ink}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Cachos nas cristas (nami-gashira) e pingos de tinta
  for (const { c, h } of crests) {
    for (const k of [0, 1]) {
      const cx = c + k * period;
      if (cx < -20 || cx > period + 20) continue;
      const peakX = cx - h * 0.05;
      const py = yAt(((peakX % period) + period) % period);
      const r = Math.max(4, h * 0.42);
      svg += `<path d="M${f(peakX + r * 0.3)} ${f(py)}C${f(peakX - r * 0.4)} ${f(py - r * 0.7)} ${f(peakX - r * 1.5)} ${f(py - r * 0.3)} ${f(peakX - r * 1.3)} ${f(py + r * 0.45)}C${f(peakX - r * 1.15)} ${f(py + r * 0.95)} ${f(peakX - r * 0.45)} ${f(py + r * 0.85)} ${f(peakX - r * 0.55)} ${f(py + r * 0.35)}" fill="none" stroke="${ink}" stroke-width="${f(stroke * 0.9)}" stroke-linecap="round"/>`;
      const dots = 2 + Math.floor(rand() * 3);
      for (let d = 0; d < dots; d++) {
        svg += `<circle cx="${f(peakX - r * (0.6 + rand() * 1.6))}" cy="${f(py - r * (0.7 + rand() * 1.1))}" r="${f(0.8 + rand() * stroke * 0.7)}" fill="${ink}"/>`;
      }
    }
  }
  svg += "</svg>";
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
