
import { z } from 'zod';

export const loginValidationSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

export const changePasswordValidationSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters long.' }),
});

export const refreshTokenValidationSchema = z.object({
    refreshToken: z.string({
        required_error: 'Refresh token is required',
    }),
});

export const setPasswordValidationSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export const sendForgotPasswordOtpToEmailSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address.' }),
});

export const verifyForgotPasswordOtpFromEmailSchema = z.object({
  email: z.email({ message: 'A valid email is required.' }),
  otp: z.string().length(6, { message: 'OTP must be 6 digits long.' }),
});

export const getResetTokenWithFirebaseSchema = z.object({
    idToken: z.string({ required_error: 'Firebase ID token is required.' }),
});

export const resetPasswordWithTokenSchema = z.object({
  token: z.string({ required_error: 'Reset token is required.' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});