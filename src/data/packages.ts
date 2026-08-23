import { SERVICES } from "@/data/services";

/**
 * Package interface for Vrikszon Occultaura consultation packages.
 *
 * Price is a plain editable number field in INR so an admin or developer can
 * easily update package pricing without changing component code.
 */
export interface Package {
  id: string;
  name: string;
  tagline: string;
  /** In INR. Editable number field. */
  price: number;
  turnaround: string;
  /** List of included service names or features. */
  includes: string[];
  featured: boolean;
  enabled: boolean;
}

/**
 * Confirmed Consultation Packages.
 *
 * Currently contains the client's single confirmed consultation package
 * ("Premium Numerology Consultation" at ₹11,000). Structured as an array so
 * additional pricing tiers can be added in the future without modifying
 * UI components.
 */
export const PACKAGES: Package[] = [
  {
    id: "premium-numerology-consultation",
    name: "Premium Numerology Consultation",
    tagline: "One Report. Complete Solutions.",
    price: 10999,
    turnaround: "4–5 days",
    includes: SERVICES.map((service) => service.name),
    featured: true,
    enabled: true,
  },
];
