import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    const snapshot = await adminDb.collection("organizations").orderBy("createdAt", "desc").get();
    const orgs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });

    return NextResponse.json({ success: true, organizations: orgs });
  } catch (error: any) {
    console.error("GET organizations error:", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    const body = await req.json();
    const { name, ownerId, subscriptionTier = "enterprise", maxSeats = 20, maxStorageBytes = 100 * 1024 * 1024 * 1024 } = body;

    if (!name || !ownerId) {
      return NextResponse.json({ error: "Missing name or ownerId" }, { status: 400 });
    }

    const orgId = `org_${Math.random().toString(36).substring(2, 10)}`;
    const orgRef = adminDb.collection("organizations").doc(orgId);

    const newOrg = {
      id: orgId,
      name,
      ownerId,
      members: [ownerId],
      invitedEmails: [],
      subscriptionTier,
      maxSeats,
      sharedStorageBytes: 0,
      maxStorageBytes,
      teamQuotas: {
        dailyAICredits: subscriptionTier === "enterprise" ? 500 : 100,
        monthlyCredits: subscriptionTier === "enterprise" ? 20000 : 5000,
        concurrentJobs: subscriptionTier === "enterprise" ? 20 : 5,
      },
      departments: ["Engineering", "Product", "Operations"],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await orgRef.set(newOrg);

    // Link owner's user account to this organization
    const userRef = adminDb.collection("users").doc(ownerId);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      await userRef.update({
        organizationId: orgId,
        organizationRole: "admin",
        subscriptionTier,
        subscriptionStatus: "active",
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    // Add Audit Log
    const auditId = adminDb.collection("admin_audit_logs").doc().id;
    await adminDb.collection("admin_audit_logs").doc(auditId).set({
      id: auditId,
      correlationId: `corr_${Math.random().toString(36).substring(2, 10)}`,
      requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
      adminUid: user.uid,
      adminEmail: user.email || "unknown",
      targetUid: ownerId,
      targetEmail: userSnap.exists ? userSnap.data()?.email : "unknown",
      action: "CREATE_ORGANIZATION",
      sourceModule: "Organizations Panel",
      changedFields: [{ field: "organization", before: null, after: orgId }],
      executionDurationMs: 50,
      status: "success",
      reason: `Created B2B team organization: ${name}`,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "unknown",
      timestamp: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, organization: newOrg });
  } catch (error: any) {
    console.error("POST organizations error:", error);
    return NextResponse.json({ error: error.message || "Failed to create organization" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !(await isAdmin(user.uid))) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, maxSeats, maxStorageBytes, teamQuotas, departments } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing organization id" }, { status: 400 });
    }

    const orgRef = adminDb.collection("organizations").doc(id);
    const orgSnap = await orgRef.get();

    if (!orgSnap.exists) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (name) updates.name = name;
    if (maxSeats !== undefined) updates.maxSeats = maxSeats;
    if (maxStorageBytes !== undefined) updates.maxStorageBytes = maxStorageBytes;
    if (teamQuotas) updates.teamQuotas = teamQuotas;
    if (departments) updates.departments = departments;

    await orgRef.update(updates);

    // Audit Log
    const auditId = adminDb.collection("admin_audit_logs").doc().id;
    await adminDb.collection("admin_audit_logs").doc(auditId).set({
      id: auditId,
      correlationId: `corr_${Math.random().toString(36).substring(2, 10)}`,
      requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
      adminUid: user.uid,
      adminEmail: user.email || "unknown",
      targetUid: id,
      targetEmail: "organization",
      action: "UPDATE_ORGANIZATION",
      sourceModule: "Organizations Panel",
      changedFields: [{ field: "settings", before: orgSnap.data(), after: updates }],
      executionDurationMs: 40,
      status: "success",
      reason: `Updated organization properties for ${id}`,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "unknown",
      timestamp: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, message: "Organization updated successfully" });
  } catch (error: any) {
    console.error("PATCH organizations error:", error);
    return NextResponse.json({ error: error.message || "Failed to update organization" }, { status: 500 });
  }
}
