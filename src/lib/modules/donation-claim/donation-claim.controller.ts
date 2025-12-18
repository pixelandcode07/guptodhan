import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { createDonationClaimSchema } from './donation-claim.validation';
import { DonationClaimServices } from './donation-claim.service';
import { ZodError } from 'zod';
import { verifyToken } from '@/lib/utils/jwt';
import { DonationCampaign } from '../donation-campaign/donation-campaign.model';

// POST: Create a new claim request
const createClaim = async (req: NextRequest) => {
  await dbConnect();

  try {
    // 🔐 Auth check
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized access',
        data: null,
      });
    }

    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    const currentUserId = decoded.userId;

    const body = await req.json();

    // ✅ Zod validation
    const validatedData = createDonationClaimSchema.parse(body);

    // 🔍 Campaign check
    const campaign = await DonationCampaign.findById(validatedData.itemId);
    if (!campaign) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Donation item not found',
        data: null,
      });
    }

    // 🚫 User cannot claim own donation
    if (campaign.creator.toString() === currentUserId) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: 'You cannot claim your own donation item',
        data: null,
      });
    }

    // 📦 Payload
    const payload = {
      item: validatedData.itemId,
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email,
      reason: validatedData.reason,
    };

    const result =
      await DonationClaimServices.createClaimInDB(payload as any);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Claim request submitted successfully!',
      data: result,
    });

  } catch (error) {

    // ❗ Zod error handling (FIXED)
    if (error instanceof ZodError) {
      const message = error.issues
        .map((err) => `${err.path.join('.')} : ${err.message}`)
        .join(', ');

      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message,
        data: error.issues,
      });
    }

    // 🧯 General error
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        error instanceof Error ? error.message : 'Something went wrong',
      data: null,
    });
  }
};

// GET: All claims
const getClaims = async (_req: NextRequest) => {
  await dbConnect();

  try {
    const result =
      await DonationClaimServices.getAllClaimsFromDB();

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

// DELETE: Claim by ID
const deleteClaim = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  try {
    const { id } = await params;
    const result =
      await DonationClaimServices.deleteClaimFromDB(id);

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


// ✅ NEW: Update Status Controller
const updateClaimStatus = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Validation: Status must be allowed values
    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return sendResponse({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Invalid status. Allowed: pending, approved, rejected',
            data: null,
        });
    }

    const result = await DonationClaimServices.updateClaimStatusInDB(id, status);
    
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
      message: `Claim request ${status} successfully!`,
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
  updateClaimStatus,
};
