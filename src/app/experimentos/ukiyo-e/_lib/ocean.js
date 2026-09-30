// Mar vetorial do hero: fileiras de ondas no estilo das estampas japonesas
// (o mesmo desenho da intro), cada uma um "ladrilho" que se repete sem emenda
// para rolar infinitamente de lado.

import { buildHump, seededRandom } from "../../_intro/waves";

// As cores vêm de variáveis CSS definidas por fileira (dia/noite trocam na hora)
const VAR_STYLE = { stripes: ["var(--s0)", "var(--s1)", "var(--s2)"] };

// Do fundo para a frente. `water`: altura da linha d'água da fileira (fração da altura do mar).
// `hump`: largura média de um arco (px em 1440 de largura). `speed`: segundos
// para percorrer um ladrilho inteiro (fileiras da frente andam mais rápido).
export const SEA_ROWS = [
  {
    water: 0.3,
    hump: 78,
    speed: 120,
    bob: 3,
    line: 1.3,
    seed: 101,
    day: { body: "#9db9ec", eye: "#7a9ee2", s0: "#f3f7ff", s1: "#cddcf7", s2: "#ffffff", ink: "rgb(10 24 69 / 0.45)", foam: "#fbfcff" },
    night: { body: "#2a3a68", eye: "#223059", s0: "#7185b8", s1: "#51659a", s2: "#91a2cc", ink: "rgb(4 10 28 / 0.7)", foam: "#b9c7e2" },
  },
  {
    water: 0.46,
    hump: 110,
    speed: 88,
    bob: 4,
    line: 1.7,
    seed: 202,
    day: { body: "#6591e3", eye: "#4674d6", s0: "#ffffff", s1: "#c2d6f8", s2: "#dfe9fc", ink: "rgb(10 24 69 / 0.6)", foam: "#fbfcff" },
    night: { body: "#23386f", eye: "#1b2c5d", s0: "#9aaedc", s1: "#5f76b0", s2: "#8196cb", ink: "rgb(4 10 28 / 0.8)", foam: "#c8d5ec" },
  },
  {
    water: 0.62,
    hump: 150,
    speed: 64,
    bob: 5,
    line: 2,
    seed: 303,
    day: { body: "#3467d8", eye: "#2150c0", s0: "#dbeafe", s1: "#ffffff", s2: "#93c5fd", ink: "#0a1845", foam: "#f8fafc" },
    night: { body: "#1d3478", eye: "#142660", s0: "#a9bde6", s1: "#d6e1f5", s2: "#6d88c8", ink: "#040a1c", foam: "#d6e1f2" },
  },
  {
    water: 0.79,
    hump: 200,
    speed: 46,
    bob: 6,
    line: 2.4,
    seed: 404,
    day: { body: "#1d4ed8", eye: "#173a9e", s0: "#bfdbfe", s1: "#ffffff", s2: "#60a5fa", ink: "#0a1845", foam: "#f8fafc" },
    night: { body: "#172d6a", eye: "#0f1f4d", s0: "#8fa7da", s1: "#dfe7f6", s2: "#5a77bd", ink: "#040a1c", foam: "#dde6f4" },
  },
  {
    water: 0.97,
    hump: 260,
    speed: 34,
    bob: 7,
    line: 2.8,
    seed: 505,
    day: { body: "#1e3a8a", eye: "#0f1d4a", s0: "#93c5fd", s1: "#ffffff", s2: "#3b82f6", ink: "#0a1845", foam: "#f8fafc" },
    night: { body: "#0f2150", eye: "#081534", s0: "#7d98d4", s1: "#e4ebf7", s2: "#4a69b4", ink: "#040a1c", foam: "#e2eaf6" },
  },
];

/**
 * Um ladrilho de largura `period` com arcos sobrepostos. As larguras são
 * reescaladas para somar exatamente `period`: repetido lado a lado, emenda
 * sem costura. Também gera as gotas que sobem das cristas.
 */
export function buildTile({ period, hump, seed }) {
  const rand = seededRandom(seed);
  const plan = [];
  let sum = 0;
  while (sum < period || plan.length < 3) {
    const w = hump * (0.72 + rand() * 0.6);
    const step = w * (0.7 + rand() * 0.14);
    plan.push({ w, step });
    sum += step;
  }
  const k = period / sum;
  const base = Math.round(hump * 0.95);
  const humps = [];
  const drops = [];
  let x = 0;
  for (const { w, step } of plan) {
    const h = w * (0.34 + rand() * 0.16);
    const hump = buildHump(x, base, w, h, VAR_STYLE, rand);
    humps.push(hump);
    // Gotas: nascem no alto da crista e sobem soltas
    const count = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      drops.push({
        cx: Math.round((x + w * (0.25 + rand() * 0.5)) * 10) / 10,
        cy: Math.round((base - h * (0.85 + rand() * 0.1)) * 10) / 10,
        r: Math.round((1.2 + rand() * (w / 90)) * 10) / 10,
        delay: Math.round(rand() * 40) / 10,
        duration: Math.round((2.4 + rand() * 1.8) * 10) / 10,
      });
    }
    x += step * k;
  }
  return { humps, drops, base };
}
