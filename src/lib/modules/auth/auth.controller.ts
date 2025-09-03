
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { AuthServices } from './auth.service';
import { sendResponse } from '@/lib/utils/sendResponse';
import { loginValidationSchema, changePasswordValidationSchema, refreshTokenValidationSchema, setPasswordValidationSchema, resetPasswordWithTokenSchema, getResetTokenWithFirebaseSchema, verifyForgotPasswordOtpFromEmailSchema, sendForgotPasswordOtpToEmailSchema } from './auth.validation';
import dbConnect from '@/lib/db';

const loginUser = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = loginValidationSchema.parse(body);
  const result = await AuthServices.loginUser(validatedData);

  const { refreshToken } = result;

  const response = sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully!',
    data: result,
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
};

const refreshToken = async (req: NextRequest) => {
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
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        throw new Error("Authentication failure: User ID not found in token");
    }
    
    const body = await req.json();
    const validatedData = setPasswordValidationSchema.parse(body);

    await AuthServices.setPasswordForSocialLogin(userId, validatedData.newPassword);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Password has been set successfully. You can now log in using your email and password.",
        data: null
    });
};

// --- Forgot Password Controllers ---

const sendForgotPasswordOtpToEmail = async (req: NextRequest) => {
  await dbConnect();
    const body = await req.json();
    const validatedData = sendForgotPasswordOtpToEmailSchema.parse(body);
    await AuthServices.sendForgotPasswordOtpToEmail(validatedData.email);
    
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'A password reset OTP has been sent to your email.',
        data: null,
    });
};

const verifyForgotPasswordOtpFromEmail = async (req: NextRequest) => {
    await dbConnect();
    const body = await req.json();
    const validatedData = verifyForgotPasswordOtpFromEmailSchema.parse(body);
    const result = await AuthServices.verifyForgotPasswordOtpFromEmail(validatedData.email, validatedData.otp);
    
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'OTP verified successfully. Use the token to reset your password.',
        data: result,
    });
};

const getResetTokenWithFirebase = async (req: NextRequest) => {
    const body = await req.json();
    const validatedData = getResetTokenWithFirebaseSchema.parse(body);
    const result = await AuthServices.getResetTokenWithFirebase(validatedData.idToken);

    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Phone verified successfully. Use the token to reset your password.',
        data: result,
    });
};

const resetPasswordWithToken = async (req: NextRequest) => {
    const body = await req.json();
    const validatedData = resetPasswordWithTokenSchema.parse(body);
    await AuthServices.resetPasswordWithToken(validatedData.token, validatedData.newPassword);
    
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Password has been reset successfully!',
        data: null,
    });
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
};