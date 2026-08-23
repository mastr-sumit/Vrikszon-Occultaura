"use client";

import { Calendar, MessageSquare, Compass, CheckCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";

/**
 * HowItWorks ("What Happens After You Book")
 *
 * Dedicated process section for /book-consultation page.
 * Placed immediately after BookingForm in src/data/bookingPageSections.ts.
 * Dark navy/indigo background, continuing the established light/dark
 * alternation pattern after BookingForm's light background.
 *
 * Answers "what happens next?" to reduce user anxiety and establish complete
 * transparency in the consultation journey.
 *
 * Features:
 * - 4-step process using confirmed project details (2–3 days turnaround, remedies, birth details, all queries addressed).
 * - Desktop: 4 horizontal cards connected by a subtle gold line.
 * - Tablet: 2x2 grid layout.
 * - Mobile: Vertical timeline layout with vertical gold line.
 * - Framer Motion stagger reveal with useReducedMotion support.
 */

const STEPS = [
  {
    number: "01",
    title: "Book Your Slot",
    description: "Submit your consultation request form with your preferred service and date.",
    icon: Calendar,
  },
  {
    number: "02",
    title: "Share Your Details",
    description: "Provide birth details and specific questions or life areas you wish to discuss.",
    icon: MessageSquare,
  },
  {
    number: "03",
    title: "Expert Analysis",
    description: "In-depth chart analysis and report preparation with a confirmed 4–5 days turnaround.",
    icon: Compass,
  },
  {
    number: "04",
    title: "Receive Your Report",
    description: "Private consultation & comprehensive report with practical remedies for all queries.",
    icon: CheckCircle,
  },
];

const HowItWorks = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.6, delay, ease: [0, 0, 0.2, 1] as const },
        };

  const cardReveal = (index: number) =>
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
          transition: {
            duration: 0.6,
            delay: 0.2 + index * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  const lineDrawHorizontal = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { scaleX: 0, opacity: 0 },
        whileInView: { scaleX: 1, opacity: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  const lineDrawVertical = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { scaleY: 0, opacity: 0 },
        whileInView: { scaleY: 1, opacity: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      aria-label="How the consultation process works"
      className="relative overflow-hidden py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Dark background atmosphere — navy -> indigo gradient + soft gold glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_55%,var(--color-indigo-900)_100%)]" />

        {/* Soft gold radial glow, centered */}
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.10] blur-3xl md:h-[600px] md:w-[600px]" />

        {/* Faint celestial grid texture */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Container size="wide" className="relative z-10">
        {/* Section Heading */}
        <div className="mx-auto flex max-w-reading flex-col items-center gap-4 text-center">
          <motion.span
            {...fadeUp(0)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
          >
            Transparent Process
          </motion.span>

          <motion.h2
            {...fadeUp(0.08)}
            className="text-balance font-display text-h3 font-medium text-white md:text-h2"
          >
            What Happens <span className="text-gold-500">After You Book</span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.16)}
            className="text-body-lg text-white/70 max-w-[660px]"
          >
            Our streamlined 4-step consultation journey ensures total clarity, thorough analysis, and actionable guidance for every query.
          </motion.p>
        </div>

        {/* ================= Desktop (lg+): horizontal 4-step timeline ================= */}
        <div className="relative mt-16 hidden lg:block">
          {/* Connecting gold line running behind the number badges */}
          <motion.div
            {...lineDrawHorizontal}
            aria-hidden="true"
            style={{ transformOrigin: "left center" }}
            className="absolute left-[12.5%] right-[12.5%] top-[28px] h-px bg-[linear-gradient(90deg,transparent_0%,var(--color-gold-500)_10%,var(--color-gold-500)_90%,transparent_100%)] opacity-60"
          />

          <div className="grid grid-cols-4 gap-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  {...cardReveal(index)}
                  className="relative flex flex-col gap-4 rounded-xl border border-white/[0.12] bg-white/[0.05] p-6 backdrop-blur-sm transition-all duration-200 hover:border-gold-500/40 hover:bg-white/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 font-heading text-h5 font-bold text-navy-950 shadow-md"
                    >
                      {step.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>
                  <h3 className="font-heading text-h5 font-medium text-white">
                    {step.title}
                  </h3>
                  <p className="text-small text-white/70">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= Tablet (sm–lg): 2x2 grid ================= */}
        <div className="mt-14 hidden sm:grid sm:grid-cols-2 sm:gap-6 lg:hidden">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                {...cardReveal(index)}
                className="flex flex-col gap-4 rounded-xl border border-white/[0.12] bg-white/[0.05] p-6 backdrop-blur-sm transition-all duration-200 hover:border-gold-500/40 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 font-heading text-h5 font-bold text-navy-950 shadow-md"
                  >
                    {step.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                </div>
                <h3 className="font-heading text-h5 font-medium text-white">
                  {step.title}
                </h3>
                <p className="text-small text-white/70">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ================= Mobile (<sm): vertical timeline ================= */}
        <div className="relative mt-14 flex flex-col gap-8 sm:hidden">
          <motion.div
            {...lineDrawVertical}
            aria-hidden="true"
            style={{ transformOrigin: "top center" }}
            className="absolute left-7 top-2 bottom-2 w-px bg-[linear-gradient(180deg,transparent_0%,var(--color-gold-500)_8%,var(--color-gold-500)_92%,transparent_100%)] opacity-60"
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.number} {...cardReveal(index)} className="relative flex gap-4">
                <span
                  aria-hidden="true"
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 font-heading text-h6 font-bold text-navy-950 shadow-md"
                >
                  {step.number}
                </span>
                <div className="flex flex-1 flex-col gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20"
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-heading text-h6 font-medium text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-small text-white/70">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
