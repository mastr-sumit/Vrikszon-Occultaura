import type { ComponentType } from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactCTA from "@/components/contact/ContactCTA";

/**
 * A single entry in the Contact page's section configuration.
 *
 * - `id`        — stable, unique key used for React's `key` prop and for
 *                 referring to the section when editing this file.
 * - `component` — the section's React component reference (not JSX),
 *                 so src/app/contact/page.tsx can render it dynamically.
 * - `enabled`   — set to `false` to remove a section from the Contact page
 *                 without deleting its configuration entry or touching
 *                 the component itself.
 *
 * Mirrors the exact pattern already used by src/data/aboutSections.ts
 * and src/data/homepageSections.ts so the Contact page follows the same
 * config-driven architecture.
 */
export interface ContactSection {
  id: string;
  component: ComponentType;
  enabled: boolean;
}

/**
 * Contact page section configuration.
 * Sections render in array order: hero → info → form → cta.
 */
export const contactSections: ContactSection[] = [
  { id: "contact-hero", component: ContactHero, enabled: true },
  { id: "contact-info", component: ContactInfo, enabled: true },
  { id: "contact-form", component: ContactForm, enabled: true },
  { id: "contact-cta", component: ContactCTA, enabled: true },
];
