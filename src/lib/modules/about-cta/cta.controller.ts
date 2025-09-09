// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-cta\cta.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createCtaValidationSchema, updateCtaValidationSchema } from './cta.validation';
import { AboutCtaServices } from './cta.service';
import dbConnect from '@/lib/db';

const createCta = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    const imageFile = formData.get('ctaImage') as File | null;
    if (!imageFile) throw new Error('CTA image is required.');
    
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'about-section');
    
    const payload = {
        ctaImage: uploadResult.secure_url,
        ctaTitle: formData.get('ctaTitle') as string,
        ctaLink: formData.get('ctaLink') as string,
        ctaButtonText: formData.get('ctaButtonText') as string,
        ctaDescription: formData.get('ctaDescription') as string | undefined,
    };

    const validatedData = createCtaValidationSchema.parse(payload);
    const result = await AboutCtaServices.createCtaInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'CTA created successfully!', data: result });
};

const getPublicCta = async (_req: NextRequest) => {
    await dbConnect();
    const result = await AboutCtaServices.getPublicCtaFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'CTA retrieved successfully!', data: result });
};

const updateCta = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateCtaValidationSchema.parse(body);
    const result = await AboutCtaServices.updateCtaInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'CTA updated successfully!', data: result });
};

export const AboutCtaController = {
    createCta,
    getPublicCta,
    updateCta,
};