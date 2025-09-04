
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

// ভেন্ডর রেজিস্ট্রেশনের জন্য চূড়ান্ত ভ্যালিডেশন স্কিমা
export const registerVendorValidationSchema = z.object({
  // ইউজার তথ্য
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.email({ message: 'A valid email is required.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  
  // ভেন্ডরের ব্যবসার তথ্য
  businessName: z.string().min(1, { message: 'Business name is required.' }),
  businessCategory: z.string().min(1, { message: 'Business category is required.' }),
  tradeLicenseNumber: z.string().min(1, { message: 'Trade license number is required.' }),
  businessAddress: z.string().min(1, { message: 'Business address is required.' }),
  ownerName: z.string().min(1, { message: 'Owner name is required.' }),
  
  // Cloudinary থেকে পাওয়া URL দুটি এখানে ভ্যালিডেট করা হবে
  ownerNidUrl: z.string().url({ message: 'A valid NID card image URL is required.' }),
  tradeLicenseUrl: z.string().url({ message: 'A valid trade license image URL is required.' }),
});

// সার্ভিস প্রোভাইডার রেজিস্ট্রেশনের জন্য
export const registerServiceProviderValidationSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  phoneNumber: z.string(),
  address: z.string(),
  // সার্ভিস প্রোভাইডারের অতিরিক্ত তথ্য
  bio: z.string().optional(),
  skills: z.array(z.string()).min(1),
});