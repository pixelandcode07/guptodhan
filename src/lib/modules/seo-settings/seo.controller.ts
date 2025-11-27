// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\seo-settings\seo.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createOrUpdateSeoSchema } from './seo.validation';
import { SeoSettingsServices } from './seo.service';
import dbConnect from '@/lib/db';

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const createOrUpdateSeoSettings = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();

    const payload: Record<string, any> = {};
    const ogImageFile = formData.get('ogImage') as File | null;

    // ✅ Backend validation for file size
    if (ogImageFile && ogImageFile.size > 0) {
        if (ogImageFile.size > MAX_FILE_SIZE) {
            throw new Error(`Image size must be less than 1MB. Current size: ${(ogImageFile.size / 1024 / 1024).toFixed(2)}MB`);
        }
    }

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

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'SEO settings updated successfully!',
        data: result
    });
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

const updateSeoSettings = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    // createOrUpdateSeoSchema-কে partial করে update-এর জন্য ব্যবহার করা হচ্ছে
    const validatedData = createOrUpdateSeoSchema.partial().parse(body);
    const result = await SeoSettingsServices.updateSeoSettingsInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'SEO settings updated successfully!', data: result });
};

const getSeoSettingsById = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const result = await SeoSettingsServices.getSeoSettingsByIdFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'SEO settings retrieved successfully!', data: result });
};




export const SeoSettingsController = {
    createOrUpdateSeoSettings,
    getPublicSeoSettings,
    updateSeoSettings,
    getSeoSettingsById,
};