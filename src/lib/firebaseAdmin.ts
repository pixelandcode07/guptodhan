import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log("✅ Firebase Admin Initialized!");
}

export const firebaseAdmin = admin;
