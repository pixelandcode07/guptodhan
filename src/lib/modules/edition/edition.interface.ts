import { Document, Types } from 'mongoose';

export interface IEdition extends Document {
  name: string;
  productModel: Types.ObjectId; 
  status: 'active' | 'inactive';
}