import { z } from "zod";


export const bookingStatusEnum = z.enum([
  "Pending Confirmation",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
]);


export const createBookingValidationSchema = z.object({
  customer_id: z.string().min(1, { message: "Customer ID is required." }),

  service_id: z.string().min(1, { message: "Service ID is required." }),

  booking_date: z.string().min(1, { message: "Booking date is required." }),
  time_slot: z.string().min(1, { message: "Time slot is required." }),

  location_details: z.string().min(1, { message: "Location details are required." }),

  estimated_cost: z.number().min(0, { message: "Estimated cost must be 0 or greater." }),

  customer_notes: z.string().optional(),
});


export const updateBookingValidationSchema = z.object({
  status: bookingStatusEnum.optional(),
  estimated_arrival: z.string().optional(),
  final_cost: z.number().min(0).optional(),
  final_hours: z.number().min(0).optional(),
  provider_notes: z.string().optional(),
  cancellation_reason: z.string().optional(),
});
