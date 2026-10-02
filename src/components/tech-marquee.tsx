"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { techStack } from "@/content/portfolio-content";

const BASE_SPEED = 2.2; // % da faixa por segundo, parada

/**
 * Faixa infinita com as tecnologias do dia a dia. Reage à rolagem: acelera
 * com a velocidade, troca de sentido junto com ela e inclina um pouco.
 * Pausa no hover e fora da tela.
 */
export function TechMarquee({ label }: { label: string }) {
  // A lista aparece duas vezes para o loop emendar sem costura.
  const items = [...techStack, ...techStack];
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const hovering = useRef(false);
  const direction = useRef(-1);

  const offset = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2500, 0, 2500], [-7, 0, 7], { clamp: false });
  const skewX = useTransform(velocity, [-2500, 2500], [9, -9], { clamp: true });
  const x = useTransform(offset, (v) => `${(((v % 50) + 50) % 50) - 50}%`);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView || hovering.current) return;
    const speed = boost.get();
    if (speed < -0.05) direction.current = 1;
    else if (speed > 0.05) direction.current = -1;
    offset.set(offset.get() + direction.current * BASE_SPEED * (1 + Math.abs(speed)) * (Math.min(delta, 50) / 1000));
  });

  return (
    <section aria-label={label} className="border-line border-y py-8">
      <p className="text-muted text-center font-mono text-[11px] tracking-[0.2em] uppercase">{label}</p>
      <div
        ref={ref}
        onPointerEnter={() => (hovering.current = true)}
        onPointerLeave={() => (hovering.current = false)}
        className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      >
        <motion.ul className="flex w-max" style={{ x, skewX }}>
          {items.map((tech, i) => (
            // pr-3 em cada item (em vez de gap) para as duas metades terem a mesma largura.
            <li key={i} aria-hidden={i >= techStack.length} className="shrink-0 pr-3">
              <span className="chip px-4 py-2 text-sm">{tech}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
