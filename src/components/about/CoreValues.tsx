"use client";

import type { ComponentType } from "react";
import { ShieldCheck, Sparkles, HeartHandshake, Sprout } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { CORE_VALUES, type CoreValueIconKey } from "@/data/coreValues";

/**
 * CoreValues ("Core Values")
 *
 * Sixth section on the About page (renders immediately after
 * JourneyTimeline — see src/data/aboutSections.ts). A clean, editorial
 * 2x2 value grid — deliberately restrained rather than a generic
 * "feature card" layout:
 * - Cards have no icon-in-circle-badge treatment repeated from earlier
 *   sections; instead a large outlined icon sits directly above the
 *   heading, with a single thin gold underline as the only accent.
 * - Hover is a lift only (translateY), explicitly no scale — set apart
 *   from the shared Card primitive's default hover (which also scales),
 *   so this component implements its own minimal hover instead of
 *   reusing that primitive.
 * - Background is bg-white with a very faint warm gold wash (not a
 *   repeat of OurStory/OurPhilosophy/JourneyTimeline, which all use
 *   bg-warm-white), distinct from every decorative treatment used so far.
 *
 * ICONS
 * Data (src/data/coreValues.ts) stores each value's icon as a plain
 * string key per the architecture rule (no React in the data layer).
 * This component owns the only icon-key → Lucide-component mapping.
 *
 * All copy is data-driven — nothing is hardcoded here. Only values
 * with `enabled: true` are rendered, so a value can be hidden later
 * without deleting its data.
 */
const ICON_MAP: Record<CoreValueIconKey, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  "heart-handshake": HeartHandshake,
  sprout: Sprout,
};

const CoreValues = () => {
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, heading, supportingText, values } = CORE_VALUES;
  const visibleValues = values.filter((value) => value.enabled);

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

  // Cards — staggered reveal, per the brief.
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
            delay: 0.2 + index * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      aria-label="Core Values"
      className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Very light warm wash — distinct from the bg-warm-white sections
          above and below this one. Purely atmospheric. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,var(--color-gold-400)_0%,transparent_70%)] opacity-[0.05] blur-3xl"
      />

      <Container size="wide" className="relative">
        {/* Section header */}
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

        {/* Value grid — 1 col mobile, 2 cols tablet, 2x2 on desktop */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:gap-8">
          {visibleValues.map((value, index) => {
            const Icon = ICON_MAP[value.icon];
            return (
              <motion.div
                key={value.id}
                {...cardReveal(index)}
                className={
                  "group flex h-full flex-col gap-5 rounded-lg border border-border bg-white p-8 " +
                  "shadow-sm transition-[box-shadow,transform] duration-250 ease-out " +
                  "hover:-translate-y-2 hover:shadow-md"
                }
              >
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 text-gold-600 transition-colors duration-250 group-hover:bg-gold-50"
                >
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </span>

                <div
                  aria-hidden="true"
                  className="h-px w-10 bg-[linear-gradient(90deg,var(--color-gold-500)_0%,transparent_100%)]"
                />

                <h3 className="font-heading text-h5 font-medium text-navy-900">
                  {value.title}
                </h3>

                <p className="text-body text-text-secondary">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CoreValues;