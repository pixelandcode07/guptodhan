import { z } from 'zod';

export const updateVendorStatusValidationSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    required_error: 'Status is required.',
  }),
});

// New validation schema for updating vendor details
export const updateVendorValidationSchema = z.object({
  businessName: z.string().min(2).optional(),
  ownerName: z.string().min(2).optional(),
  ownerPhone: z.string().min(11).optional(),
  tradeLicenseNumber: z.string().min(5).optional(),
  businessAddress: z.string().min(5).optional(),
  businessCategory: z.any().optional(), // JSON string
});