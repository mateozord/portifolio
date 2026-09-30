// Ondas japonesas desenhadas por código, no estilo das estampas de ondas:
// arcos em arco-íris sobrepostos, com faixas concêntricas, "olho" escuro no
// centro, contorno de tinta e espuma em nuvem enrolada nos ombros.
// Tudo em pixels do viewport, então os círculos da espuma nunca distorcem.

export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

// Do fundo para a frente. A última camada é a que cobre a tela e depois revela o site.
export const LAYER_STYLES = [
  { body: "#3b82f6", eye: "#1d4ed8", stripes: ["#dbeafe", "#93c5fd", "#ffffff"], scale: 0.72, seed: 11 },
  { body: "#2563eb", eye: "#1e3a8a", stripes: ["#ffffff", "#93c5fd", "#bfdbfe"], scale: 0.86, seed: 23 },
  { body: "#1d4ed8", eye: "#172554", stripes: ["#bfdbfe", "#ffffff", "#60a5fa"], scale: 1, seed: 37 },
  { body: "#1e40af", eye: "#0f1d4a", stripes: ["#93c5fd", "#ffffff", "#3b82f6"], scale: 1.12, seed: 41 },
  { body: "#102a72", eye: "#081640", stripes: ["#3b82f6", "#bfdbfe", "#1d4ed8"], scale: 1.25, seed: 53 },
];

export const INK = "#0a1845";
export const FOAM = "#f8fafc";

/**
 * Gera uma camada: uma fileira de arcos no topo (a crista) e o corpo que cobre a tela.
 */
export function buildWaveLayer({ width, height, style }) {
  const rand = seededRandom(style.seed);
  const hump = Math.min(270, Math.max(120, width / 8.5)) * style.scale;
  const crest = Math.round(hump * 0.62);
  const length = height + crest + 40;
  const base = crest;

  const humps = [];
  let x = -rand() * hump * 0.8;
  while (x < width + hump * 0.2) {
    const w = hump * (0.72 + rand() * 0.6);
    const h = w * (0.34 + rand() * 0.16);
    humps.push(buildHump(x, base, w, h, style, rand));
    x += w * (0.7 + rand() * 0.14);
  }

  return { humps, crest, base, length, width };
}

export function buildHump(x, base, w, h, style, rand) {
  const cx = x + w / 2;
  const rx = w / 2;
  const arc = (k) => `M${r1(cx - rx * k)} ${base}A${r1(rx * k)} ${r1(h * k)} 0 0 1 ${r1(cx + rx * k)} ${base}`;
  const gap = w * 0.055;

  // Faixas concêntricas, como os arcos de arco-íris das estampas
  const stripes = [0.84, 0.7, 0.56].map((k, i) => ({
    d: arc(k),
    color: style.stripes[i % style.stripes.length],
    width: r1(gap * (1 - i * 0.18)),
  }));

  // Espuma no ombro esquerdo (a onda quebra para a esquerda): bolhas grudadas
  // na borda do arco, da crista descendo pelo ombro, cada vez menores, com
  // uma espiral na maior e gotas soltas à frente.
  let foam = null;
  if (rand() < 0.66) {
    const start = Math.PI * (0.5 + rand() * 0.08);
    const r = h * (0.2 + rand() * 0.06);
    const puffs = [];
    for (let k = 0; k < 6; k++) {
      const angle = start + k * Math.PI * (0.075 + rand() * 0.02);
      const edge = 1 + 0.06 - k * 0.012;
      const size = r * (1 - k * 0.12);
      puffs.push([r1(cx + rx * edge * Math.cos(angle)), r1(base - h * edge * Math.sin(angle)), r1(size)]);
    }
    const [bx, by, br] = puffs[1];
    const curl = `M${r1(bx + br * 0.45)} ${r1(by + br * 0.1)}a${r1(br * 0.42)} ${r1(br * 0.42)} 0 1 0 ${r1(-br * 0.46)} ${r1(-br * 0.38)}a${r1(br * 0.22)} ${r1(br * 0.22)} 0 1 1 ${r1(br * 0.2)} ${r1(br * 0.3)}`;
    const [tx, ty] = puffs[3];
    const drops = [
      [-1.5, -0.6, 0.16],
      [-2.1, 0.3, 0.12],
      [-1.2, -1.5, 0.11],
      [-2.6, -0.9, 0.09],
    ].map(([dx, dy, k]) => [r1(tx + dx * r), r1(ty + dy * r), r1(Math.max(1.6, r * k))]);
    foam = { puffs, drops, curl, delay: r1(rand() * 1.5) };
  }

  return {
    outer: `${arc(1)}Z`,
    outline: arc(1),
    eye: `${arc(0.42)}Z`,
    stripes,
    foam,
  };
}
