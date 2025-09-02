// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\otp\otp.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { OtpServices } from './otp.service';
import { verifyEmailOtpValidationSchema, verifyPhoneOtpValidationSchema } from './otp.validation';

// --- ইমেইল OTP কন্ট্রোলার ---
const sendEmailOtp = async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error('Authentication failure: User ID not found'); }

  await OtpServices.sendEmailOtp(userId);
  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'An OTP has been sent to your email address.',
    data: null,
  });
};

const verifyEmailOtp = async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error('Authentication failure: User ID not found'); }

  const body = await req.json();
  const validatedData = verifyEmailOtpValidationSchema.parse(body);
  await OtpServices.verifyEmailOtp(userId, validatedData.otp);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your account has been successfully verified via email!',
    data: null,
  });
};

// --- নতুন: ফোন নম্বর ভেরিফিকেশন কন্ট্রোলার ---
const verifyPhoneOtp = async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = verifyPhoneOtpValidationSchema.parse(body);
  await OtpServices.verifyPhoneNumberWithFirebase(validatedData.idToken);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your phone number has been successfully verified!',
    data: null,
  });
};

export const OtpController = {
  sendEmailOtp,
  verifyEmailOtp,
  verifyPhoneOtp,
};