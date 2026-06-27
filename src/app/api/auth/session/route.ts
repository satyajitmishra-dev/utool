import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 days
    
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    let subscriptionTier = "free";
    try {
      const userRef = adminDb.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const now = new Date();
      const referralCode = `ref_${userId.slice(0, 8)}`;
      
      if (!userDoc.exists) {
        await userRef.set({
          uid: userId,
          name: decodedToken.name || null,
          email: decodedToken.email || "",
          photoURL: decodedToken.picture || null,
          emailVerified: decodedToken.email_verified || false,
          subscriptionTier: "free",
          subscriptionStatus: "none",
          planType: null,
          createdAt: now,
          updatedAt: now,
          totalLifetimeUsage: 0,
          toolUsageCounts: {},
          lastUsedTool: "None",
          lastActiveAt: now,
          referralCode,
          invitedBy: null,
          referralActivated: false,
          referralsCompletedCount: 0,
          proUntil: null,
        });
      } else {
        const userData = userDoc.data();
        subscriptionTier = userData?.subscriptionTier || "free";
        if (!userData?.referralCode) {
          await userRef.update({ referralCode });
        }
      }
    } catch (firestoreError) {
      console.warn("[Session] Firestore access error, defaulting to free tier:", firestoreError);
    }

    try {
      await redis.set(`user:tier:${userId}`, subscriptionTier, { ex: 60 * 60 * 24 * 5 });
    } catch (redisError) {
      console.warn("[Session] Redis error caching tier, proceeding:", redisError);
    }

    const response = NextResponse.json({ status: "success" });
    response.cookies.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[Session] Unexpected endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
