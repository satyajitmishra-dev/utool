import { loadEnvConfig } from "@next/env";
// Load env variables from .env / .env.local
loadEnvConfig(process.cwd());

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function initAdminDb() {
  const apps = getApps();
  if (apps.length > 0) {
    return getFirestore(apps[0]);
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    // Try service account key JSON
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const cleanKey = serviceAccountKey.replace(/^'|'$/g, "");
        const serviceAccount = JSON.parse(cleanKey);
        const app = initializeApp({
          credential: cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        return getFirestore(app);
      } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:", err);
      }
    }
    throw new Error("Missing Firebase Admin credentials in environment variables.");
  }

  privateKey = privateKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  const cleanProjectId = projectId.replace(/^"|"$/g, "");
  const cleanClientEmail = clientEmail.replace(/^"|"$/g, "");

  const app = initializeApp({
    credential: cert({
      projectId: cleanProjectId,
      clientEmail: cleanClientEmail,
      privateKey: privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  return getFirestore(app);
}

async function migrateUsers() {
  console.log("Starting Firebase Firestore user migration...");
  let db;
  try {
    db = initAdminDb();
  } catch (error: any) {
    console.error("Initialization failed:", error.message);
    process.exit(1);
  }

  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  if (snapshot.empty) {
    console.log("No user profiles found in 'users' collection.");
    return;
  }

  console.log(`Found ${snapshot.size} user documents. Checking for missing membership fields...`);

  let updatedCount = 0;
  const batch = db.batch();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const needsUpdate =
      data.subscriptionTier === undefined ||
      data.subscriptionStatus === undefined;

    if (needsUpdate) {
      const updates: Record<string, any> = {};
      if (data.subscriptionTier === undefined) {
        updates.subscriptionTier = "free";
      }
      if (data.subscriptionStatus === undefined) {
        updates.subscriptionStatus = "none";
      }
      
      console.log(`Scheduling update for user ${doc.id} (${data.email || "No Email"}):`, updates);
      batch.update(doc.ref, updates);
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    await batch.commit();
    console.log(`Successfully migrated ${updatedCount} users.`);
  } else {
    console.log("All user documents are already up to date. No migration needed.");
  }
}

migrateUsers()
  .then(() => {
    console.log("Migration script completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration script failed with error:", err);
    process.exit(1);
  });
