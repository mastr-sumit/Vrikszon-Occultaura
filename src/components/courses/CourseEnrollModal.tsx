"use client";

import { useState } from "react";
import { X, CheckCircle2, Lock, ShieldCheck, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { type Course, formatCoursePrice } from "@/data/courses";

interface CourseEnrollModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseEnrollModal({
  course,
  isOpen,
  onClose,
}: CourseEnrollModalProps) {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    paymentId?: string;
  } | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!studentData.name.trim()) newErrors.name = "Full Name is required";
    if (!studentData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const cleanPhone = studentData.phone.replace(/\D/g, "");
    if (!studentData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnrollAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Create Razorpay Course Order on backend
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "COURSE_PURCHASE",
          courseId: course.id,
          courseSlug: course.slug,
          studentData,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        setErrors({
          form: orderData.error || "Unable to initiate enrollment payment. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      // Dynamically load Razorpay checkout client
      const { openRazorpayCheckout, pollPaymentStatus } = await import("@/lib/razorpay-client");

      const handleCourseSuccess = (paymentId?: string) => {
        setPaymentDetails({
          orderId: orderData.orderId,
          paymentId: paymentId || "CONFIRMED",
        });
        setIsSubmitting(false);
        setIsSuccess(true);
      };

      // 2. Open Razorpay Checkout Popup
      await openRazorpayCheckout({
        keyId: orderData.keyId,
        orderId: orderData.orderId,
        amount: orderData.amount,
        title: "Vrikszon Occultaura",
        description: `Course: ${course.title}`,
        prefill: {
          name: studentData.name,
          email: studentData.email,
          contact: studentData.phone,
        },
        onSuccess: async (response) => {
          try {
            // 3. Cryptographic Signature Verification
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              handleCourseSuccess(response.razorpay_payment_id);
              return;
            }

            // Fallback status check
            const check = await pollPaymentStatus(orderData.orderId, 5, 1200);
            if (check.isPaid) {
              handleCourseSuccess(check.data?.razorpayPaymentId);
              return;
            }

            setErrors({
              form: verifyData.error || "Payment verification is pending bank confirmation. If debited, your enrollment will confirm automatically.",
            });
            setIsSubmitting(false);
          } catch (verifyErr) {
            console.error("Course verification error:", verifyErr);
            // Fallback status check
            const check = await pollPaymentStatus(orderData.orderId, 5, 1200);
            if (check.isPaid) {
              handleCourseSuccess(check.data?.razorpayPaymentId);
              return;
            }
            setErrors({
              form: "Payment confirmation is in progress with your bank. If amount was debited, your course enrollment will confirm automatically.",
            });
            setIsSubmitting(false);
          }
        },
        onDismiss: async () => {
          // Check if payment was captured via Netbanking/UPI redirect before marking dismissed
          const check = await pollPaymentStatus(orderData.orderId, 6, 1200);
          if (check.isPaid) {
            handleCourseSuccess(check.data?.razorpayPaymentId);
            return;
          }

          setIsSubmitting(false);
          setErrors({
            form: "Payment checkout was closed. If your bank account was debited, your course enrollment will confirm automatically within a few minutes.",
          });
        },
        onError: async (err) => {
          console.error("Razorpay Popup Error:", err);
          // Check if payment actually succeeded despite popup error
          const check = await pollPaymentStatus(orderData.orderId, 5, 1200);
          if (check.isPaid) {
            handleCourseSuccess(check.data?.razorpayPaymentId);
            return;
          }

          setIsSubmitting(false);
          setErrors({
            form: "Unable to complete payment. Please check your internet connection or try another payment method.",
          });
        },
      });
    } catch (err) {
      console.error("Course enrollment error:", err);
      setErrors({
        form: "A network error occurred. Please check your connection and try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gold-500/30 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-navy-600 hover:bg-navy-50 hover:text-navy-950 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-navy-900/10 pb-4 mb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600 border border-gold-500/20">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">
                  Course Enrollment
                </span>
                <h3 className="font-heading text-h5 font-semibold text-navy-950 line-clamp-1">
                  {course.title}
                </h3>
              </div>
            </div>

            {/* Price Badge */}
            <div className="mb-6 rounded-xl border border-gold-500/20 bg-gold-50/50 p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-navy-700">Enrollment Fee</span>
                <div className="font-heading text-h4 font-bold text-gold-700">
                  {formatCoursePrice(course.price)}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" /> Certified Masterclass
              </span>
            </div>

            {/* Error Notification */}
            {errors.form && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-50 p-3.5 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-900">Notice</p>
                  <p className="mt-0.5">{errors.form}</p>
                </div>
              </div>
            )}

            {/* Student Details Form */}
            <form onSubmit={handleEnrollAndPay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentData.name}
                  onChange={(e) => setStudentData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-navy-900/15 px-4 py-2.5 text-sm text-navy-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                />
                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={studentData.email}
                  onChange={(e) => setStudentData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. rahul@example.com"
                  className="w-full rounded-xl border border-navy-900/15 px-4 py-2.5 text-sm text-navy-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 mb-1">
                  WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={studentData.phone}
                  onChange={(e) => setStudentData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-navy-900/15 px-4 py-2.5 text-sm text-navy-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  leftIcon={<Lock className="h-4 w-4" />}
                >
                  {isSubmitting ? "Opening Razorpay..." : "Pay & Enroll Now"}
                </Button>
              </div>

              <p className="text-[11px] text-center text-navy-600/70 pt-1">
                Instant confirmation. Razorpay hosted 256-bit encrypted checkout.
              </p>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
                Enrollment Confirmed
              </span>
              <h3 className="font-heading text-h4 font-bold text-navy-950 mt-1">
                Welcome to {course.title}!
              </h3>
              <p className="text-sm text-navy-700/80 mt-1">
                Your payment was successfully verified. A confirmation receipt and session joining details have been recorded for <strong>{studentData.email}</strong>.
              </p>
            </div>

            {paymentDetails?.paymentId && (
              <div className="rounded-xl border border-navy-900/10 bg-navy-50/50 p-3 text-xs text-navy-800 font-mono">
                Payment Ref: {paymentDetails.paymentId}
              </div>
            )}

            <div className="pt-4 flex flex-col gap-2">
              <Button
                href="https://wa.me/919073190525?text=Hello%20Vrikszon%20Occultaura,%20I%20have%20enrolled%20in%20the%20course"
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                fullWidth
                variant="primary"
              >
                <span>Connect with Course Coordinator</span>
              </Button>

              <Button
                type="button"
                onClick={onClose}
                size="md"
                fullWidth
                variant="secondary"
              >
                <span>Close</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
