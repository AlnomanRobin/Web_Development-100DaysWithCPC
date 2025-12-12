import React from "react";
import Section from "./Section.jsx";

const achievements = [
  // Replace with real achievements
  {
    title: "Winner — Robotics Hackathon",
    date: "2024",
    desc: "Led a team to build an autonomous line-following bot with ROS basics."
  },
  {
    title: "Top 10 — UI Challenge",
    date: "2023",
    desc: "Designed a sleek, accessible dashboard with micro-interactions."
  },
  {
    title: "Speaker — Dev Meetup",
    date: "2023",
    desc: "Gave a talk on performance-first frontend with Tailwind and Vite."
  }
];

export default function Achievements() {
  return (
    <Section title="Achievements">
      <div className="grid md:grid-cols-3 gap-6">
        {achievements.map((a, i) => (
          <div
            key={i}
            className={`glass rounded-xl border border-white/10 p-5 hover:shadow-glow neon-hover ${
              i === 0 ? "ring-1 ring-neon-magenta/50" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{a.title}</h3>
              <span className="text-xs text-white/60">{a.date}</span>
            </div>
            <p className="mt-2 text-sm text-white/80">{a.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}