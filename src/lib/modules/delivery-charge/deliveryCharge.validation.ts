import { z } from 'zod';

// Create Delivery Charge validation
export const createDeliveryChargeValidationSchema = z.object({
  divisionName: z.string().min(1, { message: 'Division name is required.' }),
  districtName: z.string().min(1, { message: 'District name is required.' }),
  districtNameBangla: z.string().min(1, { message: 'District name (Bangla) is required.' }),
  deliveryCharge: z.number().min(0, { message: 'Delivery charge must be a positive number.' }),
});

// Update Delivery Charge validation
export const updateDeliveryChargeValidationSchema = z.object({
  divisionName: z.string().optional(),
  districtName: z.string().optional(),
  districtNameBangla: z.string().optional(),
  deliveryCharge: z.number().min(0).optional(),
});
