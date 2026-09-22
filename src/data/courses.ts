/**
 * Course data for Vrikszon Occultaura academy and training offerings.
 * Professional certifications in Numerology, Vastu Shastra, and Occult Sciences.
 */

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category?: string;
  categoryId?: string;
  categorySlug?: string;
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
  {
    id: "numero-yantra",
    slug: "numero-yantra",
    title: "Numero Yantra",
    category: "Numerology",
    image: "/images/services/numero-yantra-course.png",
    price: null,
    originalPrice: null,
    shortDescription:
      "Master the sacred geometry, cosmic numerical grids, and energy channeling of Numero Yantras to unlock spiritual protection and prosperity.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "watch-analysis",
    slug: "watch-analysis",
    title: "Watch Analysis",
    category: "Numerology",
    image: "/images/services/watch-analysis-course.png",
    price: null,
    originalPrice: null,
    shortDescription:
      "Decode the hidden vibrational energy and dial psychology of wrist watches and wall clocks to align personal time, focus, and career success.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "golden-tree",
    slug: "golden-tree",
    title: "Golden Tree",
    category: "Remedies",
    image: "/images/services/golden-tree-course.png",
    price: null,
    originalPrice: null,
    shortDescription:
      "Harness the prosperity science of the Golden Crystal Tree, crystal placement rituals, and cosmic energy activation to manifest abundance and harmony.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "lal-kitab",
    slug: "lal-kitab",
    title: "Lal Kitab",
    category: "Astrology",
    image: "/images/services/lal-kitab-course.png",
    price: null,
    originalPrice: null,
    shortDescription:
      "Comprehensive training in Lal Kitab astrology, planetary debt remedies (Rin Nivaran), palmistry connections, and quick-acting remedial measures.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "angel-invoking",
    slug: "angel-invoking",
    title: "Angel Invoking",
    category: "Switchword",
    image: "/images/services/angel-invoking-course.png",
    price: null,
    originalPrice: null,
    shortDescription:
      "Learn divine angel communication, archangel invocations, celestial protection rituals, and channeled healing codes for divine guidance and peace.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "crystal-course",
    slug: "crystal-course",
    title: "Crystal Course",
    category: "Remedies",
    image: "/images/services/crystal-course.png",
    price: null,
    originalPrice: null,
    shortDescription:
      "Master crystal healing science, chakra resonance, cleansing and charging rituals, and utilizing gemstone vibrations for protection and holistic wellness.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "basic-vastu",
    slug: "basic-vastu",
    title: "Basic Vastu",
    category: "Vastu",
    categorySlug: "course-vastu",
    image: "/images/courses/basic-vastu.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Master foundational Vastu Shastra principles, 8 cardinal directions, residential layout optimization, and essential environmental energy balancing.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "advance-vastu",
    slug: "advance-vastu",
    title: "Advance Vastu",
    category: "Vastu",
    categorySlug: "course-vastu",
    image: "/images/courses/advance-vastu.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "In-depth training in 16 Vastu zones, 32 entrance analysis, industrial and commercial Vastu remedies without structural demolition.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "devta-vastu",
    slug: "devta-vastu",
    title: "Devta Vastu",
    category: "Vastu",
    categorySlug: "course-vastu",
    image: "/images/courses/devta-vastu.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Unlock the secret 45 energy fields (Devtas) of Vastu Purusha Mandala, deity activation rituals, and advanced spatial energetic alignment.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "dev-urja-vastu",
    slug: "dev-urja-vastu",
    title: "Dev Urja Vastu",
    category: "Vastu",
    categorySlug: "course-vastu",
    image: "/images/courses/dev-urja-vastu.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Discover cosmic life-force energy dynamics (Prana & Dev Urja), energy scanning techniques, earth radiation neutralization, and aura sanctification.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "panch-pakshi",
    slug: "panch-pakshi",
    title: "Panch Pakshi",
    category: "Astrology",
    categorySlug: "course-astrology",
    image: "/images/courses/panch-pakshi.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Master ancient Pancha Pakshi Shastra, Vedic biorhythm astrology, 5 sacred bird biorhythm cycles, and precise timing for success, decision making, and remedies.",
    enrollHref: "/book-consultation",
    enabled: true,
  },
  {
    id: "spice-remedies",
    slug: "spice-remedies",
    title: "Spice Remedies",
    category: "Remedies",
    categorySlug: "course-remedies",
    image: "/images/courses/spice-remedies.jpg",
    price: null,
    originalPrice: null,
    shortDescription:
      "Learn powerful Vedic kitchen spice remedies, planetary dosha pacification through herbal alchemy, consecrated spices, and abundance rituals.",
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
