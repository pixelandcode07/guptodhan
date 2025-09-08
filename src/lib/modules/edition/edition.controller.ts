// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\edition\edition.controller.ts
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createEditionValidationSchema, updateEditionValidationSchema } from './edition.validation';
import { EditionServices } from './edition.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

const createEdition = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createEditionValidationSchema.parse(body);
    const payload = { ...validatedData, productModel: new Types.ObjectId(validatedData.productModel) };
    const result = await EditionServices.createEditionInDB(payload);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Edition created successfully!', data: result });
};

const getEditionsByModel = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const modelId = searchParams.get('modelId');
    if (!modelId) { throw new Error("Model ID is required to fetch editions."); }
    const result = await EditionServices.getEditionsByModelFromDB(modelId);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Editions retrieved successfully!', data: result });
};

const updateEdition = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateEditionValidationSchema.parse(body);
    const result = await EditionServices.updateEditionInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Edition updated successfully!', data: result });
};

const deleteEdition = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await EditionServices.deleteEditionFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Edition deleted successfully!', data: null });
};

export const EditionController = {
    createEdition,
    getEditionsByModel,
    updateEdition,
    deleteEdition,
};