import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStorageTypeValidationSchema, updateStorageTypeValidationSchema } from '../validations/storageType.validation';
import { StorageTypeServices } from '../services/storageType.service';
import dbConnect from '@/lib/db';

// Create a new storage type
const createStorageType = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createStorageTypeValidationSchema.parse(body);

    const result = await StorageTypeServices.createStorageTypeInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Storage type created successfully!',
        data: result,
    });
};

// Get all storage types
const getAllStorageTypes = async () => {
    await dbConnect();
    const result = await StorageTypeServices.getAllStorageTypesFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Storage types retrieved successfully!',
        data: result,
    });
};

// Update storage type
const updateStorageType = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateStorageTypeValidationSchema.parse(body);

    const result = await StorageTypeServices.updateStorageTypeInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Storage type updated successfully!',
        data: result,
    });
};

// Delete storage type
const deleteStorageType = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await StorageTypeServices.deleteStorageTypeFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Storage type deleted successfully!',
        data: null,
    });
};

export const StorageTypeController = {
    createStorageType,
    getAllStorageTypes,
    updateStorageType,
    deleteStorageType,
};
