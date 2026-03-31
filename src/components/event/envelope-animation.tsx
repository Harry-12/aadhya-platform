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

  // Envelope dimensions
  const envWidth = "min(360px, 85vw)";

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

      {/* Envelope container */}
      <div
        className="relative cursor-pointer"
        onClick={handleOpen}
        style={{
          width: envWidth,
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        {/* Shadow under envelope */}
        <div
          className="absolute -bottom-5 left-[8%] right-[8%] h-8 rounded-[50%]"
          style={{
            background: `radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)`,
            filter: "blur(10px)",
          }}
        />

        {/* SVG Envelope shape */}
        <svg
          viewBox="0 0 360 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto relative z-10 drop-shadow-2xl"
          style={{
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
          }}
        >
          {/* Envelope body - rounded rectangle */}
          <rect
            x="0"
            y="60"
            width="360"
            height="220"
            rx="12"
            fill="#FFFDF9"
          />

          {/* Envelope flap (triangle) */}
          <path
            d="M0 72 L180 170 L360 72 L360 60 Q360 48 348 48 L12 48 Q0 48 0 60 Z"
            fill="#FFF8F0"
          />
          {/* Flap fold line shadow */}
          <path
            d="M4 72 L180 166 L356 72"
            stroke={`${primary}15`}
            strokeWidth="1"
            fill="none"
          />

          {/* Inner card area with slight inset look */}
          <rect
            x="24"
            y="90"
            width="312"
            height="176"
            rx="6"
            fill="none"
            stroke={`${accent}20`}
            strokeWidth="0.75"
          />
        </svg>

        {/* Content overlay positioned on the envelope body */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-center px-12 sm:px-16"
          style={{
            top: "38%",
            bottom: "4%",
          }}
        >
          {/* Small envelope icon */}
          <div className="mb-4">
            <svg
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
            >
              <rect x="0.5" y="0.5" width="31" height="23" rx="3" stroke={accent} strokeWidth="0.8" fill="none" />
              <path d="M0.5 0.5L16 14L31.5 0.5" stroke={accent} strokeWidth="0.8" />
            </svg>
          </div>

          {/* "You are invited to" */}
          <p
            className="text-[9px] sm:text-[11px] uppercase tracking-[0.35em] font-medium mb-3"
            style={{ color: `${primary}70` }}
          >
            You are invited to
          </p>

          {/* Event title */}
          <h1
            className="font-display text-xl sm:text-2xl font-bold leading-snug text-center mb-2"
            style={{ color: primary }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-xs sm:text-sm font-light italic mb-3"
              style={{ color: `${primary}60` }}
            >
              {subtitle}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-px" style={{ background: `${accent}45` }} />
            <div className="w-1 h-1" style={{ background: `${accent}50`, transform: "rotate(45deg)" }} />
            <div className="w-6 h-px" style={{ background: `${accent}45` }} />
          </div>

          {/* Tap to open */}
          <p
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-medium"
            style={{ color: accent }}
          >
            Tap to open
          </p>
        </div>

        {/* Wax seal on the flap */}
        <div
          className="absolute z-20"
          style={{
            top: "28%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: "36px",
              height: "36px",
              background: `radial-gradient(circle at 40% 35%, ${primary}EE, ${primary})`,
              boxShadow: `0 2px 8px ${primary}50, inset 0 1px 2px rgba(255,255,255,0.2)`,
            }}
          >
            {/* Heart on seal */}
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
              <path
                d="M7 12C7 12 1 8 1 4.5C1 2.5 3 1 5 2.5C5.8 3.1 6.5 4 7 4.5C7.5 4 8.2 3.1 9 2.5C11 1 13 2.5 13 4.5C13 8 7 12 7 12Z"
                fill="rgba(255,255,255,0.85)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
