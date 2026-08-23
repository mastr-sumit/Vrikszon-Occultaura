/**
 * Data source for the site-wide Footer (src/components/layout/Footer.tsx).
 *
 * Kept separate from component code so this can be updated (or later
 * swapped for a CMS/admin source) without touching Footer.tsx, matching
 * the pattern used by src/data/services.ts, src/data/testimonials.ts, etc.
 *
 * VERIFICATION STATUS
 * -------------------
 * - `FOOTER_QUICK_LINKS` mirrors the exact route set already used by
 *   Navbar.tsx (src/components/layout/Navbar.tsx) — the site's one
 *   existing, already-approved primary navigation. No new routes are
 *   introduced here beyond what Navbar.tsx already treats as real.
 * - `FOOTER_CONTACT_INFO.location` is the one verified contact detail in
 *   the project (content.md: "Location: Salt Lake City, Kolkata").
 *   `phone` and `email` are `null` — project.md explicitly lists "Final
 *   Contact Details" under "Pending Client Information" and no phone/
 *   email is documented anywhere else in the project either (see also
 *   the identical note in src/data/openingHours.ts and
 *   BookingSection.tsx). Business hours are intentionally NOT duplicated
 *   here — Footer.tsx imports the single source of truth,
 *   src/data/openingHours.ts, directly.
 * - `FOOTER_SOCIAL_LINKS` — no verified social profile URLs exist
 *   anywhere in the project (project.md lists "Social Media Links" under
 *   "Pending Client Information"). Every `href` is `null` on purpose;
 *   Footer.tsx renders these as disabled placeholders rather than
 *   inventing a destination.
 * - `FOOTER_LEGAL_LINKS` is intentionally empty — no
 *   privacy/terms/refund route exists anywhere in the app yet (only
 *   src/app/page.tsx is built). sitemap.md lists these as future URLs,
 *   but Footer.tsx only links to routes that actually exist today.
 */

export interface FooterQuickLink {
  label: string;
  href: string;
}

/** Same primary routes as Navbar.tsx — the site's one verified nav set. */
export const FOOTER_QUICK_LINKS: FooterQuickLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export interface FooterLegalLink {
  label: string;
  href: string;
}

/** Empty on purpose — no legal-policy route exists in the app yet. */
export const FOOTER_LEGAL_LINKS: FooterLegalLink[] = [];

export interface FooterSocialLink {
  label: string;
  /** `null` = no verified profile URL yet. Render as a disabled placeholder. */
  href: string | null;
}

/** No verified social profile URLs exist yet — every href stays `null`. */
export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: "Facebook", href: null },
  { label: "Instagram", href: null },
  { label: "YouTube", href: null },
  { label: "WhatsApp", href: null },
];

export interface FooterContactInfo {
  /** Verified — content.md. */
  location: string | null;
  /** Not verified anywhere in the project — never fabricate this. */
  phone: string | null;
  /** Not verified anywhere in the project — never fabricate this. */
  email: string | null;
}

export const FOOTER_CONTACT_INFO: FooterContactInfo = {
  location: "Salt Lake City, Kolkata",
  phone: null,
  email: null,
};