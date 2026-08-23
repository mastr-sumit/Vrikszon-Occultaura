"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MeteorsProps {
  number?: number;
  className?: string;
  minDuration?: number;
  maxDuration?: number;
}

interface MeteorStyle {
  top: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

/**
 * Meteors — 21st.dev Component Pattern
 *
 * Subtle celestial shooting stars / golden meteors for atmospheric background depth.
 */
export function Meteors({
  number = 15,
  className,
  minDuration = 3,
  maxDuration = 8,
}: MeteorsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [meteorStyles, setMeteorStyles] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const styles: MeteorStyle[] = Array.from({ length: number }).map(() => {
      const top = Math.floor(Math.random() * 80) - 20; // -20px to 60px
      const left = `${Math.floor(Math.random() * 100)}%`;
      const animationDelay = `${(Math.random() * 6).toFixed(2)}s`;
      const animationDuration = `${Math.floor(
        Math.random() * (maxDuration - minDuration) + minDuration
      )}s`;

      return { top, left, animationDelay, animationDuration };
    });

    setMeteorStyles(styles);
  }, [number, minDuration, maxDuration, shouldReduceMotion]);

  if (shouldReduceMotion || meteorStyles.length === 0) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteorStyles.map((style, idx) => (
        <span
          key={`meteor-${idx}`}
          style={{
            top: `${style.top}px`,
            left: style.left,
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration,
          }}
          className={cn(
            "animate-meteor absolute h-0.5 w-0.5 rounded-[9999px] bg-gold-400 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-gold-400 before:to-transparent",
            className
          )}
        />
      ))}
    </div>
  );
}
