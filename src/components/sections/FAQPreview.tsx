"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, Sparkles, HelpCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What happens during a full consultation session?",
    answer:
      "We begin by thoroughly decoding your birth chart, Mulank (Driver), and Bhagyank (Destiny). During our 1-on-1 private session, we walk step-by-step through your current Dasha cycles, life trajectory, relationship dynamics, and provide actionable remedies and name alignment suggestions.",
  },
  {
    question: "How long does a consultation take and how is it conducted?",
    answer:
      "A standard consultation runs for 45–60 minutes via private video call (Google Meet/Zoom) or in-person. Prior to the call, our Master Numerologist spends 2–3 days calculating your charts in depth.",
  },
  {
    question: "What details do I need to provide beforehand?",
    answer:
      "Your full official name and exact date of birth (Day, Month, Year) are essential. If you are requesting Vastu guidance, property compass directions or layout sketches are also helpful.",
  },
  {
    question: "Can Numerology and Vastu be combined in one consultation?",
    answer:
      "Yes! In fact, our Master Consultation Package covers both. Numerology aligns your personal and commercial vibrations, while Vastu aligns the spatial energy of your home and workplace.",
  },
  {
    question: "Do you offer online consultations for international clients?",
    answer:
      "Yes, we consult with clients across India and globally across different timezones via online private video sessions and digital PDF report delivery.",
  },
];

/**
 * FAQPreview — 21st.dev Animated Accordion & Glassmorphism Upgrade
 *
 * Smooth height-animated accordion with active gold border glows,
 * question numbering, and direct WhatsApp quick support.
 */
const FAQPreview = () => {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq-preview"
      aria-label="Frequently Asked Questions"
      className="relative overflow-hidden bg-warm-white py-12 md:py-16 lg:py-20 border-t border-navy-900/10"
    >
      <Container size="default">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-gold-500/60" />
            <span className="text-small font-semibold uppercase tracking-[0.15em] text-gold-600">
              Clarity & Transparency
            </span>
            <span className="h-px w-8 bg-gold-500/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-navy-950 tracking-tight">
            Frequently Asked <span className="text-gold-600 italic">Questions</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Find immediate answers to common questions regarding our consultation process,
            report delivery, and ancient Vedic remedial approach.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white transition-all duration-300 shadow-sm",
                  isOpen
                    ? "border-gold-500 shadow-[0_4px_20px_rgba(212,175,55,0.15)] ring-1 ring-gold-500/30"
                    : "border-navy-900/10 hover:border-gold-500/40"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                        isOpen
                          ? "bg-gold-500 text-navy-950"
                          : "bg-navy-900/5 text-navy-900/60"
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span className="font-heading text-lg sm:text-xl font-medium text-navy-950">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300",
                      isOpen ? "rotate-180 bg-gold-50 text-gold-700" : "text-gray-400"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { height: "auto", opacity: 1 }
                      }
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-navy-900/5 px-5 pb-6 pt-4 sm:px-6 sm:pb-7">
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Quick Help Bottom Strip */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-xs sm:text-sm text-text-secondary">
            Have a specific question not covered here?
          </p>

          <a
            href="https://wa.me/919999999999?text=Hello%20Vrikszon%20Occultaura,%20I%20have%20a%20question%20regarding%20consultations."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-all shadow-xs"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            <span>Ask Us Directly on WhatsApp</span>
          </a>
        </div>
      </Container>
    </section>
  );
};

export default FAQPreview;