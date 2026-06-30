import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";

export async function GET(req: NextRequest) {
  return handleSeed(req);
}

export async function POST(req: NextRequest) {
  return handleSeed(req);
}

async function handleSeed(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const url = new URL(req.url);
  const bypassAuth = isDev && url.searchParams.get("bypass") === "true";

  if (!bypassAuth) {
    try {
      const user = await getAuthUser();
      if (!user || !(await isAdmin(user.uid))) {
        return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized check failed" }, { status: 401 });
    }
  }

  try {
    const batch = adminDb.batch();
    const now = new Date();

    // 1. Generate 50 Mock Users
    const usersList: any[] = [
      { uid: "admin_user_id_1", email: "admin@utool.com", displayName: "Alex Commander", role: "owner", subscriptionTier: "enterprise", status: "active", tags: ["VIP", "Core Team"] },
      { uid: "admin_user_id_2", email: "support@utool.com", displayName: "Sam Support", role: "support", subscriptionTier: "pro", status: "active", tags: ["Support"] },
      { uid: "admin_user_id_3", email: "dev@utool.com", displayName: "Dev Dave", role: "developer", subscriptionTier: "pro", status: "active", tags: ["Developer"] },
      { uid: "user_vip_1", email: "elon@tesla.com", displayName: "Elon Musk", role: "user", subscriptionTier: "enterprise", status: "active", tags: ["VIP", "Heavy AI"] },
      { uid: "user_vip_2", email: "zuck@meta.com", displayName: "Mark Zuckerberg", role: "user", subscriptionTier: "enterprise", status: "active", tags: ["VIP", "Meta"] },
      { uid: "user_spammer_1", email: "bot_spammer@gmail.com", displayName: "Spam Bot 9000", role: "user", subscriptionTier: "free", status: "suspended", tags: ["Risk Flagged", "Abuser"] },
      { uid: "user_pro_1", email: "john.doe@gmail.com", displayName: "John Doe", role: "user", subscriptionTier: "pro", status: "active", tags: ["Early Adopter"] },
      { uid: "user_pro_2", email: "jane.smith@yahoo.com", displayName: "Jane Smith", role: "user", subscriptionTier: "pro", status: "active", tags: ["Content Creator"] },
      { uid: "user_pro_3", email: "robert.jones@outlook.com", displayName: "Robert Jones", role: "user", subscriptionTier: "pro", status: "active", tags: [] },
      { uid: "user_pro_4", email: "emily.watson@gmail.com", displayName: "Emily Watson", role: "user", subscriptionTier: "pro", status: "active", tags: ["Beta Tester"] },
      { uid: "user_enterprise_1", email: "cto@acme.com", displayName: "CTO Acme Corp", role: "user", subscriptionTier: "enterprise", status: "active", tags: ["Enterprise Admin"] },
    ];

    // Expand users to 50 items for pagination testing
    const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
    const countries = ["US", "GB", "DE", "IN", "CA", "AU", "FR", "JP", "BR", "ZA"];
    const rolesList = ["user", "user", "user", "user", "user", "moderator", "read_only", "support", "finance"];
    const tiersList = ["free", "free", "free", "pro", "pro", "enterprise"];
    const statusList = ["active", "active", "active", "active", "suspended"];

    for (let i = 1; i <= 40; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}_${i}@example.com`;
      const uid = `user_gen_${i}`;
      const role = rolesList[Math.floor(Math.random() * rolesList.length)];
      const subTier = tiersList[Math.floor(Math.random() * tiersList.length)];
      const status = statusList[Math.floor(Math.random() * statusList.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const tags = subTier === "enterprise" ? ["Corporate"] : subTier === "pro" ? ["Paid"] : [];
      if (Math.random() > 0.8) tags.push("Beta Tester");

      usersList.push({
        uid,
        email,
        displayName: `${fn} ${ln}`,
        role,
        subscriptionTier: subTier as any,
        status: status as any,
        tags
      });
    }

    // Write Users to Firestore
    for (const u of usersList) {
      const userRef = adminDb.collection("users").doc(u.uid);
      const isPaid = u.subscriptionTier !== "free";
      const isEnt = u.subscriptionTier === "enterprise";
      
      const createdDaysAgo = Math.floor(Math.random() * 60) + 1;
      const joinedDate = new Date(now.getTime() - createdDaysAgo * 24 * 60 * 60 * 1000);
      const lastActiveDaysAgo = Math.floor(Math.random() * 5);
      const lastActiveDate = new Date(now.getTime() - lastActiveDaysAgo * 24 * 60 * 60 * 1000);

      const maxDailyAI = isEnt ? 200 : isPaid ? 50 : 3;
      const maxMonthly = isEnt ? 5000 : isPaid ? 1000 : 100;
      const maxStorage = isEnt ? 50 * 1024 * 1024 * 1024 : isPaid ? 10 * 1024 * 1024 * 1024 : 100 * 1024 * 1024;
      const storageUsed = Math.floor(Math.random() * (maxStorage * 0.6));

      const mockUserDoc = {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.displayName}`,
        role: u.role,
        status: u.status,
        subscriptionTier: u.subscriptionTier,
        subscriptionStatus: isPaid ? "active" : "none",
        subscriptionId: isPaid ? `sub_razor_${Math.random().toString(36).substring(2, 10)}` : null,
        credits: Math.floor(Math.random() * maxMonthly),
        maxDailyAICredits: maxDailyAI,
        maxMonthlyCredits: maxMonthly,
        storageUsedBytes: storageUsed,
        maxStorageBytes: maxStorage,
        maxConcurrentJobs: isEnt ? 10 : isPaid ? 3 : 1,
        maxTeamSeats: isEnt ? 20 : 1,
        dailyUsageCount: Math.floor(Math.random() * maxDailyAI),
        dailyUsageDate: now.toISOString().split("T")[0],
        tags: u.tags,
        featureFlags: {
          betaFeatures: isPaid || Math.random() > 0.5,
          premiumTools: isPaid,
          aiFeatures: isPaid || Math.random() > 0.3,
          experimentalFeatures: u.role !== "user" || Math.random() > 0.8,
          earlyAccess: isPaid && Math.random() > 0.5,
          rateLimitExempt: isEnt || u.role !== "user"
        },
        riskScore: u.status === "suspended" ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40),
        failedLoginsToday: u.status === "suspended" ? Math.floor(Math.random() * 5) : 0,
        mfaEnabled: isPaid && Math.random() > 0.5,
        emailVerified: Math.random() > 0.1,
        country: countries[Math.floor(Math.random() * countries.length)],
        lastActiveAt: lastActiveDate,
        createdAt: joinedDate,
        updatedAt: now,
        version: 1,
        lastUpdatedBy: "system-seeder",
        internalNotes: u.status === "suspended" ? "Suspended automatically by risk engine due to high transaction failure rates." : `Trusted account. Created at ${joinedDate.toLocaleDateString()}.`,
        warningCount: u.status === "suspended" ? 2 : 0,
      };

      batch.set(userRef, mockUserDoc);
    }

    // 2. Generate 5 B2B Organizations
    const orgs = [
      { id: "org_acme", name: "Acme Corporation", ownerId: "user_enterprise_1", subTier: "enterprise", seats: 15 },
      { id: "org_hooli", name: "Hooli Inc.", ownerId: "user_vip_2", subTier: "enterprise", seats: 25 },
      { id: "org_stark", name: "Stark Industries", ownerId: "user_vip_1", subTier: "enterprise", seats: 50 },
      { id: "org_umbrella", name: "Umbrella Corp", ownerId: "user_gen_5", subTier: "enterprise", seats: 10 },
      { id: "org_cyberdyne", name: "Cyberdyne Systems", ownerId: "user_gen_10", subTier: "pro", seats: 5 },
    ];

    for (const o of orgs) {
      const orgRef = adminDb.collection("organizations").doc(o.id);
      const members = [o.ownerId];
      for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
        members.push(`user_gen_${Math.floor(Math.random() * 20) + 1}`);
      }

      const mockOrgDoc = {
        id: o.id,
        name: o.name,
        ownerId: o.ownerId,
        members,
        invitedEmails: [`invite1@${o.id.split("_")[1]}.com`, `invite2@${o.id.split("_")[1]}.com`],
        subscriptionTier: o.subTier,
        maxSeats: o.seats,
        sharedStorageBytes: Math.floor(Math.random() * 10 * 1024 * 1024 * 1024),
        maxStorageBytes: o.subTier === "enterprise" ? 100 * 1024 * 1024 * 1024 : 10 * 1024 * 1024 * 1024,
        teamQuotas: {
          dailyAICredits: o.subTier === "enterprise" ? 500 : 100,
          monthlyCredits: o.subTier === "enterprise" ? 20000 : 5000,
          concurrentJobs: o.subTier === "enterprise" ? 20 : 5,
        },
        departments: ["R&D", "Engineering", "Marketing", "Finance"],
        createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      };

      batch.set(orgRef, mockOrgDoc);

      for (const mId of members) {
        const userRef = adminDb.collection("users").doc(mId);
        batch.update(userRef, {
          organizationId: o.id,
          organizationRole: mId === o.ownerId ? "admin" : "member"
        });
      }
    }

    // 3. Generate 30 Invoices
    for (let i = 1; i <= 30; i++) {
      const invoiceId = `inv_razor_${Math.random().toString(36).substring(2, 10)}`;
      const invRef = adminDb.collection("invoices").doc(invoiceId);
      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];
      const invDaysAgo = Math.floor(Math.random() * 45) + 1;
      const amount = randomUser.subscriptionTier === "enterprise" ? 14900 : 1900;

      batch.set(invRef, {
        id: invoiceId,
        userId: randomUser.uid,
        userEmail: randomUser.email,
        userName: randomUser.displayName,
        amount: amount,
        currency: "USD",
        status: Math.random() > 0.05 ? "paid" : "failed",
        planId: randomUser.subscriptionTier === "enterprise" ? "plan_enterprise_monthly" : "plan_pro_monthly",
        razorpaySubscriptionId: randomUser.subscriptionId || `sub_razor_${Math.random().toString(36).substring(2, 10)}`,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
        currentPeriodStart: new Date(now.getTime() - invDaysAgo * 24 * 60 * 60 * 1000),
        currentPeriodEnd: new Date(now.getTime() + (30 - invDaysAgo) * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - invDaysAgo * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - invDaysAgo * 24 * 60 * 60 * 1000),
      });
    }

    // 4. Generate 20 Admin Audit Logs
    const auditActions = ["OVERRIDE_QUOTA", "SUSPEND_USER", "UNSUSPEND_USER", "GRANT_CREDITS", "CHANGE_ROLE", "TOGGLE_FEATURE_FLAG"];
    for (let i = 1; i <= 20; i++) {
      const logId = `audit_log_${i}`;
      const logRef = adminDb.collection("admin_audit_logs").doc(logId);
      const action = auditActions[Math.floor(Math.random() * auditActions.length)];
      const randomTarget = usersList[Math.floor(Math.random() * usersList.length)];
      const logDaysAgo = Math.floor(Math.random() * 15);
      const logTime = new Date(now.getTime() - logDaysAgo * 24 * 60 * 60 * 1000);

      batch.set(logRef, {
        id: logId,
        correlationId: `corr_${Math.random().toString(36).substring(2, 10)}`,
        requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
        adminUid: "admin_user_id_1",
        adminEmail: "admin@utool.com",
        targetUid: randomTarget.uid,
        targetEmail: randomTarget.email,
        action,
        sourceModule: "User Drawer",
        changedFields: [
          { field: "status", before: "active", after: action === "SUSPEND_USER" ? "suspended" : "active" }
        ],
        executionDurationMs: Math.floor(Math.random() * 100) + 10,
        status: "success",
        reason: "Administrative policy audit check",
        ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        timestamp: logTime,
      });
    }

    // 5. Generate 200 Usage Transactions
    const toolSlugs = ["pdf-compressor", "image-compressor", "ai-writer", "text-summarizer", "pdf-merger", "docx-to-pdf"];
    for (let i = 1; i <= 200; i++) {
      const txId = `usage_tx_${i}`;
      const txRef = adminDb.collection("usage_transactions").doc(txId);
      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];
      const tool = toolSlugs[Math.floor(Math.random() * toolSlugs.length)];
      const logDaysAgo = Math.floor(Math.random() * 30);
      const logTime = new Date(now.getTime() - logDaysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 12) * 60 * 60 * 1000);

      batch.set(txRef, {
        id: txId,
        userId: randomUser.uid,
        userEmail: randomUser.email,
        toolId: tool,
        toolName: tool.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        status: Math.random() > 0.08 ? "success" : "failed",
        creditsUsed: tool.startsWith("ai") ? 5 : 1,
        timestamp: logTime,
      });

      const globalLogRef = adminDb.collection("global_usage_logs").doc(`global_log_${i}`);
      batch.set(globalLogRef, {
        identifier: randomUser.uid,
        type: "user",
        toolId: tool,
        status: Math.random() > 0.08 ? "success" : "failed",
        errorMessage: Math.random() > 0.08 ? null : "Rate limit exceeded or connection timeout",
        timestamp: logTime,
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Seeded UTool database with 50 Users, 5 B2B Organizations, 30 Invoices, 20 Audit Logs, and 200 Usage Transactions successfully!",
    });
  } catch (error: any) {
    console.error("Database seeding failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
