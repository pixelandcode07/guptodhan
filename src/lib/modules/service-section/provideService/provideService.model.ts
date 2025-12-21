import mongoose, { Schema, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ServiceSchema = new Schema(
  {
    // Custom Service ID
    service_id: {
      type: String,
      unique: true,
      default: () => `SID-${uuidv4().replace(/-/g, "").slice(0, 8)}`,
    },

    // Provider Reference
    provider_id: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Service Identity
    service_title: {
      type: String,
      required: true,
      trim: true,
    },

    service_category: {
      type: String,
      required: true,
    },

    service_description: {
      type: String,
    },

    // Pricing
    pricing_type: {
      type: String,
      enum: ["fixed", "hourly"],
      default: "fixed",
    },

    base_price: {
      type: Number,
      required: true,
    },

    minimum_charge: {
      type: Number,
    },

    // Time & Availability
    estimated_duration_hours: {
      type: Number,
    },

    available_time_slots: {
      type: [String], // ["Morning", "Evening"]
    },

    working_days: {
      type: [String], // ["Sunday", "Monday"]
    },

    // Location Coverage
    service_area: {
      city: { type: String },
      district: { type: String },
      thana: { type: String },
    },

    // Provider-Specific Info
    experience_years: {
      type: Number,
    },

    tools_provided: {
      type: Boolean,
      default: false,
    },

    service_images: {
      type: [String],
    },

    // Status & Control
    service_status: {
      type: String,
      enum: ["Draft", "Active", "Under Review", "Disabled"],
      default: "Under Review",
    },

    is_visible_to_customers: {
      type: Boolean,
      default: false,
    },

    // Stats (optional)
    average_rating: {
      type: Number,
      default: 0,
    },

    total_bookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceModel =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);
