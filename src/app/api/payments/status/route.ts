import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRazorpayInstance } from "@/lib/razorpay";
import { handleServerError } from "@/lib/errors";

export const dynamic = "force-dynamic";

/**
 * GET /api/payments/status?orderId={razorpayOrderId}
 *
 * Real-time reconciliation endpoint that checks:
 * 1. Local database Payment status.
 * 2. If not yet marked PAID in DB, queries Razorpay REST API directly for real-time capture status.
 * 3. Automatically reconciles and updates the DB if Razorpay confirms payment was captured.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required 'orderId' query parameter." },
        { status: 400 }
      );
    }

    // 1. Check local database first
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        order: true,
        booking: true,
        course: true,
      },
    });

    if (payment && payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        status: "PAID",
        paymentId: payment.id,
        razorpayPaymentId: payment.razorpayPaymentId,
        type: payment.type,
        orderNumber: payment.order?.orderNumber,
        bookingId: payment.bookingId,
        paidAt: payment.paidAt,
      });
    }

    // 2. Query Razorpay API directly for real-time status
    try {
      const razorpay = getRazorpayInstance();
      const rzpOrder = await razorpay.orders.fetch(orderId);
      // Fetch any payments associated with this order
      const paymentsResponse = await razorpay.orders.fetchPayments(orderId);
      const paymentsList = (paymentsResponse as { items?: Array<{ id: string; status: string; method?: string; amount?: number }> }).items || [];

      // Check if order is marked paid or any payment is captured/authorized
      const capturedPayment = paymentsList.find(
        (p) => p.status === "captured" || p.status === "authorized"
      );

      const isPaidOnRazorpay = rzpOrder.status === "paid" || !!capturedPayment;

      if (isPaidOnRazorpay) {
        const now = new Date();
        const activePaymentId = capturedPayment?.id || null;

        // Reconcile and update local DB immediately
        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "PAID",
              razorpayPaymentId: activePaymentId || payment.razorpayPaymentId,
              paidAt: payment.paidAt || now,
            },
          });

          if (payment.type === "SHOP_ORDER" && payment.orderId) {
            await prisma.order.update({
              where: { id: payment.orderId },
              data: {
                paymentStatus: "PAID",
                status: "PROCESSING",
                razorpayPaymentId: activePaymentId || undefined,
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
        }

        return NextResponse.json({
          success: true,
          status: "PAID",
          paymentId: payment?.id,
          razorpayPaymentId: activePaymentId,
          type: payment?.type,
          orderNumber: payment?.order?.orderNumber,
          bookingId: payment?.bookingId,
          paidAt: now,
          source: "razorpay_reconciliation",
        });
      }

      // Check if there are active attempts still pending
      const hasPendingPayment = paymentsList.some((p) => p.status === "created" || p.status === "pending");
      if (hasPendingPayment || rzpOrder.status === "attempted") {
        return NextResponse.json({
          success: false,
          status: "PENDING",
          message: "Payment is currently processing with your bank.",
        });
      }

      return NextResponse.json({
        success: false,
        status: payment?.status || "PENDING",
        message: "Payment has not been confirmed yet.",
      });
    } catch (rzpErr) {
      console.error("[Payment Status Check] Razorpay API error:", rzpErr);
      return NextResponse.json({
        success: payment?.status === "PAID",
        status: payment?.status || "PENDING",
      });
    }
  } catch (error) {
    return handleServerError(error, "GET /api/payments/status", "Failed to check payment status.");
  }
}
