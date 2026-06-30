import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { FieldValue } from "firebase-admin/firestore";

// Helper to check user's RBAC role and permissions
async function getAdminRoleAndClearance(uid: string, email?: string) {
  // Fallback for environment admin
  const adminMailEnv = process.env.ADMIN_MAIL?.toLowerCase().trim();
  if (email && adminMailEnv && email.toLowerCase().trim() === adminMailEnv) {
    return {
      role: "owner",
      canWrite: true,
      permissions: {
        owner: true,
        super_admin: true,
        admin: true,
        support: true,
        finance: true,
        developer: true,
        moderator: true,
        read_only: true,
      }
    };
  }

  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) {
    return { role: "read_only", canWrite: false, permissions: {} };
  }

  const data = userSnap.data();
  const role = data?.role || "read_only";

  const permissions: Record<string, boolean> = {
    owner: role === "owner",
    super_admin: role === "owner" || role === "super_admin",
    admin: role === "owner" || role === "super_admin" || role === "admin",
    support: role === "owner" || role === "super_admin" || role === "admin" || role === "support",
    finance: role === "owner" || role === "super_admin" || role === "admin" || role === "finance",
    developer: role === "owner" || role === "super_admin" || role === "admin" || role === "developer",
    moderator: role === "owner" || role === "super_admin" || role === "admin" || role === "moderator",
    read_only: true,
  };

  const canWrite = role !== "read_only";

  return { role, canWrite, permissions };
}

// GET: Fetch all users (filtered, sorted, paginated)
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, permissions } = await getAdminRoleAndClearance(user.uid, user.email);
    if (!permissions.admin && !permissions.support && !permissions.finance && !permissions.developer && !permissions.moderator) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const lastId = url.searchParams.get("lastId") || "";
    const search = url.searchParams.get("search") || "";
    const roleFilter = url.searchParams.get("role") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const tierFilter = url.searchParams.get("subscriptionTier") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    let query: any = adminDb.collection("users");

    // Apply basic Firestore filters
    if (roleFilter) query = query.where("role", "==", roleFilter);
    if (statusFilter) query = query.where("status", "==", statusFilter);
    if (tierFilter) query = query.where("subscriptionTier", "==", tierFilter);

    // Apply sorting (requires indexing in Firestore, if indexing isn't done, we fall back gracefully)
    // Firestore requires compound indexes for where + orderBy. We sort by the requested field.
    query = query.orderBy(sortBy, sortOrder as "asc" | "desc");

    // Fetch documents
    const snapshot = await query.get();
    let users = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
        lastActiveAt: data.lastActiveAt?.toDate?.()?.toISOString() || data.lastActiveAt || null,
      };
    });

    // In-memory advanced search filtering if search parameter is present (resilient prefix matching)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      users = users.filter((u: any) => 
        (u.email || "").toLowerCase().includes(q) ||
        (u.displayName || "").toLowerCase().includes(q) ||
        (u.uid || "").toLowerCase().includes(q)
      );
    }

    // Pagination slice
    let paginatedUsers = users;
    let nextLastId = "";

    if (lastId) {
      const index = users.findIndex((u: any) => u.uid === lastId);
      if (index !== -1) {
        paginatedUsers = users.slice(index + 1);
      }
    }

    const totalCount = paginatedUsers.length;
    paginatedUsers = paginatedUsers.slice(0, limit);

    if (paginatedUsers.length === limit && totalCount > limit) {
      nextLastId = paginatedUsers[paginatedUsers.length - 1].uid;
    }

    return NextResponse.json({
      success: true,
      users: paginatedUsers,
      total: users.length,
      nextLastId,
    });
  } catch (error: any) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: Execute bulk operations with partial success tracking & audit logs
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  const correlationId = `corr_${Math.random().toString(36).substring(2, 10)}`;

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role: adminRole, canWrite, permissions } = await getAdminRoleAndClearance(user.uid, user.email);
    if (!canWrite) {
      return NextResponse.json({ error: "Permission Denied: Read Only role cannot perform write operations." }, { status: 403 });
    }

    const body = await req.json();
    const { userIds, action, payload, reason = "Bulk operations via Admin Panel" } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "Missing or invalid userIds" }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    // Enforce action-specific permission checks
    if (action === "delete" && !permissions.super_admin) {
      return NextResponse.json({ error: "Permission Denied: Only Owners and Super Admins can delete users." }, { status: 403 });
    }
    if ((action === "upgrade" || action === "downgrade") && !permissions.finance && !permissions.admin) {
      return NextResponse.json({ error: "Permission Denied: Only Finance and Admins can modify subscriptions." }, { status: 403 });
    }
    if ((action === "grant_credits" || action === "reset_quota") && !permissions.support && !permissions.admin) {
      return NextResponse.json({ error: "Permission Denied: Only Support and Admins can modify quotas/credits." }, { status: 403 });
    }

    const results = {
      successCount: 0,
      failureCount: 0,
      errors: [] as { userId: string; error: string }[],
      retriableIds: [] as string[]
    };

    const userAgent = req.headers.get("user-agent") || "unknown";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Process each user individually to support partial success
    for (const targetUid of userIds) {
      try {
        const userRef = adminDb.collection("users").doc(targetUid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          results.failureCount++;
          results.errors.push({ userId: targetUid, error: "User not found" });
          results.retriableIds.push(targetUid);
          continue;
        }

        const userData = userSnap.data();
        const beforeValues = { ...userData };
        const afterValues: Record<string, any> = {};

        // Perform specific action
        if (action === "suspend") {
          afterValues.status = "suspended";
        } else if (action === "unsuspend") {
          afterValues.status = "active";
        } else if (action === "upgrade") {
          afterValues.subscriptionTier = payload?.tier || "pro";
          afterValues.subscriptionStatus = "active";
        } else if (action === "downgrade") {
          afterValues.subscriptionTier = "free";
          afterValues.subscriptionStatus = "none";
        } else if (action === "grant_credits") {
          const addCredits = parseInt(payload?.credits || "0");
          afterValues.credits = FieldValue.increment(addCredits);
        } else if (action === "reset_quota") {
          afterValues.dailyUsageCount = 0;
        } else if (action === "assign_tags") {
          const tagsToAdd = payload?.tags || [];
          afterValues.tags = FieldValue.arrayUnion(...tagsToAdd);
        } else if (action === "toggle_features") {
          const flags = payload?.flags || {};
          afterValues.featureFlags = {
            ...(userData?.featureFlags || {}),
            ...flags
          };
        } else if (action === "delete") {
          // Hard delete
          await userRef.delete();
          results.successCount++;

          // Log Audit for Delete
          await adminDb.collection("admin_audit_logs").add({
            id: adminDb.collection("admin_audit_logs").doc().id,
            correlationId,
            requestId,
            adminUid: user.uid,
            adminEmail: user.email || "unknown",
            targetUid,
            targetEmail: userData?.email || "unknown",
            action: "DELETE_USER",
            sourceModule: "Bulk Table",
            changedFields: [{ field: "account", before: "exists", after: "deleted" }],
            executionDurationMs: Date.now() - startTime,
            status: "success",
            reason,
            ipAddress,
            userAgent,
            timestamp: FieldValue.serverTimestamp(),
          });
          continue;
        }

        // Apply changes
        afterValues.updatedAt = FieldValue.serverTimestamp();
        afterValues.version = FieldValue.increment(1);
        afterValues.lastUpdatedBy = user.email || user.uid;

        await userRef.update(afterValues);
        results.successCount++;

        // Audit Log Generation
        const changedFields = Object.keys(afterValues)
          .filter(k => k !== "updatedAt" && k !== "version" && k !== "lastUpdatedBy")
          .map(k => ({
            field: k,
            before: beforeValues[k] !== undefined ? beforeValues[k] : null,
            after: afterValues[k]
          }));

        await adminDb.collection("admin_audit_logs").add({
          id: adminDb.collection("admin_audit_logs").doc().id,
          correlationId,
          requestId,
          adminUid: user.uid,
          adminEmail: user.email || "unknown",
          targetUid,
          targetEmail: userData?.email || "unknown",
          action: `BULK_${action.toUpperCase()}`,
          sourceModule: "Bulk Table",
          changedFields,
          executionDurationMs: Date.now() - startTime,
          status: "success",
          reason,
          ipAddress,
          userAgent,
          timestamp: FieldValue.serverTimestamp(),
        });

      } catch (userErr: any) {
        results.failureCount++;
        results.errors.push({ userId: targetUid, error: userErr.message || "Failed to update user" });
        results.retriableIds.push(targetUid);
      }
    }

    return NextResponse.json({
      success: true,
      correlationId,
      results
    });

  } catch (error: any) {
    console.error("Bulk operations failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
