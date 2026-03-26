"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/utils";

interface CountdownTimerProps {
  date: string;
  time?: string;
  theme?: { primary: string; accent: string };
}

export function CountdownTimer({ date, time = "10:00 AM", theme }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown(date, time));
  const primary = theme?.primary || "#8B1A1A";
  const accent = theme?.accent || "#D4A574";

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown(date, time)), 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  if (countdown.isPast) {
    return (
      <div className="text-center py-4">
        <p className="font-display text-xl font-semibold" style={{ color: primary }}>
          The celebration has begun!
        </p>
      </div>
    );
  }

  const units = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-5">
      {units.map((unit, i) => (
        <div key={unit.label} className="text-center">
          <div
            className="w-18 sm:w-22 h-18 sm:h-22 rounded-2xl backdrop-blur flex items-center justify-center relative overflow-hidden"
            style={{
              width: "4.5rem",
              height: "4.5rem",
              background: "rgba(255,255,255,0.85)",
              boxShadow: `0 4px 20px ${primary}10, 0 1px 3px ${primary}08`,
              border: `1px solid ${accent}20`,
            }}
          >
            {/* Subtle top shine */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2"
              style={{ background: `linear-gradient(to bottom, ${accent}08, transparent)` }}
            />
            <span
              className="font-display text-2xl sm:text-3xl font-bold relative z-10"
              style={{ color: primary }}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <p
            className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: `${primary}80` }}
          >
            {unit.label}
          </p>
          {i < units.length - 1 && (
            <span
              className="hidden sm:inline-block absolute"
              style={{ color: `${accent}60` }}
            >
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
