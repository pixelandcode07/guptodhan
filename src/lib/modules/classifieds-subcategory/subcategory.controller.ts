
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

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const categoryId = formData.get('category') as string;
    const iconFile = formData.get('icon') as File | null;

    const payload: { name: string; category: string; icon?: string } = {
        name,
        category: categoryId,
    };

    if (iconFile) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'subcategory-icons');
        payload.icon = uploadResult.secure_url;
    }

    const validatedData = createSubCategoryValidationSchema.parse(payload);

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

const updateSubCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const formData = await req.formData();
    
    const payload: Record<string, any> = {};

    // FormData থেকে টেক্সট ফিল্ডগুলো নেওয়া হচ্ছে
    for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && value) {
            payload[key] = value;
        }
    }

    // যদি নতুন আইকন ফাইল পাঠানো হয়, তবে সেটি আপলোড করা হচ্ছে
    const iconFile = formData.get('icon') as File | null;
    if (iconFile && iconFile.size > 0) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'subcategory-icons');
        payload.icon = uploadResult.secure_url;
    }
    
    const validatedData = updateSubCategoryValidationSchema.parse(payload);

    // যদি নতুন প্যারেন্ট ক্যাটাগরি পাঠানো হয়, সেটিকে ObjectId-তে রূপান্তর করা হচ্ছে
    const payloadForService: any = { ...validatedData };
    if (validatedData.category) {
        payloadForService.category = new Types.ObjectId(validatedData.category);
    }
    
    const result = await ClassifiedSubCategoryServices.updateSubCategoryInDB(id, payloadForService);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Sub-category updated successfully!',
        data: result,
    });
};


const getSubCategoriesByParent = async (req: NextRequest, context: any) => {
    await dbConnect();

    // context.params.awaitable → await করে ব্যবহার করতে হবে
    const params = await context.params;
    if (!params || !params.id) {
        throw new Error("Category ID is required in the route params.");
    }
    const id = params.id;

    const result = await ClassifiedSubCategoryServices.getSubCategoriesByParentFromDB(id);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Sub-categories retrieved successfully!",
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


const deleteSubCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    
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