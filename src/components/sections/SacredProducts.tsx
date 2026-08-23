"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/** The 3 feature points — presented as a minimal inline list, not cards. */
const FEATURE_POINTS = ["Mindfully Selected", "Purposeful Living", "Balance & Harmony"];

/**
 * SacredProducts ("Sacred Collection")
 *
 * Editorial storytelling section explaining the philosophy behind the
 * product collection — deliberately separate from the commerce-focused
 * Products.tsx grid immediately above it.
 *
 * Dark "cinematic" section (navy → indigo gradient family).
 * Right side carries a large ornate gold lotus mandala wheel illustration;
 * left side carries the philosophy copy and CTA.
 */
const SacredProducts = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number, duration = 0.6) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 40 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration, delay, ease: [0, 0, 0.2, 1] as const },
        };

  return (
    <section className="relative overflow-hidden bg-navy-900 py-12 md:py-16 lg:py-20">
      {/* Background atmosphere — same navy/indigo/gold family as Hero.tsx. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-900)_0%,var(--color-navy-800)_45%,var(--color-indigo-900)_100%)]" />
        <div
          className="absolute right-1/2 top-1/2 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/2 rounded-full
                     bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.14] blur-3xl
                     md:right-[8%] md:translate-x-0 lg:h-[560px] lg:w-[560px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-warm-white)_1px,transparent_0)] bg-[length:24px_24px] opacity-[0.03]" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left — philosophy copy, feature points, CTA */}
          <div className="flex flex-col items-start gap-6 text-left">
            <motion.span
              {...fadeUp(0)}
              className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
            >
              Sacred Collection
            </motion.span>

            <motion.h2
              {...fadeUp(0.1)}
              className="font-display text-h3 font-medium text-white md:text-h2"
            >
              Thoughtfully Chosen for Balance, Energy &amp; Intention
            </motion.h2>

            <motion.p {...fadeUp(0.2)} className="max-w-narrow text-body-lg text-white/70">
              Every item in this collection is selected with intention rather
              than trend — each one connected to ideas of balance, mindful
              living and creating spaces that feel calm and positive to be
              in. Choosing a piece is meant to feel personal, not
              transactional.
            </motion.p>

            <motion.p {...fadeUp(0.28)} className="max-w-narrow text-body-lg text-white/70">
              The collection sits alongside our broader approach to
              Numerology and Vastu — the same philosophy of clarity and
              harmony, expressed through objects you can bring into
              everyday life.
            </motion.p>

            {/* Staggered FEATURE_POINTS list items */}
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
              {FEATURE_POINTS.map((point, index) => (
                <motion.li
                  key={point}
                  {...fadeUp(0.36 + index * 0.08)}
                  className="flex items-center gap-2 group cursor-default"
                >
                  <motion.span
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.36 + index * 0.08 + 0.1, ease: [0, 0, 0.2, 1] }}
                    className="inline-flex shrink-0 items-center justify-center text-gold-500 group-hover:scale-110 transition-transform duration-300"
                  >
                    <Check aria-hidden="true" className="h-4 w-4 text-gold-500" strokeWidth={2.5} />
                  </motion.span>
                  <span className="text-body font-medium text-white group-hover:text-gold-300 transition-colors duration-200">{point}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div {...fadeUp(0.6)}>
              <Button
                href="/contact"
                size="lg"
                className="rounded-full shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Explore the Collection
              </Button>
            </motion.div>
          </div>

          {/* Right — large ornate gold sacred-geometry lotus mandala wheel */}
          <div className="flex w-full items-center justify-center">
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
              {/* Static ambient golden aura behind wheel */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-10%] -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.22)_0%,rgba(212,175,55,0.06)_50%,transparent_75%)] blur-2xl scale-110"
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
                  src="/images/products/sacred-collection-wheel.png"
                  alt="Ornate gold sacred geometry lotus mandala wheel illustration"
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

export default SacredProducts;