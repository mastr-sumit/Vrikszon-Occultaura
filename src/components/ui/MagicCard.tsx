"use client";

import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  borderGlow?: boolean;
}

/**
 * MagicCard — 21st.dev Component Pattern
 *
 * Interactive card with a mouse-following spotlight / radial gradient glow.
 * Creates an exquisite cosmic luminescence beneath the user's cursor.
 */
export function MagicCard({
  children,
  className,
  gradientSize = 350,
  gradientColor = "rgba(212, 175, 55, 0.15)", // Subtle gold glow
  gradientOpacity = 0.8,
  borderGlow = true,
  ...props
}: MagicCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setOpacity(gradientOpacity);
    },
    [shouldReduceMotion, gradientOpacity]
  );

  const handleMouseEnter = useCallback(() => {
    if (!shouldReduceMotion) setOpacity(gradientOpacity);
  }, [shouldReduceMotion, gradientOpacity]);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gold-500/20 bg-navy-950/70 p-6 sm:p-8 transition-all duration-300",
        borderGlow && "hover:border-gold-500/50 hover:shadow-gold-glow",
        className
      )}
      {...props}
    >
      {/* Mouse spotlight gradient */}
      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(${gradientSize}px circle at ${position.x}px ${position.y}px, ${gradientColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
