import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "premium";
export type BadgeSize = "sm" | "md";

const variantClassMap: Record<BadgeVariant, string> = {
  default: "bg-navy-50 text-navy-700 border border-navy-100",
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  danger: "bg-error/10 text-error border border-error/20",
  premium: "bg-gold-50 text-gold-700 border border-gold-200",
};

const sizeClassMap: Record<BadgeSize, string> = {
  sm: "text-caption px-2 py-0.5 gap-1",
  md: "text-small px-2.5 py-1 gap-1.5",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Optional leading icon. Decorative by default (aria-hidden). */
  icon?: ReactNode;
}

/**
 * Badge
 *
 * Compact status/label element — e.g. "Featured", "New", "Recommended".
 * Uses `radius-sm` (8px) per the design system's badge/chip/tag token;
 * intentionally not a pill unless a future variant explicitly calls for it.
 */
const Badge = ({
  children,
  className,
  variant = "default",
  size = "md",
  icon,
  ...rest
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[8px] font-semibold leading-none whitespace-nowrap",
        variantClassMap[variant],
        sizeClassMap[size],
        className
      )}
      {...rest}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
};

export default Badge;