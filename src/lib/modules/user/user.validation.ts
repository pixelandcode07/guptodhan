
    import { z } from 'zod';

    // const bdPhoneNumberRegex = /^(01[3-9]\d{8})$/;
    const bdPhoneNumberRegex = /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/;


    export const registerWithPhoneSchema = z.object({
      body: z.object({
        phoneNumber: z.string().regex(bdPhoneNumberRegex, {
          message: 'Must be a valid Bangladeshi phone number (e.g., 017... or +88017...).',
        }),
      }),
    });

  export const registerServiceProviderValidationSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).min(1, 'Name cannot be empty.'),
  email: z.string({ required_error: 'Email is required.' }).email('Invalid email format.'),
  password: z.string({ required_error: 'Password is required.' }).min(8, 'Password must be at least 8 characters.'),
  phoneNumber: z.string({ required_error: 'Phone number is required.' }).regex(bdPhoneNumberRegex, 'Invalid Bangladeshi phone number format.'),
  address: z.string({ required_error: 'Address is required.' }).min(1, 'Address cannot be empty.'),
  serviceCategory: z.string({ required_error: 'Service category is required.' }),
  subCategories: z.array(z.string()).min(1, 'At least one skill/sub-category must be selected.'),
  
  profilePicture: z.string().url('Invalid URL for profile picture.').optional(),
  cvUrl: z.string().url('Invalid URL for CV.').optional(),
  bio: z.string().optional(),
  });

    export const verifyOtpSchema = z.object({
      body: z.object({
        phoneNumber: z.string().regex(bdPhoneNumberRegex, {
          message: 'Must be a valid Bangladeshi phone number.',
        }),
        otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
      }),
    });

    export const setPinSchema = z.object({
      body: z.object({
        userId: z.string().min(1, { message: 'User ID is required' }),
        pin: z.string().length(4, { message: 'PIN must be 4 digits' }),
      }),
    });






    export const createUserValidationSchema = z.object({
      body: z.object({
        name: z
          .string()
          .min(1, { message: 'Name is required and cannot be empty.' }).optional(),

        email: z
          .email({ message: 'Please provide a valid email address.' }).optional(),

        password: z
          .string()
          .min(8, { message: 'Password must be at least 8 characters long.' }).optional(),

        phoneNumber: z
          .string()
          .regex(bdPhoneNumberRegex, {
            message: 'Must be a valid Bangladeshi phone number (e.g., 017... or +88017...).'
          }),

        profilePicture: z
          .string()
          .url({ message: 'Profile picture must be a valid URL.' }).optional(),

        address: z
          .string()
          .min(1, { message: 'Address is required and cannot be empty.' }).optional(),

        role: z
          .enum(['user', 'vendor', 'admin', 'service-provider'])
          .default('user'),
      }).refine(data => data.email || data.phoneNumber, {
        message: "Either email or phone number must be provided.",
        path: ["email"], 
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

    export const updateUserProfileValidationSchema = z.object({
      body: z.object({
        name: z.string().min(1, { message: 'Name cannot be empty.' }).optional(),
        phoneNumber: z.string().regex(bdPhoneNumberRegex, {
          message: 'Must be a valid Bangladeshi phone number.'
        }).optional(),
        address: z.string().min(1, { message: 'Address cannot be empty.' }).optional(),
        profilePicture: z.string().url({ message: 'Profile picture must be a valid URL.' }).optional(),
      }),
    });


    export const UserValidations = {
      createUserValidationSchema,
      updateUserValidationSchema,
      updateUserProfileValidationSchema,
      registerServiceProviderValidationSchema,
      registerWithPhoneSchema,
      verifyOtpSchema,
      setPinSchema,

    };
