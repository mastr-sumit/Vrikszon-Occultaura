"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Hash, Briefcase, Signature, Smartphone, Compass, Sparkles, ArrowRight, type LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { SERVICE_CATEGORIES, type ServiceCategoryIcon } from "@/data/serviceCategories";

/** Maps each category's stable icon key to its Lucide component — keeps serviceCategories.ts free of any UI/React dependency. */
const ICONS: Record<ServiceCategoryIcon, LucideIcon> = {
  hash: Hash,
  briefcase: Briefcase,
  signature: Signature,
  smartphone: Smartphone,
  compass: Compass,
  sparkles: Sparkles,
};

/**
 * ServicesPreview ("Our Services")
 *
 * The homepage's stable editorial category grid — deliberately distinct
 * from EsteemServices.tsx (a horizontally scrolling, commerce-styled
 * carousel of paid consultations). This section has no prices and no
 * cart; it exists purely to orient visitors toward the right area of
 * guidance before they explore further. Content comes entirely from
 * src/data/serviceCategories.ts.
 *
 * Card treatment is intentionally different from EsteemServices: an
 * outlined (not filled) icon ring, a thin static gold corner accent,
 * and a light bordered surface — editorial and still, rather than
 * commerce-glossy and moving.
 */
const ServicesPreview = () => {
  const shouldReduceMotion = useReducedMotion();

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 },
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

  return (
    <section className="bg-warm-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Our Services"
          heading="Explore Guidance for Every Area of Life"
          description="From personal clarity to business decisions and the spaces you live and work in, each area of guidance is grounded in the same calm, practical approach."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-8"
        >
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = ICONS[category.icon];

            return (
              <motion.div key={category.id} variants={cardVariants} className="h-full">
                <Card
                  hover={false}
                  padding="lg"
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden",
                    "transition-[transform,box-shadow,border-color] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:border-gold-500/40 hover:shadow-md motion-safe:hover:-translate-y-2"
                  )}
                >
                  {/* Thin decorative corner accent — static, editorial, distinct from EsteemServices' filled-icon commerce look. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 h-10 w-10 border-r border-t border-gold-500/30 [border-top-right-radius:20px]"
                  />

                  <CardHeader>
                    <span
                      aria-hidden="true"
                      className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-gold-500/50 text-navy-900"
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <CardTitle>{category.title}</CardTitle>
                  </CardHeader>

                  <CardDescription className="flex-1">{category.description}</CardDescription>

                  <CardFooter className="mt-auto pt-6">
                    <Link
                      href={category.href}
                      className={cn(
                        "group inline-flex items-center gap-2 text-body font-semibold text-navy-900 rounded-[4px]",
                        "transition-colors duration-[200ms] ease-out hover:text-gold-600",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                      )}
                    >
                      <span className="relative">
                        Explore Service
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 transition-transform duration-[200ms] ease-out group-hover:scale-x-100"
                        />
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-[200ms] ease-out group-hover:translate-x-1"
                      />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Button href="/services" size="lg">
            View All Services
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ServicesPreview;