"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Video, Calendar, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { type Course, type CourseMode, formatCoursePrice } from "@/data/courses";
import CourseEnrollModal from "@/components/courses/CourseEnrollModal";
import { useCart } from "@/context/CartContext";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<CourseMode>("recorded");
  const { addCourseToCart } = useCart();

  const imageSrc = course.image || "/images/courses/basic-vastu.jpg";

  // Derive active mode pricing and schedule
  const pricing = activeMode === "live" ? (course.live || course.recorded) : course.recorded;
  const currentPrice = pricing?.price ?? course.price;
  const currentOriginalPrice = pricing?.originalPrice ?? course.originalPrice;
  const nextBatch = activeMode === "live" ? course.live?.nextBatch : undefined;

  return (
    <>
      <article
        id={course.slug}
        aria-label={course.title}
        className={cn(
          "group/card scroll-mt-28 flex h-full flex-col overflow-hidden rounded-2xl",
          "border border-gold-500/20 bg-white text-text-primary shadow-sm",
          "transition-all duration-300 ease-out hover:border-gold-400 hover:shadow-xl hover:shadow-gold-500/10"
        )}
      >
        {/* ── Top Course Image ── */}
        <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-navy-950)_0%,var(--color-navy-900)_100%)]">
          {!imageError ? (
            <Image
              src={imageSrc}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 px-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 bg-white/5">
                <Sparkles className="h-6 w-6 text-gold-400" />
              </span>
              <span className="text-small font-medium text-white line-clamp-2">
                {course.title}
              </span>
            </div>
          )}

          {/* Mode Pill Badge in Top Corner */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs border",
                activeMode === "live"
                  ? "bg-navy-950/85 text-gold-300 border-gold-400/40"
                  : "bg-navy-950/80 text-white/90 border-white/20"
              )}
            >
              {activeMode === "live" ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Live Masterclass</span>
                </>
              ) : (
                <>
                  <Video className="h-3 w-3 text-gold-400" />
                  <span>Self-Paced Recorded</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* ── Card Content Area ── */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div className="flex flex-col gap-3">
            {/* Mode Selector Tabs (Recorded vs Live) */}
            <div
              className="flex items-center rounded-xl bg-navy-50/90 p-1 border border-navy-900/10 gap-1 w-full"
              role="tablist"
              aria-label={`${course.title} format options`}
            >
              <button
                type="button"
                role="tab"
                id={`tab-recorded-${course.id}`}
                aria-selected={activeMode === "recorded"}
                onClick={() => setActiveMode("recorded")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                  activeMode === "recorded"
                    ? "bg-white text-navy-950 shadow-xs border border-gold-500/25"
                    : "text-navy-600 hover:text-navy-900 hover:bg-white/50"
                )}
              >
                <Video className="h-3.5 w-3.5 text-navy-700" />
                <span>Recorded</span>
              </button>

              <button
                type="button"
                role="tab"
                id={`tab-live-${course.id}`}
                aria-selected={activeMode === "live"}
                onClick={() => setActiveMode("live")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                  activeMode === "live"
                    ? "bg-white text-navy-950 shadow-xs border border-gold-500/25"
                    : "text-navy-600 hover:text-navy-900 hover:bg-white/50"
                )}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live</span>
              </button>
            </div>

            {/* Price (Large, Bold, Gold Color) */}
            <div className="flex items-baseline justify-between gap-2 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-h3 font-bold text-gold-600 tracking-tight">
                  {formatCoursePrice(currentPrice)}
                </span>
                {currentOriginalPrice && (
                  <span className="text-body-sm text-text-muted line-through">
                    {formatCoursePrice(currentOriginalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500/80">
                {activeMode === "live" ? "Live Sessions" : "Recorded Access"}
              </span>
            </div>

            {/* Next Batch Info (Shown ONLY in Live Tab) */}
            {activeMode === "live" && nextBatch && (
              <div className="flex items-center gap-2 rounded-xl bg-gold-500/10 border border-gold-500/25 px-3 py-2 text-xs text-gold-900 animate-in fade-in duration-200">
                <Calendar className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                <span className="font-medium truncate">{nextBatch}</span>
              </div>
            )}

            {/* Course Name (Heading) */}
            <h3 className="font-heading text-h5 font-semibold text-navy-900 transition-colors group-hover/card:text-gold-700 line-clamp-2">
              {course.title}
            </h3>

            {/* Short Description (2-3 lines) */}
            <p className="text-body-sm text-text-secondary line-clamp-3 leading-relaxed">
              {course.shortDescription}
            </p>
          </div>

          {/* ── Action Buttons: Enroll Now & Add to Cart ── */}
          <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setIsEnrollModalOpen(true)}
              size="md"
              className="flex-1 justify-center"
            >
              <span>Enroll Now</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>

            <button
              type="button"
              onClick={() => addCourseToCart(course, activeMode)}
              title={`Add ${course.title} (${activeMode === "live" ? "Live" : "Recorded"}) to Cart`}
              aria-label={`Add ${course.title} (${activeMode === "live" ? "Live" : "Recorded"}) to Cart`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-50/60 text-gold-700 transition-all hover:bg-gold-500 hover:text-navy-950 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>

      {/* Course Enrollment & Razorpay Payment Modal */}
      <CourseEnrollModal
        course={course}
        mode={activeMode}
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />
    </>
  );
};
