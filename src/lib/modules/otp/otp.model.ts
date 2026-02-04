import mongoose, { Schema } from "mongoose";
import { IOtp } from "./otp.interface";

const otpSchema = new Schema<IOtp>({
  identifier: { 
    type: String, 
    required: true
    // ✅ NO index: true here - covered by compound indexes
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
    default: Date.now
    // ✅ NO index: true here - covered by compound indexes
  },
  expiresAt: { 
    type: Date, 
    required: true
    // ✅ IMPORTANT: NO regular index here - only TTL index below
  },
});

// ===================================
// 🎯 DATABASE INDEXES (NO DUPLICATES)
// ===================================

/**
 * INDEX STRATEGY:
 * - identifier + createdAt: Compound index for OTP lookups
 * - identifier + isBlocked: Compound index for blocked OTP checks
 * - expiresAt: TTL index ONLY (removes expired docs automatically)
 * 
 * ⚠️ IMPORTANT: TTL index should be the ONLY index on expiresAt
 */

// ✅ COMPOUND INDEXES

// 1️⃣ OTP Verification - Find OTP by identifier + sort by date
otpSchema.index({ 
  identifier: 1,     // Equality: which OTP
  createdAt: -1      // Sort: newest first
});

// 2️⃣ Security Check - Is OTP blocked
otpSchema.index({ 
  identifier: 1,     // Equality: which identifier
  isBlocked: 1       // Equality: blocked status
});

// ✅ TTL INDEX - Auto-delete expired OTPs
// This is the ONLY index that should exist on expiresAt
otpSchema.index(
  { expiresAt: 1 }, 
  { expireAfterSeconds: 0 }  // Delete immediately when expiresAt time is reached
);

// ===================================
// 📊 INDEX SUMMARY
// ===================================
/*
TOTAL INDEXES: 3 (Clean & Optimized)

Compound Indexes (2):
  1. { identifier: 1, createdAt: -1 } - OTP lookup with sorting
  2. { identifier: 1, isBlocked: 1 } - Security check

TTL Index (1):
  3. { expiresAt: 1 } with expireAfterSeconds: 0

BENEFITS:
✅ NO DUPLICATES - Removed redundant field indexes
✅ AUTO-CLEANUP - TTL index deletes expired OTPs automatically
✅ SECURITY - Fast blocked OTP checks
✅ PERFORMANCE - Compound indexes cover all queries

QUERY COVERAGE:
- Find OTP by identifier ✅ (Index 1)
- Check if blocked ✅ (Index 2)
- Auto-expire OTPs ✅ (TTL Index 3)

HOW TTL WORKS:
- MongoDB runs a background job every 60 seconds
- Automatically deletes documents where expiresAt < now()
- No manual cleanup needed
- No performance impact on queries
*/

export const OtpModel =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);