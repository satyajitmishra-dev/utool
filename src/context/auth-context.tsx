"use client";

import React, { createContext, useEffect, useState, useRef } from "react";
import {
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { Membership } from "@/types/pro";
import { subscribeToUserProfile } from "@/lib/firebase/dashboard";
import { toast } from "sonner";
import { getAnonymousId } from "@/utils/anonymous-id";
import { safeRedirect } from "@/utils/safe-redirect";


export interface AuthContextType {
  user: FirebaseUser | null;
  id?: string;
  email?: string | null;
  membership: Membership;
  loading: boolean;
  authInitializing: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, name?: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithFacebook: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [membership, setMembership] = useState<Membership>({ plan: "free", active: false });
  const [isAdminState, setIsAdminState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);
  const lastSyncedUid = useRef<string | null | undefined>(undefined);
  const router = useRouter();

  // Listen to Firestore profile changes to sync membership details in real-time
  useEffect(() => {
    if (!user) {
      setMembership({ plan: "free", active: false });
      setIsAdminState(false);
      return;
    }

    const unsubscribe = subscribeToUserProfile(
      user.uid,
      (profileData) => {
        const isEmailAdmin = user.email?.toLowerCase().trim() === "satyajitmishra1412@gmail.com";
        const isProfileAdmin = 
          (profileData as any)?.role === "admin" || 
          (profileData as any)?.subscriptionTier === "admin";
        setIsAdminState(isEmailAdmin || isProfileAdmin);

        if (profileData) {
          setMembership({
            plan: profileData.subscriptionTier === "pro" ? "pro" : "free",
            active: profileData.subscriptionStatus === "active",
            expiresAt: profileData.createdAt ? new Date(profileData.createdAt) : null,
          });
        } else {
          setMembership({ plan: "free", active: false });
        }
      },
      (err) => {
        console.error("[Auth Context] Firestore sync error:", err);
      }
    );

    return () => unsubscribe();
  }, [user]);


  const syncSessionCookie = async (firebaseUser: FirebaseUser | null) => {
    try {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken(true);
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to sync session cookie:", errorText);
        }
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
      }
    } catch (error) {
      console.error("Auth state synchronization error", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          if (lastSyncedUid.current !== firebaseUser.uid) {
            lastSyncedUid.current = firebaseUser.uid;
            await syncSessionCookie(firebaseUser);
          }
        } else {
          setUser(null);
          if (lastSyncedUid.current !== null) {
            lastSyncedUid.current = null;
            await syncSessionCookie(null);
          }
        }
      } catch (error) {
        console.error("Auth state logic error", error);
      } finally {
        setAuthInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const credential = await getRedirectResult(auth);
        if (credential?.user) {
          console.log("[Auth] Successfully signed in via redirect:", credential.user.uid);
          
          // 1. Sync session cookie
          lastSyncedUid.current = credential.user.uid;
          await syncSessionCookie(credential.user);
          
          // 2. Perform guest merge if guestId exists
          const guestId = getAnonymousId();
          if (guestId) {
            try {
              await fetch("/api/auth/merge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ guestId, userId: credential.user.uid }),
              });
              console.log("[Auth] Merged guest ID with redirect user");
            } catch (mergeErr) {
              console.error("[Auth] Failed to merge guest history after redirect:", mergeErr);
            }
          }

          toast.success("Welcome back to Utool.");

          // 3. Redirect to the destination page if specified in the query parameters
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const redirectParam = params.get("redirect");
            const destination = safeRedirect(redirectParam);
            router.push(destination);
          }
        }
      } catch (error: any) {
        console.error("[Auth] Redirect sign-in error:", error);
        toast.error(error.message || "Failed to sign in with Google.");
      }
    };
    handleRedirect();
  }, [router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      lastSyncedUid.current = credential.user.uid;
      await syncSessionCookie(credential.user);
      return credential;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }

      // Automatically send verification email
      try {
        await sendEmailVerification(credential.user);
        console.log("[Auth] Automatic signup verification email sent.");
      } catch (err) {
        console.error("[Auth] Failed to send verification email on signup:", err);
      }

      const now = new Date();
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: name || null,
        email: credential.user.email,
        photoURL: null,
        emailVerified: false,
        subscriptionTier: "free",
        subscriptionStatus: "none",
        planType: null,
        createdAt: now,
        updatedAt: now,
        totalLifetimeUsage: 0,
        toolUsageCounts: {},
        lastUsedTool: "None",
        lastActiveAt: now,
      });

      lastSyncedUid.current = credential.user.uid;
      await syncSessionCookie(credential.user);
      return credential;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const isMobile = typeof window !== "undefined" && 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      setLoading(true);
      await signInWithRedirect(auth, provider);
      return new Promise<never>(() => {});
    }

    try {
      setLoading(true);
      const credential = await signInWithPopup(auth, provider);
      lastSyncedUid.current = credential.user.uid;
      await syncSessionCookie(credential.user);
      return credential;
    } catch (error: any) {
      console.error("[Auth] Google popup sign-in failed:", error);
      if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
        console.log("[Auth] Popup blocked or cancelled, falling back to redirect...");
        await signInWithRedirect(auth, provider);
        return new Promise<never>(() => {});
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();

    const isMobile = typeof window !== "undefined" && 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      setLoading(true);
      await signInWithRedirect(auth, provider);
      return new Promise<never>(() => {});
    }

    try {
      setLoading(true);
      const credential = await signInWithPopup(auth, provider);
      lastSyncedUid.current = credential.user.uid;
      await syncSessionCookie(credential.user);
      return credential;
    } catch (error: any) {
      console.error("[Auth] Facebook popup sign-in failed:", error);
      if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
        console.log("[Auth] Popup blocked or cancelled, falling back to redirect...");
        await signInWithRedirect(auth, provider);
        return new Promise<never>(() => {});
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // 1. Clear session cookie via API
      lastSyncedUid.current = null;
      await fetch("/api/auth/logout", { method: "POST" });
      
      // 2. Clear Firebase auth
      await firebaseSignOut(auth);
      
      // 3. Clear local state
      setUser(null);
      setIsAdminState(false);
      
      // 4. Redirect home
      router.push("/");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        id: user?.uid,
        email: user?.email,
        membership,
        loading,
        authInitializing,
        login,
        signUp,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        resetPassword,
        isAdmin: isAdminState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth } from "@/hooks/use-auth";
