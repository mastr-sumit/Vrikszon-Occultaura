import type { ComponentType } from "react";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import ServicesProcess from "@/components/services/ServicesProcess";
import PackagesSection from "@/components/services/PackagesSection";

/**
 * A single entry in the Services page's section configuration.
 *
 * - `id`        — stable, unique key used for React's `key` prop and for
 *                 referring to the section when editing this file.
 * - `component` — the section's React component reference (not JSX),
 *                 so src/app/services/page.tsx can render it dynamically.
 * - `enabled`   — set to `false` to remove a section from the Services page
 *                 without deleting its configuration entry or touching
 *                 the component itself.
 *
 * Mirrors the exact pattern used by src/data/aboutSections.ts
 * and src/data/contactSections.ts so the Services page follows the same
 * config-driven architecture.
 */
export interface ServicesPageSection {
  id: string;
  component: ComponentType;
  enabled: boolean;
}

/**
 * Services page section configuration.
 * Configured sections render in array order: hero → grid → process → packages.
 */
export const servicesPageSections: ServicesPageSection[] = [
  { id: "services-hero", component: ServicesHero, enabled: true },
  { id: "services-grid", component: ServicesGrid, enabled: true },
  { id: "services-process", component: ServicesProcess, enabled: true },
  { id: "packages", component: PackagesSection, enabled: true },
];
