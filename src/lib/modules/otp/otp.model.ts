import mongoose, { Schema } from "mongoose";
import { IOtp } from "./otp.interface";

const otpSchema = new Schema<IOtp>({
  identifier: { 
    type: String, 
    required: true,
    index: true 
  },
  otp: { 
    type: Schema.Types.Mixed, // Can be Number or String (hashed)
    required: true 
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  // ✅ Security Features
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: true 
  },
});

// ✅ Compound index for faster queries
otpSchema.index({ identifier: 1, createdAt: -1 });
otpSchema.index({ identifier: 1, isBlocked: 1 });

// ✅ TTL Index - Automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);