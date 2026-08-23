"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Gem,
  Sparkles,
  BookOpen,
  Triangle,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatProductPrice, type Product, type ProductIcon } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

/* ------------------------------------------------------------------ */
/*  Category-aware icon mapping                                        */
/*  Fix #3: Icons are purposeful, not decorative — each category gets  */
/*  a semantically relevant icon rather than a generic fallback.       */
/* ------------------------------------------------------------------ */
const PRODUCT_ICONS: Record<ProductIcon, LucideIcon> = {
  gem: Gem,
  sparkles: Sparkles,
  book: BookOpen,
  triangle: Triangle,
};

/** Human-readable label for the icon, used in the image-error fallback. */
const ICON_LABELS: Record<ProductIcon, string> = {
  gem: "Crystal",
  sparkles: "Spiritual",
  book: "Guide",
  triangle: "Vastu",
};

interface ShopCardProps {
  product: Product;
  variants: Variants;
}

export const ShopCard = ({ product, variants }: ShopCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const Icon = PRODUCT_ICONS[product.icon] || Sparkles;
  const iconLabel = ICON_LABELS[product.icon] || "Product";
  const imageSrc = product.image || `/images/products/${product.slug}.jpg`;

  return (
    <motion.div variants={variants} className="h-full">
      {/*
       * Fix #1: The card is no longer a single <Link> wrapping a <Button>.
       * Instead, the card container is a non-interactive <div>, with:
       *   - The image + name area as a <Link> (navigates to product)
       *   - The "Add to Cart" button as a separate sibling (no nesting)
       */}
      <div
        className={cn(
          "group/card flex h-full flex-col overflow-hidden rounded-lg",
          "border border-gold-500/30 bg-white text-text-primary",
          /* Fix #4: Stable hover — shadow & border intensification only,
             no translate-y that shifts layout bounds */
          "transition-[box-shadow,border-color] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:shadow-lg hover:border-gold-500/50"
        )}
      >
        {/* ── Clickable area: image + product info (navigates to product) ── */}
        <Link
          href={product.href}
          className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset"
          aria-label={`View details for ${product.name}`}
        >
          {/* Image container */}
          <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-gold-50)_0%,var(--color-warm-white)_100%)]">
            {!imageError ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => setImageError(true)}
              />
            ) : (
              /* Fix #2 & #3: Image error fallback explains the situation with
                 a category-appropriate icon + product name + label. */
              <div className="flex flex-col items-center gap-3 px-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50">
                  <Icon
                    className="h-7 w-7 text-gold-600"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-small font-medium text-navy-900 line-clamp-2">
                  {product.name}
                </span>
                <span className="text-caption text-text-tertiary">
                  Image unavailable
                </span>
              </div>
            )}

            {product.featured && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-navy-900 px-3 py-1 text-caption font-semibold uppercase tracking-[0.08em] text-white">
                Featured
              </span>
            )}
            {product.variantsNote && (
              <span className="absolute right-4 top-4 z-10 rounded-full border border-gold-400/40 bg-navy-950/90 px-2.5 py-1 text-[11px] font-semibold text-gold-300 backdrop-blur-xs shadow-sm">
                Full Range
              </span>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-1 flex-col gap-3 p-6 pb-3">
            {product.subtitle && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
                {product.subtitle}
              </span>
            )}
            <h3 className="font-heading text-h5 font-semibold text-navy-900 transition-colors group-hover/card:text-gold-600 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-small text-text-secondary line-clamp-2">
              {product.shortDescription}
            </p>

            {product.benefits && product.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md border border-gold-500/20 bg-gold-50/60 px-2 py-0.5 text-[11px] font-medium text-navy-900"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    {benefit}
                  </span>
                ))}
              </div>
            )}

            {product.variantsNote && (
              <div className="inline-flex items-center gap-1.5 self-start rounded-md border border-gold-500/30 bg-gold-50/90 px-2.5 py-1 text-[11px] font-medium text-gold-950">
                <Sparkles className="h-3 w-3 shrink-0 text-gold-600" aria-hidden="true" />
                <span className="line-clamp-1">{product.variantsNote}</span>
              </div>
            )}

            <p className="font-heading text-body-lg font-medium text-gold-700">
              {formatProductPrice(product.price)}
            </p>

            {/* Fix #7: Clear "learn more" affordance — visual cue that clicking
                the card area navigates to product details */}
            <span className="mt-auto inline-flex items-center gap-1.5 text-caption font-medium text-gold-600 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
              View Details
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        </Link>

        {/* ── Non-link action area: trust indicator + Add to Cart ── */}
        <div className="flex flex-col gap-3 border-t border-gold-500/10 px-6 py-4">
          {/* Fix #6: Trust indicator — authentic to the brand. All products are
              energised/blessed by the practitioner, so this is truthful, not fabricated. */}
          <div className="flex items-center gap-1.5">
            <ShieldCheck
              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-caption font-medium text-emerald-700">
              Energised &amp; Blessed
            </span>
          </div>

          {/* Fix #1 continued: Button is a sibling of the Link, not nested. */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </motion.div>
  );
};
