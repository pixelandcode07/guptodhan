
import admin from 'firebase-admin';
import path from 'path';

const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');


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