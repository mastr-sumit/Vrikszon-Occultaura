"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { ABOUT_CTA } from "@/data/aboutCTA";

/**
 * AboutCTA ("Begin Your Journey" / final About CTA)
 *
 * The last section on the About page, registered immediately before
 * the Footer (see src/data/aboutSections.ts). A calm, centered closing
 * moment — deliberately restrained rather than a hard sales push:
 * one eyebrow, one heading, one short paragraph, two buttons.
 *
 * LAYOUT
 * Full-width section, fully centered content, capped at ~760px
 * (Container's `narrow` size, the design system's reading width) so
 * the closing message reads as a single focused statement rather than
 * stretching edge-to-edge.
 *
 * BACKGROUND
 * Dark navy -> indigo gradient with a soft gold glow and a faint
 * celestial dot texture, matching the general "dark luxury" family
 * used elsewhere on this page (AboutHero, WhyClientsTrustUs) but not
 * a repeat of either: no breadcrumb/illustration-panel layout from
 * AboutHero, no dual radial glow + card grid from WhyClientsTrustUs —
 * just a single soft gold glow directly behind the heading and a few
 * scattered constellation dots, per this task's "optional decoration"
 * brief (subtle divider, tiny dots, soft glow, no heavy illustration).
 *
 * ANIMATION
 * Heading: fade + translateY. Buttons: small stagger. Background glow:
 * a very subtle, slow ambient opacity pulse — never large or
 * continuous motion, and fully disabled under prefers-reduced-motion
 * (only a plain opacity fade remains).
 */
const AboutCTA = () => {
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, heading, description, primaryButton, secondaryButton } =
    ABOUT_CTA;

  const fadeUp = (delay: number) =>
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
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Buttons — small stagger, per the brief.
  const buttonReveal = (index: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: {
            duration: 0.5,
            delay: 0.35 + index * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  // Ambient background glow — very subtle, slow pulse only.
  const ambientGlow = shouldReduceMotion
    ? { animate: { opacity: 0.14 } }
    : {
        animate: { opacity: [0.1, 0.16, 0.1] },
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <section
      aria-label="Begin Your Journey"
      className="relative overflow-hidden bg-navy-900 py-20 md:py-24 lg:py-30"
    >
      {/* Background — dark navy -> indigo gradient, soft gold glow,
          faint celestial texture. Not a repeat of AboutHero's
          two-column breadcrumb + illustration treatment. */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-navy-950)_0%,var(--color-navy-900)_50%,var(--color-indigo-900)_100%)]" />

        {/* Very faint celestial dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Single soft gold glow, centered behind the heading */}
        <motion.div
          {...ambientGlow}
          className="absolute left-1/2 top-1/2 h-[420px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,var(--color-gold-500)_0%,transparent_70%)] blur-3xl"
        />

        {/* Tiny constellation dots — sparse, symbolic only */}
        <div aria-hidden="true" className="absolute inset-0">
          {[
            [12, 20],
            [88, 15],
            [8, 78],
            [92, 82],
            [50, 8],
            [50, 94],
          ].map(([left, top], index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-gold-300/40"
              style={{ left: `${left}%`, top: `${top}%` }}
            />
          ))}
        </div>
      </div>

      <Container size="narrow" className="relative z-10">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 text-center">
          <motion.span
            {...fadeUp(0)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
          >
            {eyebrow}
          </motion.span>

          {/* Subtle divider */}
          <motion.div
            {...fadeUp(0.06)}
            aria-hidden="true"
            className="h-px w-12 bg-[linear-gradient(90deg,transparent_0%,var(--color-gold-500)_50%,transparent_100%)]"
          />

          <motion.h2
            {...fadeUp(0.12)}
            className="text-balance font-heading text-h3 font-medium text-white md:text-h2"
          >
            {heading}
          </motion.h2>

          <motion.p {...fadeUp(0.2)} className="max-w-reading text-body-lg text-white/70">
            {description}
          </motion.p>

          <div className="mt-2 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
            <motion.div {...buttonReveal(0)} className="w-full sm:w-auto">
              <Button href={primaryButton.href} size="lg" fullWidth className="sm:w-auto">
                {primaryButton.label}
              </Button>
            </motion.div>

            <motion.div {...buttonReveal(1)} className="w-full sm:w-auto">
              <Button
                href={secondaryButton.href}
                variant="secondary"
                size="lg"
                fullWidth
                className="sm:w-auto border-white/30 text-white hover:border-gold-500 hover:bg-white/5 hover:text-gold-400"
              >
                {secondaryButton.label}
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutCTA;