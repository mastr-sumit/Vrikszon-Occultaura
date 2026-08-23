"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { type Course, formatCoursePrice } from "@/data/courses";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = course.image || `/images/services/${course.slug}.png`;

  return (
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
      </div>

      {/* ── Card Content Area ── */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex flex-col gap-2.5">
          {/* Price (Large, Bold, Gold Color) */}
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-h3 font-bold text-gold-600 tracking-tight">
              {formatCoursePrice(course.price)}
            </span>
            {course.originalPrice && (
              <span className="text-body-sm text-text-muted line-through">
                {formatCoursePrice(course.originalPrice)}
              </span>
            )}
          </div>

          {/* Course Name (Heading) */}
          <h3 className="font-heading text-h5 font-semibold text-navy-900 transition-colors group-hover/card:text-gold-700 line-clamp-2">
            {course.title}
          </h3>

          {/* Short Description (2-3 lines) */}
          <p className="text-body-sm text-text-secondary line-clamp-3 leading-relaxed">
            {course.shortDescription}
          </p>
        </div>

        {/* ── Enroll Now Button (Full Width) ── */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <Button
            href={course.enrollHref || "/book-consultation"}
            size="md"
            fullWidth
            className="justify-center"
          >
            <span>Enroll Now</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </article>
  );
};
