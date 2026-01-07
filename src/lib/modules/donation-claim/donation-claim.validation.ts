import z from "zod";

export const createDonationClaimSchema = z.object({
  itemId: z.string().min(1, 'Campaign ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  reason: z.string().min(20, 'Reason must be at least 20 characters'),
});