"use client";

import type { ComponentType } from "react";
import { Compass, Eye, Sparkles, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { JOURNEY_TIMELINE, type JourneyIconKey } from "@/data/journeyTimeline";

/**
 * JourneyTimeline ("Your Journey With Us")
 *
 * Fifth section on the About page (renders immediately after
 * OurPhilosophy — see src/data/aboutSections.ts). Replaces the generic
 * "Know Yourself Through Numerology" pattern with a premium, modern
 * 4-step process timeline: Discover → Understand → Apply → Grow.
 *
 * Layout:
 * - Desktop (lg+): horizontal row of 4 cards connected by a single
 *   thin gold line running behind the number circles.
 * - Tablet (sm–lg): 2x2 grid, no connecting line (avoids an
 *   ambiguous line direction across a wrapped grid).
 * - Mobile (<sm): vertical timeline — a single gold line running down
 *   the left edge, connecting each step's number circle.
 *
 * ICONS
 * Data (src/data/journeyTimeline.ts) stores each step's icon as a
 * plain string key per the architecture rule (no React in the data
 * layer). This component owns the only icon-key → Lucide-component
 * mapping, keeping the data file free of any React/JSX import.
 *
 * All copy is data-driven — nothing is hardcoded here.
 */
const ICON_MAP: Record<JourneyIconKey, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  compass: Compass,
  eye: Eye,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
};

const JourneyTimeline = () => {
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, heading, supportingText, steps } = JOURNEY_TIMELINE;

  // Heading — fade + translateY, per the brief.
  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Timeline cards — staggered reveal, per the brief.
  const cardReveal = (index: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: {
            duration: 0.6,
            delay: 0.25 + index * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  // Connecting line — subtle draw/fade effect (scaleX for the
  // horizontal desktop line, scaleY for the vertical mobile line).
  const lineDrawHorizontal = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { scaleX: 0, opacity: 0 },
        whileInView: { scaleX: 1, opacity: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  const lineDrawVertical = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { scaleY: 0, opacity: 0 },
        whileInView: { scaleY: 1, opacity: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      aria-label="Your Journey With Us"
      className="relative overflow-hidden bg-warm-white py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Minimal celestial decoration — a few faint static dots, distinct
          from other sections' glows/rings. Purely atmospheric. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(var(--color-navy-900) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <Container size="wide" className="relative">
        {/* Heading */}
        <div className="mx-auto flex max-w-reading flex-col items-center gap-4 text-center">
          <motion.span
            {...fadeUp(0)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600"
          >
            {eyebrow}
          </motion.span>

          <motion.h2
            {...fadeUp(0.08)}
            className="text-balance font-heading text-h3 font-medium text-navy-900 md:text-h2"
          >
            {heading}
          </motion.h2>

          <motion.p {...fadeUp(0.16)} className="text-body-lg text-text-secondary">
            {supportingText}
          </motion.p>
        </div>

        {/* ================= Desktop (lg+): horizontal timeline ================= */}
        <div className="relative mt-16 hidden lg:block">
          {/* Connecting gold line, positioned through the number circles'
              vertical center (circle center sits 28px from each card's top). */}
          <motion.div
            {...lineDrawHorizontal}
            aria-hidden="true"
            style={{ transformOrigin: "left center" }}
            className="absolute left-[12.5%] right-[12.5%] top-[28px] h-px bg-[linear-gradient(90deg,transparent_0%,var(--color-gold-500)_10%,var(--color-gold-500)_90%,transparent_100%)]"
          />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = ICON_MAP[step.icon];
              return (
                <motion.div
                  key={step.id}
                  {...cardReveal(index)}
                  className="relative flex flex-col gap-4 rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow duration-fast hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 font-heading text-h5 font-medium text-navy-900"
                    >
                      {step.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>
                  <h3 className="font-heading text-h5 font-medium text-navy-900">
                    {step.title}
                  </h3>
                  <p className="text-small text-text-secondary">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= Tablet (sm–lg): 2x2 grid ================= */}
        <div className="mt-14 hidden sm:grid sm:grid-cols-2 sm:gap-6 lg:hidden">
          {steps.map((step, index) => {
            const Icon = ICON_MAP[step.icon];
            return (
              <motion.div
                key={step.id}
                {...cardReveal(index)}
                className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow duration-fast hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 font-heading text-h5 font-medium text-navy-900"
                  >
                    {step.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                </div>
                <h3 className="font-heading text-h5 font-medium text-navy-900">
                  {step.title}
                </h3>
                <p className="text-small text-text-secondary">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ================= Mobile (<sm): vertical timeline ================= */}
        <div className="relative mt-14 flex flex-col gap-8 sm:hidden">
          <motion.div
            {...lineDrawVertical}
            aria-hidden="true"
            style={{ transformOrigin: "top center" }}
            className="absolute left-7 top-2 bottom-2 w-px bg-[linear-gradient(180deg,transparent_0%,var(--color-gold-500)_8%,var(--color-gold-500)_92%,transparent_100%)]"
          />

          {steps.map((step, index) => {
            const Icon = ICON_MAP[step.icon];
            return (
              <motion.div key={step.id} {...cardReveal(index)} className="relative flex gap-4">
                <span
                  aria-hidden="true"
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 font-heading text-h6 font-medium text-navy-900"
                >
                  {step.number}
                </span>
                <div className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-heading text-h6 font-medium text-navy-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-small text-text-secondary">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default JourneyTimeline;