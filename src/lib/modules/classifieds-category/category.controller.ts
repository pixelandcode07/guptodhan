/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
} from './category.validation';
import { ClassifiedCategoryServices, reorderClassifiedCategoryService } from './category.service';
import dbConnect from '@/lib/db';
import { IClassifiedCategory } from './category.interface';
import { ClassifiedAdServices } from '../classifieds/ad.service';

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
// ✅ NEW: Get public categories with ad counts
const getPublicCategoriesWithCounts = async (req: NextRequest) => {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId'); // UI থেকে পাঠাবে

    const result = await ClassifiedCategoryServices.getPublicCategoriesWithCountsFromDB(categoryId || undefined);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: categoryId
            ? 'Specific category ad counts retrieved successfully!'
            : 'All categories with ad counts retrieved successfully!',
        data: result,
    });
};


const searchAds = async (req: NextRequest) => {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const filters: Record<string, any> = {};

    // Read all possible filters from the URL query
    if (searchParams.get('category')) filters.category = searchParams.get('category');
    if (searchParams.get('subCategory')) filters.subCategory = searchParams.get('subCategory');
    if (searchParams.get('brand')) filters.brand = searchParams.get('brand');
    if (searchParams.get('division')) filters.division = searchParams.get('division');
    if (searchParams.get('district')) filters.district = searchParams.get('district');
    if (searchParams.get('upazila')) filters.upazila = searchParams.get('upazila');
    if (searchParams.get('minPrice')) filters.minPrice = searchParams.get('minPrice');
    if (searchParams.get('maxPrice')) filters.maxPrice = searchParams.get('maxPrice');

    const result = await ClassifiedAdServices.searchAdsInDB(filters);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Ads retrieved based on search criteria',
        data: result
    });
};


// Reorder buy and sell (drag-and-drop)
const reorderClassifiedCategory = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const { orderedIds } = body;

    // Validate input
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return sendResponse({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Invalid request: "orderedIds" must be a non-empty array.',
            data: null,
        });
    }

    // Call the reorder service
    const result = await reorderClassifiedCategoryService(orderedIds);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message || "Buy and sell / classified reordered successfully!",
        data: null,
    });
};


// Export all controller functions
export const ClassifiedCategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoriesWithSubcategories,
    getPublicCategories,
    getCategoryById,
    getPublicCategoriesWithCounts,
    searchAds,

    reorderClassifiedCategory
};