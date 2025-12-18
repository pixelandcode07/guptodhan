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

// ... createCampaign এবং getAllCampaigns আগের মতোই থাকবে ...
const createCampaign = async (req: NextRequest) => {
    // আপনার আগের কোড...
    // (সংক্ষিপ্ততার জন্য রিপিট করলাম না, আগেরটাই রাখবেন)
    await dbConnect();
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) throw new Error('Unauthorized');
        const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
        const creatorId = decoded.userId;
        const formData = await req.formData();
        const images = formData.getAll('images') as File[];
        
        // Image Upload Logic...
        const uploadResults = images.length > 0 ? await Promise.all(
            images.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                return uploadToCloudinary(buffer, 'donation-campaigns');
            })
        ) : [];

        const payload: Record<string, any> = {};
        for (const [key, value] of formData.entries()) {
            if (key !== 'images') payload[key] = value;
        }

        const validatedData = createDonationCampaignSchema.parse(payload);
        
        let categoryId: Types.ObjectId;
        try { categoryId = new Types.ObjectId(validatedData.category); } 
        catch { return sendResponse({ success: false, statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid category ID', data: null }); }

        const finalPayload = {
            ...validatedData,
            creator: new Types.ObjectId(creatorId),
            category: categoryId,
            images: uploadResults.map((img) => img.secure_url),
        };

        const result = await DonationCampaignServices.createCampaignInDB(finalPayload);
        return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Campaign created successfully!', data: result });

    } catch (error) {
        if (error instanceof ZodError) {
            return sendResponse({ success: false, statusCode: StatusCodes.BAD_REQUEST, message: "Validation Error", data: error.issues });
        }
        return sendResponse({ success: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: (error as Error).message, data: null });
    }
};

const getAllCampaigns = async (_req: NextRequest) => {
  await dbConnect();
  const result = await DonationCampaignServices.getAllCampaignsFromDB();
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Campaigns retrieved!', data: result });
};

const getCampaignById = async (_req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await context.params;
  const result = await DonationCampaignServices.getCampaignByIdFromDB(id);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Campaign details retrieved!', data: result });
};

// ✅ NEW: Update Campaign Controller
const updateCampaign = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    try {
        const { id } = await context.params;
        const body = await req.json(); // বডি থেকে ডাটা নিচ্ছি (JSON ফরম্যাটে)
        
        // এখানে চাইলে Zod ভ্যালিডেশন লাগাতে পারেন (Partial Schema দিয়ে)
        
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

// ✅ NEW: Delete Campaign Controller
const deleteCampaign = async (_req: NextRequest, context: { params: Promise<{ id: string }> }) => {
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
  getAllCampaigns,
  getCampaignById,
  updateCampaign, // Exported
  deleteCampaign, // Exported
};