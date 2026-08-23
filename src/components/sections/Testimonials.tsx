"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** Fraction of the visible track width to move per Prev/Next press. */
const SCROLL_STEP_RATIO = 0.9;

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRoleOrLocation?: string | null;
  quote?: string | null;
  videoSrc?: string | null;
  posterImage?: string | null;
  featured?: boolean;
  enabled?: boolean;
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  variants: any;
}

const TestimonialCard = ({ testimonial, variants }: TestimonialCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-pause video when the card scrolls mostly out of view (< 35% visible)
  useEffect(() => {
    if (!isPlaying) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio < 0.35 && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        });
      },
      {
        threshold: [0, 0.2, 0.35, 0.5, 0.75, 1.0],
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isPlaying]);

  return (
    <motion.article
      ref={cardRef}
      variants={variants}
      className={cn(
        "group flex h-auto w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm",
        "sm:w-[340px] lg:w-[380px]",
        "transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:shadow-md motion-safe:hover:-translate-y-1"
      )}
    >
      {/* 9:16 Portrait Video Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-[linear-gradient(135deg,var(--color-navy-900)_0%,var(--color-indigo-900)_100%)]">
        {isPlaying && testimonial.videoSrc ? (
          <video
            ref={videoRef}
            src={testimonial.videoSrc}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play video testimonial from ${testimonial.clientName}`}
            className="group/btn relative flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            {testimonial.posterImage && (
              <Image
                src={testimonial.posterImage}
                alt={`${testimonial.clientName} testimonial`}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
                className="object-cover transition-transform duration-300 group-hover/btn:scale-105"
              />
            )}

            {/* Subtle dark backdrop for contrast */}
            <div className="absolute inset-0 bg-navy-950/25 transition-opacity group-hover/btn:bg-navy-950/15" />

            {/* Play Button Icon */}
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow-md transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:shadow-[0_0_24px_rgba(212,175,55,0.4)]">
              <Play className="ml-1 h-6 w-6 text-gold-600" fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-1 p-5 sm:p-6">
        <span className="text-h6 font-medium text-navy-900">
          {testimonial.clientName}
        </span>
        {testimonial.clientRoleOrLocation && (
          <span className="text-small text-text-secondary">
            {testimonial.clientRoleOrLocation}
          </span>
        )}
        {testimonial.quote && (
          <p className="text-small text-text-secondary mt-2 line-clamp-3">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        )}
      </div>
    </motion.article>
  );
};

/** Default fallback if API is pending */
const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testimonial-chetan",
    clientName: "Chetan",
    clientRoleOrLocation: null,
    quote: null,
    videoSrc: "/videos/testimonials/chetan.mp4",
    posterImage: null,
    featured: true,
    enabled: true,
  },
];

/**
 * Testimonials ("Our Testimonials")
 *
 * Database-driven social-proof section featuring inline 9:16 portrait video testimonials.
 */
const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Fetch enabled testimonials from live database
  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (err) {
        console.error("Failed to load testimonials from database:", err);
      }
    }
    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeTestimonials = testimonials.filter((t) => t.enabled !== false);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setIsAtStart(track.scrollLeft <= 8);
    setIsAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 12);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const scrollByStep = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * SCROLL_STEP_RATIO,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

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
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
        },
      };

  if (activeTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-warm-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeading
            eyebrow="Our Testimonials"
            heading="Stories of Clarity, Confidence & Transformation"
            description="A space to share experiences from people who have sought personalized Numerology and Vastu guidance."
          />

          {activeTestimonials.length > 1 && (
            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous testimonials"
                disabled={isAtStart}
                className="transition-all duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-600 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                onClick={() => scrollByStep(-1)}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Next testimonials"
                disabled={isAtEnd}
                className="transition-all duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-600 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                onClick={() => scrollByStep(1)}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        <motion.div
          ref={trackRef}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          onScroll={handleScroll}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          className={cn(
            "mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-4"
          )}
        >
          {activeTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variants={cardVariants}
            />
          ))}
        </motion.div>

        {activeTestimonials.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous testimonials"
              disabled={isAtStart}
              className="transition-all duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-600 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              onClick={() => scrollByStep(-1)}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next testimonials"
              disabled={isAtEnd}
              className="transition-all duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-600 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              onClick={() => scrollByStep(1)}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Testimonials;