import type { ComponentType } from "react";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import MeetTheExpert from "@/components/about/MeetTheExpert";
import OurPhilosophy from "@/components/about/OurPhilosophy";
import JourneyTimeline from "@/components/about/JourneyTimeline";
import CoreValues from "@/components/about/CoreValues";
import WhyClientsTrustUs from "@/components/about/WhyClientsTrustUs";
import AboutCTA from "@/components/about/AboutCTA";

/**
 * A single entry in the About page's section configuration.
 *
 * - `id`      — stable, unique key used for React's `key` prop and for
 *               referring to the section when editing this file.
 * - `component` — the section's React component reference (not JSX),
 *               so src/app/about/page.tsx can render it dynamically.
 * - `enabled` — set to `false` to remove a section from the About page
 *               without deleting its configuration entry or touching
 *               the component itself.
 *
 * Mirrors the exact pattern already used by src/data/homepageSections.ts
 * so the About page follows the same config-driven architecture as the
 * homepage.
 */
export interface AboutSection {
  id: string;
  component: ComponentType;
  enabled: boolean;
}

/**
 * About page section configuration.
 *
 * AboutHero and OurStory are built and live. Remaining sections
 * (Expert/Founder, Values, CTA, etc.) are listed here as commented-out
 * entries so future tasks only have to uncomment + import once each
 * component is actually built — never rendering a section that doesn't
 * exist yet.
 */
export const aboutSections: AboutSection[] = [
  { id: "about-hero", component: AboutHero, enabled: true },
  { id: "our-story", component: OurStory, enabled: true },
  { id: "meet-the-expert", component: MeetTheExpert, enabled: true },
  { id: "our-philosophy", component: OurPhilosophy, enabled: true },
  { id: "journey-timeline", component: JourneyTimeline, enabled: true },
  { id: "core-values", component: CoreValues, enabled: true },
  { id: "why-clients-trust-us", component: WhyClientsTrustUs, enabled: true },
  { id: "about-cta", component: AboutCTA, enabled: true },
];