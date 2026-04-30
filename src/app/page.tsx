"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { portfolioContent, type Locale } from "@/content/portfolio-content";

const linkedinUrl = "https://www.linkedin.com/in/mateus-fantin/";
const emailAddress = "matfp3@hotmail.com";
const mailTo = `mailto:${emailAddress}`;
const whatsappNumber = "11 98015-7119";
const whatsappLink = "https://wa.me/5511980157119";

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
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const developmentTools = dictionary.skills.groups.find((group) =>
    group.label.toLowerCase().includes("desenvolvimento") ||
    group.label.toLowerCase().includes("learning"),
  );

  const processSkills = dictionary.skills.groups.find(
    (group) =>
      group.label.toLowerCase().includes("process") ||
      group.label.toLowerCase().includes("processos"),
  );

  const coreSkills = dictionary.skills.groups.find(
    (group) => group !== developmentTools && group !== processSkills,
  );

  const mergedCoreItems = [
    ...(coreSkills?.items ?? []),
    ...(developmentTools?.items ?? []),
  ];

  const parseSkillLevel = (item: string) => {
    const [name, level] = item.split(" - ");
    return { name: name ?? item, level: level ?? "" };
  };

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
    <div className="min-h-screen bg-[#050b21] text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <header className="sticky top-4 z-20 mb-12 rounded-full border border-white/15 bg-[#090f28]/75 px-4 py-3 shadow-[0_8px_32px_rgba(5,8,22,0.35)] backdrop-blur">
          <nav className="flex items-center justify-between gap-3">
            <ul className="hidden gap-4 text-sm text-slate-300 md:flex">
              <li><a href="#about" className="transition hover:text-violet-300">{dictionary.nav.about}</a></li>
              <li><a href="#projects" className="transition hover:text-violet-300">{dictionary.nav.projects}</a></li>
              <li><a href="#skills" className="transition hover:text-violet-300">{dictionary.nav.skills}</a></li>
              <li><a href="#education" className="transition hover:text-violet-300">{dictionary.nav.education}</a></li>
              <li><a href="#courses" className="transition hover:text-violet-300">{dictionary.nav.courses}</a></li>
              <li><a href="#contact" className="transition hover:text-violet-300">{dictionary.nav.contact}</a></li>
            </ul>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => setLocale("pt")}
                className={`rounded-full px-3 py-1 transition ${
                  locale === "pt" ? "bg-violet-400 text-[#0b1126]" : "border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-full px-3 py-1 transition ${
                  locale === "en" ? "bg-violet-400 text-[#0b1126]" : "border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                EN
              </button>
            </div>
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
          <section
            data-reveal
            className="reveal section-shell surface-card relative overflow-hidden rounded-3xl p-5 md:min-h-[78vh] md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.2),transparent_40%)]" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
              <p className="text-xl font-semibold text-slate-200 md:text-2xl">
                {locale === "pt" ? "Olá, me chamo" : "Hi, my name is"}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl md:text-7xl">Mateus Fantin</h1>
              <p className="mt-5 text-base text-slate-300 md:text-lg">{dictionary.hero.role}</p>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
                {dictionary.hero.summary}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:mt-10 md:gap-4">
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
                  {locale === "pt" ? "Sobre mim" : "About me"}
                </a>
              </div>
              <div className="mt-10 w-full max-w-xs overflow-hidden rounded-3xl border border-violet-300/30 shadow-[0_0_40px_rgba(139,92,246,0.2)] sm:max-w-md md:mt-14">
                <Image
                  src="/profile.jpg"
                  alt="Mateus Fantin profile"
                  width={420}
                  height={520}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
              <a href="#about" className="mt-10 text-sm text-violet-200/80 transition hover:text-violet-100">
                {locale === "pt" ? "Descer para ver mais" : "Scroll down"}
              </a>
            </div>
          </section>

          <section id="about" data-reveal className="reveal section-shell">
            <p className="text-center text-slate-300">{locale === "pt" ? "Minha introdução" : "My introduction"}</p>
            <h2 className="mt-1 text-center text-3xl font-bold text-violet-200 md:text-4xl">{dictionary.about.title}</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article className="surface-card interactive-lift rounded-2xl p-5 text-center">
                <p className="text-sm text-slate-400">{locale === "pt" ? "Experiência" : "Experience"}</p>
                <p className="mt-2 text-xl font-semibold text-slate-100">CVC Corp</p>
              </article>
              <article className="surface-card interactive-lift rounded-2xl p-5 text-center">
                <p className="text-sm text-slate-400">{locale === "pt" ? "Atuação" : "Current focus"}</p>
                <p className="mt-2 text-xl font-semibold text-slate-100">{locale === "pt" ? "Negociação" : "Negotiation"}</p>
              </article>
              <article className="surface-card interactive-lift rounded-2xl p-5 text-center">
                <p className="text-sm text-slate-400">{locale === "pt" ? "Localização" : "Location"}</p>
                <p className="mt-2 text-xl font-semibold text-slate-100">São Paulo - BR</p>
              </article>
            </div>
            <p className="mx-auto mt-10 max-w-4xl text-center leading-8 text-slate-300">{dictionary.about.body}</p>
          </section>

          <section id="projects" data-reveal className="reveal section-shell">
            <p className="text-center text-slate-300">{locale === "pt" ? "Meu portfólio" : "My portfolio"}</p>
            <h2 className="mt-1 text-center text-3xl font-bold text-violet-200 md:text-4xl">{dictionary.projects.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center leading-7 text-slate-400">{dictionary.projects.subtitle}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-5">
              {dictionary.projects.items.map((project) => (
                <article key={project.title} className="surface-card interactive-lift w-full max-w-md rounded-2xl p-5">
                  {project.image ? (
                    <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={520}
                        height={280}
                        className="h-44 w-full object-cover transition duration-300 hover:scale-[1.02]"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-lg font-semibold text-slate-100">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech} className="rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-xs text-violet-100">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex rounded-xl border border-violet-300 px-4 py-2 text-sm text-violet-200 transition hover:bg-violet-300 hover:text-[#0b1126]"
                    >
                      {locale === "pt" ? "Demonstração" : "Live demo"}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section id="skills" data-reveal className="reveal section-shell">
            <p className="text-center text-slate-300">{locale === "pt" ? "Minhas habilidades" : "My skills"}</p>
            <h2 className="mt-1 text-center text-3xl font-bold text-violet-200 md:text-4xl">{locale === "pt" ? "Minha experiência" : "My experience"}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <article className="surface-card interactive-lift rounded-3xl p-6 text-center">
                <h3 className="mb-6 text-2xl font-semibold text-violet-200">
                  {coreSkills?.label ?? (locale === "pt" ? "Sistemas e experiências" : "Systems and experience")}
                </h3>
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  {mergedCoreItems.map((item) => (
                    (() => {
                      const parsed = parseSkillLevel(item);
                      return (
                        <div key={item} className="flex flex-col items-center">
                          <p className="font-semibold text-slate-100">{parsed.name}</p>
                          {parsed.level ? <p className="text-sm text-slate-400">{parsed.level}</p> : null}
                        </div>
                      );
                    })()
                  ))}
                </div>
              </article>

              <article className="surface-card interactive-lift rounded-3xl p-6 text-center">
                <h3 className="mb-6 text-2xl font-semibold text-violet-200">
                  {processSkills?.label ?? (locale === "pt" ? "Processos" : "Processes")}
                </h3>
                <div className="grid grid-cols-1 gap-5 justify-items-center">
                  {(processSkills?.items ?? []).map((item) => (
                    <div key={item} className="text-center">
                      <p className="font-semibold text-slate-100">{item}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section id="education" data-reveal className="reveal section-shell">
            <p className="text-center text-slate-300">{locale === "pt" ? "Formação" : "Education"}</p>
            <h2 className="mt-1 text-center text-3xl font-bold text-violet-200 md:text-4xl">{dictionary.education.title}</h2>
            <article className="surface-card mt-10 rounded-xl p-6">
              <p className="text-lg font-semibold text-violet-200">{dictionary.education.degree}</p>
              <p className="mt-1 text-slate-200">{dictionary.education.school}</p>
              <p className="mt-2 text-sm text-slate-400">{dictionary.education.period}</p>
              <span className="mt-3 inline-flex rounded-full bg-violet-400/15 px-3 py-1 text-xs font-semibold text-violet-100 ring-1 ring-violet-300/25">
                {dictionary.education.status}
              </span>
            </article>
          </section>

          <section id="courses" data-reveal className="reveal section-shell">
            <p className="text-center text-slate-300">{locale === "pt" ? "Certificados" : "Certificates"}</p>
            <h2 className="mt-1 text-center text-3xl font-bold text-violet-200 md:text-4xl">{dictionary.courses.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center leading-7 text-slate-400">{dictionary.courses.subtitle}</p>
            <ul className="mt-10 space-y-4">
              {dictionary.courses.items.map((course) => (
                <li key={course} className="surface-card interactive-lift rounded-xl px-4 py-3 text-slate-300">
                  {course}
                </li>
              ))}
            </ul>
          </section>

          <section id="contact" data-reveal className="reveal section-shell pb-8">
            <p className="text-center text-slate-300">{locale === "pt" ? "Entrar em contato" : "Get in touch"}</p>
            <h2 className="mt-1 text-center text-3xl font-bold text-violet-200 md:text-4xl">{dictionary.contact.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center leading-7 text-slate-300">{dictionary.contact.body}</p>
            <div className="mx-auto mt-12 grid w-full max-w-6xl items-start gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="w-full">
                <h3 className="mb-5 text-2xl font-semibold text-slate-100 md:text-3xl">
                  {locale === "pt" ? "Fale comigo" : "Talk to me"}
                </h3>
                <div className="space-y-4">
                  <a
                    href={mailTo}
                    className="surface-card interactive-lift block w-full rounded-2xl p-5"
                  >
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="mt-1 text-lg font-semibold text-slate-100">{emailAddress}</p>
                    <p className="mt-3 text-sm font-semibold text-violet-200">
                      {locale === "pt" ? "Contato ->" : "Contact ->"}
                    </p>
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card interactive-lift block w-full rounded-2xl p-5"
                  >
                    <p className="text-sm text-slate-400">Whatsapp</p>
                    <p className="mt-1 text-lg font-semibold text-slate-100">{whatsappNumber}</p>
                    <p className="mt-3 text-sm font-semibold text-violet-200">
                      {locale === "pt" ? "Contato ->" : "Contact ->"}
                    </p>
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card interactive-lift block w-full rounded-2xl p-5"
                  >
                    <p className="text-sm text-slate-400">LinkedIn</p>
                    <p className="mt-1 text-lg font-semibold text-slate-100">Mateus Fantin</p>
                    <p className="mt-3 text-sm font-semibold text-violet-200">
                      {locale === "pt" ? "Contato ->" : "Contact ->"}
                    </p>
                  </a>
                </div>
              </div>

              <div className="w-full">
                <h3 className="mb-5 text-2xl font-semibold text-slate-100 md:text-3xl">
                  {locale === "pt" ? "Para mais informações" : "For more information"}
                </h3>
                <form className="space-y-4" onSubmit={handleContactSubmit}>
                  <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                    <span className="text-sm text-slate-300">{locale === "pt" ? "Nome" : "Name"}</span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder={locale === "pt" ? "Insira seu nome" : "Enter your name"}
                      className="mt-2 w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                      required
                    />
                  </label>
                  <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                    <span className="text-sm text-slate-300">Email</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder={locale === "pt" ? "Insira seu email" : "Enter your email"}
                      className="mt-2 w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                      required
                    />
                  </label>
                  <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                    <span className="text-sm text-slate-300">{locale === "pt" ? "Assunto" : "Subject"}</span>
                    <textarea
                      rows={5}
                      value={formData.subject}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, subject: event.target.value }))
                      }
                      placeholder={locale === "pt" ? "Escreva seu assunto" : "Write your subject"}
                      className="mt-2 w-full resize-none bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                      required
                    />
                  </label>
                  <label className="surface-card block rounded-2xl px-4 pb-3 pt-2">
                    <span className="text-sm text-slate-300">{locale === "pt" ? "Mensagem" : "Message"}</span>
                    <textarea
                      rows={6}
                      value={formData.message}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, message: event.target.value }))
                      }
                      placeholder={locale === "pt" ? "Escreva seu recado" : "Write your message"}
                      className="mt-2 w-full resize-none bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="interactive-lift mt-2 rounded-xl bg-violet-300 px-8 py-3 font-semibold text-[#0b1126] hover:bg-violet-200"
                  >
                    {locale === "pt" ? "Enviar" : "Send"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-8 text-center text-xs text-slate-400">{dictionary.footer}</footer>
      </div>
    </div>
  );
}
