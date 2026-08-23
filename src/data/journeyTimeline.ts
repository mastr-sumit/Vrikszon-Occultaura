/**
 * Journey Timeline — data for src/components/about/JourneyTimeline.tsx
 *
 * Updated with the founder's real chronology:
 * 2022 health challenge research → formal mentorship under Dr. Ankit Batra →
 * teaching & mentoring (~1 year) → founding Vrikszon Occultaura (4+ years practice).
 */

export type JourneyIconKey = "compass" | "eye" | "sparkles" | "trending-up";

export interface JourneyStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: JourneyIconKey;
}

export interface JourneyTimelineContent {
  eyebrow: string;
  heading: string;
  supportingText: string;
  steps: JourneyStep[];
}

export const JOURNEY_TIMELINE: JourneyTimelineContent = {
  eyebrow: "Our Journey",
  heading: "From Personal Discovery to Guiding Others",
  supportingText:
    "A chronological milestone of research, formal mentorship, teaching, and founding a dedicated occult science practice.",
  steps: [
    {
      id: "initial-research",
      number: "01",
      title: "2022: Initial Research",
      description:
        "A daughter's health challenge sparks deep investigation into energy, vibrations, and mobile numerology.",
      icon: "compass",
    },
    {
      id: "formal-mentorship",
      number: "02",
      title: "Formal Mentorship",
      description:
        "Mastering core numerology and Vastu principles through formal training under mentor Dr. Ankit Batra.",
      icon: "eye",
    },
    {
      id: "teaching-mentoring",
      number: "03",
      title: "Teaching & Mentoring",
      description:
        "Becoming a mentor on the same platform, teaching numerology to aspiring students for nearly a year.",
      icon: "sparkles",
    },
    {
      id: "vrikszon-occultaura",
      number: "04",
      title: "Vrikszon Occultaura",
      description:
        "Founding Vrikszon Occultaura after 4 years of continuous practice, research, course creation, and consultations.",
      icon: "trending-up",
    },
  ],
};