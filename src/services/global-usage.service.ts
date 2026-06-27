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

  // Try API check first
  try {
    const res = await fetch("/api/usage/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.resetAt) {
        data.resetAt = new Date(data.resetAt);
      }
      return data;
    }
  } catch (error) {
    console.warn("Usage API check failed, falling back to local storage limits", error);
  }

  // Local storage fallback
  const isGuest = identifier.startsWith("anon_");
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

/**
 * Increments the global usage count and updates user stats aggregates.
 */
export async function incrementGlobalUsage(
  identifier: string,
  toolId?: string,
  status: "success" | "failed" = "success",
  errorMessage?: string | null
): Promise<void> {
  if (!identifier) return;

  // Try API increment first
  try {
    const res = await fetch("/api/usage/increment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, toolId, status, errorMessage }),
    });
    if (res.ok) {
      // Also update local storage count for offline parity
      const localData = getLocalUsage(identifier);
      localData.count += 1;
      saveLocalUsage(identifier, localData);
      return;
    }
  } catch (error) {
    console.warn("Usage API increment failed, updating local storage only", error);
  }

  // Local storage fallback
  const localData = getLocalUsage(identifier);
  localData.count += 1;
  saveLocalUsage(identifier, localData);
}

/**
 * Resets the daily usage count.
 */
export async function resetUsage(identifier: string): Promise<void> {
  const startOfNextDay = new Date();
  startOfNextDay.setUTCHours(24, 0, 0, 0);
  saveLocalUsage(identifier, { count: 0, resetAt: startOfNextDay.toISOString() });
}
