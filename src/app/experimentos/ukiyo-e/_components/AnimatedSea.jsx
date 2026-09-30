"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { buildTile, SEA_ROWS } from "../_lib/ocean";
import { useNight } from "../_lib/use-night";

/**
 * Mar totalmente animado, desenhado em SVG no estilo das ondas da intro.
 * Cada fileira rola infinitamente de lado (as da frente mais rápido), sobe e
 * desce com a maré, tem espuma pulsando e gotas subindo das cristas. Ao rolar
 * a página as fileiras andam em velocidades diferentes (parallax), e o cursor
 * as desloca de leve em profundidade.
 *
 * `rows`: quais fileiras de SEA_ROWS desenhar. `waters`: linha d'água de cada
 * uma (fração da altura), se quiser outra composição.
 */
export default function AnimatedSea({ rows = [0, 1, 2, 3, 4], waters, scale = 1, parallax = true, className = "" }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);
  const night = useNight();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) => (prev && Math.abs(prev.w - width) < 2 && Math.abs(prev.h - height) < 2 ? prev : { w: width, h: height }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Cursor: desloca as fileiras em profundidade
  const pointer = useMotionValue(0);
  const smooth = useSpring(pointer, { stiffness: 50, damping: 18 });
  useEffect(() => {
    if (reduceMotion || !parallax) return undefined;
    const onMove = (event) => {
      if (event.pointerType === "mouse") pointer.set(event.clientX / window.innerWidth - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer, reduceMotion, parallax]);

  const { scrollY } = useScroll();

  const tiles = useMemo(() => {
    if (!size) return null;
    const unit = Math.min(1.05, Math.max(0.5, size.w / 1440)) * scale;
    return rows.map((index, i) => {
      const row = SEA_ROWS[index];
      const hump = row.hump * unit;
      // O ladrilho tem que ser mais largo que a tela para a emenda nunca aparecer
      const period = Math.ceil(Math.max(size.w + 60, hump * 8) / 10) * 10;
      const top = Math.round(size.h * (waters ? waters[i] : row.water)) - Math.round(hump * 0.95);
      return { index, row, hump, period, top, tile: buildTile({ period, hump, seed: row.seed }) };
    });
  }, [size, rows, waters, scale]);

  return (
    <div ref={ref} aria-hidden className={`overflow-x-clip ${className || "relative"}`}>
      {size &&
        tiles?.map(({ index, row, hump, period, top, tile }, i) => (
          <SeaRow
            key={index}
            depth={i / Math.max(1, tiles.length - 1)}
            row={row}
            hump={hump}
            period={period}
            top={top}
            tile={tile}
            height={size.h - top + 40}
            colors={night ? row.night : row.day}
            smooth={smooth}
            scrollY={scrollY}
            animated={!reduceMotion}
            parallax={parallax && !reduceMotion}
          />
        ))}
    </div>
  );
}

function SeaRow({ depth, row, hump, period, top, tile, height, colors, smooth, scrollY, animated, parallax }) {
  const patternId = `sea-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  // Fileiras de trás ficam mais "presas" ao céu ao rolar; as da frente seguem a página
  const y = useTransform(scrollY, (s) => (parallax ? s * (0.3 - depth * 0.3) : 0));
  const x = useTransform(smooth, (v) => (parallax ? v * (8 + depth * 34) : 0));

  const vars = {
    "--body": colors.body,
    "--eye": colors.eye,
    "--s0": colors.s0,
    "--s1": colors.s1,
    "--s2": colors.s2,
    "--ink": colors.ink,
    "--foam": colors.foam,
    "--period": `${period}px`,
    "--bob": `${row.bob}px`,
    "--rise": `${-(hump * 0.35)}px`,
  };

  return (
    <motion.div className="absolute inset-x-0" style={{ top, height, y, x, ...vars }}>
      <div
        className={animated ? "u-sea-bob absolute inset-0" : "absolute inset-0"}
        style={{ animationDuration: `${4.5 + depth * 2}s`, animationDelay: `${-depth * 3}s` }}
      >
        <div
          className={animated ? "u-sea-drift absolute top-0 h-full" : "absolute top-0 h-full"}
          style={{ left: -period, width: period * 3, animationDuration: `${row.speed}s` }}
        >
          <svg width={period * 3} height={height} className="absolute top-0 left-0 overflow-visible transition-[fill] duration-700">
            {/* Corpo da fileira, com textura seigaiha bem sutil */}
            <defs>
              <pattern id={patternId} width="44" height="22" patternUnits="userSpaceOnUse">
                {[
                  [22, 11],
                  [0, 22],
                  [44, 22],
                  [22, 33],
                ].map(([cx, cy]) =>
                  [22, 15, 8].map((r) => (
                    <path
                      key={`${cx}-${cy}-${r}`}
                      d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                      fill={r === 22 ? "var(--body)" : "none"}
                      stroke="var(--s0)"
                      strokeOpacity="0.14"
                      strokeWidth="1.1"
                    />
                  )),
                )}
              </pattern>
            </defs>
            <rect x="0" y={tile.base - 1} width={period * 3} height={height} fill="var(--body)" />
            <rect x="0" y={tile.base + 14} width={period * 3} height={height} fill={`url(#${patternId})`} />
            {[0, 1, 2].map((copy) => (
              <Tile key={copy} tile={tile} dx={copy * period} line={row.line} animated={animated} />
            ))}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

function Tile({ tile, dx, line, animated }) {
  return (
    <g transform={`translate(${dx} 0)`}>
      {tile.humps.map((hump, k) => (
        <g key={k}>
          <path d={hump.outer} fill="var(--body)" />
          {hump.stripes.map((stripe, j) => (
            <path key={j} d={stripe.d} fill="none" stroke={stripe.color} strokeWidth={stripe.width} strokeLinecap="round" />
          ))}
          <path d={hump.eye} fill="var(--eye)" />
          <path d={hump.outline} fill="none" stroke="var(--ink)" strokeWidth={line} strokeLinejoin="round" />
        </g>
      ))}
      {/* Espuma: contorno primeiro, miolo por cima (vira uma nuvem só), pulsando */}
      {tile.humps.map(
        (hump, k) =>
          hump.foam && (
            <g key={`f${k}`} className={animated ? "u-foam-bob" : undefined} style={{ animationDelay: `${-hump.foam.delay}s` }}>
              {hump.foam.puffs.map(([cx, cy, r], j) => (
                <circle key={`o${j}`} cx={cx} cy={cy} r={r} fill="var(--foam)" stroke="var(--ink)" strokeWidth={line + 0.4} />
              ))}
              {hump.foam.puffs.map(([cx, cy, r], j) => (
                <circle key={`i${j}`} cx={cx} cy={cy} r={Math.max(0, r - line * 0.6)} fill="var(--foam)" />
              ))}
              <path d={hump.foam.curl} fill="none" stroke="var(--ink)" strokeWidth={line * 0.75} strokeLinecap="round" />
              {hump.foam.drops.map(([cx, cy, r], j) => (
                <circle key={`d${j}`} cx={cx} cy={cy} r={r} fill="var(--foam)" stroke="var(--ink)" strokeWidth={line * 0.45} />
              ))}
            </g>
          ),
      )}
      {/* Gotas subindo das cristas */}
      {animated &&
        tile.drops.map((drop, k) => (
          <circle
            key={`r${k}`}
            className="u-sea-drop"
            cx={drop.cx}
            cy={drop.cy}
            r={drop.r}
            fill="var(--foam)"
            stroke="var(--ink)"
            strokeWidth={line * 0.35}
            style={{ animationDelay: `${-drop.delay}s`, animationDuration: `${drop.duration}s` }}
          />
        ))}
    </g>
  );
}
