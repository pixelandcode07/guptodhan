import { Document, Types } from "mongoose";

export interface IBooking extends Document {
  // Core Identifiers
  order_id: string;

  // Customer Info
  customer_id: Types.ObjectId;
  customer_name: string;

  // Provider Info
  provider_id: Types.ObjectId;
  provider_name?: string;

  // Service Info
  service_id: Types.ObjectId;
  service_name: string;

  // Booking Schedule
  booking_date: Date;
  time_slot: string;

  // Location
  location_details: string;

  // Cost & Billing
  estimated_cost: number;
  final_cost?: number;

  // Status Tracking
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

  // System
  createdAt: Date;
  updatedAt: Date;
}
