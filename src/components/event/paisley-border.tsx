"use client";

import { cn } from "@/lib/utils";

export function PaisleyBorder({ className, position = "top" }: { className?: string; position?: "top" | "bottom" }) {
  return (
    <div className={cn("w-full overflow-hidden pointer-events-none select-none", className)}>
      <svg
        viewBox="0 0 1200 80"
        className={cn("w-full", position === "bottom" && "rotate-180")}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`paisleyGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A574" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8B1A1A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Center ornament */}
        <path
          d="M580 40 c0-15 10-28 20-28 s20 13 20 28 s-10 28-20 28 s-20-13-20-28"
          fill="none"
          stroke={`url(#paisleyGrad-${position})`}
          strokeWidth="1.5"
        />
        {/* Swirl decorations */}
        <path
          d="M540 40 Q555 20 570 40 Q555 60 540 40"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M630 40 Q645 20 660 40 Q645 60 630 40"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1"
          opacity="0.4"
        />
        {/* Extending lines */}
        <line x1="100" y1="40" x2="520" y2="40" stroke="#D4A574" strokeWidth="0.5" opacity="0.3" />
        <line x1="680" y1="40" x2="1100" y2="40" stroke="#D4A574" strokeWidth="0.5" opacity="0.3" />
        {/* Dots */}
        {[150, 250, 350, 450, 750, 850, 950, 1050].map((x) => (
          <circle key={x} cx={x} cy="40" r="2" fill="#D4A574" opacity="0.3" />
        ))}
      </svg>
    </div>
  );
}
