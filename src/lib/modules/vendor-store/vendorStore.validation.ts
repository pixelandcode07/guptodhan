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

const paymentInfoSchema = z.object({
  bkash: z.string().optional().nullable(),
  nagad: z.string().optional().nullable(),
  rocket: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  bankAccount: z.string().optional().nullable(),
  bankBranch: z.string().optional().nullable(),
});

export const createStoreValidationSchema = z.object({

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
  availableBalance: z.coerce.number().min(0).optional(),
  totalEarned: z.coerce.number().min(0).optional(),
  totalWithdrawn: z.coerce.number().min(0).optional(),
  paymentInfo: paymentInfoSchema.optional(),

  storeSocialLinks: socialLinksSchema.optional(),
  storeMetaTitle: z.string().optional(),
  storeMetaKeywords: z.array(z.string()).optional(),
  storeMetaDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
