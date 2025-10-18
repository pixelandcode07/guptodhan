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

// Get vendor product by ID
const getVendorProductById = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await dbConnect();
  const { id } = params;
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
  const body = await req.json();
  const validatedData = updateVendorProductValidationSchema.parse(body);

  // ⚙️ এখানে আমরা টাইপ কাস্ট করছি ObjectId এর সাথে compatible করতে
  const payload = {
    ...validatedData,
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
  getVendorProductById,
  updateVendorProduct,
  deleteVendorProduct,
};
