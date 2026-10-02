"use client";

import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { portfolioContent, type Project } from "@/content/portfolio-content";
import { useLocale } from "@/lib/locale-store";
import { AmbientBackground, ScrollProgress } from "@/components/ambient";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { TechMarquee } from "@/components/tech-marquee";
import { ServicesSection } from "@/components/services-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ProcessSection } from "@/components/process-section";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ShowReel } from "@/components/show-reel";
import { ScrollRibbon } from "@/components/scroll-ribbon";
import { WhatsappFab } from "@/components/whatsapp-fab";

export default function Home() {
  const locale = useLocale();
  const dictionary = portfolioContent[locale];
  const [contactSubject, setContactSubject] = useState("");
  const [prefillKey, setPrefillKey] = useState(0);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  // "Quero um projeto assim": preenche o assunto e leva até o contato.
  const handleSimilar = useCallback(
    (project: Project) => {
      setContactSubject(dictionary.contact.similarSubject.replace("{project}", project.title));
      setPrefillKey((key) => key + 1);
      // Espera o modal fechar (e liberar a rolagem) antes de rolar.
      window.setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 320);
    },
    [dictionary],
  );

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollProgress />
      <AmbientBackground />
      <SiteHeader dictionary={dictionary} locale={locale} />

      <main className="relative isolate overflow-x-clip">
        <ScrollRibbon />
        <Hero dictionary={dictionary} />
        <ShowReel dictionary={dictionary} />
        <TechMarquee label={dictionary.marqueeLabel} />
        <ServicesSection dictionary={dictionary} />
        <ProjectsSection dictionary={dictionary} onSimilar={handleSimilar} />
        <AboutSection dictionary={dictionary} />
        <ProcessSection dictionary={dictionary} />
        <ContactSection
          dictionary={dictionary}
          subject={contactSubject}
          onSubjectChange={setContactSubject}
          prefillKey={prefillKey}
        />
      </main>

      <SiteFooter dictionary={dictionary} />
      <WhatsappFab label={dictionary.hero.ctaSecondary} />
    </MotionConfig>
  );
}
