// ========================================
// 📤 Send OTP Route (Standalone)
// ========================================

import { NextRequest } from 'next/server';
import { OtpController } from '@/lib/modules/otp/otp.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(
  async (req: NextRequest) => await OtpController.sendOtp(req)
);