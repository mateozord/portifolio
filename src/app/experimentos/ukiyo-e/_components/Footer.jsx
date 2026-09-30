"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { profile } from "@/content/portfolio-content";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons";
import { EASE, Seal } from "./ornaments";

export default function Footer({ dictionary, copy }) {
  const socials = [
    { href: profile.whatsappLink, label: dictionary.contact.whatsappLabel, Icon: WhatsappIcon },
    { href: profile.linkedin, label: dictionary.contact.linkedinLabel, Icon: LinkedinIcon },
    { href: profile.github, label: dictionary.contact.githubLabel, Icon: GithubIcon },
  ];

  return (
    <footer className="relative overflow-hidden bg-[var(--u-footer)] text-[#efe6d2]">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-10 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="flex items-end gap-5"
          >
            <span className="u-mincho text-[5.5rem] leading-none font-bold text-[#cf412d] sm:text-[7rem]">波</span>
            <div className="pb-2">
              <p className="u-mincho text-3xl font-bold sm:text-4xl">Mateus Fantin</p>
              <p className="u-mincho mt-1 text-[#efe6d2]/70">{copy.footer.tagline}</p>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#efe6d2]/25 transition-colors hover:border-[#efe6d2]/60 hover:bg-white/5"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <a
              href="#top"
              className="ml-1 inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#cf412d] px-4 text-sm font-semibold text-[#fff6ea]"
            >
              {dictionary.footer.backToTop}
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#efe6d2]/15 pt-6 text-sm text-[#efe6d2]/65 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Seal size="sm" className="border-[#cf412d] text-[#cf412d]">
              北斎
            </Seal>
            <span>{copy.footer.credits}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="underline decoration-[#efe6d2]/30 underline-offset-4 transition-colors hover:text-[#efe6d2]">
              {copy.footer.classic}
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
