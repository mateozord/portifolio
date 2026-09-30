// Lago de koi em Canvas 2D. Cada koi é uma "espinha" de pontos: a cabeça nada
// e o resto do corpo a segue a uma distância fixa, o que cria o nado sinuoso.
// Os peixes passeiam sozinhos, ficam curiosos com o cursor e correm atrás da
// ração quando alguém clica na água. Vitórias-régias flutuam por cima.

const TAU = Math.PI * 2;
// Espinha da cabeça até a base da cauda. A barbatana da cauda é desenhada à parte.
const SEGMENTS = 10;
// Largura do corpo ao longo da espinha: torpedo gordinho, afinando na base da cauda
const PROFILE = [0.66, 0.9, 1, 0.98, 0.9, 0.78, 0.63, 0.48, 0.34, 0.24];
// Quanto cada junta pode dobrar em relação à anterior (rad). Impede o peixe de se enrolar.
const MAX_BEND = 0.3;

const RED = "#d4432f";
const INK = "#1d1f2b";
const WHITE = "#f7f2e8";

// Variedades tradicionais. Manchas: t = posição na espinha (0 cabeça, 1 cauda),
// o = deslocamento lateral (-1 a 1), r = raio relativo à largura máxima.
const VARIETIES = [
  { name: "tancho", base: WHITE, spots: [{ t: 0.05, o: 0, r: 0.5, c: RED }] },
  {
    name: "kohaku",
    base: WHITE,
    spots: [
      { t: 0.12, o: 0.2, r: 0.75, c: RED },
      { t: 0.38, o: -0.35, r: 0.85, c: RED },
      { t: 0.62, o: 0.3, r: 0.6, c: RED },
    ],
  },
  {
    name: "sanke",
    base: WHITE,
    spots: [
      { t: 0.15, o: -0.1, r: 0.8, c: RED },
      { t: 0.3, o: 0.5, r: 0.35, c: INK },
      { t: 0.5, o: -0.2, r: 0.7, c: RED },
      { t: 0.66, o: -0.5, r: 0.3, c: INK },
    ],
  },
  { name: "ogon", base: "#e7aa3c", spots: [{ t: 0.2, o: 0, r: 0.9, c: "#f5d27c" }] },
  {
    name: "benigoi",
    base: "#e0612e",
    spots: [
      { t: 0.25, o: 0.35, r: 0.45, c: WHITE },
      { t: 0.55, o: -0.3, r: 0.4, c: WHITE },
    ],
  },
  {
    name: "showa",
    base: INK,
    spots: [
      { t: 0.1, o: 0.1, r: 0.7, c: RED },
      { t: 0.35, o: -0.4, r: 0.5, c: WHITE },
      { t: 0.55, o: 0.35, r: 0.55, c: RED },
    ],
  },
];

function wrapAngle(a) {
  while (a > Math.PI) a -= TAU;
  while (a < -Math.PI) a += TAU;
  return a;
}

function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function createKoiPond(canvas, { animated = true, night = false } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setNight() {}, destroy() {} };

  let isNight = night;
  let width = 0;
  let height = 0;
  let time = 0;
  let last = 0;
  let frame = 0;
  let koi = [];
  let pads = [];
  const food = [];
  const ripples = [];
  const pointer = { x: 0, y: 0, inside: false, lastRipple: 0 };

  function makeKoi(i, count) {
    // Comprimento do corpo (sem a cauda)
    const length = (86 + Math.random() * 36) * Math.min(1, Math.max(0.7, width / 1100));
    const seg = length / (SEGMENTS - 1);
    const x = width * (0.15 + Math.random() * 0.7);
    const y = height * (0.15 + Math.random() * 0.7);
    const heading = Math.random() * TAU;
    return {
      variety: VARIETIES[i % VARIETIES.length],
      length,
      seg,
      heading,
      speed: 34 + Math.random() * 18,
      cruise: 34 + Math.random() * 18,
      phase: Math.random() * TAU,
      curious: i < Math.ceil(count * 0.7),
      points: Array.from({ length: SEGMENTS }, (_, k) => ({
        x: x - Math.cos(heading) * seg * k,
        y: y - Math.sin(heading) * seg * k,
      })),
    };
  }

  function makePads() {
    const count = Math.round(Math.min(7, Math.max(3, width / 180)));
    return Array.from({ length: count }, (_, i) => {
      const x = width * ((i + 0.5) / count) + (Math.random() - 0.5) * 80;
      // Folhas de cima só na metade direita: o canto de cima à esquerda tem a dica em texto.
      const top = i % 2 === 1 && x > width * 0.5;
      return {
        x,
        y: top ? height * (0.06 + Math.random() * 0.1) : height * (0.82 + Math.random() * 0.12),
        r: 22 + Math.random() * 20,
        angle: Math.random() * TAU,
        flower: Math.random() < 0.45,
        seed: Math.random() * 100,
      };
    });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const first = width === 0;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (first || koi.length === 0) {
      const count = width < 640 ? 4 : 6;
      koi = Array.from({ length: count }, (_, i) => makeKoi(i, count));
    }
    pads = makePads();
    if (!frame) draw(0);
  }

  function steer(fish, dt) {
    const head = fish.points[0];
    // Passeio: rumo que muda devagar, com um pouco de "vontade própria"
    let desired = fish.heading + Math.sin(time * 0.35 + fish.phase) * 0.9 * dt * 4;
    let targetSpeed = fish.cruise;

    // Ração tem prioridade; senão, os curiosos seguem o cursor
    let target = null;
    let best = Infinity;
    for (const pellet of food) {
      const d = Math.hypot(pellet.x - head.x, pellet.y - head.y);
      if (d < best) {
        best = d;
        target = pellet;
      }
    }
    let orbit = null;
    if (!target && pointer.inside && fish.curious) {
      // Cada koi rodeia o cursor numa órbita própria, em vez de todos irem ao mesmo ponto
      const a = fish.phase + time * 0.6 * (fish.phase > Math.PI ? 1 : -1);
      const radius = 50 + (fish.phase / TAU) * 70;
      orbit = { x: pointer.x + Math.cos(a) * radius, y: pointer.y + Math.sin(a) * radius };
      const d = Math.hypot(orbit.x - head.x, orbit.y - head.y);
      if (Math.hypot(pointer.x - head.x, pointer.y - head.y) < 340) {
        target = orbit;
        best = d;
      }
    }
    if (target) {
      desired = Math.atan2(target.y - head.y, target.x - head.x);
      targetSpeed = target === orbit ? (best < 40 ? fish.cruise * 0.7 : fish.cruise * 1.15) : fish.cruise * 2;
      if (target !== orbit && best < 10) target.eaten = true;
    }

    // Cardume: desvia de quem está perto demais, para ninguém se amontoar
    let pushX = 0;
    let pushY = 0;
    for (const other of koi) {
      if (other === fish) continue;
      for (const q of [other.points[0], other.points[3], other.points[6]]) {
        const dx = head.x - q.x;
        const dy = head.y - q.y;
        const d = Math.hypot(dx, dy);
        const reach = fish.length * 0.75;
        if (d > 0 && d < reach) {
          pushX += (dx / d) * (1 - d / reach);
          pushY += (dy / d) * (1 - d / reach);
        }
      }
    }
    if (pushX || pushY) {
      const away = Math.atan2(pushY, pushX);
      const weight = Math.min(0.85, Math.hypot(pushX, pushY));
      desired += wrapAngle(away - desired) * weight;
    }

    // Longe das bordas
    const margin = 70;
    const edge = Math.min(head.x, width - head.x, head.y, height - head.y);
    if (edge < margin) {
      const toCenter = Math.atan2(height / 2 - head.y, width / 2 - head.x);
      const weight = 1 - Math.max(0, edge) / margin;
      desired += wrapAngle(toCenter - desired) * weight;
    }

    const turnRate = target ? 2.2 : 1.1;
    const diff = wrapAngle(desired - fish.heading);
    fish.heading += Math.max(-turnRate * dt, Math.min(turnRate * dt, diff));
    fish.speed += (targetSpeed - fish.speed) * Math.min(1, dt * 2);
  }

  function move(fish, dt) {
    const head = fish.points[0];
    // O "rebolado" do nado: a cabeça oscila e o corpo repassa a onda
    const wiggle = Math.sin(time * (3.2 + fish.speed * 0.04) + fish.phase) * 0.16;
    const dir = fish.heading + wiggle;
    head.x += Math.cos(dir) * fish.speed * dt;
    head.y += Math.sin(dir) * fish.speed * dt;
    // Cada ponto segue o anterior a uma distância fixa, e a dobra entre dois
    // segmentos seguidos é limitada: o corpo curva, mas nunca se enrola.
    let prevAngle = Math.atan2(-Math.sin(fish.heading), -Math.cos(fish.heading));
    for (let i = 1; i < SEGMENTS; i++) {
      const a = fish.points[i - 1];
      const b = fish.points[i];
      let angle = Math.atan2(b.y - a.y, b.x - a.x);
      const bend = wrapAngle(angle - prevAngle);
      if (Math.abs(bend) > MAX_BEND) angle = prevAngle + Math.sign(bend) * MAX_BEND;
      b.x = a.x + Math.cos(angle) * fish.seg;
      b.y = a.y + Math.sin(angle) * fish.seg;
      prevAngle = angle;
    }
  }

  /** Contorno do corpo: lado direito da cauda à cabeça, volta pela esquerda. */
  function bodyOutline(fish) {
    const maxW = fish.length * 0.15;
    const left = [];
    const right = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const a = fish.points[Math.max(0, i - 1)];
      const b = fish.points[Math.min(SEGMENTS - 1, i + 1)];
      const len = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const nx = -(a.y - b.y) / len;
      const ny = (a.x - b.x) / len;
      const w = PROFILE[i] * maxW;
      const p = fish.points[i];
      left.push([p.x + nx * w, p.y + ny * w]);
      right.push([p.x - nx * w, p.y - ny * w]);
    }
    return { left, right, maxW };
  }

  function smoothPath(points) {
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length - 1; i++) {
      const mx = (points[i][0] + points[i + 1][0]) / 2;
      const my = (points[i][1] + points[i + 1][1]) / 2;
      ctx.quadraticCurveTo(points[i][0], points[i][1], mx, my);
    }
    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint[0], lastPoint[1]);
  }

  function traceBody(fish, outline, dx = 0, dy = 0) {
    const { left, right } = outline;
    const head = fish.points[0];
    const neck = fish.points[1];
    const hx = head.x - neck.x;
    const hy = head.y - neck.y;
    const hl = Math.hypot(hx, hy) || 1;
    const front = [head.x + (hx / hl) * outline.maxW * 1.1 + dx, head.y + (hy / hl) * outline.maxW * 1.1 + dy];
    const shift = (list) => list.map(([x, y]) => [x + dx, y + dy]);
    ctx.beginPath();
    smoothPath(shift(right).reverse());
    ctx.quadraticCurveTo(front[0], front[1], left[0][0] + dx, left[0][1] + dy);
    const rest = shift(left);
    for (let i = 1; i < rest.length - 1; i++) {
      const mx = (rest[i][0] + rest[i + 1][0]) / 2;
      const my = (rest[i][1] + rest[i + 1][1]) / 2;
      ctx.quadraticCurveTo(rest[i][0], rest[i][1], mx, my);
    }
    ctx.closePath();
  }

  /** Nadadeira translúcida: leque arredondado com raios finos, sem contorno. */
  function drawFin(x, y, angle, length, spread, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -spread * 0.25);
    ctx.bezierCurveTo(length * 0.3, -spread * 1.05, length * 1.05, -spread * 0.75, length, 0);
    ctx.bezierCurveTo(length * 0.95, spread * 0.55, length * 0.35, spread * 0.55, 0, spread * 0.25);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, 0, length, 0);
    g.addColorStop(0, withAlpha(color, 0.75));
    g.addColorStop(1, withAlpha(color, 0.25));
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let r = -1; r <= 1; r++) {
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(length * 0.5, spread * 0.3 * r, length * 0.88, spread * 0.45 * r);
    }
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Cauda em véu: um leque largo preso à base do corpo, com dois lobos e um
   * entalhe no meio. Balança com o nado; transparente nas pontas.
   */
  function drawTail(fish, maxW, color) {
    const end = fish.points[SEGMENTS - 1];
    const prev = fish.points[SEGMENTS - 3];
    const dir = Math.atan2(end.y - prev.y, end.x - prev.x);
    const len = fish.length * 0.4;
    const sway = Math.sin(time * 4.2 + fish.phase) * 0.28;
    const base = maxW * 0.42;
    const nx = Math.cos(dir + Math.PI / 2);
    const ny = Math.sin(dir + Math.PI / 2);
    const at = (angle, dist) => [end.x + Math.cos(dir + angle + sway) * dist, end.y + Math.sin(dir + angle + sway) * dist];
    const [lx, ly] = at(0.55, len);
    const [rx, ry] = at(-0.55, len);
    const [cx, cy] = at(sway * 0.8, len * 0.62);
    const [lcx, lcy] = at(0.35, len * 0.95);
    const [rcx, rcy] = at(-0.35, len * 0.95);

    ctx.beginPath();
    ctx.moveTo(end.x + nx * base, end.y + ny * base);
    ctx.quadraticCurveTo(end.x + nx * base * 1.6 + Math.cos(dir) * len * 0.4, end.y + ny * base * 1.6 + Math.sin(dir) * len * 0.4, lx, ly);
    ctx.quadraticCurveTo(lcx, lcy, cx, cy);
    ctx.quadraticCurveTo(rcx, rcy, rx, ry);
    ctx.quadraticCurveTo(end.x - nx * base * 1.6 + Math.cos(dir) * len * 0.4, end.y - ny * base * 1.6 + Math.sin(dir) * len * 0.4, end.x - nx * base, end.y - ny * base);
    ctx.closePath();
    const g = ctx.createRadialGradient(end.x, end.y, 0, end.x, end.y, len);
    g.addColorStop(0, withAlpha(color, 0.85));
    g.addColorStop(0.6, withAlpha(color, 0.5));
    g.addColorStop(1, withAlpha(color, 0.18));
    ctx.fillStyle = g;
    ctx.fill();
    // Raios do véu
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let r = -3; r <= 3; r++) {
      if (r === 0) continue;
      const [tx, ty] = at(r * 0.16, len * (0.72 + Math.abs(r) * 0.07));
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(tx, ty);
    }
    ctx.stroke();
  }

  function drawKoi(fish) {
    const { variety } = fish;
    const outline = bodyOutline(fish);
    const { maxW } = outline;
    const finColor = variety.base === INK ? "#6b6f84" : variety.base === WHITE ? "#f2ece0" : variety.base;
    const flap = Math.sin(time * 4 + fish.phase);

    // Sombra no fundo do lago
    traceBody(fish, outline, 6, 10);
    ctx.fillStyle = isNight ? "rgba(0, 0, 0, 0.35)" : "rgba(15, 35, 55, 0.16)";
    ctx.fill();

    // À noite, um brilho quente ao redor (lanterna refletida)
    if (isNight) {
      const mid = fish.points[3];
      const glow = ctx.createRadialGradient(mid.x, mid.y, 0, mid.x, mid.y, fish.length * 0.7);
      glow.addColorStop(0, withAlpha(variety.base === INK ? RED : variety.base, 0.22));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(mid.x - fish.length, mid.y - fish.length, fish.length * 2, fish.length * 2);
    }

    drawTail(fish, maxW, finColor);

    // Nadadeiras peitorais (grandes, perto da cabeça) e pélvicas (pequenas)
    for (const [index, size, open] of [
      [2, 1, 1.0],
      [5, 0.55, 0.85],
    ]) {
      const p = fish.points[index];
      const q = fish.points[index + 1];
      const back = Math.atan2(q.y - p.y, q.x - p.x);
      const w = PROFILE[index] * maxW;
      for (const side of [1, -1]) {
        const nx = Math.cos(back + (side * Math.PI) / 2);
        const ny = Math.sin(back + (side * Math.PI) / 2);
        const angle = back + side * (open + flap * 0.2);
        drawFin(p.x + nx * w * 0.75, p.y + ny * w * 0.75, angle, maxW * 1.45 * size, maxW * 0.7 * size, finColor);
      }
    }

    // Nadadeira dorsal: uma faixa fina ao longo do dorso
    ctx.strokeStyle = withAlpha(finColor, 0.55);
    ctx.lineWidth = maxW * 0.22;
    ctx.lineCap = "round";
    ctx.beginPath();
    smoothPath(fish.points.slice(2, 7).map((p) => [p.x, p.y]));
    ctx.stroke();

    // Corpo e manchas
    traceBody(fish, outline);
    ctx.fillStyle = variety.base;
    ctx.fill();
    ctx.save();
    ctx.clip();
    for (const spot of variety.spots) {
      const f = spot.t * (SEGMENTS - 1);
      const i = Math.floor(f);
      const a = fish.points[i];
      const b = fish.points[Math.min(SEGMENTS - 1, i + 1)];
      const k = f - i;
      const px = a.x + (b.x - a.x) * k;
      const py = a.y + (b.y - a.y) * k;
      const angle = Math.atan2(a.y - b.y, a.x - b.x);
      const w = PROFILE[i] * maxW;
      const ox = Math.cos(angle + Math.PI / 2) * w * spot.o;
      const oy = Math.sin(angle + Math.PI / 2) * w * spot.o;
      ctx.beginPath();
      ctx.ellipse(px + ox, py + oy, spot.r * maxW * 1.35, spot.r * maxW, angle, 0, TAU);
      ctx.fillStyle = spot.c;
      ctx.fill();
    }
    // Volume: bordas mais escuras e um brilho no dorso
    traceBody(fish, outline);
    ctx.strokeStyle = "rgba(10, 20, 40, 0.16)";
    ctx.lineWidth = maxW * 0.7;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    ctx.lineWidth = maxW * 0.16;
    ctx.beginPath();
    smoothPath(fish.points.slice(1, 7).map((p) => [p.x, p.y]));
    ctx.stroke();
    ctx.restore();

    // Contorno bem sutil e olhos
    traceBody(fish, outline);
    ctx.strokeStyle = isNight ? "rgba(5, 10, 20, 0.35)" : "rgba(20, 38, 76, 0.18)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    const head = fish.points[0];
    const neck = fish.points[1];
    const hAngle = Math.atan2(head.y - neck.y, head.x - neck.x);
    for (const side of [1, -1]) {
      ctx.beginPath();
      ctx.arc(
        head.x + Math.cos(hAngle) * maxW * 0.28 + Math.cos(hAngle + (side * Math.PI) / 2) * maxW * 0.46,
        head.y + Math.sin(hAngle) * maxW * 0.28 + Math.sin(hAngle + (side * Math.PI) / 2) * maxW * 0.46,
        Math.max(1, maxW * 0.08),
        0,
        TAU,
      );
      ctx.fillStyle = "#15151c";
      ctx.fill();
    }
  }

  function drawPads() {
    for (const pad of pads) {
      const angle = pad.angle + Math.sin(time * 0.3 + pad.seed) * 0.08;
      const bob = Math.sin(time * 0.6 + pad.seed) * 1.5;
      ctx.save();
      ctx.translate(pad.x, pad.y + bob);
      ctx.rotate(angle);
      // Sombra
      ctx.beginPath();
      ctx.arc(4, 6, pad.r, 0.25, TAU - 0.25);
      ctx.lineTo(4, 6);
      ctx.fillStyle = isNight ? "rgba(0,0,0,0.35)" : "rgba(15, 35, 55, 0.18)";
      ctx.fill();
      // Folha com o "corte" característico
      ctx.beginPath();
      ctx.arc(0, 0, pad.r, 0.25, TAU - 0.25);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = isNight ? "#29492f" : "#6f9a4f";
      ctx.fill();
      ctx.strokeStyle = isNight ? "rgba(10, 25, 12, 0.8)" : "rgba(40, 70, 30, 0.6)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Nervuras
      ctx.strokeStyle = isNight ? "rgba(120, 170, 110, 0.25)" : "rgba(220, 240, 190, 0.45)";
      ctx.lineWidth = 0.8;
      for (let v = 1; v < 7; v++) {
        const a = 0.25 + ((TAU - 0.5) * v) / 7;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * pad.r * 0.85, Math.sin(a) * pad.r * 0.85);
        ctx.stroke();
      }
      // Flor de lótus
      if (pad.flower) {
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * TAU + time * 0.05;
          ctx.save();
          ctx.rotate(a);
          ctx.beginPath();
          ctx.ellipse(pad.r * 0.28, 0, pad.r * 0.28, pad.r * 0.12, 0, 0, TAU);
          ctx.fillStyle = isNight ? "#d58ba3" : "#eaa7b8";
          ctx.fill();
          ctx.strokeStyle = "rgba(140, 50, 80, 0.5)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, pad.r * 0.1, 0, TAU);
        ctx.fillStyle = "#f2c94c";
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawFood(dt) {
    for (let i = food.length - 1; i >= 0; i--) {
      const pellet = food[i];
      pellet.life -= dt * 0.12;
      if (pellet.eaten || pellet.life <= 0) {
        if (pellet.eaten) ripples.push({ x: pellet.x, y: pellet.y, r: 3, life: 0.7, strength: 0.6 });
        food.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(pellet.x, pellet.y, 2.6, 0, TAU);
      ctx.fillStyle = `rgba(196, 140, 70, ${Math.min(1, pellet.life * 2)})`;
      ctx.fill();
    }
  }

  function drawRipples(dt) {
    ctx.lineWidth = 1.2;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.r += (40 + 30 * ripple.strength) * dt;
      ripple.life -= dt * 0.8;
      if (ripple.life <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = isNight
        ? `rgba(200, 220, 240, ${ripple.life * 0.35 * ripple.strength})`
        : `rgba(255, 255, 255, ${ripple.life * 0.6 * ripple.strength})`;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.r, 0, TAU);
      ctx.stroke();
    }
  }

  function draw(dt) {
    ctx.clearRect(0, 0, width, height);
    for (const fish of koi) drawKoi(fish);
    drawFood(dt);
    drawRipples(dt);
    drawPads();
  }

  function tick(now) {
    frame = requestAnimationFrame(tick);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    time += dt;
    for (const fish of koi) {
      steer(fish, dt);
      move(fish, dt);
    }
    draw(dt);
  }

  function start() {
    if (!animated || frame) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function local(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
  }

  function onPointerMove(event) {
    const { x, y, inside } = local(event);
    pointer.inside = inside && event.pointerType === "mouse";
    if (!inside) return;
    pointer.x = x;
    pointer.y = y;
    if (time - pointer.lastRipple > 0.35) {
      ripples.push({ x, y, r: 3, life: 0.8, strength: 0.5 });
      pointer.lastRipple = time;
    }
  }

  // Clique (ou toque) joga ração na água, fora de campos e botões.
  function onPointerDown(event) {
    const { x, y, inside } = local(event);
    if (!inside || event.target.closest?.("input, textarea, button, a, label, [data-pond-solid]")) return;
    ripples.push({ x, y, r: 4, life: 1, strength: 1.2 });
    for (let i = 0; i < 4; i++) {
      food.push({ x: x + (Math.random() - 0.5) * 30, y: y + (Math.random() - 0.5) * 30, life: 1, eaten: false });
    }
    if (food.length > 24) food.splice(0, food.length - 24);
  }

  function onPointerOut(event) {
    if (!event.relatedTarget) pointer.inside = false;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
  visibility.observe(canvas);

  if (animated) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
  }

  resize();

  return {
    setNight(value) {
      isNight = value;
      if (!frame) draw(0);
    },
    destroy() {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerout", onPointerOut);
    },
  };
}
