"use client";

import { useSyncExternalStore } from "react";

// Celular e tablet: tela de toque, sem mouse. A GPU desses aparelhos sofre com
// desfoques, canvas e SVGs gigantes, então eles recebem uma versão mais leve.
const QUERY = "(hover: none) and (pointer: coarse)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** true em telas de toque. No servidor é false (a versão leve entra na hidratação). */
export function useIsTouch() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
