import { Document, Types } from 'mongoose';

export interface IFAQ extends Document {
  faqID: string;
  category: Types.ObjectId;
  question: string;
  answer: string;
  isActive: boolean;
}
