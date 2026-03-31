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
    setTimeout(onOpen, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none"
      style={{ background: bg }}
    >
      {/* Greeting card wrapper with 3D perspective */}
      <div
        className="relative cursor-pointer"
        style={{
          width: "min(360px, 80vw)",
          height: "min(260px, 58vw)",
          perspective: "1000px",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(25px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
        onClick={handleOpen}
      >
        {/* Surface shadow */}
        <div
          className="absolute left-[5%] right-[5%] h-6"
          style={{
            bottom: "-14px",
            background: `radial-gradient(ellipse, ${primary}18 0%, transparent 70%)`,
            filter: "blur(6px)",
            opacity: opened ? 0.3 : 1,
            transition: "opacity 0.8s ease",
          }}
        />

        {/* ── BACK PAGE (right half, stays flat) ── */}
        <div
          className="absolute top-0 right-0 rounded-r-lg overflow-hidden"
          style={{
            width: "50%",
            height: "100%",
            background: bg,
            boxShadow: `inset 2px 0 8px ${primary}08`,
          }}
        >
          {/* Inside right page - blank cream/white */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${bg} 0%, #fff 100%)` }} />
        </div>

        {/* ── BACK COVER (left half behind, visible as the card spine area) ── */}
        <div
          className="absolute top-0 left-0 rounded-l-lg overflow-hidden"
          style={{
            width: "50%",
            height: "100%",
            background: primary,
            boxShadow: `0 4px 20px ${primary}15`,
          }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.05) 100%)" }} />
        </div>

        {/* ── FRONT COVER (right half, swings open to the left) ── */}
        <div
          className="absolute top-0 rounded-r-lg overflow-hidden"
          style={{
            left: "50%",
            width: "50%",
            height: "100%",
            transformOrigin: "left center",
            transform: opened ? "rotateY(-170deg)" : "rotateY(0deg)",
            transition: "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
            zIndex: 3,
          }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-r-lg"
            style={{
              backfaceVisibility: "hidden",
              background: primary,
              boxShadow: opened ? "none" : `4px 4px 20px ${primary}20`,
            }}
          >
            {/* Subtle light gradient for paper feel */}
            <div
              className="absolute inset-0 rounded-r-lg"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.04) 100%)",
              }}
            />
            {/* Spine edge shadow */}
            <div
              className="absolute top-0 bottom-0 left-0 w-2"
              style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 100%)` }}
            />
          </div>

          {/* Back face (inside left page when opened) */}
          <div
            className="absolute inset-0 rounded-l-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `linear-gradient(135deg, ${bg} 0%, #fff 100%)`,
            }}
          />
        </div>

        {/* ── FRONT COVER LEFT HALF (the left side of the closed card) ── */}
        <div
          className="absolute top-0 left-0 rounded-l-lg overflow-hidden"
          style={{
            width: "50%",
            height: "100%",
            transformOrigin: "right center",
            transform: opened ? "rotateY(170deg)" : "rotateY(0deg)",
            transition: "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1) 0.05s",
            transformStyle: "preserve-3d",
            zIndex: 4,
          }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-l-lg"
            style={{
              backfaceVisibility: "hidden",
              background: primary,
              boxShadow: opened ? "none" : `-2px 4px 20px ${primary}15`,
            }}
          >
            <div
              className="absolute inset-0 rounded-l-lg"
              style={{
                background: "linear-gradient(215deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.04) 100%)",
              }}
            />
            {/* Spine edge shadow on right */}
            <div
              className="absolute top-0 bottom-0 right-0 w-2"
              style={{ background: `linear-gradient(270deg, rgba(0,0,0,0.1) 0%, transparent 100%)` }}
            />
          </div>

          {/* Back face (inside right page when opened) */}
          <div
            className="absolute inset-0 rounded-r-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `linear-gradient(225deg, ${bg} 0%, #fff 100%)`,
            }}
          />
        </div>

        {/* Center fold line (visible crease) */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{
            left: "calc(50% - 0.5px)",
            width: "1px",
            background: `linear-gradient(180deg, ${primary}30, ${primary}50, ${primary}30)`,
            opacity: opened ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}
