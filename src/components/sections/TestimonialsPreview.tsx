"use client";

import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface TestimonialPlaceholder {
  quote: string;
  name: string;
  role: string;
}

/**
 * Three clearly-marked placeholders, per content.md's "Pending Content"
 * (real testimonials are still awaited from the client) and
 * content.md's Empty States rule: never fabricate a real-sounding quote —
 * label it plainly as placeholder content instead.
 */
const TESTIMONIALS: TestimonialPlaceholder[] = [
  {
    quote: "Client testimonial will appear here.",
    name: "Client Name",
    role: "Position",
  },
  {
    quote: "Client testimonial will appear here.",
    name: "Client Name",
    role: "Position",
  },
  {
    quote: "Client testimonial will appear here.",
    name: "Client Name",
    role: "Position",
  },
];

/**
 * TestimonialsPreview
 *
 * Homepage teaser section (docs/homepage-breakdown.md, Section 10) that
 * builds trust through client testimonials. Light editorial section,
 * per design-language.md §2. Real testimonials are still pending from the
 * client (content.md → "Pending Content"), so all three cards use clearly
 * labelled placeholder copy rather than fabricated quotes.
 *
 * Layout: centered SectionHeading, then a responsive 3/2/1-column grid of
 * 3 testimonial cards, followed by a centered "View All Testimonials" CTA
 * linking to /testimonials.
 */
const TestimonialsPreview = () => {
  const shouldReduceMotion = useReducedMotion();

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const cardVariants = shouldReduceMotion
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

  const ctaVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
        },
      };

  return (
    <section className="bg-warm-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          heading="Trusted by Clients Seeking Clarity"
          description="Real stories from clients are on their way — here's a preview of how they'll appear once shared."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10"
        >
          {TESTIMONIALS.map(({ quote, name, role }, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
              }
              className="h-full"
            >
              <Card hover={false} padding="lg" className="flex h-full flex-col hover:shadow-md">
                <span
                  aria-hidden="true"
                  className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600"
                >
                  <Quote className="h-6 w-6" strokeWidth={1.75} />
                </span>

                <CardContent className="flex-1">
                  <p className="text-body-lg font-heading italic text-text-secondary">
                    &ldquo;{quote}&rdquo;
                  </p>
                </CardContent>

                <CardFooter className="mt-lg flex-col items-start gap-0">
                  <span className="text-h6 font-medium text-navy-900">{name}</span>
                  <span className="text-small text-text-secondary">{role}</span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 flex justify-center"
        >
          <Button href="/testimonials" size="lg">
            View All Testimonials
          </Button>
        </motion.div>
      </Container>
    </section>
  );
};

export default TestimonialsPreview;