import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createModelFormValidationSchema, updateModelFormValidationSchema } from '../validations/modelCreate.validation';
import { ModelFormServices } from '../services/modelCreate.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new model form
const createModelForm = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createModelFormValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        brand: new Types.ObjectId(validatedData.brand),
    };

    const result = await ModelFormServices.createModelFormInDB(payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Model form created successfully!',
        data: result,
    });
};

// Get all model forms by brand
const getModelFormsByBrand = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');
    if (!brandId) throw new Error("Brand ID is required");
    
    const result = await ModelFormServices.getModelFormsByBrandFromDB(brandId);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Model forms retrieved successfully!',
        data: result,
    });
};

// Update model form
const updateModelForm = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateModelFormValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        ...(validatedData.brand && { brand: new Types.ObjectId(validatedData.brand) }),
    };

    const result = await ModelFormServices.updateModelFormInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Model form updated successfully!',
        data: result,
    });
};

// Delete model form
const deleteModelForm = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ModelFormServices.deleteModelFormFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Model form deleted successfully!',
        data: null,
    });
};

export const ModelFormController = {
    createModelForm,
    getModelFormsByBrand,
    updateModelForm,
    deleteModelForm,
};
