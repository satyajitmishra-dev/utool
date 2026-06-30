import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Fetch all users for in-memory aggregation (supports exact counting and groups)
    const usersSnap = await adminDb.collection("users").get();
    const totalUsers = usersSnap.size;

    let freeCount = 0;
    let proCount = 0;
    let entCount = 0;
    let suspendedCount = 0;
    let newUsersToday = 0;
    let activeToday = 0;
    let active30d = 0;
    let totalStorageBytes = 0;

    const countriesMap: Record<string, number> = {};

    usersSnap.docs.forEach((doc) => {
      const data = doc.data();
      const tier = data.subscriptionTier || "free";
      const status = data.status || "active";
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now());
      const lastActiveAt = data.lastActiveAt?.toDate?.() || new Date(data.lastActiveAt || Date.now());
      const storage = data.storageUsedBytes || 0;
      const country = data.country || "US";

      if (tier === "pro") proCount++;
      else if (tier === "enterprise") entCount++;
      else freeCount++;

      if (status === "suspended") suspendedCount++;

      if (createdAt >= oneDayAgo) newUsersToday++;
      if (lastActiveAt >= oneDayAgo) activeToday++;
      if (lastActiveAt >= thirtyDaysAgo) active30d++;

      totalStorageBytes += storage;
      countriesMap[country] = (countriesMap[country] || 0) + 1;
    });

    const topCountries = Object.entries(countriesMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 2. Fetch invoices for revenue calculations
    const invoicesSnap = await adminDb.collection("invoices").get();
    let totalRevenueCents = 0;
    invoicesSnap.docs.forEach((doc) => {
      const d = doc.data();
      if (d.status === "paid") {
        totalRevenueCents += d.amount || 0;
      }
    });

    // 3. Fetch transactions for usage tracking
    const txSnap = await adminDb
      .collection("usage_transactions")
      .where("timestamp", ">=", thirtyDaysAgo)
      .get();

    let creditsToday = 0;
    let aiRequestsToday = 0;
    let apiRequestsToday = 0;
    const toolsMap: Record<string, { count: number; name: string }> = {};

    txSnap.docs.forEach((doc) => {
      const d = doc.data();
      const ts = d.timestamp?.toDate?.() || new Date(d.timestamp || Date.now());
      const toolId = d.toolId || "unknown";
      const toolName = d.toolName || "Unknown Tool";
      const credits = d.creditsUsed || 0;

      if (ts >= oneDayAgo) {
        creditsToday += credits;
        if (toolId.includes("ai-") || toolId.includes("writer") || toolId.includes("summarizer")) {
          aiRequestsToday++;
        }
        apiRequestsToday++;
      }

      if (!toolsMap[toolId]) {
        toolsMap[toolId] = { count: 0, name: toolName };
      }
      toolsMap[toolId].count++;
    });

    const topTools = Object.entries(toolsMap)
      .map(([id, t]) => ({ id, name: t.name, count: t.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Generate user growth timeline (last 30 days)
    const growthTimeline: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      growthTimeline[dateStr] = 0;
    }

    usersSnap.docs.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now());
      const dateStr = createdAt.toISOString().split("T")[0];
      if (growthTimeline[dateStr] !== undefined) {
        growthTimeline[dateStr]++;
      }
    });

    // Accumulate timeline
    let cumulative = totalUsers - Object.values(growthTimeline).reduce((a, b) => a + b, 0);
    const growthChartData = Object.entries(growthTimeline).map(([date, count]) => {
      cumulative += count;
      return { date, count: cumulative };
    });

    // Conversion funnel rates
    // Guest (visited marketplace) -> Registered (free) -> Paid (pro/ent)
    const conversionFunnel = [
      { name: "Marketplace Visitors", count: totalUsers * 4 },
      { name: "Registered (Free Users)", count: freeCount },
      { name: "Premium Subscribers", count: proCount + entCount }
    ];

    const conversionRate = totalUsers > 0 ? parseFloat(((proCount + entCount) / totalUsers * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        freeUsers: freeCount,
        proUsers: proCount,
        enterpriseUsers: entCount,
        suspendedUsers: suspendedCount,
        newUsersToday,
        activeUsersToday: activeToday,
        monthlyActiveUsers: active30d,
        storageUsedBytes: totalStorageBytes,
        creditsConsumedToday: creditsToday,
        aiRequestsToday,
        apiRequestsToday,
        revenueSummary: parseFloat((totalRevenueCents / 100).toFixed(2)),
        conversionRate,
        topCountries,
        topTools,
      },
      charts: {
        growthChartData,
        conversionFunnel,
      }
    });
  } catch (error: any) {
    console.error("GET analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
