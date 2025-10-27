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

  if (!ownerNidFile) { throw new Error('Owner NID image is required.'); }
  if (!tradeLicenseFile) { throw new Error('Trade License image is required.'); }

  const [ownerNidUploadResult, tradeLicenseUploadResult] = await Promise.all([
    uploadToCloudinary(Buffer.from(await ownerNidFile.arrayBuffer()), 'vendor-documents'),
    uploadToCloudinary(Buffer.from(await tradeLicenseFile.arrayBuffer()), 'vendor-documents')
  ]);

  const payload: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      payload[key] = value;
    }
  }

  payload.ownerNidUrl = ownerNidUploadResult.secure_url;
  payload.tradeLicenseUrl = tradeLicenseUploadResult.secure_url;

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


const googleLogin = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = googleLoginValidationSchema.parse(body);

  const result = await AuthServices.loginWithGoogle(validatedData.idToken);

  const { refreshToken, ...dataForResponseBody } = result;

  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully with Google!',
    data: dataForResponseBody,
  });

  // কুকিতে refreshToken সেট করা (মোবাইল অ্যাপ এটি সরাসরি ব্যবহার করবে না, কিন্তু ওয়েব ফ্লো-এর জন্য ভালো)
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
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
  googleLogin,
};