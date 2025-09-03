
import { z } from 'zod';

const bdPhoneNumberRegex = /^(01[3-9]\d{8})$/;

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required and cannot be empty.' }),
    
    email: z
      .email({ message: 'Please provide a valid email address.' }),
    
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    
    phoneNumber: z
      .string()
      .regex(bdPhoneNumberRegex, {
        message: 'Must be a valid 11-digit Bangladeshi phone number (e.g., 017...).'
      }),
    
    profilePicture: z
      .string()
      .url({ message: 'Profile picture must be a valid URL.' })
      .optional(), 
      
    address: z
      .string()
      .min(1, { message: 'Address is required and cannot be empty.' }),
      
    role: z
      .enum(['user', 'vendor', 'admin'])
      .default('user'),
  }),
});


export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().regex(bdPhoneNumberRegex, {
      message: 'Must be a valid Bangladeshi phone number.'
    }).optional(),
    profilePicture: z.string().url().optional(),
    address: z.string().optional(),
    isActive: z.boolean().optional(),
    role: z.enum(['user', 'vendor', 'admin']).optional(), // 'auth' এর পরিবর্তে 'role'
  }),
});



export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,

};
