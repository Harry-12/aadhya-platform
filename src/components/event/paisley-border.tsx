"use client";

import { cn } from "@/lib/utils";

export function PaisleyBorder({ className, position = "top" }: { className?: string; position?: "top" | "bottom" }) {
  return (
    <div className={cn("w-full overflow-hidden pointer-events-none select-none flex justify-center", className)}>
      <svg
        width="280"
        height="30"
        viewBox="0 0 280 30"
        className={cn(position === "bottom" && "rotate-180")}
      >
        {/* Left line */}
        <line x1="0" y1="15" x2="105" y2="15" stroke="white" strokeWidth="0.8" opacity="0.5" />
        {/* Right line */}
        <line x1="175" y1="15" x2="280" y2="15" stroke="white" strokeWidth="0.8" opacity="0.5" />

        {/* Center paisley/leaf ornament */}
        <path
          d="M130 15 Q140 5 150 15 Q140 25 130 15"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <path
          d="M140 7 Q140 15 140 23"
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          opacity="0.5"
        />

        {/* Small dots */}
        <circle cx="40" cy="15" r="1.5" fill="white" opacity="0.5" />
        <circle cx="75" cy="15" r="1.5" fill="white" opacity="0.5" />
        <circle cx="205" cy="15" r="1.5" fill="white" opacity="0.5" />
        <circle cx="240" cy="15" r="1.5" fill="white" opacity="0.5" />
      </svg>
    </div>
  );
}
