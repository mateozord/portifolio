"use client";

import { useEffect, useRef } from "react";

/**
 * Líquido 3D em WebGL (metaballs por raymarching), no espírito do lusion.co:
 * gotas que se fundem e se separam devagar, com brilho iridescente nas cores
 * da marca. Uma das gotas segue o cursor e "puxa" o líquido. Fundo
 * transparente: fica sobre a página. Renderiza em resolução reduzida (o
 * líquido é macio, não perde nada) e pausa fora da tela.
 */

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_dark;
uniform float u_scroll;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  float t = u_time * 0.35;
  // O conjunto sobe e encolhe um pouco ao rolar a página
  p.y += u_scroll * 0.9;
  p /= 1.0 - u_scroll * 0.25;
  float d = length(p - vec3(sin(t) * 0.45, cos(t * 1.3) * 0.3, 0.0)) - 0.62;
  d = smin(d, length(p - vec3(cos(t * 0.8) * 0.75, sin(t * 0.9) * 0.5, sin(t) * 0.3)) - 0.42, 0.5);
  d = smin(d, length(p - vec3(sin(t * 1.2 + 1.0) * 0.5, cos(t * 0.7 + 2.0) * 0.7, cos(t * 0.5) * 0.3)) - 0.36, 0.5);
  d = smin(d, length(p - vec3(cos(t * 0.6 + 3.0) * 0.85, sin(t * 1.1 + 1.0) * 0.35, 0.25)) - 0.28, 0.45);
  d = smin(d, length(p - vec3(sin(t * 0.9 + 4.0) * 0.6, cos(t * 1.4 + 5.0) * 0.55, -0.2)) - 0.24, 0.4);
  // A gota do cursor
  d = smin(d, length(p - vec3(u_mouse * vec2(1.15, 0.85), 0.35)) - 0.22, 0.55);
  return d;
}

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx)));
}

// Paleta iridescente: as cores da marca percorridas pela orientação da superfície
vec3 iridescent(float x) {
  vec3 violet = vec3(0.357, 0.239, 0.961);
  vec3 magenta = vec3(0.753, 0.149, 0.827);
  vec3 orange = vec3(0.976, 0.451, 0.086);
  vec3 amber = vec3(0.961, 0.62, 0.043);
  x = fract(x);
  if (x < 0.25) return mix(violet, magenta, x * 4.0);
  if (x < 0.5) return mix(magenta, orange, (x - 0.25) * 4.0);
  if (x < 0.75) return mix(orange, amber, (x - 0.5) * 4.0);
  return mix(amber, violet, (x - 0.75) * 4.0);
}

vec3 shade(vec3 p, vec3 rd) {
  vec3 n = normalAt(p);
  vec3 v = -rd;
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.5);
  vec3 base = iridescent(n.x * 0.35 + n.y * 0.25 + u_time * 0.04 + fres * 0.3);
  vec3 l1 = normalize(vec3(-0.6, 0.8, 0.7));
  vec3 l2 = normalize(vec3(0.8, -0.3, 0.5));
  float diff = max(dot(n, l1), 0.0) * 0.7 + max(dot(n, l2), 0.0) * 0.3;
  float spec = pow(max(dot(reflect(-l1, n), v), 0.0), 48.0);
  float spec2 = pow(max(dot(reflect(-l2, n), v), 0.0), 24.0) * 0.4;
  vec3 ambient = mix(vec3(0.97, 0.95, 0.99), vec3(0.06, 0.05, 0.1), u_dark);
  vec3 col = base * (0.35 + diff * 0.75);
  col = mix(col, ambient, fres * 0.35);
  return col + (spec + spec2) * vec3(1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_res) / u_res.y;
  vec3 ro = vec3(0.0, 0.0, 3.2);
  vec3 rd = normalize(vec3(uv, -1.9));
  float closest = 10.0;
  float tClosest = 0.0;
  // Esfera envolvente: pixels que não a cruzam nem entram no raymarching
  float b = dot(ro, rd);
  float h = b * b - dot(ro, ro) + 2.3 * 2.3;
  if (h < 0.0) { gl_FragColor = vec4(0.0); return; }
  h = sqrt(h);
  float t = max(0.0, -b - h);
  float tEnd = -b + h;
  float d = 1.0;
  for (int i = 0; i < 72; i++) {
    d = map(ro + rd * t);
    if (d < closest) { closest = d; tClosest = t; }
    if (d < 0.002) break;
    t += d;
    if (t > tEnd) break;
  }

  // Largura de um pixel no mundo, para suavizar a borda (o canvas não tem antialias)
  float pixel = 2.4 * tClosest / (u_res.y * 1.9);
  // Raios rasantes gastam todos os passos: "quase encostou" conta como superfície
  float coverage = d < 0.002 ? 1.0 : 1.0 - smoothstep(0.002, 0.002 + pixel, closest);
  vec3 col = coverage > 0.0 ? shade(ro + rd * tClosest, rd) : vec3(0.0);
  // Brilho suave em volta do líquido
  float glow = exp(-closest * 7.0) * 0.18;
  vec3 glowCol = iridescent(u_time * 0.04 + 0.2);
  float alpha = coverage + glow * (1.0 - coverage);
  vec3 rgb = col * coverage + glowCol * glow * (1.0 - coverage);
  gl_FragColor = vec4(rgb, alpha);
}`;

export function LiquidBlob({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    // Só em telas grandes: em celulares simples o raymarching pesa (lá fica um brilho parado)
    if (!canvas || !window.matchMedia("(min-width: 1024px)").matches) return undefined;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return undefined;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const loc = {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      dark: gl.getUniformLocation(program, "u_dark"),
      scroll: gl.getUniformLocation(program, "u_scroll"),
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { time: 0, mouse: [0.6, 0.2], target: [0.6, 0.2], dark: 0, scroll: 0 };
    let frame = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Resolução reduzida: o líquido é macio e o raymarching custa caro
      const quality = rect.width < 700 ? 0.55 : 0.7;
      canvas.width = Math.max(1, Math.round(rect.width * quality));
      canvas.height = Math.max(1, Math.round(rect.height * quality));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!frame) draw();
    };

    const draw = () => {
      gl.useProgram(program);
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.time, state.time);
      gl.uniform2f(loc.mouse, state.mouse[0], state.mouse[1]);
      gl.uniform1f(loc.dark, state.dark);
      gl.uniform1f(loc.scroll, state.scroll);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      state.time += dt;
      const k = Math.min(1, dt * 3.5);
      state.mouse[0] += (state.target[0] - state.mouse[0]) * k;
      state.mouse[1] += (state.target[1] - state.mouse[1]) * k;
      state.dark += ((document.documentElement.classList.contains("dark") ? 1 : 0) - state.dark) * Math.min(1, dt * 3);
      const rect = canvas.getBoundingClientRect();
      state.scroll = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      draw();
    };
    const start = () => {
      if (reduce || frame || !visible) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Cursor em coordenadas do líquido (centro do canvas = 0, altura = 2)
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
      const aspect = rect.width / rect.height;
      state.target = [Math.max(-1.4, Math.min(1.4, x * aspect)), Math.max(-1.1, Math.min(1.1, y))];
    };

    state.dark = document.documentElement.classList.contains("dark") ? 1 : 0;
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
