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

const createUser = async (userData: TUserInput) => {
  const result = await UserServices.createUserIntoDB(userData);
  return result;
};

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

    // serviceCategory
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
        subCategories: payload.subCategories.map((id: string) => new Types.ObjectId(id)),
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

// --- Other existing functions remain unchanged ---

const getMyProfile = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error('User ID not found in token'); }

  const result = await UserServices.getMyProfileFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User profile retrieved successfully!',
    data: result,
  });
};

const updateMyProfile = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error('User ID not found in token'); }

  const formData = await req.formData();
  
  // ডাটাগুলো নেওয়া হচ্ছে
  const file = formData.get('profilePicture') as File | null;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string; // <--- এখানে খালি স্ট্রিং আসছে
  const phoneNumber = formData.get('phoneNumber') as string;

  const payload: { name?: string; address?: string; profilePicture?: string; phoneNumber?:string} = {};

  if (name) payload.name = name;
  if (phoneNumber) payload.phoneNumber = phoneNumber;
  
  // ❌ ভুল কোড (আগে যা ছিল)
  // if (address) payload.address = address; 

  // ✅ সঠিক কোড (এটি ব্যবহার করুন)
  // আমরা চেক করছি address স্ট্রিং কিনা, খালি হলেও সমস্যা নেই
  if (typeof address === 'string') {
    payload.address = address;
  }

  // ... বাকি কোড একই থাকবে (ছবি আপলোড ইত্যাদি)
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'profile-pictures');
    payload.profilePicture = uploadResult.secure_url;
  }
  const result = await UserServices.updateMyProfileInDB(userId, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully!',
    data: result,
  });
};

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

const deleteMyAccount = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error('User ID not found in token'); }

  await UserServices.deleteUserFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your account has been deleted successfully.',
    data: null,
  });
};

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

export const UserController = {
  createUser,
  registerServiceProvider,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteMyAccount,
  deleteUserByAdmin,
};
