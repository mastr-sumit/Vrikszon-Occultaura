import type { ComponentType } from "react";
import ShopHero from "@/components/shop/ShopHero";
import ShopGrid from "@/components/shop/ShopGrid";

/**
 * A single entry in the Shop page's section configuration.
 *
 * - `id`        — stable, unique key used for React's `key` prop.
 * - `component` — the section's React component reference (not JSX),
 *                 so src/app/shop/page.tsx can render it dynamically.
 * - `enabled`   — set to `false` to remove a section from the Shop page.
 *
 * Mirrors the exact pattern used by src/data/aboutSections.ts,
 * src/data/contactSections.ts, and src/data/servicesSections.ts.
 */
export interface ShopSection {
  id: string;
  component: ComponentType;
  enabled: boolean;
}

/**
 * Shop page section configuration.
 * Sections render in array order: hero → grid.
 */
export const shopPageSections: ShopSection[] = [
  { id: "shop-hero", component: ShopHero, enabled: true },
  { id: "shop-grid", component: ShopGrid, enabled: true },
];
