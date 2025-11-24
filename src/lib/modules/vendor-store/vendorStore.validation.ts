import { z } from 'zod';

// Define a reusable social links schema
const socialLinksSchema = z.object({
  facebook: z.string().url().optional().nullable(),
  whatsapp: z.string().url().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  linkedIn: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
  tiktok: z.string().url().optional().nullable(),
});

// Create store validation
// export const createStoreValidationSchema = z.object({
//   storeId: z.string().min(1, { message: 'Store ID is required.' }),
//   vendorId: z.string().min(1, { message: 'Vendor ID is required.' }),
//   storeLogo: z.string().min(1, { message: 'Store logo is required.' }),
//   storeBanner: z.string().min(1, { message: 'Store banner is required.' }),
//   storeName: z.string().min(1, { message: 'Store name is required.' }),
//   storeAddress: z.string().min(1, { message: 'Store address is required.' }),
//   storePhone: z.string().min(1, { message: 'Store phone is required.' }),
//   commission: z.number().optional(),
//   storeEmail: z
//     .string()
//     .email({ message: 'Invalid email address.' })
//     .min(1, { message: 'Store email is required.' }),
//   vendorShortDescription: z
//     .string()
//     .min(1, { message: 'Vendor short description is required.' }),
//   fullDescription: z
//     .string()
//     .min(1, { message: 'Full description is required.' }),
//   storeSocialLinks: socialLinksSchema.optional(),
//   storeMetaTitle: z.string().optional(),
//   storeMetaKeywords: z.array(z.string()).optional(),
//   storeMetaDescription: z.string().optional(), 
//   status: z.enum(['active', 'inactive']).optional(),
// });

// vendorStore.validation.ts

export const createStoreValidationSchema = z.object({
  // Remove storeId completely from create!
  // storeId: z.string().min(1, { message: 'Store ID is required.' }),

  vendorId: z.string().min(1, { message: 'Vendor ID is required.' }),

  storeLogo: z.string().url({ message: 'Valid logo URL required' }),
  storeBanner: z.string().url({ message: 'Valid banner URL required' }),

  storeName: z.string().min(1, { message: 'Store name is required.' }).trim(),
  storeAddress: z.string().min(1, { message: 'Store address is required.' }).trim(),
  storePhone: z.string().min(1, { message: 'Store phone is required.' }).trim(),
  storeEmail: z
    .string()
    .email({ message: 'Invalid email address.' })
    .min(1, { message: 'Store email is required.' }),

  vendorShortDescription: z.string().min(1, { message: 'Short description is required.' }),
  fullDescription: z.string().min(1, { message: 'Full description is required.' }),

  commission: z.coerce.number().min(0).max(100).default(0), // auto-convert string → number

  storeSocialLinks: socialLinksSchema.optional(),
  storeMetaTitle: z.string().optional(),
  storeMetaKeywords: z.array(z.string()).optional().default([]),
  storeMetaDescription: z.string().optional(),
});

// Update store validation
// export const updateStoreValidationSchema = z.object({
//   storeId: z.string().optional(),
//   vendorId: z.string().optional(),
//   storeLogo: z.string().optional(),
//   storeBanner: z.string().optional(),
//   storeName: z.string().optional(),
//   storeAddress: z.string().optional(),
//   storePhone: z.string().optional(),
//   storeEmail: z.string().email().optional(),
//   vendorShortDescription: z.string().optional(),
//   fullDescription: z.string().optional(),
//   commission: z.number().min(0).max(100).optional(),
//   storeSocialLinks: socialLinksSchema.optional(),
//   storeMetaTitle: z.string().optional(),
//   storeMetaKeywords: z.array(z.string()).optional(),
//   storeMetaDescription: z.string().optional(),
//   status: z.enum(['active', 'inactive']).optional(),
// });

export const updateStoreValidationSchema = z.object({
  storeId: z.string().optional(),
  vendorId: z.string().optional(),

  storeLogo: z.string().url().optional(),
  storeBanner: z.string().url().optional(),

  storeName: z.string().min(1).optional(),
  storeAddress: z.string().optional(),
  storePhone: z.string().optional(),
  storeEmail: z.string().email().optional(),
  vendorShortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  commission: z.coerce.number().min(0).max(100).optional(),

  storeSocialLinks: socialLinksSchema.optional(),
  storeMetaTitle: z.string().optional(),
  storeMetaKeywords: z.array(z.string()).optional(),
  storeMetaDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
