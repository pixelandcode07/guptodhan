import { Document, Types } from 'mongoose';

export interface IFAQ extends Document {
  faqID: string;
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
}
