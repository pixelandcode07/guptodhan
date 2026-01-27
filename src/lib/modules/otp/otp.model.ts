import mongoose, { Schema } from "mongoose";
import { IOtp } from "./otp.interface";

const otpSchema = new Schema<IOtp>({
  identifier: { 
    type: String, 
    required: true,
    index: true // For faster queries
  },
  otp: { 
    type: Number, 
    required: true 
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true // For sorting
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: true // For TTL queries
  },
});

// ✅ Compound index for faster queries
otpSchema.index({ identifier: 1, createdAt: -1 });

// ✅ TTL Index - Automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);