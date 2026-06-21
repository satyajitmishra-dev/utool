import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * Retrieves and verifies the authenticated user from the session cookie.
 * Returns decoded claims if verified, otherwise null.
 */
export async function getAuthUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;
    if (!sessionCookie) {
      return null;
    }
    
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims as AuthenticatedUser;
  } catch (error) {
    console.warn("Authentication check failed on server:", error);
    return null;
  }
}
