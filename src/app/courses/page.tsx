import type { Metadata } from "next";
import { coursesPageSections } from "@/data/coursesPageSections";

export const metadata: Metadata = {
  title: "Courses | Vrikszon Occultaura",
  description:
    "Master Vedic Numerology, Vastu Shastra, and Occult Sciences with professional certification programs, live workshops, and expert mentorship.",
};

/**
 * Courses Page
 *
 * Renders the configured, enabled Courses page sections in order — see
 * src/data/coursesPageSections.ts to enable/disable, reorder, or add a section.
 * Follows the same config-driven architecture as /shop, /about, /contact, and /services.
 */
export default function CoursesPage() {
  return (
    <main>
      {coursesPageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => (
          <Section key={id} />
        ))}
    </main>
  );
}
