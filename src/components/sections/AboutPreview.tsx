"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/**
 * Three founder/practice highlights, drawn from docs/content.md's
 * "Why Choose Us" list — kept to the three most relevant to an About
 * teaser (experience, approach, confidentiality). The full list lives
 * in the dedicated WhyChooseUs section later on the page.
 */
const HIGHLIGHTS = [
  "4+ Years of Dedicated Practice",
  "Personalized, Ethical Guidance",
  "Confidential, Judgment-Free Consultations",
];

/**
 * AboutPreview
 *
 * Homepage teaser introducing the founder and practice philosophy, per
 * docs/homepage-breakdown.md (Section 06) and docs/content.md. Links
 * through to the full /about page.
 *
 * Layout:
 * - Left (~45%): image placeholder, reserved aspect ratio, no image yet.
 * - Right (~55%): eyebrow, H2, two paragraphs, 3 highlights, CTA.
 *
 * This is a "light editorial" section per design-language.md §2 (About
 * alternates with the dark hero), so it uses the warm-white / navy-900
 * light-surface palette rather than Hero's dark treatment.
 */
const AboutPreview = () => {
  const shouldReduceMotion = useReducedMotion();

  // Shared fade-up reveal — opacity + Y only, per design-language.md §11
  // "Scroll Reveal" (40px distance, medium/600ms duration, ease-out).
  const fadeUp = (delay: number) =>
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
          transition: { duration: 0.6, delay, ease: [0, 0, 0.2, 1] as const },
        };

  return (
    <section className="bg-warm-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Left — reserved space for the future founder portrait */}
          <motion.div
            {...fadeUp(0)}
            aria-hidden="true"
            className="aspect-[4/5] w-full rounded-[24px] border border-border"
          >
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-small text-text-secondary">
                Founder Portrait
              </span>
            </div>
          </motion.div>

          {/* Right — eyebrow, heading, story, highlights, CTA */}
          <div className="flex flex-col items-start gap-6 text-left">
            <motion.span
              {...fadeUp(0.1)}
              className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600"
            >
              About the Founder
            </motion.span>

            <motion.h2
              {...fadeUp(0.15)}
              className="font-display text-h3 font-medium text-navy-900 md:text-h2"
            >
              A Path Built on Clarity, Not Prediction
            </motion.h2>

            <motion.p {...fadeUp(0.2)} className="max-w-narrow text-body-lg text-text-secondary">
              Numerology and Vastu, in Hayaett S Rahman&apos;s practice, are
              not tools of prediction — they are tools of transformation.
              Every consultation begins with listening, not telling, and
              every recommendation is rooted in clarity rather than fear.
            </motion.p>

            <motion.p {...fadeUp(0.25)} className="max-w-narrow text-body-lg text-text-secondary">
              With years of dedicated practice, the mission stays simple:
              help people move through uncertainty with greater purpose,
              confidence and harmony — through guidance that is personal,
              ethical and never exaggerated.
            </motion.p>

            <motion.ul {...fadeUp(0.3)} className="flex flex-col gap-4">
              {HIGHLIGHTS.map((highlight) => (
                <li key={highlight} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-body font-medium text-navy-900">
                    {highlight}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div {...fadeUp(0.35)}>
              <Button href="/about" size="md">
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutPreview;