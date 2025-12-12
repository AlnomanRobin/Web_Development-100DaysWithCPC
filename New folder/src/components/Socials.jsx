import React from "react";
import Section from "./Section.jsx";

const socials = [
  // Replace href with real profile links
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "LinkedIn", href: "#", icon: "linkedin" },
  { name: "GitHub", href: "#", icon: "github" },
  { name: "X", href: "#", icon: "x" },
  { name: "Gmail", href: "mailto:your.email@example.com", icon: "gmail" } // replace email
];

function Icon({ type }) {
  switch (type) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M13 3h4v3h-4v3h3l-1 3h-2v6h-3v-6H9V9h2V6c0-2 1-3 2-3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M6 9h3v9H6V9zm1.5-6C5.7 3 5 3.7 5 4.5S5.7 6 6.5 6 8 5.3 8 4.5 7.3 3 6.5 3zM10 9h3v1.3c.5-.9 1.6-1.5 2.8-1.5 3 0 3.6 2 3.6 4.6V18h-3v-3.9c0-1.1-.1-2.6-1.6-2.6-1.6 0-1.9 1.2-1.9 2.6V18h-3V9z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-2c-3 .7-3.7-1.4-3.7-1.4-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.4-.3-5-1.2-5-5.3 0-1.2.4-2.2 1.1-3.1-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3 .1.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.1-.4 3-.1 3-.1.6 1.6.2 2.8.1 3.1.7.9 1.1 1.9 1.1 3.1 0 4.1-2.6 5-5 5.3.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M18 2H6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4zm-2.5 14.8L12.7 13l-4.5 5.8H6.4l5.2-6.7L6.5 7.2h3l2.7 3.4 4.2-3.4h1.2l-4.9 6.2 5 6.6h-2.4z" />
        </svg>
      );
    case "gmail":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M20 6h-4l-4 3-4-3H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3v-8l5 3 5-3v8h3a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Socials() {
  return (
    <Section title="Connect / Socials">
      <div className="flex flex-wrap gap-4">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target={s.icon === "gmail" ? "_self" : "_blank"}
            rel="noreferrer"
            aria-label={s.name}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 glass hover:border-neon-cyan/60 neon-hover"
          >
            <Icon type={s.icon} />
          </a>
        ))}
      </div>
    </Section>
  );
}