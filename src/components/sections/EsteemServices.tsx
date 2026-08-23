"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/data/services";
import { ServiceCard, SacredGeometryPattern } from "@/components/services/ServiceCard";

/** How often the carousel auto-advances (ms). Calm and premium, not fast. */
const AUTO_ADVANCE_INTERVAL = 4200;
/** How long after user interaction before auto-advance resumes (ms). */
const RESUME_AFTER_INTERACTION = 3000;
/** Fraction of the visible track width to move per step/press. */
const SCROLL_STEP_RATIO = 0.85;

/**
 * EsteemServices ("Our Esteemed Services")
 *
 * Homepage carousel of 6 curated paid consultation services + 1 Explore All card.
 */
const EsteemServices = () => {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeServices = SERVICES.filter(
    (service) => service.enabled && service.featured
  );

  const totalCards = activeServices.length + 1; // 6 services + 1 Explore All card

  const pauseThenResume = useCallback(() => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, RESUME_AFTER_INTERACTION);
  }, []);

  const handleTrackScroll = useCallback(() => {
    pauseThenResume();
    const track = trackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return;
    const fraction = scrollLeft / maxScroll;
    const newIndex = Math.min(
      Math.round(fraction * (totalCards - 1)),
      totalCards - 1
    );
    setActiveIndex(newIndex);
  }, [pauseThenResume, totalCards]);

  const scrollByStep = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({
        left: direction * track.clientWidth * SCROLL_STEP_RATIO,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    },
    [shouldReduceMotion]
  );

  const scrollToCardIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const targetScroll = (index / (totalCards - 1)) * maxScroll;
      track.scrollTo({
        left: targetScroll,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
      setActiveIndex(index);
    },
    [shouldReduceMotion, totalCards]
  );

  // Auto-advance — skipped entirely for prefers-reduced-motion, and
  // paused while the user hovers, touches, or has just interacted.
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (isPaused) return;

    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 12;

      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        setActiveIndex(0);
      } else {
        track.scrollBy({
          left: track.clientWidth * (SCROLL_STEP_RATIO / 2),
          behavior: "smooth",
        });
      }
    }, AUTO_ADVANCE_INTERVAL);

    return () => window.clearInterval(id);
  }, [shouldReduceMotion, isPaused]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const cardFadeUp = (index: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 32 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, delay: index * 0.08, ease: [0, 0, 0.2, 1] as const },
        };

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow="Our Esteemed Services"
              heading="Guidance Designed Around Your Journey"
              description="Each consultation is personalized around your individual needs and goals, blending Numerology and Vastu into clear, actionable direction."
              animate={true}
            />

            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous services"
                className="transition-all duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-600 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-95"
                onClick={() => {
                  pauseThenResume();
                  scrollByStep(-1);
                }}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Next services"
                className="transition-all duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-600 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-95"
                onClick={() => {
                  pauseThenResume();
                  scrollByStep(1);
                }}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured consultation services"
            tabIndex={0}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={pauseThenResume}
            onTouchStart={pauseThenResume}
            onScroll={handleTrackScroll}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className={cn(
              "flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pt-1",
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-4"
            )}
          >
            {activeServices.map((service, idx) => (
              <motion.div key={service.id} {...cardFadeUp(idx)} className="h-full">
                <ServiceCard service={service} variant="carousel" />
              </motion.div>
            ))}

            {/* Final card in carousel track: View All Services */}
            <motion.div
              {...cardFadeUp(activeServices.length)}
              className={cn(
                "group relative flex h-full w-[270px] sm:w-[310px] md:w-[340px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl border border-gold-400/40 bg-gradient-to-br from-gold-100/60 via-gold-50/50 to-warm-white p-6 sm:p-7 shadow-sm",
                "transition-all duration-300 ease-luxury hover:border-gold-400/80 hover:shadow-[0_12px_32px_rgba(8,20,35,0.08),0_0_24px_rgba(212,175,55,0.2)]",
                "motion-safe:hover:-translate-y-1.5"
              )}
            >
              <div className="relative flex flex-1 flex-col items-center justify-center text-center py-6">
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/50 bg-white text-gold-600 shadow-[0_4px_16px_rgba(212,175,55,0.15)] group-hover:scale-105 transition-transform duration-300">
                  <SacredGeometryPattern className="h-full w-full opacity-70" />
                  <ArrowRight className="relative h-7 w-7 text-gold-600" strokeWidth={1.75} />
                </div>

                <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-gold-600">
                  Full Catalog
                </span>

                <h3 className="font-heading text-h4 font-semibold text-navy-900 leading-snug">
                  Explore All Consultations
                </h3>
                <p className="mt-3 text-body-sm text-text-secondary leading-relaxed">
                  Discover our complete spectrum of 21 personalized numerology, Vastu, and sacred guidance offerings.
                </p>
              </div>

              <div className="pt-4 border-t border-gold-400/20">
                <Button
                  href="/services"
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View All Services
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Carousel Active Position Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: totalCards }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => {
                  pauseThenResume();
                  scrollToCardIndex(idx);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                  activeIndex === idx
                    ? "w-7 bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                    : "w-2 bg-gold-300/40 hover:bg-gold-400/70"
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EsteemServices;