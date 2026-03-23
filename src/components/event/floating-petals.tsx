"use client";

import { useEffect, useState } from "react";

const PETAL_COLORS = ["#D4A574", "#8B1A1A", "#C49A6C", "#E8D5B7", "#A52A2A"];

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotation: number;
}

export function FloatingPetals({ count = 12 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 12,
        size: 6 + Math.random() * 10,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        rotation: Math.random() * 360,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float-down"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 10 13"
            style={{ transform: `rotate(${p.rotation}deg)` }}
          >
            <ellipse cx="5" cy="6.5" rx="4" ry="6" fill={p.color} opacity="0.15" />
          </svg>
        </div>
      ))}
    </div>
  );
}
