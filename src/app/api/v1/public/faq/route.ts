import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { FAQServices } from '@/lib/modules/faq/faq.service';
import dbConnect from '@/lib/db';
import { catchAsync } from '@/lib/middlewares/catchAsync';

const getPublicFAQs = async (req: NextRequest) => {
    await dbConnect();

    // 🔥 ডেটাবেস থেকে সরাসরি $lookup করা গ্রুপ ডেটা নিয়ে আসা
    const finalData = await FAQServices.getPublicGroupedFAQsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Public FAQs retrieved successfully!',
        data: finalData,
    });
};

export const GET = catchAsync(getPublicFAQs);