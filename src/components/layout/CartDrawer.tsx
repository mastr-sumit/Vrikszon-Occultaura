"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatProductPrice } from "@/data/products";
import Button from "@/components/ui/Button";

/**
 * CartDrawer
 *
 * Slide-over cart drawer rendered via React Portal to document.body.
 * Portal ensures position: fixed is anchored to the real viewport.
 *
 * Sizing:
 * - Mobile (<640px): full-width drawer.
 * - Tablet (640–1024px): max-w-md (448px).
 * - Desktop (≥1024px): ~30 % viewport width (min 380px).
 */
const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-drawer-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex justify-end overflow-hidden"
        >
          {/* Backdrop */}
          <div
            onClick={closeCart}
            aria-hidden="true"
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative z-10 flex h-full w-full max-w-full flex-col bg-white shadow-lg text-navy-900 sm:max-w-md lg:w-[30%] lg:max-w-none lg:min-w-[380px]"
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5 bg-navy-900 text-white shrink-0 overflow-hidden">
              {/* Subtle gold glow behind header — matches page-hero atmosphere */}
              <div
                aria-hidden="true"
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.12] blur-2xl"
              />
              {/* Secondary softer glow on left for symmetry */}
              <div
                aria-hidden="true"
                className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,var(--color-gold-400)_0%,transparent_70%)] opacity-[0.07] blur-2xl"
              />

              <div className="relative flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gold-500/15 border border-gold-500/25">
                  <ShoppingBag className="h-[18px] w-[18px] text-gold-400" />
                </div>
                <h2 className="font-heading text-h5 font-medium tracking-tight">Your Cart</h2>

                {/* Item-count badge: animated entrance, hidden when 0 */}
                <AnimatePresence mode="wait">
                  {totalItems > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: -4 }}
                      transition={{ type: "spring", damping: 18, stiffness: 300 }}
                      className="rounded-full border border-gold-400/40 bg-gold-500/15 px-2.5 py-0.5 text-caption font-bold tabular-nums text-gold-300 shadow-[0_0_10px_rgba(212,175,55,0.18)]"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={closeCart}
                className="relative rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 active:scale-95"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Content Body ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* ── Empty-cart state ──────────────────────────────── */
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="flex h-full flex-col items-center justify-center px-8 text-center"
                >
                  {/* Atmospheric background glow — understated celestial feel */}
                  <div className="relative mb-8">
                    {/* Outer ambient glow ring */}
                    <div
                      aria-hidden="true"
                      className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,var(--color-gold-200)_25%,transparent_65%)] opacity-[0.06] blur-2xl"
                    />
                    {/* Inner sharper glow */}
                    <div
                      aria-hidden="true"
                      className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.10] blur-xl"
                    />

                    {/* Icon circle with gold gradient + subtle breathing animation */}
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: [1, 1.05, 1],
                              opacity: [0.9, 1, 0.9],
                            }
                      }
                      transition={
                        shouldReduceMotion
                          ? {}
                          : {
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(145deg,var(--color-gold-100)_0%,var(--color-gold-50)_60%,white_100%)] border border-gold-300/50 shadow-[0_0_24px_rgba(212,175,55,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]"
                    >
                      <ShoppingBag className="h-9 w-9 text-gold-600" strokeWidth={1.5} />
                    </motion.div>

                    {/* Celestial dot accents */}
                    <div
                      aria-hidden="true"
                      className="absolute -inset-4 opacity-[0.20]"
                      style={{
                        backgroundImage:
                          "radial-gradient(var(--color-gold-400) 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                        maskImage: "radial-gradient(circle, black 25%, transparent 65%)",
                        WebkitMaskImage: "radial-gradient(circle, black 25%, transparent 65%)",
                      }}
                    />

                    {/* Tiny floating sparkle accents */}
                    <motion.div
                      aria-hidden="true"
                      animate={
                        shouldReduceMotion
                          ? {}
                          : { opacity: [0.3, 0.7, 0.3], y: [0, -3, 0] }
                      }
                      transition={
                        shouldReduceMotion
                          ? {}
                          : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                      }
                      className="absolute -top-2 -right-1"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-gold-400/60" />
                    </motion.div>
                    <motion.div
                      aria-hidden="true"
                      animate={
                        shouldReduceMotion
                          ? {}
                          : { opacity: [0.2, 0.5, 0.2], y: [0, -2, 0] }
                      }
                      transition={
                        shouldReduceMotion
                          ? {}
                          : { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
                      }
                      className="absolute -bottom-1 -left-2"
                    >
                      <Sparkles className="h-3 w-3 text-gold-300/50" />
                    </motion.div>
                  </div>

                  <motion.h3
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="font-heading text-h4 font-medium text-navy-900"
                  >
                    Your cart is empty
                  </motion.h3>
                  <motion.p
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="mt-2 max-w-[260px] text-body-sm leading-relaxed text-text-secondary"
                  >
                    Explore our collection of sacred crystals, healing bracelets, and spiritual tools.
                  </motion.p>

                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                    className="mt-8 flex flex-col items-center gap-3"
                  >
                    <Button href="/shop" onClick={closeCart} size="md">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Explore Products
                    </Button>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="text-body-sm font-medium text-text-secondary hover:text-navy-900 transition-colors duration-200"
                    >
                      Continue Browsing
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                /* ── Cart items list ──────────────────────────────── */
                <div className="flex flex-col gap-4 p-6">
                  {items.map(({ product, quantity }, index) => {
                    const imageSrc = product.image || `/images/products/${product.slug}.jpg`;
                    return (
                      <motion.div
                        key={product.id}
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: shouldReduceMotion ? 0 : index * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex gap-4 rounded-[12px] border border-gold-500/15 bg-warm-white/60 p-4 transition-all duration-200 hover:bg-warm-white hover:border-gold-500/30 hover:shadow-xs"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-gold-50/50 border border-gold-200/40">
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <span className="text-caption font-semibold uppercase tracking-wider text-gold-600">
                              {product.category}
                            </span>
                            <h4 className="font-heading text-body font-medium text-navy-900 line-clamp-1 leading-snug">
                              {product.name}
                            </h4>
                            <p className="text-body-sm font-semibold text-navy-800 mt-0.5">
                              {formatProductPrice(product.price)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center rounded-[10px] border border-border bg-white shadow-xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="px-2.5 py-1.5 text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-l-[9px] transition-colors duration-fast active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[2rem] text-center text-body-sm font-semibold text-navy-900 tabular-nums">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="px-2.5 py-1.5 text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-r-[9px] transition-colors duration-fast active:scale-95"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="rounded-[10px] p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors duration-fast active:scale-95"
                              aria-label="Remove product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Footer Summary & Actions ────────────────────────── */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  key="cart-footer"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-border bg-warm-white px-6 py-5 shrink-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-body font-medium text-text-secondary">Subtotal</span>
                    <span className="font-heading text-h5 font-semibold text-navy-900">
                      {formatProductPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-caption text-text-secondary mb-5">
                    Taxes and shipping calculated at checkout.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button
                      href="/checkout"
                      onClick={closeCart}
                      size="lg"
                      fullWidth
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                      Proceed to Checkout
                    </Button>

                    <button
                      type="button"
                      onClick={closeCart}
                      className="py-2 text-body-sm font-medium text-text-secondary hover:text-navy-900 transition-colors duration-200 text-center"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CartDrawer;
