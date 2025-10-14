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

// Create a new vendor product
const createVendorProduct = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createVendorProductValidationSchema.parse(body);

  const payload = {
    ...validatedData,
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

    // ✅ include productOptions if provided
    productOptions: validatedData.productOptions ?? [],
  };

  const result = await VendorProductServices.createVendorProductInDB(payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Vendor product created successfully!',
    data: result,
  });
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

// Update vendor product
const updateVendorProduct = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateVendorProductValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    ...(validatedData.category && {
      category: new Types.ObjectId(validatedData.category),
    }),
    ...(validatedData.subCategory && {
      subCategory: new Types.ObjectId(validatedData.subCategory),
    }),
    ...(validatedData.childCategory && {
      childCategory: new Types.ObjectId(validatedData.childCategory),
    }),
    ...(validatedData.brand && {
      brand: new Types.ObjectId(validatedData.brand),
    }),

    // ✅ update productOptions too
    ...(validatedData.productOptions && {
      productOptions: validatedData.productOptions,
    }),
  };

  const result = await VendorProductServices.updateVendorProductInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor product updated successfully!',
    data: result,
  });
};

// Delete vendor product
const deleteVendorProduct = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
  await VendorProductServices.deleteVendorProductFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Vendor product deleted successfully!',
    data: null,
  });
};

export const VendorProductController = {
  createVendorProduct,
  getAllVendorProducts,
  updateVendorProduct,
  deleteVendorProduct,
};
