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
import { ClassifiedAdServices } from '../classifieds/ad.service';

// Helper: Slug Generator
const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Create Category
const createCategory = async (req: NextRequest) => {
    await dbConnect();

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const iconFile = formData.get('icon') as File | null;

    // 🔥 ১. Slug জেনারেট করা হলো
    const slug = generateSlug(name);

    const payload: any = { name };

    if (iconFile && iconFile.size > 0) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'category-icons');
        payload.icon = uploadResult.secure_url;
    }

    // ২. Zod দিয়ে ভ্যালিডেশন করা হলো (যাতে slug রিমুভ হলেও সমস্যা নেই)
    const validatedData = createCategoryValidationSchema.parse(payload);

    // 🔥 ৩. ভ্যালিডেশনের পর ম্যানুয়ালি slug অ্যাড করে ডাটাবেসে পাঠানো হলো
    const finalDataToSave = {
        ...validatedData,
        slug // Ensuring slug is passed to DB
    };

    const result = await ClassifiedCategoryServices.createCategoryInDB(finalDataToSave);

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
    let slug = formData.get('slug') as string | null;
    const status = formData.get('status') as 'active' | 'inactive' | null;

    if (name) {
        payload.name = name;
        if (!slug) {
            slug = generateSlug(name); // Generate if not provided
        }
    }
    
    if (status) payload.status = status;

    const iconFile = formData.get('icon') as File | null;

    if (iconFile && iconFile.size > 0) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'category-icons');
        payload.icon = uploadResult.secure_url;
    }

    const validatedData = updateCategoryValidationSchema.parse(payload);

    // 🔥 Ensure slug is passed when updating
    const finalDataToUpdate: any = {
        ...validatedData,
    };
    if (slug) {
        finalDataToUpdate.slug = slug;
    }

    const result = await ClassifiedCategoryServices.updateCategoryInDB(id, finalDataToUpdate);

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

// Get public categories with ad counts
const getPublicCategoriesWithCounts = async (req: NextRequest) => {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId'); 

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

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return sendResponse({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Invalid request: "orderedIds" must be a non-empty array.',
            data: null,
        });
    }

    const result = await ClassifiedCategoryServices.reorderClassifiedCategoryService(orderedIds);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message || "Buy and sell / classified reordered successfully!",
        data: null,
    });
};

// Single API Controller for Category Page
const getCategoryPageDataBySlug = async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    await dbConnect();
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const { searchParams } = new URL(req.url);

    const filters = {
        search: searchParams.get('search') || undefined,
        subCategory: searchParams.getAll('subCategory').length > 0 ? searchParams.getAll('subCategory') : undefined,
        brand: searchParams.getAll('brand').length > 0 ? searchParams.getAll('brand') : undefined,
        district: searchParams.getAll('district').length > 0 ? searchParams.getAll('district') : undefined,
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
        sort: searchParams.get('sort') || undefined,
    };

    const result = await ClassifiedCategoryServices.getCategoryPageDataBySlugFromDB(decodedSlug, filters);

    if (!result) {
        return sendResponse({ success: false, statusCode: StatusCodes.NOT_FOUND, message: 'Category not found', data: null });
    }

    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Data retrieved', data: result });
};

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
    reorderClassifiedCategory,
    getCategoryPageDataBySlug,
};