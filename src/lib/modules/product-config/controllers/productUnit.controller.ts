import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductUnitValidationSchema, updateProductUnitValidationSchema } from '../validations/productUnit.validation';
import { ProductUnitServices } from '../services/productUnit.service';
import dbConnect from '@/lib/db';

// Create a new product unit
const createProductUnit = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createProductUnitValidationSchema.parse(body);

    const result = await ProductUnitServices.createProductUnitInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Product unit created successfully!',
        data: result,
    });
};

// Get all product units
const getAllProductUnits = async () => {
    await dbConnect();
    const result = await ProductUnitServices.getAllProductUnitsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product units retrieved successfully!',
        data: result,
    });
};

// Get all active product units
const getAllActiveProductUnits = async () => {
    await dbConnect();
    const result = await ProductUnitServices.getAllActiveProductUnitsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Active product units retrieved successfully!',
        data: result,
    });
};

// Update product unit
const updateProductUnit = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateProductUnitValidationSchema.parse(body);

    const result = await ProductUnitServices.updateProductUnitInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product unit updated successfully!',
        data: result,
    });
};

// Delete product unit
const deleteProductUnit = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await ProductUnitServices.deleteProductUnitFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Product unit deleted successfully!',
        data: null,
    });
};

export const ProductUnitController = {
    createProductUnit,
    getAllProductUnits,
    getAllActiveProductUnits,
    updateProductUnit,
    deleteProductUnit,
};
