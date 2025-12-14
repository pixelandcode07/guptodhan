// ============================================
// 🔥 DONATION CAMPAIGN CONTROLLER - FIXED
// ============================================

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/utils/jwt';
import { Types } from 'mongoose';
import { createDonationCampaignSchema } from './donation-campaign.validation';
import { DonationCampaignServices } from './donation-campaign.service';

const createCampaign = async (req: NextRequest) => {
    await dbConnect();
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    const creatorId = decoded.userId;

    const formData = await req.formData();
    const images = formData.getAll('images') as File[];
    if (images.length === 0) throw new Error('At least one image is required.');
    
    // Upload Images to Cloudinary
    const uploadPromises = images.map(async file => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadToCloudinary(buffer, 'donation-campaigns');
    });
    const uploadResults = await Promise.all(uploadPromises);

    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
        if (key !== 'images') {
            payload[key] = value;
        }
    }
    
    // ✅ FIX 1: Validate before conversion
    const validatedData = createDonationCampaignSchema.parse(payload);
    
    // ✅ FIX 2: Check if category exists and is valid
    if (!validatedData.category || validatedData.category.trim() === '') {
        throw new Error('Category is required and cannot be empty');
    }

    // ✅ FIX 3: Proper ObjectId conversion with validation
    let categoryId: Types.ObjectId;
    try {
        categoryId = new Types.ObjectId(validatedData.category);
    } catch (error) {
        throw new Error('Invalid category ID format');
    }

    const finalPayload = {
        ...validatedData,
        creator: new Types.ObjectId(creatorId),
        category: categoryId,  // ✅ Use converted ID
        images: uploadResults.map(r => r.secure_url),
    };

    const result = await DonationCampaignServices.createCampaignInDB(finalPayload);
    
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.CREATED, 
        message: 'Campaign created successfully!', 
        data: result 
    });
};

const getAllCampaigns = async (_req: NextRequest) => {
    await dbConnect();
    const result = await DonationCampaignServices.getAllCampaignsFromDB();
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Campaigns retrieved successfully!', 
        data: result 
    });
};

const getCampaignById = async (
    _req: NextRequest, 
    context: { params: Promise<{ id: string }> }
) => {
    await dbConnect();
    const { id } = await context.params;

    const result = await DonationCampaignServices.getCampaignByIdFromDB(id);
    
    return sendResponse({ 
        success: true, 
        statusCode: StatusCodes.OK, 
        message: 'Campaign details retrieved!', 
        data: result 
    });
};

export const DonationCampaignController = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
};