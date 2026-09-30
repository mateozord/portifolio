"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";
import { profile, type PortfolioDictionary } from "@/content/portfolio-content";
import { Reveal, SectionHeader } from "@/components/motion-primitives";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons";
import { cn } from "@/lib/cn";

type ContactSectionProps = {
  dictionary: PortfolioDictionary;
  subject: string;
  onSubjectChange: (subject: string) => void;
  /** Muda quando um projeto preenche o assunto: o campo pisca para chamar atenção. */
  prefillKey: number;
};

export function ContactSection({ dictionary, subject, onSubjectChange, prefillKey }: ContactSectionProps) {
  const contact = dictionary.contact;
  const form = contact.form;
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Assunto preenchido por um projeto: o próximo passo natural é escrever a mensagem.
  useEffect(() => {
    if (prefillKey > 0) messageRef.current?.focus({ preventScroll: true });
  }, [prefillKey]);

  const composeBody = () =>
    `${form.name}: ${name.trim()}\n${form.email}: ${email.trim()}\n\n${message.trim()}`;

  const sendByEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mailSubject = encodeURIComponent(`[Portfólio] ${subject.trim()}`);
    const body = encodeURIComponent(composeBody());
    window.location.href = `mailto:${profile.email}?subject=${mailSubject}&body=${body}`;
  };

  const sendByWhatsapp = () => {
    if (!formRef.current?.reportValidity()) return;
    const text = `*${subject.trim()}*\n\n${composeBody()}`;
    window.open(`${profile.whatsappLink}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <div className="card relative isolate overflow-hidden rounded-[2.25rem] p-5 sm:p-10 lg:p-14">
        <div aria-hidden className="bg-brand absolute -top-32 -right-24 -z-10 h-80 w-80 rounded-full opacity-20 blur-3xl" />
        <div aria-hidden className="bg-brand absolute -bottom-40 -left-24 -z-10 h-72 w-72 rounded-full opacity-10 blur-3xl" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="min-w-0">
            <SectionHeader compact eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.body} />

            <Reveal delay={0.15} className="mt-10 space-y-3">
              <a
                href={profile.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group flex items-center gap-3 rounded-3xl bg-emerald-600 p-4 text-white sm:gap-4 sm:p-5 shadow-[0_18px_40px_-18px_rgb(5_150_105/0.8)] transition-transform hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 sm:h-12 sm:w-12">
                  <WhatsappIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-white/80">{contact.whatsappHint}</span>
                  <span className="block text-base font-semibold sm:text-lg">
                    {contact.whatsappLabel} · {profile.whatsappDisplay}
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
              </a>

              <EmailRow label={contact.emailLabel} copyLabel={contact.copy} copiedLabel={contact.copied} />

              <div className="grid grid-cols-2 gap-3">
                <SocialLink href={profile.linkedin} icon={<LinkedinIcon className="h-4 w-4" />}>
                  {contact.linkedinLabel}
                </SocialLink>
                <SocialLink href={profile.github} icon={<GithubIcon className="h-4 w-4" />}>
                  {contact.githubLabel}
                </SocialLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="min-w-0">
            <form
              ref={formRef}
              onSubmit={sendByEmail}
              className="border-line bg-surface-strong/80 rounded-[1.75rem] border p-4 sm:p-7"
            >
              <h3 className="text-xl font-semibold tracking-tight">{form.title}</h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={form.name}>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={form.namePlaceholder}
                    className={inputClass}
                  />
                </Field>
                <Field label={form.email}>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={form.emailPlaceholder}
                    className={inputClass}
                  />
                </Field>
                <Field label={form.subject} className="sm:col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      required
                      value={subject}
                      onChange={(event) => onSubjectChange(event.target.value)}
                      placeholder={form.subjectPlaceholder}
                      className={inputClass}
                    />
                    {prefillKey > 0 && (
                      <motion.span
                        key={prefillKey}
                        aria-hidden
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
                        className="ring-accent pointer-events-none absolute inset-0 rounded-2xl ring-2"
                      />
                    )}
                  </div>
                </Field>
                <Field label={form.message} className="sm:col-span-2">
                  <textarea
                    ref={messageRef}
                    name="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={form.messagePlaceholder}
                    className={cn(inputClass, "resize-none")}
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  type="submit"
                  className="focus-ring bg-ink text-bg group inline-flex flex-auto items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-transform hover:scale-[1.02]"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  {form.submitEmail}
                </button>
                <button
                  type="button"
                  onClick={sendByWhatsapp}
                  className="focus-ring inline-flex flex-auto items-center justify-center gap-2 rounded-full border border-emerald-600/30 whitespace-nowrap bg-emerald-500/10 px-5 py-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-300"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  {form.submitWhatsapp}
                </button>
              </div>
              <p className="text-muted mt-3 text-center text-xs">{form.hint}</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition focus:border-accent focus:ring-4 focus:ring-[var(--accent-soft)] focus:outline-none";

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-ink-soft mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function EmailRow({ label, copyLabel, copiedLabel }: { label: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
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
    <div className="border-line bg-surface-strong/70 flex items-center gap-3 rounded-3xl border p-3 pl-4 sm:gap-4 sm:pl-5">
      <Mail className="text-accent h-5 w-5 shrink-0" />
      <a href={`mailto:${profile.email}`} className="focus-ring min-w-0 flex-1 rounded-md">
        <span className="text-muted block text-xs">{label}</span>
        <span className="block truncate text-[0.95rem] font-semibold sm:text-base">{profile.email}</span>
      </a>
      <motion.button
        type="button"
        onClick={copy}
        whileTap={{ scale: 0.9 }}
        aria-label={copied ? copiedLabel : copyLabel}
        className={cn(
          "focus-ring relative inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full text-sm font-semibold transition-colors sm:w-auto sm:px-4",
          copied ? "bg-emerald-500 text-white" : "bg-ink/[0.06] text-ink hover:bg-ink/10 dark:bg-white/[0.08]",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? copiedLabel : copyLabel}</span>
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function SocialLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring border-line bg-surface-strong/70 hover:border-line-strong group flex min-w-0 items-center justify-center gap-2 rounded-3xl border px-4 py-4 font-semibold transition-all hover:-translate-y-0.5 sm:justify-between sm:px-5"
    >
      <span className="flex items-center gap-2.5">
        {icon}
        {children}
      </span>
      <ArrowUpRight className="text-muted hidden h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45 sm:block" />
    </a>
  );
}
