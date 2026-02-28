import { z } from 'zod';

export const createWithdrawalSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  storeId: z.string().min(1, 'Store ID is required'),
  amount: z.number().min(100, 'Minimum withdrawal amount is 100'),
  paymentMethod: z.enum(['bKash', 'Nagad', 'Rocket', 'Bank']), // ✅ Rocket
  accountDetails: z.string().min(5, 'Account details are required'),
});

export const updateWithdrawalStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  adminRemarks: z.string().optional(),
});