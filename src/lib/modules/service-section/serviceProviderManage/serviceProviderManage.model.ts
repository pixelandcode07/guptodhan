import { IBooking } from "./serviceProviderManage.interface";
import mongoose, { Schema, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const bookingSchema = new Schema<IBooking>(
  {
    // Core Identifiers
    order_id: {
      type: String,
      required: true,
      unique: true,
      default: () => {
        const shortId = uuidv4().replace(/-/g, "").slice(0, 8);
        return `SOID-${shortId}`;
      },
    },

    // Customer Info (CORE)
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Provider Info (assigned later)
    provider_id: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
    },

    // Service Info (CORE)
    service_id: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // Booking Schedule (CORE)
    booking_date: {
      type: Date,
      required: true,
    },
    time_slot: {
      type: String,
      required: true,
    },

    // Location (CORE)
    location_details: {
      type: String,
      required: true,
      trim: true,
    },

    // Cost & Billing (CORE → estimated)
    estimated_cost: {
      type: Number,
      required: true,
      min: 0,
    },
    final_cost: {
      type: Number,
      min: 0,
    },

    // Status Tracking (CORE)
    status: {
      type: String,
      enum: [
        "Pending Confirmation",
        "Confirmed",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending Confirmation",
      required: true,
    },

    // Provider Workflow (OPTIONAL)
    estimated_arrival: {
      type: String,
    },
    service_start_time: {
      type: Date,
    },
    service_end_time: {
      type: Date,
    },
    final_hours: {
      type: Number,
      min: 0,
    },

    // Notes (OPTIONAL)
    customer_notes: {
      type: String,
      trim: true,
    },
    provider_notes: {
      type: String,
      trim: true,
    },
    cancellation_reason: {
      type: String,
      trim: true,
    },
    provider_rejection_message: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

export const BookingModel =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
