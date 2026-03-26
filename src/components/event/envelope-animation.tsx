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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: `radial-gradient(ellipse at center, ${bg} 0%, ${primary}08 100%)`,
      }}
    >
      {/* Subtle decorative sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              background: accent,
              opacity: 0.3,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center">
        {/* Envelope */}
        <div
          className={cn(
            "relative w-80 sm:w-96 h-56 sm:h-64 mx-auto cursor-pointer transition-transform duration-300 hover:scale-105",
            opened && "animate-envelope-open"
          )}
          onClick={handleOpen}
        >
          {/* Envelope body with premium shadow */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              background: "#FFFDF8",
              boxShadow: `0 20px 60px ${primary}15, 0 8px 25px ${primary}10`,
            }}
          >
            {/* Ornamental border - double frame */}
            <div
              className="absolute inset-2.5 rounded-xl border"
              style={{ borderColor: `${accent}40` }}
            />
            <div
              className="absolute inset-4 rounded-lg border"
              style={{ borderColor: `${accent}20` }}
            />

            {/* Corner ornaments */}
            {[
              "top-3 left-3",
              "top-3 right-3 rotate-90",
              "bottom-3 left-3 -rotate-90",
              "bottom-3 right-3 rotate-180",
            ].map((pos, i) => (
              <svg
                key={i}
                className={`absolute ${pos} w-6 h-6`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 2C2 2 8 2 12 6C16 2 22 2 22 2"
                  stroke={accent}
                  strokeWidth="0.8"
                  opacity="0.5"
                />
                <circle cx="2" cy="2" r="1.5" fill={accent} opacity="0.3" />
              </svg>
            ))}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <p
                className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3"
                style={{ color: `${primary}80` }}
              >
                You are invited
              </p>
              <p
                className="font-display text-xl sm:text-2xl font-bold leading-tight text-center"
                style={{ color: primary }}
              >
                {title}
              </p>
              {subtitle && (
                <p
                  className="text-sm mt-2 font-light"
                  style={{ color: `${primary}99` }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Envelope flap */}
          <div
            className={cn(
              "absolute -top-0.5 left-0 right-0 h-28 sm:h-32 origin-top transition-transform duration-700",
              opened && "-scale-y-100"
            )}
          >
            <svg viewBox="0 0 384 128" className="w-full h-full drop-shadow-sm">
              <defs>
                <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFDF8" />
                  <stop offset="100%" stopColor="#FFF9EE" />
                </linearGradient>
              </defs>
              <path
                d="M0 0 L192 108 L384 0 L384 0 L0 0Z"
                fill="url(#flapGrad)"
                stroke={accent}
                strokeWidth="0.5"
                opacity="0.9"
              />
              {/* Decorative line on flap */}
              <path
                d="M40 4 L192 88 L344 4"
                fill="none"
                stroke={accent}
                strokeWidth="0.3"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* Premium wax seal */}
          <div
            className="absolute z-10"
            style={{
              left: "50%",
              top: "0",
              transform: "translate(-50%, -30%)",
            }}
          >
            <div
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${primary}DD, ${primary})`,
                boxShadow: `0 4px 12px ${primary}40, inset 0 -2px 4px ${primary}40`,
              }}
            >
              {/* Seal ring */}
              <div
                className="absolute inset-1.5 rounded-full border"
                style={{ borderColor: `${accent}60` }}
              />
              <div
                className="absolute inset-2.5 rounded-full border"
                style={{ borderColor: `${accent}30` }}
              />
              {/* Seal letter */}
              <span
                className="font-display text-lg sm:text-xl font-bold relative z-10"
                style={{ color: accent }}
              >
                FP
              </span>
            </div>
          </div>
        </div>

        <p
          className="mt-8 text-sm animate-pulse font-medium"
          style={{ color: `${primary}60` }}
        >
          Tap to open your invitation
        </p>
      </div>
    </div>
  );
}
