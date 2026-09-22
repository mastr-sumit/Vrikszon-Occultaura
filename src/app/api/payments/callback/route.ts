import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRazorpayInstance, verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { handleServerError } from "@/lib/errors";

export const dynamic = "force-dynamic";

/**
 * Razorpay Standard Checkout Full Browser Redirect Callback Handler
 *
 * Receives the POST or GET callback when a customer is redirected back from
 * Bank Netbanking (NBBL), 3D Secure Card authentication, or UPI Redirects.
 */
function getAppOrigin(request: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes("localhost")) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost && !forwardedHost.includes("localhost") && !forwardedHost.includes("127.0.0.1")) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://vrikszonoccultaura.com";
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  return handleCallback(request);
}

export async function GET(request: Request) {
  return handleCallback(request);
}

async function handleCallback(request: Request) {
  try {
    const origin = getAppOrigin(request);
    let paymentId = "";
    let orderId = "";
    let signature = "";
    let errorDescription = "";

    const url = new URL(request.url);
    // Check URL search params first
    paymentId = url.searchParams.get("razorpay_payment_id") || "";
    orderId = url.searchParams.get("razorpay_order_id") || "";
    signature = url.searchParams.get("razorpay_signature") || "";
    errorDescription = url.searchParams.get("error[description]") || url.searchParams.get("error_description") || "";

    // Parse Body if POST
    if (request.method === "POST") {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        paymentId = (formData.get("razorpay_payment_id") as string) || paymentId;
        orderId = (formData.get("razorpay_order_id") as string) || orderId;
        signature = (formData.get("razorpay_signature") as string) || signature;
        errorDescription = (formData.get("error[description]") as string) || errorDescription;
      } else if (contentType.includes("application/json")) {
        const body = await request.json().catch(() => ({}));
        paymentId = body.razorpay_payment_id || paymentId;
        orderId = body.razorpay_order_id || orderId;
        signature = body.razorpay_signature || signature;
        errorDescription = body.error?.description || errorDescription;
      }
    }

    console.info(`[Razorpay Callback Received] Order: ${orderId}, Payment: ${paymentId}, Signature: ${signature ? "Present" : "None"}`);

    if (!orderId) {
      return NextResponse.redirect(`${origin}/?payment_status=invalid_callback`, 303);
    }

    // 1. Fetch local payment record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { order: true, booking: true, course: true },
    });

    const paymentType = payment?.type || "SHOP_ORDER";

    // 2. Cryptographic or Direct Razorpay API Verification
    let isConfirmedPaid = false;
    let finalPaymentId = paymentId;

    if (paymentId && signature) {
      const isValid = verifyRazorpayPaymentSignature({
        orderId,
        paymentId,
        signature,
      });
      if (isValid) {
        isConfirmedPaid = true;
      }
    }

    // If signature check didn't pass or was absent, verify directly via Razorpay REST API
    if (!isConfirmedPaid) {
      try {
        const razorpay = getRazorpayInstance();
        const rzpOrder = await razorpay.orders.fetch(orderId);
        const paymentsResponse = await razorpay.orders.fetchPayments(orderId);
        const paymentsList = (paymentsResponse as { items?: Array<{ id: string; status: string }> }).items || [];

        const captured = paymentsList.find(
          (p) => p.status === "captured" || p.status === "authorized"
        );

        if (rzpOrder.status === "paid" || captured) {
          isConfirmedPaid = true;
          finalPaymentId = captured?.id || paymentId;
        }
      } catch (rzpErr) {
        console.error("[Razorpay Callback] API fetch error:", rzpErr);
      }
    }

    const now = new Date();

    // 3. If Confirmed Paid -> Update DB and Redirect to Success Screen
    if (isConfirmedPaid) {
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            razorpayPaymentId: finalPaymentId || payment.razorpayPaymentId,
            razorpaySignature: signature || payment.razorpaySignature,
            paidAt: payment.paidAt || now,
          },
        });

        if (payment.type === "SHOP_ORDER" && payment.orderId) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: {
              paymentStatus: "PAID",
              status: "PROCESSING",
              razorpayPaymentId: finalPaymentId || undefined,
              razorpaySignature: signature || undefined,
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

      // Redirect user to destination success page
      if (paymentType === "SHOP_ORDER") {
        const orderNumber = payment?.order?.orderNumber || "CONFIRMED";
        return NextResponse.redirect(
          `${origin}/checkout?status=success&orderId=${encodeURIComponent(orderNumber)}&paymentId=${encodeURIComponent(finalPaymentId)}`,
          303
        );
      }

      if (paymentType === "CONSULTATION_BOOKING") {
        return NextResponse.redirect(
          `${origin}/book-consultation?status=success&bookingId=${encodeURIComponent(payment?.bookingId || "")}&paymentId=${encodeURIComponent(finalPaymentId)}`,
          303
        );
      }

      if (paymentType === "COURSE_PURCHASE") {
        return NextResponse.redirect(
          `${origin}/courses?status=success&courseId=${encodeURIComponent(payment?.courseId || "")}&paymentId=${encodeURIComponent(finalPaymentId)}`,
          303
        );
      }

      return NextResponse.redirect(`${origin}/checkout?status=success&orderId=${encodeURIComponent(orderId)}`, 303);
    }

    // 4. If payment is genuinely not confirmed / failed
    const errorMsg = errorDescription || "Payment could not be completed by your bank.";
    if (paymentType === "SHOP_ORDER") {
      return NextResponse.redirect(
        `${origin}/checkout?status=failed&error=${encodeURIComponent(errorMsg)}&orderId=${encodeURIComponent(orderId)}`,
        303
      );
    }

    if (paymentType === "CONSULTATION_BOOKING") {
      return NextResponse.redirect(
        `${origin}/book-consultation?status=failed&error=${encodeURIComponent(errorMsg)}`,
        303
      );
    }

    return NextResponse.redirect(
      `${origin}/courses?status=failed&error=${encodeURIComponent(errorMsg)}`,
      303
    );
  } catch (error) {
    return handleServerError(error, "GET/POST /api/payments/callback", "Payment callback handling failed.");
  }
}
