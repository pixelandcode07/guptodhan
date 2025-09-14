// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\otp\otp.service.ts

import { User } from '../user/user.model';
import { redisClient, connectRedis } from '@/lib/redis';
import { sendEmail } from '@/lib/utils/email';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const verifyPhoneNumberWithFirebase = async (idToken: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // এখানে তুমি চাইলে user DB তে create/update করতে পারো
    return {
      uid: decodedToken.uid,
      phoneNumber: decodedToken.phone_number,
    };
  } catch (error: any) {
    console.error('Firebase verifyIdToken error:', error);
    throw new Error('Unauthorized: Invalid or expired token');
  }
};




// --- ইমেইল OTP সার্ভিস (আগের কোড) ---
const sendEmailOtp = async (userId: string) => {
  await connectRedis();
  const user = await User.findById(userId);
  if (!user) { throw new Error('User not found'); }
  if (user.isVerified) { throw new Error('User is already verified'); }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `otp:email:${user.email}`;
  await redisClient.set(redisKey, otp, { EX: 300 });

  await sendEmail({
    to: user.email,
    subject: 'Your Verification Code for Guptodhan',
    template: 'otp.ejs',
    data: { name: user.name, otp: otp },
  });
  return null;
};

const verifyEmailOtp = async (userId: string, otp: string) => {
  await connectRedis();
  const user = await User.findById(userId);
  if (!user) { throw new Error('User not found'); }
  const redisKey = `otp:email:${user.email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp) { throw new Error('OTP has expired or is invalid.'); }
  if (storedOtp !== otp) { throw new Error('The OTP you entered is incorrect.'); }

  await User.findByIdAndUpdate(userId, { isVerified: true });
  await redisClient.del(redisKey);
  return null;
};

// --- নতুন: ফোন নম্বর ভেরিফিকেশন সার্ভিস (Firebase দিয়ে) ---
// const verifyPhoneNumberWithFirebase = async (idToken: string) => {
//   const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
//   const phoneNumberFromFirebase = decodedToken.phone_number;
//   if (!phoneNumberFromFirebase) { throw new Error('No phone number found in Firebase token.'); }

//   const localPhoneNumber = phoneNumberFromFirebase.substring(3); // "+88" বাদ দেওয়া হচ্ছে

//   const user = await User.findOne({ phoneNumber: localPhoneNumber });
//   if (!user) { throw new Error('User with this phone number not found in our database.'); }

//   await User.findByIdAndUpdate(user._id, { isVerified: true });
//   return null;
// };

export const OtpServices = {
  sendEmailOtp,
  verifyEmailOtp,
  // verifyPhoneNumberWithFirebase,
  verifyPhoneNumberWithFirebase
};