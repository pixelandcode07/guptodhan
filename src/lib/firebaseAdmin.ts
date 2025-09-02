// ফাইল পাথ: src/lib/firebaseAdmin.ts

import admin from 'firebase-admin';
import path from 'path';

// নিশ্চিত করুন যে serviceAccountKey.json ফাইলটি আপনার প্রজেক্টের রুটে আছে
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

// যদি Firebase অ্যাপ আগে থেকে ইনিশিয়ালাইজ করা না থাকে, তাহলেই শুধু করা হবে
// এটি Next.js-এর Hot Reloading-এর কারণে হওয়া এরর প্রতিরোধ করে
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    console.log('✅ Firebase Admin SDK Initialized Successfully!');
  } catch (error) {
    console.error('❌ Firebase Admin SDK Initialization Failed:', error);
  }
}

export const firebaseAdmin = admin;