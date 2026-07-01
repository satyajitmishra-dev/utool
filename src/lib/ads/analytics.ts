import { db } from "@/config/firebase";
import { collection, addDoc, getDocs, query, where, limit, Timestamp } from "firebase/firestore";
import { AdEventLog, AdProviderType, AdAnalyticsSummary } from "./types";

/**
 * Logs an ad lifecycle event to Firestore (async) and pushes to Google Analytics (gtag).
 */
export async function logAdEvent(event: Omit<AdEventLog, "id" | "timestamp">): Promise<void> {
  const timestamp = Date.now();
  const id = `evt-${Math.random().toString(36).substring(2, 11)}-${timestamp}`;
  const fullEvent: AdEventLog = { id, timestamp, ...event };

  // 1. Log to console in debug/development mode
  if (typeof window !== "undefined" && (window as any).__UTOOL_AD_DEBUG__) {
    console.log(`[Ad Analytics Debug] [${event.eventType.toUpperCase()}] Placement: ${event.placementId}, Provider: ${event.provider}, Device: ${event.device}, Network: ${event.networkSpeed}`);
  }

  // 2. Safely push to Google Analytics if initialized
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", `ad_${event.eventType}`, {
      event_category: "monetization",
      event_label: event.placementId,
      ad_provider: event.provider,
      device_type: event.device,
      network_speed: event.networkSpeed,
      value: event.eventType === "clicked" ? 1 : 0,
    });
  }

  // 3. Write to Firestore `ad_events` collection
  if (typeof window !== "undefined") {
    try {
      const colRef = collection(db, "ad_events");
      await addDoc(colRef, {
        ...fullEvent,
        timestamp: Timestamp.fromMillis(timestamp), // Use Firestore timestamp
      });
    } catch (err) {
      // Degrade gracefully without impacting the user
      console.warn("[Ad Analytics Service] Failed to log ad event to database:", err);
    }
  }
}

/**
 * Fetches real-time historical ad analytics summaries from Firestore event logs.
 */
export async function fetchAdAnalyticsSummary(): Promise<AdAnalyticsSummary> {
  if (typeof window === "undefined") {
    return getEmptyAnalyticsSummary();
  }

  try {
    const colRef = collection(db, "ad_events");
    // Fetch last 1000 events to compute live stats (caps read costs)
    const q = query(colRef, limit(1000));
    const querySnapshot = await getDocs(q);
    
    // Convert documents to log objects
    const logs: AdEventLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push(doc.data() as AdEventLog);
    });

    const history: AdAnalyticsSummary["history"] = [];
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalRequested = 0;
    let totalFilled = 0;

    // Group logs by date for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Filter events matching this date
      const dailyLogs = logs.filter((log) => {
        let logDate: Date;
        if (log.timestamp && typeof (log.timestamp as any).toDate === "function") {
          logDate = (log.timestamp as any).toDate();
        } else if (log.timestamp && (log.timestamp as any).seconds) {
          logDate = new Date((log.timestamp as any).seconds * 1000);
        } else if (log.timestamp) {
          logDate = new Date(log.timestamp as any);
        } else {
          return false;
        }
        try {
          const logDateStr = logDate.toISOString().split("T")[0];
          return logDateStr === dateStr;
        } catch {
          return false;
        }
      });

      let dailyImps = 0;
      let dailyClicks = 0;
      let dailyRequested = 0;
      let dailyFilled = 0;

      dailyLogs.forEach((log) => {
        if (log.eventType === "visible" || log.eventType === "loaded") dailyImps++;
        if (log.eventType === "clicked") dailyClicks++;
        if (log.eventType === "requested") dailyRequested++;
        if (log.eventType === "filled") dailyFilled++;
      });

      // Assume $0.15 average CPC for UTool
      const dailyRev = dailyClicks * 0.15;

      history.push({
        date: dateStr,
        impressions: dailyImps,
        clicks: dailyClicks,
        revenue: parseFloat(dailyRev.toFixed(2)),
      });

      totalImpressions += dailyImps;
      totalClicks += dailyClicks;
      totalRequested += dailyRequested;
      totalFilled += dailyFilled;
    }

    const ctr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const fillRate = totalRequested > 0 ? totalFilled / totalRequested : 0;
    const estimatedEarnings = totalClicks * 0.15;
    const rpm = totalImpressions > 0 ? (estimatedEarnings / totalImpressions) * 1000 : 0;

    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      ctr,
      fillRate,
      rpm,
      estimatedEarnings: parseFloat(estimatedEarnings.toFixed(2)),
      history,
    };
  } catch (err: any) {
    if (err?.code === "permission-denied" || err?.message?.toLowerCase().includes("permission")) {
      console.warn("[Ad System] Firestore read permission denied for ad analytics logs. Operating in local-only empty data fallback.");
    } else {
      console.error("[Ad Analytics Service] Error querying analytics logs:", err);
    }
    return getEmptyAnalyticsSummary();
  }
}

/**
 * Returns empty analytics summary with zero metrics for default fallback
 */
function getEmptyAnalyticsSummary(): AdAnalyticsSummary {
  const history = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    history.push({
      date: dateStr,
      impressions: 0,
      clicks: 0,
      revenue: 0,
    });
  }

  return {
    impressions: 0,
    clicks: 0,
    ctr: 0,
    fillRate: 0,
    rpm: 0,
    estimatedEarnings: 0,
    history,
  };
}

