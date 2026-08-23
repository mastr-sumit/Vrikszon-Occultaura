"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import {
  Smartphone,
  Phone,
  Type,
  Grid3x3,
  Sliders,
  Hash,
  Palette,
  Heart,
  TrendingUp,
  Plane,
  Flame,
  ShieldCheck,
  Activity,
  Flower2,
  Gem,
  Scale,
  Compass,
  Moon,
  Building2,
  Layout,
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Service, formatPrice } from "@/data/services";
import Button from "@/components/ui/Button";

/**
 * Mapping of service IDs to single-style Lucide icons.
 */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "mobile-numerology-analysis": Smartphone,
  "mobile-number-design-sim-card-provided": Phone,
  "name-numerology-pronology-analysis": Type,
  "loshu-grid-mastery": Grid3x3,
  "missing-repeated-number-remedies": Sliders,
  "available-number-significance-impact": Hash,
  "lucky-unlucky-numbers-colours": Palette,
  "love-relationship-marriage-healing": Heart,
  "career-finance-analysis-remedies": TrendingUp,
  "foreign-travel-studies-job-remedies": Plane,
  "rituals-job-business-growth-remedies": Flame,
  "specific-rituals-yantras-remedies": ShieldCheck,
  "health-analysis-healing": Activity,
  "infertility-chronic-diseases-remedies": Flower2,
  "crystals-rudraksh-sanjivani-cards-energy-circles": Gem,
  "healing-court-cases": Scale,
  "mahadasha-vastu-dasha-missing-numbers": Compass,
  "kp-astrology": Moon,
  "business-name-analysis": Building2,
  "business-name-design-logo-visiting-cards": Layout,
  "wall-clocks-wrist-watch-analysis-remedies": Clock,
};

/**
 * Sacred Geometry Background Watermark (SVG)
 * Provides subtle celestial / mandala depth behind the fallback header.
 */
export const SacredGeometryPattern = ({ className }: { className?: string }) => (
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

export interface ServiceCardProps {
  service: Service;
  variant?: "grid" | "carousel";
  className?: string;
}

/**
 * ServiceCard — Elevated with 21st.dev MagicCard Spotlight & Direct Actions
 *
 * Shared premium card treatment used across both the /services grid and the homepage carousel.
 * Features an illustrated header image, gold accent icon badge overlay, category pill,
 * and dual consultation booking CTAs.
 */
export const ServiceCard = ({
  service,
  variant = "grid",
  className,
}: ServiceCardProps) => {
  const [imageError, setImageError] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const IconComponent = SERVICE_ICONS[service.id] || Gem;
  const isCarousel = variant === "carousel";

  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold-500/25 bg-white shadow-sm transition-all duration-300 ease-luxury",
        "hover:border-gold-500/60 hover:shadow-[0_12px_32px_rgba(8,20,35,0.08),0_0_24px_rgba(212,175,55,0.18)]",
        shouldReduceMotion ? "" : "hover:-translate-y-1.5",
        isCarousel ? "w-[270px] sm:w-[310px] md:w-[340px] shrink-0 snap-start h-full" : "h-full",
        className
      )}
    >
      {/* 21st.dev Mouse Spotlight Glow */}
      {!shouldReduceMotion && isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.14), transparent 80%)`,
          }}
        />
      )}

      {/* Top gold accent line on hover */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 z-20 h-[2px] w-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent group-hover:w-full transition-all duration-500 ease-out"
      />

      {/* ── Top Full-Width Image Container ── */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-navy-950/20">
        {service.image && !imageError ? (
          <>
            <Image
              src={service.image}
              alt={service.name}
              fill
              sizes={
                isCarousel
                  ? "(max-width: 640px) 270px, 340px"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-500 ease-luxury group-hover:scale-105"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
            <SacredGeometryPattern className="h-full w-full opacity-60" />
            <IconComponent
              className="relative z-10 h-10 w-10 text-gold-400 drop-shadow-md"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Featured Badge overlay */}
        {service.featured && (
          <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border border-gold-400/40 bg-navy-900/90 backdrop-blur-xs px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-300 shadow-md">
            <Sparkles className="h-3 w-3 text-gold-400" />
            Featured
          </span>
        )}

        {/* Small Accent Icon Badge overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-gold-400/50 bg-white/95 backdrop-blur-xs text-gold-600 shadow-md transition-transform duration-300 group-hover:scale-110">
          <IconComponent className="h-4.5 w-4.5 text-gold-600" strokeWidth={1.75} />
        </div>
      </div>

      {/* ── Content Body Below Image ── */}
      <div className="flex flex-col flex-1 p-6 sm:p-7">
        {/* Category Pill Tag */}
        <div className="mb-2.5">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-gold-600 bg-gold-50/90 px-2.5 py-0.5 rounded-md border border-gold-200/70">
            {service.category}
          </span>
        </div>

        {/* Service Title */}
        <div className="mb-3 min-h-[3.5rem] flex items-start">
          <h3 className="font-heading text-h5 font-semibold text-navy-900 group-hover:text-gold-700 transition-colors duration-200 leading-snug line-clamp-2">
            {service.name}
          </h3>
        </div>

        {/* Short Description */}
        <p className="mb-6 text-body-sm text-text-secondary leading-relaxed line-clamp-2 min-h-[2.75rem]">
          {service.shortDescription}
        </p>
      </div>

      {/* Card Bottom / Price & Dual Action CTAs */}
      <div className="mt-auto flex flex-col border-t border-navy-900/10 bg-warm-white/60 p-6 pt-4 sm:p-7 sm:pt-4 group-hover:bg-gold-50/20 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Consultation Fee</span>
            <span className="font-heading text-h5 font-bold text-navy-900 group-hover:text-gold-700 transition-colors">
              {formatPrice(service.price)}
            </span>
          </div>

          {service.durationMinutes ? (
            <span className="text-caption font-medium text-text-secondary bg-white px-2.5 py-1 rounded-md border border-navy-900/10 shadow-2xs">
              {service.durationMinutes} min session
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
              Personalized Analysis
            </span>
          )}
        </div>

        {/* Action Buttons based on variant */}
        {isCarousel ? (
          <div className="flex flex-col gap-2">
            <Button
              href={`/book-consultation?service=${service.id}`}
              variant="primary"
              size="sm"
              fullWidth
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Book Consultation
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={`/book-consultation?service=${service.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-xs font-bold text-navy-950 shadow-sm transition-all duration-200 hover:bg-gold-400 hover:shadow-md"
            >
              <span>Book Session</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(
                `Hello Vrikszon Occultaura, I would like to inquire about ${service.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Inquire about ${service.name} on WhatsApp`}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 transition-all shrink-0"
              title="Quick WhatsApp Inquiry"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default ServiceCard;
