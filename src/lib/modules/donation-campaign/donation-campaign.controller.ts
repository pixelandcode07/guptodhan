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
    // 🔐 Auth
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');

    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    const creatorId = decoded.userId;

    // 📦 Form Data
    const formData = await req.formData();
    const images = formData.getAll('images') as File[];

    if (images.length === 0) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'At least one image is required',
        data: null,
      });
    }

    // ☁️ Upload images
    const uploadResults = await Promise.all(
      images.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadToCloudinary(buffer, 'donation-campaigns');
      })
    );

    // 🧾 Build payload
    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') payload[key] = value;
    }

    // ✅ Zod validation
    const validatedData = createDonationCampaignSchema.parse(payload);

    // 🏷️ Category ObjectId check
    let categoryId: Types.ObjectId;
    try {
      categoryId = new Types.ObjectId(validatedData.category);
    } catch {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid category ID format',
        data: null,
      });
    }

    // 📌 Final payload
    const finalPayload = {
      ...validatedData,
      creator: new Types.ObjectId(creatorId),
      category: categoryId,
      images: uploadResults.map((img) => img.secure_url),
    };

    const result =
      await DonationCampaignServices.createCampaignInDB(finalPayload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Campaign created successfully!',
      data: result,
    });

  } catch (error) {

    // ❗ Zod validation error (FIXED PART)
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

    console.error('Create Campaign Error:', error);

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        error instanceof Error ? error.message : 'Something went wrong',
      data: null,
    });
  }
};

const getAllCampaigns = async (_req: NextRequest) => {
  await dbConnect();

  const result =
    await DonationCampaignServices.getAllCampaignsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Campaigns retrieved successfully!',
    data: result,
  });
};

const getCampaignById = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  const { id } = await context.params;
  const result =
    await DonationCampaignServices.getCampaignByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Campaign details retrieved!',
    data: result,
  });
};

export const DonationCampaignController = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
};
