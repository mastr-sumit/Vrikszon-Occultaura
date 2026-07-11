# AI Prompt Library
## Premium Numerology & Astrology Website

Version: 1.0

Purpose:
This file contains reusable prompts for Claude. Before every task, ask Claude to read `project.md`, `design-system.md`, `ui-ux-guidelines.md`, and `animations.md`. These files are the source of truth.

---

# Global Instructions (Use Before Every Prompt)

Read the following files before starting:

- docs/project.md
- docs/design-system.md
- docs/ui-ux-guidelines.md
- docs/animations.md
- docs/sitemap.md

Do not change any design decisions unless instructed.

Maintain consistency across the project.

Think like an award-winning digital agency.

Never generate generic layouts.

Explain important design decisions before writing code.

---

# Prompt 01 — Website Audit

Analyze the project documentation and explain the overall strategy.

Do not generate any code.

---

# Prompt 02 — Navigation

Design only the navigation.

Requirements:

- Desktop + Mobile
- Sticky
- Responsive
- Accessible
- Premium
- CTA Button
- Smooth transitions

Stop after the navigation.

---

# Prompt 03 — Hero Section

Design only the Hero section.

Include:

- Headline
- Supporting Text
- CTA
- Secondary CTA
- Trust Badges
- Hero Visual
- Background
- Responsive Layout
- Animation Suggestions

Do not generate any other section.

---

# Prompt 04 — Trust Section

Create only the trust section.

Include:

- Statistics
- Certifications
- Reviews
- Awards
- Social Proof

Stop after completion.

---

# Prompt 05 — Services

Create only the services section.

Include:

- Card Layout
- Icons
- Hover States
- CTA
- Responsive Layout

---

# Prompt 06 — About Section

Design only the About section.

Tell a story.

Build trust.

Do not continue further.

---

# Prompt 07 — Testimonials

Create only the testimonial section.

Video support

Google Reviews

Carousel

Animations

---

# Prompt 08 — FAQ

Design only the FAQ section.

Accessible accordion.

Smooth animation.

---

# Prompt 09 — Contact

Design only the contact section.

Include:

Form

Map

WhatsApp

Business Hours

CTA

---

# Prompt 10 — Footer

Premium footer.

Newsletter

Links

Policies

Social Icons

---

# Prompt 11 — Homepage Review

Review the homepage.

Score it from

UI

UX

Accessibility

SEO

Performance

Conversion

Suggest improvements.

---

# Prompt 12 — GSAP Motion

Add animations.

Only animations.

Don't modify layout.

Use project animation rules.

---

# Prompt 13 — Responsive Review

Audit all responsive layouts.

Desktop

Tablet

Mobile

Fix inconsistencies.

---

# Prompt 14 — Accessibility Review

Review:

Keyboard

ARIA

Contrast

Focus

Screen Reader

Semantic HTML

---

# Prompt 15 — SEO Review

Review:

Meta

Schema

Heading Structure

Image SEO

Internal Linking

Performance

---

# Prompt 16 — Performance Review

Optimize:

Images

Fonts

JavaScript

CSS

Animations

Lighthouse

Target 95+

---

# Prompt 17 — Code Review

Review entire codebase.

Remove duplication.

Improve maintainability.

Improve readability.

Improve scalability.

---

# Prompt 18 — Final QA

Review everything.

Find every bug.

Find every inconsistency.

Provide fixes.

Do not write unnecessary code.

---

# Prompt 19 — Deployment

Prepare project for production.

Checklist:

SEO

Compression

Caching

Security

Robots

Sitemap

Analytics

Environment Variables

---

# Prompt 20 — Agency Polish

Pretend this website will be submitted to Awwwards.

Suggest every possible improvement.

Focus on:

Visual Design

Motion

Typography

Whitespace

Storytelling

Micro Interactions

Accessibility

Performance

Premium Feel

Do not hold back.
