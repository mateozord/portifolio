"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Clock, Wrench } from "lucide-react";
import { profile, type Locale, type PortfolioDictionary } from "@/content/portfolio-content";
import { Reveal, SectionHeader } from "@/components/motion-primitives";
import { WhatsappIcon } from "@/components/brand-icons";
import { cn, EASE_OUT } from "@/lib/cn";

/** Link do WhatsApp com a mensagem já escrita para o plano escolhido. */
function whatsappFor(message: string, plan: string) {
  return `${profile.whatsappLink}?text=${encodeURIComponent(message.replace("{plan}", plan))}`;
}

/**
 * Preços de referência ("a partir de") para negócios locais. Cada plano abre o
 * WhatsApp com a mensagem pronta: para o dono de um comércio, é o caminho mais
 * curto entre ver o preço e pedir o orçamento.
 */
export function PricingSection({ dictionary, locale }: { dictionary: PortfolioDictionary; locale: Locale }) {
  const pricing = dictionary.pricing;
  const money = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeader eyebrow={pricing.eyebrow} title={pricing.title} subtitle={pricing.subtitle} />
      <Reveal delay={0.1} className="mt-6">
        <p className="chip px-3.5 py-1.5 text-sm">
          <Clock className="text-accent h-4 w-4" />
          {pricing.deadline}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {pricing.plans.map((plan, i) => (
          <motion.article
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_OUT }}
            className={cn(
              "card relative flex flex-col rounded-[1.75rem] p-7 sm:p-8",
              plan.popular && "spin-border is-on lg:-my-3 lg:py-11",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
              {plan.popular && <span className="bg-brand rounded-full px-3 py-1 text-xs font-semibold text-white">{pricing.popular}</span>}
            </div>
            <p className="text-muted mt-6 text-sm">{pricing.from}</p>
            <p className="text-4xl font-semibold tracking-tight">{money.format(plan.price)}</p>
            <p className="text-muted mt-4 text-[0.95rem] leading-relaxed">{plan.description}</p>

            <ul className="mt-6 space-y-2.5 text-[0.95rem]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-ink-soft">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappFor(pricing.whatsappMessage, plan.name)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "focus-ring group mt-8 inline-flex items-center justify-center gap-2 rounded-full py-3 font-semibold transition-transform hover:-translate-y-0.5 lg:mt-auto",
                plan.popular ? "bg-ink text-bg" : "border-line-strong bg-surface-strong/70 border",
              )}
            >
              <WhatsappIcon className="h-4 w-4" />
              {pricing.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </motion.article>
        ))}
      </div>

      {/* Manutenção mensal: recorrência, numa faixa abaixo dos planos */}
      <Reveal delay={0.15} className="mt-5">
        <div className="card flex flex-col gap-6 rounded-[1.75rem] p-7 sm:p-8 md:flex-row md:items-center">
          <span className="bg-accent-soft text-accent grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
            <Wrench className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold tracking-tight">{pricing.maintenance.name}</h3>
            <p className="text-muted mt-1 text-[0.95rem]">{pricing.maintenance.description}</p>
            <ul className="text-ink-soft mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
              {pricing.maintenance.features.map((feature) => (
                <li key={feature} className="flex items-center gap-1.5">
                  <Check className="text-accent h-3.5 w-3.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 md:text-right">
            <p className="text-muted text-sm">{pricing.from}</p>
            <p className="text-2xl font-semibold tracking-tight">
              {money.format(pricing.maintenance.price)}
              <span className="text-muted text-base font-normal">{pricing.perMonth}</span>
            </p>
          </div>
        </div>
      </Reveal>

      <p className="text-muted mt-6 text-center text-sm">{pricing.note}</p>
    </section>
  );
}
