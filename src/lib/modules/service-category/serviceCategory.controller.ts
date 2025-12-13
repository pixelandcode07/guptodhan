// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-category\serviceCategory.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createServiceCategorySchema, updateServiceCategorySchema } from './serviceCategory.validation';
import { ServiceCategoryServices } from './serviceCategory.service';
import dbConnect from '@/lib/db';

const createCategory = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const iconFile = formData.get('icon') as File | null;
    const payload: { name: string; icon?: string } = { name };

    if (iconFile) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'service-category-icons');
        payload.icon = uploadResult.secure_url;
    }
    
    const validatedData = createServiceCategorySchema.parse(payload);
    const result = await ServiceCategoryServices.createCategoryInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Service Category created successfully!', data: result });
};

const getAllCategories = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ServiceCategoryServices.getAllCategoriesFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Service Categories retrieved successfully!', data: result });
};

const updateCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateServiceCategorySchema.parse(body);
    const result = await ServiceCategoryServices.updateCategoryInDB(id, validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Service Category updated successfully!', data: result });
};

const deleteCategory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ServiceCategoryServices.deleteCategoryFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Service Category deleted successfully!', data: null });
};

export const ServiceCategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};