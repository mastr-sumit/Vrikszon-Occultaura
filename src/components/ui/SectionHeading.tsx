"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** Small label above the heading, e.g. "SERVICES". */
  eyebrow?: string;
  badge?: string;
  heading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  centered?: boolean;
  cta?: React.ReactNode;
  /** Disable the fade-up scroll reveal, e.g. for above-the-fold headings. */
  animate?: boolean;
  className?: string;
  /** Heading element level for correct document outline. Defaults to "h2". */
  as?: "h1" | "h2" | "h3";
}

/**
 * Standard section intro block: eyebrow -> headline -> supporting text -> CTA,
 * per ui-ux-guidelines.md "Section Structure". Reveals once on scroll into view.
 */
export function SectionHeading({
  eyebrow,
  badge,
  heading,
  title,
  description,
  align,
  centered,
  cta,
  animate = true,
  className,
  as: HeadingTag = "h2",
}: SectionHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  const resolvedEyebrow = eyebrow ?? badge;
  const resolvedHeading = heading ?? title;
  const resolvedAlign = align ?? (centered ? "center" : "left");

  const variants = {
    hidden: { opacity: 0, y: shouldAnimate ? 24 : 0 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={shouldAnimate ? "hidden" : "visible"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      className={cn(
        "flex flex-col gap-6",
        resolvedAlign === "center" && "items-center text-center",
        className
      )}
    >
      {resolvedEyebrow && (
        <div className={cn("flex items-center gap-2.5", resolvedAlign === "center" && "justify-center")}>
          <span className="h-px w-8 bg-gold-500/60" />
          <span className="text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-gold-600">
            {resolvedEyebrow}
          </span>
          <span className="h-px w-8 bg-gold-500/60" />
        </div>
      )}
      {resolvedHeading && (
        <HeadingTag className="font-heading text-h2 sm:text-h1 md:text-hero text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-semibold text-navy-900 tracking-tight leading-[1.18]">
          {resolvedHeading}
        </HeadingTag>
      )}
      {description && (
        <p
          className={cn(
            "text-body-lg text-text-secondary max-w-narrow",
            resolvedAlign === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
      {cta && <div className="mt-4">{cta}</div>}
    </motion.div>
  );
}
