"use client";

import Link from "next/link";
import { ChevronRight, Award, Users, BookOpen, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";

/**
 * CoursesHero
 *
 * Editorial page-hero for the Courses listing page.
 * Shares the visual family of ShopHero.tsx / ServicesHero.tsx:
 * dark navy/indigo gradient, subtle gold glow, celestial texture,
 * and Framer Motion staggered animations.
 */
const CoursesHero = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number, duration = 0.8) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      aria-label="Vrikszon Occultaura Academy & Courses"
      className="relative overflow-hidden py-20 md:py-24 lg:py-30"
    >
      {/* Background — decorative gradient + gold glow + celestial texture */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_55%,var(--color-indigo-900)_100%)]" />

        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="absolute left-1/2 top-1/3 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.12] blur-3xl md:h-[600px] md:w-[600px]" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_75%,var(--color-navy-950)_100%)] opacity-70" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="mx-auto flex max-w-reading flex-col items-center gap-4 text-center">
          {/* Breadcrumb */}
          <motion.nav
            aria-label="Breadcrumb"
            {...fadeUp(0, 0.6)}
            className="flex items-center gap-2 text-small text-white/60"
          >
            <Link
              href="/"
              className="transition-colors duration-[200ms] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 rounded-sm"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
            <span className="text-gold-400 font-medium" aria-current="page">
              Courses
            </span>
          </motion.nav>

          {/* Section pill */}
          <motion.div
            {...fadeUp(0.08, 0.6)}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            <span className="text-caption font-semibold uppercase tracking-wider text-gold-300">
              Occult Academy & Certifications
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            {...fadeUp(0.16)}
            className="font-heading text-display font-medium text-white"
          >
            Master Sacred Sciences & Transform Lives
          </motion.h1>

          {/* Subheading copy */}
          <motion.p
            {...fadeUp(0.24)}
            className="text-body-lg text-white/80 max-w-[680px]"
          >
            Comprehensive professional training in Vedic Numerology, Vastu Shastra,
            Mobile Vibration Science, and Energy Healing designed for passionate learners
            and aspiring occult consultants.
          </motion.p>

          {/* Quick highlight stats */}
          <motion.div
            {...fadeUp(0.32)}
            className="mt-6 grid grid-cols-3 gap-4 md:gap-8 rounded-2xl border border-white/10 bg-white/5 p-4 md:px-8 backdrop-blur-sm text-center"
          >
            <div className="flex flex-col items-center gap-1">
              <Award className="h-5 w-5 text-gold-400" />
              <span className="font-heading text-h5 font-bold text-white">100%</span>
              <span className="text-caption text-white/60">Verified Certifications</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-white/10">
              <Users className="h-5 w-5 text-gold-400" />
              <span className="font-heading text-h5 font-bold text-white">500+</span>
              <span className="text-caption text-white/60">Students Mentored</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <BookOpen className="h-5 w-5 text-gold-400" />
              <span className="font-heading text-h5 font-bold text-white">Live + Recorded</span>
              <span className="text-caption text-white/60">Lifetime Access</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default CoursesHero;
