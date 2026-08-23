"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
  gap?: string;
}

/**
 * Marquee — 21st.dev Component Pattern
 *
 * Smooth infinite scrolling ticker / marquee with pause-on-hover and bidirectional support.
 * Ideal for high-trust social proof, client reviews, and media mentions.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  duration = "40s",
  gap = "1.5rem",
  ...props
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      {...props}
      style={
        {
          "--duration": duration,
          "--gap": gap,
        } as React.CSSProperties
      }
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array.from({ length: shouldReduceMotion ? 1 : repeat }).map((_, i) => (
        <div
          key={i}
          className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
            "animate-marquee flex-row": !vertical && !shouldReduceMotion,
            "animate-marquee-vertical flex-col": vertical && !shouldReduceMotion,
            "group-hover:[animation-play-state:paused]": pauseOnHover && !shouldReduceMotion,
            "[animation-direction:reverse]": reverse && !shouldReduceMotion,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
