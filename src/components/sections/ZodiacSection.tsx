"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ZODIAC_SIGNS, type ZodiacSign } from "@/data/zodiacSigns";
import { cn } from "@/lib/utils";

/** Element styling themes for the back face of zodiac 3D flip cards. */
const ELEMENT_THEMES: Record<
  "fire" | "earth" | "air" | "water",
  {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    label: string;
  }
> = {
  fire: {
    bg: "bg-gradient-to-br from-amber-950 via-navy-900 to-amber-900/90 text-amber-100",
    border: "border-amber-500/40",
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-400/40",
    label: "Fire",
  },
  earth: {
    bg: "bg-gradient-to-br from-emerald-950 via-navy-900 to-teal-950/90 text-emerald-100",
    border: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-400/40",
    label: "Earth",
  },
  air: {
    bg: "bg-gradient-to-br from-sky-950 via-navy-900 to-cyan-950/90 text-sky-100",
    border: "border-sky-500/40",
    badgeBg: "bg-sky-500/20",
    badgeText: "text-sky-300",
    badgeBorder: "border-sky-400/40",
    label: "Air",
  },
  water: {
    bg: "bg-gradient-to-br from-indigo-950 via-navy-900 to-blue-950/90 text-indigo-100",
    border: "border-indigo-500/40",
    badgeBg: "bg-indigo-500/20",
    badgeText: "text-indigo-300",
    badgeBorder: "border-indigo-400/40",
    label: "Water",
  },
};

/** Sacred Geometry Background Pattern fallback */
const SacredGeometryPattern = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={cn("absolute pointer-events-none stroke-gold-500/20 fill-none", className)}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="46" strokeWidth="0.5" strokeDasharray="3 2" />
    <circle cx="50" cy="50" r="36" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="26" strokeWidth="0.5" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="16" strokeWidth="0.5" />
    <path d="M50 4 L50 96 M4 L50 L96 50 M17 17 L83 83 M17 83 L83 17" strokeWidth="0.4" />
    <rect x="25" y="25" width="50" height="50" strokeWidth="0.4" transform="rotate(45 50 50)" />
  </svg>
);

/** Custom thin-line vector SVG glyph icons for all 12 zodiac signs. */
const ZodiacSvgIcon = ({ id, className }: { id: string; className?: string }) => {
  switch (id) {
    case "aries":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21V9" />
          <path d="M12 9C9 9 5 6.5 5 4C5 2.5 6.5 1.5 8 1.5C10.5 1.5 12 4 12 7" />
          <path d="M12 9C15 9 19 6.5 19 4C19 2.5 17.5 1.5 16 1.5C13.5 1.5 12 4 12 7" />
        </svg>
      );
    case "taurus":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="14" r="6" />
          <path d="M5 4C5 8.5 8 10 12 10C16 10 19 8.5 19 4" />
        </svg>
      );
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4.5C10 6.5 14 6.5 20 4.5" />
          <path d="M4 19.5C10 17.5 14 17.5 20 19.5" />
          <path d="M9.5 5.5V18.5" />
          <path d="M14.5 5.5V18.5" />
        </svg>
      );
    case "cancer":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="8.5" r="3" />
          <path d="M10 8.5C10 4.5 15.5 4.5 19.5 7" />
          <circle cx="17" cy="15.5" r="3" />
          <path d="M14 15.5C14 19.5 8.5 19.5 4.5 17" />
        </svg>
      );
    case "leo":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6.5" cy="16.5" r="3" />
          <path d="M9 14.5C11.5 9 14 4 18 4C20.5 4 21.5 6 20.5 8.5C19.5 11 16.5 12.5 16.5 16C16.5 19 18.5 20.5 21 19.5" />
        </svg>
      );
    case "virgo":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5V16" />
          <path d="M4 9C4 6.5 6.5 5.5 8.5 5.5C11 5.5 11 8.5 11 11V16" />
          <path d="M11 9C11 6.5 13.5 5.5 15.5 5.5C18 5.5 18 8.5 18 12.5V17.5C18 20.5 15.5 21 14 19.5" />
          <path d="M16 16.5L20 20.5" />
        </svg>
      );
    case "libra":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5H20" />
          <path d="M4 15.5H8C8 11.5 9.8 9 12 9C14.2 9 16 11.5 16 15.5H20" />
        </svg>
      );
    case "scorpio":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5V16" />
          <path d="M4 9C4 6.5 6.5 5.5 8.5 5.5C11 5.5 11 8.5 11 11V16" />
          <path d="M11 9C11 6.5 13.5 5.5 15.5 5.5C18 5.5 18 8.5 18 12.5V17L21 20" />
          <path d="M18.5 20H21V17.5" />
        </svg>
      );
    case "sagittarius":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18L18 6" />
          <path d="M12 6H18V12" />
          <path d="M5 13L11 19" />
        </svg>
      );
    case "capricorn":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5L8.5 16.5L13 7.5C15 5.5 18 5.5 19.5 7.5C21 9.5 19.5 13.5 16.5 13.5C14.5 13.5 13.5 11.5 14.5 9.5" />
          <circle cx="16.5" cy="13.5" r="2.5" />
        </svg>
      );
    case "aquarius":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8.5L6.5 5.5L10 8.5L13.5 5.5L17 8.5L20.5 5.5" />
          <path d="M3 16.5L6.5 13.5L10 16.5L13.5 13.5L17 16.5L20.5 13.5" />
        </svg>
      );
    case "pisces":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12H20" />
          <path d="M6.5 4C10.5 9 10.5 15 6.5 20" />
          <path d="M17.5 4C13.5 9 13.5 15 17.5 20" />
        </svg>
      );
    default:
      return null;
  }
};

interface ZodiacCardProps {
  sign: ZodiacSign;
  variants: any;
}

const ZodiacCard = ({ sign, variants }: ZodiacCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const theme = ELEMENT_THEMES[sign.element];

  return (
    <motion.li variants={variants} className="list-none h-full">
      <div
        role="region"
        aria-label={`${sign.name} Zodiac details`}
        tabIndex={0}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped((prev) => !prev)}
        onFocus={() => setIsFlipped(true)}
        onBlur={() => setIsFlipped(false)}
        className="group relative h-[270px] sm:h-[285px] w-full [perspective:1000px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded-2xl"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { rotateY: isFlipped ? 180 : 0 }
          }
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full rounded-2xl [transform-style:preserve-3d]"
        >
          {/* Front Face — Full-Width Header Image, Glyph Overlay, Name, Date Range */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-gold-500/25 bg-white shadow-sm transition-all duration-300 group-hover:border-gold-500/60 group-hover:shadow-[0_12px_28px_rgba(8,20,35,0.08),0_0_20px_rgba(212,175,55,0.18)] [backface-visibility:hidden]",
              shouldReduceMotion && isFlipped && "opacity-0 pointer-events-none"
            )}
          >
            {/* Top Full-Width Illustrated Image Container */}
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-navy-950/20">
              {!imageError ? (
                <>
                  <Image
                    src={sign.cardImage}
                    alt={`${sign.name} Zodiac Illustration`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 ease-luxury group-hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent pointer-events-none" />
                </>
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
                  <SacredGeometryPattern className="h-full w-full opacity-60" />
                  <span className="relative z-10 font-heading text-h3 text-gold-400">
                    {sign.symbol}
                  </span>
                </div>
              )}

              {/* Element Pill overlay at top right */}
              <span
                className={cn(
                  "absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider backdrop-blur-xs shadow-md",
                  theme.badgeBg,
                  theme.badgeText,
                  theme.badgeBorder
                )}
              >
                {theme.label}
              </span>

              {/* Glyph Symbol badge overlay at bottom left */}
              <div className="absolute bottom-2 left-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-gold-400/50 bg-white/95 backdrop-blur-xs text-gold-600 shadow-md transition-transform duration-300 group-hover:scale-110">
                <ZodiacSvgIcon id={sign.id} className="h-3.5 w-3.5 text-gold-600" />
              </div>
            </div>

            {/* Bottom Content Body */}
            <div className="flex flex-col flex-1 justify-between p-3.5 text-center">
              <div className="flex flex-col gap-0.5">
                <span className="font-heading text-h5 font-semibold text-navy-900 group-hover:text-gold-700 transition-colors duration-200">
                  {sign.name}
                </span>
                <span className="text-[11px] text-text-secondary font-medium">
                  {sign.dateRange}
                </span>
              </div>

              <div className="mt-2 pt-1.5 border-t border-navy-900/5 flex items-center justify-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gold-600 group-hover:text-gold-700">
                  <span>Flip for details</span>
                  <Sparkles className="h-2.5 w-2.5 text-gold-500" />
                </span>
              </div>
            </div>
          </div>

          {/* Back Face — Short Description & Element Tint */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-between rounded-2xl border p-4 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]",
              theme.bg,
              theme.border,
              shouldReduceMotion && !isFlipped && "opacity-0 pointer-events-none",
              shouldReduceMotion && isFlipped && "[transform:rotateY(0deg)] opacity-100"
            )}
          >
            <div className="flex w-full items-center justify-between gap-1 border-b border-white/15 pb-2">
              <span className="font-heading text-h5 font-medium text-white">
                {sign.name}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                  theme.badgeBg,
                  theme.badgeText,
                  theme.badgeBorder
                )}
              >
                {theme.label} Element
              </span>
            </div>

            <p className="text-body-sm leading-relaxed text-white/95 my-auto font-normal text-xs sm:text-small">
              {sign.shortDescription}
            </p>

            <Link
              href={sign.href}
              tabIndex={isFlipped ? 0 : -1}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold-300 hover:text-gold-100 transition-colors pt-2 border-t border-white/10"
            >
              <span>Consultations</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.li>
  );
};

/**
 * ZodiacSection ("The Cosmic Code")
 *
 * Homepage discovery section connecting zodiac signs, numerology and
 * self-reflection with 3D flip card interactions.
 */
const ZodiacSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const signs = ZODIAC_SIGNS.filter((sign) => sign.enabled);

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 },
    },
  };

  const itemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
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
    <section className="relative overflow-hidden bg-warm-white py-12 md:py-16 lg:py-20">
      {/* Constellation-style background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[8%] top-[18%] h-1.5 w-1.5 rounded-full bg-gold-500/40" />
        <div className="absolute left-[22%] top-[72%] h-1 w-1 rounded-full bg-gold-500/30" />
        <div className="absolute right-[12%] top-[24%] h-1 w-1 rounded-full bg-gold-500/30" />
        <div className="absolute right-[20%] top-[68%] h-1.5 w-1.5 rounded-full bg-gold-500/40" />
        <div className="absolute left-[48%] top-[8%] h-1 w-1 rounded-full bg-gold-500/20" />
        <div className="absolute right-[44%] bottom-[12%] h-1.5 w-1.5 rounded-full bg-gold-500/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,transparent_50%,color-mix(in_srgb,var(--color-gold-300)_4%,transparent)_100%)]" />
      </div>

      <Container size="wide" className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="The Cosmic Code"
          heading="Unravel the Cosmic Code"
          description={
            <>
              Explore the Power of Numbers Based on Your Zodiac Sign.
              <br className="hidden sm:block" />
              Each sign carries its own distinct qualities — numerology
              offers another lens for personal reflection.
            </>
          }
        />

        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-6"
        >
          {signs.map((sign) => (
            <ZodiacCard key={sign.id} sign={sign} variants={itemVariants} />
          ))}
        </motion.ul>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={ctaVariants}
          className="mt-12 flex justify-center"
        >
          <Button
            href="/book-consultation"
            size="lg"
            className="rounded-full shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Discover Your Path
          </Button>
        </motion.div>
      </Container>
    </section>
  );
};

export default ZodiacSection;