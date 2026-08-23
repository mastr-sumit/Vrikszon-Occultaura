"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Meteors } from "@/components/ui/Meteors";
import { cn } from "@/lib/utils";

/**
 * CTASection — 21st.dev BorderBeam & Celestial Meteors Final Conversion Upgrade
 *
 * Final high-converting homepage moment before the footer.
 * Features animated glowing border beams, shooting meteors, and direct consultation booking actions.
 */
const CTASection = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      aria-label="Book a consultation"
      className="relative overflow-hidden bg-navy-950 py-12 md:py-16 lg:py-20"
    >
      {/* Background atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Base dark cosmic gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_45%,var(--color-indigo-950)_100%)]" />

        {/* 21st.dev Celestial Shooting Stars */}
        <Meteors number={10} className="opacity-60" />

        {/* Soft gold glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.14] blur-3xl" />
      </div>

      <Container size="default" className="relative z-10">
        {/* Main Floating Glass Capsule Card with BorderBeam */}
        <motion.div
          {...fadeUp(0)}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-gold-500/40 bg-navy-900/80 p-8 sm:p-12 md:p-14 text-center shadow-2xl backdrop-blur-xl shadow-gold-glow"
        >
          {/* 21st.dev Animated Glowing Border */}
          <BorderBeam size={320} duration={12} colorFrom="#d4af37" colorTo="#3d2a79" />

          <div className="flex flex-col items-center gap-5">
            {/* Top Eyebrow Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 border border-gold-500/40 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Begin Your Elevation
            </span>

            {/* Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight">
              Ready to Discover Your <span className="text-gold-400 italic">True Cosmic Path?</span>
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
              Book a private 1-on-1 consultation to unlock deep clarity across your career, wealth,
              relationships, and living space through authentic Vedic guidance.
            </p>

            {/* Dual CTAs */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button
                href="/book-consultation"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-gold-500 text-navy-950 font-bold hover:bg-gold-400 shadow-gold-glow"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Book 1-on-1 Consultation
              </Button>

              <a
                href="https://wa.me/919999999999?text=Hello%20Vrikszon%20Occultaura,%20I%20would%20like%20to%20book%20a%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] h-[52px] px-6 text-xs font-semibold text-emerald-300 border border-emerald-500/40 bg-emerald-950/50 hover:bg-emerald-900/60 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Quick WhatsApp Consultation
              </a>
            </div>

            {/* Reassurance text */}
            <p className="mt-2 text-xs text-gray-400">
              🔒 100% Confidential • 2–3 Days In-Depth Chart Preparation • Practical Remedies
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTASection;