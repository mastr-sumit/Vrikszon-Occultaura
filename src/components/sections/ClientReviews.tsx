"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote, Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { MagicCard } from "@/components/ui/MagicCard";
import { CLIENT_REVIEWS } from "@/data/clientReviews";

/**
 * ClientReviews ("What Our Clients Say About Us")
 *
 * Implements smooth responsive horizontal carousel with left/right navigation arrows,
 * touch swipe gesture support for mobile, and indicator dots.
 */
const ClientReviews = () => {
  const activeReviews = CLIENT_REVIEWS.filter((review) => review.enabled);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Determine number of visible cards based on viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, activeReviews.length - visibleCount);

  // Ensure index stays in valid range when window resizes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCount, maxIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Auto-scroll interval (every 4.5 seconds when not hovered/interacting)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex, handleNext]);

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-navy-950 py-12 md:py-16 lg:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_10%,color-mix(in_srgb,var(--color-indigo-900)_35%,transparent)_0%,var(--color-navy-950)_90%)]" />
        <div className="absolute -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.07] blur-3xl" />
      </div>

      <Container size="wide" className="relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-0.5 w-10 sm:w-12 bg-gold-500/80" />
            <span className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-[0.2em] text-gold-400">
              Verified Transformations
            </span>
            <span className="h-0.5 w-10 sm:w-12 bg-gold-500/80" />
          </div>

          <h2 className="font-heading text-h2 sm:text-h1 md:text-hero lg:text-display text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-semibold text-white tracking-tight leading-[1.15]">
            What Our Clients <span className="text-gold-400 italic">Say About Us</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Every consultation is a personalized sacred journey. Read authentic reflections and transformation
            stories from individuals whose lives have elevated through our guidance.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-12">
          {/* Navigation Arrow: Left */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Reviews"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gold-500/40 bg-navy-900/95 text-gold-400 backdrop-blur-md shadow-xl transition-all duration-200 hover:bg-gold-500/20 hover:border-gold-400 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Navigation Arrow: Right */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Reviews"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gold-500/40 bg-navy-900/95 text-gold-400 backdrop-blur-md shadow-xl transition-all duration-200 hover:bg-gold-500/20 hover:border-gold-400 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Slider Window */}
          <div
            className="overflow-hidden py-4"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-400 ease-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
              }}
            >
              {activeReviews.map((review) => (
                <div
                  key={review.id}
                  className="shrink-0 px-2.5 sm:px-3.5"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Indicators / Dots */}
          {maxIndex > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to review slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === index
                      ? "w-8 bg-gold-400"
                      : "w-2 bg-navy-700 hover:bg-navy-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Social Proof Trust Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-t border-gold-500/15 pt-8 text-center text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex text-gold-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <span className="font-semibold text-white">5.0 Star Rating</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-gold-400" />
            <span>100% Confidential Consultations</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verified Client Stories</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

interface ReviewCardProps {
  review: {
    id: string;
    clientName: string;
    location: string;
    review: string;
  };
}

function ReviewCard({ review }: ReviewCardProps) {
  // Generate initials for avatar
  const initials = review.clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <MagicCard
      className="h-full w-full border border-gold-500/25 bg-navy-900/80 p-6 sm:p-7 backdrop-blur-md hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between rounded-xl shadow-lg"
      gradientColor="rgba(212, 175, 55, 0.18)"
      gradientSize={280}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {/* 5-Star Rating */}
          <div className="flex items-center gap-1 text-gold-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
            ))}
          </div>
          <Quote className="h-6 w-6 text-gold-500/40" />
        </div>

        <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6 line-clamp-5">
          &ldquo;{review.review}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gold-500/15 mt-auto">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 border border-gold-500/40 text-xs font-bold text-gold-300 shrink-0">
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-small font-semibold text-white flex items-center gap-1.5 truncate">
            {review.clientName}
            <CheckCircle2 className="h-3.5 w-3.5 text-gold-400 inline shrink-0" />
          </span>
          <span className="text-[11px] text-gray-400 truncate">{review.location}</span>
        </div>
      </div>
    </MagicCard>
  );
}

export default ClientReviews;