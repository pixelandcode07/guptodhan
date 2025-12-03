/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from './auth.service';
import { sendResponse } from '@/lib/utils/sendResponse';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import dbConnect from '@/lib/db';
import {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  setPasswordValidationSchema,
  sendForgotPasswordOtpToEmailSchema,
  verifyForgotPasswordOtpFromEmailSchema,
  getResetTokenWithFirebaseSchema,
  resetPasswordWithTokenSchema,
  registerVendorValidationSchema,
  registerServiceProviderValidationSchema,
  googleLoginValidationSchema,
} from './auth.validation';





const loginUser = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = loginValidationSchema.parse(body);
  const result = await AuthServices.loginUser(validatedData);

  const { refreshToken, ...dataForResponseBody } = result;

  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully!',
    data: dataForResponseBody, // এখন এখানে আর refreshToken নেই
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
};


// Only check vendor role

// vendorLogin ফাংশনের ভিতরে
const vendorLogin = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = loginValidationSchema.parse(body);

  const result = await AuthServices.vendorLogin(validatedData);

  const { refreshToken, user, accessToken } = result;

  const response = sendResponse({
    success: true,
    statusCode: 200,
    message: 'Vendor logged in successfully!',
    data: {
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profilePicture: user.profilePicture,
        address: user.address,
        // 🔥 এই লাইনটি যোগ করুন যাতে ফ্রন্টএন্ড এটা পায়
        vendorId: user.vendorId, 
      }
    },
  });

  // ... cookies set code same as before
  return response;
};


// ------------------------------------
// --- NEW: VENDOR CHANGE PASSWORD CONTROLLER ---
// ------------------------------------
const vendorChangePassword = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error("Authentication failure: User ID not found in token"); }

  const body = await req.json();
  const validatedData = changePasswordValidationSchema.parse(body); // একই ভ্যালিডেশন ব্যবহার করা যাবে

  await AuthServices.vendorChangePassword(userId, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor password changed successfully",
    data: null
  });
};

// ------------------------------------
// --- NEW: VENDOR FORGOT PASSWORD CONTROLLERS ---
// ------------------------------------

// STEP 1: Send OTP
const vendorSendForgotPasswordOtp = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = sendForgotPasswordOtpToEmailSchema.parse(body); // একই ভ্যালিডেশন
  await AuthServices.vendorSendForgotPasswordOtpToEmail(validatedData.email);
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'A password reset OTP has been sent to your vendor email.', 
    data: null 
  });
};

// STEP 2: Verify OTP
const vendorVerifyForgotPasswordOtp = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = verifyForgotPasswordOtpFromEmailSchema.parse(body);
  const result = await AuthServices.vendorVerifyForgotPasswordOtpFromEmail(validatedData.email, validatedData.otp);
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'OTP verified successfully. Use the token to reset your password.', 
    data: result 
  });
};

// STEP 3: Reset Password
// দ্রষ্টব্য: resetPasswordWithToken সার্ভিসটি আমরা আবার ব্যবহার করতে পারি, 
// কারণ এটি userId দিয়ে কাজ করে, যা টোকেন থেকে আসে।
// আমাদের শুধু একটি আলাদা কন্ট্রোলার দরকার।

const vendorResetPassword = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = resetPasswordWithTokenSchema.parse(body); // একই ভ্যালিডেশন
  await AuthServices.resetPasswordWithToken(validatedData.token, validatedData.newPassword);
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Vendor password has been reset successfully!', 
    data: null 
  });
};


const refreshToken = async (req: NextRequest) => {
  await dbConnect();
  const token = req.cookies.get('refreshToken')?.value;
  const validatedData = refreshTokenValidationSchema.parse({ refreshToken: token });
  const result = await AuthServices.refreshToken(validatedData.refreshToken);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Access token refreshed successfully!',
    data: result,
  });
};

const changePassword = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error("Authentication failure: User ID not found in token"); }

  const body = await req.json();
  const validatedData = changePasswordValidationSchema.parse(body);
  await AuthServices.changePassword(userId, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password changed successfully",
    data: null
  });
};

const setPassword = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error("Authentication failure: User ID not found in token"); }

  const body = await req.json();
  const validatedData = setPasswordValidationSchema.parse(body);
  await AuthServices.setPasswordForSocialLogin(userId, validatedData.newPassword);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password has been set successfully.",
    data: null
  });
};

// --- Forgot Password Controllers ---
const sendForgotPasswordOtpToEmail = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = sendForgotPasswordOtpToEmailSchema.parse(body);
  await AuthServices.sendForgotPasswordOtpToEmail(validatedData.email);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'A password reset OTP has been sent to your email.', data: null });
};

const verifyForgotPasswordOtpFromEmail = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = verifyForgotPasswordOtpFromEmailSchema.parse(body);
  const result = await AuthServices.verifyForgotPasswordOtpFromEmail(validatedData.email, validatedData.otp);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'OTP verified successfully. Use the token to reset your password.', data: result });
};

const getResetTokenWithFirebase = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = getResetTokenWithFirebaseSchema.parse(body);
  const result = await AuthServices.getResetTokenWithFirebase(validatedData.idToken);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Phone verified successfully. Use the token to reset your password.', data: result });
};

const resetPasswordWithToken = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = resetPasswordWithTokenSchema.parse(body);
  await AuthServices.resetPasswordWithToken(validatedData.token, validatedData.newPassword);
  return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Password has been reset successfully!', data: null });
};


const registerVendor = async (req: NextRequest) => {
  await dbConnect();

  const formData = await req.formData();

  const ownerNidFile = formData.get('ownerNid') as File | null;
  const tradeLicenseFile = formData.get('tradeLicense') as File | null;

  if (!ownerNidFile) throw new Error('Owner NID image is required.');
  if (!tradeLicenseFile) throw new Error('Trade License image is required.');

  // Upload to Cloudinary
  const [ownerNidUploadResult, tradeLicenseUploadResult] = await Promise.all([
    uploadToCloudinary(Buffer.from(await ownerNidFile.arrayBuffer()), 'vendor-documents'),
    uploadToCloudinary(Buffer.from(await tradeLicenseFile.arrayBuffer()), 'vendor-documents'),
  ]);

  // ✅ FIX: Use the keys exactly as they are appended in Frontend (VendorFormUserEnd.tsx)
  const payload: any = {
    // User Model Fields
    name: formData.get('name') as string,                 // Was 'owner_name'
    email: formData.get('email') as string,               // Was 'owner_email'
    password: formData.get('password') as string,         // Was 'owner_email_password'
    phoneNumber: formData.get('phoneNumber') as string,   // Was 'owner_number'
    address: formData.get('address') as string || '',     // Matches frontend

    // Vendor Model Fields
    businessName: formData.get('businessName') as string, // Was 'business_name'
    businessAddress: formData.get('businessAddress') as string || '', 
    tradeLicenseNumber: formData.get('tradeLicenseNumber') as string || '', // Was 'trade_license_number'
    ownerName: formData.get('ownerName') as string,       // Was 'owner_name' (Frontend sends both 'name' and 'ownerName')

    // Parse JSON string for categories
    businessCategory: JSON.parse((formData.get('businessCategory') as string) || '[]'),

    ownerNidUrl: ownerNidUploadResult.secure_url,
    tradeLicenseUrl: tradeLicenseUploadResult.secure_url,

    status: 'pending',
  };

  // Zod validation
  const validatedData = registerVendorValidationSchema.parse(payload);

  const result = await AuthServices.registerVendor(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Vendor registered successfully! Please wait for admin approval.',
    data: result,
  });
};

const registerServiceProvider = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = registerServiceProviderValidationSchema.parse(body);
  const result = await AuthServices.registerServiceProvider(validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Service provider registered successfully!',
    data: result,
  });
};


const googleLoginHandler = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validated = googleLoginValidationSchema.parse(body);
  
  // এখানে আমরা AuthServices.loginWithGoogle এর বদলে সরাসরি loginWithGoogle ফাংশনটি কল করছি
  const result = await AuthServices.loginWithGoogle(validated.idToken);

  const { refreshToken, ...data } = result;
  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully with Google!',
    data,
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 দিন
  });

  return response;
};


export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  setPassword,
  sendForgotPasswordOtpToEmail,
  verifyForgotPasswordOtpFromEmail,
  getResetTokenWithFirebase,
  resetPasswordWithToken,
  registerVendor,
  registerServiceProvider,
  googleLoginHandler,
  vendorLogin,
  vendorChangePassword,
  vendorSendForgotPasswordOtp,
  vendorVerifyForgotPasswordOtp,
  vendorResetPassword,
};