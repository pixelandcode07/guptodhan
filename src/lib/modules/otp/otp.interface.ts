import { Document } from 'mongoose';

export interface IOtp extends Document {
  identifier: string; // Can be email or phone
  otp: number;
  type: 'email' | 'phone';
  createdAt: Date;
  expiresAt: Date;
}