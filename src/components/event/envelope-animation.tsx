"use client";

import { useState, useEffect } from "react";

interface EnvelopeAnimationProps {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  theme?: { primary: string; accent: string; background: string };
}

export function EnvelopeAnimation({ title, subtitle, onOpen, theme }: EnvelopeAnimationProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [entered, setEntered] = useState(false);
  const primary = theme?.primary || "#8B1A1A";
  const accent = theme?.accent || "#D4A574";

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    if (fadeOut) return;
    setFadeOut(true);
    setTimeout(onOpen, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none"
      style={{
        background: `linear-gradient(145deg, ${primary} 0%, ${primary}DD 40%, ${primary}BB 70%, ${accent}90 100%)`,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* Subtle light overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${accent}12 0%, transparent 40%)`,
        }}
      />

      {/* Envelope + text below it */}
      <div
        className="relative cursor-pointer flex flex-col items-center"
        onClick={handleOpen}
        style={{
          width: "min(360px, 85vw)",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        {/* Shadow under envelope */}
        <div
          className="absolute left-[8%] right-[8%] h-8 rounded-[50%]"
          style={{
            bottom: "60px",
            background: `radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)`,
            filter: "blur(10px)",
          }}
        />

        {/* SVG Envelope shape — colorful using theme */}
        <svg
          viewBox="0 0 360 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto relative z-10"
          style={{
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.2))",
          }}
        >
          <defs>
            {/* Gradient for envelope body */}
            <linearGradient id="envBody" x1="0" y1="50" x2="360" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={accent} />
              <stop offset="100%" stopColor={`${accent}CC`} />
            </linearGradient>
            {/* Gradient for flap — slightly darker shade of primary */}
            <linearGradient id="envFlap" x1="180" y1="38" x2="180" y2="155" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={primary} />
              <stop offset="100%" stopColor={`${primary}DD`} />
            </linearGradient>
          </defs>

          {/* Envelope body */}
          <rect
            x="0"
            y="50"
            width="360"
            height="210"
            rx="12"
            fill="url(#envBody)"
          />

          {/* Lighter inner area for text readability */}
          <rect
            x="20"
            y="80"
            width="320"
            height="165"
            rx="8"
            fill="rgba(255,255,255,0.88)"
          />

          {/* Envelope flap (triangle on top) */}
          <path
            d="M0 62 L180 155 L360 62 L360 50 Q360 38 348 38 L12 38 Q0 38 0 50 Z"
            fill="url(#envFlap)"
          />
          {/* Flap fold line highlight */}
          <path
            d="M4 62 L180 151 L356 62"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            fill="none"
          />

          {/* Thin accent border on body */}
          <rect
            x="0"
            y="50"
            width="360"
            height="210"
            rx="12"
            fill="none"
            stroke={`${primary}30`}
            strokeWidth="1"
          />
        </svg>

        {/* Content on the envelope body */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-center px-10 sm:px-14 z-20"
          style={{
            top: "45%",
            bottom: "20%",
          }}
        >
          {/* "You are invited to" */}
          <p
            className="text-[9px] sm:text-[11px] uppercase tracking-[0.35em] font-medium mb-2"
            style={{ color: `${primary}90` }}
          >
            You are invited to
          </p>

          {/* Event title */}
          <h1
            className="font-display text-lg sm:text-2xl font-bold leading-snug text-center mb-1"
            style={{ color: primary }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-xs sm:text-sm font-light italic"
              style={{ color: `${primary}70` }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Tap to open - below the envelope */}
        <p
          className="mt-5 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium z-10"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          Tap to open
        </p>
      </div>
    </div>
  );
}
