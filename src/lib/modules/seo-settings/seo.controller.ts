// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\seo-settings\seo.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createOrUpdateSeoSchema } from './seo.validation';
import { SeoSettingsServices } from './seo.service';
import dbConnect from '@/lib/db';

const createOrUpdateSeoSettings = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    
    const payload: Record<string, any> = {};
    const ogImageFile = formData.get('ogImage') as File | null;

    for (const [key, value] of formData.entries()) {
        if (key !== 'ogImage' && typeof value === 'string') {
            payload[key] = value;
        }
    }

    if (ogImageFile && ogImageFile.size > 0) {
        const buffer = Buffer.from(await ogImageFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'seo-og-images');
        payload.ogImage = uploadResult.secure_url;
    }
    
    const validatedData = createOrUpdateSeoSchema.parse(payload);
    const { pageIdentifier, ...seoData } = validatedData;
    
    const result = await SeoSettingsServices.createOrUpdateSeoSettingsInDB(pageIdentifier, seoData);
    
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'SEO settings updated successfully!', data: result });
};

const getPublicSeoSettings = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    if (!page) {
        throw new Error("A 'page' query parameter is required (e.g., ?page=homepage).");
    }

    const result = await SeoSettingsServices.getPublicSeoSettingsFromDB(page);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'SEO settings retrieved successfully!', data: result });
};

export const SeoSettingsController = {
    createOrUpdateSeoSettings,
    getPublicSeoSettings,
};