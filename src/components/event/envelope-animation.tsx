"use client";

import { useState, useEffect } from "react";

interface EnvelopeAnimationProps {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  theme?: { primary: string; accent: string; background: string };
}

export function EnvelopeAnimation({ title, subtitle, onOpen, theme }: EnvelopeAnimationProps) {
  const [opened, setOpened] = useState(false);
  const [entered, setEntered] = useState(false);
  const primary = theme?.primary || "#8B1A1A";
  const accent = theme?.accent || "#D4A574";
  const bg = theme?.background || "#FFF8F0";

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(onOpen, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none"
      style={{ background: bg }}
    >
      {/* The greeting card */}
      <div
        className="relative cursor-pointer"
        style={{
          width: "min(320px, 75vw)",
          height: "min(440px, 100vw)",
          perspective: "1200px",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
        onClick={handleOpen}
      >
        {/* Card shadow on the surface */}
        <div
          className="absolute -bottom-4 left-[10%] right-[10%] h-8 rounded-[50%]"
          style={{
            background: `radial-gradient(ellipse, ${primary}20 0%, transparent 70%)`,
            filter: "blur(8px)",
            transition: "opacity 0.8s ease",
            opacity: opened ? 0 : 1,
          }}
        />

        {/* Right side of card (stays in place - this is the "back" page visible when opened) */}
        <div
          className="absolute inset-0 rounded-r-2xl overflow-hidden"
          style={{
            background: primary,
            boxShadow: `0 8px 40px ${primary}20`,
          }}
        >
          {/* Subtle gradient for depth */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)",
            }}
          />
        </div>

        {/* Left cover of the card (opens like a book) */}
        <div
          className="absolute inset-0 origin-left rounded-2xl overflow-hidden"
          style={{
            background: primary,
            boxShadow: opened
              ? `5px 0 20px ${primary}15`
              : `0 8px 40px ${primary}25`,
            transform: opened ? "rotateY(-160deg)" : "rotateY(0deg)",
            transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s ease",
            transformStyle: "preserve-3d",
            zIndex: 2,
          }}
        >
          {/* Front face of the cover - completely plain */}
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Subtle gradient for a premium paper feel */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `linear-gradient(155deg, rgba(255,255,255,0.1) 0%, transparent 35%, rgba(0,0,0,0.05) 100%)`,
              }}
            />

            {/* Very subtle spine shadow on the left edge */}
            <div
              className="absolute top-0 bottom-0 left-0 w-3"
              style={{
                background: `linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 100%)`,
                borderRadius: "2xl 0 0 2xl",
              }}
            />
          </div>

          {/* Back face of the cover (inside left page - visible when opened) */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: bg,
            }}
          >
            {/* Very subtle inner texture */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, transparent 0%, ${accent}08 50%, transparent 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
