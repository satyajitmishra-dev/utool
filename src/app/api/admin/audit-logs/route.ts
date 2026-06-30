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

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const lastId = url.searchParams.get("lastId") || "";
    const action = url.searchParams.get("action") || "";
    const adminEmail = url.searchParams.get("adminEmail") || "";
    const targetEmail = url.searchParams.get("targetEmail") || "";

    let query: any = adminDb.collection("admin_audit_logs").orderBy("timestamp", "desc");

    const snapshot = await query.get();
    let logs = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp || null,
      };
    });

    // In-memory filters (more flexible than Firestore compound queries for dev setup)
    if (action) {
      logs = logs.filter((l: any) => l.action === action);
    }
    if (adminEmail) {
      logs = logs.filter((l: any) => (l.adminEmail || "").toLowerCase().includes(adminEmail.toLowerCase()));
    }
    if (targetEmail) {
      logs = logs.filter((l: any) => (l.targetEmail || "").toLowerCase().includes(targetEmail.toLowerCase()));
    }

    // Pagination
    let paginatedLogs = logs;
    let nextLastId = "";

    if (lastId) {
      const index = logs.findIndex((l: any) => l.id === lastId);
      if (index !== -1) {
        paginatedLogs = logs.slice(index + 1);
      }
    }

    const totalCount = paginatedLogs.length;
    paginatedLogs = paginatedLogs.slice(0, limit);

    if (paginatedLogs.length === limit && totalCount > limit) {
      nextLastId = paginatedLogs[paginatedLogs.length - 1].id;
    }

    return NextResponse.json({
      success: true,
      logs: paginatedLogs,
      nextLastId,
      total: logs.length
    });

  } catch (error: any) {
    console.error("GET audit logs error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
