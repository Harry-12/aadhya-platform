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
        "envelope-enter": "envelopeEnter 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "seal-glow": "sealGlow 3s ease-in-out infinite",
        "sparkle-drift": "sparkleDrift 6s ease-in-out infinite",
        "sparkle-twinkle": "sparkleTwinkle 2s ease-in-out infinite",
        "text-reveal": "textReveal 0.8s ease-out 0.6s forwards",
        "gentle-float": "gentleFloat 4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "flap-open": "flapOpen 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "card-slide-up": "cardSlideUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards",
        "seal-fade": "sealFade 0.5s ease-out forwards",
      },
      keyframes: {
        floatDown: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "80%": { opacity: "0.6" },
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
        envelopeEnter: {
          "0%": { opacity: "0", transform: "translateY(60px) scale(0.92)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        sealGlow: {
          "0%, 100%": { boxShadow: "0 6px 20px rgba(67,56,202,0.3), 0 2px 8px rgba(67,56,202,0.2)" },
          "50%": { boxShadow: "0 8px 30px rgba(67,56,202,0.5), 0 4px 15px rgba(167,139,250,0.4)" },
        },
        sparkleDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.2" },
          "25%": { transform: "translate(10px, -15px) scale(1.3)", opacity: "0.5" },
          "50%": { transform: "translate(-5px, -25px) scale(0.8)", opacity: "0.15" },
          "75%": { transform: "translate(15px, -10px) scale(1.2)", opacity: "0.4" },
        },
        sparkleTwinkle: {
          "0%, 100%": { opacity: "0.1", transform: "scale(0.8)" },
          "50%": { opacity: "0.6", transform: "scale(1.4)" },
        },
        textReveal: {
          "0%": { opacity: "0", transform: "translateY(15px)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0px)" },
        },
        gentleFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        flapOpen: {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(-180deg)" },
        },
        cardSlideUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-70%)" },
        },
        sealFade: {
          "0%": { opacity: "1", transform: "translate(-50%, 50%) scale(1)" },
          "100%": { opacity: "0", transform: "translate(-50%, 50%) scale(0.5)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
