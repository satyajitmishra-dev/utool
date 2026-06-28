import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { bulkUpdateToolMetadata } from "@/services/tool-lifecycle.service";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate as Admin
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { ids, updates, reason } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing or invalid 'ids' array parameter." }, { status: 400 });
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Missing or invalid 'updates' object parameter." }, { status: 400 });
    }

    // 3. Perform bulk update
    const result = await bulkUpdateToolMetadata(
      ids,
      updates,
      user.uid,
      user.email || "admin@utool.in",
      reason || `Bulk update of ${ids.length} tools`
    );

    return NextResponse.json({
      success: true,
      count: result.count,
    });
  } catch (error: any) {
    console.error("POST /api/tools/bulk-update API error:", error);
    return NextResponse.json({ error: error.message || "Failed to perform bulk update" }, { status: 500 });
  }
}
