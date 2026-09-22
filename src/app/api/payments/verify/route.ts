import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const rateLimit = checkRouteRateLimit(request, "strict");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    // 1. Strict Server-side Cryptographic Signature Verification
    const isValid = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.warn(`[Payment Verification Failed] Signature mismatch for order: ${razorpay_order_id}`);
      
      // Update payment record to FAILED if found
      await prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { error: "Payment verification failed. Invalid cryptographic signature." },
        { status: 400 }
      );
    }

    // 2. Fetch Payment Record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { order: true, booking: true, course: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found for the provided order ID." },
        { status: 404 }
      );
    }

    const now = new Date();

    // 3. Check for Idempotency (if already processed and marked paid)
    if (payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Payment was already verified and processed.",
        paymentId: payment.id,
        type: payment.type,
      });
    }

    // 4. Update Payment record to PAID
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: now,
      },
    });

    // 5. Downstream entity status updates
    if (payment.type === "SHOP_ORDER" && payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });
    } else if (payment.type === "CONSULTATION_BOOKING" && payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and confirmed.",
      paymentId: updatedPayment.id,
      type: updatedPayment.type,
      paidAt: updatedPayment.paidAt,
    });
  } catch (error) {
    return handleServerError(error, "POST /api/payments/verify", "Failed to verify payment signature.");
  }
}
