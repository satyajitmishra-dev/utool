"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useUserProfile } from "@/hooks/useUserProfile";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { updateProfile, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Mail,
  Shield,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync profile name to input
  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    } else if (user?.displayName) {
      setName(user.displayName);
    }
  }, [profile, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsSavingProfile(true);
    try {
      // 1. Update Firebase Auth Display Name
      await updateProfile(user, { displayName: name.trim() });

      // 2. Update Firestore User Document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: name.trim(),
        updatedAt: new Date(),
      });

      // 3. Force token refresh to update the global auth context state
      await auth.currentUser?.reload();
      await auth.currentUser?.getIdToken(true);

      toast.success("Profile details updated successfully!");
    } catch (err: any) {
      console.error("[Settings] Profile update failed:", err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success(`Password reset link sent to ${user.email}`);
    } catch (err: any) {
      console.error("[Settings] Password reset email failed:", err);
      toast.error(err.message || "Failed to send password reset email.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "WARNING: This action is permanent and cannot be undone. Are you sure you want to delete your Utool account? All your settings and logs will be permanently deleted."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      // 1. Delete Firestore user document
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);

      // 2. Delete Auth User account
      await deleteUser(user);

      toast.success("Your Utool account was deleted successfully.");
      router.push("/");
    } catch (err: any) {
      console.error("[Settings] Account deletion failed:", err);
      if (err.code === "auth/requires-recent-login") {
        toast.error("For security, you must log out and sign back in to delete your account.");
      } else {
        toast.error(err.message || "Failed to delete account.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-h1 text-foreground font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-body-s text-muted-foreground mt-1">
          Manage your personal details, security settings, and interface preferences.
        </p>
      </div>

      {profileLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Decrypting settings configuration...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Controls Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <GlassCard hover={false} className="p-6">
              <h2 className="text-h3 text-foreground font-bold flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-body-s font-medium text-muted-foreground block">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 bg-muted/50 border border-border px-4 py-3 rounded-xl text-muted-foreground text-sm cursor-not-allowed select-none">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{user?.email}</span>
                  </div>
                  <span className="text-3xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3 text-success" />
                    Primary login credential (read-only)
                  </span>
                </div>

                <div className="space-y-2">
                  <label htmlFor="display-name" className="text-body-s font-medium text-muted-foreground block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="display-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="block w-full rounded-xl border border-border bg-card text-foreground px-4 py-3 text-sm placeholder-muted-foreground/60 shadow-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSavingProfile}
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Details
                  </Button>
                </div>
              </form>
            </GlassCard>

            {/* Password & Security */}
            <GlassCard hover={false} className="p-6">
              <h2 className="text-h3 text-foreground font-bold flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-primary" />
                Password & Security
              </h2>
              <div className="space-y-4">
                <p className="text-body-s text-muted-foreground leading-relaxed">
                  To reset or change your account password, request a secure verification link to be sent to your email.
                </p>
                <Button
                  variant="outline"
                  onClick={handleSendPasswordReset}
                  loading={isSendingReset}
                  className="rounded-xl"
                >
                  Request Password Reset Email
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Preferences Column */}
          <div className="space-y-6">
            {/* System Preferences */}
            <GlassCard hover={false} className="p-6">
              <h2 className="text-h3 text-foreground font-bold flex items-center gap-2 mb-6">
                <Sun className="h-5 w-5 text-primary animate-spin-slow" />
                System Interface Theme
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                    theme === "light"
                      ? "bg-primary/5 text-primary border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs font-semibold">Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                    theme === "dark"
                      ? "bg-primary/5 text-primary border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs font-semibold">Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                    theme === "system"
                      ? "bg-primary/5 text-primary border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-xs font-semibold">System</span>
                </button>
              </div>
            </GlassCard>

            {/* Danger Zone */}
            <GlassCard hover={false} className="p-6 border-error/30 bg-error/5">
              <h2 className="text-h3 text-error font-bold flex items-center gap-2 mb-6">
                <AlertTriangle className="h-5 w-5 text-error" />
                Danger Zone
              </h2>
              <div className="space-y-4">
                <p className="text-body-s text-muted-foreground leading-relaxed">
                  Permanently delete your account and all associated dashboard history and tool transactions.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  loading={isDeleting}
                  className="rounded-xl flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
