/**
 * Zodiac sign dataset for the homepage "Cosmic Code" section
 * (src/components/sections/ZodiacSection.tsx).
 *
 * This is intentionally a visual discovery dataset, not a horoscope
 * engine — per docs/content.md's Brand Voice rules (no fear-based
 * language, no fortune-telling claims, no exaggerated promises),
 * `shortDescription` sticks to broad, neutral, non-deterministic sign
 * qualities ("known for", "associated with") and never predicts,
 * guarantees, or addresses the reader directly ("you will...").
 *
 * `symbol` uses the standard Unicode astrological glyphs. These render
 * safely in all modern browsers/system fonts without any icon-library
 * install, but per the accessibility rule below, the glyph is always
 * marked `aria-hidden` at render time and paired with the visible sign
 * `name` as real text — nothing here is communicated through the glyph
 * alone.
 *
 * `href`: no dedicated per-sign route exists anywhere in sitemap.md's
 * verified URL structure, and this task explicitly disallows inventing
 * one. Every sign falls back to the general `/services` listing page —
 * a real, verified route — so the discovery experience still leads
 * somewhere useful without a 404 or a fabricated URL.
 */

export interface ZodiacSign {
  id: string;
  name: string;
  /** Unicode astrological glyph — always rendered aria-hidden. */
  symbol: string;
  /** Approximate tropical zodiac date range. */
  dateRange: string;
  /** Astrological element classification. */
  element: "fire" | "earth" | "air" | "water";
  /** One neutral, non-deterministic sentence — never a prediction. */
  shortDescription: string;
  /** Illustrated full-card header image */
  cardImage: string;
  href: string;
  enabled: boolean;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    symbol: "\u2648",
    dateRange: "Mar 21 – Apr 19",
    element: "fire",
    shortDescription:
      "Known for initiative, courage and a bold approach to new beginnings.",
    cardImage: "/images/zodiac/cards/aries-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "taurus",
    name: "Taurus",
    symbol: "\u2649",
    dateRange: "Apr 20 – May 20",
    element: "earth",
    shortDescription:
      "Associated with patience, stability and a strong appreciation for comfort.",
    cardImage: "/images/zodiac/cards/taurus-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    symbol: "\u264A",
    dateRange: "May 21 – Jun 20",
    element: "air",
    shortDescription:
      "Linked to curiosity, adaptability and quick, expressive communication.",
    cardImage: "/images/zodiac/cards/gemini-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "cancer",
    name: "Cancer",
    symbol: "\u264B",
    dateRange: "Jun 21 – Jul 22",
    element: "water",
    shortDescription:
      "Connected to intuition, emotional depth and a nurturing nature.",
    cardImage: "/images/zodiac/cards/cancer-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "leo",
    name: "Leo",
    symbol: "\u264C",
    dateRange: "Jul 23 – Aug 22",
    element: "fire",
    shortDescription:
      "Associated with confidence, warmth and natural leadership qualities.",
    cardImage: "/images/zodiac/cards/leo-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "virgo",
    name: "Virgo",
    symbol: "\u264D",
    dateRange: "Aug 23 – Sep 22",
    element: "earth",
    shortDescription:
      "Known for precision, practicality and thoughtful attention to detail.",
    cardImage: "/images/zodiac/cards/virgo-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "libra",
    name: "Libra",
    symbol: "\u264E",
    dateRange: "Sep 23 – Oct 22",
    element: "air",
    shortDescription:
      "Linked to balance, harmony and a natural sense of fairness.",
    cardImage: "/images/zodiac/cards/libra-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "scorpio",
    name: "Scorpio",
    symbol: "\u264F",
    dateRange: "Oct 23 – Nov 21",
    element: "water",
    shortDescription:
      "Associated with depth, focus and a strong sense of determination.",
    cardImage: "/images/zodiac/cards/scorpio-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    symbol: "\u2650",
    dateRange: "Nov 22 – Dec 21",
    element: "fire",
    shortDescription:
      "Known for optimism, curiosity and a genuine love of exploration.",
    cardImage: "/images/zodiac/cards/sagittarius-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "capricorn",
    name: "Capricorn",
    symbol: "\u2651",
    dateRange: "Dec 22 – Jan 19",
    element: "earth",
    shortDescription:
      "Linked to discipline, ambition and a grounded, steady approach.",
    cardImage: "/images/zodiac/cards/capricorn-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "aquarius",
    name: "Aquarius",
    symbol: "\u2652",
    dateRange: "Jan 20 – Feb 18",
    element: "air",
    shortDescription:
      "Associated with independence, originality and forward thinking.",
    cardImage: "/images/zodiac/cards/aquarius-card.jpg",
    href: "/services",
    enabled: true,
  },
  {
    id: "pisces",
    name: "Pisces",
    symbol: "\u2653",
    dateRange: "Feb 19 – Mar 20",
    element: "water",
    shortDescription:
      "Known for imagination, empathy and a reflective, gentle nature.",
    cardImage: "/images/zodiac/cards/pisces-card.jpg",
    href: "/services",
    enabled: true,
  },
];