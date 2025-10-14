import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createProductSimTypeValidationSchema, updateProductSimTypeValidationSchema } from '../validations/productSimType.validation';
import { ProductSimTypeServices } from '../services/productSimType.service';
import { IProductSimType } from '../interfaces/productSimType.interface';
import dbConnect from '@/lib/db';

// Create Product SIM Type
const createProductSimType = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();
    const validatedData = createProductSimTypeValidationSchema.parse(body);

    const payload: Partial<IProductSimType> = {
      simTypeId: validatedData.simTypeId,
      name: validatedData.name,
      status: validatedData.status || 'active',
      createdAt: validatedData.createdAt || new Date(),
    };

    const result = await ProductSimTypeServices.createProductSimTypeInDB(payload);

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Product SIM Type created successfully!',
      data: result,
    });
  } catch (error) {
    console.error('Error creating Product SIM Type:', error);
    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to create Product SIM Type',
      data: null,
    });
  }
};

// Get all Product SIM Types
const getAllProductSimTypes = async () => {
  await dbConnect();
  const result = await ProductSimTypeServices.getAllProductSimTypesFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product SIM Types retrieved successfully!',
    data: result,
  });
};

// Update Product SIM Type
const updateProductSimType = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const validatedData = updateProductSimTypeValidationSchema.parse(body);

  const payload: Partial<IProductSimType> = {};
  if (validatedData.simTypeId) payload.simTypeId = validatedData.simTypeId;
  if (validatedData.name) payload.name = validatedData.name;
  if (validatedData.status) payload.status = validatedData.status;
  if (validatedData.createdAt) payload.createdAt = validatedData.createdAt;

  const result = await ProductSimTypeServices.updateProductSimTypeInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product SIM Type updated successfully!',
    data: result,
  });
};

// Delete Product SIM Type
const deleteProductSimType = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  await ProductSimTypeServices.deleteProductSimTypeFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product SIM Type deleted successfully!',
    data: null,
  });
};

export const ProductSimTypeController = {
  createProductSimType,
  getAllProductSimTypes,
  updateProductSimType,
  deleteProductSimType,
};
