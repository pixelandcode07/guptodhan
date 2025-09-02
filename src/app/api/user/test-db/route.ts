// ফাইল পাথ: src/app/api/test-db/route.ts


import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';

/**
 * @description ডেটাবেস কানেকশন পরীক্ষা করার জন্য একটি টেস্ট রুট।
 * @route GET /api/test-db
 */
export async function GET() {
  try {
    // ডেটাবেস কানেক্ট করার চেষ্টা করা হচ্ছে
    await dbConnect();
    
    // সফল হলে, একটি সাকসেস মেসেজ পাঠানো হচ্ছে
    return NextResponse.json(
      { 
        success: true, 
        message: 'MongoDB connected successfully!' 
      },
      { status: StatusCodes.OK },
    );
  } catch (error: any) {
    // কানেকশনে কোনো সমস্যা হলে, একটি এরর মেসেজ পাঠানো হচ্ছে
    console.error('--- DATABASE CONNECTION FAILED ---:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'MongoDB connection failed!', 
        error: error.message 
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}