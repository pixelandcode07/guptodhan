import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createBrandValidationSchema, updateBrandValidationSchema } from '../validations/brandName.validation';
import { BrandServices } from '../services/brandName.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new brand
const createBrand = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createBrandValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        category: new Types.ObjectId(validatedData.category),
        subCategory: new Types.ObjectId(validatedData.subCategory),
        children: validatedData.children?.map((childId: string) => new Types.ObjectId(childId)),
    };

    const result = await BrandServices.createBrandInDB(payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Brand created successfully!',
        data: result,
    });
};

// Get all brands
const getAllBrands = async () => {
    await dbConnect();
    const result = await BrandServices.getAllBrandsFromDB();

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brands retrieved successfully!',
        data: result,
    });
};

// Update brand
const updateBrand = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateBrandValidationSchema.parse(body);

    const payload = {
        ...validatedData,
        ...(validatedData.category && { category: new Types.ObjectId(validatedData.category) }),
        ...(validatedData.subCategory && { subCategory: new Types.ObjectId(validatedData.subCategory) }),
        ...(validatedData.children && {
            children: validatedData.children?.map((childId: string) => new Types.ObjectId(childId)),
        }),
    };

    const result = await BrandServices.updateBrandInDB(id, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brand updated successfully!',
        data: result,
    });
};

// Delete brand
const deleteBrand = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await BrandServices.deleteBrandFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brand deleted successfully!',
        data: null,
    });
};

export const BrandController = {
    createBrand,
    getAllBrands,
    updateBrand,
    deleteBrand,
};
