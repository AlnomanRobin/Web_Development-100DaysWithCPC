import React from "react";
import Section from "./Section.jsx";

const projects = [
  // Replace with real projects
  {
    title: "Project Spotlight: Neon UI Kit",
    desc:
      "A sleek, accessible component kit with glassmorphism panels and neon accents. Built with React + Tailwind.",
    tech: ["React", "Tailwind", "Vite"],
    featured: true,
    image:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800&auto=format&fit=crop",
    live: "#",
    github: "#"
  },
  {
    title: "Robotics Dashboard",
    desc: "ROS data visualization with charts and telemetry panels.",
    tech: ["React", "WebSocket"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    live: "#",
    github: "#"
  },
  {
    title: "Portfolio Engine",
    desc: "Highly performant SPA with code-splitting and lazy assets.",
    tech: ["React", "Tailwind", "Netlify"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    live: "#",
    github: "#"
  }
];

function ProjectCard({ p }) {
  return (
    <div
      className={`glass rounded-xl border border-white/10 overflow-hidden transition transform hover:-translate-y-0.5 hover:shadow-glow neon-hover ${
        p.featured ? "ring-1 ring-neon-cyan/50" : ""
      }`}
    >
      <div className="relative h-40 w-full">
        <img
          src={p.image}
          alt={`${p.title} thumbnail`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {p.featured && (
          <span className="absolute top-2 left-2 text-xs bg-neon-cyan/20 text-white px-2 py-1 rounded">
            Spotlight
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold">{p.title}</h3>
        <p className="mt-1 text-xs text-white/75">{p.desc}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/20 px-2 py-1 text-xs text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <a
            href={p.live}
            className="text-xs underline underline-offset-4 hover:text-neon-cyan"
            target="_blank"
            rel="noreferrer"
          >
            Live
          </a>
          <a
            href={p.github}
            className="text-xs underline underline-offset-4 hover:text-neon-purple"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <Section title="Projects">
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <ProjectCard key={i} p={p} />
        ))}
      </div>
    </Section>
  );
}