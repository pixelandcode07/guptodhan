import { Document, Types } from 'mongoose';

export interface IWithdrawal extends Document {
  vendorId: Types.ObjectId;
  storeId: Types.ObjectId;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank'; // ✅ Rocket যোগ করা হয়েছে
  accountDetails: string; // (সিস্টেম অটোমেটিক স্টোর থেকে নিয়ে এখানে সেভ করবে)
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}