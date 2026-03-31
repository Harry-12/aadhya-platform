"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface EnvelopeAnimationProps {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  theme?: { primary: string; accent: string; background: string };
}

export function EnvelopeAnimation({ title, subtitle, onOpen, theme }: EnvelopeAnimationProps) {
  const [opened, setOpened] = useState(false);
  const primary = theme?.primary || "#8B1A1A";
  const accent = theme?.accent || "#D4A574";
  const bg = theme?.background || "#FFF8F0";

  // Derive lighter/darker shades from primary for envelope body
  const envelopeColor = primary;
  const envelopeDark = `${primary}DD`;
  const envelopeLight = `${primary}BB`;
  const innerLining = bg;

  const handleOpen = () => {
    setOpened(true);
    setTimeout(onOpen, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${primary}18 0%, ${bg} 40%, ${accent}15 100%)`,
      }}
    >
      {/* Subtle background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-sparkle-twinkle"
            style={{
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              background: i % 2 === 0 ? `${accent}80` : `${primary}40`,
              left: `${8 + i * 7.5}%`,
              top: `${12 + (i % 5) * 17}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2.5 + (i % 3) * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Top text */}
      <div className="text-center w-full px-4">
        <p
          className="text-[10px] sm:text-xs uppercase tracking-[0.45em] font-medium mb-6 sm:mb-8 opacity-0 animate-text-reveal"
          style={{ color: `${primary}60` }}
        >
          You have been invited
        </p>

        {/* Envelope container */}
        <div
          className={cn(
            "relative mx-auto cursor-pointer animate-envelope-enter",
            !opened && "hover:scale-[1.02] transition-transform duration-300",
            !opened && "animate-gentle-float",
            opened && "pointer-events-none"
          )}
          style={{
            width: "min(360px, 85vw)",
            height: "min(260px, 62vw)",
          }}
          onClick={!opened ? handleOpen : undefined}
        >
          {/* === ENVELOPE BACK (bottom layer) === */}
          <div
            className="absolute inset-0 rounded-b-2xl rounded-t-sm"
            style={{
              background: `linear-gradient(180deg, ${envelopeColor} 0%, ${envelopeDark} 100%)`,
              boxShadow: `0 20px 60px ${primary}30, 0 8px 24px ${primary}18`,
            }}
          />

          {/* === INNER LINING visible when flap opens === */}
          <div
            className="absolute rounded-t-sm overflow-hidden"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: innerLining,
            }}
          >
            {/* Decorative floral/botanical SVG pattern inside */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              viewBox="0 0 360 130"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Center floral motif */}
              <g transform="translate(180, 65)" opacity="0.6">
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="0"
                    cy="-18"
                    rx="8"
                    ry="18"
                    fill={accent}
                    opacity="0.4"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle cx="0" cy="0" r="6" fill={accent} opacity="0.6" />
              </g>
              {/* Left branch */}
              <g transform="translate(60, 80)" opacity="0.4">
                <path d="M0 0 Q20 -30 50 -20" stroke={accent} strokeWidth="1.5" fill="none" />
                <ellipse cx="50" cy="-20" rx="6" ry="10" fill={accent} opacity="0.3" transform="rotate(-30, 50, -20)" />
                <path d="M15 -12 Q25 -35 40 -35" stroke={accent} strokeWidth="1" fill="none" />
                <ellipse cx="40" cy="-35" rx="5" ry="8" fill={accent} opacity="0.25" transform="rotate(-15, 40, -35)" />
              </g>
              {/* Right branch (mirrored) */}
              <g transform="translate(300, 80) scale(-1, 1)" opacity="0.4">
                <path d="M0 0 Q20 -30 50 -20" stroke={accent} strokeWidth="1.5" fill="none" />
                <ellipse cx="50" cy="-20" rx="6" ry="10" fill={accent} opacity="0.3" transform="rotate(-30, 50, -20)" />
                <path d="M15 -12 Q25 -35 40 -35" stroke={accent} strokeWidth="1" fill="none" />
                <ellipse cx="40" cy="-35" rx="5" ry="8" fill={accent} opacity="0.25" transform="rotate(-15, 40, -35)" />
              </g>
              {/* Small scattered leaves */}
              {[
                { x: 90, y: 30, r: 20 },
                { x: 270, y: 25, r: -25 },
                { x: 130, y: 100, r: 45 },
                { x: 230, y: 95, r: -40 },
              ].map((leaf, i) => (
                <ellipse
                  key={i}
                  cx={leaf.x}
                  cy={leaf.y}
                  rx="4"
                  ry="9"
                  fill={accent}
                  opacity="0.2"
                  transform={`rotate(${leaf.r}, ${leaf.x}, ${leaf.y})`}
                />
              ))}
            </svg>
          </div>

          {/* === INVITATION CARD (slides up when opened) === */}
          <div
            className={cn(
              "absolute left-[8%] right-[8%] rounded-xl transition-all overflow-hidden",
              opened ? "animate-card-slide-up" : ""
            )}
            style={{
              top: "8%",
              bottom: "8%",
              background: `linear-gradient(170deg, ${bg} 0%, #FFFFFF 50%, ${bg} 100%)`,
              boxShadow: `0 4px 20px ${primary}10`,
              zIndex: 2,
            }}
          >
            {/* Card inner border */}
            <div
              className="absolute inset-2 sm:inset-3 rounded-lg border"
              style={{ borderColor: `${accent}30` }}
            />
            <div
              className="absolute inset-3 sm:inset-4 rounded-md border border-dashed"
              style={{ borderColor: `${accent}18` }}
            />

            {/* Corner ornaments */}
            {[
              "top-2.5 left-2.5 sm:top-3.5 sm:left-3.5",
              "top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 rotate-90",
              "bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 -rotate-90",
              "bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 rotate-180",
            ].map((pos, i) => (
              <svg
                key={i}
                className={`absolute ${pos} w-5 h-5 sm:w-6 sm:h-6`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M2 2 Q12 2 12 8 Q12 2 22 2" stroke={accent} strokeWidth="0.8" opacity="0.5" />
                <path d="M2 2 Q2 12 8 12 Q2 12 2 22" stroke={accent} strokeWidth="0.8" opacity="0.5" />
                <circle cx="2" cy="2" r="1.5" fill={accent} opacity="0.3" />
              </svg>
            ))}

            {/* Card content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-10 py-4 sm:py-6">
              {/* Top divider */}
              <div className="flex items-center gap-1.5 mb-2 sm:mb-3 opacity-0 animate-text-reveal" style={{ animationDelay: "0.8s" }}>
                <div className="w-6 sm:w-8 h-px" style={{ background: `${accent}40` }} />
                <div className="w-1 h-1 rounded-full" style={{ background: `${accent}50` }} />
                <div className="w-6 sm:w-8 h-px" style={{ background: `${accent}40` }} />
              </div>

              <p
                className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium mb-1.5 sm:mb-2 opacity-0 animate-text-reveal"
                style={{ color: `${primary}60`, animationDelay: "0.9s" }}
              >
                You are cordially invited to
              </p>

              <h1
                className="font-display text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-center opacity-0 animate-text-reveal"
                style={{ color: primary, animationDelay: "1.0s" }}
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  className="text-xs sm:text-sm mt-1.5 sm:mt-2 font-light italic opacity-0 animate-text-reveal"
                  style={{ color: `${primary}80`, animationDelay: "1.2s" }}
                >
                  {subtitle}
                </p>
              )}

              {/* Bottom divider */}
              <div className="flex items-center gap-1.5 mt-2 sm:mt-3 opacity-0 animate-text-reveal" style={{ animationDelay: "1.3s" }}>
                <div className="w-5 sm:w-6 h-px" style={{ background: `${accent}30` }} />
                <div className="w-1 h-1 rounded-full" style={{ background: `${accent}40` }} />
                <div className="w-5 sm:w-6 h-px" style={{ background: `${accent}30` }} />
              </div>
            </div>
          </div>

          {/* === LEFT FOLD of envelope === */}
          <div
            className="absolute bottom-0 left-0"
            style={{
              width: "50%",
              height: "100%",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 180 260" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="leftFold" x1="100%" y1="50%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor={envelopeColor} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={envelopeDark} stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M0 0 L0 260 L180 130 Z" fill="url(#leftFold)" />
              {/* Fold shadow line */}
              <path d="M0 0 L180 130 L0 260" fill="none" stroke={`${primary}30`} strokeWidth="0.5" />
            </svg>
          </div>

          {/* === RIGHT FOLD of envelope === */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: "50%",
              height: "100%",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 180 260" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rightFold" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor={envelopeColor} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={envelopeDark} stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M180 0 L180 260 L0 130 Z" fill="url(#rightFold)" />
              <path d="M180 0 L0 130 L180 260" fill="none" stroke={`${primary}30`} strokeWidth="0.5" />
            </svg>
          </div>

          {/* === BOTTOM FOLD (front of envelope) === */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "55%",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 360 143" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bottomFold" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor={envelopeLight} />
                  <stop offset="100%" stopColor={envelopeColor} />
                </linearGradient>
              </defs>
              <path d="M0 0 L180 130 L360 0 L360 143 L0 143 Z" fill="url(#bottomFold)" />
              {/* Fold line */}
              <path d="M0 0 L180 130 L360 0" fill="none" stroke={`${primary}40`} strokeWidth="0.5" />
            </svg>
          </div>

          {/* === TOP FLAP (opens on click) === */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 origin-top",
              opened ? "animate-flap-open" : ""
            )}
            style={{
              height: "55%",
              zIndex: opened ? 6 : 5,
              pointerEvents: "none",
              transformStyle: "preserve-3d",
              perspective: "800px",
            }}
          >
            <div
              className={cn(
                "w-full h-full origin-top",
                opened ? "animate-flap-open" : ""
              )}
            >
              <svg viewBox="0 0 360 143" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="topFlap" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor={envelopeColor} />
                    <stop offset="100%" stopColor={envelopeDark} />
                  </linearGradient>
                </defs>
                <path d="M0 0 L360 0 L180 130 Z" fill="url(#topFlap)" />
                {/* Inner fold lines for depth */}
                <path d="M30 5 L180 110 L330 5" fill="none" stroke={`${primary}30`} strokeWidth="0.4" />
                <path d="M60 8 L180 95 L300 8" fill="none" stroke={`${primary}15`} strokeWidth="0.3" />
              </svg>
            </div>
          </div>

          {/* === WAX SEAL (on top of bottom fold) === */}
          <div
            className={cn(
              "absolute z-10",
              opened ? "animate-seal-fade" : "animate-seal-glow"
            )}
            style={{
              left: "50%",
              bottom: "40%",
              transform: "translate(-50%, 50%)",
              zIndex: 7,
            }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                width: "clamp(44px, 7vw, 58px)",
                height: "clamp(44px, 7vw, 58px)",
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, ${primary}EE, ${primary})`,
                boxShadow: `0 3px 12px ${primary}40`,
              }}
            >
              {/* Seal rings */}
              <div className="absolute rounded-full border" style={{ inset: "3px", borderColor: `${accent}50` }} />
              <div className="absolute rounded-full border" style={{ inset: "6px", borderColor: `${accent}25` }} />
              {/* Dots around seal */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full"
                  style={{
                    background: `${accent}40`,
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translate(clamp(17px, 2.8vw, 23px)) translate(-50%, -50%)`,
                  }}
                />
              ))}
              {/* Seal monogram */}
              <span
                className="font-display font-bold relative z-10"
                style={{
                  color: accent,
                  fontSize: "clamp(14px, 2vw, 18px)",
                  letterSpacing: "0.05em",
                }}
              >
                {title.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "FP"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom call to action */}
        <div className="mt-8 sm:mt-10 opacity-0 animate-text-reveal" style={{ animationDelay: "1.6s" }}>
          <p
            className="text-xs sm:text-sm font-medium animate-pulse"
            style={{ color: `${primary}60` }}
          >
            Tap the envelope to open
          </p>
        </div>
      </div>
    </div>
  );
}
