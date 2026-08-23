"use client";

import Image from "next/image";
import { Plus, Minus, Trash2, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatProductPrice } from "@/data/products";

/**
 * OrderSummary
 *
 * Transactional order summary section for the /checkout page.
 * Displays all cart items with thumbnails, quantity controls, remove buttons,
 * line totals, subtotal, and an honest note regarding shipping/tax calculation.
 *
 * Designed per ui-ux-pro-max guidelines for high-conversion transactional pages:
 * calm, trustworthy structure, clear typography, and no distracting glowing effects.
 */
export default function OrderSummary() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="order-summary-heading" className="w-full">
      <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-xs sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-900/10 pb-4">
          <h2
            id="order-summary-heading"
            className="font-heading text-h4 font-medium text-navy-950"
          >
            Order Summary
          </h2>
          <span className="rounded-full border border-navy-900/10 bg-navy-50 px-3 py-1 text-caption font-semibold text-navy-800">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Item List */}
        <ul className="divide-y divide-navy-900/5" role="list">
          {items.map(({ product, quantity }) => {
            const imageSrc = product.image || `/images/products/${product.slug}.jpg`;
            const lineTotal = (product.price ?? 0) * quantity;

            return (
              <li key={product.id} className="flex gap-4 py-4 sm:py-5">
                {/* Product Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-navy-900/10 bg-navy-50/50">
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

                {/* Product Content & Controls */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-caption font-semibold uppercase tracking-wider text-gold-600">
                          {product.category}
                        </span>
                        <h3 className="font-heading text-body font-medium text-navy-950 line-clamp-1 leading-snug">
                          {product.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="rounded-lg p-1.5 text-navy-900/40 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-0.5 text-body-sm text-navy-900/70">
                      {formatProductPrice(product.price)} each
                    </p>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity control */}
                    <div className="flex items-center rounded-lg border border-navy-900/15 bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1 text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-950 rounded-l-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center text-body-sm font-semibold tabular-nums text-navy-950">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-1 text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-950 rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="font-heading text-body-sm font-semibold text-navy-950">
                      {formatProductPrice(lineTotal)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Totals Breakdown */}
        <div className="mt-4 border-t border-navy-900/10 pt-4 space-y-3">
          <div className="flex items-center justify-between text-body-sm text-navy-900/70">
            <span>Subtotal</span>
            <span className="font-medium text-navy-950">
              {formatProductPrice(totalPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between text-body-sm text-navy-900/70">
            <span>Shipping & Taxes</span>
            <span className="text-caption italic text-navy-900/50">
              Calculated at next step
            </span>
          </div>

          <div className="border-t border-navy-900/10 pt-3 flex items-baseline justify-between">
            <div>
              <span className="font-heading text-h5 font-semibold text-navy-950">
                Grand Total
              </span>
              <p className="text-caption text-navy-900/50">
                (Subtotal before shipping)
              </p>
            </div>
            <span className="font-heading text-h4 font-bold text-navy-950">
              {formatProductPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Trust Badges / Guarantees */}
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-navy-900/5 bg-navy-50/50 p-3 text-caption text-navy-900/70">
          <ShieldCheck className="h-4 w-4 shrink-0 text-gold-600" />
          <span>Authentic & energised spiritual products. Guaranteed quality.</span>
        </div>
      </div>
    </section>
  );
}
