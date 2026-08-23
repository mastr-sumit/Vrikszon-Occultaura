"use client";

import Image from "next/image";
import { Compass, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { OUR_STORY } from "@/data/ourStory";

/**
 * OurStory ("Our Story")
 *
 * Second section on the About page (renders immediately after
 * AboutHero — see src/data/aboutSections.ts). A premium editorial
 * section: asymmetric two-column layout rather than a plain
 * image-plus-paragraph block, per this task's explicit brief.
 *
 * Layout:
 * - Left (~45%): eyebrow, heading, story paragraphs, then Mission /
 *   Vision as two compact cards (not long paragraphs).
 * - Right (~55%): a large image placeholder (no verified founder/
 *   practice imagery exists yet — see docs/content.md's "Pending
 *   Content" list) with three "floating" statistic cards overlapping
 *   its lower edge.
 *
 * All copy and numbers are data-driven from src/data/ourStory.ts —
 * nothing is hardcoded here. Statistics with no verified value render
 * an honest "Coming Soon" placeholder instead of an invented number.
 *
 * Background is bg-warm-white (ivory), distinct from AboutHero's dark
 * navy hero above it, giving the page its light "editorial magazine"
 * rhythm per ui-ux-guidelines.md's light/dark section alternation.
 */
const OurStory = () => {
  const shouldReduceMotion = useReducedMotion();

  // Left column reveal — opacity + Y, staggered by delay. Scroll-triggered
  // (whileInView) since this section sits below the fold, unlike
  // AboutHero's on-mount reveal.
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

  // Right column (image) reveal — opacity + X, per the brief's explicit
  // "right image: opacity + translateX" instruction.
  const fadeInFromRight = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0.3 },
      }
    : {
        initial: { opacity: 0, x: 40 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  // Statistic card stagger — small opacity + Y, offset slightly after the
  // image so they read as "settling onto" it.
  const statReveal = (index: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: {
            duration: 0.5,
            delay: 0.3 + index * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  const { eyebrow, heading, paragraphs, mission, vision, statistics } = OUR_STORY;

  return (
    <section
      aria-label="Our Story"
      className="relative overflow-hidden bg-warm-white py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Soft decorative gold wash — purely atmospheric, echoes the gold
          accents used elsewhere without repeating any specific motif. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--color-gold-400)_0%,transparent_70%)] opacity-[0.07] blur-3xl"
      />

      <Container size="wide" className="relative">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-16">
          {/* ================= LEFT (~45%) — story ================= */}
          <div className="flex flex-col gap-10 lg:basis-[45%]">
            <div className="flex flex-col gap-6 text-left">
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

              {/* Fine gold accent divider — editorial detail per the brief */}
              <motion.div
                aria-hidden="true"
                {...fadeUp(0.14)}
                className="h-px w-16 bg-[linear-gradient(90deg,var(--color-gold-500)_0%,transparent_100%)]"
              />

              <div className="flex flex-col gap-4">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={paragraph.slice(0, 24)}
                    {...fadeUp(0.18 + index * 0.08)}
                    className="max-w-reading text-body-lg text-text-secondary"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Mission / Vision — two compact cards, not paragraphs */}
            <motion.div
              {...fadeUp(0.45)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <Card hover={false} padding="sm" className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                >
                  <Compass className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-heading text-h6 font-medium text-navy-900">
                  {mission.title}
                </h3>
                <p className="text-small text-text-secondary">
                  {mission.description}
                </p>
              </Card>

              <Card hover={false} padding="sm" className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                >
                  <Sparkles className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-heading text-h6 font-medium text-navy-900">
                  {vision.title}
                </h3>
                <p className="text-small text-text-secondary">
                  {vision.description}
                </p>
              </Card>
            </motion.div>
          </div>

          {/* ================= RIGHT (~55%) — image + stats ================= */}
          <div className="flex flex-col lg:basis-[55%]">
            <motion.div
              {...fadeInFromRight}
              aria-hidden="true"
              className="relative mx-auto w-full max-w-[560px] lg:mx-0"
            >
              <div className="relative aspect-[4/3] w-full">
                {/* Offset gold frame behind the image, consistent with the
                    homepage Expert section's portrait framing language. */}
                <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[24px] border border-gold-500/30" />

                <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-navy-900/10 shadow-lg">
                  <Image
                    src="/images/our-story.png"
                    alt="Abstract atmospheric artwork representing searching for answers leading to clarity, featuring a beam of golden light emerging from cosmic navy mist into an ordered geometric constellation"
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover rounded-[24px]"
                  />
                </div>
              </div>

              {/* Floating statistic cards — overlap the image's lower edge */}
              <div className="relative z-10 -mt-10 grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-8">
                {statistics.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    {...statReveal(index)}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border bg-white px-4 py-5 text-center shadow-md"
                  >
                    {stat.value ? (
                      <span className="font-heading text-h4 font-medium text-navy-900">
                        {stat.value}
                      </span>
                    ) : (
                      <span className="rounded-full bg-gold-50 px-3 py-1 text-caption font-semibold uppercase tracking-[0.06em] text-gold-600">
                        Coming Soon
                      </span>
                    )}
                    <span className="text-small text-text-secondary">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurStory;