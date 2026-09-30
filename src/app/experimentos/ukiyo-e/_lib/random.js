/**
 * Gerador pseudoaleatório com semente (mulberry32). A mesma semente gera os
 * mesmos números no servidor e no navegador, então os desenhos procedurais
 * (espuma, respingos, escamas) não quebram a hidratação do React.
 */
export function seededRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Arredonda para 1 casa: deixa os caminhos SVG curtos e idênticos no SSR. */
export const r1 = (n) => Math.round(n * 10) / 10;

export const TAU = Math.PI * 2;
