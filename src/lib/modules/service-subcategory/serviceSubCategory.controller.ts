// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-subcategory\serviceSubCategory.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createServiceSubCategorySchema, updateServiceSubCategorySchema } from './serviceSubCategory.validation';
import { ServiceSubCategoryServices } from './serviceSubCategory.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

const createSubCategory = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = createServiceSubCategorySchema.parse(body);

    const payload = {
        ...validatedData,
        category: new Types.ObjectId(validatedData.category),
    };
    
    const result = await ServiceSubCategoryServices.createSubCategoryInDB(payload);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Service Sub-category created successfully!', data: result });
};

const getSubCategoriesByParent = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const result = await ServiceSubCategoryServices.getSubCategoriesByParentFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Sub-categories retrieved successfully!', data: result });
};

// নতুন: সাব-ক্যাটাগরি আপডেট করার জন্য কন্ট্রোলার
const updateSubCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateServiceSubCategorySchema.parse(body);

    const payload: any = {...validatedData};
    if (validatedData.category) {
        payload.category = new Types.ObjectId(validatedData.category);
    }

    const result = await ServiceSubCategoryServices.updateSubCategoryInDB(id, payload);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Sub-category updated successfully!', data: result });
};

// নতুন: সাব-ক্যাটাগরি ডিলিট করার জন্য কন্ট্রোলার
const deleteSubCategory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ServiceSubCategoryServices.deleteSubCategoryFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Sub-category deleted successfully!', data: null });
};

export const ServiceSubCategoryController = {
  createSubCategory,
  getSubCategoriesByParent,
  updateSubCategory,
  deleteSubCategory,
};