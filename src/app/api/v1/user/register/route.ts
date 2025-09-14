/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { UserController } from '@/lib/modules/user/user.controller';
import { UserValidations } from '@/lib/modules/user/user.validation';
import { sendResponse } from '@/lib/utils/sendResponse';


console.log("✅ HEY! I am the register route file. I am working!");
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserValidations.createUserValidationSchema.parse({
      body: body,
    });

    const result = await UserController.createUser(validatedData.body);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'User registered successfully!',
      data: result,
    });
  } catch (error: any) {
    console.log('--- ERROR FOUND ---', error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to register user. Please try again.',
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}