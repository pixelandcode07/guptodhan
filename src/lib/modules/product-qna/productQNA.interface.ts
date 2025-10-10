import { Document, Types } from 'mongoose';

export interface IProductQA extends Document {
  qaId: string;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userEmail: string;
  userImage?: string;
  question: string;
  createdAt: Date;
  status: 'pending' | 'answered' | 'hidden';
  answer?: {
    answeredByName: string;
    answeredByEmail: string;
    answerText: string;
    createdAt: Date;
  };
}
