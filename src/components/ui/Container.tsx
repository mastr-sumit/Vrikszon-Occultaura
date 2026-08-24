import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Container size variants, mapped to the widths defined in the design system:
 * - narrow  -> reading width (760px)   e.g. blog posts, long-form copy
 * - default -> content width (1180px)  e.g. standard section content
 * - wide    -> outer width (1320px)    e.g. full section wrappers
 * - full    -> no max-width, spans 100% of the parent
 */
export type ContainerSize = "default" | "wide" | "narrow" | "full";

const sizeClassMap: Record<ContainerSize, string> = {
  narrow: "max-w-reading",
  default: "max-w-[1180px]",
  wide: "max-w-[1320px]",
  full: "max-w-none",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  size?: ContainerSize;
  /**
   * Optional element/component to render as. Defaults to "div".
   * Useful for semantic wrapping (e.g. "section", "main", "article")
   * without needing a separate component.
   */
  as?: ElementType;
}

/**
 * Container
 *
 * The single source of truth for horizontal page width and gutter spacing.
 * Every page section should be wrapped in this component rather than
 * reimplementing max-width/padding logic locally.
 *
 * Gutters follow the design system's responsive rule:
 * 16px (mobile) / 24px (tablet) / 32px (laptop+) — all values from the
 * approved 8px spacing scale.
 */
const Container = ({
  children,
  className = "",
  size = "default",
  as: Component = "div",
  ...rest
}: ContainerProps) => {
  const widthClass = sizeClassMap[size];

  const classes = [
    "w-full",
    "mx-auto",
    "px-4",
    "md:px-6",
    "lg:px-8",
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default Container;