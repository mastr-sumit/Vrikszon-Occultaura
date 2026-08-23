import type { Metadata } from "next";
import { homepageSections } from "@/data/homepageSections";

export const metadata: Metadata = {
  title: "Vrikszon Occultaura | Numbers Change • Energy Transforms • Life Elevates",
  description:
    "Premium Numerology & Vastu guidance with Vrikszon Occultaura. Numbers Change • Energy Transforms • Life Elevates through personalized consultation.",
};

/**
 * Homepage
 *
 * Renders the configured, enabled homepage sections in order — see
 * src/data/homepageSections.ts to enable/disable, reorder, or add a
 * section. Config-driven rendering only; no section component is
 * imported or hardcoded directly here. This file must render ONLY
 * homepageSections — never AboutHero or aboutSections.
 */
export default function HomePage() {
  return (
    <main>
      {homepageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => (
          <Section key={id} />
        ))}
    </main>
  );
}