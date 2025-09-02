// ফাইল পাথ: src/lib/utils/catchAsync.ts

import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

// কন্ট্রোলার ফাংশনের জন্য একটি টাইপ ডিফাইন করা হচ্ছে
type TControllerFunction = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

export const catchAsync = (fn: TControllerFunction) => {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      // মূল কন্ট্রোলার ফাংশনটিকে কল করা হচ্ছে
      return await fn(req, ...args);
    } catch (error: any) {
      // যেকোনো এরর হলে একটি স্ট্যান্ডার্ড এরর রেসপন্স পাঠানো হচ্ছে
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Something went wrong!',
        },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      );
    }
  };
};