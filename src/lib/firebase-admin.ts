import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initializeFirebaseAdmin(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    privateKey = privateKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
    const cleanProjectId = projectId.replace(/^"|"$/g, "");
    const cleanClientEmail = clientEmail.replace(/^"|"$/g, "");

    return initializeApp({
      credential: cert({
        projectId: cleanProjectId,
        clientEmail: cleanClientEmail,
        privateKey: privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  // Fallback to default application credentials if running in a GCP environment
  return initializeApp();
}

let adminApp: ReturnType<typeof initializeApp> = undefined as any;
let adminAuth: ReturnType<typeof getAuth> = undefined as any;
let adminDb: ReturnType<typeof getFirestore> = undefined as any;

try {
  adminApp = initializeFirebaseAdmin();
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

export { adminApp, adminAuth, adminDb };
