import { z } from 'zod';

// ========================================
// 📱 Bangladeshi Phone Number Regex
// ========================================
const bdPhoneNumberRegex = /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/;

// ========================================
// 📤 1. User Registration Initial Step (Send OTP)
// ========================================
export const createUserValidationSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .email({ message: 'Please provide a valid email address.' })
        .optional(),

      phoneNumber: z
        .string()
        .regex(bdPhoneNumberRegex, {
          message: 'Must be a valid Bangladeshi phone number (e.g., 01712345678 or +8801712345678).',
        })
        .optional(),
    })
    .refine((data) => data.email || data.phoneNumber, {
      message: 'Either email or phone number must be provided to send OTP.',
      path: ['email'],
    }),
});

// ========================================
// ✅ 2. Verify OTP & Finalize Account Creation
// ========================================
export const verifyOtpSchema = z.object({
  body: z.object({
    identifier: z
      .string({ required_error: 'Email or phone number is required.' })
      .min(1, { message: 'Identifier cannot be empty.' }),
    
    otp: z
      .string({ required_error: 'OTP is required.' }), // ✅ Fixed: Added comma here
      // .length(6, { message: 'OTP must be 6 digits.' }), 

    userData: z.object({
      name: z
        .string({ required_error: 'Name is required.' })
        .min(1, { message: 'Name cannot be empty.' }),

      email: z
        .string()
        .email({ message: 'Invalid email format.' })
        .optional(),

      phoneNumber: z
        .string()
        .regex(bdPhoneNumberRegex, { message: 'Invalid phone number format.' })
        .optional(),

      password: z
        .string({ required_error: 'Password is required.' })
        .min(6, { message: 'Password must be at least 6 characters long.' }),

      role: z
        .enum(['user', 'vendor', 'admin', 'service-provider'])
        .default('user'),

      address: z.string().optional(),
      
      profilePicture: z.string().url().optional(),
    }).refine((data) => data.email || data.phoneNumber, {
      message: 'UserData must contain either email or phone number.',
      path: ['email'],
    }),
  }),
});

// ========================================
// 📱 Register with Phone Only (Optional / Legacy)
// ========================================
export const registerWithPhoneSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string({ required_error: 'Phone number is required.' })
      .regex(bdPhoneNumberRegex, {
        message: 'Must be a valid Bangladeshi phone number.',
      }),
  }),
});

// ========================================
// 🔐 Set PIN Validation
// ========================================
export const setPinSchema = z.object({
  body: z.object({
    userId: z
      .string({ required_error: 'User ID is required.' })
      .min(1, { message: 'User ID cannot be empty.' }),
    
    pin: z
      .string({ required_error: 'PIN is required.' })
      .length(4, { message: 'PIN must be 4 digits.' })
      .regex(/^\d{4}$/, { message: 'PIN must contain only digits.' }),
  }),
});

// ========================================
// ✏️ Update User Profile (Own Profile)
// ========================================
export const updateUserProfileValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name cannot be empty.' })
      .optional(),

    phoneNumber: z
      .string()
      .regex(bdPhoneNumberRegex, {
        message: 'Must be a valid Bangladeshi phone number.',
      })
      .optional(),

    address: z.string().optional(),

    profilePicture: z
      .string()
      .url({ message: 'Profile picture must be a valid URL.' })
      .optional(),
  }),
});

// ========================================
// 👨‍💼 Update User by Admin
// ========================================
export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    
    email: z.string().email().optional(),
    
    phoneNumber: z
      .string()
      .regex(bdPhoneNumberRegex, {
        message: 'Must be a valid Bangladeshi phone number.',
      })
      .optional(),

    profilePicture: z.string().url().optional(),
    
    address: z.string().optional(),
    
    isActive: z.boolean().optional(),
    
    isVerified: z.boolean().optional(),
    
    role: z
      .enum(['user', 'vendor', 'admin', 'service-provider'])
      .optional(),
  }),
});

// ========================================
// 🛠️ Service Provider Registration
// ========================================
export const registerServiceProviderValidationSchema = z.object({
  name: z
    .string({ required_error: 'Name is required.' })
    .min(1, 'Name cannot be empty.'),

  email: z
    .string({ required_error: 'Email is required.' })
    .email('Invalid email format.'),

  password: z
    .string({ required_error: 'Password is required.' })
    .min(6, 'Password must be at least 6 characters.'),

  phoneNumber: z
    .string({ required_error: 'Phone number is required.' })
    .regex(bdPhoneNumberRegex, 'Invalid Bangladeshi phone number format.'),

  address: z
    .string({ required_error: 'Address is required.' })
    .min(1, 'Address cannot be empty.'),

  serviceCategory: z
    .string({ required_error: 'Service category is required.' })
    .min(1, 'Service category cannot be empty.'),

  subCategories: z
    .array(z.string())
    .optional(),

  profilePicture: z
    .string()
    .url('Invalid URL for profile picture.')
    .optional(),

  cvUrl: z
    .string()
    .url('Invalid URL for CV.')
    .optional(),

  bio: z.string().optional(),
});

// ========================================
// 📤 Export All Validations
// ========================================
export const UserValidations = {
  createUserValidationSchema,
  verifyOtpSchema,
  updateUserValidationSchema,
  updateUserProfileValidationSchema,
  registerServiceProviderValidationSchema,
  registerWithPhoneSchema,
  setPinSchema,
};