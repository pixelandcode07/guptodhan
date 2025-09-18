import { Document, Types } from 'mongoose';

export interface ITerms extends Document {
  termsId: string;
  category: Types.ObjectId;
  description: string;
  createdAt: Date;
}
