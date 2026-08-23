import type { Metadata } from "next";
import { shopPageSections } from "@/data/shopPageSections";

export const metadata: Metadata = {
  title: "Shop | Vrikszon Occultaura",
  description:
    "Explore our collection of sacred crystals, Rudraksha malas, healing bracelets, and Vastu tools energised to support your spiritual journey and personal balance.",
};

/**
 * Shop Page
 *
 * Renders the configured, enabled Shop page sections in order — see
 * src/data/shopPageSections.ts to enable/disable, reorder, or add a
 * section. Follows the same config-driven architecture as /about, /contact, and /services.
 */
export default function ShopPage() {
  return (
    <main>
      {shopPageSections
        .filter((section) => section.enabled)
        .map(({ id, component: Section }) => (
          <Section key={id} />
        ))}
    </main>
  );
}
