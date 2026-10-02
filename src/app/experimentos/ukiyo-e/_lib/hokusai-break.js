// "A Grande Onda" de Hokusai (domínio público) quebrando com o scroll.
//
// WebGL: a gravura real é desenhada num quad e um shader de deslocamento
// (displacement) dobra a crista para a frente conforme o progresso. A máscara
// (R = água, G = vão dos borrifos, B = céu) garante que só a água se mexa:
// céu, Monte Fuji e o cartucho com o título ficam firmes.
// Canvas 2D por cima: as gotas de espuma que despencam da crista.

const TAU = Math.PI * 2;

// Geometria da quebra, em coordenadas da imagem (0..1) — ver README
export const BREAK = {
  pivot: [0.47, 0.45], // centro do "tubo": a crista gira em volta dele
  crest: [0.42, 0.22], // centro da crista com as garras
  radius: 0.2, // alcance da deformação (em unidades da altura da imagem)
  angle: 0.62, // quanto a crista gira até o fim da quebra (rad)
  drop: 0.07, // quanto ela desaba
};

// Borda da crista (de onde nascem as gotas), em coordenadas da imagem
const LIP = [
  [0.26, 0.2],
  [0.31, 0.14],
  [0.37, 0.11],
  [0.43, 0.1],
  [0.49, 0.12],
  [0.54, 0.17],
  [0.58, 0.24],
  [0.59, 0.31],
  [0.56, 0.37],
];

const VERTEX = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform sampler2D u_mask;
uniform vec2 u_canvas;
uniform float u_aspect;
uniform vec2 u_focus;
uniform float u_zoom;
uniform float u_time;
uniform float u_progress;   // 0..1 (scroll do hero, suavizado)
uniform float u_night;
uniform vec2 u_mouse;
uniform float u_hover;

uniform vec2 u_pivot;
uniform vec2 u_crest;
uniform float u_radius;
uniform float u_angle;
uniform float u_drop;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
vec2 rot(vec2 v, float a) { float c = cos(a); float s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }

vec2 toImage(vec2 uv) {
  float ca = u_canvas.x / u_canvas.y;
  vec2 size = ca > u_aspect ? vec2(1.0, u_aspect / ca) : vec2(ca / u_aspect, 1.0);
  size /= u_zoom;
  return u_focus * (1.0 - size) + uv * size;
}

void main() {
  vec2 uv = v_uv;
  vec2 iuv = toImage(uv);
  vec4 mask = texture2D(u_mask, iuv);
  float water = mask.r;
  float t = u_time;
  vec2 A = vec2(u_aspect, 1.0);
  vec2 q = iuv * A;

  // Peso da quebra: forte na crista e sumindo com a distância. A crista gira
  // inteira (corpo, espuma e o contorno a nanquim juntos), senão o contorno
  // ficaria parado e o miolo se esticaria. O céu em volta é liso, então
  // pegar um pouco dele no giro não aparece.
  vec2 dc = q - u_crest * A;
  float w = exp(-dot(dc, dc) / (2.0 * u_radius * u_radius)) * mix(0.35, 1.0, smoothstep(0.0, 0.5, water + (1.0 - mask.b)));
  float pb = smoothstep(0.04, 0.72, u_progress);

  // A crista gira em volta do tubo (para a frente e para baixo) e desaba.
  // Amostragem inversa: cada pixel busca de onde a água "veio".
  vec2 pivot = u_pivot * A;
  vec2 src = pivot + rot(q - pivot, u_angle * pb * w);
  src.y -= u_drop * pb * pb * w;
  // A espuma se desfaz: ruído que cresce com a quebra
  float n1 = noise(q * 9.0 + vec2(t * 0.35, -t * 0.2));
  float n2 = noise(q * 9.0 + vec2(4.7 - t * 0.25, 2.3 + t * 0.3));
  src += (vec2(n1, n2) - 0.5) * 0.022 * pb * w;

  // Água viva: correnteza lenta em toda a água + anéis do cursor
  vec2 flow = vec2(noise(q * 1.2 + vec2(t * 0.08, 0.0)), noise(q * 1.2 + vec2(5.2, t * 0.07))) - 0.5;
  src += flow * 0.009 * water;
  float ca = u_canvas.x / u_canvas.y;
  vec2 dm = (uv - u_mouse) * vec2(ca, 1.0);
  float d = length(dm);
  src += (dm / (d + 1e-4)) * sin(d * 70.0 - t * 5.0) * exp(-d * 7.0) * u_hover * 0.003 * A * water;

  vec3 col = texture2D(u_image, src / A).rgb;

  // Espuma estourando: as partes claras da crista viram respingos
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float burst = smoothstep(0.72, 0.92, lum) * w * pb * smoothstep(0.45, 0.75, noise(q * 26.0 - vec2(t * 0.8, t * 0.5)));
  vec3 foamCol = mix(vec3(0.98, 0.96, 0.9), vec3(0.86, 0.91, 1.0), u_night);
  col = mix(col, foamCol, burst * 0.55);

  // Noite: luar sobre a gravura (céu índigo pela máscara B, água prateada)
  if (u_night > 0.001) {
    lum = dot(col, vec3(0.299, 0.587, 0.114));
    float blue = clamp((col.b - col.r) * 2.5, 0.0, 1.0);
    vec3 moonlit = mix(vec3(0.04, 0.06, 0.15), vec3(0.78, 0.85, 0.97), pow(lum, 1.25));
    moonlit = mix(moonlit, col * vec3(0.34, 0.45, 0.82), blue * 0.6);
    vec3 sky = mix(vec3(0.06, 0.09, 0.22), vec3(0.02, 0.035, 0.1), iuv.y);
    sky += vec3(0.06, 0.08, 0.14) * smoothstep(0.84, 0.95, lum);
    vec3 night = mix(moonlit, sky, mask.b);
    float sh = hash(floor(q * 140.0));
    night += step(0.992, sh) * smoothstep(0.35, 0.0, length(fract(q * 140.0) - 0.5)) * (0.5 + 0.5 * sin(t * 2.0 + sh * 90.0)) * mask.b * vec3(0.95, 0.92, 0.8);
    col = mix(col, night, u_night);
  }

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Mapeia a imagem na tela como object-fit: cover com foco (mesma conta do shader). */
function coverSize(cw, ch, aspect, zoom) {
  const ca = cw / ch;
  const size = ca > aspect ? [1, aspect / ca] : [ca / aspect, 1];
  return [size[0] / zoom, size[1] / zoom];
}

/** Posição atual de um ponto da crista (transformação direta da quebra). */
function breakPoint([x, y], aspect, pb) {
  const A = [aspect, 1];
  const q = [x * A[0], y * A[1]];
  const c = [BREAK.crest[0] * A[0], BREAK.crest[1]];
  const dx = q[0] - c[0];
  const dy = q[1] - c[1];
  const w = Math.exp(-(dx * dx + dy * dy) / (2 * BREAK.radius * BREAK.radius));
  const p = [BREAK.pivot[0] * A[0], BREAK.pivot[1]];
  const a = -BREAK.angle * pb * w;
  const vx = q[0] - p[0];
  const vy = q[1] - p[1];
  const out = [p[0] + vx * Math.cos(a) - vy * Math.sin(a), p[1] + vx * Math.sin(a) + vy * Math.cos(a) + BREAK.drop * pb * pb * w];
  return [out[0] / A[0], out[1]];
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Monta a cena. `gl` e `fx` são dois canvas sobrepostos (gravura e gotas).
 * Resolve com { setProgress, setNight, setFrame, destroy }; rejeita sem WebGL.
 */
export async function createHokusaiBreak({ gl: glCanvas, fx: fxCanvas, image, mask, aspect, focus, zoom = 1, night = false, animated = true, onReady, isCancelled = () => false }) {
  // Carrega as imagens ANTES de tocar no WebGL: se a montagem for cancelada
  // nesse meio-tempo (o React monta duas vezes em desenvolvimento), esta
  // instância não pode mexer no contexto, que é o mesmo da outra.
  const [img, maskImg] = await Promise.all([loadImage(image), loadImage(mask)]);
  if (isCancelled()) return null;

  const gl = glCanvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) throw new Error("WebGL indisponível");
  const fx = fxCanvas.getContext("2d");

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const textures = [img, maskImg].map((source, unit) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    return tex;
  });

  const u = (name) => gl.getUniformLocation(program, name);
  const loc = Object.fromEntries(
    ["image", "mask", "canvas", "aspect", "focus", "zoom", "time", "progress", "night", "mouse", "hover", "pivot", "crest", "radius", "angle", "drop"].map((n) => [n, u(`u_${n}`)]),
  );
  gl.uniform1i(loc.image, 0);
  gl.uniform1i(loc.mask, 1);
  gl.uniform1f(loc.aspect, aspect);
  gl.uniform2f(loc.pivot, ...BREAK.pivot);
  gl.uniform2f(loc.crest, ...BREAK.crest);
  gl.uniform1f(loc.radius, BREAK.radius);
  gl.uniform1f(loc.angle, BREAK.angle);
  gl.uniform1f(loc.drop, BREAK.drop);

  const state = { focus, zoom, progress: 0, lastProgress: 0, night: night ? 1 : 0, nightTarget: night ? 1 : 0, mouse: [0.5, 0.5], mouseTarget: [0.5, 0.5], hover: 0, hoverTarget: 0, time: 0 };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let last = 0;
  let visible = true;
  const drops = [];

  function resize() {
    const rect = glCanvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, rect.width < 700 ? 1.5 : 1.75);
    width = rect.width;
    height = rect.height;
    for (const c of [glCanvas, fxCanvas]) {
      c.width = Math.max(1, Math.round(width * dpr));
      c.height = Math.max(1, Math.round(height * dpr));
    }
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    if (!frame) render(0);
  }

  // Imagem (0..1) → tela (px)
  function toScreen([ix, iy]) {
    const size = coverSize(width, height, aspect, state.zoom);
    return [((ix - state.focus[0] * (1 - size[0])) / size[0]) * width, ((iy - state.focus[1] * (1 - size[1])) / size[1]) * height];
  }

  function emit(dt) {
    const p = state.progress;
    if (!animated || p < 0.2 || p > 0.6) return;
    const speed = Math.abs(p - state.lastProgress) / Math.max(dt, 0.001);
    let count = (26 + Math.min(260, speed * 420)) * dt;
    const pb = smooth(0.04, 0.72, p);
    const scale = Math.max(0.6, Math.min(1.4, width / 1440));
    while (count > 0) {
      if (count < 1 && Math.random() > count) break;
      count -= 1;
      const k = Math.random() * (LIP.length - 1);
      const i = Math.floor(k);
      const f = k - i;
      const point = [LIP[i][0] + (LIP[i + 1][0] - LIP[i][0]) * f, LIP[i][1] + (LIP[i + 1][1] - LIP[i][1]) * f];
      const [x, y] = toScreen(breakPoint(point, aspect, pb));
      drops.push({
        x,
        y,
        vx: (-40 - Math.random() * 120) * scale,
        vy: (-60 + Math.random() * 90) * scale,
        r: (1.2 + Math.random() * Math.random() * 5) * scale,
        life: 0,
      });
    }
    if (drops.length > 500) drops.splice(0, drops.length - 500);
  }

  function drawDrops(dt) {
    fx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fx.clearRect(0, 0, width, height);
    const foam = state.nightTarget ? "#dfe8f5" : "#fbf8f0";
    const ink = state.nightTarget ? "rgba(3,8,22,0.8)" : "rgba(16,31,85,0.75)";
    fx.lineWidth = 1;
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.vy += 360 * dt;
      d.vx *= 0.993;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.life += dt;
      // Ao chegar perto do pé da tela, a gota se funde na maré
      const sink = Math.max(0, (d.y - height * 0.8) / (height * 0.2));
      if (sink >= 1 || d.life > 6) {
        drops.splice(i, 1);
        continue;
      }
      fx.globalAlpha = Math.min(1, d.life * 5) * (1 - sink);
      fx.beginPath();
      fx.arc(d.x, d.y, d.r, 0, TAU);
      fx.fillStyle = foam;
      fx.fill();
      if (d.r > 2.6) {
        fx.strokeStyle = ink;
        fx.stroke();
      }
    }
    fx.globalAlpha = 1;
  }

  function render(dt) {
    // Religa o próprio estado a cada quadro: o contexto é do canvas, não da cena
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    textures.forEach((tex, unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    });
    gl.uniform2f(loc.canvas, glCanvas.width, glCanvas.height);
    gl.uniform2f(loc.focus, state.focus[0], state.focus[1]);
    gl.uniform1f(loc.zoom, state.zoom);
    gl.uniform1f(loc.time, state.time);
    gl.uniform1f(loc.progress, state.progress);
    gl.uniform1f(loc.night, state.night);
    gl.uniform2f(loc.mouse, state.mouse[0], state.mouse[1]);
    gl.uniform1f(loc.hover, state.hover);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    emit(dt);
    state.lastProgress = state.progress;
    drawDrops(dt);
  }

  function tick(now) {
    frame = requestAnimationFrame(tick);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    state.time += dt;
    const k = Math.min(1, dt * 5);
    state.mouse[0] += (state.mouseTarget[0] - state.mouse[0]) * k;
    state.mouse[1] += (state.mouseTarget[1] - state.mouse[1]) * k;
    state.hover += (state.hoverTarget - state.hover) * Math.min(1, dt * 3);
    state.night += (state.nightTarget - state.night) * Math.min(1, dt * 2.5);
    render(dt);
  }

  const start = () => {
    if (!animated || frame || !visible) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  function onPointerMove(event) {
    if (event.pointerType !== "mouse") return;
    const rect = glCanvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    state.hoverTarget = inside ? 1 : 0;
    if (inside) state.mouseTarget = [x, y];
  }

  const ro = new ResizeObserver(resize);
  ro.observe(glCanvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(glCanvas);
  if (animated) window.addEventListener("pointermove", onPointerMove, { passive: true });
  resize();
  onReady?.();
  start();

  return {
    setProgress(value) {
      state.progress = value;
      if (!frame) render(0);
    },
    setNight(value) {
      state.nightTarget = value ? 1 : 0;
      if (!animated) {
        state.night = state.nightTarget;
        render(0);
      }
    },
    setFrame(nextFocus, nextZoom) {
      state.focus = nextFocus;
      state.zoom = nextZoom;
      if (!frame) render(0);
    },
    destroy() {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      textures.forEach((tex) => gl.deleteTexture(tex));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
