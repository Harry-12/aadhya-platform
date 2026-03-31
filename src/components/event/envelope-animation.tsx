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
  const [stage, setStage] = useState<"closed" | "opening" | "card-out">("closed");
  const primary = theme?.primary || "#8B1A1A";
  const accent = theme?.accent || "#D4A574";
  const bg = theme?.background || "#FFF8F0";

  const handleOpen = () => {
    if (stage !== "closed") return;
    setStage("opening");
    setTimeout(() => setStage("card-out"), 700);
    setTimeout(onOpen, 2500);
  };

  const monogram = title.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "FP";
  const isOpening = stage === "opening" || stage === "card-out";
  const cardOut = stage === "card-out";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${bg} 0%, ${primary}08 100%)`,
      }}
    >
      <div className="text-center w-full px-4">
        {/* Container for card + envelope stack */}
        <div
          className="relative mx-auto"
          style={{
            width: "min(380px, 88vw)",
            height: "min(500px, 120vw)",
          }}
        >
          {/* ─── INVITATION CARD (slides up from behind envelope) ─── */}
          <div
            className="absolute left-[8%] right-[8%] rounded-2xl overflow-hidden"
            style={{
              height: "min(260px, 60vw)",
              bottom: cardOut ? "calc(min(250px, 58vw) + 8%)" : "25%",
              background: bg,
              boxShadow: cardOut
                ? `0 -4px 30px ${primary}12, 0 8px 40px ${primary}08`
                : "none",
              zIndex: 1,
              opacity: cardOut ? 1 : 0,
              transition: "bottom 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
            }}
          >
            {/* Elegant border */}
            <div
              className="absolute inset-[10px] sm:inset-[14px] rounded-xl"
              style={{ border: `1px solid ${accent}35` }}
            />

            {/* Tiny corner diamonds */}
            {[
              { top: "10px", left: "10px" },
              { top: "10px", right: "10px" },
              { bottom: "10px", left: "10px" },
              { bottom: "10px", right: "10px" },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5"
                style={{
                  ...pos,
                  background: accent,
                  opacity: 0.25,
                  transform: "rotate(45deg)",
                } as React.CSSProperties}
              />
            ))}

            {/* Card text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 sm:px-12">
              {/* Decorative line */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-[0.5px]" style={{ background: `${accent}50` }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}40` }} />
                <div className="w-8 h-[0.5px]" style={{ background: `${accent}50` }} />
              </div>

              <p
                className="text-[9px] sm:text-[11px] uppercase tracking-[0.35em] font-medium mb-2"
                style={{ color: `${primary}60` }}
              >
                You are cordially invited
              </p>

              <h1
                className="font-display text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-center"
                style={{ color: primary }}
              >
                {title}
              </h1>

              {subtitle && (
                <p className="text-[11px] sm:text-sm mt-2 font-light italic" style={{ color: `${primary}70` }}>
                  {subtitle}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-[0.5px]" style={{ background: `${accent}40` }} />
                <div className="w-1 h-1 rounded-full" style={{ background: `${accent}35` }} />
                <div className="w-6 h-[0.5px]" style={{ background: `${accent}40` }} />
              </div>
            </div>
          </div>

          {/* ─── ENVELOPE ─── */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 cursor-pointer",
              stage === "closed" && "animate-envelope-enter",
              stage === "closed" && "animate-gentle-float hover:scale-[1.015] transition-transform duration-300"
            )}
            style={{
              height: "min(250px, 58vw)",
              zIndex: 5,
            }}
            onClick={handleOpen}
          >
            {/* Envelope shadow (separate for realistic effect) */}
            <div
              className="absolute -bottom-3 left-[5%] right-[5%] h-8 rounded-[50%]"
              style={{
                background: `radial-gradient(ellipse, ${primary}18 0%, transparent 70%)`,
                filter: "blur(8px)",
              }}
            />

            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden"
              style={{
                background: primary,
                boxShadow: `0 20px 50px ${primary}25`,
              }}
            >
              {/* Subtle texture/grain overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(175deg, rgba(255,255,255,0.08) 0%, transparent 30%, rgba(0,0,0,0.06) 100%)`,
                }}
              />

              {/* Inner lining (shows when flap opens) */}
              <div
                className="absolute top-0 left-0 right-0 rounded-t-xl sm:rounded-t-2xl overflow-hidden transition-opacity duration-700"
                style={{
                  height: "45%",
                  opacity: isOpening ? 1 : 0,
                }}
              >
                {/* Lining: elegant gradient pattern instead of drawn flowers */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${bg} 0%, ${accent}18 25%, ${bg} 50%, ${accent}18 75%, ${bg} 100%)`,
                  }}
                />
                {/* Ornamental border on lining */}
                <div className="absolute inset-2 rounded-lg" style={{ border: `0.5px solid ${accent}30` }} />
              </div>

              {/* Diagonal fold lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 250" fill="none" preserveAspectRatio="none">
                {/* Bottom front V-fold */}
                <path d="M0 250 L190 105 L380 250 Z" fill={primary} />
                {/* Slight lighter shade on front fold for depth */}
                <path d="M0 250 L190 105 L380 250 Z" fill="rgba(255,255,255,0.04)" />
                {/* Fold crease lines */}
                <path d="M0 250 L190 105 L380 250" stroke={`${accent}15`} strokeWidth="0.5" fill="none" />
                <path d="M0 0 L190 135" stroke={`${accent}08`} strokeWidth="0.3" />
                <path d="M380 0 L190 135" stroke={`${accent}08`} strokeWidth="0.3" />
              </svg>

              {/* "You are invited" text on envelope */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 animate-text-reveal"
                style={{ animationDelay: "0.8s", zIndex: 3 }}
              >
                <div className="text-center" style={{ marginTop: "-12%" }}>
                  <p
                    className="font-display text-lg sm:text-2xl italic font-light"
                    style={{ color: `${accent}BB` }}
                  >
                    You are invited!
                  </p>
                </div>
              </div>
            </div>

            {/* ─── TOP FLAP ─── */}
            <div
              className="absolute -top-px left-0 right-0 origin-top"
              style={{
                height: "54%",
                zIndex: isOpening ? 0 : 6,
                perspective: "1200px",
                pointerEvents: "none",
              }}
            >
              <div
                className="w-full h-full origin-top"
                style={{
                  transform: isOpening ? "rotateX(-180deg)" : "rotateX(0deg)",
                  transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                  backfaceVisibility: "hidden",
                }}
              >
                <svg viewBox="0 0 380 135" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flapG" x1="50%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stopColor={primary} />
                      <stop offset="80%" stopColor={primary} stopOpacity="0.92" />
                    </linearGradient>
                  </defs>
                  <path d="M0 0 L380 0 L190 128 Z" fill="url(#flapG)" />
                  <path d="M2 1 L190 126 L378 1" stroke={`${accent}12`} strokeWidth="0.4" fill="none" />
                </svg>
              </div>
            </div>

            {/* ─── WAX SEAL (gold) ─── */}
            <div
              className="absolute transition-all duration-500"
              style={{
                left: "50%",
                top: 0,
                transform: `translate(-50%, -42%) scale(${isOpening ? 0 : 1})`,
                opacity: isOpening ? 0 : 1,
                zIndex: 20,
              }}
            >
              <div
                className={cn(stage === "closed" && "animate-seal-glow")}
                style={{
                  width: "clamp(52px, 8vw, 68px)",
                  height: "clamp(52px, 8vw, 68px)",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 36% 36%, #EDD48E, #C9A24D, #9E7A2A)",
                  boxShadow: "0 5px 20px rgba(170, 130, 40, 0.45), inset 0 1px 3px rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Inner rings */}
                <div className="absolute rounded-full" style={{ inset: "4px", border: "1px solid rgba(255,255,255,0.22)" }} />
                <div className="absolute rounded-full" style={{ inset: "8px", border: "0.5px solid rgba(255,255,255,0.1)" }} />

                {/* Scalloped edge dots */}
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: "2.5px",
                      height: "2.5px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.12)",
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 22.5}deg) translate(clamp(21px, 3.4vw, 28px)) translate(-50%, -50%)`,
                    }}
                  />
                ))}

                {/* Monogram */}
                <span
                  className="font-display font-bold relative z-10"
                  style={{
                    color: "#FFF5D6",
                    fontSize: "clamp(16px, 2.3vw, 22px)",
                    letterSpacing: "0.06em",
                    textShadow: "0 1px 2px rgba(100,70,10,0.35)",
                  }}
                >
                  {monogram}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA text */}
        <div className="opacity-0 animate-text-reveal" style={{ animationDelay: "1.4s", marginTop: "12px" }}>
          <p
            className="text-[11px] sm:text-sm tracking-widest uppercase font-medium"
            style={{ color: `${primary}45` }}
          >
            <span className="animate-pulse inline-block">Click to open</span>
          </p>
        </div>
      </div>
    </div>
  );
}
