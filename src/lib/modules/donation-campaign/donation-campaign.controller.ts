/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    
    const validatedData = createDonationCampaignSchema.parse(payload);
    
    const finalPayload = {
        ...validatedData,
        creator: new Types.ObjectId(creatorId),
        category: new Types.ObjectId(validatedData.category),
        images: uploadResults.map(r => r.secure_url),
    };

    const result = await DonationCampaignServices.createCampaignInDB(finalPayload);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Campaign created!', data: result });
};

const getAllCampaigns = async (_req: NextRequest) => {
    await dbConnect();
    const result = await DonationCampaignServices.getAllCampaignsFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Campaigns retrieved!', data: result });
};

const getCampaignById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const result = await DonationCampaignServices.getCampaignByIdFromDB(params.id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Campaign details retrieved!', data: result });
};

export const DonationCampaignController = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
};