"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper function to sync session cookie synchronously
  const syncSessionCookie = async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken(true);
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to sync session cookie with server:", errorData.error || res.statusText, "Details:", errorData.details, "Code:", errorData.code);
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
          // Clear session cookie
          await fetch("/api/auth/session", { method: "DELETE" });
        }
      } catch (error) {
        console.error("Auth state logic error", error);
      } finally {
        setLoading(false);
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

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await syncSessionCookie(credential.user);
    return credential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const credential = await signInWithPopup(auth, provider);
      setLoading(true);
      await syncSessionCookie(credential.user);
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      setUser(null);
      router.push("/login");
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
