import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

/**
 * POST /api/auth/session
 * Exits Client ID Token for HttpOnly Session Cookie, syncing user tier to Redis.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 days
    
    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Fetch user profile from Firestore to fetch their subscription tier
    let subscriptionTier = "free";
    try {
      const userRef = adminDb.collection("users").doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        subscriptionTier = userDoc.data()?.subscriptionTier || "free";
      }
    } catch (firestoreError) {
      console.warn("[Session] Firestore access error, defaulting to free tier:", firestoreError);
    }

    try {
      await redis.set(`user:tier:${userId}`, subscriptionTier, { ex: 60 * 60 * 24 * 5 });
    } catch (redisError) {
      console.warn("[Session] Redis error caching tier, proceeding:", redisError);
    }

    // Set cookie using NextResponse
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
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
