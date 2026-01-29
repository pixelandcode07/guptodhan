import { z } from "zod";

export const createBookingValidationSchema = z.object({
    // customer_id: z.string().min(1, "Customer ID is required"),
    service_id: z.string().min(1, "Service ID is required"),
    booking_date: z.array(z.string()).min(1, "At least one date is required"),
    time_slot: z.string().min(1, "Time slot is required"),
    location_details: z.string().min(1, "Location details are required"),
    estimated_cost: z.number().min(0),
    customer_notes: z.string().optional(),
});

export type CreateBookingFormValues = z.infer<
    typeof createBookingValidationSchema
>;
