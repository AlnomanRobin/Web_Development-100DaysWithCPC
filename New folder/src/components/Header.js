import React, { useEffect, useState } from "react";

const navItems = [
  { id: "intro", label: "Intro" },
  { id: "academic", label: "Academic" },
  { id: "achievements", label: "Achievements" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "hobby-zone", label: "Hobby Zone" },
  { id: "contact", label: "Contact" }
];

export default function Header({ reduceMotion }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => setOpen(false);
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const handleNavClick = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
          <button
            className="flex items-center space-x-2"
            onClick={() => handleNavClick("top")}
            aria-label="Go to top"
          >
            <div className="h-8 w-8 rounded-full bg-holo opacity-60"></div>
            <span className="text-sm font-semibold tracking-wide">AL Noman Robin</span>
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/20 p-2 hover:border-neon-cyan/50 neon-hover"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M4 4 L18 18 M18 4 L4 18" />
              ) : (
                <path d="M3 6 H19 M3 11 H19 M3 16 H19" />
              )}
            </svg>
          </button>
        </div>
        {open && (
          <div className="mt-2 md:hidden glass rounded-xl border border-white/10 p-3">
            <ul className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-white/80 hover:text-white hover:border-neon-cyan/50 neon-hover"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}