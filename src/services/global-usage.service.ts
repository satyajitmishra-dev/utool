import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  runTransaction,
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

  const key = `utool_global_usage_${identifier}`;
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
  } catch (e) { }
  return defaultData;
}

function saveLocalUsage(identifier: string, data: LocalUsageData) {
  if (typeof window === "undefined") return;
  const key = `utool_global_usage_${identifier}`;
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
    // Fetch user document from users/{uid}
    const userDocRef = doc(db, "users", identifier);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      return {
        count: 0,
        max: LIMIT_FREE_USER,
        isLimited: false,
        loading: false,
        tier: "free",
        resetAt: null,
      };
    }

    const userData = userDocSnap.data();
    tier = userData.subscriptionTier || "free";

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

    const dateStr = new Date().toISOString().split("T")[0];
    const dailyUsageDate = userData.dailyUsageDate || "";
    
    let count = 0;
    if (dailyUsageDate === dateStr) {
      count = userData.dailyUsageCount || 0;
    }

    const max = LIMIT_FREE_USER;
    const startOfNextDay = new Date();
    startOfNextDay.setUTCHours(24, 0, 0, 0);

    return {
      count,
      max,
      isLimited: count >= max,
      loading: false,
      tier,
      resetAt: startOfNextDay,
    };
  } catch (error) {
    console.warn("Firestore user document query failed, falling back to localStorage limits.", error);

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

    const max = LIMIT_FREE_USER;

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
 * Increments the global usage count and updates user stats aggregates atomically on the users/{uid} document.
 */
export async function incrementGlobalUsage(identifier: string, toolId?: string): Promise<void> {
  if (identifier.startsWith("anon_")) {
    const localData = getLocalUsage(identifier);
    localData.count += 1;
    saveLocalUsage(identifier, localData);
    return;
  }

  try {
    const userRef = doc(db, "users", identifier);
    const dateStr = new Date().toISOString().split("T")[0];

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error(`User document ${identifier} does not exist`);
      }

      const userData = userSnap.data();
      const dailyUsageDate = userData.dailyUsageDate || "";
      const currentDailyCount = dailyUsageDate === dateStr ? (userData.dailyUsageCount || 0) : 0;

      // Update aggregate fields on users/{uid}
      const userUpdate: Record<string, any> = {
        totalLifetimeUsage: increment(1),
        dailyUsageDate: dateStr,
        dailyUsageCount: currentDailyCount + 1,
        lastActiveAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (toolId) {
        userUpdate.lastUsedTool = toolId;
        userUpdate[`toolUsageCounts.${toolId}`] = increment(1);
      }

      transaction.update(userRef, userUpdate);
    });
  } catch (error) {
    console.warn("Failed to atomically increment usage log, falling back to local limit increment.", error);
    const localData = getLocalUsage(identifier);
    localData.count += 1;
    saveLocalUsage(identifier, localData);
  }
}

/**
 * Resets the daily usage count on the users/{uid} document.
 */
export async function resetUsage(identifier: string): Promise<void> {
  const startOfNextDay = new Date();
  startOfNextDay.setUTCHours(24, 0, 0, 0);

  if (identifier.startsWith("anon_")) {
    saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
    return;
  }

  try {
    const userRef = doc(db, "users", identifier);
    await updateDoc(userRef, {
      dailyUsageCount: 0,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Failed to reset Firestore usage log, falling back to local reset.", error);
    saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
  }
}
