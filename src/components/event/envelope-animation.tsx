"use client";

import { useState, useEffect } from "react";

interface EnvelopeAnimationProps {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  theme?: { primary: string; accent: string; background: string };
}

export function EnvelopeAnimation({ title, subtitle, onOpen, theme }: EnvelopeAnimationProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [entered, setEntered] = useState(false);
  const primary = theme?.primary || "#8B1A1A";
  const accent = theme?.accent || "#D4A574";
  const bg = theme?.background || "#FFF8F0";

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    if (fadeOut) return;
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      onOpen();
    }, 600);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none"
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${accent}88 50%, ${primary} 100%)`,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
      onClick={handleOpen}
    >
      <div
        className="text-center px-8 max-w-lg"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        {/* Simple line */}
        <div className="w-12 h-px mx-auto mb-8" style={{ background: "rgba(255,255,255,0.4)" }} />

        {/* Small label */}
        <p
          className="text-[11px] sm:text-xs uppercase tracking-[0.5em] mb-6"
          style={{
            color: "rgba(255,255,255,0.6)",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        >
          You are invited
        </p>

        {/* Event title */}
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
          style={{
            color: "white",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-base sm:text-lg font-light italic mb-8"
            style={{
              color: "rgba(255,255,255,0.7)",
              opacity: entered ? 1 : 0,
              transition: "opacity 0.8s ease 0.8s",
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Simple line */}
        <div
          className="w-12 h-px mx-auto mb-10"
          style={{
            background: "rgba(255,255,255,0.4)",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.9s",
          }}
        />

        {/* CTA */}
        <button
          className="px-8 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 1s, transform 0.3s ease, background 0.3s ease",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "rgba(255,255,255,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "rgba(255,255,255,0.15)";
          }}
        >
          Open Invitation
        </button>
      </div>
    </div>
  );
}
