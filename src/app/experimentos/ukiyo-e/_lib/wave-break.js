// A Grande Onda que quebra com o scroll, desenhada em Canvas 2D no estilo
// das ondas da intro (faixas concêntricas, contorno a nanquim, espuma em
// nuvem com espiral).
//
// progresso 0    → onda armada, majestosa, à direita
// progresso 0.45 → a crista se curva para a frente e a espuma quebra
// progresso 0.75 → a onda despenca, partículas caem pela tela
// progresso 1    → a água vira a maré baixa, que se funde ao papel

import { buildHump, seededRandom } from "../../_intro/waves";

const TAU = Math.PI * 2;
// Espaço da onda: caixa de 1000 × 800 presa ao canto inferior direito da tela
const BOX_W = 1000;
const BOX_H = 800;

// Quadros-chave da forma (interpolados suavemente)
const KEYS = [
  { p: 0, base: [1090, 930], c1: [1010, 760], c2: [900, 560], center: [500, 330], r0: 262, rEnd: 160, phi0: 0.28, turns: 0.48, sx: 1.18, sy: 0.94, w0: 380, foam: 0.6 },
  { p: 0.42, base: [1090, 930], c1: [1000, 760], c2: [880, 570], center: [450, 360], r0: 285, rEnd: 88, phi0: 0.32, turns: 0.92, sx: 1.22, sy: 0.92, w0: 400, foam: 0.42 },
  { p: 0.72, base: [1090, 960], c1: [980, 830], c2: [860, 700], center: [420, 560], r0: 232, rEnd: 70, phi0: 0.36, turns: 1.05, sx: 1.28, sy: 0.74, w0: 330, foam: 0.3 },
  { p: 1, base: [1090, 1010], c1: [960, 950], c2: [830, 880], center: [400, 840], r0: 170, rEnd: 60, phi0: 0.4, turns: 1, sx: 1.3, sy: 0.55, w0: 230, foam: 0.25 },
];

export const PALETTES = {
  day: {
    outer: "#3b74e8",
    body: "#1d4ed8",
    tube: "#16286b",
    eye: "#0b1640",
    stripes: ["#ffffff", "#bfdbfe", "#93c5fd"],
    ink: "#0a1845",
    foam: "#fbfaf6",
    fuji: "#5b70ad",
    snow: "#fbf8f0",
    rows: [
      { body: "#3467d8", eye: "#1f4fbf", stripes: ["#dbeafe", "#ffffff", "#93c5fd"] },
      { body: "#1d4ed8", eye: "#173a9e", stripes: ["#bfdbfe", "#ffffff", "#60a5fa"] },
      { body: "#1e3a8a", eye: "#0f1d4a", stripes: ["#93c5fd", "#ffffff", "#3b82f6"] },
    ],
  },
  night: {
    outer: "#2a4a94",
    body: "#1d3478",
    tube: "#0f1f4d",
    eye: "#060f2b",
    stripes: ["#dfe7f6", "#8fa7da", "#5a77bd"],
    ink: "#030816",
    foam: "#dde6f4",
    fuji: "#22365f",
    snow: "#cdd8e6",
    rows: [
      { body: "#1d3478", eye: "#142660", stripes: ["#a9bde6", "#d6e1f5", "#6d88c8"] },
      { body: "#172d6a", eye: "#0f1f4d", stripes: ["#8fa7da", "#dfe7f6", "#5a77bd"] },
      { body: "#0f2150", eye: "#081534", stripes: ["#7d98d4", "#e4ebf7", "#4a69b4"] },
    ],
  },
};

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const lerp = (a, b, t) => a + (b - a) * t;

/** Interpola os quadros-chave no progresso p. */
function shapeAt(p) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
  const out = {};
  for (const key of Object.keys(a)) {
    out[key] = Array.isArray(a[key]) ? a[key].map((v, k) => lerp(v, b[key][k], t)) : lerp(a[key], b[key], t);
  }
  return out;
}

function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/** Linha central da onda (base → espiral), reamostrada, com normal interna e espessura. */
function spine(shape, sway) {
  const { base, c1, c2, r0, rEnd, phi0, turns, sx, sy, w0 } = shape;
  const center = [shape.center[0], shape.center[1] + sway];
  const phi1 = phi0 - turns * TAU;
  const k = Math.log(r0 / rEnd) / (phi0 - phi1);
  const start = [center[0] + r0 * Math.cos(phi0) * sx, center[1] + r0 * Math.sin(phi0) * sy];

  const raw = [];
  for (let i = 0; i <= 30; i++) raw.push(cubic(base, c1, c2, start, i / 30));
  for (let i = 1; i <= 160; i++) {
    const phi = phi0 - ((phi0 - phi1) * i) / 160;
    const r = r0 * Math.exp(k * (phi - phi0));
    raw.push([center[0] + r * Math.cos(phi) * sx, center[1] + r * Math.sin(phi) * sy]);
  }
  const acc = [0];
  for (let i = 1; i < raw.length; i++) acc.push(acc[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
  const total = acc[acc.length - 1];
  const count = 150;
  const pts = [];
  let j = 1;
  for (let i = 0; i <= count; i++) {
    const target = (total * i) / count;
    while (j < acc.length - 1 && acc[j] < target) j++;
    const t = (target - acc[j - 1]) / (acc[j] - acc[j - 1] || 1);
    pts.push({ x: lerp(raw[j - 1][0], raw[j][0], t), y: lerp(raw[j - 1][1], raw[j][1], t), s: i / count });
  }
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const tx = (b.x - a.x) / len;
    const ty = (b.y - a.y) / len;
    let nx = -ty;
    let ny = tx;
    if (nx * (center[0] - pts[i].x) + ny * (center[1] - pts[i].y) < 0) {
      nx = -nx;
      ny = -ny;
    }
    Object.assign(pts[i], { tx, ty, nx, ny, w: 6 + (w0 - 6) * Math.pow(1 - pts[i].s, 1.1) });
  }
  return pts;
}

const at = (p, f) => [p.x + p.nx * p.w * f, p.y + p.ny * p.w * f];

/** Cria a cena num canvas. Devolve { setProgress, setNight, setBackground, destroy }. */
export function createWaveBreak(canvas, { night = false, animated = true, background = "#f5f0e6" } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setProgress() {}, setNight() {}, setBackground() {}, destroy() {} };

  let palette = night ? PALETTES.night : PALETTES.day;
  let bg = background;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let scale = 1;
  let ox = 0;
  let oy = 0;
  let progress = 0;
  let lastProgress = 0;
  let time = 0;
  let last = 0;
  let frame = 0;
  let visible = true;
  let particles = [];
  let tide = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const mobile = width < 768;
    // Desktop: caixa limitada pela altura, à direita. Celular: pela largura, embaixo.
    scale = mobile ? (width * 1.25) / BOX_W : Math.min((height * 1.04) / BOX_H, (width * 0.78) / BOX_W);
    ox = width - BOX_W * scale + (mobile ? width * 0.12 : BOX_W * scale * 0.04);
    oy = height - BOX_H * scale;
    tide = buildTide();
    draw();
  }

  /** Três fileiras de ondas (estilo intro) que formam a maré final. */
  function buildTide() {
    const unit = Math.min(1.05, Math.max(0.5, width / 1440));
    return [0, 1, 2].map((row) => {
      const rand = seededRandom(700 + row * 31);
      const hump = [120, 170, 230][row] * unit;
      const period = Math.ceil((width + hump * 2) / 10) * 10;
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
      let x = 0;
      const style = { stripes: [0, 1, 2] };
      for (const { w, step } of plan) {
        const h = w * (0.34 + rand() * 0.16);
        const shape = buildHump(x, base, w, h, style, rand);
        humps.push({
          outer: new Path2D(shape.outer),
          outline: new Path2D(shape.outline),
          eye: new Path2D(shape.eye),
          stripes: shape.stripes.map((s) => ({ path: new Path2D(s.d), index: s.color, width: s.width })),
          foam: shape.foam && {
            puffs: shape.foam.puffs,
            curl: new Path2D(shape.foam.curl),
            drops: shape.foam.drops,
          },
        });
        x += step * k;
      }
      return { humps, period, base, hump, speed: [14, 22, 32][row] * unit, line: [1.8, 2.3, 2.8][row] };
    });
  }

  function drawFuji() {
    // Monte Fuji pequenino no vão da onda, como na gravura
    const fx = 170;
    const fy = 560;
    ctx.beginPath();
    ctx.moveTo(fx - 120, fy + 60);
    ctx.quadraticCurveTo(fx - 40, fy + 10, fx - 12, fy - 46);
    ctx.quadraticCurveTo(fx, fy - 58, fx + 12, fy - 46);
    ctx.quadraticCurveTo(fx + 40, fy + 10, fx + 120, fy + 60);
    ctx.closePath();
    ctx.fillStyle = palette.fuji;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = palette.ink;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fx - 24, fy - 26);
    ctx.lineTo(fx - 12, fy - 46);
    ctx.quadraticCurveTo(fx, fy - 58, fx + 12, fy - 46);
    ctx.lineTo(fx + 24, fy - 26);
    ctx.lineTo(fx + 14, fy - 30);
    ctx.lineTo(fx + 6, fy - 20);
    ctx.lineTo(fx - 2, fy - 31);
    ctx.lineTo(fx - 10, fy - 21);
    ctx.lineTo(fx - 16, fy - 30);
    ctx.closePath();
    ctx.fillStyle = palette.snow;
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  function band(pts, f1, f2, color, from = 0, to = 1) {
    const part = pts.filter((p) => p.s >= from && p.s <= to);
    if (part.length < 2) return;
    ctx.beginPath();
    let [x, y] = at(part[0], f1);
    ctx.moveTo(x, y);
    for (let i = 1; i < part.length; i++) {
      [x, y] = at(part[i], f1);
      ctx.lineTo(x, y);
    }
    for (let i = part.length - 1; i >= 0; i--) {
      [x, y] = at(part[i], f2);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function edge(pts, f, from = 0, to = 1) {
    const part = pts.filter((p) => p.s >= from && p.s <= to);
    ctx.beginPath();
    part.forEach((p, i) => {
      const [x, y] = at(p, f);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
  }

  function drawWave(shape) {
    const pts = spine(shape, animated ? Math.sin(time * 0.9) * 5 : 0);

    // Corpo em faixas: de fora (claro) para dentro do tubo (escuro)
    band(pts, -0.5, -0.12, palette.outer);
    band(pts, -0.12, 0.22, palette.body);
    band(pts, 0.22, 0.42, palette.tube);
    band(pts, 0.42, 0.5, palette.eye);

    // Listras concêntricas (os "arcos de arco-íris"), afinando para a ponta
    ctx.lineCap = "round";
    const stripes = [-0.38, -0.28, -0.18];
    stripes.forEach((f, i) => {
      for (let seg = 0; seg < 8; seg++) {
        const from = 0.02 + seg * 0.105;
        const to = from + 0.11;
        const mid = pts[Math.round(((from + to) / 2) * (pts.length - 1))];
        edge(pts, f, from, to);
        ctx.strokeStyle = palette.stripes[i];
        ctx.lineWidth = Math.max(1.2, mid.w * (0.05 - i * 0.008));
        ctx.stroke();
      }
    });
    // Linhas d'água correndo dentro do tubo
    ctx.setLineDash([60, 26, 18, 26]);
    ctx.lineDashOffset = -time * 40;
    edge(pts, 0.3, 0.04, 0.85);
    ctx.strokeStyle = palette.stripes[1];
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Contorno a nanquim
    ctx.lineJoin = "round";
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 3.4;
    edge(pts, -0.5);
    ctx.stroke();
    edge(pts, 0.5, 0, 0.97);
    ctx.stroke();

    drawFoam(pts, shape);
    return pts;
  }

  /** Espuma: bolhas encostadas na borda externa da crista + aglomerado na ponta. */
  function drawFoam(pts, shape) {
    const puffs = [];
    const grow = 1 + progress * 0.6;
    for (let i = 0; i < pts.length; i += 4) {
      const p = pts[i];
      if (p.s < shape.foam) continue;
      const r = Math.max(9, p.w * 0.12 + 7) * grow * (0.85 + 0.3 * Math.sin(i * 1.7));
      const [ex, ey] = at(p, -0.5);
      const wob = animated ? Math.sin(time * 2.1 + i) * 1.6 : 0;
      puffs.push([ex - p.nx * r * 0.35 + wob, ey - p.ny * r * 0.35, r, i]);
    }
    // Aglomerado na ponta (a "mão" da onda)
    const tip = pts[pts.length - 1];
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * TAU + time * 0.3;
      const r = (14 + k * 2.5) * grow;
      puffs.push([tip.x + Math.cos(a) * r * 0.9, tip.y + Math.sin(a) * r * 0.9, r, 999 + k]);
    }
    ctx.fillStyle = palette.foam;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 3.2;
    for (const [x, y, r] of puffs) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
    }
    for (const [x, y, r] of puffs) {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0, r - 1.8), 0, TAU);
      ctx.fill();
    }
    // Espirais nas bolhas maiores
    ctx.lineWidth = 2.2;
    for (const [x, y, r, i] of puffs) {
      if (r < 15 || i % 3) continue;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.45, Math.PI * 0.2, Math.PI * 1.7);
      ctx.arc(x - r * 0.08, y - r * 0.04, r * 0.22, Math.PI * 1.7, Math.PI * 0.6, true);
      ctx.stroke();
    }
  }

  function drawTide(rise) {
    if (rise <= 0.001) return;
    const rows = palette.rows;
    tide.forEach((row, index) => {
      const style = rows[index];
      const y = height - (row.base * 0.55 + index * row.hump * 0.28 + 30) * rise + (1 - rise) * 40;
      const drift = animated ? -((time * row.speed) % row.period) : 0;
      ctx.save();
      ctx.translate(drift, y - row.base);
      ctx.fillStyle = style.body;
      ctx.fillRect(-row.period, row.base - 1, row.period * 3, height);
      for (const dx of [0, row.period, row.period * 2]) {
        ctx.save();
        ctx.translate(dx - row.period * 0.5, 0);
        for (const h of row.humps) {
          ctx.fillStyle = style.body;
          ctx.fill(h.outer);
          ctx.lineCap = "round";
          for (const s of h.stripes) {
            ctx.strokeStyle = style.stripes[s.index];
            ctx.lineWidth = s.width;
            ctx.stroke(s.path);
          }
          ctx.fillStyle = style.eye;
          ctx.fill(h.eye);
          ctx.strokeStyle = palette.ink;
          ctx.lineWidth = row.line;
          ctx.stroke(h.outline);
        }
        for (const h of row.humps) {
          if (!h.foam) continue;
          ctx.strokeStyle = palette.ink;
          ctx.fillStyle = palette.foam;
          ctx.lineWidth = row.line + 0.4;
          for (const [cx, cy, r] of h.foam.puffs) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, TAU);
            ctx.stroke();
          }
          for (const [cx, cy, r] of h.foam.puffs) {
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(0, r - row.line * 0.6), 0, TAU);
            ctx.fill();
          }
          ctx.lineWidth = row.line * 0.75;
          ctx.stroke(h.foam.curl);
        }
        ctx.restore();
      }
      ctx.restore();
    });
  }

  /** Partículas de espuma: nascem na crista quando a onda quebra e despencam. */
  function emit(pts, dt, dp) {
    if (!animated || progress < 0.2 || progress > 0.9) return;
    const rate = 18 + Math.min(220, Math.abs(dp) / Math.max(dt, 0.001) * 260);
    let count = rate * dt;
    while (count > 0) {
      if (count < 1 && Math.random() > count) break;
      count -= 1;
      const p = pts[Math.floor(pts.length * (0.62 + Math.random() * 0.38)) - 1];
      const [ex, ey] = at(p, -0.5);
      const sx = ox + ex * scale;
      const sy = oy + ey * scale;
      const speed = (60 + Math.random() * 140) * scale;
      particles.push({
        x: sx,
        y: sy,
        vx: (p.tx * 0.6 - p.nx * 0.4 - 0.3) * speed + (Math.random() - 0.5) * 40,
        vy: (p.ty * 0.6 - p.ny * 0.4) * speed - Math.random() * 60,
        r: (1.4 + Math.random() * Math.random() * 6.5) * Math.max(0.7, scale),
        life: 0,
      });
    }
    if (particles.length > 420) particles.splice(0, particles.length - 420);
  }

  function drawParticles(dt) {
    const g = 420;
    ctx.lineWidth = 1.2;
    for (let i = particles.length - 1; i >= 0; i--) {
      const q = particles[i];
      q.vy += g * dt;
      q.vx *= 0.995;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.life += dt;
      if (q.y > height + 20 || q.life > 5) {
        particles.splice(i, 1);
        continue;
      }
      const fade = Math.min(1, q.life * 4) * (1 - Math.max(0, q.life - 3.5) / 1.5);
      ctx.globalAlpha = fade;
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r, 0, TAU);
      ctx.fillStyle = palette.foam;
      ctx.fill();
      if (q.r > 3.2) {
        ctx.strokeStyle = palette.ink;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function draw(dt = 0) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Espaço da onda
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr);
    drawFuji();
    const shape = shapeAt(progress);
    const pts = drawWave(shape);

    // Espaço da tela
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    emit(pts, dt, progress - lastProgress);
    lastProgress = progress;
    drawParticles(dt);
    // A maré já existe no início (segura a onda e o Fuji) e sobe quando a água cai
    drawTide(0.34 + 0.5 * smooth(clamp01((progress - 0.45) / 0.55)));

    // A base se dissolve no papel: a maré nasce do fundo da página
    const fade = ctx.createLinearGradient(0, height * 0.86, 0, height);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, bg);
    ctx.fillStyle = fade;
    ctx.globalAlpha = smooth(clamp01((progress - 0.55) / 0.45));
    ctx.fillRect(0, height * 0.86, width, height * 0.14 + 1);
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    frame = requestAnimationFrame(tick);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    time += dt;
    draw(dt);
  }

  function start() {
    if (!animated || frame || !visible) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(canvas);
  resize();
  start();

  return {
    setProgress(value) {
      progress = clamp01(value);
      if (!frame) draw();
    },
    setNight(value) {
      palette = value ? PALETTES.night : PALETTES.day;
      if (!frame) draw();
    },
    setBackground(color) {
      bg = color;
      if (!frame) draw();
    },
    destroy() {
      stop();
      ro.disconnect();
      io.disconnect();
    },
  };
}
