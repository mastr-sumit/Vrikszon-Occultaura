"use client";

import Image from "next/image";
import { Quote, Award } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { EXPERT_PROFILE } from "@/data/expertProfile";

/**
 * MeetTheExpert ("Meet the Expert")
 *
 * Third section on the About page (renders immediately after OurStory —
 * see src/data/aboutSections.ts). A premium, editorial personal-brand
 * moment for the founder — deliberately distinct from both:
 * - The homepage's Expert section (src/components/sections/Expert.tsx):
 *   that section uses a 45/55 split, bg-white, and a 4:5 portrait with
 *   an offset gold frame.
 * - OurStory (src/components/about/OurStory.tsx): 45/55 split, bg-warm-white,
 *   4:3 image with floating stat cards below it.
 *
 * This section instead uses a stricter 40/60 split, a tall 3:4 portrait
 * with a direct gold ring (not an offset frame), a floating credential
 * badge at the portrait's lower edge, credential pills (not stat cards),
 * achievement cards in a row, and a large serif pull-quote — a
 * different visual grammar for the same "founder" subject matter.
 *
 * IMAGE
 * No verified/approved founder photograph exists in the project
 * (docs/content.md lists "Founder Images" under "Pending Content").
 * Per this task's explicit instruction not to invent a person, the
 * portrait slot is an elegant placeholder panel — not a stand-in photo.
 * Swap only the inner surface for a real `next/image` once photography
 * is supplied; the outer ring/frame does not need to change.
 *
 * All copy, credentials, achievements and the quote are data-driven
 * from src/data/expertProfile.ts. Achievements and the quote have no
 * verified content yet, so they render an honest "Coming Soon"
 * treatment instead of invented text.
 */
const MeetTheExpert = () => {
  const shouldReduceMotion = useReducedMotion();
  const { name, designation, location, bio, credentials, achievements, quote, cta } =
    EXPERT_PROFILE;

  // Content column — fade + translateY, per the brief.
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

  // Portrait — fade + slight translateX, per the brief.
  const portraitReveal = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0.3 },
      }
    : {
        initial: { opacity: 0, x: -32 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  // Small stagger for credential pills and achievement cards.
  const staggerReveal = (index: number, baseDelay = 0.35) =>
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
            delay: baseDelay + index * 0.1,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      aria-label="Meet the Expert"
      className="relative overflow-hidden bg-navy-50/60 py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Soft gold glow — the section's atmospheric differentiator from
          the surrounding warm-white/white sections. Purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,var(--color-gold-400)_0%,transparent_70%)] opacity-[0.08] blur-3xl"
      />

      <Container size="wide" className="relative">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:gap-16">
          {/* ================= LEFT (~40%) — portrait ================= */}
          <div className="lg:basis-[40%]">
            <motion.div
              {...portraitReveal}
              className="relative mx-auto w-full max-w-[380px] lg:mx-0"
            >
              <div className="relative aspect-[3/4] w-full">
                {/* Direct gold ring on the portrait itself — distinct
                    from the offset-frame treatment used elsewhere. */}
                <div className="absolute inset-0 rounded-[24px] ring-1 ring-gold-500/40 ring-offset-4 ring-offset-navy-50" />

                <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-navy-900/10 shadow-lg">
                  <Image
                    src="/images/about/founder-hayaett-s-rahman.png"
                    alt="Hayaett S Rahman, Founder of Vrikszon Occultaura"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-center rounded-[24px]"
                  />
                </div>

                {/* Floating credential badge overlapping the portrait's
                    lower edge — the section's signature accent. */}
                <div className="absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-full border border-border bg-white px-5 py-3 text-center shadow-md">
                  <span className="block font-heading text-h6 font-medium text-navy-900">
                    {name}
                  </span>
                  <span className="block text-caption uppercase tracking-[0.06em] text-text-secondary">
                    {designation}, {location}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT (~60%) — content ================= */}
          <div className="flex flex-col gap-8 lg:basis-[60%]">
            <div className="flex flex-col gap-5 text-left">
              <motion.span
                {...fadeUp(0)}
                className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600"
              >
                Our Expert
              </motion.span>

              <div className="flex flex-col gap-2">
                <motion.h2
                  {...fadeUp(0.08)}
                  className="text-balance font-display font-serif text-h3 font-medium text-navy-900 md:text-h2"
                >
                  Meet Hayaett S Rahman
                </motion.h2>
                <motion.p
                  {...fadeUp(0.12)}
                  className="text-small font-medium uppercase tracking-[0.04em] text-text-secondary"
                >
                  Vastu Expert, Numerologist &amp; Occult Science Practitioner
                </motion.p>
              </div>

              <motion.div
                aria-hidden="true"
                {...fadeUp(0.16)}
                className="h-px w-16 bg-[linear-gradient(90deg,var(--color-gold-500)_0%,transparent_100%)]"
              />

              <div className="flex flex-col gap-4">
                {bio.map((paragraph, index) => (
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

            {/* Credentials — elegant pill badges */}
            <motion.ul
              {...fadeUp(0.4)}
              className="flex flex-wrap gap-3"
              aria-label="Credentials"
            >
              {credentials.map((credential) => (
                <li
                  key={credential.id}
                  className="flex items-center gap-2 rounded-full border border-gold-500/30 bg-white px-4 py-2 text-small text-navy-900 shadow-xs"
                >
                  <span className="font-semibold text-gold-600">{credential.label}:</span>
                  <span>{credential.value}</span>
                </li>
              ))}
            </motion.ul>

            {/* Achievements — small premium cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {achievements.map((achievement, index) => (
                <motion.div key={achievement.id} {...staggerReveal(index)}>
                  <Card hover={false} padding="sm" className="flex h-full flex-col gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                    >
                      <Award className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-heading text-h6 font-medium text-navy-900">
                      {achievement.title}
                    </h3>
                    {achievement.isPlaceholder ? (
                      <span className="w-fit rounded-full bg-gold-50 px-3 py-1 text-caption font-semibold uppercase tracking-[0.06em] text-gold-600">
                        Coming Soon
                      </span>
                    ) : (
                      <p className="text-small text-text-secondary">
                        {achievement.description}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quote — highlighted pull-quote */}
            <motion.div
              {...fadeUp(0.55)}
              className="relative rounded-lg border border-gold-500/20 bg-white px-6 py-6 shadow-sm sm:px-8"
            >
              <Quote
                aria-hidden="true"
                className="absolute -top-3 left-6 h-6 w-6 rotate-180 text-gold-500"
                strokeWidth={1.5}
              />
              {quote.isPlaceholder ? (
                <p className="font-heading text-h6 italic text-text-secondary">
                  Founder quote — coming soon.
                </p>
              ) : (
                <p className="font-heading text-h5 italic text-navy-900">{quote.text}</p>
              )}
            </motion.div>

            {/* CTA */}
            <motion.div {...fadeUp(0.65)}>
              <Button href={cta.href} size="lg">
                {cta.label}
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MeetTheExpert;