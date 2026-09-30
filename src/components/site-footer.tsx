"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { profile, type PortfolioDictionary } from "@/content/portfolio-content";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons";
import { EASE_OUT } from "@/lib/cn";

export function SiteFooter({ dictionary }: { dictionary: PortfolioDictionary }) {
  const footer = dictionary.footer;
  const socials = [
    { href: profile.whatsappLink, label: dictionary.contact.whatsappLabel, icon: WhatsappIcon },
    { href: profile.linkedin, label: dictionary.contact.linkedinLabel, icon: LinkedinIcon },
    { href: profile.github, label: dictionary.contact.githubLabel, icon: GithubIcon },
  ];

  return (
    <footer className="border-line relative overflow-hidden border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pt-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-muted mt-1 text-sm">{footer.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          {socials.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="focus-ring border-line bg-surface text-ink-soft hover:text-ink grid h-10 w-10 place-items-center rounded-full border transition-all hover:-translate-y-0.5"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <a
            href="#top"
            className="focus-ring bg-ink text-bg group ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold"
          >
            {footer.backToTop}
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Assinatura grande, com a base das letras cortada pela linha do rodapé. */}
      <div aria-hidden className="pointer-events-none mt-8 overflow-hidden select-none">
        <motion.p
          initial={{ opacity: 0, y: "40%" }}
          whileInView={{ opacity: 1, y: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE_OUT }}
          className="font-serif-italic text-brand translate-y-[0.14em] text-center text-[16.5vw] leading-[0.82] whitespace-nowrap md:text-[15vw]"
        >
          Mateus Fantin
        </motion.p>
      </div>

      <div className="border-line text-muted relative border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-xs sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>{footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
