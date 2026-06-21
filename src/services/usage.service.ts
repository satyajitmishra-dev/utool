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
  
  const key = `toolzy_usage_${identifier}`;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const data = JSON.parse(stored) as LocalUsageData;
      if (typeof data.count === "number" && data.resetAt) {
        return data;
      }
    }
  } catch (e) {
    console.warn("Failed to read local usage storage:", e);
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
  const key = `toolzy_usage_${identifier}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write local usage storage:", e);
  }
}

/**
 * Checks the tool usage quota for a user or guest.
 * Pro/Enterprise users have unlimited usage.
 * Free registered users get 3 actions/day.
 * Guests get 1 action/day.
 * 
 * Daily reset is determined based on the resetAt timestamp.
 */
export async function checkUsage(identifier: string): Promise<ToolLimitStatus> {
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

  try {
    // 1. Fetch user subscription tier if registered
    if (!isGuest) {
      const userDocRef = doc(db, "users", identifier);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        tier = userData.subscriptionTier || "free";
      }
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

    // 2. Fetch the aggregate usage document usage_logs/{identifier}
    const logDocRef = doc(db, "usage_logs", identifier);
    const logDocSnap = await getDoc(logDocRef);

    const now = new Date();
    // Default reset date is start of next UTC day (midnight UTC)
    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);

    let count = 0;
    let resetAt = startOfNextDay;

    if (logDocSnap.exists()) {
      const data = logDocSnap.data();
      const dbResetAt = data.resetAt ? (data.resetAt as Timestamp).toDate() : null;

      // If reset time is in the past, reset the daily count
      if (dbResetAt && dbResetAt < now) {
        await resetUsage(identifier);
        count = 0;
        resetAt = startOfNextDay;
      } else {
        count = data.count || 0;
        resetAt = dbResetAt || startOfNextDay;
      }
    } else {
      // Document doesn't exist yet, initialize it
      await setDoc(logDocRef, {
        identifier,
        type: isGuest ? "guest" : "user",
        count: 0,
        lastUsedAt: serverTimestamp(),
        resetAt: Timestamp.fromDate(startOfNextDay),
        toolId: "",
        status: "success",
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
    console.error("Error in checkUsage service:", error);
    
    // Fallback to client-side local storage usage limits check
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
 * Increments the usage count inside usage_logs/{identifier}.
 */
export async function incrementUsage(identifier: string): Promise<void> {
  try {
    const logDocRef = doc(db, "usage_logs", identifier);
    await updateDoc(logDocRef, {
      count: increment(1),
      lastUsedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to increment usage count in Firestore:", error);
    const localData = getLocalUsage(identifier);
    localData.count += 1;
    saveLocalUsage(identifier, localData);
  }
}

/**
 * Logs a tool execution status (success or failure) and updates the usage_logs document.
 * Only successful execution increments the usage count.
 */
export async function logUsage(
  identifier: string,
  toolId: string,
  status: "success" | "failed",
  errorMessage?: string | null
): Promise<void> {
  try {
    const logDocRef = doc(db, "usage_logs", identifier);
    const isGuest = identifier.startsWith("anon_");
    const logDocSnap = await getDoc(logDocRef);

    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);

    const isSuccess = status === "success";

    const updateData: Record<string, any> = {
      identifier,
      type: isGuest ? "guest" : "user",
      toolId,
      status,
      errorMessage: errorMessage || null,
      lastUsedAt: serverTimestamp(),
    };

    if (isSuccess) {
      updateData.count = increment(1);
    }

    if (!logDocSnap.exists()) {
      updateData.count = isSuccess ? 1 : 0;
      updateData.resetAt = Timestamp.fromDate(startOfNextDay);
      await setDoc(logDocRef, updateData);
    } else {
      await updateDoc(logDocRef, updateData);
    }
  } catch (error) {
    console.error("Failed to log usage event in Firestore:", error);
    const isSuccess = status === "success";
    if (isSuccess) {
      const localData = getLocalUsage(identifier);
      localData.count += 1;
      saveLocalUsage(identifier, localData);
    }
  }
}

/**
 * Resets the daily usage count and sets the new resetAt timestamp.
 */
export async function resetUsage(identifier: string): Promise<void> {
  try {
    const logDocRef = doc(db, "usage_logs", identifier);
    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);

    await updateDoc(logDocRef, {
      count: 0,
      resetAt: Timestamp.fromDate(startOfNextDay),
    });
  } catch (error) {
    console.error("Failed to reset daily usage count in Firestore:", error);
    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);
    saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
  }
}
