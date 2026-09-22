import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { handleServerError } from "@/lib/errors";

/**
 * Razorpay Webhook Handler
 *
 * Listens for asynchronous payment status updates (payment.captured, payment.failed, order.paid).
 *
 * CRITICAL SECURITY REQUIREMENTS:
 * 1. Reads the exact RAW unparsed string body via `request.text()` (NOT parsed JSON).
 * 2. Cryptographically verifies HMAC-SHA256 signature with RAZORPAY_WEBHOOK_SECRET BEFORE any database operations.
 * 3. Idempotent state transitions to prevent duplicate processing.
 */
export async function POST(request: Request) {
  try {
    // 1. Read the EXACT raw string body before any parsing
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.warn("[Webhook Rejected] Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature header." }, { status: 400 });
    }

    // 2. Strict Signature Verification BEFORE any DB writes or modifications
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.warn("[Webhook Rejected] Invalid HMAC signature");
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    // 3. Parse JSON only after cryptographic verification has passed
    const payload = JSON.parse(rawBody);
    const eventType = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
    const rzpPaymentId = paymentEntity?.id;

    if (!rzpOrderId) {
      // Return 200 for unhandled events that do not pertain to specific orders
      return NextResponse.json({ status: "acknowledged", event: eventType }, { status: 200 });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: rzpOrderId },
    });

    if (!payment) {
      console.info(`[Webhook] No matching payment record for order: ${rzpOrderId}`);
      return NextResponse.json({ status: "acknowledged", note: "order_not_tracked" }, { status: 200 });
    }

    const now = new Date();

    // 4. Handle Payment Success (payment.captured / order.paid / payment.authorized)
    if (eventType === "payment.captured" || eventType === "order.paid" || eventType === "payment.authorized") {
      if (payment.status !== "PAID") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            razorpayPaymentId: rzpPaymentId || payment.razorpayPaymentId,
            paidAt: now,
          },
        });

        if (payment.type === "SHOP_ORDER" && payment.orderId) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: {
              paymentStatus: "PAID",
              status: "PROCESSING",
              razorpayPaymentId: rzpPaymentId || undefined,
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

        console.info(`[Webhook Success] Processed ${eventType} for order: ${rzpOrderId}`);
      }
    }

    // 5. Handle Payment Failure (payment.failed)
    if (eventType === "payment.failed") {
      if (payment.status !== "PAID") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            razorpayPaymentId: rzpPaymentId || payment.razorpayPaymentId,
          },
        });

        if (payment.type === "SHOP_ORDER" && payment.orderId) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: {
              paymentStatus: "FAILED",
            },
          });
        }

        console.info(`[Webhook Failure Recorded] for order: ${rzpOrderId}`);
      }
    }

    return NextResponse.json({ status: "success", event: eventType }, { status: 200 });
  } catch (error) {
    return handleServerError(error, "POST /api/payments/webhook", "Webhook processing failed.");
  }
}
