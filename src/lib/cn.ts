export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Curva de easing padrão das animações (saída suave, sem "quique"). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
