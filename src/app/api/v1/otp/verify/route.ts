import { NextRequest } from 'next/server';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { OtpController } from '@/lib/modules/otp/otp.controller';

export const POST = catchAsync(async (req: NextRequest) => {
  return await OtpController.verifyOtp(req);
});