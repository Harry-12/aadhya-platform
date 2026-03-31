"use client";

import { useState, useEffect } from "react";

interface EnvelopeAnimationProps {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  theme?: { primary: string; accent: string; background: string };
}

export function EnvelopeAnimation({ title, subtitle, onOpen, theme }: EnvelopeAnimationProps) {
  const [flipped, setFlipped] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [entered, setEntered] = useState(false);
  const primary = theme?.primary || "#8B1A1A";
  const accent = theme?.accent || "#D4A574";
  const bg = theme?.background || "#FFF8F0";

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    if (flipped) return;
    setFlipped(true);
    setTimeout(() => setShowContent(true), 600);
    setTimeout(onOpen, 2200);
  };

  const monogram = title.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "FP";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
      style={{
        background: `radial-gradient(ellipse at 50% 45%, ${bg} 0%, ${primary}0A 100%)`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: "600px",
          maxHeight: "600px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${accent}0D 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <div className="text-center w-full px-6">
        {/* Card flip container */}
        <div
          className="relative mx-auto cursor-pointer"
          style={{
            width: "min(400px, 85vw)",
            height: "min(540px, 115vw)",
            perspective: "1200px",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          onClick={handleOpen}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* ═══════════ FRONT OF CARD (the "envelope") ═══════════ */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                background: primary,
                boxShadow: `0 30px 80px ${primary}25, 0 10px 30px ${primary}15`,
              }}
            >
              {/* Gradient overlay for depth */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(165deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)`,
                }}
              />

              {/* Decorative top pattern band */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{
                  background: `repeating-linear-gradient(90deg, ${accent}40 0px, ${accent}40 8px, transparent 8px, transparent 16px)`,
                }}
              />

              {/* Decorative bottom pattern band */}
              <div
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{
                  background: `repeating-linear-gradient(90deg, ${accent}40 0px, ${accent}40 8px, transparent 8px, transparent 16px)`,
                }}
              />

              {/* Inner border frame */}
              <div
                className="absolute rounded-2xl"
                style={{
                  inset: "20px",
                  border: `1px solid ${accent}30`,
                }}
              />

              {/* Second inner border */}
              <div
                className="absolute rounded-xl"
                style={{
                  inset: "28px",
                  border: `0.5px solid ${accent}18`,
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-12 sm:px-16">
                {/* Top ornament */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 max-w-[60px]" style={{ background: `${accent}50` }} />
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="6" y="0" width="6" height="6" transform="rotate(45, 6, 3)" fill={accent} opacity="0.4" />
                  </svg>
                  <div className="h-px flex-1 max-w-[60px]" style={{ background: `${accent}50` }} />
                </div>

                {/* Wax seal / monogram circle */}
                <div
                  className="relative mb-8"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 40% 38%, #EDD48E, #C9A24D, #A07B28)`,
                    boxShadow: `0 6px 24px rgba(160,120,30,0.4), inset 0 2px 4px rgba(255,255,255,0.2)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="absolute rounded-full" style={{ inset: "5px", border: "1px solid rgba(255,255,255,0.2)" }} />
                  <div className="absolute rounded-full" style={{ inset: "9px", border: "0.5px solid rgba(255,255,255,0.1)" }} />
                  <span
                    className="font-display font-bold text-2xl relative z-10"
                    style={{
                      color: "#FFF5D6",
                      letterSpacing: "0.08em",
                      textShadow: "0 1px 3px rgba(100,70,10,0.3)",
                    }}
                  >
                    {monogram}
                  </span>
                </div>

                {/* Main text */}
                <p
                  className="font-display text-2xl sm:text-3xl italic font-light mb-3"
                  style={{ color: `${accent}DD` }}
                >
                  You are invited!
                </p>

                <p
                  className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium"
                  style={{ color: `${accent}70` }}
                >
                  Tap to reveal
                </p>

                {/* Bottom ornament */}
                <div className="flex items-center gap-3 mt-8">
                  <div className="h-px flex-1 max-w-[60px]" style={{ background: `${accent}50` }} />
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="6" y="0" width="6" height="6" transform="rotate(45, 6, 3)" fill={accent} opacity="0.4" />
                  </svg>
                  <div className="h-px flex-1 max-w-[60px]" style={{ background: `${accent}50` }} />
                </div>
              </div>
            </div>

            {/* ═══════════ BACK OF CARD (the invitation) ═══════════ */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: bg,
                boxShadow: `0 30px 80px ${primary}20, 0 10px 30px ${primary}10`,
              }}
            >
              {/* Top colored accent bar */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: "6px",
                  background: `linear-gradient(90deg, ${primary}, ${accent}, ${primary})`,
                }}
              />

              {/* Bottom colored accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: "6px",
                  background: `linear-gradient(90deg, ${primary}, ${accent}, ${primary})`,
                }}
              />

              {/* Border frame */}
              <div
                className="absolute rounded-2xl"
                style={{
                  inset: "18px",
                  border: `1px solid ${accent}28`,
                }}
              />

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center px-10 sm:px-14"
                style={{
                  opacity: showContent ? 1 : 0,
                  transform: showContent ? "scale(1)" : "scale(0.95)",
                  transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                }}
              >
                {/* Top ornament */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-px" style={{ background: `${accent}45` }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}50` }} />
                  <div className="w-10 h-px" style={{ background: `${accent}45` }} />
                </div>

                <p
                  className="text-[9px] sm:text-[11px] uppercase tracking-[0.4em] font-medium mb-4"
                  style={{ color: `${primary}55` }}
                >
                  You are cordially invited to
                </p>

                {/* Title */}
                <h1
                  className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-center mb-3"
                  style={{ color: primary }}
                >
                  {title}
                </h1>

                {subtitle && (
                  <p
                    className="text-sm sm:text-base font-light italic mb-4"
                    style={{ color: `${primary}75` }}
                  >
                    {subtitle}
                  </p>
                )}

                {/* Decorative divider */}
                <div className="flex items-center gap-3 mt-2 mb-6">
                  <div className="w-8 h-px" style={{ background: `${accent}35` }} />
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="8" y="0" width="7" height="7" transform="rotate(45, 8, 3.5)" fill={accent} opacity="0.3" />
                  </svg>
                  <div className="w-8 h-px" style={{ background: `${accent}35` }} />
                </div>

                {/* Monogram on the back too */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: `1.5px solid ${accent}35`,
                  }}
                >
                  <span
                    className="font-display font-semibold text-sm"
                    style={{ color: `${primary}60`, letterSpacing: "0.1em" }}
                  >
                    {monogram}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
