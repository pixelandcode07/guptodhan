import { z } from "zod";

export const createServiceCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: "Service category name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  slug: z.string().min(1, { message: "Slug is required." }),
  icon_url: z.string().min(1, { message: "Icon URL is required." }),
  orderCount: z.number().optional(),
  isActive: z.boolean().optional(),
});
export const updateServiceCategoryValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  icon_url: z.string().optional(),
  orderCount: z.number().optional(),
  isActive: z.boolean().optional(),
});
