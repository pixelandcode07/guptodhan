/* eslint-disable @typescript-eslint/no-explicit-any */
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\user\register\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes'; 
import dbConnect from '@/lib/db';
import { UserController } from '@/lib/modules/user/user.controller';
import { UserValidations } from '@/lib/modules/user/user.validation';
import { sendResponse } from '@/lib/utils/sendResponse';

/**
 * @description Register a new user
 * @route POST /api/user/register
 */
console.log("✅ HEY! I am the register route file. I am working!");
export async function POST(request: NextRequest) {
  try {
     await dbConnect();
    const body = await request.json();
    const validatedData = UserValidations.createUserValidationSchema.parse({
      body: body,
    });
    
    // কন্ট্রোলার এখন শুধু ইউজারের ডেটা রিটার্ন করবে
    const result = await UserController.createUser(validatedData.body);

    // সমাধান: route.ts এখন sendResponse ব্যবহার করে চূড়ান্ত রেসপন্স পাঠাবে
    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'User registered successfully!',
      data: result,
    });
  } catch (error: any) {
    console.log('--- ERROR FOUND ---', error);
    // Zod এরর হ্যান্ডেল করার সঠিক পদ্ধতি
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          // সমাধান: 'errors' এর পরিবর্তে 'issues' ব্যবহার করা হয়েছে
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: StatusCodes.BAD_REQUEST }, // 400 এর পরিবর্তে StatusCodes.BAD_REQUEST
      );
    }

    // অন্যান্য এরর হ্যান্ডেল করা
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to register user. Please try again.',
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }, // 500 এর পরিবর্তে StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}