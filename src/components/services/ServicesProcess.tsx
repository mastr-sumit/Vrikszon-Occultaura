"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileEdit, Search, Video, Sparkles, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const STEPS = [
  {
    step: "01",
    icon: FileEdit,
    title: "Share Your Birth & Space Details",
    description:
      "Provide your official date of birth, name, phone number, and residential/commercial layout during the initial consultation request.",
  },
  {
    step: "02",
    icon: Search,
    title: "In-Depth 21-Point Vedic Audit",
    description:
      "Our Master Numerologist conducts a comprehensive 2–3 days calculation across your Mulank, Bhagyank, Loshu Grid, KP Dasha cycles, and Vastu directions.",
  },
  {
    step: "03",
    icon: Video,
    title: "Private 1-on-1 Consultation Session",
    description:
      "Join a dedicated, confidential video or in-person session to discuss every question regarding career, marriage, health, finances, and life trajectory.",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Tailored Remedial Blueprint",
    description:
      "Receive your complete personalized 30-page PDF report with exact name corrections, energized gemstone recommendations, and non-demolition Vastu remedies.",
  },
];

/**
 * ServicesProcess — UI/UX Pro Max 4-Step Consultation Journey
 *
 * Explains the clear step-by-step path from booking to results, reducing customer
 * anxiety and building strong trust before action.
 */
export default function ServicesProcess() {
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
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      aria-label="How our consultation works"
      className="relative overflow-hidden bg-warm-white py-16 md:py-24 lg:py-30 border-t border-navy-900/10"
    >
      <Container size="wide">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-gold-500/60" />
            <span className="text-small font-semibold uppercase tracking-[0.15em] text-gold-600">
              The Sacred Journey
            </span>
            <span className="h-px w-8 bg-gold-500/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-navy-950 tracking-tight">
            How Our <span className="text-gold-600 italic">Consultation Works</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            A structured, transparent, and deeply supportive process designed to answer your questions and provide actionable solutions.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                {...fadeUp(idx * 0.1)}
                className="relative flex flex-col justify-between rounded-2xl border border-navy-900/10 bg-white p-6 sm:p-8 shadow-sm hover:border-gold-500/50 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading text-3xl font-bold text-gold-600/50 group-hover:text-gold-600 transition-colors">
                      {step.step}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 border border-gold-200 text-gold-700 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-navy-950 mb-3 group-hover:text-gold-700 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-navy-900/5 flex items-center gap-1.5 text-xs font-semibold text-gold-700">
                  <span>Step {step.step} Complete</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Strip */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-14 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-indigo-950 p-8 sm:p-10 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-heading text-2xl text-white font-medium">
              Ready to begin your consultation journey?
            </h4>
            <p className="text-xs sm:text-sm text-gray-300">
              Schedule your personalized 1-on-1 consultation session with our expert practitioner today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              href="/book-consultation"
              variant="primary"
              size="md"
              className="bg-gold-500 text-navy-950 font-bold hover:bg-gold-400"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Book Your Session
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="md"
              className="border-gold-500 text-gold-300 hover:bg-gold-500/15"
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
