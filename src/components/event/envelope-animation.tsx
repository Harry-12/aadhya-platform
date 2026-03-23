"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface EnvelopeAnimationProps {
  title: string;
  subtitle?: string;
  onOpen: () => void;
}

export function EnvelopeAnimation({ title, subtitle, onOpen }: EnvelopeAnimationProps) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(onOpen, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream">
      <div className="text-center">
        {/* Envelope */}
        <div
          className={cn(
            "relative w-72 h-48 mx-auto cursor-pointer transition-transform duration-300 hover:scale-105",
            opened && "animate-envelope-open"
          )}
          onClick={handleOpen}
        >
          {/* Envelope body */}
          <div className="absolute inset-0 bg-white rounded-xl shadow-xl border border-gold/20 overflow-hidden">
            {/* Gold trim */}
            <div className="absolute inset-2 border border-gold/30 rounded-lg" />
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <p className="font-display text-lg text-burgundy font-semibold">{title}</p>
              {subtitle && <p className="text-sm text-gold-muted mt-1">{subtitle}</p>}
            </div>
          </div>
          {/* Envelope flap */}
          <div
            className={cn(
              "absolute -top-0.5 left-0 right-0 h-24 origin-top transition-transform duration-700",
              opened && "-scale-y-100"
            )}
          >
            <svg viewBox="0 0 288 96" className="w-full h-full">
              <path
                d="M0 0 L144 80 L288 0 L288 0 L0 0Z"
                fill="white"
                stroke="#D4A574"
                strokeWidth="0.5"
                opacity="0.8"
              />
              {/* Wax seal */}
              <circle cx="144" cy="50" r="16" fill="#8B1A1A" />
              <circle cx="144" cy="50" r="12" fill="none" stroke="#D4A574" strokeWidth="1" />
              <text
                x="144"
                y="55"
                textAnchor="middle"
                fill="#D4A574"
                fontSize="14"
                fontFamily="Playfair Display, serif"
              >
                A
              </text>
            </svg>
          </div>
        </div>
        <p className="mt-6 text-charcoal-muted text-sm animate-pulse">Tap to open your invitation</p>
      </div>
    </div>
  );
}
