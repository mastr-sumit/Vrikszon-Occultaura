import Razorpay from "razorpay";
import crypto from "crypto";

// Ensure Razorpay instance is singleton
const globalForRazorpay = globalThis as unknown as {
  razorpay: Razorpay | undefined;
};

export const getRazorpayInstance = (): Razorpay => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay API Keys are missing in environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)."
    );
  }

  if (!globalForRazorpay.razorpay) {
    globalForRazorpay.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return globalForRazorpay.razorpay;
};

/**
 * Verify Razorpay Standard Checkout signature received after frontend payment completion.
 *
 * Signature is computed as:
 * HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !orderId || !paymentId || !signature) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const actualBuf = Buffer.from(signature, "utf-8");

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch (err) {
    console.error("Payment signature verification error:", err);
    return false;
  }
}

/**
 * Verify Razorpay Webhook signature against RAW, unparsed request payload.
 *
 * Signature is sent in header: 'x-razorpay-signature'
 * Computed as: HMAC-SHA256(rawBodyString, RAZORPAY_WEBHOOK_SECRET)
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string;
  signature: string;
}): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !rawBody || !signature) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const actualBuf = Buffer.from(signature, "utf-8");

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}
