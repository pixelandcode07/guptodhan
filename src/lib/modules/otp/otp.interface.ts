import { Document } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  otp: number;
  createdAt: Date;
  expiresAt: Date;
}