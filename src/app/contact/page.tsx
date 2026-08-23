import type { Metadata } from "next";
import { contactSections } from "@/data/contactSections";

export const metadata: Metadata = {
  title: "Contact Us | Vrikszon Occultaura",
  description:
    "Get in touch with Vrikszon Occultaura for personalized Numerology and Vastu guidance. Reach out to schedule a consultation or ask questions.",
};

/**
 * Contact Page
 *
 * Renders the configured, enabled Contact page sections in order — see
 * src/data/contactSections.ts to enable/disable, reorder, or add a
 * section. Mirrors src/app/about/page.tsx's config-driven rendering pattern
 * exactly so the Contact page follows the same architecture; ContactHero
 * is never imported/rendered directly here.
 */
export default function ContactPage() {
  return (
    <main>
      {contactSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => (
          <Section key={id} />
        ))}
    </main>
  );
}
