import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // এখানে \n রিপ্লেস করা হয়েছে যাতে প্রাইভেট কী সঠিক ফরম্যাটে থাকে
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("✅ Firebase Admin Initialized using Environment Variables");
  } catch (error) {
    console.error("❌ Firebase Admin Initialization Error:", error);
  }
}

export const firebaseAdmin = admin;