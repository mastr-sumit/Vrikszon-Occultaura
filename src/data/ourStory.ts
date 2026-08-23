/**
 * Our Story — data for src/components/about/OurStory.tsx
 *
 * Updated with official content from the client's "My Story" document.
 * Reflects founder Hayaett S Rahman's real origin story, updated Mission
 * and Vision descriptions, and verified statistics.
 */

export interface OurStoryStatistic {
  id: string;
  label: string;
  /** Verified figure as display-ready text, or `null` if not yet verified. */
  value: string | null;
}

export interface OurStoryContent {
  eyebrow: string;
  heading: string;
  /** Short paragraphs — kept brief per the "avoid long paragraphs" brief. */
  paragraphs: string[];
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  statistics: OurStoryStatistic[];
}

export const OUR_STORY: OurStoryContent = {
  eyebrow: "Our Story",
  heading: "A Mother's Search for Answers, A Practice Built on Purpose",
  paragraphs: [
    "Vrikszon Occultaura began in 2022 when Hayaett S Rahman's daughter, Sristi Rahman, fell ill with an H. pylori infection. Medical recovery showed on paper, yet persistent pain continued without clear answers.",
    "Driven to look deeper, Hayaett researched energy, vibrations, and frequencies, discovering a challenging numerology combination in her daughter's mobile number that explained the underlying imbalance.",
    "Seeking authentic knowledge, Hayaett pursued formal training under mentor Dr. Ankit Batra. What began as a personal search to help her daughter grew into a dedicated practice guiding others toward harmony and self-discovery.",
  ],
  mission: {
    title: "Our Mission",
    description:
      "To empower people with authentic occult wisdom — helping you make informed decisions, unlock your highest potential, and live a life filled with clarity, harmony, and abundance.",
  },
  vision: {
    title: "Our Vision",
    description:
      "To become a globally trusted platform where ancient wisdom meets modern life — inspiring positive transformation through the power of energy, numbers, and conscious living.",
  },
  statistics: [
    { id: "experience", label: "Years of Experience", value: "4+" },
    { id: "consultations", label: "Consultations Completed", value: null },
    { id: "clients", label: "Happy Clients", value: null },
  ],
};