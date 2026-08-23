import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Expert from "@/components/sections/Expert";
import EsteemServices from "@/components/sections/EsteemServices";
import ServicesPreview from "@/components/sections/ServicesPreview";
import Products from "@/components/sections/Products";
import SacredProducts from "@/components/sections/SacredProducts";
import ZodiacSection from "@/components/sections/ZodiacSection";
import BookingSection from "@/components/sections/BookingSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import GoogleReviews from "@/components/sections/GoogleReviews";
import ClientReviews from "@/components/sections/ClientReviews";
import FAQPreview from "@/components/sections/FAQPreview";
import CTASection from "@/components/sections/CTASection";

/**
 * A single entry in the homepage's section configuration.
 *
 * - `id`      — stable, unique key used for React's `key` prop and for
 *               referring to the section when editing this file.
 * - `component` — the section's React component reference (not JSX),
 *               so `page.tsx` can render it dynamically.
 * - `enabled` — set to `false` to remove a section from the homepage
 *               without deleting its configuration entry or touching
 *               the component itself.
 */
export interface HomepageSection {
  id: string;
  component: ComponentType;
  enabled: boolean;
}

/**
 * Homepage section configuration.
 *
 * Order in this array is the render order on the homepage — reorder a
 * section by moving its object, disable one with `enabled: false`, and
 * re-enable it later with `enabled: true`. None of this requires
 * touching the section components, page.tsx, or layout.tsx.
 *
 * This currently lists the sections being rendered on the production
 * homepage, in their live order. Sections that exist as files under
 * src/components/sections/ but aren't wired in yet (FeaturedServices,
 * ServicesGrid, Testimonials, Products, Zodiac, Appointment, Blog, and
 * the older AboutPreview — now superseded by About) are intentionally
 * left out until they're built/approved and ready to go live, per the
 * production rollout plan.
 */
export const homepageSections: HomepageSection[] = [
  { id: "hero", component: Hero, enabled: true },
  { id: "about", component: About, enabled: true },
  { id: "expert", component: Expert, enabled: true },
  { id: "esteem-services", component: EsteemServices, enabled: true },
  { id: "services", component: ServicesPreview, enabled: false },
  { id: "products", component: Products, enabled: true },
  { id: "sacred-products", component: SacredProducts, enabled: true },
  { id: "zodiac", component: ZodiacSection, enabled: true },
  { id: "booking", component: BookingSection, enabled: true },
  { id: "testimonials", component: Testimonials, enabled: true },
  { id: "google-reviews", component: GoogleReviews, enabled: false },
  { id: "client-reviews", component: ClientReviews, enabled: true },
  { id: "why-choose-us", component: WhyChooseUs, enabled: true },
  { id: "faq", component: FAQPreview, enabled: true },
  { id: "cta", component: CTASection, enabled: true },
];