import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createDonationCategorySchema, updateDonationCategorySchema } from './donation-category.validation';
import { DonationCategoryServices } from './donation-category.service';
import dbConnect from '@/lib/db';
import { ZodError } from 'zod';

const createCategory = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    const iconFile = formData.get('icon') as File | null;
    
    const payload: Record<string, any> = {
        name: formData.get('name')
    };

    if (iconFile) {
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'donation-category-icons');
      payload.icon = uploadResult.secure_url;
    }
    
    const validatedData = createDonationCategorySchema.parse(payload);
    const result = await DonationCategoryServices.createCategoryInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Donation category created!', data: result });
};

const getActiveCategories = async (_req: NextRequest) => {
    await dbConnect();
    const result = await DonationCategoryServices.getActiveCategoriesFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Active categories retrieved!', data: result });
};

export const DonationCategoryController = {
  createCategory,
  getActiveCategories,
};