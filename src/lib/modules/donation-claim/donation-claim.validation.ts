import { z } from "zod";

export const createDonationClaimSchema = z.object({
  itemId: z.string().min(1, { message: "Item ID is required" }),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name is too short" }),

  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .min(11, { message: "Invalid phone number" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  reason: z
    .string()
    .min(1, { message: "Reason is required" })
    .min(10, { message: "Reason must be at least 10 characters" }),
});
