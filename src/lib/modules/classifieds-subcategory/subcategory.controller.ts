// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-subcategory\subcategory.controller.ts

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createSubCategoryValidationSchema, updateSubCategoryValidationSchema } from './subcategory.validation';
import { ClassifiedSubCategoryServices } from './subcategory.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

const createSubCategory = async (req: NextRequest) => {
    await dbConnect();
    
    // সমাধান: req.json() এর পরিবর্তে req.formData() ব্যবহার করা হচ্ছে
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const categoryId = formData.get('category') as string;
    const iconFile = formData.get('icon') as File | null;

    const payload: { name: string; category: string; icon?: string } = {
        name,
        category: categoryId,
    };

    // যদি আইকন ফাইল থাকে, তাহলে সেটিকে Cloudinary-তে আপলোড করা হচ্ছে
    if (iconFile) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'subcategory-icons');
        payload.icon = uploadResult.secure_url;
    }
    
    const validatedData = createSubCategoryValidationSchema.parse(payload);
    
    // সার্ভিসকে কল করার জন্য চূড়ান্ত payload তৈরি করা হচ্ছে
    const payloadForService = {
        ...validatedData,
        category: new Types.ObjectId(validatedData.category),
    };
    
    const result = await ClassifiedSubCategoryServices.createSubCategoryInDB(payloadForService);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Sub-category created successfully!',
        data: result,
    });
};

// নতুন: সাব-ক্যাটাগরি আপডেট করার জন্য কন্ট্রোলার
const updateSubCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const validatedData = updateSubCategoryValidationSchema.parse(body);
    const result = await ClassifiedSubCategoryServices.updateSubCategoryInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Sub-category updated successfully!',
        data: result,
    });
};

// সমাধান: params-এর টাইপ { categoryId: string } থেকে { id: string } করা হয়েছে
const getSubCategoriesByParent = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params; // categoryId এর পরিবর্তে id ব্যবহার করা হচ্ছে
    const result = await ClassifiedSubCategoryServices.getSubCategoriesByParentFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Sub-categories retrieved successfully!',
        data: result,
    });
};

const getPublicSubCategoriesByParent = async (_req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    const result = await ClassifiedSubCategoryServices.getSubCategoriesByParentFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Public sub-categories retrieved successfully!',
        data: result,
    });
};


// নতুন: সাব-ক্যাটাগরি ডিলিট করার জন্য কন্ট্রোলার
const deleteSubCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ClassifiedSubCategoryServices.deleteSubCategoryFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Sub-category deleted successfully!',
        data: null,
    });
};


export const ClassifiedSubCategoryController = {
    createSubCategory,
    getSubCategoriesByParent,
    updateSubCategory,
    deleteSubCategory,
    getPublicSubCategoriesByParent,
};