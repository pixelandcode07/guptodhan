import { z } from 'zod';

// Create
export const createDeviceConditionValidationSchema = z.object({
  deviceCondition: z.string().min(1, { message: 'Device condition is required.' }),
});

// Update 
export const updateDeviceConditionValidationSchema = z.object({
  deviceCondition: z.string().optional(),
});
