# Technical Architecture
## Premium Numerology & Astrology Website

Version: 1.0

Status: Planning

Last Updated: July 2026

---

# Project Vision

Build a production-ready website that is:

- Premium
- Fast
- SEO Optimized
- Secure
- Mobile First
- Scalable
- Maintainable

The code should be clean enough that another developer can understand it without additional explanation.

---

# Technology Stack

## Frontend

Framework:
Next.js 15

Language:
TypeScript

Styling:
Tailwind CSS

Animations:
GSAP

Smooth Scroll:
Lenis

UI Animation:
Framer Motion

Icons:
Lucide React

Forms:
React Hook Form

Validation:
Zod

Image Optimization:
Next/Image

Fonts:
next/font

---

## Backend

Runtime:
Node.js

Framework:
Next.js API Routes

Authentication:
NextAuth (Future)

Email:
Resend

Payments:
Razorpay (Future)

---

## Database

Development:
SQLite

Production:
MySQL

ORM:
Prisma

---

## CMS

Phase 1

Static Content

Phase 2

Admin Dashboard

Phase 3

Headless CMS (Optional)

---

# Folder Structure

src/

app/

components/

features/

hooks/

lib/

services/

utils/

styles/

types/

constants/

data/

public/

assets/

---

# Components Structure

components/

Navbar/

Hero/

Button/

Card/

Section/

Footer/

FAQ/

Testimonials/

Gallery/

Modal/

Loader/

Every component should be reusable.

---

# Naming Convention

Components

PascalCase

Example

HeroSection.tsx

Buttons.tsx

Files

kebab-case

Example

hero-section.tsx

Variables

camelCase

Constants

UPPER_CASE

---

# Coding Standards

Use TypeScript everywhere.

Avoid inline styles.

Avoid duplicated code.

Prefer reusable components.

Keep components small.

Separate logic from UI.

Comment only when necessary.

---

# State Management

Local State:
React Hooks

Global State:
Zustand (if required)

Server State:
TanStack Query (Future)

---

# Forms

React Hook Form

Validation with Zod

Inline errors

Accessible labels

Loading states

Success states

---

# Styling Rules

Tailwind only.

No Bootstrap.

No jQuery.

No inline CSS.

Reusable utility classes.

---

# Animations

GSAP

Lenis

Framer Motion

Intersection Observer

Only animate:

opacity

transform

scale

translate

Never animate layout properties.

---

# Performance Rules

Lazy load sections.

Dynamic imports.

Image optimization.

WebP/AVIF.

Preload important fonts.

Reduce JavaScript.

Minimize CLS.

---

# Accessibility

Semantic HTML

ARIA Labels

Keyboard Navigation

Screen Reader Support

Focus States

WCAG AA

---

# SEO

Metadata API

Dynamic Sitemap

Robots

Schema.org

Open Graph

Twitter Cards

Canonical URLs

Breadcrumb Schema

---

# Security

Environment Variables

Sanitize Inputs

Validate Forms

CSRF Protection

Rate Limiting

Secure Headers

HTTPS Only

---

# Error Handling

404

500

Loading

Empty State

Success State

Error Boundaries

Graceful Fallbacks

---

# Deployment

Hosting:
Client cPanel

Build:
Production

Environment:
.env

SSL:
Required

Compression:
Enabled

Caching:
Enabled

---

# Browser Support

Chrome

Edge

Safari

Firefox

Latest two versions

---

# Responsive Breakpoints

Mobile

0–767px

Tablet

768–1023px

Laptop

1024–1439px

Desktop

1440px+

---

# Code Quality

ESLint

Prettier

Type Checking

No Console Logs

No Dead Code

No Unused Imports

---

# Git Workflow

main

development

feature/*

fix/*

release/*

---

# Pull Request Checklist

Code Reviewed

Responsive

Accessible

SEO Checked

Performance Checked

Animations Tested

Forms Tested

No Errors

---

# Lighthouse Targets

Performance
95+

Accessibility
100

Best Practices
100

SEO
100

---

# Definition of Done

A feature is complete only if:

✓ Responsive

✓ Accessible

✓ SEO Optimized

✓ Animation Added

✓ Performance Tested

✓ Code Reviewed

✓ No Bugs

✓ Client Approved

---

# Golden Rule

Write code as if another senior developer will maintain this project for the next five years.

Prioritize readability, consistency, and performance over clever shortcuts.