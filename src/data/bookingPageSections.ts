import type { ComponentType } from "react";
import BookingHero from "@/components/booking/BookingHero";
import BookingForm from "@/components/booking/BookingForm";
import HowItWorks from "@/components/booking/HowItWorks";
import BookingCTA from "@/components/booking/BookingCTA";

/**
 * A single entry in the Booking page's section configuration.
 *
 * - `id`        — stable, unique key used for React's `key` prop.
 * - `component` — the section's React component reference (not JSX),
 *                 so src/app/book-consultation/page.tsx can render it dynamically.
 * - `enabled`   — set to `false` to remove a section from the Booking page.
 *
 * Mirrors the exact pattern used by src/data/aboutSections.ts,
 * src/data/contactSections.ts, src/data/servicesPageSections.ts, and
 * src/data/shopPageSections.ts.
 */
export interface BookingPageSection {
  id: string;
  component: ComponentType;
  enabled: boolean;
}

/**
 * Booking page section configuration.
 * Sections render in array order: hero → booking-form → how-it-works → booking-cta.
 */
export const bookingPageSections: BookingPageSection[] = [
  { id: "booking-hero", component: BookingHero, enabled: true },
  { id: "booking-form", component: BookingForm, enabled: true },
  { id: "how-it-works", component: HowItWorks, enabled: true },
  { id: "booking-cta", component: BookingCTA, enabled: true },
];



