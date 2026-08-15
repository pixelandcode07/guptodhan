import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import dbConnect from '@/lib/db';
import { ServiceProviderServices } from './serviceProvider.service';

const getAllActiveServiceProviders = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ServiceProviderServices.getAllActiveServiceProvidersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All active service providers retrieved successfully!',
    data: result,
  });
};

const getServiceProviderProfile = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const result = await ServiceProviderServices.getServiceProviderProfileFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service provider profile retrieved successfully!',
    data: result,
  });
};

// Alias for getServiceProviderProfile (route.ts এ getUserById নাম দেওয়া ছিল)
const getUserById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const result = await ServiceProviderServices.getServiceProviderProfileFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service provider retrieved successfully!',
    data: result,
  });
};

// ✅ MAGIC FIX: Delete Controller Add করা হলো
const deleteServiceProvider = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  
  const result = await ServiceProviderServices.deleteServiceProviderFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service provider deleted successfully!',
    data: result,
  });
};

export const ServiceProviderController = {
  getAllActiveServiceProviders,
  getServiceProviderProfile,
  getUserById,
  deleteServiceProvider, // ✅ Exported
};