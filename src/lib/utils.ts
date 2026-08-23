import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom Tailwind Merge configured with project design tokens.
 *
 * Prevents Tailwind Merge from falsely classifying custom typography tokens
 * (such as `text-body`, `text-small`, `text-h1`, etc.) as text color utilities
 * and dropping the actual text color classes (like `text-gold-600` or `text-navy-900`).
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-hero",
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-h5",
        "text-h6",
        "text-body-lg",
        "text-body",
        "text-small",
        "text-caption",
      ],
      "font-family": [
        "font-display",
        "font-heading",
        "font-serif",
        "font-body",
        "font-sans",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}