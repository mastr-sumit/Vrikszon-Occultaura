"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CardPadding = "sm" | "md" | "lg";

type ConflictingMotionProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, ConflictingMotionProps> {
  /** Lifts and scales on hover, per the shared card hover interaction. Default true. */
  hover?: boolean;
  /** Sparingly-used glass treatment for content floating over rich backgrounds. */
  glass?: boolean;
  /** Maps to 32 / 40 / 48px padding. Default "md" (40px). */
  padding?: CardPadding;
}

const paddingClasses: Record<CardPadding, string> = {
  sm: "p-6 md:p-8",  // 24px / 32px
  md: "p-8 md:p-10", // 32px / 40px
  lg: "p-8 md:p-12", // 32px / 48px
};

/**
 * Base card primitive. This is the shared foundation only — ServiceCard,
 * ProductCard, TestimonialCard etc. (design-language.md §8) are separate,
 * later components that compose this primitive with their own content.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, glass = false, padding = "md", className, children, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimateHover = hover && !prefersReducedMotion;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg shadow-sm transition-shadow duration-fast",
          paddingClasses[padding],
          glass
            ? "border border-gold-500/30 bg-navy-900/70 backdrop-blur-md text-white"
            : "border border-gold-500/30 bg-white text-text-primary",
          hover && "hover:shadow-md",
          className
        )}
        whileHover={
          shouldAnimateHover ? { y: -8, scale: 1.02 } : undefined
        }
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-md flex flex-col gap-xs", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    // Inherits color (not a fixed navy-900) so it reads correctly inside
    // both a plain white Card and a glass Card (which sets text-white).
    className={cn("font-heading text-h4 font-medium text-current", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-body text-current opacity-80", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-body text-current", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-md flex items-center gap-sm", className)} {...props} />
));
CardFooter.displayName = "CardFooter";
