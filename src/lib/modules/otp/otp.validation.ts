// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\otp\otp.validation.ts

import { z } from 'zod';

// ইমেইলে OTP পাঠানোর জন্য কোনো body প্রয়োজন নেই

// ইমেইল OTP ভেরিফাই করার জন্য স্কিমা
export const verifyEmailOtpValidationSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits long.' }),
});

// Firebase থেকে পাওয়া ID Token ভেরিফাই করার জন্য স্কিমা
export const verifyPhoneOtpValidationSchema = z.object({
  idToken: z.string({
    required_error: "Firebase ID token is required",
  }).min(1, { message: "ID token cannot be empty" }),
});