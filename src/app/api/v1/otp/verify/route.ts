// ========================================
// ✅ Verify OTP Route (Standalone)
// ========================================
// Path: src/app/api/v1/otp/verify/route.ts

import { NextRequest } from 'next/server';
import { OtpController } from '@/lib/modules/otp/otp.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(
  async (req: NextRequest) => await OtpController.verifyOtp(req)
);