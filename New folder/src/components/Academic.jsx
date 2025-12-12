import React from "react";
import Section from "./Section.jsx";

const items = [
  // Replace with real academic results
  { degree: "B.Sc.", institution: "XYZ University", year: "2023", gpa: "3.75" },
  { degree: "HSC", institution: "ABC College", year: "2019", gpa: "5.00" },
  { degree: "SSC", institution: "DEF School", year: "2017", gpa: "5.00" }
];

export default function Academic() {
  return (
    <Section title="Academic Results">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="glass rounded-xl border border-white/10 p-5 transition transform hover:-translate-y-0.5 hover:shadow-glow neon-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="inline-block h-2 w-2 rounded-full bg-neon-purple shadow-glow" />
                <h3 className="text-base font-semibold">{item.degree}</h3>
              </div>
              <span className="text-xs text-white/60">{item.year}</span>
            </div>
            <p className="text-sm text-white/80">{item.institution}</p>
            <p className="mt-2 text-sm">
              <span className="text-white/60">GPA/Result:</span>{" "}
              <span className="font-semibold">{item.gpa}</span>
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}