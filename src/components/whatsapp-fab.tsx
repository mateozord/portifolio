"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { profile } from "@/content/portfolio-content";
import { WhatsappIcon } from "@/components/brand-icons";

/**
 * Botão de WhatsApp fixo no canto, só no celular: quem chega pelo link não
 * precisa rolar até o fim para falar comigo. Aparece depois do hero e some
 * quando a seção de contato (que já tem o botão grande) está na tela.
 */
export function WhatsappFab({ label }: { label: string }) {
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.7));

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return undefined;
    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const show = pastHero && !contactVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={profile.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="focus-ring fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] inline-flex items-center gap-2 rounded-full bg-emerald-600 py-3 pr-5 pl-4 font-semibold text-white shadow-[0_16px_36px_-12px_rgb(5_150_105/0.75)] md:hidden"
        >
          <WhatsappIcon className="h-5 w-5" />
          {label}
        </motion.a>
      )}
    </AnimatePresence>
  );
}
