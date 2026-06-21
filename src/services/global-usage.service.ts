import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { ToolLimitStatus } from "@/types/pdf";

const LIMIT_GUEST = 1;
const LIMIT_FREE_USER = 3;

interface LocalUsageData {
  count: number;
  resetAt: string; // ISO string
}

function getLocalUsage(identifier: string): LocalUsageData {
  if (typeof window === "undefined") {
    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);
    return { count: 0, resetAt: startOfNextDay.toISOString() };
  }

  const key = `toolzy_global_usage_${identifier}`;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const data = JSON.parse(stored) as LocalUsageData;
      if (typeof data.count === "number" && data.resetAt) {
        return data;
      }
    }
  } catch (e) {
    console.warn("Failed to read local global usage storage:", e);
  }

  const startOfNextDay = new Date();
  startOfNextDay.setUTCHours(24, 0, 0, 0);
  const defaultData = { count: 0, resetAt: startOfNextDay.toISOString() };
  try {
    localStorage.setItem(key, JSON.stringify(defaultData));
  } catch (e) {}
  return defaultData;
}

function saveLocalUsage(identifier: string, data: LocalUsageData) {
  if (typeof window === "undefined") return;
  const key = `toolzy_global_usage_${identifier}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write local global usage storage:", e);
  }
}

/**
 * Checks global tool usage limits.
 * Authenticated Pro/Enterprise: Infinity
 * Authenticated Free: 3/day
 * Guest (anon_*): 1/day
 */
export async function checkGlobalUsage(identifier: string): Promise<ToolLimitStatus> {
  if (!identifier) {
    return {
      count: 0,
      max: LIMIT_GUEST,
      isLimited: false,
      loading: false,
      tier: "free",
      resetAt: null,
    };
  }

  const isGuest = identifier.startsWith("anon_");
  let tier: "free" | "pro" | "enterprise" = "free";

  // If it's a guest, use local storage immediately to avoid unnecessary Firestore writes and permission errors
  if (isGuest) {
    const localData = getLocalUsage(identifier);
    const now = new Date();
    const localResetDate = new Date(localData.resetAt);

    let count = localData.count;
    let resetAt = localResetDate;

    if (localResetDate < now) {
      const startOfNextDay = new Date();
      startOfNextDay.setUTCHours(24, 0, 0, 0);
      count = 0;
      resetAt = startOfNextDay;
      saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
    }

    return {
      count,
      max: LIMIT_GUEST,
      isLimited: count >= LIMIT_GUEST,
      loading: false,
      tier: "free",
      resetAt,
    };
  }

  try {
    // 1. Fetch user subscription tier if registered
    const userDocRef = doc(db, "users", identifier);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      tier = userData.subscriptionTier || "free";
    }

    // Pro and Enterprise users have unlimited access
    if (tier === "pro" || tier === "enterprise") {
      return {
        count: 0,
        max: Infinity,
        isLimited: false,
        loading: false,
        tier,
      };
    }

    // 2. Fetch or create usage_logs/{identifier} aggregate log document
    const logDocRef = doc(db, "usage_logs", identifier);
    const logDocSnap = await getDoc(logDocRef);

    const now = new Date();
    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);

    let count = 0;
    let resetAt = startOfNextDay;

    if (logDocSnap.exists()) {
      const data = logDocSnap.data();
      const dbResetAt = data.resetAt ? (data.resetAt as Timestamp).toDate() : null;

      // If the reset date has passed, reset the count
      if (dbResetAt && dbResetAt < now) {
        await resetUsage(identifier);
        count = 0;
        resetAt = startOfNextDay;
      } else {
        count = data.count || 0;
        resetAt = dbResetAt || startOfNextDay;
      }
    } else {
      // Create empty record
      await setDoc(logDocRef, {
        identifier,
        type: isGuest ? "guest" : "user",
        count: 0,
        lastUsedAt: serverTimestamp(),
        resetAt: Timestamp.fromDate(startOfNextDay),
      });
    }

    const max = isGuest ? LIMIT_GUEST : LIMIT_FREE_USER;

    return {
      count,
      max,
      isLimited: count >= max,
      loading: false,
      tier,
      resetAt,
    };
  } catch (error) {
    console.warn("Firestore usage log query offline/unconfigured, falling back to client-side localStorage limits.", error);

    // Local storage fallback
    const localData = getLocalUsage(identifier);
    const now = new Date();
    const localResetDate = new Date(localData.resetAt);

    let count = localData.count;
    let resetAt = localResetDate;

    if (localResetDate < now) {
      const startOfNextDay = new Date();
      startOfNextDay.setUTCHours(24, 0, 0, 0);
      count = 0;
      resetAt = startOfNextDay;
      saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
    }

    const max = isGuest ? LIMIT_GUEST : LIMIT_FREE_USER;

    return {
      count,
      max,
      isLimited: count >= max,
      loading: false,
      tier: "free",
      resetAt,
    };
  }
}

/**
 * Increments the global usage count.
 */
export async function incrementGlobalUsage(identifier: string): Promise<void> {
  if (identifier.startsWith("anon_")) {
    const localData = getLocalUsage(identifier);
    localData.count += 1;
    saveLocalUsage(identifier, localData);
    return;
  }

  try {
    const logDocRef = doc(db, "usage_logs", identifier);
    await updateDoc(logDocRef, {
      count: increment(1),
      lastUsedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Failed to increment Firestore usage log, falling back to local limit increment.");
    const localData = getLocalUsage(identifier);
    localData.count += 1;
    saveLocalUsage(identifier, localData);
  }
}

/**
 * Resets the daily usage count and updates resetAt timestamp.
 */
export async function resetUsage(identifier: string): Promise<void> {
  const startOfNextDay = new Date();
  startOfNextDay.setUTCHours(24, 0, 0, 0);

  if (identifier.startsWith("anon_")) {
    saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
    return;
  }

  try {
    const logDocRef = doc(db, "usage_logs", identifier);

    await updateDoc(logDocRef, {
      count: 0,
      resetAt: Timestamp.fromDate(startOfNextDay),
    });
  } catch (error) {
    console.warn("Failed to reset Firestore usage log, falling back to local reset.");
    saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
  }
}
