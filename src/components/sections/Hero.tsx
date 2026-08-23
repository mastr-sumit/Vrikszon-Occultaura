"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  User,
  ShieldCheck,
  Lock,
  Star,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Meteors } from "@/components/ui/Meteors";
import { ZODIAC_SIGNS } from "@/data/zodiacSigns";

interface FeatureBadge {
  icon: typeof User;
  line1: string;
  line2: string;
}

const FEATURE_BADGES: FeatureBadge[] = [
  {
    icon: User,
    line1: "Personalized",
    line2: "Consultations",
  },
  {
    icon: ShieldCheck,
    line1: "Ethical",
    line2: "Guidance",
  },
  {
    icon: Lock,
    line1: "Confidential",
    line2: "Sessions",
  },
  {
    icon: Star,
    line1: "Practical",
    line2: "Recommendations",
  },
];

/**
 * Hero Component — Precision Rebuild with Ambient Motion Polish
 *
 * Full-bleed atmospheric background artwork on the right with rich golden cosmic glow,
 * slow-rotating celestial zodiac wheel, high-density headline scale, symmetric flourish,
 * ambient glow breathing pulse, staggered feature badges, and hexagon-outline badge containers.
 */
const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Subtle parallax drift for ambient glow layer (0 to 50px translation over 600px scroll)
  const glowParallaxY = useTransform(scrollY, [0, 600], [0, 50]);

  const fadeUp = (delay: number, duration: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      aria-label="Hero"
      className="relative flex flex-col pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 overflow-hidden"
    >
      {/* 1. Atmospheric Background Layers (100% Uncropped Artwork with Left-Only Fade Blend) */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dark Navy & Indigo Base Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_-10%,color-mix(in_srgb,var(--color-indigo-900)_35%,transparent)_0%,var(--color-navy-950)_80%)]" />

        {/* 21st.dev Celestial Shooting Stars / Meteors */}
        <Meteors number={12} className="opacity-70" />

        {/* Radial Gold Atmosphere Glow centered behind Zodiac Wheel with ambient pulse & scroll parallax */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: glowParallaxY }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.06, 1],
                  opacity: [0.75, 0.95, 0.75],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.25)_0%,rgba(212,175,55,0.06)_50%,transparent_75%)] blur-3xl pointer-events-none"
        />

        {/* Rotating Celestial Zodiac Wheel Background Layer */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-[2%] sm:right-[8%] lg:right-[12%] -translate-y-1/2 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] lg:w-[640px] lg:h-[640px] pointer-events-none opacity-35 sm:opacity-50 lg:opacity-65 z-0"
        >
          {/* Central Pulsing Ambient Glow */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-400)_0%,transparent_70%)] blur-2xl"
            initial={{ opacity: 0.2 }}
            animate={shouldReduceMotion ? undefined : { opacity: [0.2, 0.4, 0.2] }}
            transition={shouldReduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Static Radial Ray Lines */}
          <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gold-400/15" />
          <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-30 bg-gold-400/15" />
          <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-60 bg-gold-400/15" />
          <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-90 bg-gold-400/15" />
          <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-120 bg-gold-400/15" />
          <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-150 bg-gold-400/15" />

          {/* Inner Dashed Ring — Slow Counter-Clockwise Rotation */}
          <motion.div
            className="absolute inset-[18%] rounded-full border border-dashed border-gold-300/30"
            animate={shouldReduceMotion ? undefined : { rotate: -360 }}
            transition={shouldReduceMotion ? undefined : { duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/80" />
            <span className="absolute left-full top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/80" />
            <span className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/80" />
            <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/80" />
          </motion.div>

          {/* Outer Zodiac Rim Ring with 12 Zodiac Symbols — Slow Clockwise Rotation */}
          <motion.div
            className="absolute inset-0 rounded-full border border-gold-400/35"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={shouldReduceMotion ? undefined : { duration: 80, repeat: Infinity, ease: "linear" }}
          >
            {/* Inner accent ring line */}
            <div className="absolute inset-[6%] rounded-full border border-gold-400/20" />

            {/* 12 Zodiac Unicode Glyphs placed around outer rim */}
            {ZODIAC_SIGNS.map((sign, idx) => {
              const positions = [
                "left-[50%] top-[3.5%]",   // 0° Aries
                "left-[73.2%] top-[9.7%]", // 30° Taurus
                "left-[90.3%] top-[26.8%]",// 60° Gemini
                "left-[96.5%] top-[50%]",  // 90° Cancer
                "left-[90.3%] top-[73.2%]",// 120° Leo
                "left-[73.2%] top-[90.3%]",// 150° Virgo
                "left-[50%] top-[96.5%]",  // 180° Libra
                "left-[26.8%] top-[90.3%]",// 210° Scorpio
                "left-[9.7%] top-[73.2%]", // 240° Sagittarius
                "left-[3.5%] top-[50%]",   // 270° Capricorn
                "left-[9.7%] top-[26.8%]", // 300° Aquarius
                "left-[26.8%] top-[9.7%]", // 330° Pisces
              ];

              return (
                <span
                  key={sign.id}
                  aria-hidden="true"
                  className={`absolute ${positions[idx]} -translate-x-1/2 -translate-y-1/2 select-none font-serif text-sm sm:text-base lg:text-lg text-gold-300/80 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]`}
                >
                  {sign.symbol}
                </span>
              );
            })}
          </motion.div>
        </div>

        {/* Full-Bleed Artwork Layer */}
        <div className="absolute inset-0 z-0 opacity-85 lg:opacity-90">
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            priority
            unoptimized
            className="object-cover object-right-center filter brightness-115 saturate-130 contrast-105"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,var(--color-navy-950)_0%,var(--color-navy-950)_38%,color-mix(in_srgb,var(--color-navy-950)_70%,transparent)_65%,transparent_100%)]" />
      </div>

      <Container size="wide" className="relative z-10 w-full">
        {/* Main Content Layout — Left ~55%, Right Artwork ~45% space */}
        <div className="grid grid-cols-1 items-center lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column: Brand Logo, Eyebrow, Large Headline, Flourish, CTAs, Hex Badges */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left gap-4 sm:gap-4.5 lg:gap-5">
            
            {/* Brand Logo Wordmark */}
            <motion.div
              {...fadeUp(0, 0.7)}
              className="relative inline-flex items-center justify-center"
            >
              <Image
                src="/images/brand-logo-wordmark.png"
                alt="Vrikszon Occultaura"
                width={1024}
                height={408}
                priority
                className="h-auto w-[280px] xs:w-[310px] sm:w-[340px] md:w-[380px] lg:w-[410px] xl:w-[440px] object-contain drop-shadow-[0_2px_14px_rgba(212,175,55,0.22)]"
              />
            </motion.div>

            {/* Eyebrow Line */}
            <motion.div
              {...fadeUp(0.08, 0.8)}
              className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-small font-sans"
            >
              <span className="text-gold-400 text-[10px]" aria-hidden="true">✦</span>
              <span>NUMBERS</span>
              <span className="text-gold-400/80 text-[10px]" aria-hidden="true">✦</span>
              <span>ENERGY</span>
              <span className="text-gold-400/80 text-[10px]" aria-hidden="true">✦</span>
              <span>DIRECTION</span>
              <span className="text-gold-400/80 text-[10px]" aria-hidden="true">✦</span>
              <span className="text-gold-400 font-bold drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                DESTINY
              </span>
              <span className="text-gold-400 text-[10px]" aria-hidden="true">✦</span>
            </motion.div>

            {/* Headline Scale */}
            <motion.h1
              {...fadeUp(0.16, 0.9)}
              className="w-full max-w-[760px] font-display font-serif font-bold text-[28px] xs:text-[36px] sm:text-[44px] md:text-5xl lg:text-[52px] xl:text-[58px] leading-[1.15] sm:leading-[1.1] tracking-tight text-white"
            >
              <span className="block text-white drop-shadow-md">Transform Your Life</span>
              <span className="block bg-gradient-to-r from-gold-100 via-gold-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm mt-1 lg:mt-1.5">
                Through Numerology &amp; Vastu
              </span>
            </motion.h1>

            {/* Symmetric Flourish Ornamental Divider */}
            <motion.div
              {...fadeUp(0.24, 0.8)}
              className="flex items-center justify-center lg:justify-start w-full max-w-[320px] my-0.5 text-gold-400/90"
            >
              <svg
                className="w-full h-5"
                viewBox="0 0 320 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M0 12 H120"
                  stroke="url(#flourish-left)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <path
                  d="M100 12 C112 12 116 6 124 6 C130 6 133 12 138 18 C141 21 145 21 148 18 L152 12"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <polygon points="160,4 166,12 160,20 154,12" fill="currentColor" />
                <circle cx="160" cy="12" r="2" fill="#0B0F19" />
                <path
                  d="M168 12 L172 18 C175 21 179 21 182 18 C187 12 190 6 196 6 C204 6 208 12 220 12"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <path
                  d="M200 12 H320"
                  stroke="url(#flourish-right)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="flourish-left" x1="0" y1="12" x2="120" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" stopOpacity="0" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="flourish-right" x1="200" y1="12" x2="320" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Paragraph Description */}
            <motion.p
              {...fadeUp(0.3, 0.8)}
              className="max-w-[560px] text-body-lg leading-[1.65] text-white/80"
            >
              Gain clarity, confidence and direction with personalized guidance
              designed to help you overcome obstacles and achieve harmony.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.4, 0.7)}
              className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center pt-1"
            >
              <Button
                href="/book-consultation"
                size="lg"
                className="rounded-full shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Book Consultation
              </Button>
              <Button
                href="/services"
                variant="secondary"
                size="lg"
                className="rounded-full border-white/25 bg-white/[0.02] text-white backdrop-blur-sm transition-all duration-300 ease-out hover:border-gold-500/70 hover:bg-white/[0.06] hover:text-gold-400 hover:shadow-[0_0_24px_rgba(212,175,55,0.18)] hover:scale-[1.02] active:scale-[0.98]"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Explore Services
              </Button>
            </motion.div>

            {/* 7. Feature Badges Row — Staggered Hexagon Containers */}
            <div className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-4 sm:gap-6 w-full max-w-[640px]">
              {FEATURE_BADGES.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={idx}
                    {...fadeUp(0.52 + idx * 0.08, 0.6)}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5 group"
                  >
                    {/* Hexagon Container */}
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center text-gold-400 group-hover:text-gold-300 transition-transform duration-300 group-hover:scale-110">
                      <svg
                        className="absolute inset-0 h-full w-full drop-shadow-[0_0_8px_rgba(212,175,55,0.25)]"
                        viewBox="0 0 48 52"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <polygon
                          points="24,2 45,14 45,38 24,50 3,38 3,14"
                          fill="rgba(212, 175, 55, 0.08)"
                          stroke="rgba(212, 175, 55, 0.45)"
                          strokeWidth="1.75"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <Icon className="relative z-10 h-5 w-5 stroke-[1.75]" aria-hidden="true" />
                    </div>
                    <div className="text-xs font-medium leading-tight text-white/80">
                      <span className="block font-semibold text-white">{badge.line1}</span>
                      <span className="block text-white/60">{badge.line2}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column Layout Spacer for Desktop Grid */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none min-h-[440px]" />
        </div>
      </Container>
    </section>
  );
};

export default Hero;