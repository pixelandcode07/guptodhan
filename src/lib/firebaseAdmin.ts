import admin from "firebase-admin";
import path from "path";

// লোকালে .json ফাইল থেকে পড়ার জন্য পাথ
const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");

if (!admin.apps.length) {
  // ✅ FIX: চেক করুন এটি Vercel-এ (production) চলছে কিনা
  if (process.env.NODE_ENV === 'production') {
    // Vercel-এ Environment Variable থেকে Firebase চালু করুন
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // ✅ FIX: Vercel-এর \n-কে আসল newline-এ রূপান্তর করা হচ্ছে
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin Initialized (Production Mode)");
  } else {
    // লোকালে .json ফাইল থেকে Firebase চালু করুন
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    console.log("Firebase Admin Initialized (Development Mode)");
  }
}

export const firebaseAdmin = admin;