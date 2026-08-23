"use client";

import { useCallback, useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

/**
 * useSyncExternalStore requires a `subscribe` function. We only ever need
 * the *current* localStorage value at render time (matching the original
 * one-time mount check) — this component doesn't need to react to
 * dismissals from other tabs — so this is a stable no-op subscription.
 * Defined at module scope so the reference never changes across renders.
 */
const noopSubscribe = () => () => {};

function getDismissedSnapshot(storageKey: string): boolean {
  try {
    return window.localStorage.getItem(storageKey) === "true";
  } catch {
    // localStorage unavailable (private browsing, blocked storage, etc.) — treat as not dismissed.
    return false;
  }
}

// Matches the bar's original SSR/hydration default: visible until proven
// otherwise, so first-time visitors get no layout shift.
function getServerDismissedSnapshot(): boolean {
  return false;
}

export type AnnouncementBarVariant = "info" | "success" | "warning" | "offer";

/**
 * Per-variant accent tokens only — the base navy → indigo gradient (the
 * approved "large dark section background" gradient in design-language.md
 * §2) stays identical across variants so every announcement still reads as
 * the same premium surface. Variants differ only in the glow, icon color,
 * and bottom accent hairline, using the semantic colors already defined in
 * the palette (success/warning) or gold (info/offer, the system's one
 * "highlight important actions" accent).
 */
const variantStyles: Record<
  AnnouncementBarVariant,
  { glow: string; icon: string; border: string }
> = {
  info: { glow: "bg-gold-500/20", icon: "text-gold-500", border: "border-gold-500/30" },
  offer: { glow: "bg-gold-400/25", icon: "text-gold-400", border: "border-gold-400/40" },
  success: { glow: "bg-success/20", icon: "text-success", border: "border-success/30" },
  warning: { glow: "bg-warning/20", icon: "text-warning", border: "border-warning/30" },
};

/**
 * Minimal shape the shared `Container` component is expected to satisfy
 * once it's built (Phase 1 per component-inventory.md). Passing the real
 * `Container` in as a prop lets this component adopt it with a one-line
 * change at the call site, with no changes needed here.
 */
type ContainerComponent = ComponentType<{ children: ReactNode; className?: string }>;

// Fallback used until the shared Container component exists. Mirrors the
// container rules in design-language.md §10/§13 (max-width 1320px, 16/24/32px
// gutters) so swapping in the real Container later is a purely structural change.
const DefaultContainer: ContainerComponent = ({ children, className = "" }) => (
  <div className={`mx-auto max-w-[1320px] px-4 sm:px-6 ${className}`}>{children}</div>
);

export interface AnnouncementBarProps {
  /** Announcement copy. Keep it short — it must fit on a single line on mobile. */
  message: string;
  /** Optional leading icon (e.g. a lucide-react icon element). Hidden on mobile to protect the single-line rule. */
  icon?: ReactNode;
  /** Optional CTA label. Only rendered when `ctaHref` is also provided. */
  ctaLabel?: string;
  /** Destination for the optional CTA link. */
  ctaHref?: string;
  /** Whether the visitor can close the bar. Defaults to true. */
  dismissible?: boolean;
  /**
   * Key used to remember dismissal in localStorage so the bar stays closed
   * for that visitor. Defaults to a key derived from the message text —
   * pass an explicit key if you rotate messages but want a shared dismiss state.
   */
  storageKey?: string;
  /** Called after the visitor dismisses the bar. */
  onDismiss?: () => void;
  /**
   * Visual variant for different announcement types. Defaults to `"info"`,
   * which matches the original default appearance.
   */
  variant?: AnnouncementBarVariant;
  /**
   * Layout container to render content inside. Defaults to an internal
   * fallback matching the shared Container's spec — pass the real shared
   * `Container` component here once it exists.
   */
  Container?: ContainerComponent;
  className?: string;
}

/**
 * Top-of-page Announcement Bar.
 *
 * Spec source: homepage-breakdown.md (Section 01) + component-inventory.md.
 * Used for offers, webinars, consultation discounts, or business hours.
 *
 * Visual tokens (gradient, color, radius, shadow-free flat bar, type scale,
 * spacing, timing) come from design-language.md. This component assumes the
 * `navy`, `indigo`, `gold`, and `warm-white` color tokens (with their
 * numeric scales) are registered in tailwind.config.ts per design-language.md §2/§14 —
 * it will not render correctly without that config in place.
 */
export function AnnouncementBar({
  message,
  icon,
  ctaLabel,
  ctaHref,
  dismissible = true,
  storageKey,
  onDismiss,
  variant = "info",
  Container = DefaultContainer,
  className = "",
}: AnnouncementBarProps) {
  const resolvedKey = storageKey ?? `announcement-dismissed:${message}`;
  const accent = variantStyles[variant];

  // Reads the persisted dismissal state from localStorage via
  // useSyncExternalStore instead of `useEffect` + `setState`. React resolves
  // this to `getServerDismissedSnapshot` during SSR/hydration (bar stays
  // visible — no CLS for new visitors) and swaps to the real localStorage
  // value right after hydration, without ever calling setState inside an
  // effect — which is what was triggering the cascading-render warning.
  const wasPersistedAsDismissed = useSyncExternalStore(
    noopSubscribe,
    () => getDismissedSnapshot(resolvedKey),
    getServerDismissedSnapshot,
  );

  // Tracks a dismissal from the close button within this render session.
  // Kept separate from the persisted value above so the bar still hides
  // immediately even if the localStorage write itself fails (e.g. private
  // browsing) — matching the original behavior.
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  const isVisible = !wasPersistedAsDismissed && !manuallyDismissed;
  const prefersReducedMotion = useReducedMotion();

  const handleDismiss = useCallback(() => {
    setManuallyDismissed(true);
    try {
      window.localStorage.setItem(resolvedKey, "true");
    } catch {
      // Safe to ignore — dismissal just won't persist across visits.
    }
    onDismiss?.();
  }, [resolvedKey, onDismiss]);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          role="region"
          aria-label="Site announcement"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }
          }
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          className={`relative overflow-hidden border-b bg-gradient-to-br from-navy-900 to-indigo-600 ${accent.border} ${className}`}
        >
          {/* Approved gold/semantic radial glow layer (design-language.md §2 —
              "Gold radial glow, low opacity, 10-20%, behind hero visuals / CTA
              sections"). Kept as a separate absolute layer, not a third color
              in the linear gradient, so the two-color gradient rule still holds. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] blur-3xl ${accent.glow}`}
          />

          <Container className="relative flex items-center justify-center gap-2 py-2 sm:gap-3">
            {icon && (
              <span className={`hidden shrink-0 sm:inline-flex ${accent.icon}`} aria-hidden="true">
                {icon}
              </span>
            )}

            <p className="min-w-0 flex-1 truncate text-center text-[13px] font-medium text-warm-white sm:flex-none sm:text-sm">
              {message}
            </p>

            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="hidden shrink-0 text-[13px] font-semibold text-gold-500 underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-gold-500 sm:inline-block sm:text-sm"
              >
                {ctaLabel}
              </Link>
            )}

            {dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss announcement"
                className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-warm-white/80 transition-all duration-200 hover:scale-105 hover:bg-white/10 hover:text-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <X size={14} strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}