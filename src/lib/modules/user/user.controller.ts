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
  const user = await UserServices.createUserIntoDB(userData);
  return user;
};

// নতুন: নিজের প্রোফাইল দেখার জন্য কন্ট্রোলার
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

// নিজের প্রোফাইল আপডেট করার কন্ট্রোলার
const updateMyProfile = async (req: NextRequest) => {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) { throw new Error('User ID not found in token'); }

    // Next.js-এ ফাইল এবং অন্যান্য ডেটা form-data থেকে এভাবে গ্রহণ করতে হয়
    const formData = await req.formData();
    const file = formData.get('profilePicture') as File | null;
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    const payload: { name?: string; address?: string; profilePicture?: string } = {};

    if (name) payload.name = name;
    if (address) payload.address = address;

    // যদি কোনো ফাইল আপলোড করা হয়
    if (file) {
      // ফাইলটিকে Buffer-এ রূপান্তর করা হচ্ছে
      const buffer = Buffer.from(await file.arrayBuffer());
      // Cloudinary-তে 'profile-pictures' ফোল্ডারে আপলোড করা হচ্ছে
      const uploadResult = await uploadToCloudinary(buffer, 'profile-pictures');
      // Cloudinary থেকে পাওয়া সুরক্ষিত URL টি payload-এ যোগ করা হচ্ছে
      payload.profilePicture = uploadResult.secure_url;
    }

    // Zod দিয়ে ভ্যালিডেট করা হচ্ছে (ফাইল ছাড়া বাকি তথ্য)
    UserValidations.updateUserProfileValidationSchema.parse({ body: payload });

    const result = await UserServices.updateMyProfileInDB(userId, payload);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully!',
        data: result,
    });
};



// অ্যাডমিনের জন্য সকল ইউজারদের তালিকা আনার কন্ট্রোলার
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

// নতুন: নিজের অ্যাকাউন্ট ডিলিট করার জন্য কন্ট্রোলার
const deleteMyAccount = async (req: NextRequest) => {
    await dbConnect();
    // টোকেন থেকে নিজের userId নেওয়া হচ্ছে
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


// নতুন: অ্যাডমিনের জন্য অন্য কোনো ইউজারকে ডিলিট করার কন্ট্রোলার
const deleteUserByAdmin = async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    // URL থেকে টার্গেট ইউজারের id নেওয়া হচ্ছে (e.g., /api/v1/users/12345)
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