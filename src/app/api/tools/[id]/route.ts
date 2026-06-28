import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import {
  getMergedToolBySlug,
  updateToolMetadata,
  getToolAuditLogs,
} from "@/services/tool-lifecycle.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const getLogs = searchParams.get("logs") === "true";

    if (getLogs) {
      // 1. Authenticate user to see audit logs (optional, but good practice for internal dashboards)
      const user = await getAuthUser();
      if (!user || !(await isAdmin(user.uid))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const logs = await getToolAuditLogs(id);
      return NextResponse.json({ logs });
    }

    const tool = await getMergedToolBySlug(id);
    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({ tool });
  } catch (error: any) {
    console.error(`GET /api/tools/[id] API error for id:`, error);
    return NextResponse.json({ error: error.message || "Failed to fetch tool detail" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authenticate as Admin
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    // 2. Parse body updates
    const body = await request.json();
    const { reason, ...updates } = body;

    // 3. Update in Firestore & create Audit Log
    const updatedMetadata = await updateToolMetadata(
      id,
      updates,
      user.uid,
      user.email || "admin@utool.in",
      reason || "Manual status update via dashboard"
    );

    return NextResponse.json({
      success: true,
      metadata: updatedMetadata,
    });
  } catch (error: any) {
    console.error(`PATCH /api/tools/[id] API error:`, error);
    return NextResponse.json({ error: error.message || "Failed to update tool metadata" }, { status: 500 });
  }
}
