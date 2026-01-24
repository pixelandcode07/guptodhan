/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { TUserInput } from './user.interface';
import { UserServices } from './user.service';
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { UserValidations } from './user.validation';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';
import { ZodError } from 'zod';
import { Types } from 'mongoose';

// ✅ No changes needed - already optimal
const createUser = async (userData: TUserInput) => {
  const result = await UserServices.createUserIntoDB(userData);
  return result;
};

// ✅ Already good
const registerServiceProvider = async (req: NextRequest) => {
  try {
    await dbConnect();

    const formData = await req.formData();

    const payload: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'cv' && key !== 'profilePicture' && key !== 'subCategories') {
        payload[key] = value;
      }
    }
    payload.subCategories = formData.getAll('subCategories');

    const cvFile = formData.get('cv') as File | null;
    if (cvFile) {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'service-provider-cvs');
      payload.cvUrl = uploadResult.secure_url;
    }

    const profilePictureFile = formData.get('profilePicture') as File | null;
    if (profilePictureFile) {
      const buffer = Buffer.from(await profilePictureFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'profile-pictures');
      payload.profilePicture = uploadResult.secure_url;
    }

    UserValidations.registerServiceProviderValidationSchema.parse(payload);

    const result = await UserServices.createServiceProviderIntoDB({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
      profilePicture: payload.profilePicture,
      role: 'service-provider',
      serviceProviderInfo: {
        serviceCategory: new Types.ObjectId(payload.serviceCategory),
        cvUrl: payload.cvUrl,
        bio: payload.bio,
      },
    });

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Service provider registered successfully!',
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendResponse({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Validation failed',
        data: error.issues,
      });
    }

    return sendResponse({
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'An error occurred',
      data: null,
    });
  }
};

// ✅ Already optimal
const getMyProfile = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    throw new Error('User ID not found in token');
  }

  // Service layer handles caching
  const result = await UserServices.getMyProfileFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User profile retrieved successfully!',
    data: result,
  });
};

// ✅ Already good
const updateMyProfile = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    throw new Error('User ID not found in token');
  }

  const formData = await req.formData();

  const file = formData.get('profilePicture') as File | null;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const phoneNumber = formData.get('phoneNumber') as string;

  const payload: {
    name?: string;
    address?: string;
    profilePicture?: string;
    phoneNumber?: string;
  } = {};

  if (name) payload.name = name;
  if (phoneNumber) payload.phoneNumber = phoneNumber;

  // ✅ Handle empty address correctly
  if (typeof address === 'string') {
    payload.address = address;
  }

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'profile-pictures');
    payload.profilePicture = uploadResult.secure_url;
  }

  // Service layer handles cache invalidation
  const result = await UserServices.updateMyProfileInDB(userId, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully!',
    data: result,
  });
};

// ✅ Already good
const getAllUsers = async (_req: NextRequest) => {
  await dbConnect();
  const result = await UserServices.getAllUsersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All users retrieved successfully!',
    data: result,
  });
};

// ✅ Already good
const deleteMyAccount = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    throw new Error('User ID not found in token');
  }

  // Service handles cache invalidation
  await UserServices.deleteUserFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your account has been deleted successfully.',
    data: null,
  });
};

// ✅ Already good
const deleteUserByAdmin = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect();
  const { id } = params;

  await UserServices.deleteUserFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User has been deleted successfully by admin.',
    data: null,
  });
};

// ✅ Already good
const updateUserByAdmin = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  const { id } = await context.params;

  const body = await req.json();

  const allowedFields = ['name', 'email', 'phoneNumber', 'address', 'role', 'isActive', 'isVerified'];
  const payload: Record<string, any> = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      payload[key] = body[key];
    }
  }

  const result = await UserServices.updateUserByAdminInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User updated successfully by admin.',
    data: result,
  });
};

// ✅ Already good
const getUserById = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await context.params;

  const result = await UserServices.getUserByIdFromDB(id);

  if (!result) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User not found!',
      data: null,
    });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User retrieved successfully!',
    data: result,
  });
};

export const UserController = {
  createUser,
  registerServiceProvider,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteMyAccount,
  deleteUserByAdmin,
  updateUserByAdmin,
  getUserById,
};