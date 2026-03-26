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

  const handleOpen = () => {
    setOpened(true);
    setTimeout(onOpen, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${primary}12 0%, ${bg} 40%, ${accent}10 100%)`,
      }}
    >
      {/* Large ambient glow behind envelope */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              background: i % 2 === 0 ? accent : primary,
              opacity: 0.25,
              left: `${8 + i * 7.5}%`,
              top: `${12 + (i % 4) * 22}%`,
              animationDelay: `${i * 0.35}s`,
              animationDuration: `${2.5 + (i % 3) * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center w-full px-4">
        {/* Top decorative text */}
        <p
          className="text-xs sm:text-sm uppercase tracking-[0.5em] font-medium mb-8 animate-fade-in"
          style={{ color: `${primary}50` }}
        >
          You have been invited
        </p>

        {/* Envelope — large and premium */}
        <div
          className={cn(
            "relative mx-auto cursor-pointer transition-transform duration-300 hover:scale-[1.03]",
            opened && "animate-envelope-open"
          )}
          style={{
            width: "min(580px, 90vw)",
            height: "min(380px, 55vw)",
          }}
          onClick={handleOpen}
        >
          {/* Envelope body */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #FFFEF9 0%, #FFF9EE 100%)",
              boxShadow: `0 30px 80px ${primary}12, 0 15px 40px ${primary}08, 0 0 0 1px ${accent}15`,
            }}
          >
            {/* Triple ornamental border */}
            <div
              className="absolute inset-3 sm:inset-4 rounded-2xl border"
              style={{ borderColor: `${accent}30` }}
            />
            <div
              className="absolute inset-5 sm:inset-6 rounded-xl border"
              style={{ borderColor: `${accent}18` }}
            />
            <div
              className="absolute inset-7 sm:inset-8 rounded-lg border border-dashed"
              style={{ borderColor: `${accent}12` }}
            />

            {/* Corner ornaments — larger */}
            {[
              "top-4 left-4 sm:top-5 sm:left-5",
              "top-4 right-4 sm:top-5 sm:right-5 rotate-90",
              "bottom-4 left-4 sm:bottom-5 sm:left-5 -rotate-90",
              "bottom-4 right-4 sm:bottom-5 sm:right-5 rotate-180",
            ].map((pos, i) => (
              <svg
                key={i}
                className={`absolute ${pos} w-8 h-8 sm:w-10 sm:h-10`}
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M4 4 Q20 4 20 12 Q20 4 36 4"
                  stroke={accent}
                  strokeWidth="0.8"
                  opacity="0.4"
                />
                <path
                  d="M4 4 Q4 20 12 20 Q4 20 4 36"
                  stroke={accent}
                  strokeWidth="0.8"
                  opacity="0.4"
                />
                <circle cx="4" cy="4" r="2" fill={accent} opacity="0.25" />
                <circle cx="12" cy="12" r="1" fill={accent} opacity="0.15" />
              </svg>
            ))}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 sm:p-14">
              {/* Small decorative divider above title */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px" style={{ background: `${accent}40` }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}50` }} />
                <div className="w-8 h-px" style={{ background: `${accent}40` }} />
              </div>

              <p
                className="text-[11px] sm:text-xs uppercase tracking-[0.4em] font-medium mb-4"
                style={{ color: `${primary}60` }}
              >
                You are cordially invited to
              </p>

              <h1
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center"
                style={{ color: primary }}
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  className="text-base sm:text-lg mt-3 font-light italic"
                  style={{ color: `${primary}80` }}
                >
                  {subtitle}
                </p>
              )}

              {/* Small decorative divider below */}
              <div className="flex items-center gap-2 mt-5">
                <div className="w-6 h-px" style={{ background: `${accent}30` }} />
                <div className="w-1 h-1 rounded-full" style={{ background: `${accent}40` }} />
                <div className="w-6 h-px" style={{ background: `${accent}30` }} />
              </div>
            </div>
          </div>

          {/* Envelope flap */}
          <div
            className={cn(
              "absolute -top-0.5 left-0 right-0 origin-top transition-transform duration-700",
              opened && "-scale-y-100"
            )}
            style={{ height: "45%" }}
          >
            <svg viewBox="0 0 580 170" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flapGrad" x1="0%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FFFEF9" />
                  <stop offset="100%" stopColor="#FFF6E8" />
                </linearGradient>
              </defs>
              <path
                d="M0 0 L290 145 L580 0 L580 0 L0 0Z"
                fill="url(#flapGrad)"
                stroke={accent}
                strokeWidth="0.5"
                opacity="0.95"
              />
              {/* Inner decorative V on flap */}
              <path
                d="M50 6 L290 125 L530 6"
                fill="none"
                stroke={accent}
                strokeWidth="0.4"
                opacity="0.3"
              />
              <path
                d="M90 8 L290 110 L490 8"
                fill="none"
                stroke={accent}
                strokeWidth="0.3"
                opacity="0.15"
              />
            </svg>
          </div>

          {/* Premium wax seal — larger */}
          <div
            className="absolute z-10"
            style={{
              left: "50%",
              top: "0",
              transform: "translate(-50%, -35%)",
            }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                width: "clamp(56px, 8vw, 72px)",
                height: "clamp(56px, 8vw, 72px)",
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, ${primary}EE, ${primary})`,
                boxShadow: `0 6px 20px ${primary}35, 0 2px 8px ${primary}25, inset 0 -3px 6px ${primary}50`,
              }}
            >
              {/* Seal rings */}
              <div
                className="absolute rounded-full border"
                style={{ inset: "4px", borderColor: `${accent}50` }}
              />
              <div
                className="absolute rounded-full border"
                style={{ inset: "8px", borderColor: `${accent}25` }}
              />
              {/* Tiny dots around seal */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: `${accent}40`,
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translate(clamp(22px, 3.5vw, 28px)) translate(-50%, -50%)`,
                  }}
                />
              ))}
              {/* Seal letter */}
              <span
                className="font-display font-bold relative z-10"
                style={{
                  color: accent,
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  letterSpacing: "0.05em",
                }}
              >
                FP
              </span>
            </div>
          </div>
        </div>

        {/* Bottom call to action */}
        <div className="mt-10 animate-pulse">
          <p
            className="text-sm sm:text-base font-medium"
            style={{ color: `${primary}50` }}
          >
            Tap to open your invitation
          </p>
        </div>
      </div>
    </div>
  );
}
