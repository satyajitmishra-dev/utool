import { useUserProfile } from "./useUserProfile";
import { useUsageStats } from "./useUsageStats";

export function useRealtimeDashboard() {
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const { stats, loading: statsLoading, error: statsError } = useUsageStats();

  const loading = profileLoading || statsLoading;
  const error = profileError || statsError;

  return {
    profile,
    stats,
    loading,
    error,
  };
}
