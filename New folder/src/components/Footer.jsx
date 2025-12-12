import React from "react";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10">
      <div className="glass rounded-xl border border-white/10 p-4 text-center text-xs text-white/60">
        <p>&copy; {new Date().getFullYear()} AL Noman Robin. All rights reserved.</p>
        <p className="mt-2">
          Theme: Cyberpunk/Robotics with glassmorphism. Built with React + TailwindCSS.
        </p>
      </div>
    </footer>
  );
}