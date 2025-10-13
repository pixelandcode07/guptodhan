import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { createDonationCategorySchema, updateDonationCategorySchema } from './donation-category.validation';
import { DonationCategoryServices } from './donation-category.service';
import dbConnect from '@/lib/db';

const createCategory = async (req: NextRequest) => {
    await dbConnect();
    const formData = await req.formData();
    const iconFile = formData.get('icon') as File | null;
    
    const payload: Record<string, any> = {
        name: formData.get('name')
    };

    if (iconFile) {
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'donation-category-icons');
      payload.icon = uploadResult.secure_url;
    }
    
    const validatedData = createDonationCategorySchema.parse(payload);
    const result = await DonationCategoryServices.createCategoryInDB(validatedData);
    return sendResponse({ success: true, statusCode: StatusCodes.CREATED, message: 'Donation category created!', data: result });
};

const getActiveCategories = async (_req: NextRequest) => {
    await dbConnect();
    const result = await DonationCategoryServices.getActiveCategoriesFromDB();
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Active categories retrieved!', data: result });
};

// ✅ NEW: Function to handle PATCH requests
const updateCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const formData = await req.formData();
    
    const payload: Record<string, any> = {};

    // Get text fields from form data
    if (formData.has('name')) payload.name = formData.get('name');
    if (formData.has('status')) payload.status = formData.get('status');

    // Handle optional icon upload
    const iconFile = formData.get('icon') as File | null;
    if (iconFile && iconFile.size > 0) {
        const buffer = Buffer.from(await iconFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'donation-category-icons');
        payload.icon = uploadResult.secure_url;
    }

    const validatedData = updateDonationCategorySchema.parse(payload);
    const result = await DonationCategoryServices.updateCategoryInDB(id, validatedData);
    
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Donation category updated!', data: result });
};

// ✅ NEW: Function to handle DELETE requests
const deleteCategory = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    await DonationCategoryServices.deleteCategoryFromDB(id);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Donation category deleted!', data: null });
};

const getCategoryById = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;
    const result = await DonationCategoryServices.getCategoryByIdFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Category retrieved successfully!',
        data: result,
    });
};


export const DonationCategoryController = {
  createCategory,
  getActiveCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
};