// ========================================
// ✅ Verify OTP & Create Account Route
// ========================================
// Path: src/app/api/v1/user/verify-otp/route.ts

import { NextRequest } from 'next/server';
import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(
  async (req: NextRequest) => await UserController.verifyOtpAndCreateAccount(req)
);