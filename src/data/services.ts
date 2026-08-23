/**
 * Service data for Vrikszon Occultaura consultations and offerings.
 * Kept separate from component code so this can later be swapped for a
 * database/admin-panel source without touching UI components.
 *
 * Note: The 21 services below are all delivered together as part of the
 * one confirmed consultation package (see Step 3 of this task series).
 * Individual per-item pricing is not confirmed by the client, hence
 * `price: null` for every entry (renders "Price on request" via the
 * existing `formatPrice` helper).
 *
 * `href` points to "/services" for all items since dedicated sub-pages
 * do not exist yet.
 */

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  /** In INR. `null` means no verified price yet — render "Price on request". */
  price: number | null;
  /** Only set for services with a documented session length. */
  durationMinutes?: number;
  /** Reserved for a future Next/Image source. `null` = show the design-system placeholder. */
  image: string | null;
  featured: boolean;
  enabled: boolean;
  href: string;
}

export const SERVICES: Service[] = [
  {
    id: "mobile-numerology-analysis",
    slug: "mobile-numerology-analysis",
    name: "Mobile Numerology Analysis",
    category: "Numerology",
    shortDescription:
      "In-depth analysis of your phone number's numerical vibrations and alignment with your personal birth charts.",
    price: null,
    image: "/images/services/mobile-numerology-analysis.png",
    featured: true,
    enabled: true,
    href: "/services",
  },
  {
    id: "mobile-number-design-sim-card-provided",
    slug: "mobile-number-design-sim-card-provided",
    name: "Mobile Number Design / SIM Card Provided",
    category: "Numerology",
    shortDescription:
      "Custom phone number selection and SIM card provision designed for optimal energetic resonance (chargeable service — physical SIM card design & provision incurs an additional fee).",
    price: null,
    image: "/images/services/mobile-number-design-sim-card-provided.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "name-numerology-pronology-analysis",
    slug: "name-numerology-pronology-analysis",
    name: "Name Numerology & Pronology Analysis (Fix & Design)",
    category: "Numerology",
    shortDescription:
      "Comprehensive evaluation and subtle phonetic correction of your full name to harmonize personal and professional vibrations.",
    price: null,
    image: "/images/services/name-numerology-pronology-analysis.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "loshu-grid-mastery",
    slug: "loshu-grid-mastery",
    name: "Loshu Grid Mastery (Date of Birth)",
    category: "Numerology",
    shortDescription:
      "Detailed calculation and analysis of your Loshu Grid based on your exact date of birth to uncover latent strengths and elements.",
    price: null,
    image: "/images/services/loshu-grid-mastery.png",
    featured: true,
    enabled: true,
    href: "/services",
  },
  {
    id: "missing-repeated-number-remedies",
    slug: "missing-repeated-number-remedies",
    name: "Missing & Repeated Number: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Targeted remedial measures to balance missing numbers and harmonize overactive repeated numbers in your birth grid.",
    price: null,
    image: "/images/services/missing-repeated-number-remedies.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "available-number-significance-impact",
    slug: "available-number-significance-impact",
    name: "Available Number, Significance & Impact",
    category: "Numerology",
    shortDescription:
      "In-depth evaluation of present numbers in your chart and their direct impact on your daily life, choices, and personality.",
    price: null,
    image: "/images/services/available-number-significance-impact.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "lucky-unlucky-numbers-colours",
    slug: "lucky-unlucky-numbers-colours",
    name: "Lucky / Unlucky Numbers & Colours",
    category: "Numerology",
    shortDescription:
      "Personalized guidance on your most supportive numbers and color palettes, alongside frequencies to avoid.",
    price: null,
    image: "/images/services/lucky-unlucky-numbers-colours.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "love-relationship-marriage-healing",
    slug: "love-relationship-marriage-healing",
    name: "Love & Relationship / Marriage: Healing",
    category: "Remedies & Healing",
    shortDescription:
      "Energetic and numerical alignment remedies aimed at fostering harmony, understanding, and healing in relationships and marriage.",
    price: null,
    image: "/images/services/love-relationship-marriage-healing.png",
    featured: true,
    enabled: true,
    href: "/services",
  },
  {
    id: "career-finance-analysis-remedies",
    slug: "career-finance-analysis-remedies",
    name: "Career and Finance Analysis: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Strategic remedies tailored to remove professional blockages and align your career path for sustainable financial growth.",
    price: null,
    image: "/images/services/career-finance-analysis-remedies.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "foreign-travel-studies-job-remedies",
    slug: "foreign-travel-studies-job-remedies",
    name: "Foreign Travel: Studies & Job: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Vedic and numerical remedies designed to clear obstacles for overseas education, job opportunities, and international settlement.",
    price: null,
    image: "/images/services/foreign-travel-studies-job-remedies.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "rituals-job-business-growth-remedies",
    slug: "rituals-job-business-growth-remedies",
    name: "Rituals to Get Job & Growth of Business: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Purposeful ritualistic remedies aimed at accelerating employment search and driving business expansion.",
    price: null,
    image: "/images/services/rituals-job-business-growth-remedies.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "specific-rituals-yantras-remedies",
    slug: "specific-rituals-yantras-remedies",
    name: "Specific Rituals & Yantras: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Custom sacred rituals and energized Yantras tailored to neutralize specific astrological afflictions (chargeable service — specific ritual materials and yantras incur additional costs).",
    price: null,
    image: "/images/services/specific-rituals-yantras-remedies.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "health-analysis-healing",
    slug: "health-analysis-healing",
    name: "Health Analysis and Healing (Vedic Mantras / Western Remedies)",
    category: "Remedies & Healing",
    shortDescription:
      "Holistic health assessment leveraging sacred Vedic mantras and complementary Western energy remedies for overall wellness.",
    price: null,
    image: "/images/services/health-analysis-healing.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "infertility-chronic-diseases-remedies",
    slug: "infertility-chronic-diseases-remedies",
    name: "Infertility & Chronic Diseases: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Specialized energetic guidance and remedial support focused on fertility concerns and managing long-standing health challenges.",
    price: null,
    image: "/images/services/infertility-chronic-diseases-remedies.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "crystals-rudraksh-sanjivani-cards-energy-circles",
    slug: "crystals-rudraksh-sanjivani-cards-energy-circles",
    name: "Crystals / Rudraksh / Sanjivani Cards / Energy Circles: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Personalized recommendation and activation of sacred crystals, Rudraksha, Sanjivani cards, and energy circles (chargeable service — physical crystals, rudraksh, and energy cards carry separate material costs).",
    price: null,
    image: "/images/services/crystals-rudraksh-sanjivani-cards-energy-circles.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "healing-court-cases",
    slug: "healing-court-cases",
    name: "Healing for Court Cases",
    category: "Remedies & Healing",
    shortDescription:
      "Focused spiritual and remedial interventions to assist in resolving ongoing legal disputes and court proceedings smoothly.",
    price: null,
    image: "/images/services/healing-court-cases.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "mahadasha-vastu-dasha-missing-numbers",
    slug: "mahadasha-vastu-dasha-missing-numbers",
    name: "Mahadasha / Vastu Dasha as per Missing Numbers",
    category: "Vastu & Planetary",
    shortDescription:
      "Comprehensive timeline analysis correlating planetary Dasha periods with space Vastu alignment based on chart gaps.",
    price: null,
    image: "/images/services/mahadasha-vastu-dasha-missing-numbers.png",
    featured: true,
    enabled: true,
    href: "/services",
  },
  {
    id: "kp-astrology",
    slug: "kp-astrology",
    name: "KP Astrology",
    category: "Astrology",
    shortDescription:
      "Precision astrological readings utilizing the Krishnamurti Paddhati (KP) system to deliver accurate sub-lord event timing.",
    price: null,
    image: "/images/services/kp-astrology.png",
    featured: true,
    enabled: true,
    href: "/services",
  },
  {
    id: "business-name-analysis",
    slug: "business-name-analysis",
    name: "Business Name Analysis",
    category: "Name & Brand",
    shortDescription:
      "Energetic and numerical assessment of your existing business name to ensure resonance with enterprise goals.",
    price: null,
    image: "/images/services/business-name-analysis.png",
    featured: true,
    enabled: true,
    href: "/services",
  },
  {
    id: "business-name-design-logo-visiting-cards",
    slug: "business-name-design-logo-visiting-cards",
    name: "Business Name Design / Logo / Visiting Cards",
    category: "Name & Brand",
    shortDescription:
      "Complete commercial brand identity development including name engineering, logo design, and card layout (chargeable service — custom design assets, logos, and physical printing carry additional design fees).",
    price: null,
    image: "/images/services/business-name-design-logo-visiting-cards.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
  {
    id: "wall-clocks-wrist-watch-analysis-remedies",
    slug: "wall-clocks-wrist-watch-analysis-remedies",
    name: "Wall Clocks / Wrist Watch Analysis: Remedies",
    category: "Remedies & Healing",
    shortDescription:
      "Analysis of timekeeping devices in your home and on your wrist, providing remedies to convert time frequency into positive momentum.",
    price: null,
    image: "/images/services/wall-clocks-wrist-watch-analysis-remedies.png",
    featured: false,
    enabled: true,
    href: "/services",
  },
];

/** INR currency formatting, or an explicit fallback when no price is verified yet. */
export function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}