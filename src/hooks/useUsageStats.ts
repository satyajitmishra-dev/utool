import { useMemo } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

export function useUsageStats() {
  const { profile, loading, error } = useUserProfile();

  // Derive date string in UTC YYYY-MM-DD
  const dateStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  // Derived stats memoized to prevent unnecessary re-renders
  const mostUsedTool = useMemo(() => {
    const counts = profile?.toolUsageCounts;
    if (!counts || Object.keys(counts).length === 0) return "None";
    let maxTool = "None";
    let maxVal = 0;
    for (const [tool, count] of Object.entries(counts)) {
      if (count > maxVal) {
        maxVal = count;
        maxTool = tool;
      }
    }
    return maxTool;
  }, [profile?.toolUsageCounts]);

  const limitInfo = useMemo(() => {
    const tier = profile?.subscriptionTier || "free";
    // Check if daily count is for today
    const dailyCount = profile?.dailyUsageDate === dateStr ? (profile?.dailyUsageCount || 0) : 0;
    const max = tier === "pro" || tier === "enterprise" ? Infinity : 3;
    return {
      dailyCount,
      max,
      remaining: max === Infinity ? Infinity : Math.max(0, max - dailyCount),
      isLimited: dailyCount >= max,
    };
  }, [profile?.subscriptionTier, profile?.dailyUsageDate, profile?.dailyUsageCount, dateStr]);

  const stats = useMemo(() => {
    return {
      dailyCount: limitInfo.dailyCount,
      remainingLimits: limitInfo.remaining,
      isLimited: limitInfo.isLimited,
      totalLifetimeUsage: profile?.totalLifetimeUsage || 0,
      mostUsedTool,
      lastUsedTool: profile?.lastUsedTool || "None",
      lastActiveAt: profile?.lastActiveAt || null,
    };
  }, [limitInfo, profile?.totalLifetimeUsage, mostUsedTool, profile?.lastUsedTool, profile?.lastActiveAt]);

  return {
    stats,
    loading,
    error,
  };
}
