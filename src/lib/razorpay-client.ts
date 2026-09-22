/**
 * Client-side Razorpay Standard Hosted Checkout Loader & Trigger
 */

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  callback_url?: string;
  redirect?: boolean;
  prefill?: RazorpayPrefill;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  notes?: Record<string, string>;
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  timeout?: number; // seconds
  handler?: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    confirm_close?: boolean;
  };
}

let razorpayScriptLoadingPromise: Promise<boolean> | null = null;

export const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptLoadingPromise) {
    return razorpayScriptLoadingPromise;
  }

  razorpayScriptLoadingPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayScriptLoadingPromise;
};

export interface OpenCheckoutArgs {
  keyId?: string;
  orderId: string;
  amount: number; // in paise
  currency?: string;
  title?: string;
  description?: string;
  prefill?: RazorpayPrefill;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: () => void;
  onError?: (error: unknown) => void;
}

export async function openRazorpayCheckout({
  keyId,
  orderId,
  amount,
  currency = "INR",
  title = "Vrikszon Occultaura",
  description = "Vedic Occult Services & Sacred Offerings",
  prefill,
  onSuccess,
  onDismiss,
  onError,
}: OpenCheckoutArgs) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    onError?.(new Error("Unable to load Razorpay Payment Gateway. Please check your internet connection."));
    return;
  }

  const activeKey =
    keyId ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "";

  const callbackUrl = typeof window !== "undefined" ? `${window.location.origin}/api/payments/callback` : undefined;

  const options: RazorpayOptions = {
    key: activeKey,
    amount,
    currency,
    name: title,
    description,
    image: "/images/logo.png",
    order_id: orderId,
    callback_url: callbackUrl,
    prefill: {
      name: prefill?.name || "",
      email: prefill?.email || "",
      contact: prefill?.contact ? prefill.contact.replace(/\D/g, "") : "",
    },
    theme: {
      color: "#0B0F19",
      backdrop_color: "rgba(11, 15, 25, 0.85)",
    },
    retry: {
      enabled: true,
      max_count: 4,
    },
    timeout: 900, // 15 minutes session timeout
    handler: (response: RazorpaySuccessResponse) => {
      onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        onDismiss?.();
      },
      escape: true,
      backdropclose: false,
      confirm_close: true,
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    
    // Capture failure events inside the widget for debugging
    rzp.on("payment.failed", function (response: any) {
      console.warn("[Razorpay payment.failed event]", response?.error);
    });

    rzp.open();
  } catch (err) {
    console.error("Error opening Razorpay checkout:", err);
    onError?.(err);
  }
}

/**
 * Check payment status once
 */
export async function checkPaymentStatusOnce(orderId: string): Promise<{ isPaid: boolean; data?: any }> {
  try {
    const res = await fetch(`/api/payments/status?orderId=${encodeURIComponent(orderId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "PAID" || data.success) {
        return { isPaid: true, data };
      }
      return { isPaid: false, data };
    }
  } catch (err) {
    console.warn("[Payment Status Check] Request error:", err);
  }
  return { isPaid: false };
}

/**
 * Robust Payment Status Polling Helper
 * Polls backend verification endpoint to catch asynchronous captures (e.g. Netbanking / UPI app callbacks)
 */
export async function pollPaymentStatus(
  orderId: string,
  maxAttempts = 15,
  intervalMs = 2000,
  onProgress?: (attempt: number, max: number) => void
): Promise<{ isPaid: boolean; data?: any }> {
  for (let i = 0; i < maxAttempts; i++) {
    onProgress?.(i + 1, maxAttempts);
    try {
      const res = await fetch(`/api/payments/status?orderId=${encodeURIComponent(orderId)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "PAID" || data.success) {
          return { isPaid: true, data };
        }
      }
    } catch (err) {
      console.warn(`[Payment Polling] Attempt ${i + 1} failed:`, err);
    }

    if (i < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  return { isPaid: false };
}
