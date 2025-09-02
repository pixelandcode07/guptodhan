
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