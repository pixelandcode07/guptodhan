/* eslint-disable @typescript-eslint/no-unused-vars */
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-fact\fact.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createFactValidationSchema, updateFactValidationSchema } from './fact.validation';
import { AboutFactServices } from './fact.service';
import dbConnect from '@/lib/db';

const createFact = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createFactValidationSchema.parse(body);
    const result = await AboutFactServices.createFactInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Fact created successfully!', data: result });
};

const getPublicFacts = async (_req: NextRequest) => {
    await dbConnect();
    const result = await AboutFactServices.getPublicFactsFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Facts retrieved successfully!', data: result });
};

const updateFact = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateFactValidationSchema.parse(body);
    const result = await AboutFactServices.updateFactInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Fact updated successfully!', data: result });
};

const deleteFact = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await AboutFactServices.deleteFactFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Fact deleted successfully!', data: null });
};

const getFactById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const result = await AboutFactServices.getFactByIdFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Fact retrieved successfully!',
        data: result,
    });
};

export const AboutFactController = {
    createFact,
    getPublicFacts,
    updateFact,
    deleteFact,
    getFactById,
};