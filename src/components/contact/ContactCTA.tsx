"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * ContactCTA
 *
 * Closing WhatsApp-forward CTA banner for the /contact page.
 * Placed immediately after ContactForm as the final section before Footer
 * in src/data/contactSections.ts.
 *
 * Dark navy/indigo atmosphere (matching CTASection.tsx on the homepage),
 * maintaining the visual rhythm (ContactInfo light → ContactForm light → ContactCTA dark).
 *
 * WhatsApp link uses placeholder `href="#"` (flagged as pending real WhatsApp link,
 * matching the pattern in Footer.tsx).
 */
const ContactCTA = () => {
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
      aria-label="Direct WhatsApp Contact"
      className="relative overflow-hidden py-16 md:py-20 lg:py-24 xl:py-30"
    >
      {/* Background atmosphere — purely decorative navy/indigo gradient with gold glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-900)_0%,var(--color-navy-800)_45%,var(--color-indigo-900)_100%)]" />

        <div
          className={cn(
            "absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full",
            "bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.12] blur-3xl",
            "md:h-[560px] md:w-[560px]"
          )}
        />
      </div>

      <Container size="default" className="relative z-10">
        <div className="mx-auto flex max-w-narrow flex-col items-center gap-6 text-center">
          <motion.span
            {...fadeUp(0)}
            className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500"
          >
            Direct Connect
          </motion.span>

          <motion.h2
            {...fadeUp(0.1)}
            className="font-heading text-h3 font-medium text-white md:text-h2"
          >
            Prefer to Chat Directly?
          </motion.h2>

          <motion.p {...fadeUp(0.2)} className="text-body-lg text-white/70">
            Reach out via WhatsApp for fast, direct answers about our Numerology or Vastu guidance, or to schedule a consultation.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-4 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            {/*
              * WHATSAPP CTA LINK
              * Linked directly to the client's confirmed WhatsApp contact number (+91 90731 90525).
              */}
            <Button
              href="https://wa.me/919073190525"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              leftIcon={<MessageCircle className="h-5 w-5" strokeWidth={1.75} />}
            >
              Chat on WhatsApp
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ContactCTA;
