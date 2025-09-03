
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

// ২. ইমেইল থেকে পাওয়া OTP ভেরিফাই করার জন্য ভ্যালিডেশন
export const verifyForgotPasswordOtpFromEmailSchema = z.object({
  email: z.email({ message: 'A valid email is required.' }),
  otp: z.string().length(6, { message: 'OTP must be 6 digits long.' }),
});

// ৩. Firebase idToken দিয়ে ফোন ভেরিফাই করার জন্য ভ্যালিডেশন
export const getResetTokenWithFirebaseSchema = z.object({
    idToken: z.string({ required_error: 'Firebase ID token is required.' }),
});

// ৪.最終 রিসেট টোকেন দিয়ে নতুন পাসওয়ার্ড সেট করার জন্য ভ্যালিডেশন
export const resetPasswordWithTokenSchema = z.object({
  token: z.string({ required_error: 'Reset token is required.' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});