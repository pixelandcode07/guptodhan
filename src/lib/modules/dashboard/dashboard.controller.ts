import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { DashboardServices } from './dashboard.service';
import dbConnect from '@/lib/db';

const getDashboardAnalytics = async (_req: NextRequest) => {
    await dbConnect();
    const result = await DashboardServices.getDashboardAnalyticsFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Dashboard analytics retrieved successfully!',
        data: result,
    });
};

export const DashboardController = {
    getDashboardAnalytics,
};