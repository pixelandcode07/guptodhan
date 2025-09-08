// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-banner\banner.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createBannerValidationSchema } from './banner.validation';
import { ClassifiedBannerServices } from './banner.service';
import dbConnect from '@/lib/db';

const createBanner = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    
    const bannerImageFile = formData.get('bannerImage') as File | null;
    const bannerDescription = formData.get('bannerDescription') as string;

    if (!bannerImageFile) {
        throw new Error('Banner image is required.');
    }

    const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'buy-sell-banners');
    
    const payload = {
        bannerImage: uploadResult.secure_url,
        bannerDescription: bannerDescription,
    };
    
    const validatedData = createBannerValidationSchema.parse(payload);
    const result = await ClassifiedBannerServices.createBannerInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Banner created successfully!',
        data: result,
    });
};

const getAllPublicBanners = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ClassifiedBannerServices.getAllPublicBannersFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banners retrieved successfully!',
        data: result,
    });
};

const deleteBanner = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ClassifiedBannerServices.deleteBannerFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banner deleted successfully!',
        data: null,
    });
};

export const ClassifiedBannerController = {
    createBanner,
    getAllPublicBanners,
    deleteBanner,
};