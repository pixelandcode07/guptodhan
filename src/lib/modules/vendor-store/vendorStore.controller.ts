import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { createStoreValidationSchema, updateStoreValidationSchema } from './vendorStore.validation';
import { StoreServices } from './vendorStore.service';
import dbConnect from '@/lib/db';
import {Types} from 'mongoose';

// Create a new store
const createStore = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = createStoreValidationSchema.parse(body);

  const payload = {
    ...validatedData,
    vendorId: new Types.ObjectId(validatedData.vendorId),
  };

  const result = await StoreServices.createStoreInDB(payload);

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

    const payload = {
    ...validatedData,
    vendorId: new Types.ObjectId(validatedData.vendorId)
  };

  const result = await StoreServices.updateStoreInDB(id, payload);

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

export const VendorStoreController = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
};
