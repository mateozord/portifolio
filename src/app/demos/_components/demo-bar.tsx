import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { profile } from "@/content/portfolio-content";

/** WhatsApp do Mateus com a mensagem de quem viu uma demonstração. */
export function demoWhatsapp(kind: string) {
  const message = `Olá, Mateus! Vi a demonstração de site de ${kind} e quero um site assim para o meu negócio.`;
  return `${profile.whatsappLink}?text=${encodeURIComponent(message)}`;
}

/**
 * Faixa no topo de toda demonstração: deixa claro que o negócio é fictício,
 * volta ao portfólio e leva direto ao WhatsApp de quem quer um site igual.
 */
export function DemoBar({ kind }: { kind: string }) {
  return (
    <div className="relative z-50 bg-[#111] text-xs text-white/80 sm:text-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/#pricing" className="inline-flex shrink-0 items-center gap-1.5 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Voltar ao portfólio</span>
          <span className="sm:hidden">Portfólio</span>
        </Link>
        <p className="hidden truncate md:block">Demonstração · negócio fictício criado por Mateus Fantin</p>
        <a
          href={demoWhatsapp(kind)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-white px-3 py-1 font-semibold text-black hover:bg-white/90"
        >
          Quero um site assim
        </a>
      </div>
    </div>
  );
}
