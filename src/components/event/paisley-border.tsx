"use client";

import { cn } from "@/lib/utils";

export function PaisleyBorder({ className, position = "top" }: { className?: string; position?: "top" | "bottom" }) {
  return (
    <div className={cn("w-full overflow-hidden pointer-events-none select-none flex justify-center", className)}>
      <svg
        width="300"
        height="40"
        viewBox="0 0 300 40"
        className={cn(position === "bottom" && "rotate-180")}
      >
        {/* Left line */}
        <line x1="0" y1="20" x2="110" y2="20" stroke="white" strokeWidth="1" opacity="0.6" />
        {/* Right line */}
        <line x1="190" y1="20" x2="300" y2="20" stroke="white" strokeWidth="1" opacity="0.6" />

        {/* Center diamond ornament */}
        <rect x="141" y="11" width="18" height="18" rx="2" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" transform="rotate(45 150 20)" />
        <circle cx="150" cy="20" r="3" fill="white" opacity="0.8" />

        {/* Small diamonds on left */}
        <rect x="71" y="16" width="8" height="8" fill="none" stroke="white" strokeWidth="1" opacity="0.5" transform="rotate(45 75 20)" />
        <rect x="36" y="17.5" width="5" height="5" fill="white" opacity="0.4" transform="rotate(45 38.5 20)" />

        {/* Small diamonds on right */}
        <rect x="221" y="16" width="8" height="8" fill="none" stroke="white" strokeWidth="1" opacity="0.5" transform="rotate(45 225 20)" />
        <rect x="259" y="17.5" width="5" height="5" fill="white" opacity="0.4" transform="rotate(45 261.5 20)" />
      </svg>
    </div>
  );
}
