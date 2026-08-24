import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLinkProps = CommonProps &
  Omit<LinkProps, keyof CommonProps> &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | keyof LinkProps
  > & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/** Shared across every variant, per the design system's button rules. */
const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold " +
  "transition-all duration-[220ms] ease-out select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-500 text-navy-900 border-[1.5px] border-gold-600 hover:bg-gold-600 hover:border-gold-700 hover:-translate-y-[3px] hover:shadow-gold-glow",
  secondary:
    "bg-transparent text-navy-900 border-[1.5px] border-gold-500 hover:bg-gold-500/10 hover:border-gold-600 hover:-translate-y-[3px]",
  outline:
    "bg-transparent text-gold-700 dark:text-gold-400 border-[1.5px] border-gold-500 hover:bg-gold-500/10 hover:text-gold-800 dark:hover:text-gold-300 hover:border-gold-600 hover:-translate-y-[3px]",
  ghost: "bg-transparent text-navy-900 hover:bg-navy-900/[0.08]",
  link: "bg-transparent text-navy-900 underline-offset-4 hover:underline p-0 h-auto rounded-none",
  danger: "bg-error text-white border-[1.5px] border-error/80 hover:brightness-90",
};

/** Height + horizontal padding, from the 8px spacing scale. */
const sizeClassMap: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-6 text-body",
  lg: "h-[52px] px-8 text-body-lg",
  icon: "h-11 w-11 rounded-full p-0",
};

const spinnerSizeForButton: Record<ButtonSize, "sm" | "md"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
  icon: "sm",
};

/**
 * Button
 *
 * Renders a native `<button>`, or a Next.js `<Link>` when `href` is
 * provided — same visual API either way.
 *
 * Notes:
 * - `size="icon"` renders a circular icon-only button per the design
 *   system's Icon Button spec. Consumers must supply an accessible name
 *   (e.g. `aria-label`) since no visible text label is rendered.
 * - `variant="link"` ignores size-based height/padding to behave like
 *   inline text.
 */
const Button = (props: ButtonProps) => {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    children,
    href,
    ...rest
  } = props;

  const isLinkVariant = variant === "link";
  const isDisabled = Boolean(
    (rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled || loading
  );

  const classes = cn(
    baseClasses,
    variantClassMap[variant],
    isLinkVariant ? undefined : sizeClassMap[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {loading ? (
        <Spinner size={spinnerSizeForButton[size]} className="shrink-0" />
      ) : (
        leftIcon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {leftIcon}
          </span>
        )
      )}
      {size !== "icon" && children}
      {size === "icon" && !loading && !leftIcon && children}
      {!loading && rightIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {rightIcon}
        </span>
      )}
    </>
  );

  if (href) {
const {
  onClick,
  ...linkRest
} = rest as AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<LinkProps, "href">;

   const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
  if (isDisabled) {
    event.preventDefault();
    return;
  }

  onClick?.(event);
};
    return (
      <Link
  href={href}
  className={classes}
  aria-busy={loading || undefined}
  aria-disabled={isDisabled || undefined}
  tabIndex={isDisabled ? -1 : undefined}
  {...linkRest}
  onClick={handleClick}
>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps
  >;

  return (
    <button
      type={buttonRest.type ?? "button"}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
};

export default Button;