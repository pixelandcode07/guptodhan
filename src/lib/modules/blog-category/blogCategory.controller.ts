import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createBlogCategoryValidationSchema, updateBlogCategoryValidationSchema } from './blogCategory.validation';
import { BlogCategoryServices } from './blogCategory.service';
import dbConnect from '@/lib/db';

// Create a new blog category
const createBlogCategory = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createBlogCategoryValidationSchema.parse(body);

  const result = await BlogCategoryServices.createBlogCategoryInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Blog category created successfully!',
    data: result,
  });
};

// Get all blog categories
export const getAllBlogCategories = async (req: NextRequest) => {
  await dbConnect();

  const data = await BlogCategoryServices.getAllBlogCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All blog categories retrieved successfully!',
    data,
  });
};

export const getAllActiveBlogCategories = async (req: NextRequest) => {
  await dbConnect();

  const data = await BlogCategoryServices.getAllActiveBlogCategoriesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All active blog categories retrieved successfully!',
    data,
  });
};

// Get single blog category by ID
const getSingleBlogCategory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;

  const result = await BlogCategoryServices.getSingleBlogCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog category retrieved successfully!',
    data: result,
  });
};

// Update blog category
const updateBlogCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateBlogCategoryValidationSchema.parse(body);

  const result = await BlogCategoryServices.updateBlogCategoryInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog category updated successfully!',
    data: result,
  });
};

// Delete blog category
const deleteBlogCategory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;

  await BlogCategoryServices.deleteBlogCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog category deleted successfully!',
    data: null,
  });
};

export const BlogCategoryController = {
  createBlogCategory,
  getAllBlogCategories,
  getAllActiveBlogCategories,
  getSingleBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
};
