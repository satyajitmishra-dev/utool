const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

// Use the existing service account or default credentials
// NOTE: Make sure your FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS is set
async function makeAdmin() {
  const app = getApps().length === 0 ? initializeApp() : getApps()[0];
  const db = getFirestore(app);

  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email: npx ts-node src/scripts/make-admin.ts user@example.com");
    process.exit(1);
  }

  console.log(`Searching for user with email: ${email}`);
  
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      console.log("User not found in 'users' collection. Creating a dummy admin record...");
      // In case Firebase Auth has the user but Firestore doesn't have the profile yet
      // We need the UID, but we can't easily get it without the Auth SDK or knowing it.
      console.log("Please create an account by logging in first, then run this script.");
    } else {
      for (const doc of snapshot.docs) {
        await doc.ref.update({ role: "admin", subscriptionTier: "admin" });
        console.log(`Success! Updated user ${doc.id} (${email}) to Admin.`);
      }
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

makeAdmin();
