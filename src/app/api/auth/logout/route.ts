// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\auth\logout\route.ts
import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';

export async function POST() {
    const response = sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User logged out successfully!',
        data: null
    });
    response.cookies.set('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    return response;
}