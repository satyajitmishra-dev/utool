import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { guestId, userId } = await req.json();
    if (!guestId || !userId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Capture referral source from cookies if present
    const referredByCode = req.cookies.get("utool_referred_by")?.value || null;
    if (referredByCode) {
      const userRef = adminDb.collection("users").doc(userId);
      const userDoc = await userRef.get();
      if (userDoc.exists && !userDoc.data()?.invitedBy) {
        const referrerQuery = await adminDb
          .collection("users")
          .where("referralCode", "==", referredByCode)
          .limit(1)
          .get();
        if (!referrerQuery.empty) {
          const referrerUid = referrerQuery.docs[0].id;
          if (referrerUid !== userId) {
            await userRef.update({ invitedBy: referrerUid });
            console.log(`Set invitedBy for ${userId} to referrer ${referrerUid}`);
          }
        }
      }
    }

    // 1. Move usage transactions from guestId to userId in Firestore
    const transactionsSnap = await adminDb
      .collection("usage_transactions")
      .where("userId", "==", guestId)
      .get();

    if (!transactionsSnap.empty) {
      const batch = adminDb.batch();
      transactionsSnap.docs.forEach((doc) => {
        batch.update(doc.ref, { userId: userId });
      });
      await batch.commit();
      console.log(`Merged ${transactionsSnap.size} transaction history entries from ${guestId} to ${userId}`);
    }

    // 2. Move Redis usage counts
    const guestUsageKey = `user:usage:${guestId}`;
    const userUsageKey = `user:usage:${userId}`;
    
    const guestCount = (await redis.get<number>(guestUsageKey)) || 0;
    if (guestCount > 0) {
      const exists = await redis.exists(userUsageKey);
      await redis.incrby(userUsageKey, guestCount);
      
      if (!exists) {
        const now = new Date();
        const startOfNextDay = new Date();
        startOfNextDay.setUTCHours(24, 0, 0, 0);
        const secondsUntilMidnight = Math.max(1, Math.floor((startOfNextDay.getTime() - now.getTime()) / 1000));
        await redis.expire(userUsageKey, secondsUntilMidnight);
      }
      await redis.del(guestUsageKey);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Auth merge API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
