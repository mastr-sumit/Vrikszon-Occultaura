"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ShoppingBag, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatProductPrice } from "@/data/products";
import LogoFixer from "./LogoFixer";
import { SearchModal } from "./SearchModal";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary navigation menu.
 * Includes Home, About, Shop, Services, Contact (Testimonials & FAQ removed per request).
 */
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Courses", href: "/courses" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

/** Scroll distance (px) after which the navbar switches to its solid/glass state. */
const SCROLL_THRESHOLD = 24;

const Navbar = () => {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { totalItems, totalPrice, openCart } = useCart();

  // Consistent initial state across server and client to prevent hydration mismatch
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBouncing, setCartBouncing] = useState(false);

  // Trigger scale-pulse bounce animation whenever cart totalItems updates
  const prevTotalRef = useRef(totalItems);
  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setCartBouncing(true);
      const timer = setTimeout(() => setCartBouncing(false), 600);
      return () => clearTimeout(timer);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  // Transparent-over-hero -> solid/glass-on-scroll (Client-only synchronization after mount)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape-to-close + scroll lock while the mobile panel is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname?.startsWith(href) ?? false;
  };

  const panelMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      {/* Top Utility Bar — Non-sticky (scrolls away naturally with page) */}
      <div className="hidden md:block bg-navy-950 border-b border-white/10 text-xs text-white/80 py-2.5 relative z-40">
        <Container size="wide" className="flex items-center justify-between">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 font-medium text-white/80 hover:text-gold-400 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            <span>Get Your Numerology Prediction Report</span>
          </Link>

          <div className="flex items-center gap-3 text-white/70">
            <button
              type="button"
              onClick={openCart}
              className="hover:text-gold-400 transition-colors font-medium cursor-pointer"
            >
              Checkout
            </button>
            <span className="text-white/30">·</span>
            <Link
              href="/privacy-policy"
              className="hover:text-gold-400 transition-colors font-medium"
            >
              Privacy Policy
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Navbar — Sticky / Fixed at top-0 */}
      <header
        suppressHydrationWarning
        className={cn(
          "sticky top-0 z-50 w-full",
          "transition-[background-color,border-color,box-shadow] duration-normal ease-out",
          scrolled
            ? "border-b border-white/10 bg-navy-900 shadow-md backdrop-blur-md"
            : "border-b border-white/10 bg-navy-950 backdrop-blur-md"
        )}
      >
        <Container
          size="wide"
          suppressHydrationWarning
          className={cn(
            "flex items-center justify-between",
            "transition-[height] duration-normal ease-out",
            scrolled ? "h-[84px]" : "h-[94px]"
          )}
        >
          <LogoFixer />
          <div className="flex w-full items-center justify-between gap-6 lg:gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="relative flex shrink-0 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
              aria-label="Vrikszon Occultaura — Home"
            >
              <Image
                src="/images/logo.png"
                alt="Vrikszon Occult Aura"
                width={420}
                height={84}
                priority
                unoptimized
                style={{ width: "auto" }}
                className="h-14 sm:h-16 md:h-[68px] lg:h-[76px] xl:h-[80px] w-auto max-w-[220px] xs:max-w-[260px] sm:max-w-none object-contain transition-all duration-300"
              />
            </Link>

            {/* Primary Nav Links */}
            <nav
              aria-label="Primary"
              className="hidden items-center justify-center gap-5 lg:gap-6 xl:gap-8 lg:flex"
            >
              <ul className="flex items-center gap-5 lg:gap-6 xl:gap-8 m-0 p-0 list-none">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.label} className="flex items-center">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative inline-flex items-center text-body font-medium text-white/80",
                          "transition-colors duration-[200ms] ease-out hover:text-white",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                          "focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 rounded-sm",
                          active && "text-white"
                        )}
                      >
                        <span>{item.label}</span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-gold-500",
                            "scale-x-0 transition-transform duration-[200ms] ease-out group-hover:scale-x-100",
                            active && "scale-x-100"
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Actions: Live Search Button, Live Cart Button & Book Consultation */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search site offerings"
                className="group relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-gold-500/30 bg-navy-800/80 text-white transition-all duration-200 hover:border-gold-500 hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer"
              >
                <Search className="h-4.5 w-4.5 text-gold-400 transition-transform group-hover:scale-110" />
              </button>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping Cart (${totalItems} items)`}
                className="group relative inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-navy-800/80 px-3.5 py-2 text-white transition-all duration-200 hover:border-gold-500 hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer"
              >
                <motion.div
                  animate={
                    cartBouncing && !shouldReduceMotion
                      ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }
                      : undefined
                  }
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center justify-center"
                >
                  <ShoppingBag className="h-5 w-5 text-gold-400 transition-transform group-hover:scale-110" />
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-950 shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </motion.div>
                <span className="text-caption font-semibold text-white/90">
                  {totalItems > 0 ? (
                    <>
                      <span className="text-gold-300">{totalItems}</span>
                      <span className="mx-1 text-white/40">·</span>
                      <span>{formatProductPrice(totalPrice)}</span>
                    </>
                  ) : (
                    "Cart"
                  )}
                </span>
              </button>

              <Button href="/book-consultation" size="md">
                Book Consultation
              </Button>
            </div>

            {/* Mobile Actions: Search Icon + Cart Icon + Hamburger */}
            <div className="flex items-center gap-2.5 sm:gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search site offerings"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-gold-500/30 bg-navy-800/80 text-white hover:bg-navy-800 transition-colors cursor-pointer"
              >
                <Search className="h-4.5 w-4.5 text-gold-400" />
              </button>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping Cart (${totalItems} items)`}
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-gold-500/30 bg-navy-800/80 text-white hover:bg-navy-800 transition-colors"
              >
                <motion.div
                  animate={
                    cartBouncing && !shouldReduceMotion
                      ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }
                      : undefined
                  }
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center justify-center"
                >
                  <ShoppingBag className="h-5 w-5 text-gold-400" />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-950">
                      {totalItems}
                    </span>
                  )}
                </motion.div>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-panel"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-white",
                  "transition-colors duration-[200ms] ease-out hover:bg-white/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-flex"
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-flex"
                    >
                      <Menu className="h-6 w-6" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </Container>

        {/* Backdrop */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 top-full z-40 h-[100dvh] bg-navy-950/40 backdrop-blur-[2px] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Slide-down mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              {...panelMotion}
              className={cn(
                "absolute inset-x-0 top-full z-50 border-b border-white/10 lg:hidden",
                "bg-navy-900/95 shadow-lg backdrop-blur-md"
              )}
            >
              <Container size="wide" className="flex flex-col gap-1 py-6">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center gap-3 rounded-[12px] px-4 py-3 text-body-lg font-medium text-gold-300 bg-white/5 border border-gold-500/20 mb-2 transition-all hover:bg-white/10"
                >
                  <Search className="h-5 w-5 text-gold-400" />
                  <span>Search Services, Courses &amp; Shop...</span>
                </button>

                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-[12px] px-4 py-3 text-body-lg font-medium text-white/90",
                        "transition-colors duration-[200ms] ease-out hover:bg-white/5 hover:text-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                        active && "bg-white/5 text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="mt-4 border-t border-white/10 pt-6">
                  <Button href="/book-consultation" size="lg" fullWidth>
                    Book Consultation
                  </Button>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Search Modal Overlay */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
    </>
  );
};

export default Navbar;