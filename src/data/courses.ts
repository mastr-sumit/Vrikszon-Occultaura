/**
 * Course data for Vrikszon Occultaura academy and training offerings.
 * Professional certifications in Numerology, Vastu Shastra, and Occult Sciences.
 */

export interface Course {
  id: string;
  slug: string;
  title: string;
  category?: string;
  image: string;
  price: number | null;
  originalPrice?: number | null;
  shortDescription: string;
  enrollHref: string;
  enabled: boolean;
}

export const COURSES: Course[] = [
  {
    id: "mobile-numerology",
    slug: "mobile-numerology",
    title: "Mobile Numerology",
    category: "Numerology",
    image: "/images/services/mobile-numerology-course.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Master the vibrational frequency of mobile numbers, planetary digit pairings, and selecting auspicious phone numbers for growth and success.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "loshu-grid-mastery",
    slug: "loshu-grid-mastery",
    title: "Loshu Grid Mastery",
    category: "Numerology",
    image: "/images/services/loshu-grid-mastery-course.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Master the 3x3 Lo Shu cosmic grid, analyze planes of thought and action, identify missing numbers, and apply potent remedial corrections.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "name-numerology-mastery",
    slug: "name-numerology-mastery",
    title: "Name Numerology Mastery",
    category: "Numerology",
    image: "/images/services/name-numerology-mastery-course.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Learn Chaldean and Pythagorean name calculations to harmonize personal, business, and brand vibrations with favorable planetary energies.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "astrology-courses",
    slug: "astrology-courses",
    title: "Astrology Courses",
    category: "Astrology",
    image: "/images/services/astrology-courses.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Comprehensive training in Vedic and KP Astrology, covering planetary dashas, birth chart analysis, houses, and accurate event predictions.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "rudraksha-premium-course",
    slug: "rudraksha-premium-course",
    title: "Rudraksha Premium Course",
    category: "Remedies",
    image: "/images/services/rudraksha-premium-course.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Explore 1 to 14 Mukhi Rudraksha beads, authenticity identification, chakra alignment, planetary remedies, and sacred energization rituals.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "advance-vedic-switchword",
    slug: "advance-vedic-switchword",
    title: "Advance Vedic Switchword",
    category: "Switchword",
    image: "/images/services/advance-vedic-switchword.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Harness ancient Vedic switchwords and sacred bija mantras to dissolve deep-seated karmic blocks and accelerate spiritual and material growth.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "western-switchword",
    slug: "western-switchword",
    title: "Western Switchword",
    category: "Switchword",
    image: "/images/services/western-switchword.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Learn modern Western switchwords, energy circles, and vibrational phrase switching to rapidly reprogram subconscious reality and attract goals.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "pronology",
    slug: "pronology",
    title: "Pronology",
    category: "Numerology",
    image: "/images/services/pronology-course.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Analyze phonetic sound waves, syllable impacts, and negative sound patterns within names to engineer harmonious vocal resonance and fortune.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
];

export const formatCoursePrice = (price: number | null): string => {
  if (price === null) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};
