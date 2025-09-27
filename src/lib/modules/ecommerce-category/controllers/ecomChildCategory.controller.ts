import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { 
  createChildCategoryValidationSchema, 
  updateChildCategoryValidationSchema 
} from '../validations/ecomChildCategory.validation';
import { ChildCategoryServices } from '../services/ecomChildCategory.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';

// Create a new child category
const createChildCategory = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createChildCategoryValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    category: new Types.ObjectId(validatedData.category),
    subCategory: new Types.ObjectId(validatedData.subCategory),
  };

  const result = await ChildCategoryServices.createChildCategoryInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'ChildCategory created successfully!',
    data: result,
  });
};

// Get all child categories
const getAllChildCategories = async () => {
  await dbConnect();
  const result = await ChildCategoryServices.getAllChildCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategories retrieved successfully!',
    data: result,
  });
};

// Get child categories by subcategory
const getChildCategoriesBySubCategory = async (req: NextRequest, { params }: { params: { subCategoryId: string } }) => {
  await dbConnect();
  const { subCategoryId } = params;
  const result = await ChildCategoryServices.getChildCategoriesBySubCategoryFromDB(subCategoryId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategories retrieved successfully by subcategory!',
    data: result,
  });
};

// Update child category
const updateChildCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateChildCategoryValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    ...(validatedData.category && { category: new Types.ObjectId(validatedData.category) }),
    ...(validatedData.subCategory && { subCategory: new Types.ObjectId(validatedData.subCategory) }),
  };

  const result = await ChildCategoryServices.updateChildCategoryInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategory updated successfully!',
    data: result,
  });
};

// Delete child category
const deleteChildCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await ChildCategoryServices.deleteChildCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChildCategory deleted successfully!',
    data: null,
  });
};

export const ChildCategoryController = {
  createChildCategory,
  getAllChildCategories,
  getChildCategoriesBySubCategory,
  updateChildCategory,
  deleteChildCategory,
};
