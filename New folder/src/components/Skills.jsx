import React, { useEffect, useRef, useState } from "react";
import Section from "./Section.jsx";

const groups = [
  {
    name: "Frontend",
    skills: [
      { name: "React", pct: 85 },
      { name: "TailwindCSS", pct: 80 },
      { name: "JavaScript", pct: 85 }
    ]
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", pct: 60 },
      { name: "Express", pct: 55 }
    ]
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", pct: 80 },
      { name: "Vite", pct: 75 },
      { name: "Figma", pct: 70 }
    ]
  },
  {
    name: "Robotics/AI",
    skills: [
      { name: "Python", pct: 70 },
      { name: "ROS (basics)", pct: 40 }
    ]
  }
];

function Radial({ pct, label, animate }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="72" height="72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="url(#grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset="0"
          fill="none"
          style={{
            transition: animate ? "stroke-dasharray 800ms ease-out" : "none"
          }}
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00e5ff" />
            <stop offset="1" stopColor="#9a6bff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-1 text-xs text-white/80">{label}</div>
    </div>
  );
}

export default function Skills({ reduceMotion }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold: 0.2 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <Section title="Skills" subtitle="Grouped skills with animated radial charts">
      <div ref={ref} className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {groups.map((g, i) => (
          <div key={i} className="glass rounded-xl border border-white/10 p-5">
            <h3 className="text-sm font-semibold">{g.name}</h3>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {g.skills.map((s, j) => (
                <Radial key={j} pct={s.pct} label={s.name} animate={inView && !reduceMotion} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}