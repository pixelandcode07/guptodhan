import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductWarrantyValidationSchema, updateProductWarrantyValidationSchema } from '../validations/warranty.validation';
import { ProductWarrantyServices } from '../services/warranty.service';
import { IProductWarranty } from '../interfaces/warranty.interface';
import dbConnect from '@/lib/db';

// Create a new product warranty
const createProductWarranty = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();
    const validatedData = createProductWarrantyValidationSchema.parse(body);

    const payload: Partial<IProductWarranty> = {
      warrantyName: validatedData.warrantyName,
      createdAt: validatedData.createdAt || new Date(),
      status: validatedData.status || 'active',
    };

    const result = await ProductWarrantyServices.createProductWarrantyInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Product warranty created successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Error creating product warranty:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to create product warranty',
      data: null,
    });
  }
};

// Get all product warranties
const getAllProductWarranties = async () => {
  await dbConnect();
  const result = await ProductWarrantyServices.getAllProductWarrantiesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product warranties retrieved successfully!',
    data: result,
  });
};

// Get all active product warranties
const getAllActiveProductWarranties = async () => {
  await dbConnect();
  const result = await ProductWarrantyServices.getActiveProductWarrantiesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Active product warranties retrieved successfully!',
    data: result,
  });
};

// Update product warranty
const updateProductWarranty = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateProductWarrantyValidationSchema.parse(body);

  const payload: Partial<IProductWarranty> = {};
  if (validatedData.warrantyName) payload.warrantyName = validatedData.warrantyName;
  if (validatedData.status) payload.status = validatedData.status;
  if (validatedData.createdAt) payload.createdAt = validatedData.createdAt;

  const result = await ProductWarrantyServices.updateProductWarrantyInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product warranty updated successfully!',
    data: result,
  });
};

// Delete product warranty
const deleteProductWarranty = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  await ProductWarrantyServices.deleteProductWarrantyFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product warranty deleted successfully!',
    data: null,
  });
};

export const ProductWarrantyController = {
  createProductWarranty,
  getAllProductWarranties,
  getAllActiveProductWarranties,
  updateProductWarranty,
  deleteProductWarranty,
};
