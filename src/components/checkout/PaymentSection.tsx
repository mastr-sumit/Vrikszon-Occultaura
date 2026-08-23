"use client";

import { CreditCard, Info, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaymentSectionProps {
  isSubmitting?: boolean;
  submitError?: string | null;
}

/**
 * PaymentSection
 *
 * Payment section for the /checkout page.
 * Displays an honest, informational panel explaining that online payment gateway
 * integration is coming soon, and that orders are currently confirmed manually
 * via Phone / WhatsApp before payment and dispatch.
 *
 * Per ui-ux-pro-max guidance:
 * - Informational (not warning/error) styling to reduce transaction anxiety.
 * - Prominent "Place Order" CTA button.
 * - Trust markers confirming manual order verification.
 */
export default function PaymentSection({
  isSubmitting = false,
  submitError = null,
}: PaymentSectionProps) {
  return (
    <section aria-labelledby="payment-section-heading" className="w-full mt-8">
      <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-xs sm:p-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-navy-900/10 pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 border border-navy-900/10 text-gold-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="payment-section-heading"
              className="font-heading text-h4 font-medium text-navy-950"
            >
              Payment Method
            </h2>
            <p className="text-body-sm text-navy-900/60">
              Zero upfront payment required at this step.
            </p>
          </div>
        </div>

        {/* Informational Panel — Honest & Non-Alarming */}
        <div className="rounded-xl border border-gold-500/30 bg-warm-white/80 p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
            <div className="space-y-2">
              <h3 className="text-body font-semibold text-navy-950">
                Manual Order Confirmation & Payment
              </h3>
              <p className="text-body-sm text-navy-800/80 leading-relaxed">
                Online automated payment integration is coming soon. For now, place your order below and our team will contact you directly via <strong>Phone / WhatsApp (+91 90731 90525)</strong> or <strong>Email (vrikszonoccultaura9@gmail.com)</strong> to confirm your details, energisation requirements, and arrange convenient payment options.
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-navy-900/10 pt-3 flex items-center gap-2 text-caption text-navy-900/70">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>100% Secure &amp; Verified Consultation Process</span>
          </div>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-50 p-4 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Order Submission Failed</p>
              <p className="mt-0.5 text-rose-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Action: Place Order */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            leftIcon={<CheckCircle2 className="h-5 w-5" />}
          >
            {isSubmitting ? "Processing Order..." : "Place Order"}
          </Button>

          <p className="text-caption text-center text-navy-900/50">
            By placing your order, you request manual phone/WhatsApp confirmation from our team.
          </p>
        </div>
      </div>
    </section>
  );
}
