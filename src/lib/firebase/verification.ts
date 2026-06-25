import { auth, db } from "@/config/firebase";
import { sendEmailVerification, User } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Sends a Firebase verification email to the currently logged in user.
 */
export async function sendUserEmailVerification(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No authenticated user found.");
  }
  await sendEmailVerification(currentUser);
}

/**
 * Reloads the current user's authentication state to refresh claims like emailVerified.
 */
export async function reloadUserAuth(): Promise<User | null> {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await currentUser.reload();
    return auth.currentUser;
  }
  return null;
}

/**
 * Synchronizes the verified state to the user's Firestore document.
 */
export async function syncVerificationToFirestore(uid: string): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    emailVerified: true,
    verifiedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Syncs the client-side Firebase session cookie after verification status changes.
 */
export async function syncVerificationSessionCookie(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  // Force refreshing the token to ensure the emailVerified claim is set
  const idToken = await currentUser.getIdToken(true);

  // Synchronize token to next.js session cookie
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to synchronize session cookie.");
  }
}
