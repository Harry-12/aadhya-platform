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
  const bg = theme?.background || "#FFF8F0";

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
        background: `linear-gradient(160deg, ${primary}0C 0%, ${bg} 50%, ${accent}0A 100%)`,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* The invitation card */}
      <div
        className="relative cursor-pointer"
        onClick={handleOpen}
        style={{
          width: "min(380px, 82vw)",
          opacity: entered ? 1 : 0,
          transform: entered
            ? "perspective(800px) rotateY(-2deg) rotateX(1deg)"
            : "perspective(800px) rotateY(-2deg) rotateX(1deg) translateY(30px)",
          transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
        }}
      >
        {/* Card shadow */}
        <div
          className="absolute -bottom-3 left-[8%] right-[4%] h-6 rounded-[50%]"
          style={{
            background: `radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)`,
            filter: "blur(6px)",
          }}
        />

        {/* Main card */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: "#FEFCF9",
            boxShadow: `
              0 2px 8px rgba(0,0,0,0.06),
              0 8px 24px rgba(0,0,0,0.08),
              0 20px 48px ${primary}10
            `,
            aspectRatio: "5 / 7",
          }}
        >
          {/* Thin top accent line */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{ height: "3px", background: primary }}
          />

          {/* Inner border */}
          <div
            className="absolute rounded"
            style={{
              inset: "16px",
              border: `1px solid ${accent}25`,
            }}
          />

          {/* Card content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 sm:px-14 py-12">
            {/* Top decorative element */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px" style={{ background: `${accent}50` }} />
              <div className="w-1.5 h-1.5" style={{ background: `${accent}45`, transform: "rotate(45deg)" }} />
              <div className="w-10 h-px" style={{ background: `${accent}50` }} />
            </div>

            {/* "You are invited to" */}
            <p
              className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium mb-5"
              style={{ color: `${primary}70` }}
            >
              You are invited to
            </p>

            {/* Event title */}
            <h1
              className="font-display text-2xl sm:text-3xl font-bold leading-snug text-center mb-3"
              style={{ color: primary }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                className="text-sm font-light italic mb-5"
                style={{ color: `${primary}70` }}
              >
                {subtitle}
              </p>
            )}

            {/* Small divider */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-px" style={{ background: `${accent}40` }} />
              <div className="w-1 h-1 rounded-full" style={{ background: `${accent}40` }} />
              <div className="w-6 h-px" style={{ background: `${accent}40` }} />
            </div>

            {/* Tap to open */}
            <p
              className="text-[10px] uppercase tracking-[0.3em] font-medium"
              style={{ color: `${accent}90` }}
            >
              Tap to open
            </p>
          </div>

          {/* Thin bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: "3px", background: primary }}
          />
        </div>
      </div>
    </div>
  );
}
