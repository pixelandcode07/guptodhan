/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createBrandValidationSchema, updateBrandValidationSchema } from './brand.validation';
import { BrandServices } from './brand.service';
import dbConnect from '@/lib/db';

const createBrand = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const logoFile = formData.get('logo') as File | null;
    const payload: { name: string; logo?: string } = { name };

    if (logoFile) {
        const buffer = Buffer.from(await logoFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'brand-logos');
        payload.logo = uploadResult.secure_url;
    }
    
    const validatedData = createBrandValidationSchema.parse(payload);
    const result = await BrandServices.createBrandInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Brand created successfully!',
        data: result,
    });
};

const getAllBrands = async (_req: NextRequest) => {
    await dbConnect();
    const result = await BrandServices.getAllBrandsFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brands retrieved successfully!',
        data: result,
    });
};

const updateBrand = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateBrandValidationSchema.parse(body);
    const result = await BrandServices.updateBrandInDB(id, validatedData);
    
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brand updated successfully!',
        data: result,
    });
};

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

const getBrandById = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const result = await BrandServices.getBrandByIdFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Brand retrieved successfully!',
        data: result,
    });
};

export const BrandController = {
    createBrand,
    getAllBrands,
    updateBrand,
    deleteBrand,
    getBrandById,
};