import { Document } from 'mongoose';

export interface IOtp extends Document {
  identifier: string; // Can be email or phone
  otp: number | string; // Number for plain, String for hashed
  type: 'email' | 'phone';
  attempts: number; // Track wrong attempts
  maxAttempts: number; // Maximum allowed attempts
  isBlocked: boolean; // Block after max attempts
  createdAt: Date;
  expiresAt: Date;
}