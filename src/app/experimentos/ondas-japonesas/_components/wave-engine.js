// Motor das ondas: desenho em Canvas 2D no estilo das xilogravuras ukiyo-e.
// Cada camada é uma onda trocoidal (cristas agudas, como nas ondas de Hokusai)
// com contorno creme, hachuras paralelas e espuma nas cristas. Por cima,
// ondulações que seguem o cursor e partículas de luz subindo da água.

const TAU = Math.PI * 2;
const PAPER = "245, 236, 215"; // creme de papel washi (rgb)
const STEP = 5; // distância entre amostras da curva, em px

// Do fundo (0) para a frente. `speed` em px/s; `sharpness` perto de 1 = crista mais pontuda.
const LAYERS = [
  { baseline: 0.57, amplitude: 9, wavelength: 250, speed: 10, sharpness: 0.45, depth: 0.15, top: "#4a3a8c", mid: "#241d52", bottom: "#0f172a", line: 0.16, crest: 1, hatches: 1, foam: false },
  { baseline: 0.64, amplitude: 13, wavelength: 310, speed: 14, sharpness: 0.55, depth: 0.3, top: "#3d42a6", mid: "#1c2158", bottom: "#0f172a", line: 0.22, crest: 1.1, hatches: 2, foam: false },
  { baseline: 0.72, amplitude: 19, wavelength: 380, speed: 20, sharpness: 0.65, depth: 0.5, top: "#2f53c4", mid: "#172260", bottom: "#0c1330", line: 0.3, crest: 1.3, hatches: 2, foam: false },
  { baseline: 0.81, amplitude: 25, wavelength: 460, speed: 28, sharpness: 0.75, depth: 0.75, top: "#2563eb", mid: "#132069", bottom: "#0a0f24", line: 0.44, crest: 1.5, hatches: 3, foam: true },
  { baseline: 0.91, amplitude: 31, wavelength: 540, speed: 36, sharpness: 0.82, depth: 1, top: "#1d4ed8", mid: "#101a52", bottom: "#08070c", line: 0.58, crest: 1.7, hatches: 3, foam: true },
];

const SPRITE_COLORS = [
  "245, 158, 11", // âmbar de café
  "245, 158, 11",
  "168, 85, 247", // roxo veludo
  "96, 165, 250", // azul ondas (mais claro, para brilhar)
];

function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Bolinha de luz pré-renderizada: desenhar uma imagem é bem mais barato que shadowBlur. */
function makeSprite(rgb) {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const g = sprite.getContext("2d");
  const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${rgb}, 1)`);
  gradient.addColorStop(0.22, `rgba(${rgb}, 0.6)`);
  gradient.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  return sprite;
}

/**
 * Monta a cena num <canvas> e devolve `destroy()` para limpar tudo.
 * Com `animated: false` (movimento reduzido), desenha um único quadro estático.
 */
export function createWaveScene(canvas, { animated = true } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  const sprites = SPRITE_COLORS.map(makeSprite);
  const ripples = [];
  let particles = [];
  let width = 0;
  let height = 0;
  let scale = 1;
  let time = 0;
  let last = 0;
  let frame = 0;
  let onScreen = true;

  // Posição do cursor em px do canvas: alvo (tx/ty) e valor suavizado (x/y).
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false, hover: 0, energy: 0, rippleX: -999, rippleY: -999 };

  function spawnParticle(anywhere) {
    return {
      x: Math.random() * width,
      y: anywhere ? height * (0.2 + Math.random() * 0.75) : height * (0.75 + Math.random() * 0.25),
      size: 5 + Math.random() * 11,
      speed: 7 + Math.random() * 15,
      phase: Math.random() * TAU,
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(1, Math.max(0.55, width / 1280));
    const count = Math.round(Math.min(44, Math.max(16, width / 32)));
    particles = Array.from({ length: count }, () => spawnParticle(true));
    if (!animated) draw(0);
  }

  /** Amostra a curva da camada: [x, y, fase] em sequência. */
  function sampleLayer(layer, index) {
    const points = [];
    const k1 = TAU / (layer.wavelength * scale);
    const k2 = k1 * 1.87;
    const a1 = layer.amplitude * scale;
    const a2 = a1 * 0.32;
    const s1 = layer.sharpness / k1;
    const s2 = (layer.sharpness * 0.18) / k2;
    const w1 = layer.speed * scale * k1;
    const w2 = -layer.speed * 0.6 * scale * k2;
    const base = height * layer.baseline;
    const parallax = (pointer.x / (width || 1) - 0.5) * pointer.hover * layer.depth * -36;
    const sigma = 170 * scale;
    const nearWater = Math.exp(-((pointer.y - base) ** 2) / (2 * (150 * scale) ** 2));
    const swell = (10 + 30 * pointer.energy) * layer.depth * pointer.hover * nearWater * scale;

    for (let u = -140; u <= width + 140; u += STEP) {
      const theta1 = k1 * u - w1 * time + index * 1.7;
      const theta2 = k2 * u - w2 * time + index * 3.9;
      // Onda trocoidal: o deslocamento horizontal junta os pontos nas cristas e as deixa pontudas.
      const x = u - s1 * Math.sin(theta1) - s2 * Math.sin(theta2) + parallax;
      let y = base - a1 * Math.cos(theta1) - a2 * Math.cos(theta2);
      // A água "incha" levemente embaixo do cursor.
      if (swell > 0.01) y -= swell * Math.exp(-((x - pointer.x) ** 2) / (2 * sigma * sigma));
      points.push(x, y, theta1);
    }
    return points;
  }

  function tracePath(points, offsetY) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1] + offsetY);
    for (let j = 3; j < points.length; j += 3) ctx.lineTo(points[j], points[j + 1] + offsetY);
  }

  function drawLayer(layer, points, index) {
    const n = points.length;
    let minY = Infinity;
    for (let j = 1; j < n; j += 3) if (points[j] < minY) minY = points[j];
    const amplitude = layer.amplitude * scale;

    // Corpo da onda
    tracePath(points, 0);
    ctx.lineTo(points[n - 3], height + 2);
    ctx.lineTo(points[0], height + 2);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, minY, 0, height);
    fill.addColorStop(0, layer.top);
    fill.addColorStop(0.45, layer.mid);
    fill.addColorStop(1, layer.bottom);
    ctx.fillStyle = fill;
    ctx.fill();

    // Hachuras paralelas, fortes nas cristas e sumindo nos vales (textura de xilogravura)
    const gap = 7 * scale + 2;
    const hatch = ctx.createLinearGradient(0, minY, 0, minY + amplitude * 2.4 + gap * layer.hatches);
    hatch.addColorStop(0, `rgba(${PAPER}, ${layer.line * 0.75})`);
    hatch.addColorStop(1, `rgba(${PAPER}, 0)`);
    ctx.strokeStyle = hatch;
    ctx.lineWidth = 1;
    for (let h = 1; h <= layer.hatches; h++) {
      tracePath(points, h * gap);
      ctx.stroke();
    }

    // Contorno da crista
    tracePath(points, 0);
    ctx.strokeStyle = `rgba(${PAPER}, ${layer.line})`;
    ctx.lineWidth = layer.crest;
    ctx.stroke();

    if (layer.foam) drawFoam(layer, points, index);
  }

  /** Espuma nas cristas: um cacho que se enrola para a frente e gotinhas que flutuam. */
  function drawFoam(layer, points, index) {
    const alpha = Math.min(0.9, layer.line + 0.2);
    ctx.strokeStyle = `rgba(${PAPER}, ${alpha})`;
    ctx.fillStyle = `rgba(${PAPER}, ${alpha})`;
    ctx.lineWidth = 1.2;
    const r = (3 + layer.depth * 4) * scale + 1;

    for (let j = 3; j < points.length - 3; j += 3) {
      const y = points[j + 1];
      if (!(y < points[j - 2] && y <= points[j + 4])) continue; // só nos picos
      const x = points[j];
      // Identidade estável da crista (não "pisca" enquanto ela anda)
      const crest = Math.round(points[j + 2] / TAU) + index * 11;

      ctx.beginPath();
      ctx.arc(x + r * 0.9, y + r * 0.4, r, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + r * 2.2, y + r * 0.9, r * 0.55, Math.PI * 1.1, Math.PI * 1.95);
      ctx.stroke();

      for (let d = 0; d < 3; d++) {
        const seed = crest * 7 + d * 13;
        const bob = Math.sin(time * 2.2 + seed) * 2 * scale;
        ctx.beginPath();
        ctx.arc(x - r * 0.6 + d * r * 1.15, y - r * (1.3 + (Math.abs(seed) % 3) * 0.45) + bob, 0.9 + (d % 2) * 0.6, 0, TAU);
        ctx.fill();
      }
    }
  }

  function drawRipples(dt) {
    ctx.lineWidth = 1.1;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.r += (55 + 45 * ripple.strength) * dt;
      ripple.life -= dt * 0.85;
      if (ripple.life <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      const alpha = ripple.life * 0.5 * ripple.strength;
      ctx.strokeStyle = `rgba(${PAPER}, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, ripple.r, ripple.r * 0.26, 0, 0, TAU);
      ctx.stroke();
      if (ripple.r > 24) {
        ctx.strokeStyle = `rgba(${PAPER}, ${alpha * 0.55})`;
        ctx.beginPath();
        ctx.ellipse(ripple.x, ripple.y, ripple.r * 0.6, ripple.r * 0.6 * 0.26, 0, 0, TAU);
        ctx.stroke();
      }
    }
  }

  function drawParticles(dt) {
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speed * dt;
      p.x += Math.sin(time * 0.6 + p.phase) * 14 * dt;
      // Atraídas de leve pelo cursor, como vaga-lumes curiosos
      if (pointer.hover > 0.01) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        if (dx * dx + dy * dy < 220 * 220) {
          p.x += dx * 0.5 * dt * pointer.hover;
          p.y += dy * 0.25 * dt * pointer.hover;
        }
      }
      if (p.y < height * 0.04) particles[i] = spawnParticle(false);

      const fadeIn = clamp01((height * 0.98 - p.y) / (height * 0.18));
      const fadeOut = clamp01((p.y - height * 0.04) / (height * 0.3));
      const twinkle = 0.55 + 0.45 * Math.sin(time * 2.4 + p.phase * 3);
      ctx.globalAlpha = fadeIn * fadeOut * twinkle * 0.85;
      ctx.drawImage(p.sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function draw(dt) {
    ctx.clearRect(0, 0, width, height);
    LAYERS.forEach((layer, index) => drawLayer(layer, sampleLayer(layer, index), index));
    if (animated) {
      drawRipples(dt);
      drawParticles(dt);
    }
  }

  function tick(now) {
    frame = requestAnimationFrame(tick);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    time += dt;
    const ease = Math.min(1, dt * 6);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    pointer.hover += ((pointer.inside ? 1 : 0) - pointer.hover) * Math.min(1, dt * 3);
    pointer.energy *= Math.pow(0.3, dt);
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

  function addRipple(x, y, strength) {
    ripples.push({ x, y, r: 4, life: 1, strength });
    if (ripples.length > 24) ripples.shift();
  }

  function toCanvas(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
  }

  // O cursor é lido na janela inteira, porque o conteúdo fica por cima do canvas.
  function onPointerMove(event) {
    if (event.pointerType !== "mouse") return;
    const { x, y, inside } = toCanvas(event);
    pointer.inside = inside;
    if (!inside) return;
    pointer.energy = Math.min(1, pointer.energy + Math.hypot(x - pointer.tx, y - pointer.ty) / 350);
    pointer.tx = x;
    pointer.ty = y;
    const waterTop = height * LAYERS[0].baseline;
    if (y > waterTop && Math.hypot(x - pointer.rippleX, y - pointer.rippleY) > 70) {
      addRipple(x, y, 0.6);
      pointer.rippleX = x;
      pointer.rippleY = y;
    }
  }

  function onPointerDown(event) {
    const { x, y, inside } = toCanvas(event);
    if (inside && y > height * LAYERS[0].baseline * 0.95) addRipple(x, y, 1.3);
  }

  function onPointerOut(event) {
    if (!event.relatedTarget) pointer.inside = false;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  // Pausa a animação quando o hero sai da tela.
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start();
    else stop();
  });
  visibility.observe(canvas);

  if (animated) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
  }

  resize();
  if (onScreen) start();

  return {
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
