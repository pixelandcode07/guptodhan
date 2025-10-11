import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createFAQCategoryValidationSchema, updateFAQCategoryValidationSchema } from './faqCategory.validation';
import { FAQCategoryServices } from './faqCategory.service';
import { IFAQCategory } from './faqCategory.interface';
import dbConnect from '@/lib/db';

// Create a new FAQ Category
const createFAQCategory = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();
    const validatedData = createFAQCategoryValidationSchema.parse(body);

    const payload: Partial<IFAQCategory> = {
      name: validatedData.name,
      isActive: validatedData.isActive ?? true,
    };

    const result = await FAQCategoryServices.createFAQCategoryInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'FAQ Category created successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Error creating FAQ Category:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to create FAQ Category',
      data: null,
    });
  }
};

// Get all FAQ Categories
const getAllFAQCategories = async () => {
  await dbConnect();
  const result = await FAQCategoryServices.getAllFAQCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'FAQ Categories retrieved successfully!',
    data: result,
  });
};

// Get all active FAQ Categories
const getActiveFAQCategories = async () => {
  await dbConnect();
  const result = await FAQCategoryServices.getActiveFAQCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Active FAQ Categories retrieved successfully!',
    data: result,
  });
};

// Update FAQ Category
const updateFAQCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateFAQCategoryValidationSchema.parse(body);

  const payload: Partial<IFAQCategory> = {};
  if (validatedData.name) payload.name = validatedData.name;
  if (validatedData.isActive !== undefined) payload.isActive = validatedData.isActive;

  const result = await FAQCategoryServices.updateFAQCategoryInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'FAQ Category updated successfully!',
    data: result,
  });
};

// Delete FAQ Category
const deleteFAQCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  await FAQCategoryServices.deleteFAQCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'FAQ Category deleted successfully!',
    data: null,
  });
};

export const FAQCategoryController = {
  createFAQCategory,
  getAllFAQCategories,
  getActiveFAQCategories,
  updateFAQCategory,
  deleteFAQCategory,
};
