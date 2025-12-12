import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Academic from "./components/Academic.jsx";
import Achievements from "./components/Achievements.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Certificates from "./components/Certificates.jsx";
import HobbyZone from "./components/HobbyZone.jsx";
import Socials from "./components/Socials.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <div className={reduceMotion ? "reduce-motion" : ""}>
      <div
        className="min-h-screen bg-base-900"
        style={{
          backgroundImage:
            "radial-gradient(1000px 600px at 0% 0%, rgba(154,107,255,0.10), transparent 60%), radial-gradient(700px 500px at 100% 20%, rgba(0,229,255,0.10), transparent 60%)"
        }}
      >
        <Header reduceMotion={reduceMotion} />
        <main id="top" className="pt-20">
          <section id="intro">
            <Hero reduceMotion={reduceMotion} />
          </section>
          <section id="academic" className="scroll-mt-20">
            <Academic />
          </section>
          <section id="achievements" className="scroll-mt-20">
            <Achievements />
          </section>
          <section id="skills" className="scroll-mt-20">
            <Skills reduceMotion={reduceMotion} />
          </section>
          <section id="projects" className="scroll-mt-20">
            <Projects />
          </section>
          <section id="certificates" className="scroll-mt-20">
            <Certificates />
          </section>
          <section id="hobby-zone" className="scroll-mt-20">
            <HobbyZone />
          </section>
          <section id="connect" className="scroll-mt-20">
            <Socials />
          </section>
          <section id="contact" className="scroll-mt-20">
            <Contact />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}