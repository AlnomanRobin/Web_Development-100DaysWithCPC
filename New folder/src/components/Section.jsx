import React from "react";

export default function Section({ title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}