"use client";

import { Quote, Star, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { MagicCard } from "@/components/ui/MagicCard";
import { cn } from "@/lib/utils";
import { CLIENT_REVIEWS } from "@/data/clientReviews";

/**
 * ClientReviews ("What Our Clients Say About Us") — 21st.dev Infinite Marquee Upgrade
 *
 * Implements smooth dual-row infinite marquee with pause-on-hover, verified badges,
 * mouse-following spotlight glow via MagicCard, and gradient edge masks.
 */
const ClientReviews = () => {
  const shouldReduceMotion = useReducedMotion();
  const activeReviews = CLIENT_REVIEWS.filter((review) => review.enabled);

  // Split reviews into two balanced sets for top and bottom marquee rows
  const firstRow = activeReviews.slice(0, Math.ceil(activeReviews.length / 2));
  const secondRow = activeReviews.slice(Math.ceil(activeReviews.length / 2));

  return (
    <section className="relative overflow-hidden bg-navy-950 py-12 md:py-16 lg:py-20">
      {/* Background atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_10%,color-mix(in_srgb,var(--color-indigo-900)_35%,transparent)_0%,var(--color-navy-950)_90%)]" />
        <div className="absolute -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.07] blur-3xl" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-gold-500/60" />
            <span className="text-small font-semibold uppercase tracking-[0.15em] text-gold-400">
              Verified Transformations
            </span>
            <span className="h-px w-8 bg-gold-500/60" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight">
            What Our Clients <span className="text-gold-400 italic">Say About Us</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Every consultation is a personalized sacred journey. Read authentic reflections and transformation
            stories from individuals whose lives have elevated through our guidance.
          </p>
        </div>

        {/* Dual-Row Infinite Marquee with edge fade gradient masks */}
        <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
          {/* Row 1: Leftward Marquee */}
          <Marquee pauseOnHover duration="35s" className="py-2">
            {firstRow.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Marquee>

          {/* Row 2: Rightward (Reverse) Marquee */}
          <Marquee reverse pauseOnHover duration="38s" className="py-2">
            {secondRow.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Marquee>
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
      className="w-[320px] sm:w-[380px] shrink-0 border border-gold-500/25 bg-navy-900/80 p-6 backdrop-blur-md hover:border-gold-500/50 transition-all duration-300"
      gradientColor="rgba(212, 175, 55, 0.18)"
      gradientSize={280}
    >
      <div className="flex items-center justify-between mb-4">
        {/* 5-Star Rating */}
        <div className="flex items-center gap-1 text-gold-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
          ))}
        </div>
        <Quote className="h-6 w-6 text-gold-500/40" />
      </div>

      <p className="text-sm text-gray-200 leading-relaxed mb-6 line-clamp-4">
        &ldquo;{review.review}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-gold-500/15">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20 border border-gold-500/40 text-xs font-bold text-gold-300">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white flex items-center gap-1">
            {review.clientName}
            <CheckCircle2 className="h-3 w-3 text-gold-400 inline" />
          </span>
          <span className="text-[11px] text-gray-400">{review.location}</span>
        </div>
      </div>
    </MagicCard>
  );
}

export default ClientReviews;