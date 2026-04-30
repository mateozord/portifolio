type SectionBlockProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function SectionBlock({ id, title, subtitle, children }: SectionBlockProps) {
  return (
    <section
      id={id}
      data-reveal
      className="reveal rounded-2xl border border-white/10 bg-[#0b1126]/90 p-6 shadow-lg shadow-[#070b1a]/40 md:p-8"
    >
      <header className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm text-slate-300">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
