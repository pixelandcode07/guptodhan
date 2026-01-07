import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { Types } from 'mongoose';
import { createDonationCampaignSchema } from './donation-campaign.validation';
import { DonationCampaignServices } from './donation-campaign.service';
import { ZodError } from 'zod';

const createCampaign = async (req: NextRequest) => {
  await dbConnect();
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');

    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    const creatorId = decoded.userId;

    const formData = await req.formData();
    const images = formData.getAll('images') as File[];

    const uploadResults = images.length > 0
      ? await Promise.all(
          images.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return uploadToCloudinary(buffer, 'donation-campaigns');
          })
        )
      : [];

    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') payload[key] = value;
    }

    const validatedData = createDonationCampaignSchema.parse(payload);

    let categoryId: Types.ObjectId;
    try {
      categoryId = new Types.ObjectId(validatedData.category);
    } catch {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid category ID',
        data: null,
      });
    }

    const finalPayload = {
      ...validatedData,
      creator: new Types.ObjectId(creatorId),
      category: categoryId,
      images: uploadResults.map((img) => img.secure_url),
    };

    const result = await DonationCampaignServices.createCampaignInDB(finalPayload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Campaign created successfully! Awaiting admin approval.',
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

const getPendingCampaigns = async (_req: NextRequest) => {
  await dbConnect();
  try {
    const result = await DonationCampaignServices.getPendingCampaignsFromDB();
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Pending campaigns retrieved!',
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

const getApprovedCampaigns = async (_req: NextRequest) => {
  await dbConnect();
  try {
    const result = await DonationCampaignServices.getApprovedCampaignsFromDB();
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Approved campaigns retrieved!',
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

const getAllCampaigns = async (_req: NextRequest) => {
  await dbConnect();
  try {
    const result = await DonationCampaignServices.getAllCampaignsFromDB();
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Campaigns retrieved!',
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

const getCampaignById = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  try {
    const { id } = await context.params;
    const result = await DonationCampaignServices.getCampaignByIdFromDB(id);
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Campaign details retrieved!',
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

const moderateCampaign = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  try {
    const { id } = await context.params;
    const adminId = req.headers.get('x-user-id');
    const { action, rejectionReason } = await req.json();

    if (!action) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Action is required (approve or reject)',
        data: null,
      });
    }

    if (action === 'approve') {
      if (!adminId) {
        return sendResponse({
          success: false,
          statusCode: StatusCodes.UNAUTHORIZED,
          message: 'Admin ID not found',
          data: null,
        });
      }

      const result = await DonationCampaignServices.approveCampaignInDB(id, adminId);
      return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Campaign approved successfully!',
        data: result,
      });
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return sendResponse({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Rejection reason is required',
          data: null,
        });
      }

      const result = await DonationCampaignServices.rejectCampaignInDB(
        id,
        rejectionReason
      );
      return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Campaign rejected successfully!',
        data: result,
      });
    } else {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid action. Use "approve" or "reject"',
        data: null,
      });
    }
  } catch (error) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      data: null,
    });
  }
};

const updateCampaign = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  try {
    const { id } = await context.params;
    const body = await req.json();

    const result = await DonationCampaignServices.updateCampaignInDB(id, body);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Campaign updated successfully!',
      data: result,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to update campaign',
      data: null,
    });
  }
};

const deleteCampaign = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  try {
    const { id } = await context.params;
    const result = await DonationCampaignServices.deleteCampaignFromDB(id);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Campaign deleted successfully!',
      data: result,
    });
  } catch (error: any) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to delete campaign',
      data: null,
    });
  }
};

export const DonationCampaignController = {
  createCampaign,
  getPendingCampaigns,
  getApprovedCampaigns,
  getAllCampaigns,
  getCampaignById,
  moderateCampaign,
  updateCampaign,
  deleteCampaign,
};