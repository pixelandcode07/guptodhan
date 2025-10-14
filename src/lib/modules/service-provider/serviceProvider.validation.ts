import { z } from 'zod';

// Bangladeshi phone number Regex
const bdPhoneNumberRegex = /^(\+8801|01)[3-9]\d{8}$/;

export const registerServiceProviderSchema = z.object({
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

export const loginServiceProviderSchema = z.object({
  identifier: z.string().email({ message: 'A valid email is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});
