"use client";

import { useCallback, useEffect, useState } from "react";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { portfolioContent } from "@/content/portfolio-content";
import { useLocale } from "@/lib/locale-store";
import { ukiyoCopy } from "../_lib/copy";
import Header from "./Header";
import Hero from "./Hero";
import ToolsBand from "./ToolsBand";
import Services from "./Services";
import Projects from "./Projects";
import About from "./About";
import Process from "./Process";
import Contact from "./Contact";
import Footer from "./Footer";
import { FooterTides, MizuBackground, TideDivider } from "./tides";

/**
 * Portfólio completo no estilo ukiyo-e. Os textos de projetos, sobre, processo
 * e contato vêm do mesmo arquivo do site principal (portfolio-content.ts).
 */
export default function UkiyoSite() {
  const locale = useLocale();
  const dictionary = portfolioContent[locale];
  const copy = ukiyoCopy[locale];
  const [subject, setSubject] = useState("");
  const [prefillKey, setPrefillKey] = useState(0);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  // "Quero um projeto assim": preenche o assunto e desce até o lago.
  const handleSimilar = useCallback(
    (project) => {
      setSubject(dictionary.contact.similarSubject.replace("{project}", project.title));
      setPrefillKey((key) => key + 1);
      window.setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 320);
    },
    [dictionary],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="ukiyo relative isolate min-h-svh overflow-x-clip">
        <MizuBackground />
        <ScrollBrush />
        <Header locale={locale} nav={dictionary.nav} themeCopy={copy.theme} />
        <main>
          <Hero dictionary={dictionary} copy={copy} />
          <ToolsBand label={copy.tools} />
          <Services dictionary={dictionary} copy={copy} />
          <TideDivider kanji="水" />
          <Projects dictionary={dictionary} copy={copy} onSimilar={handleSimilar} />
          <TideDivider kanji="波" />
          <About dictionary={dictionary} copy={copy} />
          <TideDivider kanji="流" />
          <Process dictionary={dictionary} copy={copy} />
          <Contact dictionary={dictionary} copy={copy} subject={subject} onSubjectChange={setSubject} prefillKey={prefillKey} />
        </main>
        <FooterTides />
        <Footer dictionary={dictionary} copy={copy} />
        <div aria-hidden className="u-grain" />
      </div>
    </MotionConfig>
  );
}

/** Pincelada vermelha no topo que acompanha a rolagem. */
function ScrollBrush() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-[var(--u-red)]"
    />
  );
}
