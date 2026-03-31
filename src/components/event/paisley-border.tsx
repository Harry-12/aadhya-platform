"use client";

import { cn } from "@/lib/utils";

export function PaisleyBorder({ className, position = "top" }: { className?: string; position?: "top" | "bottom" }) {
  return (
    <div className={cn("w-full overflow-hidden pointer-events-none select-none", className)}>
      <svg
        viewBox="0 0 800 60"
        className={cn("w-full", position === "bottom" && "rotate-180")}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Left decorative line */}
        <line x1="80" y1="30" x2="340" y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        {/* Right decorative line */}
        <line x1="460" y1="30" x2="720" y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

        {/* Center floral/mandala ornament */}
        {/* Outer petals */}
        <ellipse cx="400" cy="30" rx="18" ry="8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
        <ellipse cx="400" cy="30" rx="8" ry="18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
        {/* Diagonal petals */}
        <ellipse cx="400" cy="30" rx="14" ry="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" transform="rotate(45 400 30)" />
        <ellipse cx="400" cy="30" rx="14" ry="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" transform="rotate(-45 400 30)" />
        {/* Center dot */}
        <circle cx="400" cy="30" r="3" fill="rgba(255,255,255,0.8)" />

        {/* Left side small ornaments */}
        <circle cx="120" cy="30" r="2.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="200" cy="30" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="280" cy="30" r="2.5" fill="rgba(255,255,255,0.5)" />
        {/* Left leaf shapes */}
        <path d="M155 30 Q165 22 175 30 Q165 38 155 30Z" fill="rgba(255,255,255,0.35)" />
        <path d="M235 30 Q245 22 255 30 Q245 38 235 30Z" fill="rgba(255,255,255,0.35)" />

        {/* Right side small ornaments */}
        <circle cx="520" cy="30" r="2.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="600" cy="30" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="680" cy="30" r="2.5" fill="rgba(255,255,255,0.5)" />
        {/* Right leaf shapes */}
        <path d="M545 30 Q555 22 565 30 Q555 38 545 30Z" fill="rgba(255,255,255,0.35)" />
        <path d="M625 30 Q635 22 645 30 Q635 38 625 30Z" fill="rgba(255,255,255,0.35)" />

        {/* End caps */}
        <path d="M75 25 Q80 30 75 35" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
        <path d="M725 25 Q720 30 725 35" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
