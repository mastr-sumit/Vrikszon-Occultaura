"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Users,
  Camera,
  Video,
  Briefcase,
  MessageCircle,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { CONTACT_ITEMS } from "@/data/contactDetails";

/** Same primary routes as Navbar.tsx (sitemap.md's primary navigation). */
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Courses", href: "/courses" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

/**
 * Service links. All service links point to the main /services listing page
 * since individual sub-routes do not exist under src/app/services.
 * Book Consultation links to the real /book-consultation page.
 */
const FOOTER_SERVICES = [
  { label: "Numerology Consultation", href: "/services" },
  { label: "Vastu Consultation", href: "/services" },
  { label: "Business Guidance", href: "/services" },
  { label: "Mobile Numerology", href: "/services" },
  { label: "Book Consultation", href: "/book-consultation" },
];

/**
 * Social links.
 */
const SOCIAL_LINKS = [
  { icon: Users, label: "Facebook", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
  { icon: Briefcase, label: "LinkedIn", href: "#" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/919073190525" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/privacy-policy" },
];

/** Shared underline-reveal link style — group + sliding gold underline, per design-language.md §12. */
const footerLinkClasses = cn(
  "group relative inline-flex w-fit items-center text-body text-white/70",
  "transition-colors duration-[200ms] ease-out hover:text-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 rounded-sm"
);

const footerLinkUnderline = (
  <span
    aria-hidden="true"
    className={cn(
      "pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold-500",
      "scale-x-0 transition-transform duration-[200ms] ease-out group-hover:scale-x-100"
    )}
  />
);

/**
 * Footer
 *
 * Site-wide footer, per docs/homepage-breakdown.md, design-language.md
 * and sitemap.md's "Footer Structure". Dark "luxury" section — same
 * navy → indigo gradient family used in Hero.tsx, kept to a single
 * faint glow layer (no texture, no vignette) since this is a
 * dense, functional, text-heavy section that needs maximum legibility
 * rather than a hero-level atmosphere.
 *
 * Layout: 4 columns (logo/brand/social, quick links, services, contact)
 * on desktop, 2 on tablet, 1 (centered) on mobile, followed by a
 * hairline-divided bottom bar (copyright, legal links, credit line).
 *
 * Animation: the whole footer fades up once on scroll into view, with
 * each column (and the bottom bar) staggered via Framer Motion's
 * `staggerChildren` — opacity + Y only, respecting reduced motion.
 */
const Footer = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 },
    },
  };

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0, 0, 0.2, 1] },
        },
      };

  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      {/* Background atmosphere — purely decorative, same navy/indigo/gold
          family as Hero.tsx, but a single subtle layer only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-900)_0%,var(--color-navy-800)_45%,var(--color-indigo-900)_100%)]" />
        <div className="absolute -top-24 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.08] blur-3xl" />
      </div>

      <div className="relative z-10 py-16 md:py-20 lg:py-24 xl:py-30">
        <Container size="wide">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col gap-16"
          >
            <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-2 md:gap-10 md:text-left lg:grid-cols-4 lg:gap-8">
              {/* Column 1 — logo, brand line, social */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-6 md:items-start"
              >
                <Link
                  href="/"
                  className={cn(
                    "relative inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                  )}
                  aria-label="Vrikszon Occultaura — Home"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Vrikszon Occult Aura"
                    width={420}
                    height={84}
                    unoptimized
                    className="h-16 sm:h-20 md:h-24 lg:h-[96px] w-auto max-w-[280px] sm:max-w-none object-contain"
                  />
                </Link>

                <p className="max-w-[320px] text-body text-white/70">
                  Personalized Numerology and Vastu guidance to help you move
                  through life with clarity, confidence and harmony.
                </p>

                <ul className="flex items-center justify-center gap-4 md:justify-start">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        aria-label={label}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70",
                          "transition-[transform,color,background-color] duration-[200ms] ease-out",
                          "hover:border-white/10 hover:bg-white/5 hover:text-gold-500",
                          "motion-safe:hover:-translate-y-1",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                          "focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Column 2 — Quick Links */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-6 md:items-start"
              >
                <h3 className="font-sans text-h6 font-medium text-white">
                  Quick Links
                </h3>
                <nav aria-label="Footer quick links">
                  <ul className="flex flex-col items-center gap-4 md:items-start">
                    {QUICK_LINKS.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className={footerLinkClasses}>
                          {item.label}
                          {footerLinkUnderline}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>

              {/* Column 3 — Services */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-6 md:items-start"
              >
                <h3 className="font-sans text-h6 font-medium text-white">
                  Services
                </h3>
                <nav aria-label="Footer services">
                  <ul className="flex flex-col items-center gap-4 md:items-start">
                    {FOOTER_SERVICES.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className={footerLinkClasses}>
                          {item.label}
                          {footerLinkUnderline}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>

              {/* Column 4 — Contact */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-6 md:items-start"
              >
                <h3 className="font-sans text-h6 font-medium text-white">
                  Contact
                </h3>
                <ul className="flex flex-col items-center gap-4 md:items-start">
                  {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                    <li
                      key={label}
                      className="flex items-start justify-center gap-3 md:justify-start"
                    >
                      <Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-gold-500"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      {href ? (
                        <Link href={href} className={footerLinkClasses}>
                          {value}
                          {footerLinkUnderline}
                        </Link>
                      ) : (
                        <span className="text-body text-white/70">{value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Bottom bar — thin divider, copyright, admin link, legal links, credit line */}
            <motion.div
              variants={itemVariants}
              className={cn(
                "flex flex-col items-center gap-6 border-t border-white/10 pt-8",
                "md:flex-row md:flex-wrap md:items-center md:justify-between"
              )}
            >
              <div className="flex flex-wrap items-center justify-center gap-3 text-center md:text-left">
                <p className="text-small text-white/60">
                  © 2026 Vrikszon Occultaura. All rights reserved.
                </p>
                <span className="hidden sm:inline text-white/20" aria-hidden="true">·</span>
                <Link
                  href="/admin/login"
                  className="text-caption text-white/35 hover:text-white/70 transition-colors"
                >
                  Admin Login
                </Link>
              </div>

              <ul className="flex flex-wrap items-center justify-center gap-6">
                {LEGAL_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(footerLinkClasses, "text-small")}
                    >
                      {item.label}
                      {footerLinkUnderline}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="text-small text-white/60">
                Designed with <span aria-hidden="true">❤️</span> in India
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;