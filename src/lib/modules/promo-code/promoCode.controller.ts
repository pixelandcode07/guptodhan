import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createPromoCodeValidationSchema, updatePromoCodeValidationSchema } from './promoCode.validation';
import { PromoCodeServices } from './promoCode.service';
import dbConnect from '@/lib/db';

// Create a new promo code
const createPromoCode = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createPromoCodeValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endingDate: new Date(validatedData.endingDate),
    };

    const result = await PromoCodeServices.createPromoCodeInDB(payload);

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

    const payload = {
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
