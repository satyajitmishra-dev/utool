"use client";

import React, { createContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  authInitializing: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, name?: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);
  const router = useRouter();

  const syncSessionCookie = async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken(true);
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        console.error("Failed to sync session cookie");
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
          await syncSessionCookie(firebaseUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state logic error", error);
      } finally {
        setAuthInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
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
      });

      await syncSessionCookie(credential.user);
      return credential;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const credential = await signInWithPopup(auth, provider);
      await syncSessionCookie(credential.user);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // 1. Clear session cookie via API
      await fetch("/api/auth/logout", { method: "POST" });
      
      // 2. Clear Firebase auth
      await firebaseSignOut(auth);
      
      // 3. Clear local state
      setUser(null);
      
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
        loading,
        authInitializing,
        login,
        signUp,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth } from "@/hooks/use-auth";
