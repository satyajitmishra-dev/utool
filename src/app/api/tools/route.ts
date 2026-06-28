import { NextRequest, NextResponse } from "next/server";
import { getMergedToolRegistry } from "@/services/tool-lifecycle.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const minCompletionStr = searchParams.get("minCompletion");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Get merged tools registry
    let tools = await getMergedToolRegistry();

    // 1. Filtering
    if (search) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q)
      );
    }

    if (category && category.toLowerCase() !== "all") {
      const cat = category.toLowerCase();
      tools = tools.filter((t) => t.category.toLowerCase() === cat);
    }

    if (status && status.toLowerCase() !== "all") {
      const s = status.toLowerCase();
      tools = tools.filter((t) => t.status?.toLowerCase() === s);
    }

    if (minCompletionStr !== null && minCompletionStr !== undefined) {
      const minComp = parseInt(minCompletionStr, 10);
      if (!isNaN(minComp)) {
        tools = tools.filter((t) => (t.completion ?? 0) >= minComp);
      }
    }

    // 2. Sorting
    const priorityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    tools.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Clean default / missing values
      if (sortBy === "completion") {
        valA = a.completion ?? 0;
        valB = b.completion ?? 0;
      } else if (sortBy === "lastUpdated") {
        valA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        valB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      } else if (sortBy === "priority") {
        valA = priorityWeight[a.priority as keyof typeof priorityWeight] ?? 0;
        valB = priorityWeight[b.priority as keyof typeof priorityWeight] ?? 0;
      } else {
        valA = (valA ?? "").toString().toLowerCase();
        valB = (valB ?? "").toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // 3. Pagination
    const total = tools.length;
    const startIndex = (page - 1) * limit;
    const paginatedTools = tools.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      tools: paginatedTools,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    console.error("GET /api/tools API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch tools" }, { status: 500 });
  }
}
