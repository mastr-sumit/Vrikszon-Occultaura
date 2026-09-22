"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MessageCircle, CalendarCheck, Sparkles, Search, X, Compass } from "lucide-react";
import Container from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { COURSES, type Course, type CourseCategory } from "@/data/courses";
import { CourseCard } from "./CourseCard";
import { cn } from "@/lib/utils";

interface CoursesGridProps {
  initialCourses?: Course[];
  initialCategories?: CourseCategory[];
}

/**
 * CoursesGrid — Grouped by Category (matching the Shop/Products structure)
 *
 * Renders all enabled courses from database grouped by category,
 * with category headings, count badges, quick jump anchors, and live search.
 * Skips categories with 0 courses automatically.
 */
export default function CoursesGrid({ initialCourses, initialCategories }: CoursesGridProps) {
  const shouldReduceMotion = useReducedMotion();

  const [coursesList, setCoursesList] = useState<Course[]>(
    initialCourses && initialCourses.length > 0 ? initialCourses : COURSES
  );
  const [categoriesList, setCategoriesList] = useState<CourseCategory[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Live client-side fetch for dynamic updates from Admin Panel
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [coursesRes, catsRes] = await Promise.all([
          fetch("/api/courses", { cache: "no-store" }),
          fetch("/api/categories?type=COURSE", { cache: "no-store" }),
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          if (isMounted && Array.isArray(coursesData) && coursesData.length > 0) {
            setCoursesList(coursesData);
          }
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          if (isMounted && Array.isArray(catsData)) {
            setCategoriesList(catsData);
          }
        }
      } catch (err) {
        console.error("Failed to load courses or categories:", err);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const enabledCourses = useMemo(() => {
    return coursesList.filter((c) => c.enabled);
  }, [coursesList]);

  // Filter courses by search query
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

  // Group courses by Category in DB order
  const { categories, coursesByCategory } = useMemo(() => {
    const grouped: Record<string, Course[]> = {};
    const foundCategoryNames: string[] = [];

    // Order from DB categories table
    const dbCategoryNames = categoriesList.map((c) => c.name);

    filteredCourses.forEach((course) => {
      const catName = course.category || "General";
      if (!grouped[catName]) {
        grouped[catName] = [];
        foundCategoryNames.push(catName);
      }
      grouped[catName].push(course);
    });

    // Ordered list of categories that have at least one course
    const orderedCategories = [
      ...dbCategoryNames.filter((name) => grouped[name] && grouped[name].length > 0),
      ...foundCategoryNames.filter((name) => !dbCategoryNames.includes(name)),
    ];

    return {
      categories: orderedCategories,
      coursesByCategory: grouped,
    };
  }, [filteredCourses, categoriesList]);

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
    },
  };

  const cardVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 35 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <section aria-label="Course Curriculum" className="bg-warm-white py-16 md:py-20 lg:py-24 xl:py-28">
      <Container size="wide">
        {/* Section Intro */}
        <SectionHeading
          badge="Occult Curriculum"
          title="Professional Courses & Masterclasses"
          description="Explore our complete range of certified occult courses organized by specialization. Learn authentic Vedic sciences with structured mentorship."
          centered
        />

        {/* Quick Category Anchor Jump Pills */}
        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <span className="text-caption font-semibold uppercase tracking-wider text-text-muted mr-1 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-gold-600" />
              <span>Jump to:</span>
            </span>
            {categories.map((category) => {
              const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const count = coursesByCategory[category]?.length || 0;
              return (
                <a
                  key={category}
                  href={`#${anchor}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-white px-3.5 py-1.5 text-caption font-medium text-navy-800 shadow-2xs transition-all duration-200 hover:border-gold-500 hover:bg-gold-50/60 hover:text-gold-700 active:scale-95"
                >
                  <span>{category}</span>
                  <span className="rounded-full bg-gold-100 px-2 py-0.5 text-2xs font-bold text-gold-800">
                    {count}
                  </span>
                </a>
              );
            })}
          </div>
        )}

        {/* ── Search Bar & Results Counter ── */}
        <div className="mt-8 mb-14 flex flex-col gap-4">
          <div className="relative max-w-xl mx-auto w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gold-600">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name or category (e.g. Numerology, Astrology, Crystal)..."
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
              Showing <strong>{filteredCourses.length}</strong> of {enabledCourses.length} courses across <strong>{categories.length}</strong> {categories.length === 1 ? "category" : "categories"}
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

        {/* ── Category Groups or Empty Search State ── */}
        {categories.length > 0 ? (
          <div className="flex flex-col gap-16 md:gap-20">
            {categories.map((category) => {
              const categoryCourses = coursesByCategory[category];
              const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

              return (
                <div key={category} id={anchor} className="scroll-mt-28 flex flex-col gap-8">
                  {/* Category Header */}
                  <div className="flex flex-col gap-2 border-b border-gold-500/20 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-gold-500 shadow-sm shadow-gold-500/50" />
                        <h2 className="font-heading text-h3 font-semibold text-navy-950">
                          {category} <span className="text-gold-600">Courses</span>
                        </h2>
                      </div>
                      <span className="rounded-full bg-gold-100 px-3.5 py-1 text-caption font-semibold text-gold-800 border border-gold-500/30">
                        {categoryCourses.length} {categoryCourses.length === 1 ? "Course" : "Courses"}
                      </span>
                    </div>
                  </div>

                  {/* Staggered Responsive Product/Course Grid per Category */}
                  <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-8"
                  >
                    {categoryCourses.map((course) => (
                      <motion.div key={course.id} variants={cardVariants}>
                        <CourseCard course={course} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
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
    </section>
  );
}
