/**
 * About CTA — data for src/components/about/AboutCTA.tsx
 *
 * ARCHITECTURE RULE (per this task): this file contains ONLY objects,
 * interfaces and types — no React, JSX, HTML, hooks, or motion. Button
 * hrefs are plain strings; AboutCTA.tsx maps them onto the existing
 * shared Button component itself.
 *
 * CONTENT
 * This is the About page's final conversion moment — calm and
 * inviting rather than salesy. Copy below is the task's suggested
 * placeholder; no client-supplied "final" CTA copy exists yet in the
 * project docs (see docs/content.md "Final CTA" for the equivalent
 * homepage placeholder this mirrors in tone, not wording).
 */

export interface AboutCTAButton {
  label: string;
  href: string;
}

export interface AboutCTAContent {
  eyebrow: string;
  heading: string;
  description: string;
  primaryButton: AboutCTAButton;
  secondaryButton: AboutCTAButton;
}

/**
 * PLACEHOLDER CONTENT — editable.
 * Replace `description` in place once the client confirms final
 * closing copy; no component changes are needed.
 */
export const ABOUT_CTA: AboutCTAContent = {
  eyebrow: "Begin Your Journey",
  heading: "Ready to Discover Greater Clarity?",
  description:
    "A single consultation can offer a clearer view of the path ahead — practical guidance, grounded in your own numbers and space, without predictions or promises. If you're ready to take that first step, book a session, or explore the range of consultations available.",
  primaryButton: {
    label: "Book Consultation",
    href: "/book-consultation",
  },
  secondaryButton: {
    label: "Explore Services",
    href: "/services",
  },
};