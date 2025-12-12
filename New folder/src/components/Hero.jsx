import React from "react";

export default function Hero({ reduceMotion }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-overlay opacity-40 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              AL Noman Robin
            </h1>
            <p className="text-base md:text-lg text-white/80">
              Cyberpunk | Robotics Enthusiast | Frontend Developer
            </p>
            <p className="text-sm md:text-base text-white/70">
              Crafting sleek, accessible interfaces with a futuristic aesthetic. Focused on
              performance, micro-interactions, and clean code.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#projects"
                className="glass-strong inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-neon-cyan/50 neon-hover"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="glass inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-neon-magenta/50 neon-hover"
              >
                Contact Me
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="glass-strong relative rounded-2xl border border-white/20 p-6">
              {/* Replace avatar with a real image */}
              <div className="relative mx-auto h-48 w-48 md:h-60 md:w-60 rounded-full overflow-hidden border border-white/20 neon-hover">
                <div className="absolute inset-0 bg-holo opacity-30 mix-blend-lighten" />
                <img
                  src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=640&auto=format&fit=crop"
                  alt="Holographic robot avatar placeholder"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 text-center text-xs text-white/60">
                Placeholder avatar — replace with AL Noman Robin's photo or SVG robot.
              </div>
            </div>
            {!reduceMotion && (
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-holo opacity-40 blur-lg animate-float" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}