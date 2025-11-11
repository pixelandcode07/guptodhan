import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import {
  createVendorProductValidationSchema,
  updateVendorProductValidationSchema,
} from './vendorProduct.validation';
import { VendorProductServices } from './vendorProduct.service';
import dbConnect from '@/lib/db';
import { Types } from 'mongoose';
import { IVendorProduct } from './vendorProduct.interface';
import { ca } from 'zod/v4/locales';

// Create a new vendor product
const createVendorProduct = async (req: NextRequest) => {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = createVendorProductValidationSchema.parse(body);

    const payload: Partial<IVendorProduct> = {
      ...validatedData,
      // ✅ **পরিবর্তন:** vendorStoreId-কে ObjectId-তে রূপান্তর করা হয়েছে
      vendorStoreId: new Types.ObjectId(validatedData.vendorStoreId),
      category: new Types.ObjectId(validatedData.category),
      subCategory: validatedData.subCategory
        ? new Types.ObjectId(validatedData.subCategory)
        : undefined,
      childCategory: validatedData.childCategory
        ? new Types.ObjectId(validatedData.childCategory)
        : undefined,
      brand: validatedData.brand
        ? new Types.ObjectId(validatedData.brand)
        : undefined,
      productModel: validatedData.productModel
        ? new Types.ObjectId(validatedData.productModel)
        : undefined,
      productOptions: validatedData.productOptions ?? [],
    };

    const result = await VendorProductServices.createVendorProductInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Vendor product created successfully!",
      data: result,
    });
  } catch (err) {
    console.error("Error creating vendor product:", err);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Something went wrong while saving the product.",
      data: null,
    });
  }
};


// Get all vendor products
const getAllVendorProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getAllVendorProductsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor products retrieved successfully!',
    data: result,
  });
};

// get all active vendor products
const getActiveVendorProducts = async () => {
  await dbConnect();
  const result = await VendorProductServices.getActiveVendorProductsFromDB(); 

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Active vendor products retrieved successfully!',
    data: result,
  });
};

// Get vendor products by category Id
const getVendorProductsByCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;
  const result = await VendorProductServices.getVendorProductsByCategoryFromDB(categoryId);

  return sendResponse({ 
    success: true,
    statusCode: StatusCodes.OK,
    message: `Vendor products for category ${categoryId} retrieved successfully!`,
    data: result,
  });
}

// Get vendor products by sub-category Id
const getVendorProductsBySubCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const resolvedParams = await params;
  const subCategoryId = resolvedParams.id;
  const result = await VendorProductServices.getVendorProductsBySubCategoryFromDB(subCategoryId);

  return sendResponse({ 
    success: true,
    statusCode: StatusCodes.OK,
    message: `Vendor products for sub-category ${subCategoryId} retrieved successfully!`,
    data: result,
  });
};

// Get vendor products by child-category Id
const getVendorProductsByChildCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const resolvedParams = await params;
  const childCategoryId = resolvedParams.id;
  const result = await VendorProductServices.getVendorProductsByChildCategoryFromDB(childCategoryId);

  return sendResponse({ 
    success: true,
    statusCode: StatusCodes.OK,
    message: `Vendor products for child-category ${childCategoryId} retrieved successfully!`,
    data: result,
  });
};

// Get vendor product by ID
const getVendorProductById = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  
  // Validate ID: must be a valid MongoDB ObjectId and not "undefined"
  if (!id || id === 'undefined' || id.trim() === '' || !Types.ObjectId.isValid(id)) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid product ID provided',
      data: null,
    });
  }

  const result = await VendorProductServices.getVendorProductByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor product retrieved successfully!',
    data: result,
  });
};


const updateVendorProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  
  // Validate ID: must be a valid MongoDB ObjectId and not "undefined"
  if (!id || id === 'undefined' || id.trim() === '' || !Types.ObjectId.isValid(id)) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid product ID provided',
      data: null,
    });
  }

  const body = await req.json();
  const validatedData = updateVendorProductValidationSchema.parse(body);

  // ⚙️ এখানে আমরা টাইপ কাস্ট করছি ObjectId এর সাথে compatible করতে
  const payload = {
    ...validatedData,
    vendorStoreId: validatedData.vendorStoreId
        ? new Types.ObjectId(validatedData.vendorStoreId)
        : undefined,
    category: validatedData.category
      ? new Types.ObjectId(validatedData.category)
      : undefined,
    subCategory: validatedData.subCategory
      ? new Types.ObjectId(validatedData.subCategory)
      : undefined,
    childCategory: validatedData.childCategory
      ? new Types.ObjectId(validatedData.childCategory)
      : undefined,
    brand: validatedData.brand
      ? new Types.ObjectId(validatedData.brand)
      : undefined,
    productModel: validatedData.productModel
      ? new Types.ObjectId(validatedData.productModel)
      : undefined,
  } as Partial<IVendorProduct>; // ✅ এখানে cast করে দিলাম

  const result = await VendorProductServices.updateVendorProductInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor product updated successfully!",
    data: result,
  });
};


// Delete vendor product
const deleteVendorProduct = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await params;
  
  // Validate ID: must be a valid MongoDB ObjectId and not "undefined"
  if (!id || id === 'undefined' || id.trim() === '' || !Types.ObjectId.isValid(id)) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid product ID provided',
      data: null,
    });
  }

  await VendorProductServices.deleteVendorProductFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor product deleted successfully!',
    data: null,
  });
};


// GET landing page products
const getLandingPageProducts = async () => {
  await dbConnect();

  const result = await VendorProductServices.getLandingPageProductsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Home page products retrieved successfully!',
    data: result,
  });
};

// GET search vendor products
const searchVendorProducts = async (req: NextRequest) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  // If no query provided, return empty array (optional)
  if (!query) {
    return sendResponse({
      success: true,
      statusCode: StatusCodes.OK,
      message: "No search query provided.",
      data: [],
    });
  }

  const result = await VendorProductServices.searchVendorProductsFromDB(query);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Search results retrieved successfully!",
    data: result,
  });
};



export const VendorProductController = {
  createVendorProduct,
  getAllVendorProducts,
  getActiveVendorProducts,
  getVendorProductsByCategory,
  getVendorProductsBySubCategory,
  getVendorProductsByChildCategory,
  getVendorProductById,
  updateVendorProduct,
  deleteVendorProduct,

  getLandingPageProducts,
  searchVendorProducts
};
