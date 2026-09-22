"use client";

import { CreditCard, ShieldCheck, AlertCircle, Lock, Zap, Loader2, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaymentSectionProps {
  isSubmitting?: boolean;
  submitError?: string | null;
  totalPrice?: number;
  isVerifying?: boolean;
  verificationMessage?: string | null;
  pendingOrderId?: string | null;
  pendingOrderNumber?: string | null;
  onCheckStatusNow?: () => void;
}

export default function PaymentSection({
  isSubmitting = false,
  submitError = null,
  totalPrice = 0,
  isVerifying = false,
  verificationMessage = null,
  pendingOrderId = null,
  pendingOrderNumber = null,
  onCheckStatusNow,
}: PaymentSectionProps) {
  const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test_");

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
              Instant &amp; secure payment via Razorpay.
            </p>
          </div>
        </div>

        {/* Razorpay Secure Badge Box */}
        <div className="rounded-xl border border-gold-500/30 bg-gradient-to-br from-gold-50/40 via-white to-navy-50/30 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-body font-semibold text-navy-950">
                  Razorpay Hosted Checkout
                </h3>
                <p className="text-xs text-navy-800/70">
                  UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking &amp; Wallets
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-gold-900 border border-gold-300">
              <Zap className="h-3 w-3 text-gold-700" /> Instant
            </span>
          </div>

          <div className="border-t border-navy-900/10 pt-3 flex items-center justify-between text-xs text-navy-900/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted &amp; RBI Compliant</span>
            </div>
            {isTestMode ? (
              <span className="font-mono text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                Test Mode
              </span>
            ) : (
              <span className="font-sans text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live &amp; Secure
              </span>
            )}
          </div>
        </div>

        {/* Real-time Verification in Progress Card */}
        {isVerifying && (
          <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50/80 p-4 text-xs font-medium text-indigo-900 animate-pulse">
            <div className="flex items-center gap-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600 shrink-0" />
              <div>
                <p className="font-semibold text-indigo-950">
                  Waiting for Bank Confirmation...
                </p>
                <p className="mt-0.5 text-indigo-800">
                  {verificationMessage || "If you completed payment in your bank or UPI app, we are confirming the receipt."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error / Cancellation Alert with Manual Refresh Option */}
        {submitError && !isVerifying && (
          <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-50/90 p-4 text-xs font-medium text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-950">Payment Status Update</p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">{submitError}</p>

                {pendingOrderId && onCheckStatusNow && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onCheckStatusNow}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-navy-800 transition-colors shadow-xs"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Check Payment Status Again
                    </button>
                    {pendingOrderNumber && (
                      <span className="text-[11px] text-amber-700/80">
                        Ref: #{pendingOrderNumber}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action: Pay Now */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={isSubmitting || isVerifying}
            leftIcon={
              isSubmitting || isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )
            }
          >
            {isVerifying
              ? "Confirming Payment with Bank..."
              : isSubmitting
              ? "Opening Secure Checkout..."
              : `Proceed to Pay ${totalPrice > 0 ? `₹${totalPrice.toLocaleString("en-IN")}` : ""}`}
          </Button>

          <p className="text-caption text-center text-navy-900/50">
            Clicking will open Razorpay's secure payment popup. Your cart will be confirmed once payment succeeds.
          </p>
        </div>
      </div>
    </section>
  );
}
