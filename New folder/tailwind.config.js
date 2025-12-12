/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"]
      },
      colors: {
        base: {
          900: "#0b0f14",
          800: "#0f141b",
          700: "#121a22"
        },
        glass: {
          100: "rgba(255,255,255,0.08)",
          200: "rgba(255,255,255,0.12)",
          300: "rgba(255,255,255,0.18)"
        },
        neon: {
          cyan: "#00e5ff",
          magenta: "#ff3fbf",
          purple: "#9a6bff"
        }
      },
      boxShadow: {
        glow: "0 0 8px rgba(154,107,255,0.5), 0 0 16px rgba(0,229,255,0.3)"
      },
      backgroundImage: {
        grid:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 1px)",
        holo:
          "conic-gradient(from 0deg, rgba(0,229,255,0.4), rgba(255,63,191,0.4), rgba(154,107,255,0.4), rgba(0,229,255,0.4))"
      },
      animation: {
        "fade-in": "fadeIn 600ms ease-out",
        "float": "float 6s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};