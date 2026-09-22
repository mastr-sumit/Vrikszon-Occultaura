"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone, Mail, MapPin, Sparkles, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatProductPrice } from "@/data/products";
import type { CartItem } from "@/context/CartContext";
import type { ShippingFormData } from "./ShippingForm";

interface OrderConfirmationProps {
  orderId: string;
  shippingDetails: ShippingFormData;
  items: CartItem[];
  totalPrice: number;
  isLoading?: boolean;
}

/**
 * OrderConfirmation
 *
 * Full-page confirmation state rendered after a user successfully submits their order.
 * Replaces the checkout form shell, confirms order details, and clearly explains
 * "what happens next?" using established contact channels.
 */
export default function OrderConfirmation({
  orderId,
  shippingDetails,
  items,
  totalPrice,
  isLoading = false,
}: OrderConfirmationProps) {
  const hasShippingDetails = Boolean(shippingDetails?.fullName?.trim());

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 py-4">
      {/* Banner / Success Badge */}
      <div className="w-full rounded-2xl border border-emerald-500/25 bg-emerald-50/60 p-8 text-center sm:p-12 shadow-xs flex flex-col items-center">
        <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 shadow-xs">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="inline-flex items-center rounded-full border border-emerald-300/60 bg-emerald-100/90 px-4 py-1.5 text-caption font-semibold tracking-wide text-emerald-800">
            Order Reference: {orderId}
          </span>
        </div>

        <h1 className="mt-4 w-full text-center font-heading text-h2 font-medium text-navy-950 md:text-h1">
          Order Received!
        </h1>

        <p className="mt-3 w-full max-w-xl mx-auto text-center text-body-lg text-navy-800 leading-relaxed font-normal">
          Thank you{hasShippingDetails ? <>, <strong className="font-semibold text-navy-950">{shippingDetails.fullName}</strong></> : ""}. Your sacred order has been confirmed and logged in our system. Our team will contact you shortly regarding delivery.
        </p>
      </div>

      {/* "What Happens Next?" Steps Card */}
      <div className="w-full rounded-2xl border border-navy-900/10 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="font-heading text-h4 font-medium text-navy-950 mb-6">
          What Happens Next?
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Step 1 */}
          <div className="flex flex-col gap-2 rounded-xl bg-navy-50/60 p-5 border border-navy-900/5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-caption font-bold text-navy-950">
              1
            </span>
            <h3 className="font-heading text-body font-semibold text-navy-950">
              Order Registered
            </h3>
            <p className="text-body-sm text-navy-800/80 leading-relaxed">
              Your order items and shipping details have been securely logged in our system.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-2 rounded-xl bg-navy-50/60 p-5 border border-navy-900/5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-caption font-bold text-navy-950">
              2
            </span>
            <h3 className="font-heading text-body font-semibold text-navy-950">
              Personal Confirmation
            </h3>
            <p className="text-body-sm text-navy-800/80 leading-relaxed">
              Our practitioner team will call/WhatsApp you{shippingDetails?.phone ? <> at <strong>{shippingDetails.phone}</strong></> : ""} to confirm energisation &amp; dispatch.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col gap-2 rounded-xl bg-navy-50/60 p-5 border border-navy-900/5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-caption font-bold text-navy-950">
              3
            </span>
            <h3 className="font-heading text-body font-semibold text-navy-950">
              Blessed &amp; Dispatched
            </h3>
            <p className="text-body-sm text-navy-800/80 leading-relaxed">
              Once confirmed, your sacred items are energised and shipped directly to {shippingDetails?.city || "your address"}.
            </p>
          </div>
        </div>

        {/* Contact Info Footer Note */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-navy-900/10 bg-warm-white p-4 text-body-sm text-navy-900/80">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-gold-600" />
            <span>Need immediate support? Call/WhatsApp: <strong>+91 90731 90525</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-gold-600" />
            <span>Email: <strong>vrikszonoccultaura9@gmail.com</strong></span>
          </div>
        </div>
      </div>

      {/* Loading Skeleton Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-xs text-navy-800 text-sm font-medium">
          <Loader2 className="h-5 w-5 animate-spin text-gold-600" />
          <span>Retrieving verified order summary from database...</span>
        </div>
      )}

      {/* Order Details & Shipping Address Recap */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
        {/* Shipping Address Recap */}
        <div className="md:col-span-5 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-xs">
          <h2 className="font-heading text-h4 font-medium text-navy-950 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gold-600" />
            Shipping Details
          </h2>

          <div className="space-y-4 text-body-sm text-navy-900/80">
            <div>
              <span className="text-caption font-semibold uppercase tracking-wider text-navy-900/50 block mb-1">
                Recipient
              </span>
              <p className="font-medium text-navy-950">{shippingDetails?.fullName || "—"}</p>
            </div>

            <div>
              <span className="text-caption font-semibold uppercase tracking-wider text-navy-900/50 block mb-1">
                Address
              </span>
              <p className="leading-relaxed">{shippingDetails?.addressLine1 || "—"}</p>
              {shippingDetails?.addressLine2 && <p className="leading-relaxed">{shippingDetails.addressLine2}</p>}
              {shippingDetails?.city && (
                <p className="leading-relaxed">{shippingDetails.city}, {shippingDetails.state} - {shippingDetails.pincode}</p>
              )}
            </div>

            <div>
              <span className="text-caption font-semibold uppercase tracking-wider text-navy-900/50 block mb-1">
                Phone
              </span>
              <p className="font-medium text-navy-950">{shippingDetails?.phone || "—"}</p>
            </div>

            <div>
              <span className="text-caption font-semibold uppercase tracking-wider text-navy-900/50 block mb-1">
                Email
              </span>
              <p className="font-medium text-navy-950">{shippingDetails?.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* Purchased Items Recap */}
        <div className="md:col-span-7 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-xs">
          <h2 className="font-heading text-h4 font-medium text-navy-950 mb-4">
            Items Ordered ({items.length})
          </h2>

          {items.length === 0 && isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center text-center text-navy-600 text-xs">
              <Loader2 className="h-6 w-6 animate-spin text-gold-600 mb-2" />
              <span>Loading purchased items...</span>
            </div>
          ) : (
            <ul className="divide-y divide-navy-900/10 max-h-72 overflow-y-auto pr-2" role="list">
              {items.map(({ product, quantity }) => {
                const imageSrc = product.image || (product.slug ? `/images/products/${product.slug}.jpg` : "/images/placeholder-product.jpg");
                const lineTotal = (product.price ?? 0) * quantity;

                return (
                  <li key={product.id || product.slug} className="flex items-center gap-4 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-navy-900/10 bg-navy-50">
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

                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-body-sm font-medium text-navy-950 truncate">
                        {product.name}
                      </h3>
                      <p className="text-caption text-navy-900/60">
                        Qty: {quantity} × {formatProductPrice(product.price)}
                      </p>
                    </div>

                    <span className="font-heading text-body-sm font-semibold text-navy-950">
                      {formatProductPrice(lineTotal)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4 border-t border-navy-900/10 pt-3 flex items-center justify-between">
            <span className="font-heading text-body font-semibold text-navy-950">
              Total Order Value
            </span>
            <span className="font-heading text-h4 font-bold text-navy-950">
              {formatProductPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button href="/shop" size="lg" leftIcon={<Sparkles className="h-4 w-4" />}>
          Explore More Products
        </Button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-navy-900/15 bg-white px-6 py-3.5 text-body-sm font-semibold text-navy-900 hover:bg-navy-50 transition-colors shadow-xs"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
