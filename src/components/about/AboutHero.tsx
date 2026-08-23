"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/**
 * AboutHero
 *
 * Single-column centered hero section for the About page.
 * Displays brand story intro with centered typography, CTAs, and a rich,
 * ambient celestial background featuring a subtle sacred-geometry watermark.
 */
const AboutHero = () => {
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
      aria-label="About Vrikszon Occultaura"
      className="relative overflow-hidden py-20 md:py-24 lg:py-30"
    >
      {/* Background — purely decorative: gradient + centered gold glow + celestial texture + watermark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Base navy-to-indigo gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_55%,var(--color-indigo-900)_100%)]" />

        {/* Very faint celestial dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Main centered ambient gold radial glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.14] blur-3xl md:h-[680px] md:w-[680px]" />

        {/* Dual subtle lateral glows for extra atmospheric depth */}
        <div className="absolute -left-[10%] top-1/3 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,var(--color-indigo-500)_0%,transparent_70%)] opacity-[0.08] blur-3xl" />
        <div className="absolute -right-[10%] top-1/3 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,var(--color-gold-400)_0%,transparent_70%)] opacity-[0.08] blur-3xl" />

        {/* Large-scale sacred-geometry watermark motif */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07] md:h-[800px] md:w-[800px]"
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 180, ease: "linear", repeat: Infinity }}
        >
          <svg viewBox="0 0 500 500" className="h-full w-full stroke-gold-400 fill-none" strokeWidth="1">
            <circle cx="250" cy="250" r="220" strokeOpacity="0.5" />
            <circle cx="250" cy="250" r="170" strokeOpacity="0.4" strokeDasharray="4 4" />
            <circle cx="250" cy="250" r="120" strokeOpacity="0.6" />
            <circle cx="190" cy="250" r="120" strokeOpacity="0.3" />
            <circle cx="310" cy="250" r="120" strokeOpacity="0.3" />
            <circle cx="250" cy="190" r="120" strokeOpacity="0.3" />
            <circle cx="250" cy="310" r="120" strokeOpacity="0.3" />
            {Array.from({ length: 12 }).map((_, index) => {
              const angle = (index / 12) * Math.PI * 2;
              const x1 = Number((250 + Math.cos(angle) * 120).toFixed(2));
              const y1 = Number((250 + Math.sin(angle) * 120).toFixed(2));
              const x2 = Number((250 + Math.cos(angle) * 220).toFixed(2));
              const y2 = Number((250 + Math.sin(angle) * 220).toFixed(2));
              return (
                <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.4" />
              );
            })}
          </svg>
        </motion.div>

        {/* Bottom fade — smooth transition into the next About section */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_75%,var(--color-navy-950)_100%)] opacity-70" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-6">
          <motion.nav {...fadeUp(0, 0.6)} aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 text-small text-white/60">
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
                About
              </li>
            </ol>
          </motion.nav>

          <motion.span
            {...fadeUp(0.1, 0.7)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
          >
            About Vrikszon Occultaura
          </motion.span>

          <motion.h1
            {...fadeUp(0.2, 0.9)}
            className="text-balance font-display text-h2 font-medium text-white md:text-h1"
          >
            A Practice Built on{" "}
            <span className="text-gold-500">Clarity</span>, Not Prediction
          </motion.h1>

          <motion.p
            {...fadeUp(0.35, 0.9)}
            className="max-w-2xl text-body-lg text-white/70"
          >
            Vrikszon Occultaura was founded on a simple belief: Numerology
            and Vastu are tools for reflection and direction, not
            fortune-telling. Every consultation begins with your own
            questions, offering a calm, honest space to understand
            yourself more clearly and move forward with confidence.
          </motion.p>

          <motion.div
            {...fadeUp(0.5, 0.7)}
            className="mt-2 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <Button href="/book-consultation" size="lg">
              Book a Consultation
            </Button>
            <Button
              href="/services"
              variant="secondary"
              size="lg"
              className="border-white/30 text-white hover:border-gold-500 hover:bg-white/5 hover:text-gold-400"
            >
              Explore Services
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;