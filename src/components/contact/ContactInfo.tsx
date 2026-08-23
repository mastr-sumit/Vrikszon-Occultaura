"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Container from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CONTACT_ITEMS } from "@/data/contactDetails";

/**
 * ContactInfo
 *
 * A light-background section of elevated contact cards that sits directly
 * below ContactHero's dark treatment, creating strong visual contrast.
 *
 * Each of the 4 CONTACT_ITEMS (Phone, Email, Location, Working Hours) is
 * rendered in its own Card with a circular icon badge, label, and value.
 * Phone and Email values are clickable tel:/mailto: links; Location and
 * Working Hours are plain text.
 *
 * Grid: 1 col → 2 cols (md) → 4 cols (lg), matching Products.tsx.
 * Animation: staggered fade-up via Framer Motion variants, matching
 * Footer.tsx / Products.tsx pattern with useReducedMotion handling.
 */
const ContactInfo = () => {
  const shouldReduceMotion = useReducedMotion();

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const cardVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
        },
      };

  return (
    <section
      aria-label="Contact Information"
      className="bg-warm-white py-16 md:py-20 lg:py-24 xl:py-30"
    >
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Contact Info"
          heading={
            <>
              Ways to <span className="text-gold-600">Reach Us</span>
            </>
          }
          description="Whether you prefer a call, an email or a visit, we're always happy to connect with you."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-8"
        >
          {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
            <motion.div key={label} variants={cardVariants} className="h-full">
              <Card
                hover
                padding="lg"
                className="flex h-full flex-col items-center text-center"
              >
                {/* Circular icon badge */}
                <span
                  aria-hidden="true"
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>

                {/* Label */}
                <span className="mb-2 text-small font-semibold uppercase tracking-[0.08em] text-text-secondary">
                  {label}
                </span>

                {/* Value — clickable link for phone/email, plain text otherwise */}
                {href ? (
                  <a
                    href={href}
                    className="text-body font-medium text-navy-900 transition-colors duration-200 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded-sm"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-body font-medium text-navy-900">
                    {value}
                  </span>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default ContactInfo;
