"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolioContent, type Locale } from "@/content/portfolio-content";
import { ProjectCard } from "@/components/project-card";
import { SectionBlock } from "@/components/section-block";
import { StatCard } from "@/components/stat-card";
import { LocaleToggle } from "@/components/locale-toggle";
import { ParticleField } from "@/components/particle-field";
import { TerminalWindow } from "@/components/terminal-window";

const name = "Mateus Fantin";
const linkedinUrl = "https://www.linkedin.com/in/mateus-fantin/";
const emailAddress = "matfp3@hotmail.com";
const mailTo = `mailto:${emailAddress}`;
const whatsappNumber = "11 98015-7119";
const whatsappLink = "https://wa.me/5511980157119";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const dictionary = useMemo(() => portfolioContent[locale], [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return;
    }

    const subject = encodeURIComponent(`[Portfólio] ${trimmedSubject}`);
    const body = encodeURIComponent(
      `Nome: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMensagem:\n${trimmedMessage}`,
    );

    window.location.href = `${mailTo}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={locale}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <header className="sticky top-4 z-20 mb-12 rounded-full border border-white/15 bg-[#0d0722]/75 px-4 py-3 shadow-[0_8px_32px_rgba(5,2,15,0.45)] backdrop-blur">
              <nav className="flex items-center justify-between gap-3">
                <ul className="hidden gap-4 text-sm text-slate-300 md:flex">
                  <li><a href="#about" className="transition hover:text-violet-300">{dictionary.nav.about}</a></li>
                  <li><a href="#projects" className="transition hover:text-violet-300">{dictionary.nav.projects}</a></li>
                  <li><a href="#skills" className="transition hover:text-violet-300">{dictionary.nav.skills}</a></li>
                  <li><a href="#education" className="transition hover:text-violet-300">{dictionary.nav.education}</a></li>
                  <li><a href="#courses" className="transition hover:text-violet-300">{dictionary.nav.courses}</a></li>
                  <li><a href="#contact" className="transition hover:text-violet-300">{dictionary.nav.contact}</a></li>
                </ul>
                <LocaleToggle locale={locale} onChange={setLocale} />
              </nav>
            </header>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-2 text-sm text-slate-200 md:hidden">
              <a href="#about" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 whitespace-nowrap">{dictionary.nav.about}</a>
              <a href="#projects" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 whitespace-nowrap">{dictionary.nav.projects}</a>
              <a href="#skills" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 whitespace-nowrap">{dictionary.nav.skills}</a>
              <a href="#education" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 whitespace-nowrap">{dictionary.nav.education}</a>
              <a href="#courses" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 whitespace-nowrap">{dictionary.nav.courses}</a>
              <a href="#contact" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 whitespace-nowrap">{dictionary.nav.contact}</a>
            </div>

            <main className="space-y-16 md:space-y-28">
              <section className="rune-border arcane-glow section-shell relative overflow-hidden rounded-3xl p-5 md:min-h-[78vh] md:p-12">
                <ParticleField />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.2),transparent_40%)]" />
                <motion.div
                  variants={heroContainer}
                  initial="hidden"
                  animate="visible"
                  className="relative mx-auto flex max-w-2xl flex-col items-center text-center"
                >
                  <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-xl font-semibold text-slate-200 md:text-2xl">
                    {dictionary.hero.greetingPrefix}
                  </motion.p>
                  <motion.h1
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="font-display glow-text mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl"
                  >
                    {name}
                  </motion.h1>
                  <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-5 text-base text-slate-300 md:text-lg">
                    {dictionary.hero.role}
                  </motion.p>
                  <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
                    {dictionary.hero.summary}
                  </motion.p>
                  <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-8 flex flex-wrap justify-center gap-3 md:mt-10 md:gap-4">
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive-lift rounded-xl border border-violet-300 px-4 py-2.5 font-semibold text-violet-200 transition hover:bg-violet-300 hover:text-[#0b1126] md:px-6 md:py-3"
                    >
                      {dictionary.hero.ctaSecondary}
                    </a>
                    <a
                      href="#about"
                      className="interactive-lift rounded-xl bg-violet-300 px-4 py-2.5 font-semibold text-[#0b1126] transition hover:bg-violet-200 md:px-6 md:py-3"
                    >
                      {dictionary.hero.ctaPrimary}
                    </a>
                  </motion.div>
                  <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-10 w-full max-w-md sm:max-w-lg md:mt-14">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
                      <TerminalWindow title="mateus.ts" lines={dictionary.hero.code} variant="code" />
                    </motion.div>
                  </motion.div>
                  <motion.a
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    href="#about"
                    className="mt-10 text-sm text-violet-200/80 transition hover:text-violet-100"
                  >
                    {dictionary.hero.scrollHint}
                  </motion.a>
                </motion.div>
              </section>

              <SectionBlock id="about" eyebrow={dictionary.about.eyebrow} title={dictionary.about.title}>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  {dictionary.about.stats.map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.value} />
                  ))}
                </div>
                <p className="mx-auto mt-10 max-w-4xl text-center leading-8 text-slate-300">{dictionary.about.body}</p>
                <TerminalWindow
                  title="status.sh"
                  lines={dictionary.about.statusLines}
                  variant="status"
                  className="mx-auto mt-10 max-w-2xl"
                />
              </SectionBlock>

              <SectionBlock
                id="projects"
                eyebrow={dictionary.projects.eyebrow}
                title={dictionary.projects.title}
                subtitle={dictionary.projects.subtitle}
              >
                <div className="mt-10 flex flex-wrap justify-center gap-5">
                  {dictionary.projects.items.map((project) => (
                    <ProjectCard
                      key={project.title}
                      project={project}
                      ctaLabel={dictionary.projects.ctaLabel}
                      categoryLabels={dictionary.projects.categoryLabels}
                    />
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock
                id="skills"
                eyebrow={dictionary.skills.eyebrow}
                title={dictionary.skills.title}
                subtitle={dictionary.skills.subtitle}
              >
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {dictionary.skills.groups.map((group) => (
                    <article key={group.label} className="surface-card interactive-lift rounded-3xl p-6 text-center">
                      <h3 className="font-display mb-6 text-2xl font-semibold text-violet-200">{group.label}</h3>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        {group.items.map((item) => (
                          <div key={item.name} className="flex flex-col items-center">
                            <p className="font-mono font-semibold text-slate-100">{item.name}</p>
                            <p className="text-sm text-slate-400">{item.level}</p>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock id="education" eyebrow={dictionary.education.eyebrow} title={dictionary.education.title}>
                <article className="surface-card mt-10 rounded-xl p-6">
                  <p className="text-lg font-semibold text-violet-200">{dictionary.education.degree}</p>
                  <p className="mt-1 text-slate-200">{dictionary.education.school}</p>
                  <p className="mt-2 text-sm text-slate-400">{dictionary.education.period}</p>
                  <span className="mt-3 inline-flex rounded-full bg-violet-400/15 px-3 py-1 text-xs font-semibold text-violet-100 ring-1 ring-violet-300/25">
                    {dictionary.education.status}
                  </span>
                </article>
              </SectionBlock>

              <SectionBlock
                id="courses"
                eyebrow={dictionary.courses.eyebrow}
                title={dictionary.courses.title}
                subtitle={dictionary.courses.subtitle}
              >
                <ul className="mt-10 space-y-4">
                  {dictionary.courses.items.map((course) => (
                    <li key={course} className="surface-card interactive-lift rounded-xl px-4 py-3 text-slate-300">
                      {course}
                    </li>
                  ))}
                </ul>
              </SectionBlock>

              <SectionBlock
                id="contact"
                eyebrow={dictionary.contact.eyebrow}
                title={dictionary.contact.title}
                subtitle={dictionary.contact.body}
              >
                <div className="mx-auto mt-2 grid w-full max-w-6xl items-start gap-8 lg:grid-cols-2 lg:gap-10">
                  <div className="w-full">
                    <h3 className="font-display mb-5 text-2xl font-semibold text-slate-100 md:text-3xl">
                      {dictionary.contact.talkToMe}
                    </h3>
                    <div className="space-y-4">
                      <a href={mailTo} className="surface-card interactive-lift block w-full rounded-2xl p-5">
                        <p className="text-sm text-slate-400">{dictionary.contact.methods.emailLabel}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-100">{emailAddress}</p>
                        <p className="mt-3 text-sm font-semibold text-violet-200">{dictionary.contact.methods.ctaLabel}</p>
                      </a>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="surface-card interactive-lift block w-full rounded-2xl p-5"
                      >
                        <p className="text-sm text-slate-400">{dictionary.contact.methods.whatsappLabel}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-100">{whatsappNumber}</p>
                        <p className="mt-3 text-sm font-semibold text-violet-200">{dictionary.contact.methods.ctaLabel}</p>
                      </a>
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="surface-card interactive-lift block w-full rounded-2xl p-5"
                      >
                        <p className="text-sm text-slate-400">{dictionary.contact.methods.linkedinLabel}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-100">{name}</p>
                        <p className="mt-3 text-sm font-semibold text-violet-200">{dictionary.contact.methods.ctaLabel}</p>
                      </a>
                    </div>
                  </div>

                  <div className="w-full">
                    <h3 className="font-display mb-5 text-2xl font-semibold text-slate-100 md:text-3xl">
                      {dictionary.contact.formTitle}
                    </h3>
                    <form className="space-y-4" onSubmit={handleContactSubmit}>
                      <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                        <span className="text-sm text-slate-300">{dictionary.contact.form.name}</span>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, name: event.target.value }))
                          }
                          placeholder={dictionary.contact.form.namePlaceholder}
                          className="mt-2 w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                          required
                        />
                      </label>
                      <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                        <span className="text-sm text-slate-300">{dictionary.contact.form.email}</span>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, email: event.target.value }))
                          }
                          placeholder={dictionary.contact.form.emailPlaceholder}
                          className="mt-2 w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                          required
                        />
                      </label>
                      <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                        <span className="text-sm text-slate-300">{dictionary.contact.form.subject}</span>
                        <textarea
                          rows={5}
                          value={formData.subject}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, subject: event.target.value }))
                          }
                          placeholder={dictionary.contact.form.subjectPlaceholder}
                          className="mt-2 w-full resize-none bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                          required
                        />
                      </label>
                      <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                        <span className="text-sm text-slate-300">{dictionary.contact.form.message}</span>
                        <textarea
                          rows={6}
                          value={formData.message}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, message: event.target.value }))
                          }
                          placeholder={dictionary.contact.form.messagePlaceholder}
                          className="mt-2 w-full resize-none bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                          required
                        />
                      </label>
                      <button
                        type="submit"
                        className="interactive-lift mt-2 rounded-xl bg-violet-300 px-8 py-3 font-semibold text-[#0b1126] hover:bg-violet-200"
                      >
                        {dictionary.contact.form.submit}
                      </button>
                    </form>
                  </div>
                </div>
              </SectionBlock>
            </main>

            <footer className="py-8 text-center text-xs text-slate-400">{dictionary.footer}</footer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
