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

// --- User Login ---
const loginUser = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = loginValidationSchema.parse(body);
  const result = await AuthServices.loginUser(validatedData);

  const { refreshToken, accessToken, ...dataForResponseBody } = result;

  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully!',
    data: { ...dataForResponseBody, accessToken }, // ফ্রন্টএন্ডের জন্য এক্সেস টোকেন ডাটাতেও থাকলো
  });

  // ✅ 1. Refresh Token Cookie
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
    path: '/',
  });

  // ✅ 2. Access Token Cookie (Middleware এর জন্য এটি জরুরি)
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true, // সিকিউরিটির জন্য true রাখা ভালো
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60, // 1 Day
    path: '/',
  });

  return response;
};

// --- Vendor Login ---
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
        vendorId: user.vendorId, // ✅ Vendor ID pass করা হচ্ছে
      }
    },
  });

  // ✅ 1. Refresh Token Cookie
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  // ✅ 2. Access Token Cookie
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  return response;
};

// --- Vendor Change Password ---
const vendorChangePassword = async (req: NextRequest) => {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  if (!userId) { throw new Error("Authentication failure: User ID not found in token"); }

  const body = await req.json();
  const validatedData = changePasswordValidationSchema.parse(body);

  await AuthServices.vendorChangePassword(userId, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vendor password changed successfully",
    data: null
  });
};

// --- Vendor Forgot Password Flows ---
const vendorSendForgotPasswordOtp = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = sendForgotPasswordOtpToEmailSchema.parse(body);
  await AuthServices.vendorSendForgotPasswordOtpToEmail(validatedData.email);
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'A password reset OTP has been sent to your vendor email.', 
    data: null 
  });
};

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

const vendorResetPassword = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = resetPasswordWithTokenSchema.parse(body);
  // Reusing the unified reset service logic
  await AuthServices.resetPasswordWithToken(validatedData.token, validatedData.newPassword);
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Vendor password has been reset successfully!', 
    data: null 
  });
};

// --- Refresh Token ---
const refreshToken = async (req: NextRequest) => {
  await dbConnect();
  const token = req.cookies.get('refreshToken')?.value;
  const validatedData = refreshTokenValidationSchema.parse({ refreshToken: token });
  const result = await AuthServices.refreshToken(validatedData.refreshToken);

  // নতুন অ্যাক্সেস টোকেন জেনারেট হলে সেটা কুকিতেও আপডেট করে দেওয়া ভালো
  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Access token refreshed successfully!',
    data: result,
  });

  response.cookies.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  return response;
};

// --- User Change Password ---
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

// --- User Set Password (Social Login) ---
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

// --- Forgot Password (User) ---
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

// --- Vendor Registration ---
const vendorSendRegistrationOtp = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();

  // ইমেইল চেক করা
  if (!body.email) {
    throw new Error("Email is required to send OTP");
  }

  // সার্ভিস কল করে OTP পাঠানো (এটি Redis-এ জমা থাকবে ৫ মিনিট)
  await AuthServices.vendorSendRegistrationOtp(body.email);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'A 6-digit OTP has been sent to your email for registration.',
    data: null,
  });
};

// --- ২. ভেন্ডর রেজিস্ট্রেশন (OTP ভেরিফিকেশনসহ) ---
const registerVendor = async (req: NextRequest) => {
  await dbConnect();

  const formData = await req.formData();

  // ১. OTP এবং ইমেইল চেক করা
  const otp = formData.get('otp') as string;
  const email = formData.get('email') as string;

  if (!otp || otp.length !== 6) {
    throw new Error('Valid 6-digit OTP is required to complete registration.');
  }

  // ২. ফাইল রিসিভ করা
  const ownerNidFile = formData.get('ownerNid') as File | null;
  const tradeLicenseFile = formData.get('tradeLicense') as File | null;

  if (!ownerNidFile) throw new Error('Owner NID image is required.');
  if (!tradeLicenseFile) throw new Error('Trade License image is required.');

  // ৩. ক্লাউডিনারিতে আপলোড (একসাথে দুটি ফাইল আপলোড হচ্ছে)
  const [ownerNidUploadResult, tradeLicenseUploadResult] = await Promise.all([
    uploadToCloudinary(Buffer.from(await ownerNidFile.arrayBuffer()), 'vendor-documents'),
    uploadToCloudinary(Buffer.from(await tradeLicenseFile.arrayBuffer()), 'vendor-documents'),
  ]);

  // ৪. সার্ভিসকে পাঠানোর জন্য পেলোড তৈরি
  const payload: any = {
    name: formData.get('name') as string,
    email: email,
    password: formData.get('password') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    address: (formData.get('address') as string) || '',

    businessName: formData.get('businessName') as string,
    businessAddress: (formData.get('businessAddress') as string) || '',
    tradeLicenseNumber: (formData.get('tradeLicenseNumber') as string) || '',
    ownerName: formData.get('ownerName') as string,

    businessCategory: JSON.parse((formData.get('businessCategory') as string) || '[]'),

    ownerNidUrl: ownerNidUploadResult.secure_url,
    tradeLicenseUrl: tradeLicenseUploadResult.secure_url,

    status: 'pending',
  };

  // ৫. সার্ভিস কল (এখানে OTP পাঠিয়ে ভেরিফাই করানো হবে)
  // registerVendor(payload, otp) - সার্ভিস ফাংশনটি এভাবে আপডেট থাকতে হবে
  const result = await AuthServices.registerVendor(payload, otp);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Vendor registered successfully! Admin will review your profile.',
    data: result,
  });
};

// --- Service Provider Registration ---
// OTP পাঠানোর কন্ট্রোলার
const serviceProviderSendRegistrationOtp = async (req: NextRequest) => {
  await dbConnect();
  const { email } = await req.json();
  if (!email) throw new Error("Email is required");
  await AuthServices.serviceProviderSendRegistrationOtp(email);
  return sendResponse({ 
    success: true, 
    statusCode: StatusCodes.OK, 
    message: 'Registration OTP sent to your email.', 
    data: null 
  });
};

// রেজিস্ট্রেশন কন্ট্রোলার (FormData ব্যবহার করে)
const registerServiceProvider = async (req: NextRequest) => {
  await dbConnect();
  const formData = await req.formData();

  const otp = formData.get('otp') as string;
  if (!otp) throw new Error('OTP is required for registration.');

  // যদি সার্ভিস প্রোভাইডারের ছবি বা NID থাকে তবে এখানে আপলোড লজিক বসাতে পারেন
  const profilePictureFile = formData.get('profilePicture') as File | null;
  let profilePictureUrl = '';
  
  if (profilePictureFile) {
    const uploadRes = await uploadToCloudinary(
      Buffer.from(await profilePictureFile.arrayBuffer()), 
      'service-provider-docs'
    );
    profilePictureUrl = uploadRes.secure_url;
  }

  const payload: any = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    address: formData.get('address') as string || '',
    profilePicture: profilePictureUrl,
    // অন্যান্য তথ্য যা সার্ভিস প্রোভাইডারের জন্য প্রয়োজন
    category: formData.get('category') as string,
    experience: formData.get('experience') as string,
  };

  const result = await AuthServices.registerServiceProvider(payload, otp);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Service provider registered successfully!',
    data: result,
  });
};

// --- Google Login ---
const googleLoginHandler = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validated = googleLoginValidationSchema.parse(body);
  
  const result = await AuthServices.loginWithGoogle(validated.idToken);

  const { refreshToken, accessToken, ...data } = result;
  
  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully with Google!',
    data: { ...data, accessToken },
  });

  // ✅ 1. Refresh Token Cookie
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  // ✅ 2. Access Token Cookie
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  return response;
};

// ------------------------------------
// --- SERVICE PROVIDER LOGIN ---
// ------------------------------------
const serviceProviderLogin = async (req: NextRequest) => {
  await dbConnect();

  const body = await req.json();
  const validatedData = loginValidationSchema.parse(body);

  const result = await AuthServices.serviceProviderLogin(validatedData);

  const { refreshToken, accessToken, user } = result;

  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service provider logged in successfully!',
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
        serviceProviderInfo: user.serviceProviderInfo,
      },
    },
  });

  // 🍪 Refresh Token Cookie
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  // 🍪 Access Token Cookie
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
    path: '/',
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
  vendorSendRegistrationOtp,
  serviceProviderSendRegistrationOtp,
  registerServiceProvider,
  serviceProviderLogin,
  googleLoginHandler,
  vendorLogin,
  vendorChangePassword,
  vendorSendForgotPasswordOtp,
  vendorVerifyForgotPasswordOtp,
  vendorResetPassword,
};