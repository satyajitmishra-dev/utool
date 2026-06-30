import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthUser } from "@/lib/auth-server";
import { FieldValue } from "firebase-admin/firestore";

async function getAdminRoleAndClearance(uid: string, email?: string) {
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

  return { role, canWrite: role !== "read_only", permissions };
}

// GET: Fetch detailed profile of a single user
export async function GET(req: NextRequest, props: { params: Promise<{ uid: string }> }) {
  const params = await props.params;
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { permissions } = await getAdminRoleAndClearance(user.uid, user.email);
    if (!permissions.admin && !permissions.support && !permissions.finance && !permissions.developer && !permissions.moderator) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    const { uid } = params;
    const userSnap = await adminDb.collection("users").doc(uid).get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();

    // 1. Fetch support tickets
    let supportTickets: any[] = [];
    try {
      const ticketsSnap = await adminDb
        .collection("supportTickets")
        .where("userId", "==", uid)
        .orderBy("updatedAt", "desc")
        .get();
      supportTickets = ticketsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.warn("Could not load support tickets for detailed view:", e);
    }

    // 2. Fetch invoices
    let invoices: any[] = [];
    try {
      const invoicesSnap = await adminDb
        .collection("invoices")
        .where("userId", "==", uid)
        .orderBy("createdAt", "desc")
        .get();
      invoices = invoicesSnap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt,
          currentPeriodStart: d.currentPeriodStart?.toDate?.()?.toISOString() || d.currentPeriodStart,
          currentPeriodEnd: d.currentPeriodEnd?.toDate?.()?.toISOString() || d.currentPeriodEnd,
        };
      });
    } catch (e) {
      console.warn("Could not load invoices for detailed view:", e);
    }

    // 3. Fetch usage transactions (limit to 50 for performance)
    let usageTransactions: any[] = [];
    try {
      const txsSnap = await adminDb
        .collection("usage_transactions")
        .where("userId", "==", uid)
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();
      usageTransactions = txsSnap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          timestamp: d.timestamp?.toDate?.()?.toISOString() || d.timestamp
        };
      });
    } catch (e) {
      console.warn("Could not load usage transactions for detailed view:", e);
    }

    // 4. Fetch admin audit logs relating to this user
    let targetAuditLogs: any[] = [];
    try {
      const auditsSnap = await adminDb
        .collection("admin_audit_logs")
        .where("targetUid", "==", uid)
        .orderBy("timestamp", "desc")
        .get();
      targetAuditLogs = auditsSnap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          timestamp: d.timestamp?.toDate?.()?.toISOString() || d.timestamp
        };
      });
    } catch (e) {
      console.warn("Could not load audit logs for detailed view:", e);
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...userData,
        createdAt: userData?.createdAt?.toDate?.()?.toISOString() || userData?.createdAt || null,
        updatedAt: userData?.updatedAt?.toDate?.()?.toISOString() || userData?.updatedAt || null,
        lastActiveAt: userData?.lastActiveAt?.toDate?.()?.toISOString() || userData?.lastActiveAt || null,
      },
      supportTickets,
      invoices,
      usageTransactions,
      auditLogs: targetAuditLogs
    });

  } catch (error: any) {
    console.error("GET user detail error:", error);
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}

// PATCH: Edit individual profile setting with optimistic locking
export async function PATCH(req: NextRequest, props: { params: Promise<{ uid: string }> }) {
  const params = await props.params;
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  const correlationId = `corr_${Math.random().toString(36).substring(2, 10)}`;

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { permissions, role: adminRole, canWrite } = await getAdminRoleAndClearance(user.uid, user.email);
    if (!canWrite) {
      return NextResponse.json({ error: "Permission Denied: Read Only role cannot perform updates." }, { status: 403 });
    }

    const { uid } = params;
    const body = await req.json();
    const { version, reason = "Manual update via details panel", ...updates } = body;

    const userRef = adminDb.collection("users").doc(uid);
    
    // Concurrency Protection: Transaction to verify version match
    let finalResult = null;
    let conflictError = false;

    await adminDb.runTransaction(async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists) {
        throw new Error("User document does not exist");
      }

      const userData = userSnap.data();
      const currentVersion = userData?.version || 1;
      const lastUpdatedBy = userData?.lastUpdatedBy || "system";

      // If client provides a version and it does not match, trigger conflict
      if (version !== undefined && version !== currentVersion) {
        conflictError = true;
        finalResult = {
          error: "CONFLICT",
          message: "Another administrator has updated this user record since you loaded it.",
          lastUpdatedBy,
          currentVersion
        };
        return;
      }

      // Enforce security boundaries on updates
      if (updates.role !== undefined && updates.role !== userData?.role) {
        if (!permissions.super_admin) {
          throw new Error("Permission Denied: Only Super Admin and Owner can change user roles.");
        }
      }
      if (updates.subscriptionTier !== undefined && updates.subscriptionTier !== userData?.subscriptionTier) {
        if (!permissions.finance && !permissions.admin) {
          throw new Error("Permission Denied: Only Finance and Admins can override subscriptions.");
        }
      }

      // Build safe update payload
      const cleanedUpdates: Record<string, any> = {};
      const fields = [
        "displayName", "status", "role", "subscriptionTier", "subscriptionStatus",
        "credits", "maxDailyAICredits", "maxMonthlyCredits", "maxStorageBytes",
        "maxConcurrentJobs", "maxTeamSeats", "tags", "featureFlags", "internalNotes", "warningCount"
      ];

      for (const field of fields) {
        if (updates[field] !== undefined) {
          cleanedUpdates[field] = updates[field];
        }
      }

      cleanedUpdates.updatedAt = FieldValue.serverTimestamp();
      cleanedUpdates.version = currentVersion + 1;
      cleanedUpdates.lastUpdatedBy = user.email || user.uid;

      transaction.update(userRef, cleanedUpdates);

      // Audit Log Generation inside transaction
      const changedFields = Object.keys(cleanedUpdates)
        .filter(k => k !== "updatedAt" && k !== "version" && k !== "lastUpdatedBy")
        .map(k => ({
          field: k,
          before: userData?.[k] !== undefined ? userData[k] : null,
          after: cleanedUpdates[k]
        }));

      const userAgent = req.headers.get("user-agent") || "unknown";
      const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

      const auditRef = adminDb.collection("admin_audit_logs").doc();
      transaction.set(auditRef, {
        id: auditRef.id,
        correlationId,
        requestId,
        adminUid: user.uid,
        adminEmail: user.email || "unknown",
        targetUid: uid,
        targetEmail: userData?.email || "unknown",
        action: "UPDATE_USER_PROFILE",
        sourceModule: "User Drawer",
        changedFields,
        executionDurationMs: Date.now() - startTime,
        status: "success",
        reason,
        ipAddress,
        userAgent,
        timestamp: FieldValue.serverTimestamp()
      });

      finalResult = { success: true, newVersion: cleanedUpdates.version };
    });

    if (conflictError) {
      return NextResponse.json(finalResult, { status: 409 });
    }

    return NextResponse.json(finalResult);

  } catch (error: any) {
    console.error("PATCH user details error:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

// DELETE: Hard delete user account (destructive)
export async function DELETE(req: NextRequest, props: { params: Promise<{ uid: string }> }) {
  const params = await props.params;
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  const correlationId = `corr_${Math.random().toString(36).substring(2, 10)}`;

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { permissions, canWrite } = await getAdminRoleAndClearance(user.uid, user.email);
    if (!canWrite || !permissions.super_admin) {
      return NextResponse.json({ error: "Permission Denied: Super Admin role required to delete accounts." }, { status: 403 });
    }

    const { uid } = params;
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();

    // 1. Delete user doc
    await userRef.delete();

    // 2. Log Audit
    const userAgent = req.headers.get("user-agent") || "unknown";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    await adminDb.collection("admin_audit_logs").add({
      id: adminDb.collection("admin_audit_logs").doc().id,
      correlationId,
      requestId,
      adminUid: user.uid,
      adminEmail: user.email || "unknown",
      targetUid: uid,
      targetEmail: userData?.email || "unknown",
      action: "DELETE_USER",
      sourceModule: "User Drawer",
      changedFields: [{ field: "account", before: "active", after: "deleted" }],
      executionDurationMs: Date.now() - startTime,
      status: "success",
      reason: "Manual deletion requested by admin.",
      ipAddress,
      userAgent,
      timestamp: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });

  } catch (error: any) {
    console.error("DELETE user error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 });
  }
}
