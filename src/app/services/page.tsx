import type { Metadata } from "next";
import { servicesPageSections } from "@/data/servicesPageSections";

export const metadata: Metadata = {
  title: "Our Services | Vrikszon Occultaura",
  description:
    "Explore personalized Numerology, Vastu, KP Astrology, and tailored remedial consultation services by Vrikszon Occultaura.",
};

/**
 * Services Page
 *
 * Renders the configured, enabled Services page sections in order — see
 * src/data/servicesPageSections.ts to enable/disable, reorder, or add a
 * section. Mirrors src/app/about/page.tsx's config-driven rendering pattern
 * exactly so the Services page follows the same architecture.
 */
export default function ServicesPage() {
  return (
    <main>
      {servicesPageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => (
          <Section key={id} />
        ))}
    </main>
  );
}
