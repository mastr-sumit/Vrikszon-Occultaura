"use client";

import {
  Award,
  Fingerprint,
  ListChecks,
  Lock,
  ShieldCheck,
  Sunrise,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import { MagicCard } from "@/components/ui/MagicCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  tag?: string;
  span?: string;
}

const FEATURES: Feature[] = [
  {
    icon: Fingerprint,
    title: "Personalized Guidance",
    description:
      "Every session is shaped around your unique birth chart numbers, name vibration, and specific life questions — never generic automated readings.",
    tag: "Core Focus",
    span: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Ethical & Honest Consultations",
    description:
      "Guidance is given with absolute integrity and care, completely free from fear-inducing claims or exaggerated promises.",
    tag: "Integrity",
    span: "lg:col-span-1",
  },
  {
    icon: Award,
    title: "Vedic Numerology + Vastu Synthesis",
    description:
      "Years of dedicated mastery harmonizing classical Numerology, Lo Shu grid patterns, and Vastu directional energetics into one actionable blueprint.",
    tag: "Dual Mastery",
    span: "lg:col-span-1",
  },
  {
    icon: Lock,
    title: "100% Confidential Sessions",
    description:
      "Your personal details, birth charts, and conversations remain strictly private, treated with the highest professional sanctity.",
    tag: "Private & Secure",
    span: "lg:col-span-1",
  },
  {
    icon: ListChecks,
    title: "Practical, Actionable Recommendations",
    description:
      "Every consultation ends with realistic, clear lifestyle and energetic steps you can apply immediately — never abstract predictions.",
    tag: "Results-Driven",
    span: "lg:col-span-1",
  },
  {
    icon: Sunrise,
    title: "Transformation Over Fortune Telling",
    description:
      "Our ultimate mission is empowering your inner clarity and spiritual confidence so you make elevated decisions for long-term prosperity.",
    tag: "Empowerment",
    span: "lg:col-span-3",
  },
];

/**
 * WhyChooseUs — 21st.dev Bento Grid & Magic Spotlight Upgrade
 *
 * Rebuilt as an asymmetric Bento Grid with MagicCard spotlight luminescence,
 * category badges, and high-trust copywriting.
 */
const WhyChooseUs = () => {
  const shouldReduceMotion = useReducedMotion();

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
    },
  };

  const cardVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <section className="relative overflow-hidden bg-warm-white py-12 md:py-16 lg:py-20">
      {/* Background radial atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,var(--color-gold-300)_0%,transparent_70%)] opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,var(--color-indigo-300)_0%,transparent_70%)] opacity-[0.05] blur-3xl" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-gold-500/60" />
            <span className="text-small font-semibold uppercase tracking-[0.15em] text-gold-600">
              Why Choose Us
            </span>
            <span className="h-px w-8 bg-gold-500/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-navy-950 tracking-tight">
            A Practice Built on <span className="text-gold-600 italic">Trust & Clarity</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Six sacred pillars that make Vrikszon Occultaura the trusted choice for authentic Numerology,
            Vastu alignment, and transformative life guidance.
          </p>
        </div>

        {/* 21st.dev Bento Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map(({ icon: Icon, title, description, tag, span }) => (
            <motion.div key={title} variants={cardVariants} className={cn("h-full", span)}>
              <MagicCard
                className="h-full border border-navy-900/10 bg-white/90 p-7 sm:p-8 hover:border-gold-500/50 hover:shadow-md transition-all group flex flex-col justify-between"
                gradientColor="rgba(212, 175, 55, 0.12)"
                gradientSize={260}
              >
                <div>
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 border border-gold-200 text-gold-700 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all duration-300">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>

                    {tag && (
                      <span className="rounded-full bg-navy-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-900/80 group-hover:bg-gold-50 group-hover:text-gold-700 transition-colors">
                        {tag}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-navy-950 mb-2.5 group-hover:text-gold-700 transition-colors">
                    {title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-navy-900/5 flex items-center gap-1 text-xs font-semibold text-gold-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Vrikszon Pillar</span>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
