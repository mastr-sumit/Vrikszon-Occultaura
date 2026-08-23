"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { OUR_PHILOSOPHY } from "@/data/philosophy";

/**
 * OurPhilosophy ("Our Philosophy")
 *
 * Fourth section on the About page (renders immediately after
 * MeetTheExpert — see src/data/aboutSections.ts). Editorial heart
 * of the page: the "why" behind the brand.
 *
 * Content on the left (~60%): eyebrow, heading, body copy, quote block, mission statement.
 * Visual on the right (~40%): ornate rose-gold zodiac wheel with central sun face,
 * entering with a scroll-triggered roll-in animation and continuing with ambient linear rotation.
 */
const OurPhilosophy = () => {
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, heading, body, quote, mission } = OUR_PHILOSOPHY;

  // Left column — opacity + translateY
  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Small stagger for the quote block's internal elements
  const quoteStagger = (index: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: {
            duration: 0.5,
            delay: 0.45 + index * 0.1,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      aria-label="Our Philosophy"
      className="relative overflow-hidden bg-warm-white py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Subtle decorative background rings on bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -bottom-40 h-[520px] w-[520px] rounded-full border border-gold-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -bottom-24 h-[360px] w-[360px] rounded-full border border-gold-500/10"
      />

      <Container size="wide" className="relative">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-start lg:gap-16">
          {/* ================= LEFT (~60%) — editorial content ================= */}
          <div className="flex flex-col gap-8 lg:basis-[60%]">
            <div className="flex flex-col gap-5 text-left">
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

              <motion.div
                aria-hidden="true"
                {...fadeUp(0.14)}
                className="h-px w-16 bg-[linear-gradient(90deg,var(--color-gold-500)_0%,transparent_100%)]"
              />

              <div className="flex flex-col gap-4">
                {body.map((paragraph) => (
                  <motion.p
                    key={paragraph.slice(0, 24)}
                    {...fadeUp(0.2)}
                    className="max-w-reading text-body-lg text-text-secondary"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Quote block — single large highlighted panel */}
            <motion.div
              {...fadeUp(0.4)}
              className="relative max-w-reading rounded-lg border border-gold-500/20 bg-white px-7 py-8 shadow-md sm:px-10"
            >
              <motion.span {...quoteStagger(0)} aria-hidden="true" className="block">
                <Quote
                  className="h-7 w-7 rotate-180 text-gold-500"
                  strokeWidth={1.5}
                />
              </motion.span>

              <motion.p
                {...quoteStagger(1)}
                className={
                  quote.isPlaceholder
                    ? "mt-4 font-heading text-h6 italic text-text-secondary"
                    : "mt-4 font-heading text-h5 italic text-navy-900"
                }
              >
                {quote.isPlaceholder ? "Founder reflection — coming soon." : quote.text}
              </motion.p>

              <motion.div
                {...quoteStagger(2)}
                aria-hidden="true"
                className="mt-5 h-px w-10 bg-gold-500/40"
              />
            </motion.div>

            {/* Mission panel — minimal beneath content */}
            <motion.div
              {...fadeUp(0.55)}
              className="max-w-reading rounded-lg border border-border bg-navy-50/50 px-6 py-5"
            >
              <span className="text-caption font-semibold uppercase tracking-[0.08em] text-gold-600">
                {mission.title}
              </span>
              <p className="mt-2 text-body text-navy-900">{mission.statement}</p>
            </motion.div>
          </div>

          {/* ================= RIGHT (~40%) — transparent philosophy zodiac wheel ================= */}
          <div className="flex w-full items-center justify-center lg:basis-[40%]">
            <motion.div
              className="relative aspect-square w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px]"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 350, rotate: 360 }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, x: 0, rotate: 0 }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.4 }
                  : { duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
              }
            >
              {/* Ambient golden aura behind wheel */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-10%] -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,rgba(212,175,55,0.05)_50%,transparent_75%)] blur-2xl scale-110"
              />

              {/* Ambient Continuous Rotation Layer */}
              <motion.div
                className="relative h-full w-full pointer-events-none"
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 90, ease: "linear", repeat: Infinity }
                }
              >
                <Image
                  src="/images/about/philosophy-wheel.png"
                  alt="Ornate rose-gold zodiac wheel illustration with central sun face"
                  fill
                  quality={95}
                  priority
                  sizes="(max-width: 768px) 360px, (max-width: 1024px) 420px, 460px"
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurPhilosophy;