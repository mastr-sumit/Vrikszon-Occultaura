import type { Metadata } from "next";
import { aboutSections } from "@/data/aboutSections";

export const metadata: Metadata = {
  title: "About Us | Vrikszon Occultaura",
  description:
    "Learn about Vrikszon Occultaura's philosophy and approach to personalized Numerology and Vastu guidance.",
};

/**
 * About Page
 *
 * Renders the configured, enabled About page sections in order — see
 * src/data/aboutSections.ts to enable/disable, reorder, or add a
 * section. Mirrors src/app/page.tsx's config-driven rendering pattern
 * exactly so the About page follows the same architecture as the
 * homepage; AboutHero is never imported/rendered directly here.
 */
export default function AboutPage() {
  return (
    <main>
      {aboutSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => (
          <Section key={id} />
        ))}
    </main>
  );
}