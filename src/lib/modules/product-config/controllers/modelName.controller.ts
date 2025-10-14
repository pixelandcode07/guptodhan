import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createModelFormValidationSchema, updateModelFormValidationSchema } from '../validations/modelCreate.validation';
import { ModelFormServices } from '../services/modelCreate.service';
import { IModelForm } from '../interfaces/modelCreate.interface';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new model form
const createModelForm = async (req: NextRequest) => {
    try {
        await dbConnect();
        const body = await req.json();
        console.log('Received body:', body);
        
        // Since we're using static brand names from dropdown, we'll use a placeholder ObjectId
        // The brand name will be stored as a string in the model
        const placeholderBrandId = "000000000000000000000000"; // 24-character ObjectId placeholder

        const validatedData = createModelFormValidationSchema.parse({
            ...body,
            brand: placeholderBrandId,
        });
        console.log('Validated data:', validatedData);

        const payload = {
            ...validatedData,
            brand: new Types.ObjectId(validatedData.brand),
            brandName: body.brand, // Store the actual brand name as a separate field
        };
        console.log('Payload:', payload);

        const result = await ModelFormServices.createModelFormInDB(payload);
        console.log('Created result:', result);

        return sendResponse({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Model form created successfully!',
            data: result,
        });
    } catch (error: any) {
        console.error('Error creating model:', error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            if (duplicateField === 'modelCode') {
                return sendResponse({
                    success: false,
                    statusCode: StatusCodes.CONFLICT,
                    message: 'Model Code already exists. Please use a different code.',
                    data: null,
                });
            } else if (duplicateField === 'modelFormId') {
                return sendResponse({
                    success: false,
                    statusCode: StatusCodes.CONFLICT,
                    message: 'Model Name already exists. Please use a different name.',
                    data: null,
                });
            }
        }
        
        return sendResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Failed to create model',
            data: null,
        });
    }
};

// Get all model forms
const getAllModelForms = async () => {
    await dbConnect();
    const result = await ModelFormServices.getAllModelFormsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Model forms retrieved successfully!',
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
const updateModelForm = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateModelFormValidationSchema.parse(body);

    const payload: Partial<IModelForm> = {};
    
    if (validatedData.modelFormId) payload.modelFormId = validatedData.modelFormId;
    if (validatedData.modelName) payload.modelName = validatedData.modelName;
    if (validatedData.modelCode) payload.modelCode = validatedData.modelCode;
    if (validatedData.status) payload.status = validatedData.status;
    if (validatedData.brand) {
        payload.brand = new Types.ObjectId(validatedData.brand);
    }

    const result = await ModelFormServices.updateModelFormInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Model form updated successfully!',
        data: result,
    });
};

// Delete model form
const deleteModelForm = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
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
    getAllModelForms,
    getModelFormsByBrand,
    updateModelForm,
    deleteModelForm,
};
