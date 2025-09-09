import { z } from 'zod';

// Create StorageType validation
export const createStorageTypeValidationSchema = z.object({
  storageTypeId: z.string({ required_error: 'StorageType ID is required.' }),
  ram: z.string().min(1, { message: 'RAM value is required.' }),
  rom: z.string().min(1, { message: 'ROM value is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update StorageType validation
export const updateStorageTypeValidationSchema = z.object({
  storageTypeId: z.string().optional(),
  ram: z.string().optional(),
  rom: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
