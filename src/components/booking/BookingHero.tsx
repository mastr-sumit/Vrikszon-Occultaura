"use client";

import Link from "next/link";
import { ChevronRight, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";

/**
 * BookingHero
 *
 * An editorial page-hero for the Book Consultation page.
 * Shares the visual family of AboutHero.tsx / ContactHero.tsx / ServicesHero.tsx / ShopHero.tsx:
 * dark background (navy -> indigo gradient), soft gold glow, subtle celestial
 * dot-grid texture, and smooth animations via Framer Motion with
 * useReducedMotion handling.
 */
const BookingHero = () => {
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

  const highlights = [
    {
      icon: Calendar,
      label: "Flexible Scheduling",
      desc: "Select a date & time that suits your rhythm",
    },
    {
      icon: ShieldCheck,
      label: "100% Confidential",
      desc: "Private 1-on-1 personalized session",
    },
    {
      icon: Sparkles,
      label: "Actionable Insights",
      desc: "Clear remedies & practical guidance",
    },
  ];

  return (
    <section
      aria-label="Book a Consultation with Vrikszon Occultaura"
      className="relative overflow-hidden py-20 md:py-24 lg:py-30"
    >
      {/* Background — purely decorative: gradient + gold glow + celestial texture */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_55%,var(--color-indigo-900)_100%)]" />

        {/* Faint celestial dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient gold glow centered behind hero copy */}
        <div className="absolute left-1/2 top-1/3 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.14] blur-3xl md:h-[600px] md:w-[600px]" />

        {/* Decorative subtle sacred geometry ring in background */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07] md:h-[700px] md:w-[700px]">
          <svg viewBox="0 0 400 400" className="h-full w-full stroke-gold-400" fill="none" strokeWidth="1">
            <circle cx="200" cy="200" r="180" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="140" />
            <circle cx="200" cy="200" r="100" />
            <polygon points="200,60 321,270 79,270" strokeOpacity="0.6" />
            <polygon points="200,340 321,130 79,130" strokeOpacity="0.6" />
          </svg>
        </div>

        {/* Bottom fade — smooth transition into subsequent sections */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_75%,var(--color-navy-950)_100%)] opacity-70" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="mx-auto flex max-w-reading flex-col items-center gap-6 text-center">
          {/* Breadcrumb Navigation */}
          <motion.nav {...fadeUp(0, 0.6)} aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-small text-white/60">
              <li>
                <Link
                  href="/"
                  className={
                    "rounded-sm transition-colors duration-[200ms] ease-out hover:text-gold-400 " +
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 " +
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                  }
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-white/40" strokeWidth={1.75} />
              </li>
              <li aria-current="page" className="text-white/80">
                Book Consultation
              </li>
            </ol>
          </motion.nav>

          {/* Eyebrow badge */}
          <motion.span
            {...fadeUp(0.1, 0.7)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
          >
            Reserve Your Session
          </motion.span>

          {/* Main Headline */}
          <motion.h1
            {...fadeUp(0.2, 0.9)}
            className="text-balance font-display text-h2 font-medium text-white md:text-h1"
          >
            Begin Your Journey Toward{" "}
            <span className="text-gold-500">Clarity & Alignment</span>
          </motion.h1>

          {/* Supporting paragraph */}
          <motion.p
            {...fadeUp(0.35, 0.9)}
            className="text-body-lg text-white/70 max-w-[680px]"
          >
            Schedule your 1-on-1 consultation with our numerology and energetic guidance experts.
            Gain profound insights into your life path, career, relationships, and living space.
          </motion.p>

          {/* Highlight feature badges */}
          <motion.div
            {...fadeUp(0.5, 0.8)}
            className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-colors duration-200 hover:border-gold-500/30 hover:bg-white/[0.07]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-body-sm font-semibold text-white">
                    {item.label}
                  </h3>
                  <p className="text-small text-white/60">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default BookingHero;
