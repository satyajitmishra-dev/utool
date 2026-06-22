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
    // 1. Parse body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("[Session] Failed to parse request body:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { idToken } = body;

    // 2. Validate idToken
    if (!idToken) {
      console.error("[Session] Missing ID token in request");
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Set session expiration (e.g., 5 days)
    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    
    // 3. Create session cookie
    let sessionCookie;
    let decodedToken;
    try {
      console.log("[Session] Creating session cookie...");
      sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
      console.log("[Session] Session cookie created successfully.");
      
      console.log("[Session] Verifying ID token...");
      decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log("[Session] ID token verified for UID:", decodedToken.uid);
    } catch (authError: any) {
      console.error("[Session] Firebase Auth Error:", authError);
      return NextResponse.json(
        { error: "Failed to authenticate session", details: authError.message }, 
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // Fetch user profile from Firestore to fetch their subscription tier
    let subscriptionTier = "free";
    try {
      const userRef = adminDb.collection("users").doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        subscriptionTier = userDoc.data()?.subscriptionTier || "free";
      } else {
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
          credits: 100,
        });
      }
    } catch (firestoreError) {
      console.warn("[Session] Firestore access error, defaulting to free tier:", firestoreError);
    }

    try {
      await redis.set(`user:tier:${userId}`, subscriptionTier, { ex: 60 * 60 * 24 * 5 });
    } catch (redisError) {
      console.warn("[Session] Redis error caching tier, proceeding:", redisError);
    }

    // 4. Set cookie using await cookies()
    try {
      console.log("[Session] Setting Next.js cookie...");
      const cookieStore = await cookies();
      cookieStore.set("__session", sessionCookie, {
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      console.log("[Session] Cookie set successfully.");
    } catch (cookieError: any) {
      console.error("[Session] Failed to set cookie:", cookieError);
      return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
    }

    // 5. Return JSON success
    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("[Session] Unexpected endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
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

