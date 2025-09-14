import { z } from 'zod';

// Create store validation
export const createStoreValidationSchema = z.object({
  storeId: z.string().min(1, { message: 'Store ID is required.' }),
  storeLogo: z.string().min(1, { message: 'Store logo is required.' }),
  storeBanner: z.string().min(1, { message: 'Store banner is required.' }),
  storeName: z.string().min(1, { message: 'Store name is required.' }),
  storeAddress: z.string().min(1, { message: 'Store address is required.' }),
  storePhone: z.string().min(1, { message: 'Store phone is required.' }),
  storeEmail: z
    .string()
    .email({ message: 'Invalid email address.' })
    .min(1, { message: 'Store email is required.' }),
  vendorShortDescription: z
    .string()
    .min(1, { message: 'Vendor short description is required.' }),
  fullDescription: z
    .string()
    .min(1, { message: 'Full description is required.' }),
  storeSocialLink: z.string().url().optional(),
  storeMetaTitle: z.string().optional(),
  storeMetaKeywords: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update store validation
export const updateStoreValidationSchema = z.object({
  storeId: z.string().optional(),
  storeLogo: z.string().optional(),
  storeBanner: z.string().optional(),
  storeName: z.string().optional(),
  storeAddress: z.string().optional(),
  storePhone: z.string().optional(),
  storeEmail: z.string().email().optional(),
  vendorShortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  storeSocialLink: z.string().url().optional(),
  storeMetaTitle: z.string().optional(),
  storeMetaKeywords: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
