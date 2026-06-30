import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();
    if (!identifier) {
      return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
    }

    const isGuest = identifier.startsWith("anon_");
    let tier: "free" | "pro" | "enterprise" = "free";

    // 1. Determine Tier
    if (!isGuest) {
      const cachedTier = await redis.get<string>(`user:tier:${identifier}`);
      if (cachedTier === "pro" || cachedTier === "enterprise" || cachedTier === "free") {
        tier = cachedTier as any;
      } else {
        try {
          const userDoc = await adminDb.collection("users").doc(identifier).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            tier = userData?.subscriptionTier || "free";
          }
          await redis.set(`user:tier:${identifier}`, tier, { ex: 60 * 60 * 24 });
        } catch (dbError) {
          console.error("Firestore error fetching user tier, defaulting to free:", dbError);
          tier = "free";
        }
      }
    }

    // Pro / Enterprise users have unlimited access
    if (tier === "pro" || tier === "enterprise") {
      return NextResponse.json({
        count: 0,
        max: Infinity,
        isLimited: false,
        loading: false,
        tier,
        resetAt: null,
      });
    }

    const max = isGuest ? 1 : 3;
    const redisKey = `user:usage:${identifier}`;
    
    // 2. Determine Count
    let count = 0;
    const cachedCount = await redis.get<number>(redisKey);
    
    const now = new Date();
    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);
    const secondsUntilMidnight = Math.max(1, Math.floor((startOfNextDay.getTime() - now.getTime()) / 1000));

    if (cachedCount !== null) {
      count = cachedCount;
    } else {
      if (!isGuest) {
        try {
          const userDoc = await adminDb.collection("users").doc(identifier).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const todayStr = now.toISOString().split("T")[0];
            if (userData?.dailyUsageDate === todayStr) {
              count = userData.dailyUsageCount || 0;
            }
          }
        } catch (dbError) {
          console.error("Firestore error fetching daily usage, defaulting to 0:", dbError);
          count = 0;
        }
      }
      await redis.set(redisKey, count, { ex: secondsUntilMidnight });
    }

    return NextResponse.json({
      count,
      max,
      isLimited: count >= max,
      loading: false,
      tier,
      resetAt: startOfNextDay.toISOString(),
    });
  } catch (error: any) {
    console.error("Usage check API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
