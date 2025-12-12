import React, { useState } from "react";
import Section from "./Section.jsx";

function Toast({ type, message }) {
  const color =
    type === "success"
      ? "bg-neon-cyan/20 border-neon-cyan/40"
      : "bg-neon-magenta/20 border-neon-magenta/40";
  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 glass-strong rounded-lg border ${color} px-4 py-2 text-sm`}
    >
      {message}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const valid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.subject.trim() &&
    form.message.trim();

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid) {
      setToast({ type: "error", message: "Please fill all fields correctly." });
      setTimeout(() => setToast(null), 2500);
      return;
    }
    setLoading(true);
    // Demo sending: simulate network call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setToast({ type: "success", message: "Message sent (demo). Replace with EmailJS/Formspree." });
    setTimeout(() => setToast(null), 2500);

    // Instructions:
    // - EmailJS: install emailjs-com, init with serviceId, templateId, publicKey, then emailjs.send(...)
    // - Formspree: set action to Formspree endpoint, POST form data. See README for details.
  }

  return (
    <Section title="Contact / Send Message">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="glass rounded-xl border border-white/10 p-5">
          <h3 className="text-sm font-semibold">Contact Info</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <span className="text-white/60">Email:</span>{" "}
              <a
                href="mailto:your.email@example.com"
                className="underline underline-offset-4 hover:text-neon-cyan"
              >
                your.email@example.com
              </a>
            </li>
            <li>
              <span className="text-white/60">Location:</span> Dhaka, Bangladesh
            </li>
            <li>
              <span className="text-white/60">Phone:</span> +880-000-000000
            </li>
          </ul>
          <a
            href="/AL_Noman_Robin_CV.pdf"
            download
            className="mt-4 inline-flex rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-neon-purple/50 neon-hover"
          >
            Download CV
          </a>
        </div>

        <form
          onSubmit={onSubmit}
          className="lg:col-span-2 glass rounded-xl border border-white/10 p-5 space-y-3"
          noValidate
        >
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full rounded-lg bg-transparent border border-white/20 text-sm"
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full rounded-lg bg-transparent border border-white/20 text-sm"
                aria-required="true"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              required
              className="w-full rounded-lg bg-transparent border border-white/20 text-sm"
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
              className="w-full rounded-lg bg-transparent border border-white/20 text-sm"
              aria-required="true"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-neon-cyan/50 neon-hover disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
            <a
              href="mailto:your.email@example.com?subject=Portfolio%20Contact"
              className="text-xs underline underline-offset-4 hover:text-neon-magenta"
            >
              Gmail quick contact
            </a>
          </div>
        </form>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} />}
    </Section>
  );
}