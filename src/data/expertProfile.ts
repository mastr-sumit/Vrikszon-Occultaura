/**
 * Expert Profile — data for src/components/about/MeetTheExpert.tsx
 *
 * Updated with official profile details for founder Hayaett S Rahman:
 * Vastu Expert, Numerologist, and Occult Science Practitioner.
 * Includes her training under Dr. Ankit Batra, mentorship experience,
 * and 4+ years of continuous research and practice.
 */

export interface ExpertCredential {
  id: string;
  label: string;
  value: string;
}

export interface ExpertAchievement {
  id: string;
  title: string;
  description: string;
  /** True until a real, verified achievement replaces this entry. */
  isPlaceholder: boolean;
}

export interface ExpertQuote {
  text: string;
  /** True until a real, verified quote replaces this entry. */
  isPlaceholder: boolean;
}

export interface ExpertProfile {
  name: string;
  designation: string;
  location: string;
  bio: string[];
  credentials: ExpertCredential[];
  achievements: ExpertAchievement[];
  quote: ExpertQuote;
  cta: {
    label: string;
    href: string;
  };
}

export const EXPERT_PROFILE: ExpertProfile = {
  name: "Hayaett S Rahman",
  designation: "Vastu Expert, Numerologist & Occult Science Practitioner",
  location: "Kolkata",
  bio: [
    "Born Sahnaaz Rahman, she transformed her own name to Hayaett S Rahman — guided by the very science of Numerology she now practices — a living, personal testament to the power of energetic numerical alignment.",
    "Her path into energy science began when seeking answers for her daughter's health challenge in 2022, uncovering the profound influence of numerical vibrations and environmental alignment.",
    "As a seasoned Vastu Practitioner, Hayaett brings deep expertise in residential and commercial Vastu Shastra. She specializes in analyzing space energy flow, balancing the five cosmic elements (Panchtattva), and correcting severe structural Vastu doshas through non-demolition remedies like brass pyramids, copper shifters, and energy centralisers.",
    "Following formal training under mentor Dr. Ankit Batra, Hayaett became a mentor on the same platform, teaching numerology for nearly a year. Over 4 years of continuous practice, research, mentoring, and course development, she has guided clients toward clarity with practical, non-fear-based wisdom.",
  ],
  credentials: [
    { id: "experience", label: "Experience", value: "4+ Years" },
    {
      id: "specialization",
      label: "Specialization",
      value: "Numerology & Vastu Consultation",
    },
    {
      id: "vastu-shiksha",
      label: "Vastu Expertise",
      value: "Vastu Shiksha & Space Alignment",
    },
    {
      id: "focus",
      label: "Consultation Focus",
      value: "Career, Relationships & Personal Growth",
    },
  ],
  achievements: [
    {
      id: "mentorship",
      title: "Platform Mentor",
      description: "Taught numerology and mentored students on mentor Dr. Ankit Batra's platform.",
      isPlaceholder: false,
    },
    {
      id: "vastu-shiksha",
      title: "Vastu Shiksha",
      description: "Comprehensive Vastu Shastra consultation, space harmonization, and non-demolition energy remedies.",
      isPlaceholder: false,
    },
    {
      id: "research",
      title: "4+ Years Practice",
      description: "Continuous research, practice, course development, and personalized consultations.",
      isPlaceholder: false,
    },
    {
      id: "certifications",
      title: "Formal Certification",
      description: "Formal training and certification under mentor Dr. Ankit Batra.",
      isPlaceholder: false,
    },
  ],
  quote: {
    text: "True wisdom does not predict your fate — it gives you the clarity to shape your own path with confidence and peace.",
    isPlaceholder: false,
  },
  cta: {
    label: "Book Consultation",
    href: "/book-consultation",
  },
};