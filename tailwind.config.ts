/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        background: '#0B0F19',
        surface: {
          50: '#111827',
          100: '#1F2937',
          200: '#374151',
          300: '#4B5563',
        },
        primary: {
          400: '#818CF8', // Indigo
          500: '#6366F1',
          600: '#4F46E5',
        },
        secondary: {
          400: '#2DD4BF', // Teal
          500: '#14B8A6',
          600: '#0D9488',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          glow: 'rgba(255, 255, 255, 0.2)',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          muted: '#6B7280'
        }
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
        "fade-in-up": "fadeInUp 1s ease-out forwards",
        "blob": "blob 7s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
