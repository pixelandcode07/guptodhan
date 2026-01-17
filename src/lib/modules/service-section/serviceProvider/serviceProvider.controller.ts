// import { TUserInput } from './user.interface';
import { ServiceProviderServices } from './serviceProvider.service';
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
// import { UserValidations } from './user.validation';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';
import { ZodError } from 'zod';
import { Types } from 'mongoose';

const getAllUsers = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ServiceProviderServices.getAllUsersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All users retrieved successfully!',
    data: result,
  });
};

const getAllUsersPublic = async (_req: NextRequest) => {
  await dbConnect();
  const result = await ServiceProviderServices.getAllUsersFromDBPublic();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All users retrieved successfully!',
    data: result,
  });
};

const getUserById = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();

  const { id } = await params; 
  
  if (!id) throw new Error('User ID is required');

  const result = await ServiceProviderServices.getUserByIdFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User retrieved successfully!',
    data: result,
  });
};

const promoteToServiceProvider = async (req: NextRequest) => {
  const { id } = await req.json();
  console.log("Promote Request for User ID:", id);

  if (!id) throw new Error('User ID is required');

  const result = await ServiceProviderServices.promoteToServiceProviderInDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User promoted to service-provider successfully!',
    data: result,
  });
};


const demoteToServiceProvider = async (req: NextRequest) => {
  const { id } = await req.json();
  console.log("Promote Request for User ID:", id);

  if (!id) throw new Error('User ID is required');

  const result = await ServiceProviderServices.demoteToServiceProviderInDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User promoted to service-provider successfully!',
    data: result,
  });
};

export const ServiceProviderController = {
  getAllUsers,
  getUserById,
  getAllUsersPublic,
  promoteToServiceProvider,
  demoteToServiceProvider,
};