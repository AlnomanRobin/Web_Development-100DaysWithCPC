import React, { useEffect, useRef, useState } from "react";
import Section from "./Section.jsx";

const certificates = [
  // Replace with real certificates
  {
    title: "Frontend Mastery",
    issuer: "Online Academy",
    date: "2023",
    image:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Robotics Basics",
    issuer: "Tech Institute",
    date: "2024",
    image:
      "https://images.unsplash.com/photo-1544473244-fb8b5331c54b?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "UI Design Challenge",
    issuer: "Design Org",
    date: "2023",
    image:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=800&auto=format&fit=crop"
  }
];

function Modal({ open, onClose, certIndex, onPrev, onNext }) {
  const ref = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => {
    if (open && ref.current) {
      ref.current.focus();
    }
  }, [open]);

  if (!open) return null;
  const c = certificates[certIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div
          className="glass-strong rounded-xl border border-white/20 p-4"
          tabIndex={-1}
          ref={ref}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-base font-semibold">{c.title}</h3>
              <p className="text-xs text-white/70">
                {c.issuer} — {c.date}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/20 px-2 py-1 hover:border-neon-magenta/50 neon-hover"
              aria-label="Close certificate modal"
            >
              Close
            </button>
          </div>
          <div className="relative">
            <img
              src={c.image}
              alt={`${c.title} image`}
              className="w-full max-h-[60vh] object-contain"
            />
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={onPrev}
                className="rounded-lg border border-white/20 px-3 py-2 hover:border-neon-cyan/50 neon-hover"
                aria-label="Previous certificate"
              >
                Prev
              </button>
              <button
                onClick={onNext}
                className="rounded-lg border border-white/20 px-3 py-2 hover:border-neon-purple/50 neon-hover"
                aria-label="Next certificate"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };

  const prev = () => setIndex((i) => (i - 1 + certificates.length) % certificates.length);
  const next = () => setIndex((i) => (i + 1) % certificates.length);

  return (
    <Section title="Certificate Gallery" subtitle="Click a thumbnail to open the lightbox">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((c, i) => (
          <button
            key={i}
            onClick={() => openAt(i)}
            className="glass rounded-xl border border-white/10 overflow-hidden hover:shadow-glow neon-hover text-left"
            aria-label={`Open certificate ${c.title}`}
          >
            <img
              src={c.image}
              alt={`${c.title} thumbnail`}
              className="h-40 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold">{c.title}</h3>
              <p className="text-xs text-white/70">
                {c.issuer} — {c.date}
              </p>
            </div>
          </button>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} certIndex={index} onPrev={prev} onNext={next} />
    </Section>
  );
}