import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { DashboardServices } from './dashboard.service'; // Import the service
import dbConnect from '@/lib/db';

const getDashboardAnalytics = async (_req: NextRequest) => {
    await dbConnect();
    
    // ✅ Call the service function to get the data
    const result = await DashboardServices.getDashboardAnalyticsFromDB(); 
    
    // ✅ Use sendResponse to return a proper NextResponse
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Dashboard analytics retrieved successfully!',
        data: result,
    });
};

// ✅ Export the controller object with the correct function
export const DashboardController = {
    getDashboardAnalytics,
};