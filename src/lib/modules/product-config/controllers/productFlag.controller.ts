import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductFlagValidationSchema, updateProductFlagValidationSchema } from '../validations/productFlag.validation';
import { ProductFlagServices } from '../services/productFlag.service';
import dbConnect from '@/lib/db';

// Create a new product flag
const createProductFlag = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createProductFlagValidationSchema.parse(body);

    const result = await ProductFlagServices.createProductFlagInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Product flag created successfully!',
        data: result,
    });
};

// Get all product flags
const getAllProductFlags = async () => {
    await dbConnect();
    const result = await ProductFlagServices.getAllProductFlagsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product flags retrieved successfully!',
        data: result,
    });
};

// Update product flag
const updateProductFlag = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateProductFlagValidationSchema.parse(body);

    const result = await ProductFlagServices.updateProductFlagInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product flag updated successfully!',
        data: result,
    });
};

// Delete product flag
const deleteProductFlag = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await ProductFlagServices.deleteProductFlagFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product flag deleted successfully!',
        data: null,
    });
};

export const ProductFlagController = {
    createProductFlag,
    getAllProductFlags,
    updateProductFlag,
    deleteProductFlag,
};
