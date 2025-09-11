// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\settings\settings.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { updateSettingsValidationSchema } from './settings.validation';
import { SettingsServices } from './settings.service';
import dbConnect from '@/lib/db';

const createOrUpdateSettings = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    
    const payload: Record<string, any> = {};
    const filesToUpload: { key: string; file: File, folder: string }[] = [];

    // Form data থেকে টেক্সট এবং ফাইল আলাদা করা হচ্ছে
    for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
            let folder = 'general-settings';
            if (key === 'paymentBanner' || key === 'userBanner') folder = 'banners';
            filesToUpload.push({ key, file: value, folder });
        } else if (typeof value === 'string') {
            payload[key] = value;
        }
    }

    // ফাইলগুলো Cloudinary-তে আপলোড করা হচ্ছে
    if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map(async ({ key, file, folder }) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const result = await uploadToCloudinary(buffer, folder);
            return { key, url: result.secure_url };
        });
        const uploadedFiles = await Promise.all(uploadPromises);
        uploadedFiles.forEach(({ key, url }) => {
            payload[key] = url;
        });
    }

    // "true"/"false" স্ট্রিংকে boolean-এ রূপান্তর করা হচ্ছে
    if (payload.isActive) payload.isActive = payload.isActive === 'true';

    const validatedData = updateSettingsValidationSchema.parse(payload);
    const result = await SettingsServices.createOrUpdateSettingsInDB(validatedData);
    
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Settings updated successfully!', data: result });
};

const getPublicSettings = async (_req: NextRequest) => {
    await dbConnect();
    const result = await SettingsServices.getPublicSettingsFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Settings retrieved successfully!', data: result });
};

export const SettingsController = {
    createOrUpdateSettings,
    getPublicSettings,
};