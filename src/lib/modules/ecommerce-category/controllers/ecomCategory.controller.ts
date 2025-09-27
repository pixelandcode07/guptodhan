import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createCategoryValidationSchema, 
  updateCategoryValidationSchema 
} from '../validations/ecomCategory.validation';
import { CategoryServices } from '../services/ecomCategory.service';
import dbConnect from '@/lib/db';

// Create a new category
const createCategory = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createCategoryValidationSchema.parse(body);

  const result = await CategoryServices.createCategoryInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Category created successfully!',
    data: result,
  });
};

// Get all categories
const getAllCategories = async () => {
  await dbConnect();
  const result = await CategoryServices.getAllCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Categories retrieved successfully!',
    data: result,
  });
};

// Update category
const updateCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateCategoryValidationSchema.parse(body);

  const result = await CategoryServices.updateCategoryInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category updated successfully!',
    data: result,
  });
};

// Delete category
const deleteCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await CategoryServices.deleteCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category deleted successfully!',
    data: null,
  });
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
