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
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${accent}15 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${accent}10 0%, transparent 40%)`,
        }}
      />

      {/* The invitation card */}
      <div
        className="relative cursor-pointer"
        onClick={handleOpen}
        style={{
          width: "min(340px, 80vw)",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
        }}
      >
        {/* Card shadow */}
        <div
          className="absolute -bottom-4 left-[6%] right-[6%] h-8 rounded-[50%]"
          style={{
            background: `radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />

        {/* Main card */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            background: "#FFFDF9",
            boxShadow: `0 4px 16px rgba(0,0,0,0.1), 0 12px 40px rgba(0,0,0,0.15)`,
            aspectRatio: "5 / 7",
          }}
        >
          {/* Card content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 sm:px-14">
            {/* Envelope icon at the top */}
            <div className="mb-6">
              <svg
                width="56"
                height="42"
                viewBox="0 0 56 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Envelope body */}
                <rect
                  x="1"
                  y="1"
                  width="54"
                  height="40"
                  rx="4"
                  stroke={primary}
                  strokeWidth="1.5"
                  fill={`${primary}08`}
                />
                {/* Envelope flap - left line */}
                <path
                  d="M1 1L28 24"
                  stroke={primary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Envelope flap - right line */}
                <path
                  d="M55 1L28 24"
                  stroke={primary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Small heart in center */}
                <path
                  d="M28 18.5C28 18.5 24 14.5 24 12.5C24 11 25.5 10 27 11C27.6 11.4 28 12 28 12C28 12 28.4 11.4 29 11C30.5 10 32 11 32 12.5C32 14.5 28 18.5 28 18.5Z"
                  fill={accent}
                  opacity="0.7"
                />
              </svg>
            </div>

            {/* "You are invited to" */}
            <p
              className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-medium mb-4"
              style={{ color: `${primary}80` }}
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
                className="text-sm font-light italic mb-4"
                style={{ color: `${primary}65` }}
              >
                {subtitle}
              </p>
            )}

            {/* Small divider */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-px" style={{ background: `${accent}50` }} />
              <div className="w-1.5 h-1.5" style={{ background: `${accent}50`, transform: "rotate(45deg)" }} />
              <div className="w-8 h-px" style={{ background: `${accent}50` }} />
            </div>

            {/* Tap to open */}
            <p
              className="text-[10px] uppercase tracking-[0.3em] font-medium"
              style={{ color: `${accent}` }}
            >
              Tap to open
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
