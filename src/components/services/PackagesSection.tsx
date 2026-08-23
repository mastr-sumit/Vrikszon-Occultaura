"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Clock, Sparkles, ArrowRight, ShieldCheck, MessageCircle, FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { PACKAGES } from "@/data/packages";
import { formatPrice } from "@/data/services";

/**
 * PackagesSection — Enhanced with 21st.dev BorderBeam & High-Trust Hierarchy
 *
 * Featured master consultation package card with animated glowing border,
 * comprehensive 21-area checklist, and direct dual booking CTAs.
 */
const PackagesSection = () => {
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
          initial: { opacity: 0, y: 32 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="consultation-packages"
      aria-label="Consultation Package"
      className="relative overflow-hidden bg-navy-950 py-16 md:py-24 lg:py-32"
    >
      {/* Background atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_20%,color-mix(in_srgb,var(--color-indigo-900)_35%,transparent)_0%,var(--color-navy-950)_90%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.08] blur-3xl" />
      </div>

      <Container size="wide" className="relative z-10">
        {/* Intro Copy */}
        <motion.div
          {...fadeUp(0)}
          className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="h-px w-8 bg-gold-500/60" />
            <span className="text-small font-semibold uppercase tracking-[0.15em] text-gold-400">
              All-Inclusive Master Report
            </span>
            <span className="h-px w-8 bg-gold-500/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight">
            One Comprehensive Report. <span className="text-gold-400 italic">Complete Solutions.</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
            Receive a master consultation and structured 30-page PDF report covering all 21 key areas of
            Numerology, Vastu, KP Astrology, and personalized remedial gems tailored to your birth chart.
          </p>
        </motion.div>

        {/* Package Card Container */}
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          {PACKAGES.filter((pkg) => pkg.enabled).map((pkg) => (
            <motion.div
              key={pkg.id}
              {...fadeUp(0.15)}
              className="relative w-full rounded-2xl border-2 border-gold-500/40 bg-navy-900/80 p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden shadow-gold-glow"
            >
              {/* 21st.dev Animated Border Beam */}
              <BorderBeam size={360} duration={12} colorFrom="#d4af37" colorTo="#3d2a79" />

              {/* Featured Ribbon */}
              {pkg.featured && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] text-gold-300 mb-6 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                  Featured Master Package
                </div>
              )}

              {/* Header & Price Bar */}
              <div className="flex w-full flex-col gap-6 border-b border-gold-500/20 pb-8 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2 text-left">
                  <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium text-white">
                    {pkg.name}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-gold-300">
                    {pkg.tagline}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-300">
                    <span className="flex items-center gap-1 text-gold-400">
                      <Clock className="h-4 w-4" />
                      Turnaround: <strong className="text-white ml-1">{pkg.turnaround}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gold-400">
                      <ShieldCheck className="h-4 w-4" />
                      100% Confidential
                    </span>
                  </div>
                </div>

                <div className="flex flex-col text-left md:items-end md:text-right shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Complete Consultation Investment
                  </span>
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-gold-400">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
              </div>

              {/* Checklist Section — 2 Columns */}
              <div className="my-8 rounded-xl bg-navy-950/60 border border-gold-500/20 p-6 sm:p-8">
                <h4 className="font-heading text-lg sm:text-xl font-medium text-gold-300 mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold-400" />
                  What is included in your Master Consultation:
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(pkg.includes || []).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-gray-400 text-center sm:text-left">
                  🔒 Detailed private preparation before session • 1-on-1 personalized discussion
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Button
                    href="/book-consultation"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto bg-gold-500 text-navy-950 font-bold hover:bg-gold-400 shadow-gold-glow"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Request Master Session
                  </Button>

                  <a
                    href="https://wa.me/919999999999?text=Hello%20Vrikszon%20Occultaura,%20I%20am%20interested%20in%20the%20Master%20Consultation%20Package."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] h-[52px] px-6 text-xs font-semibold text-emerald-300 border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    Quick WhatsApp Consultation
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PackagesSection;
