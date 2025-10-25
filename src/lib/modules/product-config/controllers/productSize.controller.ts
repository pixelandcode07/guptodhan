import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductSizeValidationSchema, updateProductSizeValidationSchema } from '../validations/productSize.validation';
import { ProductSizeServices } from '../services/productSize.service';
import dbConnect from '@/lib/db';

// Create a new product size
const createProductSize = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createProductSizeValidationSchema.parse(body);

    const result = await ProductSizeServices.createProductSizeInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Product size created successfully!',
        data: result,
    });
};

// Get all product sizes
const getAllProductSizes = async () => {
    await dbConnect();
    const result = await ProductSizeServices.getAllProductSizesFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product sizes retrieved successfully!',
        data: result,
    });
};

// Update product size
const updateProductSize = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateProductSizeValidationSchema.parse(body);

    const result = await ProductSizeServices.updateProductSizeInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product size updated successfully!',
        data: result,
    });
};

// Delete product size
const deleteProductSize = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await ProductSizeServices.deleteProductSizeFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product size deleted successfully!',
        data: null,
    });
};

export const ProductSizeController = {
    createProductSize,
    getAllProductSizes,
    updateProductSize,
    deleteProductSize,
};
