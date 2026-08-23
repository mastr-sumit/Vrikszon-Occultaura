"use client";

import type { ComponentType } from "react";
import { UserCheck, Lock, ClipboardCheck, Scale, Sparkles, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import {
  WHY_CLIENTS_TRUST_US,
  type TrustReasonIconKey,
} from "@/data/trustReasons";

/**
 * WhyClientsTrustUs ("Why Clients Trust Us")
 *
 * Registered immediately after CoreValues on the About page (see
 * src/data/aboutSections.ts). A credibility section — deliberately
 * NOT a testimonials section (no quotes, no client names/photos) and
 * NOT a statistics section (no counters/numbers). It answers "why
 * should someone choose this brand" through six standards the
 * practice holds itself to.
 *
 * LAYOUT
 * Desktop: an asymmetric 40/60 split — editorial heading + supporting
 * copy + CTA on the left (~40%), a 2x3 premium card grid on the right
 * (~60%). This is a new layout shape for the About page (AboutHero and
 * MeetTheExpert use their own splits; CoreValues is a centered single
 * grid) so this section reads as visually distinct rather than a
 * repeat of an earlier one.
 *
 * BACKGROUND
 * CoreValues (the section immediately before this one) is bg-white,
 * so this section alternates to a dark navy → indigo gradient with a
 * soft gold glow, per design-language.md §2's dark/light alternation
 * rule and this task's explicit "subtle dark navy gradient with warm
 * gold highlights" brief.
 *
 * CARDS
 * Dark-surface cards (design-language.md §6 permits dark surfaces
 * generally; §8's shared card base is reused here with a dark
 * treatment) with a hairline border, large outlined gold icon, title,
 * description, and a thin gold accent underline — matching the visual
 * language of CoreValues' cards but adapted for a dark background.
 * Hover is a lift only, no scale, per the brief.
 *
 * ICONS
 * Data (src/data/trustReasons.ts) stores each reason's icon as a plain
 * string key per the architecture rule (no React in the data layer).
 * This component owns the only icon-key -> Lucide-component mapping,
 * mirroring the pattern in CoreValues.tsx.
 *
 * All copy is data-driven — nothing is hardcoded here. Only reasons
 * with `enabled: true` are rendered, so an item can be hidden later
 * without deleting its data.
 */
const ICON_MAP: Record<TrustReasonIconKey, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "user-check": UserCheck,
  lock: Lock,
  "clipboard-check": ClipboardCheck,
  scale: Scale,
  sparkles: Sparkles,
  users: Users,
};

const WhyClientsTrustUs = () => {
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, heading, supportingText, ctaLabel, ctaHref, reasons } =
    WHY_CLIENTS_TRUST_US;
  const visibleReasons = reasons.filter((reason) => reason.enabled);

  // Heading column — fade + translateY, per the brief.
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
            delay: 0.15 + index * 0.1,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      aria-label="Why Clients Trust Us"
      className="relative overflow-hidden bg-navy-900 py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Background — dark navy -> indigo gradient with warm gold highlights,
          alternating from CoreValues' bg-white section above. */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_55%,var(--color-indigo-900)_100%)]" />
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.12] blur-3xl md:h-[560px] md:w-[560px]" />
        <div className="absolute bottom-[-15%] right-[-5%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,var(--color-gold-400)_0%,transparent_70%)] opacity-[0.08] blur-3xl" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="flex flex-col gap-14 lg:flex-row lg:gap-12 xl:gap-16">
          {/* Left column (~40%) — heading, supporting copy, CTA */}
          <div className="flex flex-col items-start gap-5 text-left lg:basis-[40%]">
            <motion.span
              {...fadeUp(0)}
              className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
            >
              {eyebrow}
            </motion.span>

            <motion.h2
              {...fadeUp(0.08)}
              className="text-balance font-heading text-h3 font-medium text-white md:text-h2"
            >
              {heading}
            </motion.h2>

            <motion.p {...fadeUp(0.16)} className="max-w-reading text-body-lg text-white/70">
              {supportingText}
            </motion.p>

            <motion.div {...fadeUp(0.24)}>
              <Button href={ctaHref} size="md">
                {ctaLabel}
              </Button>
            </motion.div>
          </div>

          {/* Right column (~60%) — 2x3 premium trust cards */}
          <div className="lg:basis-[60%]">
            <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
              {visibleReasons.map((reason, index) => {
                const Icon = ICON_MAP[reason.icon];
                return (
                  <motion.div
                    key={reason.id}
                    {...cardReveal(index)}
                    className={
                      "group flex h-full flex-col gap-4 rounded-lg border border-white/10 bg-dark-surface p-8 " +
                      "shadow-sm transition-[box-shadow,transform] duration-250 ease-out " +
                      "hover:-translate-y-2 hover:shadow-lg hover:border-gold-500/30"
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 text-gold-500 transition-colors duration-250 group-hover:bg-gold-500/10"
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </span>

                    <div
                      aria-hidden="true"
                      className="h-px w-10 bg-[linear-gradient(90deg,var(--color-gold-500)_0%,transparent_100%)]"
                    />

                    <h3 className="font-heading text-h5 font-medium text-white">
                      {reason.title}
                    </h3>

                    <p className="text-body text-white/65">{reason.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyClientsTrustUs;