import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoreValidationSchema, updateStoreValidationSchema } from './vendorStore.validation';
import { StoreServices } from './vendorStore.service';
import dbConnect from '@/lib/db';

// Create a new store
const createStore = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createStoreValidationSchema.parse(body);

  const result = await StoreServices.createStoreInDB(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Store created successfully!',
    data: result,
  });
};

// Get all stores
const getAllStores = async () => {
  await dbConnect();
  const result = await StoreServices.getAllStoresFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Stores retrieved successfully!',
    data: result,
  });
};

// Get store by ID
const getStoreById = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const result = await StoreServices.getStoreByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Store retrieved successfully!',
    data: result,
  });
};

// Update store
const updateStore = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const validatedData = updateStoreValidationSchema.parse(body);

  const result = await StoreServices.updateStoreInDB(id, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Store updated successfully!',
    data: result,
  });
};

// Delete store
const deleteStore = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;
  await StoreServices.deleteStoreFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Store deleted successfully!',
    data: null,
  });
};

export const StoreController = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
};
