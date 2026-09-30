"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";
import { profile } from "@/content/portfolio-content";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons";
import { KANJI } from "../_lib/copy";
import { createKoiPond } from "../_lib/koi-engine";
import { useNight } from "../_lib/use-night";
import { Reveal, SectionTitle } from "./ornaments";

// Papel levemente translúcido: os koi aparecem de leve por baixo dos cartões.
const PAPER = "rounded-[8px] border border-[var(--u-line-strong)] bg-[color-mix(in_srgb,var(--u-card)_90%,transparent)] shadow-[var(--u-shadow)] backdrop-blur-[3px]";

export default function Contact({ dictionary, copy, subject, onSubjectChange, prefillKey }) {
  const contact = dictionary.contact;
  const form = contact.form;
  const formRef = useRef(null);
  const messageRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (prefillKey > 0) messageRef.current?.focus({ preventScroll: true });
  }, [prefillKey]);

  const body = () => `${form.name}: ${name.trim()}\n${form.email}: ${email.trim()}\n\n${message.trim()}`;

  const sendByEmail = (event) => {
    event.preventDefault();
    const mailSubject = encodeURIComponent(`[Portfólio] ${subject.trim()}`);
    window.location.href = `mailto:${profile.email}?subject=${mailSubject}&body=${encodeURIComponent(body())}`;
  };

  const sendByWhatsapp = () => {
    if (!formRef.current?.reportValidity()) return;
    const text = `*${subject.trim()}*\n\n${body()}`;
    window.open(`${profile.whatsappLink}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const input =
    "w-full rounded-[6px] border border-[var(--u-line-strong)] bg-[var(--u-bg)] px-4 py-3 text-[0.95rem] text-[var(--u-ink)] placeholder:text-[var(--u-muted)] transition focus:border-[var(--u-red)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--u-red)_18%,transparent)] focus:outline-none";

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-36">
      <SectionTitle kanji={KANJI.contact} eyebrow={copy.contact.eyebrow} title={copy.contact.title} subtitle={contact.body} />

      <Reveal delay={0.1} className="mt-14">
        <div className="relative isolate overflow-hidden rounded-[12px] border-4 border-[#5b4632] bg-[linear-gradient(160deg,var(--pond-top),var(--pond-bottom))] p-4 shadow-[inset_0_0_60px_rgb(0_0_0/0.25)] sm:p-8 lg:p-12 dark:border-[#2b2118]">
          {/* Reflexos de luz na água */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(40%_30%_at_20%_20%,rgb(255_255_255/0.18),transparent_70%),radial-gradient(35%_25%_at_80%_70%,rgb(255_255_255/0.12),transparent_70%)]" />
          <KoiPond className="absolute inset-0 -z-10 h-full w-full" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
            {/* Coluna da esquerda: água aberta para os koi, contatos embaixo */}
            <div className="flex min-w-0 flex-col">
              <p className="flex max-w-sm items-start gap-2 text-sm font-medium text-white/90 [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]">
                <span className="u-mincho grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/20 text-white">鯉</span>
                {copy.contact.pondHint}
              </p>
              <div aria-hidden className="min-h-56 flex-1 lg:min-h-0" />
              <div className="space-y-3">
                <a
                  data-pond-solid
                  href={profile.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-[8px] bg-emerald-700 p-4 text-white shadow-[0_14px_30px_-14px_rgb(4_120_87/0.8)] transition-transform hover:-translate-y-0.5 sm:gap-4 sm:p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] bg-white/15">
                    <WhatsappIcon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-white/80">{contact.whatsappHint}</span>
                    <span className="block font-semibold sm:text-lg">
                      {contact.whatsappLabel} · {profile.whatsappDisplay}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-45" />
                </a>
                <EmailRow label={contact.emailLabel} copyLabel={contact.copy} copiedLabel={contact.copied} />
                <div className="grid grid-cols-2 gap-3">
                  <Social href={profile.linkedin} icon={<LinkedinIcon className="h-4 w-4" />} label={contact.linkedinLabel} />
                  <Social href={profile.github} icon={<GithubIcon className="h-4 w-4" />} label={contact.githubLabel} />
                </div>
              </div>
            </div>

            <form ref={formRef} onSubmit={sendByEmail} data-pond-solid className={`${PAPER} min-w-0 p-5 sm:p-7`}>
              <h3 className="u-mincho text-xl font-bold">{form.title}</h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={form.name}>
                  <input type="text" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={form.namePlaceholder} className={input} />
                </Field>
                <Field label={form.email}>
                  <input type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={form.emailPlaceholder} className={input} />
                </Field>
                <Field label={form.subject} className="sm:col-span-2">
                  <div className="relative">
                    <input type="text" name="subject" required value={subject} onChange={(e) => onSubjectChange(e.target.value)} placeholder={form.subjectPlaceholder} className={input} />
                    {prefillKey > 0 && (
                      <motion.span
                        key={prefillKey}
                        aria-hidden
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1.6, delay: 0.5 }}
                        className="pointer-events-none absolute inset-0 rounded-[6px] ring-2 ring-[var(--u-red)]"
                      />
                    )}
                  </div>
                </Field>
                <Field label={form.message} className="sm:col-span-2">
                  <textarea ref={messageRef} name="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={form.messagePlaceholder} className={`${input} resize-none`} />
                </Field>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button type="submit" style={{ "--ink-fill": "var(--u-red)" }} className="u-ink-btn inline-flex flex-auto items-center justify-center gap-2 rounded-[8px] bg-[var(--u-ink)] px-5 py-3.5 text-sm font-semibold whitespace-nowrap text-[var(--u-bg)] transition-transform hover:scale-[1.02]">
                  <Send className="h-4 w-4" />
                  {form.submitEmail}
                </button>
                <button type="button" onClick={sendByWhatsapp} style={{ "--ink-fill": "#047857" }} className="u-ink-btn hover:text-white inline-flex flex-auto items-center justify-center gap-2 rounded-[8px] border border-emerald-700/40 px-5 py-3.5 text-sm font-semibold whitespace-nowrap text-emerald-800 transition-colors hover:bg-emerald-600/10 dark:text-emerald-300">
                  <WhatsappIcon className="h-4 w-4" />
                  {form.submitWhatsapp}
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-[var(--u-muted)]">{form.hint}</p>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function KoiPond({ className }) {
  const canvasRef = useRef(null);
  const pondRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const night = useNight();

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const pond = createKoiPond(canvasRef.current, {
      animated: !reduceMotion,
      night: document.documentElement.classList.contains("dark"),
    });
    pondRef.current = pond;
    return () => pond.destroy();
  }, [reduceMotion]);

  useEffect(() => {
    pondRef.current?.setNight(night);
  }, [night]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}

function Field({ label, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-[var(--u-ink-soft)]">{label}</span>
      {children}
    </label>
  );
}

function EmailRow({ label, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div data-pond-solid className={`${PAPER} flex items-center gap-3 p-3 pl-4`}>
      <Mail className="h-5 w-5 shrink-0 text-[var(--u-red)]" />
      <a href={`mailto:${profile.email}`} className="min-w-0 flex-1">
        <span className="block text-xs text-[var(--u-muted)]">{label}</span>
        <span className="block truncate text-[0.95rem] font-semibold sm:text-base">{profile.email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : copyLabel}
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-[6px] text-sm font-semibold transition-colors sm:w-auto sm:px-4 ${
          copied ? "bg-emerald-600 text-white" : "border border-[var(--u-line-strong)]"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "ok" : "copy"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? copiedLabel : copyLabel}</span>
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

function Social({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${PAPER} flex min-w-0 items-center justify-center gap-2 px-4 py-3.5 font-semibold transition-transform hover:-translate-y-0.5 sm:justify-between`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-[var(--u-muted)] sm:block" />
    </a>
  );
}
