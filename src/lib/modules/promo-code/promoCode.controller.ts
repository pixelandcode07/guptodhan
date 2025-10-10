import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createPromoCodeValidationSchema, updatePromoCodeValidationSchema } from './promoCode.validation';
import { PromoCodeServices } from './promoCode.service';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';

// Create a new promo code
const createPromoCode = async (req: NextRequest) => {
    await dbConnect();
    
    const formData = await req.formData();
    
    // Extract form fields
    const promoCodeId = formData.get('promoCodeId') as string;
    const title = formData.get('title') as string;
    const startDate = formData.get('startDate') as string;
    const endingDate = formData.get('endingDate') as string;
    const type = formData.get('type') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const value = formData.get('value') as string;
    const minimumOrderAmount = formData.get('minimumOrderAmount') as string;
    const code = formData.get('code') as string;
    const status = formData.get('status') as string;
    const iconFile = formData.get('icon') as File;

    // Handle icon upload
    let iconUrl = '';
    if (iconFile && iconFile.size > 0) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploaded = await uploadToCloudinary(buffer, 'promo-codes/icons');
        iconUrl = uploaded.secure_url;
    }

    // Prepare payload for validation
    const payload = {
        promoCodeId,
        title,
        startDate,
        endingDate,
        type,
        shortDescription,
        value: Number(value),
        minimumOrderAmount: Number(minimumOrderAmount),
        code,
        status,
        icon: iconUrl,
    };

    const validatedData = createPromoCodeValidationSchema.parse(payload);

    const finalPayload = {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endingDate: new Date(validatedData.endingDate),
    };

    const result = await PromoCodeServices.createPromoCodeInDB(finalPayload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Promo code created successfully!',
        data: result,
    });
};

// Get all promo codes
const getAllPromoCodes = async () => {
    await dbConnect();
    const result = await PromoCodeServices.getAllPromoCodesFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Promo codes retrieved successfully!',
        data: result,
    });
};

// Get promo code by code string
const getPromoCodeByCode = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = await  params;
    const result = await PromoCodeServices.getPromoCodeByCodeFromDB(id);

    return sendResponse({
        success: true,
        statusCode: result ? StatusCodes.OK : StatusCodes.NOT_FOUND,
        message: result ? 'Promo code retrieved successfully!' : 'Promo code not found.',
        data: result,
    });
};

// Update promo code
const updatePromoCode = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updatePromoCodeValidationSchema.parse(body);

    const payload: Record<string, unknown> = {
        ...validatedData,
        ...(validatedData.startDate && { startDate: new Date(validatedData.startDate) }),
        ...(validatedData.endingDate && { endingDate: new Date(validatedData.endingDate) }),
    };

    const result = await PromoCodeServices.updatePromoCodeInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Promo code updated successfully!',
        data: result,
    });
};

// Delete promo code
const deletePromoCode = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await PromoCodeServices.deletePromoCodeFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Promo code deleted successfully!',
        data: null,
    });
};

export const PromoCodeController = {
    createPromoCode,
    getAllPromoCodes,
    getPromoCodeByCode,
    updatePromoCode,
    deletePromoCode,
};
