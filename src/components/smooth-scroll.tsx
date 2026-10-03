"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Rolagem suave com inércia (Lenis), como no lusion.co. A rolagem continua
 * nativa por baixo, então useScroll, âncoras e IntersectionObserver seguem
 * funcionando. Pausa sozinha quando algo trava a página (o modal de projeto).
 */
export function SmoothScroll() {
  useEffect(() => {
    // No toque a rolagem já é nativa (o Lenis não suaviza o dedo): ligá-lo só
    // custaria leituras de layout a cada evento, o que trava celulares.
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      // Links "#secao" rolam suave, parando abaixo do cabeçalho fixo
      anchors: { offset: -84 },
      // Áreas com rolagem própria (modal) continuam nativas
      prevent: (node) => Boolean(node.closest?.("[data-lenis-prevent], [role='dialog']")),
    });

    // O modal trava a página com overflow: hidden no <body>: a inércia para junto
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
