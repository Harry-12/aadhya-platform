import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        burgundy: { DEFAULT: "#8B1A1A", light: "#A52A2A", dark: "#6B1414" },
        gold: { DEFAULT: "#D4A574", light: "#E8C9A0", dark: "#C49A6C", muted: "#8B6914" },
        cream: { DEFAULT: "#FFF8F0", dark: "#F5E6D3" },
        sage: { DEFAULT: "#7D8C6E", light: "#A5B396", dark: "#5C6B4F" },
        charcoal: { DEFAULT: "#2D2D2D", light: "#666666", muted: "#999999" },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
        telugu: ["Noto Sans Telugu", "sans-serif"],
      },
      animation: {
        "float-down": "floatDown 8s infinite linear",
        "confetti-fall": "confettiFall 2s forwards ease-in",
        "envelope-open": "envelopeOpen 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        bounce: "bounce 1.5s infinite",
      },
      keyframes: {
        floatDown: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.3" },
          "90%": { opacity: "0.3" },
          "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" },
        },
        confettiFall: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        envelopeOpen: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.7" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
