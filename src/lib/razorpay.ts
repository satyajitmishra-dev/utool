import Razorpay from "razorpay";
import crypto from "crypto";

// Ensure Razorpay is only instantiated server-side
if (typeof window !== "undefined") {
  throw new Error("Razorpay client instance can only be imported in server-side modules.");
}

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const razorpay = new Razorpay({
  key_id: keyId || "mock_key_id",
  key_secret: keySecret || "mock_key_secret",
});

/**
 * Verifies Razorpay Webhook Signatures
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Razorpay webhook signature verification failed", error);
    return false;
  }
}

/**
 * Verifies Razorpay Subscription Payment Signature
 * For subscription callback verification
 */
export function verifyRazorpaySubscriptionSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const body = paymentId + "|" + subscriptionId;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret || "mock_key_secret")
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Razorpay subscription signature verification failed", error);
    return false;
  }
}

/**
 * Verifies Razorpay Payment Signature (Client Payment Verification)
 * For standard orders
 */
export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret || "mock_key_secret")
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Razorpay payment signature verification failed", error);
    return false;
  }
}

