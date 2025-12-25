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


//   {
//   "service_id": "S-3f4a2b1c",               // string: unique service ID, format "S-xxxxxx"
//   "provider_id": "653f2c1f4a1e4a5d12345678", // ObjectId: reference to the provider (user)
//   "phoneNumber": 01712345678,            // number: contact number of the provider
  
//   "service_title": "Home Electrical Wiring Repair", // string: the service name/title
//   "service_category": "Electrician",                // string: category of service
//   "service_description": "Complete home electrical wiring repair and maintenance.", // string: detailed description

//   "pricing_type": "fixed",       // enum: "fixed" or "hourly"
//   "base_price": 1500,            // number: base or starting price
//   "minimum_charge": 500,         // number (optional): minimum charge if applicable
//   "extra_charge_note": "Additional charges may apply for large homes", // string (optional): note about extra charges

//   "estimated_duration_hours": 3, // number: estimated duration in hours
//   "available_time_slots": ["Morning", "Evening"], // array of strings: available time slots
//   "working_days": ["Sunday", "Monday", "Wednesday", "Friday"], // array of strings: days provider works

//   "service_area": {              // object: location coverage
//     "city": "Dhaka",             // string: city
//     "district": "Dhaka District",// string (optional): district
//     "thana": "Mirpur"            // string (optional): thana
//   },

//   "experience_years": 5,                  // number (optional): years of experience
//   "tools_provided": true,                 // boolean: whether provider provides tools
//   "certifications": ["Certified Electrician Level 2"], // array of strings (optional): certifications
//   "service_images": [                     // array of strings (optional): URLs of service images
//     "https://example.com/images/service1.jpg",
//     "https://example.com/images/service2.jpg"
//   ],

//   "service_status": "Active",             // enum: "Draft", "Active", "Under Review", "Disabled" - admin controlled
//   "is_visible_to_customers": true        // boolean: whether service is visible to customers - provider controlled
// }
