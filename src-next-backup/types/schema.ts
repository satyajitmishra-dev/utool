export type SubscriptionTier = "free" | "pro" | "enterprise";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "none" | "created";

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: unknown; // Firestore Timestamp / Date
  updatedAt: unknown; // Firestore Timestamp / Date
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionId: string | null; // References razorpaySubscriptionId or orders
  credits: number;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionDocument {
  id: string; // Razorpay Subscription/Order ID or Doc ID
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  razorpaySubscriptionId?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  currentPeriodStart: unknown; // Firestore Timestamp
  currentPeriodEnd: unknown;   // Firestore Timestamp
  createdAt: unknown;          // Firestore Timestamp
  updatedAt: unknown;          // Firestore Timestamp
}

export interface ToolDocument {
  id: string; // e.g., 'image-compressor', 'pdf-merger'
  name: string;
  description: string;
  category: string;
  status: "active" | "beta" | "maintenance";
  creditCost: number;
  isPremium: boolean;
  createdAt: unknown;
}

export interface UsageLogDocument {
  id: string;
  userId: string;
  toolId: string;
  creditsUsed: number;
  status: "success" | "failed";
  errorMessage: string | null;
  timestamp: unknown; // Firestore Timestamp
  metadata?: Record<string, unknown>;
}
