import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { checkGlobalUsage, incrementGlobalUsage } from "@/services/global-usage.service";
import { ToolLimitStatus } from "@/types/pdf";
import { getAnonymousId } from "@/utils/anonymous-id";

export function useToolLimit() {
  const { user, loading: authLoading } = useAuth();
  const [limitStatus, setLimitStatus] = useState<ToolLimitStatus>({
    count: 0,
    max: 3,
    isLimited: false,
    loading: true,
    tier: "free",
    resetAt: null,
  });

  const refresh = useCallback(async () => {
    const identifier = user ? user.uid : getAnonymousId();
    if (!identifier) {
      setLimitStatus((prev) => ({ ...prev, loading: false }));
      return;
    }

    setLimitStatus((prev) => ({ ...prev, loading: true }));
    try {
      const status = await checkGlobalUsage(identifier);
      setLimitStatus(status);
    } catch (err) {
      console.error("Error refreshing usage limits:", err);
      setLimitStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    let active = true;

    const initLimit = async () => {
      if (authLoading) return;

      const identifier = user ? user.uid : getAnonymousId();
      if (!identifier) {
        if (active) {
          setLimitStatus((prev) => ({ ...prev, loading: false }));
        }
        return;
      }

      if (active) {
        setLimitStatus((prev) => ({ ...prev, loading: true }));
      }
      
      try {
        const status = await checkGlobalUsage(identifier);
        if (active) {
          setLimitStatus(status);
        }
      } catch (err) {
        console.error("Error loading usage limits:", err);
        if (active) {
          setLimitStatus((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    initLimit();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  /**
   * Performs a double-check on limits immediately before action runs.
   * Returns true if within limit (allowed), false if limit exceeded (blocked).
   */
  const checkLimitBeforeAction = useCallback(async (): Promise<boolean> => {
    const identifier = user ? user.uid : getAnonymousId();
    if (!identifier) return false;
    
    try {
      const status = await checkGlobalUsage(identifier);
      setLimitStatus(status);
      return !status.isLimited;
    } catch (error) {
      console.error("Limit check before action failed:", error);
      return false;
    }
  }, [user]);

  /**
   * Logs a tool action usage event and increments usage.
   */
  const recordUsageEvent = useCallback(
    async (
      toolId: string,
      status: "success" | "failed",
      errorMessage?: string | null
    ) => {
      const identifier = user ? user.uid : getAnonymousId();
      if (!identifier) return;
      
      try {
        if (status === "success") {
          await incrementGlobalUsage(identifier, toolId);
        }
        await refresh(); // Refresh local counts after logging
      } catch (error) {
        console.error("Failed to record usage event hook:", error);
      }
    },
    [user, refresh]
  );

  return {
    limitStatus,
    loading: authLoading || limitStatus.loading,
    refresh,
    checkLimit: checkLimitBeforeAction,
    recordUsage: recordUsageEvent,
  };
}

