/**
 * Core Values — data for src/components/about/CoreValues.tsx
 *
 * Updated with official "Why Choose Vrikszon Occultaura" values:
 * Personalized Consultations, Authentic Guidance, Practical Solutions,
 * Ethical Practices, Research-Based Approach, and Spiritual & Practical Balance.
 */

export type CoreValueIconKey = "shield-check" | "sparkles" | "heart-handshake" | "sprout";

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: CoreValueIconKey;
  /** Set to false to hide a value from the grid without deleting it. */
  enabled: boolean;
}

export interface CoreValuesContent {
  eyebrow: string;
  heading: string;
  supportingText: string;
  values: CoreValue[];
}

export const CORE_VALUES: CoreValuesContent = {
  eyebrow: "Our Core Values",
  heading: "Why Choose Vrikszon Occultaura",
  supportingText:
    "Grounded standards and core principles that shape every consultation, reading, and mentorship session.",
  values: [
    {
      id: "personalized-consultations",
      title: "Personalized Consultations",
      description:
        "Every session is customized to your unique birth chart, mobile grid, and life situation — never relying on generic templates.",
      icon: "sparkles",
      enabled: true,
    },
    {
      id: "authentic-guidance",
      title: "Authentic Guidance",
      description:
        "Rooted in genuine occult science, formal mentorship, and deep study, offered with honesty and complete transparency.",
      icon: "shield-check",
      enabled: true,
    },
    {
      id: "practical-solutions",
      title: "Practical Solutions",
      description:
        "Simple, non-invasive remedies and actionable steps that integrate smoothly into modern daily routines.",
      icon: "sprout",
      enabled: true,
    },
    {
      id: "ethical-practices",
      title: "Ethical Practices",
      description:
        "Strictly non-fear-based guidance without exaggerated promises or superstitious claims — empowering your own free will.",
      icon: "heart-handshake",
      enabled: true,
    },
    {
      id: "research-based-approach",
      title: "Research-Based Approach",
      description:
        "Grounded in 4+ years of continuous research, energy analysis, and practical validation across diverse client cases.",
      icon: "shield-check",
      enabled: true,
    },
    {
      id: "spiritual-practical-balance",
      title: "Spiritual & Practical Balance",
      description:
        "Harmonizing ancient energetic wisdom with realistic, real-world decision-making for sustainable growth.",
      icon: "sparkles",
      enabled: true,
    },
  ],
};