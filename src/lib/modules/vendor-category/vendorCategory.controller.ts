import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createVendorCategoryValidationSchema, updateVendorCategoryValidationSchema } from './vendorCategory.validation';
import { VendorCategoryServices, reorderVendorCategoryService } from './vendorCategory.service';
import dbConnect from '@/lib/db';

// Create a new vendor category
const createVendorCategory = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createVendorCategoryValidationSchema.parse(body);

  const result = await VendorCategoryServices.createVendorCategoryInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Vendor category created successfully!',
    data: result,
  });
};

// Get all vendor categories
const getAllVendorCategories = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const filters = {
    status: searchParams.get('status') || undefined,
    searchTerm: searchParams.get('searchTerm') || undefined,
  };

  const result = await VendorCategoryServices.getAllVendorCategoriesFromDB(filters);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor categories retrieved successfully!',
    data: result,
  });
};

// Get single vendor category by ID
const getSingleVendorCategory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = await params;

  const result = await VendorCategoryServices.getSingleVendorCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor category retrieved successfully!',
    data: result,
  });
};

// Update vendor category
const updateVendorCategory = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateVendorCategoryValidationSchema.parse(body);

  const result = await VendorCategoryServices.updateVendorCategoryInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor category updated successfully!',
    data: result,
  });
};

// Delete vendor category
const deleteVendorCategory = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = await params;

  await VendorCategoryServices.deleteVendorCategoryFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor category deleted successfully!',
    data: null,
  });
};


// Reorder vendor category (drag-and-drop)
const reorderVendorCategory = async (req: NextRequest) => {
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
  const result = await reorderVendorCategoryService(orderedIds);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message || 'vendor category reordered successfully!',
    data: null,
  });
};

export const VendorCategoryController = {
  createVendorCategory,
  getAllVendorCategories,
  getSingleVendorCategory,
  updateVendorCategory,
  deleteVendorCategory,

  reorderVendorCategory
};
