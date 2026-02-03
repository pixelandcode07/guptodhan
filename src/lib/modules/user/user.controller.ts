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
import { OtpModel } from '../otp/otp.model';

const registerUser = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();

  // Validate only email/phone for initial step
  const validatedData = UserValidations.createUserValidationSchema.parse({
    body: body,
  });

  const { email, phoneNumber } = validatedData.body;

  const { User } = await import('./user.model');
  const query = [];
  if (email) query.push({ email });
  if (phoneNumber) query.push({ phoneNumber });

  if (query.length > 0) {
    const existingUser = await User.findOne({ $or: query }).lean();
    
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This email/phone number is already registered. Please login instead.',
            action: 'login',
          },
          { status: StatusCodes.CONFLICT }
        );
      } else {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Account registered but not verified. Resending OTP...',
            action: 'resend_otp',
          },
          { status: StatusCodes.CONFLICT }
        );
      }
    }
  }

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
// ✅ VERIFY OTP & CREATE ACCOUNT - FINAL STEP
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

  // 1. Double check if user exists
  const { User } = await import('./user.model');
  const query = [];
  if (userData.email) query.push({ email: userData.email });
  if (userData.phoneNumber) query.push({ phoneNumber: userData.phoneNumber });

  if (query.length > 0) {
    const existingUser = await User.findOne({ $or: query }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Account already exists. Please login.' },
        { status: StatusCodes.CONFLICT }
      );
    }
  }

  // 2. Verify OTP (shouldDelete = false here to be safe, we delete manually after success)
  const otpNumber = typeof otp === 'string' ? Number(otp) : otp;
  const verificationResult = await OtpServices.verifyOtpService(identifier, otpNumber, false);

  if (!verificationResult.status) {
    return NextResponse.json(
      { success: false, message: verificationResult.message },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // 3. Create Account
  try {
    const result = await UserServices.createUserIntoDB({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      role: userData.role || 'user',
      address: userData.address,
      profilePicture: userData.profilePicture,
    });

    if (result && result._id) {
      await User.findByIdAndUpdate(result._id, { isVerified: true });
      
      // ✅ SUCCESS: Now manually delete the OTP so it can't be reused
      await OtpModel.deleteMany({ identifier });
      console.log("✅ Account created & OTP deleted for:", identifier);
    }

    return sendResponse({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Account created successfully!',
      data: result,
    });
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { success: false, message: 'Account already exists. Please login.' },
        { status: StatusCodes.CONFLICT }
      );
    }
    throw error;
  }
};


// ========================================
// 🔄 RESEND OTP (For unverified users)
// ========================================
const resendOtp = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const { identifier } = body; // Can be email or phone

  if (!identifier) {
    return NextResponse.json(
      { success: false, message: 'Email or phone number required' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  // ✅ Check if user exists and is unverified
  const { User } = await import('./user.model');
  const user = await User.findOne({
    $or: [{ email: identifier }, { phoneNumber: identifier }]
  }).lean();

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'No account found with this email/phone number' },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  if (user.isVerified) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Account already verified. Please login.',
        action: 'login',
      },
      { status: StatusCodes.CONFLICT }
    );
  }

  // ✅ Send OTP
  let otpResult;
  let verificationType;

  if (user.email && identifier === user.email) {
    otpResult = await OtpServices.sendEmailOtpService(user.email);
    verificationType = 'email';
  } else if (user.phoneNumber && identifier === user.phoneNumber) {
    otpResult = await OtpServices.sendPhoneOtpService(user.phoneNumber);
    verificationType = 'phone';
  }

  console.log(`✅ OTP resent to unverified user:`, { identifier });

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: `OTP resent to your ${verificationType}`,
    data: { identifier, verificationType, otp: otpResult?.otp },
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

  // ========================================
  // ✅ Check if service provider already exists
  // ========================================
  const { User } = await import('./user.model');
  const existingUser = await User.findOne({
    $or: [
      { email: payload.email },
      { phoneNumber: payload.phoneNumber }
    ]
  }).lean();

  if (existingUser) {
    return sendResponse({
      success: false,
      statusCode: StatusCodes.CONFLICT,
      message: 'A service provider with this email or phone number already exists!',
      data: null,
    });
  }

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
  resendOtp,
  updateMyProfile,
  getAllUsers,
  deleteMyAccount,
  deleteUserByAdmin,
  updateUserByAdmin,
  getUserById,
};