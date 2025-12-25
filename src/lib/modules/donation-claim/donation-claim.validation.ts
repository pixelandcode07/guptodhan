// ✅ src/lib/modules/donation-claim/donation-claim.validation.ts

import { z } from 'zod'

export const createDonationClaimSchema = z.object({
  itemId: z.string()
    .min(1, 'Item ID is required')
    .refine((val) => /^[a-f\d]{24}$/i.test(val), {
      message: 'Invalid item ID format'
    }),
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone must be less than 15 characters')
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
      message: 'Invalid phone number format'
    }),
  email: z.string()
    .email('Invalid email address'),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(1000, 'Reason must be less than 1000 characters'),
})

export type CreateDonationClaimInput = z.infer<typeof createDonationClaimSchema>