import { z } from "zod";

const serviceBaseSchema = {
  service_title: z.string().min(3),
  service_category: z.string().min(2),
  service_description: z.string().optional(),

  pricing_type: z.enum(["fixed", "hourly"]).optional(),
  base_price: z.number().positive(),
  minimum_charge: z.number().positive().optional(),

  estimated_duration_hours: z.number().positive().optional(),
  available_time_slots: z.array(z.string()).optional(),
  working_days: z.array(z.string()).optional(),

  service_area: z.object({
    city: z.string().min(2),
    district: z.string().optional(),
    thana: z.string().optional(),
  }).optional(),

  experience_years: z.number().nonnegative().optional(),
  tools_provided: z.boolean().optional(),
  service_images: z.array(z.string().url()).optional(),
};
export const createServiceValidationSchema = z.object({
  provider_id: z.string().min(1),

  ...serviceBaseSchema,
});
export const updateServiceValidationSchema = z
  .object({
    ...serviceBaseSchema,
  })
  .partial();
