import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getAuthUser } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";

export async function POST() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRef = adminDb.collection("users").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const subscriptionId = userData?.subscriptionId;

    if (!subscriptionId) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
    }

    // Determine cancellation behavior based on configuration
    const cancelImmediately = process.env.SUBSCRIPTION_CANCEL_IMMEDIATE === "true";
    const cancelAtCycleEnd = !cancelImmediately;

    // Call Razorpay API to cancel subscription
    await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);

    const now = new Date();

    if (cancelImmediately) {
      // Downgrade immediately
      await userRef.set(
        {
          subscriptionTier: "free",
          subscriptionStatus: "cancelled",
          updatedAt: now,
        },
        { merge: true }
      );

      // Invalidate/update Redis cache
      try {
        await redis.set(`user:tier:${user.uid}`, "free", { ex: 60 * 60 * 24 * 5 });
      } catch (redisError) {
        console.warn("Failed to update Redis cache:", redisError);
      }
    } else {
      // Cancel at cycle end: keep Pro access, update status
      await userRef.set(
        {
          subscriptionStatus: "cancelled",
          updatedAt: now,
        },
        { merge: true }
      );
      // Redis tier remains "pro" until the cycle end webhook fires
    }

    return NextResponse.json({
      status: "success",
      cancelImmediately,
      message: cancelImmediately
        ? "Subscription cancelled immediately."
        : "Your subscription will end after the current billing cycle.",
    });
  } catch (error: unknown) {
    console.error("Failed to cancel subscription:", error);
    const message = error instanceof Error ? error.message : "Failed to cancel subscription";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
