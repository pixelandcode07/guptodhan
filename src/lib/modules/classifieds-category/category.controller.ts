/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createCategoryValidationSchema, updateCategoryValidationSchema } from './category.validation';
import { ClassifiedCategoryServices } from './category.service';
import dbConnect from '@/lib/db';

const createCategory = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const iconFile = formData.get('icon') as File | null;
    const payload: { name: string; icon?: string } = { name };

    if (iconFile) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'category-icons');
        payload.icon = uploadResult.secure_url;
    }

    const validatedData = createCategoryValidationSchema.parse(payload);
    const result = await ClassifiedCategoryServices.createCategoryInDB(validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Category created successfully!',
        data: result,
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllCategories = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ClassifiedCategoryServices.getAllCategoriesFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Categories retrieved successfully!',
        data: result,
    });
};

// const updateCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
//     await dbConnect();
//     const { id } = params;
//     const body = await req.json();
//     const validatedData = updateCategoryValidationSchema.parse(body);
//     const result = await ClassifiedCategoryServices.updateCategoryInDB(id, validatedData);

//     return sendResponse({
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: 'Category updated successfully!',
//         data: result,
//     });
// };

const updateCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const slug = formData.get("slug") as string | null;
    const status = formData.get("status") as string | null;
    const iconFile = formData.get("icon") as File | null;

    const payload: { name?: string; slug?: string; status?: "pending" | "active" | "inactive"; icon?: string } = {};

    if (name) payload.name = name;
    if (slug) payload.slug = slug;
    if (status) payload.status = status as "pending" | "active" | "inactive";

    if (iconFile) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, "category-icons");
        payload.icon = uploadResult.secure_url;
    }

    const validatedData = updateCategoryValidationSchema.parse(payload);
    const result = await ClassifiedCategoryServices.updateCategoryInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Category updated successfully!",
        data: result,
    });
};

const deleteCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = params;
    await ClassifiedCategoryServices.deleteCategoryFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Category deleted successfully!',
        data: null,
    });
};


const getCategoriesWithSubcategories = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ClassifiedCategoryServices.getCategoriesWithSubcategoriesFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Categories with sub-categories retrieved successfully!',
        data: result,
    });
};

const getPublicCategories = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ClassifiedCategoryServices.getPublicCategoriesFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Public categories retrieved successfully!',
        data: result,
    });
};


const getCategoryById = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const { id } = await params;
    const result = await ClassifiedCategoryServices.getCategoryByIdFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Category retrieved successfully!',
        data: result,
    });
};


export const ClassifiedCategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoriesWithSubcategories,
    getPublicCategories,
    getCategoryById,
};