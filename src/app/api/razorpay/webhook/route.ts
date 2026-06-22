import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    if (!webhookSecret || webhookSecret === "your_razorpay_webhook_signature_secret") {
      console.warn("Razorpay webhook secret is not configured in .env. Skipping verification for development.");
    } else {
      // Verify signature
      const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const eventData = JSON.parse(rawBody);
    const eventName = eventData.event;
    const payload = eventData.payload;

    console.log(`Razorpay Webhook received event: ${eventName}`, payload);

    if (!payload || !payload.subscription) {
      return NextResponse.json({ status: "ignored", message: "No subscription payload found" });
    }

    const subscriptionEntity = payload.subscription.entity;
    const subscriptionId = subscriptionEntity.id;
    const subscriptionStatus = subscriptionEntity.status; // active, cancelled, expired, halted, etc.
    console.log(`Subscription ${subscriptionId} status: ${subscriptionStatus}`);

    // Retrieve userId from notes metadata or lookup in Firestore
    let uid = subscriptionEntity.notes?.userId;
    if (!uid) {
      const usersRef = adminDb.collection("users");
      const querySnapshot = await usersRef.where("subscriptionId", "==", subscriptionId).limit(1).get();
      if (!querySnapshot.empty) {
        uid = querySnapshot.docs[0].id;
      }
    }

    if (!uid) {
      console.error(`Could not resolve user UID for subscription ID: ${subscriptionId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const userRef = adminDb.collection("users").doc(uid);

    switch (eventName) {
      case "subscription.activated":
      case "subscription.authenticated":
        await userRef.set(
          {
            subscriptionTier: "pro",
            subscriptionStatus: "active",
            subscriptionId: subscriptionId,
            planType: "monthly",
            paymentReference: subscriptionId,
            updatedAt: now,
          },
          { merge: true }
        );
        await redis.set(`user:tier:${uid}`, "pro", { ex: 60 * 60 * 24 * 5 });
        break;

      case "subscription.charged":
        // Upgrade user
        await userRef.set(
          {
            subscriptionTier: "pro",
            subscriptionStatus: "active",
            subscriptionId: subscriptionId,
            planType: "monthly",
            paymentReference: subscriptionId,
            updatedAt: now,
          },
          { merge: true }
        );
        await redis.set(`user:tier:${uid}`, "pro", { ex: 60 * 60 * 24 * 5 });

        // Record invoice history
        if (payload.payment) {
          const paymentEntity = payload.payment.entity;
          const paymentId = paymentEntity.id;
          const invoiceId = `INV-${paymentId}`;
          const amountInRupees = paymentEntity.amount ? paymentEntity.amount / 100 : 49;
          const invoiceMonth = now.toLocaleString("en-US", { month: "long", year: "numeric" });
          const friendlyDate = now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          const receiptUrl = paymentEntity.invoice_id 
            ? `https://dashboard.razorpay.com/invoices/${paymentEntity.invoice_id}` 
            : null;

          await adminDb
            .collection("billing_history")
            .doc(invoiceId)
            .set({
              id: invoiceId,
              uid: uid,
              subscriptionId: subscriptionId,
              paymentId: paymentId,
              amount: amountInRupees,
              currency: paymentEntity.currency || "INR",
              status: "Paid",
              planName: "Pro Monthly",
              invoiceMonth: invoiceMonth,
              date: friendlyDate,
              createdAt: now,
              paymentType: "subscription",
              planType: "monthly",
              invoiceType: "monthly",
              paymentMethod: paymentEntity.method || "Unknown",
              receiptUrl: receiptUrl,
            });
        }
        break;

      case "subscription.cancelled":
      case "subscription.halted":
      case "subscription.expired":
        // Downgrade user
        await userRef.set(
          {
            subscriptionTier: "free",
            subscriptionStatus: eventName.replace("subscription.", ""),
            updatedAt: now,
          },
          { merge: true }
        );
        await redis.set(`user:tier:${uid}`, "free", { ex: 60 * 60 * 24 * 5 });
        break;

      default:
        console.log(`Unhandled subscription event: ${eventName}`);
    }

    return NextResponse.json({ status: "success", event: eventName });
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
