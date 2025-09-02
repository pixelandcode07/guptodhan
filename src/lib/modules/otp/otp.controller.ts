// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\otp\otp.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { OtpServices } from './otp.service';
import { verifyOtpValidationSchema } from './otp.validation';

const sendOtp = async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error('Authentication failure: User ID not found'); }

  await OtpServices.sendOtp(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'An OTP has been sent to your email address.',
    data: null,
  });
};

const verifyOtp = async (req: NextRequest) => {
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error('Authentication failure: User ID not found'); }

  const body = await req.json();
  const validatedData = verifyOtpValidationSchema.parse(body);

  await OtpServices.verifyOtp(userId, validatedData.otp);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your account has been successfully verified!',
    data: null,
  });
};

export const OtpController = {
  sendOtp,
  verifyOtp,
};