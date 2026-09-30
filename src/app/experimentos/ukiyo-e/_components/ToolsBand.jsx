import { techStack } from "@/content/portfolio-content";
import { KANJI } from "../_lib/copy";

/** Faixa infinita com as ferramentas, separadas por ondinhas. Pausa no hover. */
export default function ToolsBand({ label }) {
  const items = [...techStack, ...techStack];
  return (
    <section aria-label={label} className="border-y border-[var(--u-line-strong)] bg-[var(--u-bg-2)] py-7">
      <p className="text-center font-mono text-[11px] tracking-[0.25em] text-[var(--u-muted)] uppercase">
        <span className="u-mincho mr-2 tracking-normal text-[var(--u-red)] normal-case">{KANJI.tools}</span>
        {label}
      </p>
      <div className="u-marquee-wrap mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="u-marquee flex w-max items-center">
          {items.map((tech, i) => (
            <li key={i} aria-hidden={i >= techStack.length} className="flex shrink-0 items-center">
              <span className="u-mincho px-5 text-lg font-semibold whitespace-nowrap">{tech}</span>
              <span aria-hidden className="text-[var(--u-red)]">〜</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
