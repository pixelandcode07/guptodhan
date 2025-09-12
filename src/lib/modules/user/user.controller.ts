/* eslint-disable @typescript-eslint/no-unused-vars */

import { TUserInput } from './user.interface';
import { UserServices } from './user.service';
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { UserValidations } from './user.validation';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';


const createUser = async (userData: TUserInput) => {
  // সার্ভিসকে কল করে মূল কাজটি করা হচ্ছে
  const result = await UserServices.createUserIntoDB(userData);
  
  // sendResponse এখন আর এখানে কল হবে না, এটি route.ts-এ হবে
  return result;
};


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
    const file = formData.get('profilePicture') as File | null;
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    const payload: { name?: string; address?: string; profilePicture?: string } = {};

    if (name) payload.name = name;
    if (address) payload.address = address;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'profile-pictures');
      payload.profilePicture = uploadResult.secure_url;
    }

    UserValidations.updateUserProfileValidationSchema.parse({ body: payload });

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
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteMyAccount,
  deleteUserByAdmin,
};