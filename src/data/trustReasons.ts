/**
 * Why Clients Trust Us — data for src/components/about/WhyClientsTrustUs.tsx
 *
 * Updated with official "Consultation Promise" list:
 * Personalized Analysis, Complete Report, Practical Remedies, Detailed Guidance,
 * Confidential Sessions, and WhatsApp Support.
 */

export type TrustReasonIconKey =
  | "user-check"
  | "lock"
  | "clipboard-check"
  | "scale"
  | "sparkles"
  | "users";

export interface TrustReason {
  id: string;
  title: string;
  description: string;
  icon: TrustReasonIconKey;
  /** Set to false to hide a reason from the grid without deleting it. */
  enabled: boolean;
}

export interface WhyClientsTrustUsContent {
  eyebrow: string;
  heading: string;
  supportingText: string;
  ctaLabel: string;
  ctaHref: string;
  reasons: TrustReason[];
}

export const WHY_CLIENTS_TRUST_US: WhyClientsTrustUsContent = {
  eyebrow: "Our Promise",
  heading: "The Vrikszon Occultaura Consultation Promise",
  supportingText:
    "Every session is held to strict standards of privacy, thorough analysis, practical support, and ongoing care.",
  ctaLabel: "Book Consultation",
  ctaHref: "/book-consultation",
  reasons: [
    {
      id: "personalized-analysis",
      title: "Personalized Analysis",
      description:
        "Comprehensive evaluation tailored to your specific numbers, environment, and personal queries.",
      icon: "user-check",
      enabled: true,
    },
    {
      id: "complete-report",
      title: "Complete Report",
      description:
        "Receive a detailed written report summarizing your key numerical patterns, Vastu findings, and recommendations.",
      icon: "clipboard-check",
      enabled: true,
    },
    {
      id: "practical-remedies",
      title: "Practical Remedies",
      description:
        "Feasible, realistic remedies focused on energy alignment without requiring disruptive lifestyle overhauls.",
      icon: "sparkles",
      enabled: true,
    },
    {
      id: "detailed-guidance",
      title: "Detailed Guidance",
      description:
        "Step-by-step counsel to clarify complex life situations in career, relationships, and personal trajectory.",
      icon: "scale",
      enabled: true,
    },
    {
      id: "confidential-sessions",
      title: "Confidential Sessions",
      description:
        "Your personal data, readings, and discussions remain strictly private and held in complete confidence.",
      icon: "lock",
      enabled: true,
    },
    {
      id: "whatsapp-support",
      title: "WhatsApp Support",
      description:
        "Follow-up assistance over WhatsApp to ensure smooth implementation of your personalized remedies.",
      icon: "users",
      enabled: true,
    },
  ],
};