"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { UserCheck, Compass, Feather } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/**
 * The 3 highlight rows — refined from a plain checklist into elegant
 * icon + title + supporting-text rows.
 */
interface AboutHighlight {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    icon: UserCheck,
    title: "Personalized Guidance",
    description: "Every session is shaped around your own numbers and questions.",
  },
  {
    icon: Compass,
    title: "Practical Insights",
    description: "Clear, grounded direction you can act on — never abstract prediction.",
  },
  {
    icon: Feather,
    title: "Clarity & Harmony",
    description: "A calmer, more confident way to understand yourself and choose.",
  },
];

/**
 * About
 *
 * Homepage "About" section — introduces the brand/practice, philosophy,
 * and approach to Numerology & Vastu. Deliberately NOT a founder
 * profile (no portrait, bio, or credentials) — that's the separate,
 * later Expert.tsx section. Self-contained: does not import or render
 * any other homepage section.
 */
const About = () => {
  const shouldReduceMotion = useReducedMotion();

  // Shared fade-up reveal — opacity + Y only, medium/600ms, ease-out
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
    <section className="relative overflow-hidden bg-warm-white py-12 md:py-16 lg:py-20">
      {/* Background depth — subtle radial gradients and texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -right-[8%] -top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--color-gold-300)_0%,transparent_70%)] opacity-[0.07] blur-3xl" />
        <div className="absolute -left-[10%] bottom-[-12%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,var(--color-indigo-300)_0%,transparent_70%)] opacity-[0.05] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(8,20,35,0.6) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_50%,transparent_60%,color-mix(in_srgb,var(--color-navy-900)_6%,transparent)_100%)]" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Left — Brand Logo wordmark stacked above the ornate gold zodiac wheel */}
          <div className="flex w-full flex-col items-center justify-center gap-1 sm:gap-2 lg:gap-2.5">
            {/* Brand Logo Wordmark */}
            <motion.div
              {...fadeUp(0.05)}
              className="relative flex items-center justify-center w-full"
            >
              <Image
                src="/images/brand-logo-wordmark.png"
                alt="Vrikszon Occultaura"
                width={1024}
                height={408}
                priority
                className="h-auto w-[320px] xs:w-[360px] sm:w-[400px] md:w-[440px] lg:w-[480px] xl:w-[520px] max-w-full object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.18)]"
              />
            </motion.div>

            <motion.div
              className="relative aspect-square w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px]"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -350, rotate: -360 }
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
              {/* Static ambient golden aura behind wheel — no rotation/filter distortion on PNG */}
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
                  src="/images/about/numerology-wheel.png"
                  alt="Ornate gold zodiac and numerology wheel"
                  fill
                  quality={95}
                  priority
                  sizes="(max-width: 768px) 360px, (max-width: 1024px) 420px, 460px"
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right — eyebrow, heading, practice description, highlights, CTA */}
          <div className="flex flex-col items-start gap-8 text-left">
            <motion.span
              {...fadeUp(0.15)}
              className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600"
            >
              About Us
            </motion.span>

            <motion.h2
              {...fadeUp(0.25)}
              className="max-w-[18ch] text-balance font-display text-h3 font-medium leading-[1.15] text-navy-900 md:text-h2"
            >
              Empowering Lives Through Numerology, Vastu &amp; Occult Wisdom
            </motion.h2>

            <div className="flex flex-col gap-4">
              <motion.p {...fadeUp(0.4)} className="max-w-[46ch] text-body-lg text-text-secondary">
                Vrikszon Occultaura is a trusted platform combining Numerology, Vastu, and Occult Wisdom to help individuals, families, and businesses navigate life choices with clarity and confidence.
              </motion.p>

              <motion.p {...fadeUp(0.46)} className="max-w-[46ch] text-body-lg text-text-secondary">
                Rather than offering rigid predictions, we focus on understanding underlying energy patterns in numbers and physical spaces — empowering you to resolve blockages, unlock potential, and cultivate long-term growth, harmony, and prosperity.
              </motion.p>
            </div>

            {/* Staggered list items for highlights */}
            <ul className="flex w-full flex-col gap-5">
              {ABOUT_HIGHLIGHTS.map(({ icon: Icon, title, description }, idx) => (
                <motion.li
                  key={title}
                  {...fadeUp(0.58 + idx * 0.1)}
                  className="flex items-start gap-4 group cursor-default"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-gold-600 transition-all duration-300 group-hover:scale-110 group-hover:border-gold-400 group-hover:bg-gold-50/80 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                  >
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" strokeWidth={1.75} />
                  </span>
                  <div className="flex flex-col gap-0.5 pt-1">
                    <span className="text-body font-medium text-navy-900 group-hover:text-gold-700 transition-colors duration-200">{title}</span>
                    <span className="text-small text-text-secondary">{description}</span>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div {...fadeUp(0.88)}>
              <Button
                href="/about"
                size="md"
                className="rounded-full shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Discover Our Story
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;