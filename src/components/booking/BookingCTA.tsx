"use client";

import { MessageCircle, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/**
 * BookingCTA
 *
 * Closing reassurance & direct WhatsApp CTA banner for /book-consultation.
 * Placed immediately after HowItWorks in src/data/bookingPageSections.ts.
 * Light background (bg-warm-white), continuing the established light/dark
 * alternation pattern (BookingHero [dark] → BookingForm [light] → HowItWorks [dark] → BookingCTA [light]).
 *
 * Provides a low-friction alternative path for visitors who prefer a direct
 * conversation before or instead of submitting the main booking form.
 */
const BookingCTA = () => {
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

  return (
    <section
      aria-label="Direct consultation inquiry via WhatsApp"
      className="relative overflow-hidden bg-warm-white py-16 md:py-20 lg:py-24 xl:py-30 border-t border-navy-900/10"
    >
      <Container size="default" className="relative z-10">
        <div className="mx-auto flex max-w-narrow flex-col items-center gap-6 text-center">
          <motion.span
            {...fadeUp(0)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600"
          >
            Direct Assistance
          </motion.span>

          <motion.h2
            {...fadeUp(0.1)}
            className="font-heading text-h3 font-medium text-navy-950 md:text-h2"
          >
            Prefer to Reach Out Directly?
          </motion.h2>

          <motion.p {...fadeUp(0.2)} className="text-body-lg text-navy-800/80">
            All your queries will be discussed in complete detail. If you have immediate questions before filling out the form or prefer to arrange your session via chat, connect with us directly on WhatsApp.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-4 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <Button
              href="https://wa.me/919073190525"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              leftIcon={<MessageCircle className="h-5 w-5" strokeWidth={1.75} />}
              className="w-full sm:w-auto shadow-md"
            >
              Chat on WhatsApp
            </Button>
            <Button
              href="/services"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" strokeWidth={1.75} />}
              className="w-full sm:w-auto"
            >
              Explore All Services
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default BookingCTA;
