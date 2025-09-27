import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createSubCategoryValidationSchema, 
  updateSubCategoryValidationSchema 
} from '../validations/ecomSubCategory.validation';
import { SubCategoryServices } from '../services/ecomSubCategory.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new subcategory
const createSubCategory = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createSubCategoryValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    category: new Types.ObjectId(validatedData.category),
  };

  const result = await SubCategoryServices.createSubCategoryInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'SubCategory created successfully!',
    data: result,
  });
};

// Get all subcategories
const getAllSubCategories = async () => {
  await dbConnect();
  const result = await SubCategoryServices.getAllSubCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategories retrieved successfully!',
    data: result,
  });
};

// Get subcategories by category
const getSubCategoriesByCategory = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
  await dbConnect();
  const { categoryId } = params;
  const result = await SubCategoryServices.getSubCategoriesByCategoryFromDB(categoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategories retrieved successfully by category!',
    data: result,
  });
};

// Update subcategory
const updateSubCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateSubCategoryValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    ...(validatedData.category && { category: new Types.ObjectId(validatedData.category) }),
  };

  const result = await SubCategoryServices.updateSubCategoryInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategory updated successfully!',
    data: result,
  });
};

// Delete subcategory
const deleteSubCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await SubCategoryServices.deleteSubCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'SubCategory deleted successfully!',
    data: null,
  });
};

export const SubCategoryController = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
};
