import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Optional centered label, e.g. "or". Only supported for horizontal dividers. */
  label?: string;
}

/**
 * Decorative separator using the `border` token. Purely presentational —
 * rendered with role="separator" and aria-hidden when unlabeled.
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", label, className, ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn("w-px self-stretch bg-border", className)}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-md", className)}
          {...props}
        >
          <span role="separator" className="h-px flex-1 bg-border" />
          <span className="text-small text-text-secondary">{label}</span>
          <span role="separator" className="h-px flex-1 bg-border" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn("h-px w-full bg-border", className)}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
