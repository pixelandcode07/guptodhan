import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createTermsValidationSchema, updateTermsValidationSchema } from './termsCon.validation';
import { TermsServices } from './termsCon.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new term
const createTerms = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createTermsValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        category: new Types.ObjectId(validatedData.category),
    };

    const result = await TermsServices.createTermsInDB(payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Term created successfully!',
        data: result,
    });
};

// Get all terms
const getAllTerms = async () => {
    await dbConnect();
    const result = await TermsServices.getAllTermsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms retrieved successfully!',
        data: result,
    });
};

// Get terms by category
const getTermsByCategory = async ({ params }: { params: { categoryId: string } }) => {
    await dbConnect();
    const result = await TermsServices.getTermsByCategoryFromDB(params.categoryId);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Terms retrieved successfully by category!',
        data: result,
    });
};

// Update a term
const updateTerms = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateTermsValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        ...(validatedData.category && { category: new Types.ObjectId(validatedData.category) }),
    };

    const result = await TermsServices.updateTermsInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Term updated successfully!',
        data: result,
    });
};

// Delete a term
const deleteTerms = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await TermsServices.deleteTermsFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Term deleted successfully!',
        data: null,
    });
};

export const TermsController = {
    createTerms,
    getAllTerms,
    getTermsByCategory,
    updateTerms,
    deleteTerms,
};
