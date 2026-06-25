import { useState, useEffect } from "react";
import { subscribeToUserProfile, UserProfileData } from "@/lib/firebase/dashboard";
import { useAuth } from "@/context/auth-context";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserProfile(
      user.uid,
      (data) => {
        setProfile(data);
        setLoading(false);
        if (data) {
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "dashboard_realtime_profile_sync", { uid: data.uid });
          }
          console.log("[Analytics] dashboard_realtime_profile_sync", { uid: data.uid });
        }
      },
      (err) => {
        console.error("Error in useUserProfile snapshot listener:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Support for optimistic updates on the profile
  const updateProfileOptimistically = (updates: Partial<UserProfileData>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return {
    profile,
    loading,
    error,
    updateProfileOptimistically,
  };
}
