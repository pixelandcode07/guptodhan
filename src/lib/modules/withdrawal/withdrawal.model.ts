import { Schema, model, models } from 'mongoose';
import { IWithdrawal } from './withdrawal.interface';

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'StoreModel', required: true },
    amount: { type: Number, required: true, min: 100 }, 
    paymentMethod: { 
      type: String, 
      enum: ['bKash', 'Nagad', 'Rocket', 'Bank'], // ✅ Rocket যোগ করা হয়েছে
      required: true 
    },
    accountDetails: { type: String, required: true }, // স্ন্যাপশট হিসেবে সেভ থাকবে
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    adminRemarks: { type: String },
  },
  { timestamps: true }
);

// Indexes for faster querying
withdrawalSchema.index({ vendorId: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1, createdAt: -1 });

export const WithdrawalModel = models.WithdrawalModel || model<IWithdrawal>('WithdrawalModel', withdrawalSchema);