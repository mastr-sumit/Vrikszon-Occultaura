"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MessageCircle, CalendarCheck, Sparkles, Compass, Search, X } from "lucide-react";
import Container from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { COURSES } from "@/data/courses";
import { CourseCard } from "./CourseCard";

const CoursesGrid = () => {
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const enabledCourses = useMemo(() => {
    return COURSES.filter((c) => c.enabled);
  }, []);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return enabledCourses;
    return enabledCourses.filter((course) => {
      const titleMatch = course.title.toLowerCase().includes(q);
      const descMatch = course.shortDescription.toLowerCase().includes(q);
      const categoryMatch = course.category ? course.category.toLowerCase().includes(q) : false;
      return titleMatch || descMatch || categoryMatch;
    });
  }, [enabledCourses, searchQuery]);

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.06 },
    },
  };

  const cardVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <div className="bg-warm-white py-16 md:py-20 lg:py-24">
      <Container size="wide">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <SectionHeading
            badge="Occult Curriculum"
            title="Professional Courses & Masterclasses"
            description="Explore our complete range of certified occult courses. Select any course to view details or enroll directly."
            centered
          />

          {/* Quick Links / Anchor Jump Row */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-text-muted">
              <Compass className="h-4 w-4 text-gold-600" />
              <span>Quick Links:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
              {enabledCourses.map((course) => (
                <a
                  key={course.id}
                  href={`#${course.slug}`}
                  className="inline-flex items-center rounded-full border border-border bg-white px-3.5 py-1.5 text-caption font-medium text-navy-800 shadow-2xs transition-all duration-200 hover:border-gold-500 hover:bg-gold-50/60 hover:text-gold-700 active:scale-95"
                >
                  <span className="truncate max-w-[220px]">{course.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Search Bar & Results Counter ── */}
        <div className="mb-10 flex flex-col gap-4">
          <div className="relative max-w-xl mx-auto w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gold-600">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name or topic (e.g. Numerology, Astrology, Switchword)..."
              className="w-full rounded-full border border-navy-900/15 bg-white py-3.5 pl-11 pr-10 text-sm text-navy-900 shadow-sm placeholder:text-navy-900/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-navy-900"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-text-secondary px-2 max-w-6xl mx-auto w-full">
            <span>
              Showing <strong>{filteredCourses.length}</strong> of {enabledCourses.length} courses
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gold-700 font-semibold hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Flat Responsive Grid (4 cols desktop, 2 cols tablet, 1 col mobile) */}
        {filteredCourses.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={gridVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8"
          >
            {filteredCourses.map((course) => (
              <motion.div key={course.id} variants={cardVariants}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-navy-900/10 bg-white p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-medium text-navy-950 mb-2">
              No matching courses found
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mb-6">
              We couldn&apos;t find any course matching &ldquo;{searchQuery}&rdquo;. Try using different keywords or browse all courses.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-bold text-navy-950 hover:bg-gold-400 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              View All Courses
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative mt-20 overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-indigo-950 p-8 md:p-12 text-white shadow-xl"
        >
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-3 py-1 text-caption font-semibold text-gold-300">
                <Sparkles className="h-4 w-4" />
                Custom Learning Paths
              </div>
              <h3 className="font-heading text-h3 font-medium text-white">
                Need Guidance on Which Course Fits Your Goals?
              </h3>
              <p className="text-body text-white/70">
                Speak directly with our academic advisor to discuss course syllabus, schedule,
                and career opportunities in Numerology and Vastu sciences.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Button href="/contact" size="lg">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Contact Advisor
              </Button>
              <a
                href="https://wa.me/919073190525?text=Hi%2C%20I%20want%20guidance%20regarding%20Vrikszon%20Occultaura%20Courses"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-button px-6 py-3.5 text-button font-medium border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default CoursesGrid;
