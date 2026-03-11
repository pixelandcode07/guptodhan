import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createFAQValidationSchema, updateFAQValidationSchema } from './faq.validation';
import { FAQServices } from './faq.service';
import dbConnect from '@/lib/db';

// Create a new FAQ
const createFAQ = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createFAQValidationSchema.parse(body);

    const payload = {
        ...validatedData,
    };

    const result = await FAQServices.createFAQInDB(payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'FAQ created successfully!',
        data: result,
    });
};

// Get all FAQs
const getAllFAQs = async () => {
    await dbConnect();
    const result = await FAQServices.getAllFAQsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'FAQs retrieved successfully!',
        data: result,
    });
};

// Update FAQ (✅ FIXED: params is a Promise)
const updateFAQ = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    
    // ✅ Next.js 15 requires awaiting params
    const { id } = await context.params;
    
    const body = await req.json();
    const validatedData = updateFAQValidationSchema.parse(body);

    const payload = {
        ...validatedData,
    };

    const result = await FAQServices.updateFAQInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'FAQ updated successfully!',
        data: result,
    });
};

// Delete FAQ (✅ FIXED: params is a Promise)
const deleteFAQ = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    
    // ✅ Next.js 15 requires awaiting params
    const { id } = await context.params;
    
    await FAQServices.deleteFAQFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'FAQ deleted successfully!',
        data: null,
    });
};

export const FAQController = {
    createFAQ,
    getAllFAQs,
    updateFAQ,
    deleteFAQ,
};