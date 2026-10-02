"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { WhatsappIcon } from "@/components/brand-icons";
import type { Locale } from "@/content/portfolio-content";
import { demoWhatsapp, type DemoKind } from "./demo-bar";

const TEXT = {
  pt: {
    title: "Assim a mensagem chega no WhatsApp do negócio",
    note: "Nesta demonstração nada é enviado. No site real, o cliente toca no botão e a mensagem vai pronta para o seu WhatsApp.",
    close: "Fechar",
    cta: "Quero um site assim",
  },
  en: {
    title: "This is how the message reaches the business on WhatsApp",
    note: "Nothing is sent in this demo. On a real site, customers tap the button and the message lands ready in your WhatsApp.",
    close: "Close",
    cta: "I want a site like this",
  },
};

/**
 * Prévia da mensagem que um pedido ou reserva geraria. Como o negócio da
 * demonstração é fictício, mostramos a mensagem em vez de enviá-la, e o
 * botão principal leva ao WhatsApp do Mateus.
 */
export function WhatsappPreview({
  open,
  onClose,
  message,
  kind,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  message: string;
  kind: DemoKind;
  locale: Locale;
}) {
  const t = TEXT[locale];

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-end bg-black/50 p-3 font-sans backdrop-blur-sm sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white text-[#111] shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 bg-[#075e54] px-5 py-4 text-white">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <WhatsappIcon className="h-5 w-5" />
                {t.title}
              </p>
              <button type="button" onClick={onClose} aria-label={t.close} className="rounded-full p-1 hover:bg-white/15">
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* "Conversa" com o balão da mensagem */}
            <div className="max-h-[50svh] overflow-y-auto bg-[#e5ddd5] p-4" data-lenis-prevent>
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-[#dcf8c6] px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm">
                {message}
              </div>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-black/60">{t.note}</p>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="flex-1 rounded-full border border-black/15 py-3 font-semibold hover:bg-black/5">
                  {t.close}
                </button>
                <a
                  href={demoWhatsapp(kind, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[1.4] rounded-full bg-[#25d366] py-3 text-center font-bold text-[#073b1f] hover:brightness-95"
                >
                  {t.cta}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
