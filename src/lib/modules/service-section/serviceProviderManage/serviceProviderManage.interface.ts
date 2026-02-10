import { Document, Types } from "mongoose";

export interface IBooking extends Document {
  // Core Identifiers
  order_id: string;
  customer_id: Types.ObjectId;
  provider_id: Types.ObjectId;
  service_id: Types.ObjectId;

  // Booking Schedule
  booking_date: Date;
  time_slot: string;

  // Location
  location_details: string;

  // ✅ NEW: Contact Info (For communication)
  contact_info: {
    name: string;
    phone: string;
    email?: string;
  };

  // Cost
  estimated_cost: number;
  final_cost?: number;

  // Status
  status:
    | "Pending Confirmation"
    | "Confirmed"
    | "In Progress"
    | "Completed"
    | "Cancelled";

  // Provider Workflow
  estimated_arrival?: string;
  service_start_time?: Date;
  service_end_time?: Date;
  final_hours?: number;

  // Notes
  customer_notes?: string;
  provider_notes?: string;
  cancellation_reason?: string;
  provider_rejection_message?: string;

  // System
  createdAt: Date;
  updatedAt: Date;
}