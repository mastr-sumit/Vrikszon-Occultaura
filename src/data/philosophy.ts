/**
 * Philosophy — data for src/components/about/OurPhilosophy.tsx
 *
 * Updated with official brand philosophy: "Ancient Wisdom. Modern Guidance."
 * and official tagline: "Numbers Change • Energy Transforms • Life Elevates"
 */

export interface PhilosophyQuote {
  text: string;
  /** True until a real, verified founder quote replaces this entry. */
  isPlaceholder: boolean;
}

export interface PhilosophyMission {
  title: string;
  statement: string;
}

export interface PhilosophyContent {
  eyebrow: string;
  heading: string;
  /** Short paragraphs — kept brief per the site-wide "avoid long paragraphs" rule. */
  body: string[];
  quote: PhilosophyQuote;
  mission: PhilosophyMission;
}

export const OUR_PHILOSOPHY: PhilosophyContent = {
  eyebrow: "Our Philosophy",
  heading: "Ancient Wisdom. Modern Guidance.",
  body: [
    "At Vrikszon Occultaura, we believe that true transformation occurs when ancient esoteric wisdom meets conscious modern living. Numbers, energy, and Vastu are not tools for fortune-telling, but mirrors to help you understand your inherent potential.",
    "Our approach is designed to help you transform your life through the power of Numbers, Energy, Vastu, and Conscious Living — clearing subtle blockages and making informed choices.",
    "By bridging timeless principles with practical life solutions, we empower you to navigate life's challenges, embrace harmony, and walk your path with confidence.",
  ],
  quote: {
    text: "Numbers Change • Energy Transforms • Life Elevates",
    isPlaceholder: false,
  },
  mission: {
    title: "Our Mission",
    statement:
      "To empower people with authentic occult wisdom, helping them make informed decisions, unlock their highest potential, and live a life filled with clarity, harmony, and abundance.",
  },
};