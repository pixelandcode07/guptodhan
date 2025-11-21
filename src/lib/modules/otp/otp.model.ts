import mongoose, { Schema, Document } from "mongoose";
import {IOtp} from "./otp.interface";


const otpSchema = new Schema<IOtp>({
  phone: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);
