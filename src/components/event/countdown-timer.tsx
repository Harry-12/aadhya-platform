"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/utils";

interface CountdownTimerProps {
  date: string;
  time?: string;
}

export function CountdownTimer({ date, time = "10:00 AM" }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown(date, time));

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown(date, time)), 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  if (countdown.isPast) {
    return (
      <div className="text-center py-4">
        <p className="text-burgundy font-display text-xl font-semibold">The celebration has begun!</p>
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
    <div className="flex justify-center gap-3 sm:gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-white/80 backdrop-blur border border-gold/20 shadow-sm flex items-center justify-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-burgundy">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-charcoal-muted font-medium uppercase tracking-wider">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
