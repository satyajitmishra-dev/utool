import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function verifySessionServer() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    console.error("[Auth Server] Session verification failed:", error);
    return null;
  }
}

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export async function getAuthUser(): Promise<AuthenticatedUser | null> {
  const decoded = await verifySessionServer();
  if (!decoded) return null;
  return decoded as AuthenticatedUser;
}
