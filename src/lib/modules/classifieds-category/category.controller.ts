/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
} from './category.validation';
import { ClassifiedCategoryServices } from './category.service';
import dbConnect from '@/lib/db';
import { IClassifiedCategory } from './category.interface';

// Create Category
const createCategory = async (req: NextRequest) => {
    await dbConnect();

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const iconFile = formData.get('icon') as File | null;

    const payload: { name: string; icon?: string } = { name };

    if (iconFile && iconFile.size > 0) {
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

// Get All Categories (for Admin)
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

// Update Category
const updateCategory = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    await dbConnect();
    const { id } = await params;

    const formData = await req.formData();
    const payload: Partial<IClassifiedCategory> = {};

    const name = formData.get('name') as string | null;
    const slug = formData.get('slug') as string | null;
    const status = formData.get('status') as 'active' | 'inactive' | null;

    if (name) payload.name = name;
    if (slug) payload.slug = slug;
    if (status) payload.status = status;

    const iconFile = formData.get('icon') as File | null;

    if (iconFile && iconFile.size > 0) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'category-icons');
        payload.icon = uploadResult.secure_url;
    }

    const validatedData = updateCategoryValidationSchema.parse(payload);
    const result = await ClassifiedCategoryServices.updateCategoryInDB(id, validatedData);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Category updated successfully!',
        data: result,
    });
};

// Delete Category
const deleteCategory = async (
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    await dbConnect();
    const { id } = await params;

    await ClassifiedCategoryServices.deleteCategoryFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Category deleted successfully!',
        data: null,
    });
};

// Get Categories with their Subcategories
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

// Get Public Categories (active ones)
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

// Get a Single Category by ID
const getCategoryById = async (
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
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

// Export all controller functions
export const ClassifiedCategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory, // Only one 'deleteCategory' is now included
    getCategoriesWithSubcategories,
    getPublicCategories,
    getCategoryById,
};