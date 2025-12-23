import { Document, Types } from "mongoose";

export interface IService extends Document {
  // Core Identifiers
  service_id: string;                // e.g. S-10023
  provider_id: Types.ObjectId;        // Reference to Provider(User)
  
  // Service Identity
  service_title: string;              // "Home Electrical Wiring Repair"
  service_category: string;           // Electrician / Plumber / HVAC
  service_description: string;

  // Pricing
  pricing_type: "fixed" | "hourly";
  base_price: number;                 // Minimum or starting price
  minimum_charge?: number;
  extra_charge_note?: string;

  // Time & Duration
  estimated_duration_hours: number;   // Used for booking estimate
  available_time_slots: string[];     // ["Morning", "Evening"]
  working_days: string[];             // ["Sunday", "Monday"]

  // Location Coverage
  service_area: {
    city: string;
    district?: string;
    thana?: string;
  };

  // Provider-Specific Details
  experience_years?: number;
  tools_provided: boolean;
  certifications?: string[];
  service_images?: string[];

  // Service Control & Status
  service_status:
    | "Draft"
    | "Active"
    | "Under Review"
    | "Disabled";

  is_visible_to_customers: boolean;

  // Rating & Performance (Optional / Future)
  average_rating?: number;
  total_bookings?: number;

  // System
  createdAt: Date;
  updatedAt: Date;
}
