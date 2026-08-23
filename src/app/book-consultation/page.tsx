import type { Metadata } from "next";
import { bookingPageSections } from "@/data/bookingPageSections";

export const metadata: Metadata = {
  title: "Book a Consultation | Vrikszon Occultaura",
  description:
    "Schedule your personalized Numerology or Vastu consultation with Vrikszon Occultaura to discover clarity, energy alignment, and purposeful life direction.",
};

/**
 * Book Consultation Page
 *
 * Renders the configured, enabled Booking page sections in order — see
 * src/data/bookingPageSections.ts to enable/disable, reorder, or add
 * sections. Mirrors the config-driven rendering pattern used across
 * the application.
 */
export default function BookConsultationPage() {
  return (
    <main>
      {bookingPageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => (
          <Section key={id} />
        ))}
    </main>
  );
}
