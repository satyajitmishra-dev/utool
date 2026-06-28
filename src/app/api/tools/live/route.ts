import { NextResponse } from "next/server";
import { getMergedToolRegistry } from "@/services/tool-lifecycle.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allTools = await getMergedToolRegistry();
    const liveTools = allTools.filter((t) => t.status === "Live");

    return NextResponse.json({
      tools: liveTools,
      total: liveTools.length,
    });
  } catch (error: any) {
    console.error("GET /api/tools/live API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch live tools" }, { status: 500 });
  }
}
