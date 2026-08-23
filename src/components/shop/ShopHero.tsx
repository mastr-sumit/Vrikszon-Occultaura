"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";

/**
 * ShopHero
 *
 * An editorial page-hero for the Shop listing page.
 * Shares the visual family of AboutHero.tsx / ContactHero.tsx / ServicesHero.tsx:
 * dark background (navy -> indigo gradient), soft gold glow, subtle celestial
 * dot-grid texture, and smooth scroll animations via Framer Motion with
 * useReducedMotion handling.
 */
const ShopHero = () => {
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
      aria-label="Vrikszon Occultaura Shop"
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

        {/* Soft gold glow centered behind hero copy */}
        <div className="absolute left-1/2 top-1/3 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.12] blur-3xl md:h-[600px] md:w-[600px]" />

        {/* Bottom fade — smooth transition into the light ShopGrid section below */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_75%,var(--color-navy-950)_100%)] opacity-70" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="mx-auto flex max-w-reading flex-col items-center gap-4 text-center">
          {/* Breadcrumb Navigation */}
          <motion.nav {...fadeUp(0, 0.6)} aria-label="Breadcrumb" className="mb-2">
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
                Shop
              </li>
            </ol>
          </motion.nav>

          {/* Eyebrow badge */}
          <motion.span
            {...fadeUp(0.1, 0.7)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
          >
            Sacred Catalogue & Spiritual Tools
          </motion.span>

          {/* Main Headline */}
          <motion.h1
            {...fadeUp(0.2, 0.9)}
            className="text-balance font-display text-h2 font-medium text-white md:text-h1"
          >
            Harmonize Your Energy with{" "}
            <span className="text-gold-500">Sacred Tools</span>
          </motion.h1>

          {/* Supporting paragraph */}
          <motion.p
            {...fadeUp(0.35, 0.9)}
            className="text-body-lg text-white/70"
          >
            Explore our curated catalogue of authentic natural crystals, sacred Rudraksha malas,
            intentionally crafted healing bracelets, and Vastu energizers — each piece chosen
            to support balance, protection, and mindful everyday living.
          </motion.p>
        </div>
      </Container>
    </section>
  );
};

export default ShopHero;
