// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\reports\report.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createReportValidationSchema, updateReportStatusValidationSchema } from './report.validation';
import { ReportServices } from './report.service';
import dbConnect from '@/lib/db';

// নতুন রিপোর্ট তৈরি করার কন্ট্রোলার
const createReport = async (req: NextRequest) => {
  await dbConnect();
  const reporterId = req.headers.get('x-user-id');
  if (!reporterId) { throw new Error('User ID not found in token'); }

  const body = await req.json();
  const validatedData = createReportValidationSchema.parse(body);

  const payload = {
    ad: validatedData.adId,
    reporter: reporterId,
    reason: validatedData.reason,
    details: validatedData.details,
  };
  
  const result = await ReportServices.createReportInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Report submitted successfully. Our team will review it shortly.',
    data: result,
  });
};

// সকল রিপোর্ট দেখার কন্ট্রোলার (শুধুমাত্র অ্যাডমিন)
const getAllReports = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ReportServices.getAllReportsFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reports retrieved successfully.',
        data: result,
    });
};

// রিপোর্টের স্ট্যাটাস আপডেট করার কন্ট্রোলার (শুধুমাত্র অ্যাডমিন)
const updateReportStatus = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateReportStatusValidationSchema.parse(body);
    
    const result = await ReportServices.updateReportStatusInDB(id, validatedData);
    
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Report status updated successfully.',
        data: result,
    });
};

export const ReportController = {
  createReport,
  getAllReports,
  updateReportStatus,
};