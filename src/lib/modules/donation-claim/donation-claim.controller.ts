import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { createDonationClaimSchema } from './donation-claim.validation';
import { DonationClaimServices } from './donation-claim.service';
import { ZodError } from 'zod';

const createClaim = async (req: NextRequest) => {
  await dbConnect();
  try {
    const body = await req.json();
    const validatedData = createDonationClaimSchema.parse(body);

    const payload = {
      item: validatedData.itemId,
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email,
      reason: validatedData.reason,
    };

    const result = await DonationClaimServices.createClaimInDB(payload as any);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Claim request submitted successfully!',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Validation Error',
        data: error.issues,
      });
    }
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    });
  }
};

const getClaims = async (_req: NextRequest) => {
  await dbConnect();
  try {
    const result = await DonationClaimServices.getAllClaimsFromDB();
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All claims retrieved successfully!',
      data: result,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    });
  }
};

// NEW: Delete Controller
const deleteClaim = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  try {
    const { id } = params;
    const result = await DonationClaimServices.deleteClaimFromDB(id);
    
    if (!result) {
       return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Claim not found',
        data: null,
      });
    }

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Claim deleted successfully!',
      data: result,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    });
  }
};

export const DonationClaimController = {
  createClaim,
  getClaims,
  deleteClaim,
};