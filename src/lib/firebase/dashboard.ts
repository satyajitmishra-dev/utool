import { db } from "@/config/firebase";
import { doc, onSnapshot, DocumentSnapshot, FirestoreError } from "firebase/firestore";

export interface UserProfileData {
  uid: string;
  name: string | null;
  email: string;
  photoURL: string | null;
  emailVerified: boolean;
  subscriptionTier: "free" | "pro" | "enterprise";
  subscriptionStatus: string;
  planType: string | null;
  createdAt: any;
  updatedAt: any;
  verifiedAt?: any;
  totalLifetimeUsage?: number;
  lastUsedTool?: string;
  lastActiveAt?: any;
  toolUsageCounts?: Record<string, number>;
  dailyUsageDate?: string;
  dailyUsageCount?: number;
}

export interface DailyUsageData {
  date: string;
  count: number;
  tools?: Record<string, number>;
  lastUsedAt?: any;
}

/**
 * Subscribes to real-time changes on the user profile document (users/{uid}).
 */
export function subscribeToUserProfile(
  uid: string,
  onUpdate: (data: UserProfileData | null) => void,
  onError: (error: FirestoreError) => void
) {
  const docRef = doc(db, "users", uid);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate({ uid, ...snapshot.data() } as UserProfileData);
      } else {
        onUpdate(null);
      }
    },
    onError
  );
}

/**
 * Subscribes to real-time changes on the daily usage log (usage_logs/{uid}/daily/{date}).
 */
export function subscribeToDailyUsage(
  uid: string,
  date: string,
  onUpdate: (data: DailyUsageData | null) => void,
  onError: (error: FirestoreError) => void
) {
  const docRef = doc(db, "usage_logs", uid, "daily", date);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate({ date, ...snapshot.data() } as DailyUsageData);
      } else {
        onUpdate(null);
      }
    },
    onError
  );
}
