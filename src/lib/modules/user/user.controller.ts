/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import dbConnect from '@/lib/db';
import { UserServices } from './user.service';
import { UserValidations } from './user.validation';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { OtpServices } from '@/lib/modules/otp/otp.service';
import { Types } from 'mongoose';

// ========================================
// 📝 REGISTER USER (Send OTP)
// ========================================
const registerUser = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();

  // Validate input
  const validatedData = UserValidations.createUserValidationSchema.parse({
    body: body,
  });

  const { email, phoneNumber } = validatedData.body;

  // Check if user exists
  const { User } = await import('./user.model');
  const query = [];
  if (email) query.push({ email });
  if (phoneNumber) query.push({ phoneNumber });

  if (query.length > 0) {
    const existingUser = await User.findOne({ $or: query }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists!' },
        { status: StatusCodes.CONFLICT }
      );
    }
  }

  // Send OTP
  let otpResult;
  let identifier;
  let verificationType;

  if (email) {
    otpResult = await OtpServices.sendEmailOtpService(email);
    identifier = email;
    verificationType = 'email';
  } else if (phoneNumber) {
    otpResult = await OtpServices.sendPhoneOtpService(phoneNumber);
    identifier = phoneNumber;
    verificationType = 'phone';
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `OTP sent to your ${verificationType}`,
    data: { identifier, verificationType, otp: otpResult?.otp },
  });
};

// ========================================
// ✅ VERIFY OTP & CREATE ACCOUNT
// ========================================
const verifyOtpAndCreateAccount = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const { identifier, otp, userData } = body;

  if (!identifier || !otp || !userData) {
    return NextResponse.json(
      { success: false, message: 'Invalid request data' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // Verify OTP
  const otpNumber = typeof otp === 'string' ? Number(otp) : otp;
  const verificationResult = await OtpServices.verifyOtpService(identifier, otpNumber);

  if (!verificationResult.status) {
    return NextResponse.json(
      { success: false, message: verificationResult.message },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // Create user
  const result = await UserServices.createUserIntoDB({
    name: userData.name,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    password: userData.password,
    role: userData.role || 'user',
    address: userData.address,
    profilePicture: userData.profilePicture,
  });

  // Mark as verified
  if (result && result._id) {
    const { User } = await import('./user.model');
    await User.findByIdAndUpdate(result._id, { isVerified: true });
  }

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Account created successfully!',
    data: result,
  });
};

// ========================================
// 🛠️ REGISTER SERVICE PROVIDER
// ========================================
const registerServiceProvider = async (req: NextRequest) => {
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
};

// ========================================
// 👤 GET MY PROFILE
// ========================================
const getMyProfile = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    throw new Error('User ID not found in token');
  }

  const result = await UserServices.getMyProfileFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile retrieved successfully!',
    data: result,
  });
};

// ========================================
// ✏️ UPDATE MY PROFILE
// ========================================
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

  const payload: any = {};
  if (name) payload.name = name;
  if (phoneNumber) payload.phoneNumber = phoneNumber;
  if (typeof address === 'string') payload.address = address;

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

// ========================================
// 📋 GET ALL USERS (Admin Only)
// ========================================
const getAllUsers = async () => {
  await dbConnect();
  const result = await UserServices.getAllUsersFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully!',
    data: result,
  });
};

// ========================================
// 🗑️ DELETE MY ACCOUNT
// ========================================
const deleteMyAccount = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    throw new Error('User ID not found in token');
  }

  await UserServices.deleteUserFromDB(userId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Account deleted successfully.',
    data: null,
  });
};

// ========================================
// 🗑️ DELETE USER BY ADMIN
// ========================================
const deleteUserByAdmin = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  await dbConnect();
  const { id } = await context.params;

  await UserServices.deleteUserFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully.',
    data: null,
  });
};

// ========================================
// ✏️ UPDATE USER BY ADMIN
// ========================================
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
    message: 'User updated successfully.',
    data: result,
  });
};

// ========================================
// 🔍 GET USER BY ID (Admin Only)
// ========================================
const getUserById = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
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
  registerUser,
  verifyOtpAndCreateAccount,
  registerServiceProvider,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteMyAccount,
  deleteUserByAdmin,
  updateUserByAdmin,
  getUserById,
};