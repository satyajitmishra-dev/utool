import { NextResponse } from "next/server";
import { getMergedToolRegistry } from "@/services/tool-lifecycle.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allTools = await getMergedToolRegistry();

    // 1. KPI Counts
    const total = allTools.length;
    const live = allTools.filter((t) => t.status === "Live").length;
    const inProgress = allTools.filter((t) => t.status === "In Progress").length;
    const testing = allTools.filter((t) => t.status === "Testing").length;
    const broken = allTools.filter((t) => t.status === "Broken").length;
    const planned = allTools.filter((t) => t.status === "Planned").length;
    const beta = allTools.filter((t) => t.status === "Beta").length;
    const deprecated = allTools.filter((t) => t.status === "Deprecated").length;
    const hidden = allTools.filter((t) => t.status === "Hidden").length;

    // 2. Average Completion
    const totalCompletion = allTools.reduce((acc, t) => acc + (t.completion ?? 0), 0);
    const averageCompletion = total > 0 ? Math.round(totalCompletion / total) : 0;

    // 3. Flags and Checklists
    const productionReady = allTools.filter((t) => t.productionReady).length;
    
    // "Needs Backend" = not Live and backend is false
    const needsBackend = allTools.filter((t) => t.status !== "Live" && !t.backend).length;
    // "Needs API" = not Live and api is false
    const needsApi = allTools.filter((t) => t.status !== "Live" && !t.api).length;
    // "Needs Testing" = not Live and tested is false
    const needsTesting = allTools.filter((t) => t.status !== "Live" && !t.tested).length;

    // 4. Category Breakdown
    const categoryStats: Record<string, { total: number; completionSum: number; averageCompletion: number; liveCount: number }> = {};
    allTools.forEach((t) => {
      const cat = t.category || "Other";
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, completionSum: 0, averageCompletion: 0, liveCount: 0 };
      }
      categoryStats[cat].total += 1;
      categoryStats[cat].completionSum += t.completion ?? 0;
      if (t.status === "Live") {
        categoryStats[cat].liveCount += 1;
      }
    });

    Object.keys(categoryStats).forEach((cat) => {
      const stats = categoryStats[cat];
      stats.averageCompletion = stats.total > 0 ? Math.round(stats.completionSum / stats.total) : 0;
    });

    // 5. Recently Updated
    // Filter tools that have lastUpdated and sort descending
    const recentlyUpdated = [...allTools]
      .filter((t) => t.lastUpdated)
      .sort((a, b) => new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime())
      .slice(0, 5)
      .map((t) => ({
        id: t.slug,
        name: t.name,
        category: t.category,
        status: t.status,
        completion: t.completion,
        lastUpdated: t.lastUpdated,
      }));

    return NextResponse.json({
      total,
      live,
      inProgress,
      testing,
      broken,
      planned,
      beta,
      deprecated,
      hidden,
      averageCompletion,
      productionReady,
      needsBackend,
      needsApi,
      needsTesting,
      categoryBreakdown: categoryStats,
      recentlyUpdated,
    });
  } catch (error: any) {
    console.error("GET /api/tools/status API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch tool statistics" }, { status: 500 });
  }
}
