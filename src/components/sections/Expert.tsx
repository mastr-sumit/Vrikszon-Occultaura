"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const HIGHLIGHTS = [
  "Personalized Approach",
  "Vastu Shiksha & Energy Alignment",
  "Ethical Guidance",
  "Confidential Consultations",
];

/**
 * Expert ("Our Expert")
 *
 * Founder introduction section for Hayaett S Rahman on the Homepage.
 * Matches reference site typography, layout, and visual design tokens.
 */
const Expert = () => {
  const shouldReduceMotion = useReducedMotion();

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

  const fadeInFromLeft = shouldReduceMotion
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
        transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const },
      };

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16 lg:py-20">
      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--color-indigo-100)_0%,transparent_70%)] opacity-40 blur-2xl"
      />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Left — Founder Portrait with Offset Gold Frame */}
          <motion.div {...fadeInFromLeft} className="mx-auto w-full max-w-[420px] lg:mx-0">
            <div className="group relative aspect-[4/5] w-full cursor-pointer transition-all duration-500 ease-luxury hover:scale-[1.015]">
              {/* Offset gold border */}
              <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[24px] border border-gold-500/30 transition-colors duration-500 group-hover:border-gold-500/60 group-hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]" />

              {/* Soft gold glow */}
              <div
                className="absolute -left-10 -top-10 h-2/3 w-2/3 rounded-full bg-[radial-gradient(circle,var(--color-gold-400)_0%,transparent_70%)] opacity-20 blur-2xl pointer-events-none"
                style={{ opacity: 0.15 }}
              />

              {/* Decorative angular line */}
              <div className="absolute left-1/2 top-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-navy-900/[0.05] pointer-events-none" />

              {/* Portrait Image Container */}
              <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-navy-900/10 bg-navy-50 shadow-md transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(8,20,35,0.18),0_0_30px_rgba(212,175,55,0.2)] group-hover:border-gold-500/40">
                <Image
                  src="/images/founder.jpg"
                  alt="Hayaett S Rahman"
                  fill
                  className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
              </div>

              {/* Gold corner accents */}
              <div className="absolute -bottom-3 -left-3 h-6 w-px bg-gold-500/50 group-hover:bg-gold-500 transition-colors duration-300" />
              <div className="absolute -bottom-3 -left-3 h-px w-6 bg-gold-500/50 group-hover:bg-gold-500 transition-colors duration-300" />
            </div>
          </motion.div>

          {/* Right — Intro Copy */}
          <div className="flex flex-col items-start gap-6 text-left">
            <motion.span
              {...fadeUp(0)}
              className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600"
            >
              Our Expert
            </motion.span>

            <div className="flex flex-col gap-2">
              <motion.h2
                {...fadeUp(0.08)}
                className="font-display font-serif text-h3 font-medium text-navy-900 md:text-h2"
              >
                Meet Hayaett S Rahman
              </motion.h2>
              <motion.p
                {...fadeUp(0.14)}
                className="text-small font-medium uppercase tracking-[0.04em] text-text-secondary"
              >
                Vastu Expert, Numerologist &amp; Occult Science Practitioner
              </motion.p>
            </div>

            <motion.p
              {...fadeUp(0.2)}
              className="max-w-narrow text-body-lg text-text-secondary"
            >
              Hayaett S Rahman is a dedicated Vastu Expert, Numerologist, and Occult Science Practitioner with over four years of experience. Her journey into energy science began through a personal family experience that revealed the profound connection between numerical vibrations and daily life.
            </motion.p>

            <motion.p
              {...fadeUp(0.26)}
              className="max-w-narrow text-body-lg text-text-secondary"
            >
              Having trained under mentor Dr. Ankit Batra and served as a platform mentor herself, Hayaett focuses on decoding energy patterns rather than fortune-telling — offering grounded, personalized guidance for career, relationships, and personal growth.
            </motion.p>

            {/* Checkmark Highlights */}
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {HIGHLIGHTS.map((highlight, index) => (
                <motion.li
                  key={highlight}
                  {...fadeUp(0.32 + index * 0.05)}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex shrink-0 items-center justify-center text-gold-600 group-hover:scale-110 transition-transform duration-300">
                      <Check className="h-4 w-4 text-gold-600" strokeWidth={2.5} />
                    </span>
                    <span className="text-body font-medium text-navy-900 group-hover:text-gold-700 transition-colors duration-200">
                      {highlight}
                    </span>
                  </span>
                  {index < HIGHLIGHTS.length - 1 && (
                    <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
                  )}
                </motion.li>
              ))}
            </ul>

            {/* Action Buttons */}
            <motion.div
              {...fadeUp(0.42)}
              className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row pt-2"
            >
              <Button href="/book-consultation" size="md">
                Book Consultation
              </Button>
              <Button href="/about" variant="outline" size="md">
                Learn More About Us
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Expert;