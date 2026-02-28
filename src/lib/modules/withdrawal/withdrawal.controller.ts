import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { WithdrawalService } from './withdrawal.service';
import { createWithdrawalSchema, updateWithdrawalStatusSchema } from './withdrawal.validation';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

const createRequest = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body = await req.json();
    
    // ১. Zod দিয়ে ভ্যালিডেশন (এখানে string হিসেবে ডেটা আসবে)
    const validatedData = createWithdrawalSchema.parse(body);
    
    // ২. String কে ObjectId তে কনভার্ট করা হচ্ছে (TypeScript Error ফিক্স)
    const payload: Partial<any> = {
      ...validatedData,
      vendorId: new Types.ObjectId(validatedData.vendorId),
      storeId: new Types.ObjectId(validatedData.storeId),
    };
    
    // ৩. সার্ভিসে পাঠানো হচ্ছে
    const result = await WithdrawalService.createWithdrawalRequest(payload);
    
    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Withdrawal request submitted successfully!',
      data: result,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message || 'Failed to submit request',
      data: null,
    });
  }
};

const getVendorHistory = async (req: NextRequest, { params }: { params: { vendorId: string } }) => {
  try {
    await dbConnect();
    const { vendorId } = await params;
    const result = await WithdrawalService.getWithdrawalHistoryByVendor(vendorId);
    
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Withdrawal history retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      data: null,
    });
  }
};

const getAllRequests = async (req: NextRequest) => {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;
    
    const result = await WithdrawalService.getAllWithdrawalRequests(status);
    
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Requests retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      data: null,
    });
  }
};

const updateStatus = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    const validatedData = updateWithdrawalStatusSchema.parse(body);
    
    const result = await WithdrawalService.updateWithdrawalStatus(
      id, 
      validatedData.status, 
      validatedData.adminRemarks
    );
    
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: `Withdrawal request has been ${validatedData.status}!`,
      data: result,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      data: null,
    });
  }
};

export const WithdrawalController = {
  createRequest,
  getVendorHistory,
  getAllRequests,
  updateStatus,
};