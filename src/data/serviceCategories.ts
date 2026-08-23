/**
 * The 4 homepage "Our Services" category cards (ServicesPreview.tsx).
 *
 * Distinct from src/data/services.ts, which holds paid/featured
 * consultation offerings for the EsteemServices commerce carousel.
 * This file is editorial category data only — no prices, no cart.
 *
 * Every title below is taken verbatim from sitemap.md's "/services"
 * listing (Personal Numerology, Business Numerology, Vastu
 * Consultation, Career Guidance) — none invented. `href` only points
 * at a specific page when sitemap.md's "SEO URL Structure" defines
 * that exact slug; Vastu has no dedicated slug there yet, so it falls
 * back to the general /services listing, same call made in
 * EsteemServices/services.ts.
 *
 * `icon` is a stable string key rather than a Lucide component
 * reference, so this data file has no React/UI dependency — the
 * mapping to an actual icon lives in ServicesPreview.tsx.
 */

export type ServiceCategoryIcon =
  | "hash"
  | "briefcase"
  | "signature"
  | "smartphone"
  | "compass"
  | "sparkles";

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ServiceCategoryIcon;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "personal-numerology",
    title: "Personal Numerology Analysis",
    description:
      "Understand your life path, core strengths, and personal timing through a comprehensive numerology reading.",
    href: "/services/personal-numerology",
    icon: "hash",
  },
  {
    id: "business-numerology",
    title: "Business Numerology",
    description:
      "Align your business name, brand vibration, and key dates for strategic clarity and growth.",
    href: "/services/business-numerology",
    icon: "briefcase",
  },
  {
    id: "name-correction",
    title: "Name Correction & Name Energy Analysis",
    description:
      "Harmonize your name's phonetic and numerical energy with your core life numbers for balanced success.",
    href: "/services/name-correction",
    icon: "signature",
  },
  {
    id: "mobile-numerology",
    title: "Mobile Numerology",
    description:
      "Align your phone number's frequency with your personal numbers to support daily communication and opportunities.",
    href: "/services/mobile-numerology",
    icon: "smartphone",
  },
  {
    id: "vastu-consultation",
    title: "Vastu Consultation for Homes & Workspaces",
    description:
      "Bring balance and harmonious energy flow to your living and working environments through practical Vastu principles.",
    href: "/services",
    icon: "compass",
  },
  {
    id: "energy-alignment",
    title: "Energy Alignment & Spiritual Guidance",
    description:
      "Clear subtle energetic blockages and align your mind, body, and spirit with calm, grounded wisdom.",
    href: "/services",
    icon: "sparkles",
  },
];