# Design Language
## Premium Numerology & Astrology Website

Version: 1.0
Status: Foundation — build no components until this is approved
Last Updated: July 2026

---

## How to use this document

This is the single source of truth for every visual decision in the codebase.
No component, page, or animation should introduce a color, font size, spacing
value, radius, shadow, or timing value that isn't defined here.

Direction from the client: **stay visually close to the reference site**
(saccredmaziics.com) — same dark-purple/indigo/gold mystical-luxury mood, same
overall page rhythm — but execute it at a noticeably higher level of polish:
tighter typography, real spacing discipline, restrained motion, and better
craft on every component. Nothing here should feel like a different website;
it should feel like the reference site redesigned by an agency that also
builds for Apple/Linear/Stripe-tier clients.

---

## 1. Typography System

### Typefaces

| Role | Font | Fallback | Usage |
|---|---|---|---|
| Display / Headings | Cormorant Garamond | Georgia, serif | H1–H6, hero headline, section headlines, pull quotes |
| Body / UI | Inter | -apple-system, sans-serif | Paragraphs, nav, buttons, forms, labels |

Two fonts only. Never introduce a third. This mirrors the reference site's
serif-hero-plus-sans-body pairing but replaces its generic serif/sans with a
premium pairing.

### Type Scale

| Token | Size | Line Height | Font | Typical use |
|---|---|---|---|---|
| `display` | 72px | 120% | Cormorant Garamond | Rare, large marketing moments |
| `hero` | 60px | 120% | Cormorant Garamond | Hero headline |
| `h1` | 48px | 120% | Cormorant Garamond | Page titles |
| `h2` | 40px | 120% | Cormorant Garamond | Section titles |
| `h3` | 32px | 120% | Cormorant Garamond | Sub-section titles |
| `h4` | 28px | 120% | Cormorant Garamond | Card/feature titles |
| `h5` | 24px | 120% | Inter (500) | Small headings, testimonial names |
| `h6` | 20px | 120% | Inter (500) | Labels acting as mini-headings |
| `body-lg` | 18px | 170% | Inter | Intro paragraphs, lead text |
| `body` | 16px | 170% | Inter | Default paragraph text |
| `small` | 14px | 170% | Inter | Meta text, captions, form hints |
| `caption` | 12px | 170% | Inter | Legal, timestamps, tags |

Mobile: scale down two steps for `display`→`h3` (e.g. hero 60px → 40px on
mobile) to avoid wrapping/overflow. Body sizes stay fixed across breakpoints.

### Weights

Available: 300, 400, 500, 600, 700.

- Body copy: 400
- Emphasis / sub-headings: 500–600
- Headings (serif): 400–500 (the serif itself carries weight; avoid 700 on
  Cormorant, it looks clumsy)
- Buttons / labels / eyebrow text: 600
- Never use 700 on more than one element per section.

### Reading Width

Max 760px for body copy blocks. Never let paragraphs stretch full-container.

---

## 2. Color Palette

### Core tokens (from brand direction)

| Token | Hex | Role |
|---|---|---|
| `navy` (primary) | `#081423` | Dark backgrounds, primary text on light, deep surfaces |
| `indigo` (secondary) | `#2A1B5E` | Gradient partner to navy, secondary dark surface |
| `gold` (accent) | `#D4AF37` | CTAs, highlights, borders, glow — the one accent color |
| `warm-white` (background) | `#FAF9F7` | Default light background |
| `white` (surface) | `#FFFFFF` | Cards, panels on light sections |
| `dark-surface` | `#10141B` | Cards/panels on dark sections |
| `border` | `#E7E7E7` | Hairlines on light surfaces |
| `text-primary` | `#1A1A1A` | Body text on light |
| `text-secondary` | `#6E6E73` | Muted/meta text on light |
| `success` | `#18A957` | Success states |
| `warning` | `#F59E0B` | Warning states |
| `error` | `#DC2626` | Error states |

### Extended scales (needed for hover/border/tint variations — Tailwind requires a full ramp, not a single hex)

**Navy**
50 `#EAEEF3` · 100 `#CBD5E1` · 200 `#9FB0C4` · 300 `#6C819F` · 400 `#3F567A`
500 `#1E3350` · 600 `#122542` · 700 `#0D1C34` · 800 `#0A1729` (base=`#081423` ≈ 900) · 900 `#081423` · 950 `#050D17`

**Indigo**
50 `#EEEAF7` · 100 `#D3C7EC` · 200 `#AE93D8` · 300 `#8767C0` · 400 `#5F44A0`
500 `#3D2A79` · 600 `#2A1B5E` (base) · 700 `#221651` · 800 `#1A1140` · 900 `#120B2E`

**Gold**
50 `#FBF6E8` · 100 `#F3E6BC` · 200 `#EAD48D` · 300 `#DFC15E` · 400 `#D9B84B`
500 `#D4AF37` (base) · 600 `#B8952A` · 700 `#957622` · 800 `#725A1A` · 900 `#4E3E12`

Never introduce a color outside these three families + neutrals + the three
semantic colors. No arbitrary hex values in components.

### Gradient rules

Only these gradients are permitted:
- `navy → indigo`, 135deg, for large dark section backgrounds
- Gold radial glow (low opacity, 10–20%) behind hero visuals / CTA sections
- Soft white overlay on top of hero imagery for text legibility

No rainbow gradients, no more than two colors in a single gradient, no harsh
stops — always smooth.

### Usage ratio

60% primary (navy/warm-white depending on section), 30% neutral, 10% gold
accent. Gold marks action and importance only — never used decoratively at
scale (no gold section backgrounds, no gold body text).

### Dark vs light sections

Alternate navy-dominant "dark luxury" sections (hero, CTA, footer, process
timeline) with warm-white "light editorial" sections (services, about,
testimonials, blog) — this matches the reference site's dark-hero/light-body
rhythm while giving each section room to breathe.

---

## 3. Spacing Scale

Strict 8px base system. No value outside this list is permitted anywhere —
no `13px`, no `22px`, no `p-[17px]`.

`4` · `8` · `16` · `24` · `32` · `40` · `48` · `56` · `64` · `80` · `96` · `120` · `160`

(4px exists only as a micro-adjustment token for icon/text optical alignment
— treat it as an escape hatch, not a default.)

Map directly to Tailwind spacing keys (see §14) so `p-10` etc. always resolve
to an approved value.

---

## 4. Border Radius System

| Token | Value | Used on |
|---|---|---|
| `radius-sm` | 8px | Badges, small chips, inline tags |
| `radius-base` | 12px | Buttons, form inputs |
| `radius-lg` | 20px | Cards |
| `radius-xl` | 24px | Images, media containers, modals |
| `radius-full` | 999px | Pills, avatar, floating WhatsApp button |

Never mix radii within the same component family — every card in the site
uses `radius-lg`, every button uses `radius-base`, no exceptions.

---

## 5. Shadow System

Soft only — no hard-edged or high-opacity shadows anywhere (this is one of
the biggest premium upgrades over the reference site, which uses flat/no
shadows).

| Token | Value | Use |
|---|---|---|
| `shadow-xs` | `0 2px 8px rgba(8,20,35,.05)` | Inputs, subtle separation |
| `shadow-sm` | `0 4px 16px rgba(8,20,35,.06)` | Resting cards |
| `shadow-md` | `0 8px 30px rgba(8,20,35,.08)` | Default elevated cards, dropdowns |
| `shadow-lg` | `0 20px 50px rgba(8,20,35,.12)` | Modals, hovered cards |
| `shadow-gold-glow` | `0 8px 24px rgba(212,175,55,.25)` | Primary button hover, focused gold elements |

Shadows always use the navy hex as the shadow color (never pure black) —
this is what makes shadows feel premium instead of generic.

---

## 6. Glassmorphism Rules

Glass is a **premium accent, used sparingly** — not a site-wide surface
style. The spiritual/calm/minimal brief means most surfaces stay opaque and
clean; glass is reserved for moments where content floats over rich
backgrounds.

**Approved glass usage:**
- Navbar, once solid-on-scroll state is active, may use glass instead of flat
  solid: `background: rgba(8,20,35,0.7)`, `backdrop-filter: blur(16px)`
- Modals over dark/image backgrounds
- Hero overlay panels (e.g. a floating stat card on top of a hero image)
- Testimonial "featured quote" panel over a gradient background

**Never use glass on:** standard content cards, service cards, blog cards,
forms, or any component that needs maximum text legibility and lives on a
plain background. If a card sits on `warm-white`, it should just be
`white` + soft shadow — glass on top of a flat color adds nothing and reads
as noise.

**Spec when glass is used:**
- Background: 8–15% white or 60–75% dark, never fully transparent
- Blur: 12–20px (`backdrop-filter: blur()`)
- Border: 1px `rgba(255,255,255,0.12)` hairline to define the edge
- Always paired with a fallback solid background for browsers/contexts where
  backdrop-filter is unsupported, and always re-checked for text contrast
  (WCAG AA still applies on glass)

---

## 7. Button Variants

All buttons: `radius-base` (12px), 600 weight Inter, transition `220ms
ease-out` (per animation timing system).

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `gold-500` fill | `navy-900` | none | Lift -3px, `shadow-gold-glow`, background → `gold-600` |
| Secondary | transparent | `navy-900` (or white on dark bg) | 1.5px solid `navy-900` (or white) | Background fills to 8% navy tint, lift -3px |
| Outline (gold) | transparent | `gold-600` | 1.5px solid `gold-500` | Fill to `gold-50` |
| Ghost | transparent | `navy-900` | none | Background → `navy-50`-equivalent (8% tint) |
| Link | transparent, no padding | `navy-900` or `gold-600` | none | Underline slides in, 200ms |
| Danger | `error` fill | white | none | Darken 10% |
| Icon Button | transparent or `dark-surface`/`white` circle | inherits | none | Scale 1.05, background tint |
| Loading | same as parent variant | — | — | Spinner replaces label, button disabled, opacity 0.7 |

Sizing: `sm` (36px height) · `md` (44px, default) · `lg` (52px, hero/final
CTA). Horizontal padding always from the 8px scale (`px-6` / `px-8`).

Active/click state on all buttons: `scale(0.98)`.

---

## 8. Card Variants

Shared base: `radius-lg` (20px), `shadow-sm` at rest → `shadow-md` on hover,
padding from {32, 40, 48} depending on card size, `250ms cubic-bezier
(0.22,1,0.36,1)` transition, hover lift `-8px` + scale `1.02`.

| Variant | Distinguishing features |
|---|---|
| Service Card | Icon top, title, 2-line description, arrow link bottom-right |
| Feature Card | Icon or small illustration, title, short benefit text — used in "Why Choose Us" |
| Blog Card | Image (16:10) top with zoom-on-hover, category badge, title, meta row (date/read time) |
| Product Card | Image, title, price, badge slot (Featured/New), CTA button pinned bottom |
| Testimonial Card | Avatar + name + location top, quote body in serif italic, star rating, optional glass treatment when placed over a gradient section |
| Package/Pricing Card | Header with plan name, large price, feature checklist, CTA; "recommended" variant gets a `gold-500` border + subtle glow and sits visually elevated (scale 1.03) relative to siblings |

Never invent a new card layout for a one-off section — extend one of the six
variants above.

---

## 9. Input Styles

Base: 48–52px height, `radius-base` (12px), 1.5px border `border` token at
rest, `warm-white` or `white` background, 16px Inter body text, generous
internal padding (16–20px horizontal).

| State | Treatment |
|---|---|
| Rest | Border `#E7E7E7`, no shadow |
| Focus | Border → `gold-500`, `shadow-xs` glow in gold at 15% opacity, label lifts (if floating label pattern used) |
| Error | Border → `error`, small shake (per animation system), red helper text below |
| Success | Border → `success`, green check icon animates in |
| Disabled | Background `#F2F2F2`, text `text-secondary`, no interaction |

Labels: always visible (floating label is optional per-form, never
placeholder-only — placeholders alone fail accessibility and the client's
"clear labels" requirement). Helper/error text sits directly below the
field, 14px, `text-secondary` or `error`.

Submit buttons inside forms always use the Primary button variant, full
width on mobile.

---

## 10. Section Spacing Rules

Vertical rhythm between sections (top+bottom padding on each section):

| Breakpoint | Padding |
|---|---|
| Desktop (1440+) | 120px top / 120px bottom |
| Laptop (1024–1439) | 96px top / 96px bottom |
| Tablet (768–1023) | 80px top / 80px bottom |
| Mobile (0–767) | 64px top / 64px bottom |

Internal section structure, top to bottom, always: small eyebrow label →
headline → supporting text (optional) → visual/content → CTA (if
applicable). Content max-width `1180px`, outer container max `1320px`.

Card/grid internal gaps: 24px (mobile) / 32px (tablet) / 40px (desktop).

Never place two sections back-to-back without at least one full spacing
step between them, and never let two consecutive sections share the same
background color + layout pattern (alternate light/dark and
image-left/image-right/cards/timeline per the UI/UX guidelines).

---

## 11. Animation Timing System

### Durations

| Token | Value | Use |
|---|---|---|
| `very-fast` | 150ms | Icon micro-interactions, active/press states |
| `fast` | 250ms | Button/card hover, input focus |
| `normal` | 400ms | Modal open, accordion, small reveals |
| `medium` | 600ms | Section reveal, image reveal |
| `slow` | 800ms | Hero content stagger, scroll reveals |
| `extra-slow` | 1200ms | Page loader sequence only |

### Easing

| Token | Curve | Use |
|---|---|---|
| `ease-out` | `cubic-bezier(0,0,0.2,1)` | Default for entrances |
| `ease-in-out` | `cubic-bezier(0.4,0,0.2,1)` | State changes, toggles |
| `luxury` | `cubic-bezier(0.22,1,0.36,1)` | Hero moments, card hover, anything that should feel "expensive" |

### Rules

- Animate only `transform` and `opacity` (GPU-accelerated). Never animate
  `width`, `height`, `top`, `left`.
- Every scroll-triggered reveal fires once per element, never re-triggers.
- Respect `prefers-reduced-motion`: disable parallax and any continuous/large
  motion, keep only opacity fades.
- Libraries: GSAP + ScrollTrigger for scroll choreography, Lenis for smooth
  scroll, Framer Motion for component-level React animation, Intersection
  Observer for simple reveals. Lottie only if a specific illustrated
  animation truly needs it.

---

## 12. Hover Interaction System

| Element | Interaction | Duration |
|---|---|---|
| Card | translateY(-8px), scale(1.02), shadow-sm → shadow-md, optional background glow | 250ms `luxury` |
| Primary/Secondary Button | translateY(-3px), shadow-gold-glow (primary) | 220ms `ease-out` |
| Icon | rotate(6deg) | 200ms `ease-out` |
| Image (gallery/blog/product) | scale(1.05) within overflow-hidden container | 250–300ms `ease-out` |
| Link / Nav item | underline slides in left→right | 200ms `ease-out` |
| Floating WhatsApp button | idle: very slow float loop; hover: scale(1.08); click: ripple | per animation.md |
| Icon Button | scale(1.05) + background tint | 200ms |

Active/pressed state across all interactive elements: `scale(0.98)`, no
exceptions — this is what makes tap feedback feel consistent site-wide.

---

## 13. Responsive Breakpoint Strategy

| Name | Range | Grid |
|---|---|---|
| Mobile | 0–767px | 4 columns |
| Tablet | 768–1023px | 8 columns |
| Laptop | 1024–1439px | 12 columns |
| Desktop | 1440–1919px | 12 columns |
| Ultra Wide | 1920px+ | 12 columns, content capped at `1320px`, extra space becomes margin |

**Approach:** mobile-first. Every component is built for the 4-column mobile
grid first, then progressively enhanced. Container behavior:

- Outer max-width: 1320px
- Content max-width: 1180px
- Reading (text-only) max-width: 760px
- Gutters: 16px (mobile) / 24px (tablet) / 32px (laptop+)

Typography and section padding scale down at each breakpoint per §1 and §10.
Sticky CTA bar on mobile only (not desktop, where nav CTA is always visible).

---

## 14. Tailwind Theme Configuration

See `tailwind.config.ts` (companion file) for the literal implementation of
everything above. It is the enforcement mechanism for this document — any
value not present in that config should not be usable in a component.

---

## Golden Rule (carried over, non-negotiable)

If a typography size, color, spacing value, radius, shadow, or animation
does not come from this document, it does not go into the codebase. Every
future prompt to build a component should reference this file, not
reinterpret the brand.