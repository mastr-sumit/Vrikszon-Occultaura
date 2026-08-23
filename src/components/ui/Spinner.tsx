import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SpinnerSize = "sm" | "md" | "lg";

const sizeClassMap: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  className?: string;
}

/**
 * Spinner
 *
 * Minimal loading indicator. Uses `currentColor` for its border so it
 * inherits color from its parent (no hardcoded colors) — pass a text color
 * utility on the parent or via `className` to theme it.
 *
 * Accessibility:
 * - `role="status"` announces the loading state to assistive tech.
 * - Includes visually-hidden text so screen reader users get a label.
 * - `motion-reduce:animate-none` respects prefers-reduced-motion; the
 *   spinner still communicates "loading" via its role/label when motion
 *   is disabled, it just won't visually rotate.
 */
const Spinner = ({ size = "md", className, ...rest }: SpinnerProps) => {
  return (
    <span
      role="status"
      className={cn("inline-flex items-center justify-center", className)}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block animate-spin motion-reduce:animate-none rounded-full border-current border-t-transparent",
          sizeClassMap[size]
        )}
      />
      <span className="sr-only">Loading...</span>
    </span>
  );
};

export default Spinner;