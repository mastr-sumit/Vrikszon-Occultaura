"use client";

import { useState, useEffect, useRef } from "react";
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

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingOrderNumber, setPendingOrderNumber] = useState<string | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  const hasProcessedRedirectRef = useRef(false);
  const isConfirmedSuccessRef = useRef(false);

  // Manual status check handler
  const handleCheckStatusNow = async () => {
    if (!pendingOrderId || isConfirmedSuccessRef.current) return;
    setIsVerifying(true);
    setVerificationMessage("Checking real-time payment status with bank and Razorpay...");

    const { checkPaymentStatusOnce } = await import("@/lib/razorpay-client");
    const check = await checkPaymentStatusOnce(pendingOrderId);

    if (isConfirmedSuccessRef.current) return;

    if (check.isPaid) {
      isConfirmedSuccessRef.current = true;
      setSubmittedOrder({
        orderId: pendingOrderNumber || pendingOrderId,
        shippingDetails: shippingData,
        items: [...items],
        totalPrice: totalPrice,
      });
      clearCart();
      setIsSubmitting(false);
      setIsVerifying(false);
      setSubmitError(null);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!isConfirmedSuccessRef.current) {
      setIsVerifying(false);
      setSubmitError(
        `We haven't received confirmation from your bank yet for Order #${pendingOrderNumber || pendingOrderId}. If money was deducted, our automated system will confirm your order shortly.`
      );
    }
  };

  // Handle Netbanking / Gateway direct redirect return (Guarded to run EXACTLY once)
  useEffect(() => {
    if (typeof window === "undefined" || hasProcessedRedirectRef.current) return;

    const url = new URL(window.location.href);
    const statusParam = url.searchParams.get("status");
    const orderIdParam = url.searchParams.get("orderId");
    const errorParam = url.searchParams.get("error");

    if (statusParam === "success" && orderIdParam) {
      hasProcessedRedirectRef.current = true;
      isConfirmedSuccessRef.current = true;
      setSubmitError(null);
      setIsVerifying(false);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setIsLoadingOrder(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Immediate baseline order state
      setSubmittedOrder({
        orderId: orderIdParam,
        shippingDetails: INITIAL_SHIPPING_DATA,
        items: [],
        totalPrice: 0,
      });

      // Fetch verified order items and shipping details from backend
      async function fetchFullOrderDetails() {
        try {
          const res = await fetch(`/api/orders/details?orderNumber=${encodeURIComponent(orderIdParam!)}`, {
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.order) {
              setSubmittedOrder({
                orderId: data.order.orderNumber,
                shippingDetails: {
                  fullName: data.order.fullName,
                  email: data.order.email,
                  phone: data.order.phone,
                  addressLine1: data.order.addressLine1,
                  addressLine2: data.order.addressLine2 || "",
                  city: data.order.city,
                  state: data.order.state,
                  pincode: data.order.pincode,
                },
                items: data.order.items,
                totalPrice: data.order.totalPrice,
              });
              setIsLoadingOrder(false);
              return;
            }
          }
        } catch (fetchErr) {
          console.error("Failed to fetch full order details:", fetchErr);
        }
        setIsLoadingOrder(false);
      }

      fetchFullOrderDetails();
    } else if (statusParam === "failed" && errorParam) {
      if (!isConfirmedSuccessRef.current) {
        hasProcessedRedirectRef.current = true;
        setSubmitError(decodeURIComponent(errorParam));
      }
    }
  }, []);

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
   * Razorpay Checkout Flow
   * 1. Calls /api/payments/create-order with items & shipping details.
   * 2. Opens Razorpay Hosted Checkout popup.
   * 3. On payment success, calls /api/payments/verify.
   * 4. Clears cart and renders OrderConfirmation.
   */
  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      type: "SHOP_ORDER",
      shippingData,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    const snapshotItems = [...items];
    const snapshotShipping = { ...shippingData };

    try {
      // 1. Create Razorpay order on server
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        setSubmitError(orderData.error || "Failed to initialize payment. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setPendingOrderId(orderData.orderId);
      setPendingOrderNumber(orderData.orderNumber);

      // Dynamically import razorpay client helper
      const { openRazorpayCheckout, pollPaymentStatus } = await import("@/lib/razorpay-client");

      const handlePaymentSuccess = () => {
        isConfirmedSuccessRef.current = true;
        setSubmitError(null);
        setSubmittedOrder({
          orderId: orderData.orderNumber,
          shippingDetails: snapshotShipping,
          items: snapshotItems,
          totalPrice: totalPrice,
        });
        clearCart();
        setIsSubmitting(false);
        setIsVerifying(false);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      // 2. Open Razorpay Checkout Popup
      await openRazorpayCheckout({
        keyId: orderData.keyId,
        orderId: orderData.orderId,
        amount: orderData.amount,
        title: "Vrikszon Occultaura",
        description: `Order #${orderData.orderNumber}`,
        prefill: {
          name: shippingData.fullName,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        onSuccess: async (response) => {
          try {
            setIsVerifying(true);
            setVerificationMessage("Verifying cryptographic signature with payment gateway...");

            // 3. Verify cryptographic signature on backend
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              handlePaymentSuccess();
              return;
            }

            // Fallback status check if immediate signature response is delayed
            const check = await pollPaymentStatus(orderData.orderId, 6, 1500, (attempt, max) => {
              if (isConfirmedSuccessRef.current) return;
              setVerificationMessage(`Confirming bank receipt (Attempt ${attempt}/${max})...`);
            });

            if (check.isPaid) {
              handlePaymentSuccess();
              return;
            }

            if (!isConfirmedSuccessRef.current) {
              setIsVerifying(false);
              setSubmitError(
                verifyData.error || "Payment verification is pending bank confirmation. If debited, your order will confirm automatically."
              );
              setIsSubmitting(false);
            }
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            // Fallback check
            const check = await pollPaymentStatus(orderData.orderId, 6, 1500);
            if (check.isPaid) {
              handlePaymentSuccess();
              return;
            }
            if (!isConfirmedSuccessRef.current) {
              setIsVerifying(false);
              setSubmitError(
                `Payment confirmation in progress with your bank. If amount was debited, your order #${orderData.orderNumber} will be processed automatically.`
              );
              setIsSubmitting(false);
            }
          }
        },
        onDismiss: async () => {
          if (isConfirmedSuccessRef.current) return;
          setIsVerifying(true);
          setVerificationMessage("Waiting for confirmation from your bank or UPI app...");

          // Poll for up to 30 seconds with progress updates
          const check = await pollPaymentStatus(orderData.orderId, 15, 2000, (attempt, max) => {
            if (isConfirmedSuccessRef.current) return;
            setVerificationMessage(`Confirming payment with bank (Attempt ${attempt}/${max})...`);
          });

          if (isConfirmedSuccessRef.current) return;

          if (check.isPaid) {
            handlePaymentSuccess();
            return;
          }

          if (!isConfirmedSuccessRef.current) {
            setIsSubmitting(false);
            setIsVerifying(false);
            setSubmitError(
              `Payment checkout was closed. If your bank account was debited, order #${orderData.orderNumber} will be confirmed automatically within a few minutes.`
            );
          }
        },
        onError: async (err) => {
          if (isConfirmedSuccessRef.current) return;
          console.error("Razorpay Popup Error:", err);
          setIsVerifying(true);
          setVerificationMessage("Checking if payment was completed before popup error...");

          const check = await pollPaymentStatus(orderData.orderId, 6, 1500);
          if (isConfirmedSuccessRef.current) return;

          if (check.isPaid) {
            handlePaymentSuccess();
            return;
          }

          if (!isConfirmedSuccessRef.current) {
            setIsSubmitting(false);
            setIsVerifying(false);
            setSubmitError("Unable to complete payment. Please check your internet connection or try another payment method.");
          }
        },
      });
    } catch (err) {
      console.error("Checkout order error:", err);
      if (!isConfirmedSuccessRef.current) {
        setSubmitError("Network connection error. Please check your connection and try again.");
        setIsSubmitting(false);
        setIsVerifying(false);
      }
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
              <li aria-current="page">
                <span className="font-medium text-navy-950">Checkout</span>
              </li>
            </ol>
          </nav>

          <h1 className="font-heading text-h2 font-medium text-navy-950">
            {isSubmitted ? "Order Confirmation" : "Checkout"}
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
              isLoading={isLoadingOrder}
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
                <PaymentSection
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                  totalPrice={totalPrice}
                  isVerifying={isVerifying}
                  verificationMessage={verificationMessage}
                  pendingOrderId={pendingOrderId}
                  pendingOrderNumber={pendingOrderNumber}
                  onCheckStatusNow={handleCheckStatusNow}
                />
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
