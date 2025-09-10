import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductColorValidationSchema, updateProductColorValidationSchema } from '../validations/productColor.validation';
import { ProductColorServices } from '../services/productColor.service';
import dbConnect from '@/lib/db';

// Create a new product color
const createProductColor = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createProductColorValidationSchema.parse(body);

    const result = await ProductColorServices.createProductColorInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Product color created successfully!',
        data: result,
    });
};

// Get all product colors
const getAllProductColors = async () => {
    await dbConnect();
    const result = await ProductColorServices.getAllProductColorsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product colors retrieved successfully!',
        data: result,
    });
};

// Update product color
const updateProductColor = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateProductColorValidationSchema.parse(body);

    const result = await ProductColorServices.updateProductColorInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product color updated successfully!',
        data: result,
    });
};

// Delete product color
const deleteProductColor = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ProductColorServices.deleteProductColorFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product color deleted successfully!',
        data: null,
    });
};

export const ProductColorController = {
    createProductColor,
    getAllProductColors,
    updateProductColor,
    deleteProductColor,
};
