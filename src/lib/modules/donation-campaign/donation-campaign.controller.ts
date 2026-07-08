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

// ✅ HELPER: টোকেন থেকে ইউজার ডাটা বের করার ফাংশন
const getUserDetailsFromToken = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Authorization token missing or invalid.');
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!) as { userId: string; role: string };
  return { userId: decoded.userId, role: decoded.role };
};

const createCampaign = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { userId } = getUserDetailsFromToken(req);

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
      if (key !== 'images') {
        if (key === 'goalAmount' || key === 'quantity') {
            payload[key] = Number(value);
        } else {
            payload[key] = value;
        }
      }
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

    // ✅ MAGIC FIX: endDate স্ট্রিং হিসেবে আসলে সেটাকে Date Object-এ কনভার্ট করা হলো
    const finalPayload = {
      ...validatedData,
      creator: new Types.ObjectId(userId),
      category: categoryId,
      images: uploadResults.map((img) => img.secure_url),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined, // কনভার্সন
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
    const { userId } = getUserDetailsFromToken(req); 
    const { id } = await context.params;
    
    const formData = await req.formData();
    const payload: any = {};

    // 1. Handle Text Fields
    payload.title = formData.get('title');
    payload.item = formData.get('item');
    payload.description = formData.get('description');
    
    // ✅ Handle new fields during update
    if (formData.get('goalAmount')) payload.goalAmount = Number(formData.get('goalAmount'));
    if (formData.get('quantity')) payload.quantity = Number(formData.get('quantity'));
    if (formData.get('endDate')) payload.endDate = new Date(formData.get('endDate') as string);
    
    payload.category = new Types.ObjectId(formData.get('category') as string);

    // 2. Handle Images (Existing + New)
    const existingImages = formData.getAll('existingImages') as string[];
    const newImageFiles = formData.getAll('newImages') as File[];

    let finalImages = [...existingImages];

    if (newImageFiles.length > 0) {
      const uploadResults = await Promise.all(
        newImageFiles.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return uploadToCloudinary(buffer, 'donation-campaigns');
        })
      );
      finalImages = [...finalImages, ...uploadResults.map(r => r.secure_url)];
    }
    payload.images = finalImages;

    // 3. Service Call
    const result = await DonationCampaignServices.updateCampaignInDB(id, userId, payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Campaign updated successfully! It is now pending for admin review.',
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

// ✅ DELETE CAMPAIGN
const deleteCampaign = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  try {
    const { userId, role } = getUserDetailsFromToken(req);
    const { id } = await context.params;
    const result = await DonationCampaignServices.deleteCampaignFromDB(id, userId, role);

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