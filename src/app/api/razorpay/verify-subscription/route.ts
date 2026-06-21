import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySubscriptionSignature } from "@/lib/razorpay";
import { getAuthUser } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId, paymentId, signature } = await request.json();

    if (!subscriptionId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Verify signature securely
    const isValid = verifyRazorpaySubscriptionSignature(subscriptionId, paymentId, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const now = new Date();

    // Webhook is the final source of truth, but we update Firestore instantly to sync UI
    const userRef = adminDb.collection("users").doc(user.uid);
    await userRef.set(
      {
        subscriptionTier: "pro",
        subscriptionStatus: "active",
        subscriptionId: subscriptionId,
        updatedAt: now,
      },
      { merge: true }
    );

    // Sync Redis cache instantly
    try {
      await redis.set(`user:tier:${user.uid}`, "pro", { ex: 60 * 60 * 24 * 5 }); // 5 days expiration
    } catch (redisError) {
      console.warn("Failed to set Redis cache tier:", redisError);
    }

    // Record invoice in billing history
    const invoiceId = `INV-${paymentId}`;
    const invoiceMonth = now.toLocaleString("en-US", { month: "long", year: "numeric" }); // E.g. "June 2026"
    const friendlyDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }); // E.g. "June 21, 2026"

    await adminDb
      .collection("billing_history")
      .doc(invoiceId)
      .set({
        id: invoiceId,
        uid: user.uid,
        subscriptionId: subscriptionId,
        paymentId: paymentId,
        amount: 299, // ₹299
        currency: "INR",
        status: "Paid",
        planName: "Pro Utility",
        invoiceMonth: invoiceMonth,
        date: friendlyDate,
        createdAt: now,
      });

    return NextResponse.json({ status: "success" });
  } catch (error: unknown) {
    console.error("Failed to verify subscription:", error);
    const message = error instanceof Error ? error.message : "Failed to verify subscription";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
