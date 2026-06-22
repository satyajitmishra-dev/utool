import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature, razorpay } from "@/lib/razorpay";
import { getAuthUser } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, paymentId, signature } = await request.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Verify signature securely
    const isValid = verifyRazorpayPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Fetch additional payment details from Razorpay securely
    let paymentMethod = "Unknown";
    let receiptUrl = "";
    try {
      const paymentDetails = await razorpay.payments.fetch(paymentId);
      paymentMethod = paymentDetails.method || "Unknown";
      if (paymentDetails.invoice_id) {
        receiptUrl = `https://dashboard.razorpay.com/invoices/${paymentDetails.invoice_id}`;
      }
    } catch (paymentError) {
      console.warn("Failed to fetch payment details from Razorpay, falling back:", paymentError);
    }

    const now = new Date();

    // Update Firestore user profile - Lifetime plan type, orderId as paymentReference
    const userRef = adminDb.collection("users").doc(user.uid);
    await userRef.set(
      {
        subscriptionTier: "pro",
        subscriptionStatus: "active",
        planType: "lifetime",
        paymentReference: orderId,
        subscriptionId: null, // Clear any previous subscriptionId to avoid conflict
        updatedAt: now,
      },
      { merge: true }
    );

    // Sync Redis cache instantly
    try {
      await redis.set(`user:tier:${user.uid}`, "pro", { ex: 60 * 60 * 24 * 30 }); // 30 days expiration or longer
    } catch (redisError) {
      console.warn("Failed to set Redis cache tier:", redisError);
    }

    const verifiedPrice = Number(process.env.RAZORPAY_LIFETIME_PRICE) || 299;

    // Record invoice in billing history
    const invoiceId = `INV-${paymentId}`;
    const invoiceMonth = now.toLocaleString("en-US", { month: "long", year: "numeric" });
    const friendlyDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    await adminDb
      .collection("billing_history")
      .doc(invoiceId)
      .set({
        id: invoiceId,
        uid: user.uid,
        subscriptionId: orderId, // or null, but acts as unique checkout id
        paymentId: paymentId,
        amount: verifiedPrice,
        currency: "INR",
        status: "Paid",
        planName: "Pro Lifetime",
        invoiceMonth: invoiceMonth,
        date: friendlyDate,
        createdAt: now,
        paymentType: "one-time",
        planType: "lifetime",
        invoiceType: "one-time",
        paymentMethod: paymentMethod,
        receiptUrl: receiptUrl || null,
      });

    return NextResponse.json({ status: "success" });
  } catch (error: unknown) {
    console.error("Failed to verify order:", error);
    const message = error instanceof Error ? error.message : "Failed to verify order";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
