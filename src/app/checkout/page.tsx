"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useCart, type CartItem } from "@/context/CartContext";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingForm, { type ShippingFormData, type ShippingFormErrors } from "@/components/checkout/ShippingForm";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";

const INITIAL_SHIPPING_DATA: ShippingFormData = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

/**
 * Checkout Page
 *
 * Transactional checkout experience. Unlike marketing pages, this page keeps
 * visuals minimal, clean, and zero-distraction to reduce friction and anxiety
 * near conversion points per ui-ux-pro-max guidelines.
 *
 * Layout Strategy:
 * - Simple transactional header with breadcrumbs (Home > Shop > Checkout) and plain 'Checkout' heading.
 * - Empty-cart guard: if cart is empty and no order submitted, renders empty state with link to /shop.
 * - Active checkout layout: two-column grid on desktop (ShippingForm & PaymentSection on left, sticky OrderSummary on right).
 *   On mobile, OrderSummary renders FIRST (above forms) so users have immediate visibility of items and totals
 *   before entering delivery information.
 * - Post-submission state: renders OrderConfirmation and clears the active cart.
 */
export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const [shippingData, setShippingData] = useState<ShippingFormData>(INITIAL_SHIPPING_DATA);
  const [errors, setErrors] = useState<ShippingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    shippingDetails: ShippingFormData;
    items: CartItem[];
    totalPrice: number;
  } | null>(null);

  const handleFieldChange = (field: keyof ShippingFormData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ShippingFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ShippingFormErrors = {};

    if (!shippingData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!shippingData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const cleanPhone = shippingData.phone.replace(/\D/g, "");
    if (!shippingData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!shippingData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }

    if (!shippingData.city.trim()) {
      newErrors.city = "City / Town is required";
    }

    if (!shippingData.state.trim()) {
      newErrors.state = "State is required";
    }

    const cleanPincode = shippingData.pincode.replace(/\D/g, "");
    if (!shippingData.pincode.trim()) {
      newErrors.pincode = "Pincode / Postal Code is required";
    } else if (cleanPincode.length !== 6) {
      newErrors.pincode = "Please enter a valid 6-digit Pincode";
    }

    setErrors(newErrors);

    const firstErrorKey = Object.keys(newErrors)[0] as keyof ShippingFormErrors | undefined;
    if (firstErrorKey) {
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }

    return true;
  };

  /**
   * Real Order Placement
   * Sends validated shipping details & cart items to /api/orders for DB persistence.
   */
  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      fullName: shippingData.fullName,
      email: shippingData.email,
      phone: shippingData.phone,
      addressLine1: shippingData.addressLine1,
      addressLine2: shippingData.addressLine2 || undefined,
      city: shippingData.city,
      state: shippingData.state,
      pincode: shippingData.pincode,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    const snapshotItems = [...items];
    const snapshotShipping = { ...shippingData };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmittedOrder({
        orderId: data.orderNumber,
        shippingDetails: snapshotShipping,
        items: snapshotItems,
        totalPrice: data.totalPrice ?? totalPrice,
      });

      clearCart();
      setIsSubmitting(false);
      setIsSubmitted(true);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Order submission network error:", err);
      setSubmitError("Network connection error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-warm-white py-12 md:py-16 lg:py-20">
      <Container size="wide">
        {/* Simple Transactional Page Header */}
        <div className="flex flex-col gap-4 border-b border-navy-900/10 pb-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-small text-navy-900/60">
              <li>
                <Link
                  href="/"
                  className="rounded-sm transition-colors duration-200 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-navy-900/40" strokeWidth={1.75} />
              </li>
              <li>
                <Link
                  href="/shop"
                  className="rounded-sm transition-colors duration-200 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-navy-900/40" strokeWidth={1.75} />
              </li>
              <li aria-current="page" className="font-medium text-navy-950">
                Checkout
              </li>
            </ol>
          </nav>

          <h1 className="font-heading text-h2 font-medium text-navy-950 md:text-h1">
            Checkout
          </h1>
        </div>

        {/* View Switching logic */}
        {isSubmitted && submittedOrder ? (
          /* Order Confirmation View */
          <div className="mt-8">
            <OrderConfirmation
              orderId={submittedOrder.orderId}
              shippingDetails={submittedOrder.shippingDetails}
              items={submittedOrder.items}
              totalPrice={submittedOrder.totalPrice}
            />
          </div>
        ) : items.length === 0 ? (
          /* Empty-Cart Guard */
          <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-navy-900/10 bg-white p-8 py-16 text-center shadow-xs sm:p-12">
            <div className="relative mb-6">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.12] blur-xl"
              />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold-300/50 bg-[linear-gradient(145deg,var(--color-gold-100)_0%,var(--color-gold-50)_60%,white_100%)] shadow-xs">
                <ShoppingBag className="h-9 w-9 text-gold-600" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="font-heading text-h3 font-medium text-navy-950">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-[360px] text-body text-navy-700">
              Explore our collection of sacred crystals, healing bracelets, and spiritual tools before proceeding to checkout.
            </p>

            <div className="mt-8">
              <Button href="/shop" size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                Explore Products
              </Button>
            </div>
          </div>
        ) : (
          /* Active Checkout Flow */
          <form onSubmit={handlePlaceOrder} className="mt-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
              {/* Left Column: Shipping & Payment Sections */}
              <div className="order-2 lg:order-1 lg:col-span-7 space-y-8">
                <ShippingForm
                  formData={shippingData}
                  errors={errors}
                  onChange={handleFieldChange}
                />
                <PaymentSection isSubmitting={isSubmitting} submitError={submitError} />
              </div>

              {/* Right Column: Order Summary (Sticky on Desktop) */}
              <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24">
                <OrderSummary />
              </div>
            </div>
          </form>
        )}
      </Container>
    </main>
  );
}
