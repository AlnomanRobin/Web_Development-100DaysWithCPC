import React, { useEffect, useRef, useState } from "react";
import Section from "./Section.jsx";

const LS_KEY = "hobby_uploads_v1";

export default function HobbyZone() {
  const [items, setItems] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  function handleFiles(files) {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        setItems((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random().toString(16).slice(2),
            title: "",
            desc: "",
            dataUrl: reader.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <Section
      title="Hobby Zone"
      subtitle="Upload and preview your works (stored locally for demo). Replace with backend later."
    >
      <div
        className={`glass rounded-xl border border-dashed p-6 transition ${
          dragOver ? "border-neon-cyan/60" : "border-white/20"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        aria-label="Drag and drop files here"
      >
        <div className="flex flex-col items-center text-center">
          <svg width="36" height="36" fill="none" stroke="currentColor" className="opacity-80">
            <path d="M18 12 L18 24 M12 18 L24 18" strokeWidth="2" />
            <rect x="6" y="6" width="24" height="24" rx="6" strokeWidth="2" />
          </svg>
          <p className="mt-2 text-sm text-white/80">
            Drag & drop images, or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-3"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      <div className="mt-6 masonry">
        {items.map((it) => (
          <div key={it.id} className="masonry-item mb-4">
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
              <img
                src={it.dataUrl}
                alt={it.title || "Uploaded work"}
                className="w-full object-cover"
                loading="lazy"
              />
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={it.title}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((p) => (p.id === it.id ? { ...p, title: e.target.value } : p))
                    )
                  }
                  className="w-full rounded-lg bg-transparent border border-white/20 text-sm"
                />
                <textarea
                  placeholder="Short description"
                  value={it.desc}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((p) => (p.id === it.id ? { ...p, desc: e.target.value } : p))
                    )
                  }
                  rows={2}
                  className="w-full rounded-lg bg-transparent border border-white/20 text-sm"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setItems((prev) => prev.filter((p) => p.id !== it.id))}
                    className="rounded-lg border border-white/20 px-3 py-1 text-xs hover:border-neon-magenta/50 neon-hover"
                    aria-label="Delete item"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-white/60">
        Note: Items are stored in localStorage for demo. To connect a backend (e.g., Node/Express or
        Firebase), replace the localStorage logic with API calls. Ensure image compression before upload.
      </p>
    </Section>
  );
}