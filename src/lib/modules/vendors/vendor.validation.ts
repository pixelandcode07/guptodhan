import { z } from 'zod';

// Validation for updating vendor status
export const updateVendorStatusValidationSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    message: 'Status is required and must be either pending, approved, or rejected.',
  }),
});

// Vendor registration validation
export const registerVendorValidationSchema = z.object({
  businessName: z.string().min(2, "Business Name is required"),
  ownerName: z.string().min(2, "Owner Name is required"),
  tradeLicenseNumber: z.string().min(5, "Trade License Number is required"),
  businessAddress: z.string().min(5, "Business Address is required"),
  businessCategory: z.array(z.string()).nonempty("At least one category is required"), // ✅ array
  ownerNidUrl: z.string().url("Owner NID URL is required"),
  tradeLicenseUrl: z.string().url("Trade License URL is required"),
});



// Validation for updating vendor details
export const updateVendorValidationSchema = z.object({
  businessName: z.string().min(2, { message: 'Business name must be at least 2 characters.' }).optional(),
  ownerName: z.string().min(2, { message: 'Owner name must be at least 2 characters.' }).optional(),
  ownerPhone: z.string().min(11, { message: 'Owner phone must be at least 11 characters.' }).optional(),
  tradeLicenseNumber: z.string().min(5, { message: 'Trade license number must be at least 5 characters.' }).optional(),
  businessAddress: z.string().min(5, { message: 'Business address must be at least 5 characters.' }).optional(),
  businessCategory: z.any().optional(), // Can be a JSON string or object
  // storeName: z.string().min(2, { message: 'Store name is required and must be at least 2 characters.' }),
});
