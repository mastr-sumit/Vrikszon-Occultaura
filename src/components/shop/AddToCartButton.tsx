"use client";

import { useState } from "react";
import { ShoppingBag, Check, Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export const AddToCartButton = ({ product, className }: AddToCartButtonProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, openCart } = useCart();
  const [buttonState, setButtonState] = useState<"idle" | "added" | "split">("idle");
  const [justAddedMore, setJustAddedMore] = useState(false);

  const handleInitialAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setButtonState("added");

    setTimeout(() => {
      setButtonState("split");
    }, 600);
  };

  const handleAddMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setJustAddedMore(true);

    setTimeout(() => {
      setJustAddedMore(false);
    }, 500);
  };

  const handleViewCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCart();
  };

  const animationProps = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className={cn("w-full min-h-[44px] relative", className)}>
      <AnimatePresence mode="wait">
        {buttonState === "idle" && (
          <motion.div key="idle" {...animationProps} className="w-full">
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<ShoppingBag className="h-4 w-4" />}
              onClick={handleInitialAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </Button>
          </motion.div>
        )}

        {buttonState === "added" && (
          <motion.div key="added" {...animationProps} className="w-full">
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              disabled
              className="border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              leftIcon={<Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />}
            >
              Added ✓
            </Button>
          </motion.div>
        )}

        {buttonState === "split" && (
          <motion.div
            key="split"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 w-full"
          >
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleAddMore}
              className={cn(
                "flex-1 px-2.5 py-2 text-xs font-semibold rounded-lg border-gold-500/40 text-navy-950 bg-white hover:bg-gold-50 hover:border-gold-500 transition-all duration-200",
                justAddedMore && "border-emerald-500 bg-emerald-50 text-emerald-700"
              )}
              aria-label={`Add another ${product.name} to cart`}
            >
              {justAddedMore ? (
                <span className="flex items-center justify-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  +1
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <Plus className="h-3.5 w-3.5 text-gold-600" />
                  Add More
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleViewCart}
              className="flex-1 px-2.5 py-2 text-xs font-semibold rounded-lg bg-navy-900 text-white hover:bg-navy-800 shadow-sm transition-all duration-200"
              rightIcon={<ArrowRight className="h-3.5 w-3.5 text-gold-400" />}
              aria-label="View shopping cart"
            >
              View Cart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
