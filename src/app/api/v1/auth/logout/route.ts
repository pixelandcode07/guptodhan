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