import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const loadServiceAccountKeyFromEnvFile = (): string | null => {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return null;

    const content = fs.readFileSync(envPath, "utf8");
    const lines = content.split(/\r?\n/);
    const startIndex = lines.findIndex((l) => l.trim().startsWith("FIREBASE_SERVICE_ACCOUNT_KEY="));
    if (startIndex === -1) return null;

    const firstLine = lines[startIndex].trim();
    let jsonStr = firstLine.substring("FIREBASE_SERVICE_ACCOUNT_KEY=".length);

    if (!jsonStr.endsWith("}")) {
      for (let i = startIndex + 1; i < lines.length; i++) {
        const nextLine = lines[i];
        if (nextLine.trim() === "" || (nextLine.includes("=") && !nextLine.includes(":"))) {
          break;
        }
        jsonStr += "\n" + nextLine;
        if (nextLine.trim().endsWith("}")) {
          break;
        }
      }
    }
    return jsonStr;
  } catch (e) {
    console.warn("Failed to self-heal service account key from .env file:", e);
    return null;
  }
};

const initializeFirebaseAdmin = () => {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  // Try self-healing from .env file first, then fall back to process.env
  let serviceAccountKey = loadServiceAccountKeyFromEnvFile();
  if (!serviceAccountKey) {
    serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || null;
  }

  if (serviceAccountKey) {
    try {
      const cleanJsonStr = serviceAccountKey.trim().replace(/^["']|["']$/g, "");
      const parsedKey = JSON.parse(cleanJsonStr);
      if (parsedKey.private_key) {
        parsedKey.private_key = parsedKey.private_key
          .replace(/\\n/g, "\n")
          .replace(/^["']|["']$/g, "");
      }
      console.log("Initializing Firebase Admin with Service Account Key. Project ID:", parsedKey.project_id);
      return initializeApp({
        credential: cert(parsedKey),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON. Falling back to default initialization.", error);
    }
  }

  // Fallback to environment variables individually
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    privateKey = privateKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
    const cleanProjectId = projectId.replace(/^"|"$/g, "");
    const cleanClientEmail = clientEmail.replace(/^"|"$/g, "");

    console.log("Initializing Firebase Admin with individual env variables. Project ID:", cleanProjectId, "Client Email:", cleanClientEmail);

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

  console.log("Initializing Firebase Admin with default application credentials.");
  // If no explicit credentials, try default credentials (runs on GCP/Firebase environments natively)
  return initializeApp();
};

const adminApp = initializeFirebaseAdmin();
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
