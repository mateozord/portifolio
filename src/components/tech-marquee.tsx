import { techStack } from "@/content/portfolio-content";

/** Faixa infinita com as tecnologias do dia a dia (pausa no hover). */
export function TechMarquee({ label }: { label: string }) {
  // A lista aparece duas vezes para o loop emendar sem costura.
  const items = [...techStack, ...techStack];

  return (
    <section aria-label={label} className="border-line border-y py-8">
      <p className="text-muted text-center font-mono text-[11px] tracking-[0.2em] uppercase">{label}</p>
      <div className="marquee mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="marquee-track flex w-max">
          {items.map((tech, i) => (
            // pr-3 em cada item (em vez de gap) para as duas metades terem a mesma largura.
            <li key={i} aria-hidden={i >= techStack.length} className="shrink-0 pr-3">
              <span className="chip px-4 py-2 text-sm">{tech}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
