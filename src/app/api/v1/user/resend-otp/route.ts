// ========================================
// 🔄 Resend OTP Route
// ========================================

import { NextRequest } from 'next/server';
import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(
  async (req: NextRequest) => await UserController.resendOtp(req)
);