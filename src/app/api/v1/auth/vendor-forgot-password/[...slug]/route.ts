// D:\...\src\app\api\v1\auth\vendor-forgot-password\[...slug]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// মূল হ্যান্ডলার ফাংশন
async function handler(
  req: NextRequest,
  // 👇 পরিবর্তন ১: এখানে 'context' আর্গুমেন্টটি নিন
  context: { params: Promise<{ slug: string[] }> }
) {
  // 👇 পরিবর্তন ২: params Promise-টিকে 'await' করে resolve করুন
  const params = await context.params;

  // এখন 'params' একটি অবজেক্ট, এবং আপনি এটি নিরাপদে ব্যবহার করতে পারেন
  const segment = params.slug[0];

  // URL-এর সেগমেন্ট অনুযায়ী সঠিক কন্ট্রোলার কল করা হচ্ছে
  switch (segment) {
    case 'send-otp':
      return AuthController.vendorSendForgotPasswordOtp(req);

    case 'verify-otp':
      return AuthController.vendorVerifyForgotPasswordOtp(req);

    case 'reset':
      return AuthController.vendorResetPassword(req);

    default:
      return NextResponse.json(
        { success: false, message: 'Invalid API route' },
        { status: 404 }
      );
  }
}

// পুরো 'handler' ফাংশনটিকে 'catchAsync' দিয়ে wrap করা হলো
export const POST = catchAsync(handler);