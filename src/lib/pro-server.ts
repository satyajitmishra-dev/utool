import { getAuthUser } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";

/**
 * Checks if a user is a Pro member on the server.
 * Uses Upstash Redis cache for speed, falling back to Firestore database queries.
 */
export async function checkProStatus(userId: string): Promise<boolean> {
  const cacheKey = `user:tier:${userId}`;

  try {
    const cached = await redis.get<string>(cacheKey);
    if (cached === "pro") return true;
    if (cached === "free") return false;
  } catch (error) {
    console.warn("[Pro Server] Redis cache read failed, falling back to database:", error);
  }

  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      const isPro = data?.subscriptionTier === "pro" && data?.subscriptionStatus === "active";
      
      // Update cache (expiry: 5 minutes)
      try {
        await redis.set(cacheKey, isPro ? "pro" : "free", { ex: 300 });
      } catch (cacheError) {
        console.warn("[Pro Server] Failed to cache user tier to Redis:", cacheError);
      }
      
      return isPro;
    }
  } catch (dbError) {
    console.error("[Pro Server] Firestore user lookup failed:", dbError);
  }

  return false;
}

/**
 * Enforces Pro subscription authorization. Throws an error if unauthorized.
 */
export async function requireProServer(): Promise<void> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const isPro = await checkProStatus(user.uid);
  if (!isPro) {
    throw new Error("Pro subscription required");
  }
}
