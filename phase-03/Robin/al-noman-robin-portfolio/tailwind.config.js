module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: '#39FF14',
        neonPink: '#FF007F',
        darkBackground: '#0f0f0f',
        lightBackground: '#1a1a1a',
      },
      fontFamily: {
        futuristic: ['"Orbitron"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}