import { Types } from 'mongoose';

export interface IFAQ {
  faqID: string;
  category: Types.ObjectId | any; // ✅ MAGIC FIX: TS যেন error না দেয়
  question: string;
  answer: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}