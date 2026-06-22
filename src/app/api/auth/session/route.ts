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
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Set session expiration (e.g., 5 days)
    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    
    // Verify ID Token and create Session Cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Decode token to find userId
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Fetch user profile from Firestore to fetch their subscription tier
    let subscriptionTier = "free";
    try {
      const userRef = adminDb.collection("users").doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        subscriptionTier = userDoc.data()?.subscriptionTier || "free";
      } else {
        // Create user document if it doesn't exist yet (auto-registration)
        const now = new Date();
        await userRef.set({
          uid: userId,
          email: decodedToken.email || "",
          displayName: decodedToken.name || null,
          photoURL: decodedToken.picture || null,
          createdAt: now,
          updatedAt: now,
          subscriptionTier: "free",
          subscriptionStatus: "none",
          subscriptionId: null,
          credits: 100, // 100 free credits upon signup
        });
      }
    } catch (firestoreError) {
      console.warn("Firestore access error during session sync, defaulting to free tier:", firestoreError);
    }

    try {
      // Cache the subscription tier in Upstash Redis for middleware speed
      await redis.set(`user:tier:${userId}`, subscriptionTier, { ex: 60 * 60 * 24 * 5 }); // Expire after 5 days
    } catch (redisError) {
      console.warn("Redis error caching tier, proceeding:", redisError);
    }

    // Set the cookie in Next.js response headers
    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "success" });
  } catch (error: unknown) {
    console.error("Session creation endpoint error", error);
    const message = error instanceof Error ? error.message : "Failed to create session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Destroys session cookie on logout.
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("__session");
    return NextResponse.json({ status: "success" });
  } catch (error: unknown) {
    console.error("Session destruction endpoint error", error);
    return NextResponse.json({ error: "Failed to destroy session" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";

