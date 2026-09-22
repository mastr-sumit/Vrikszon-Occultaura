import type { Metadata } from "next";
import { coursesPageSections } from "@/data/coursesPageSections";
import { getPublicCourses, getPublicCourseCategories } from "@/lib/db-public";
import CoursesGrid from "@/components/courses/CoursesGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Courses | Vrikszon Occultaura",
  description:
    "Master Vedic Numerology, Vastu Shastra, and Occult Sciences with professional certification programs, live workshops, and expert mentorship.",
};

/**
 * Courses Page
 *
 * Server Component with live DB data fetching — guarantees immediate
 * reflection of Admin Panel updates for Courses.
 */
export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getPublicCourses(),
    getPublicCourseCategories(),
  ]);

  return (
    <main>
      {coursesPageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => {
          if (id === "courses-grid") {
            return (
              <CoursesGrid
                key={id}
                initialCourses={courses}
                initialCategories={categories}
              />
            );
          }
          return <Section key={id} />;
        })}
    </main>
  );
}

