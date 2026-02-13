import { IBooking } from "./serviceProviderManage.interface";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const bookingSchema = new Schema<IBooking>(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
      default: () => {
        const shortId = uuidv4().replace(/-/g, "").slice(0, 8);
        return `SOID-${shortId}`;
      },
    },
    customer_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service_id: { type: Schema.Types.ObjectId, ref: "Service", required: true, index: true },

    booking_date: { type: Date, required: true, index: true },
    time_slot: { type: String, required: true },
    location_details: { type: String, required: true, trim: true },

    // ✅ NEW: Contact Information Schema
    contact_info: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true }, // Optional
    },

    estimated_cost: { type: Number, required: true, min: 0 },
    final_cost: { type: Number, min: 0 },

    status: {
      type: String,
      enum: ["Pending Confirmation", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending Confirmation",
      required: true,
      index: true,
    },

    estimated_arrival: String,
    service_start_time: Date,
    service_end_time: Date,
    final_hours: Number,

    customer_notes: String,
    provider_notes: String,
    cancellation_reason: String,
    provider_rejection_message: String,
  },
  { timestamps: true }
);

bookingSchema.index({ provider_id: 1, status: 1 });
bookingSchema.index({ customer_id: 1, booking_date: -1 });

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);